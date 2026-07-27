"use strict";

const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIRECTORY = __dirname;
const USERS_FILE = process.env.USERS_FILE
    ? path.resolve(process.env.USERS_FILE)
    : path.join(ROOT_DIRECTORY, "user.txt");
const SESSION_COOKIE = "doira_session";
const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_HISTORY_MESSAGES = 80;
const MAX_GAME_LEVELS = 5;
const MAX_GAME_SCORE = 2500;

const sessions = new Map();

const STATIC_FILES = new Set([
    "login.html",
    "index.html",
    "style.css",
    "script.js",
    "game.html",
    "game.js",
    "daniel.png",
    "doira.png",
    "doira_ancient.png",
    "doira_gold.png",
    "drum.mp3"
]);

const CONTENT_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".mp3": "audio/mpeg"
};

function createEmptyDatabase() {
    return {
        version: 2,
        users: {}
    };
}

function readDatabase() {
    if (!fs.existsSync(USERS_FILE)) {
        return createEmptyDatabase();
    }

    const content = fs.readFileSync(USERS_FILE, "utf8").trim();

    if (!content) {
        return createEmptyDatabase();
    }

    const database = JSON.parse(content);

    if (
        !database ||
        typeof database !== "object" ||
        !database.users ||
        typeof database.users !== "object"
    ) {
        throw new Error("user.txt has an invalid structure");
    }

    return database;
}

function writeDatabase(database) {
    database.version = 2;
    fs.writeFileSync(USERS_FILE, JSON.stringify(database, null, 2), "utf8");
}

function normaliseUsername(username) {
    return username
        .normalize("NFKC")
        .trim()
        .replace(/\s+/g, " ");
}

function getUserId(username) {
    return normaliseUsername(username).toLocaleLowerCase("en");
}

function validateCredentials(usernameValue, passwordValue) {
    const username =
        typeof usernameValue === "string"
            ? normaliseUsername(usernameValue)
            : "";
    const password =
        typeof passwordValue === "string"
            ? passwordValue
            : "";

    if (username.length < 3 || username.length > 25) {
        return {
            error: "Username must contain 3 to 25 characters."
        };
    }

    if (!/^[\p{L}\p{N}_ -]+$/u.test(username)) {
        return {
            error:
                "Username may contain letters, numbers, spaces, underscores, and hyphens."
        };
    }

    if (password.length < 6 || password.length > 128) {
        return {
            error: "Password must contain 6 to 128 characters."
        };
    }

    return { username, password };
}

function createPasswordRecord(password) {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(password, salt, 64);

    return {
        passwordSalt: salt.toString("base64"),
        passwordHash: hash.toString("base64")
    };
}

function passwordMatches(password, user) {
    if (!user?.passwordSalt || !user?.passwordHash) {
        return false;
    }

    const salt = Buffer.from(user.passwordSalt, "base64");
    const savedHash = Buffer.from(user.passwordHash, "base64");
    const suppliedHash = crypto.scryptSync(password, salt, savedHash.length);

    return (
        savedHash.length === suppliedHash.length &&
        crypto.timingSafeEqual(savedHash, suppliedHash)
    );
}

function sanitiseHistory(historyValue) {
    if (!Array.isArray(historyValue)) {
        return [];
    }

    return historyValue
        .map((item) => ({
            role:
                item?.role === "user" || item?.messageClass === "user-message"
                    ? "user"
                    : "assistant",
            text: String(item?.text || "").trim().slice(0, 2000),
            timestamp: Number.isFinite(Number(item?.timestamp))
                ? Number(item.timestamp)
                : Date.now()
        }))
        .filter((item) => item.text)
        .slice(-MAX_HISTORY_MESSAGES);
}

function getUserHistory(user) {
    if (Array.isArray(user?.chatHistory)) {
        return sanitiseHistory(user.chatHistory);
    }

    // Migrate saved conversations from the previous account schema.
    return sanitiseHistory(user?.profile?.chatHistory);
}

function createDefaultGameProgress() {
    return {
        bestScore: 0,
        completedLevels: 0,
        unlockedSkins: ["classic"],
        selectedSkin: "classic"
    };
}

function sanitiseGameProgress(progressValue) {
    const source = progressValue && typeof progressValue === "object"
        ? progressValue
        : {};
    const completedLevels = Math.max(
        0,
        Math.min(MAX_GAME_LEVELS, Math.trunc(Number(source.completedLevels) || 0))
    );
    const bestScore = Math.max(
        0,
        Math.min(MAX_GAME_SCORE, Math.trunc(Number(source.bestScore) || 0))
    );
    const unlockedSkins = new Set(["classic"]);

    if (completedLevels >= 2) {
        unlockedSkins.add("ancient");
    }

    if (completedLevels >= 4) {
        unlockedSkins.add("gold");
    }

    const selectedSkin = unlockedSkins.has(source.selectedSkin)
        ? source.selectedSkin
        : "classic";

    return {
        bestScore,
        completedLevels,
        unlockedSkins: [...unlockedSkins],
        selectedSkin
    };
}

function getUserGameProgress(user) {
    if (user?.gameProgress) {
        return sanitiseGameProgress(user.gameProgress);
    }

    // Preserve compatible progress from the previous profile schema.
    const legacy = user?.profile || {};
    const legacySelected = legacy.currentDoira === "doira_gold.png"
        ? "gold"
        : legacy.currentDoira === "doira_ancient.png"
            ? "ancient"
            : "classic";
    const completedLevels = legacy.goldUnlocked
        ? 4
        : legacy.ancientUnlocked
            ? 2
            : 0;

    return sanitiseGameProgress({
        bestScore: Number(legacy.score) || 0,
        completedLevels,
        unlockedSkins: [
            "classic",
            ...(legacy.ancientUnlocked ? ["ancient"] : []),
            ...(legacy.goldUnlocked ? ["gold"] : [])
        ],
        selectedSkin: legacySelected
    });
}

function parseCookies(request) {
    const cookies = {};

    for (const part of (request.headers.cookie || "").split(";")) {
        const separator = part.indexOf("=");

        if (separator < 0) {
            continue;
        }

        cookies[part.slice(0, separator).trim()] = part
            .slice(separator + 1)
            .trim();
    }

    return cookies;
}

function getSession(request) {
    const token = parseCookies(request)[SESSION_COOKIE];

    if (!token) {
        return null;
    }

    const session = sessions.get(token);

    if (!session || session.expiresAt <= Date.now()) {
        sessions.delete(token);
        return null;
    }

    return { token, ...session };
}

function createSession(response, userId) {
    const token = crypto.randomBytes(32).toString("hex");

    sessions.set(token, {
        userId,
        expiresAt: Date.now() + SESSION_LIFETIME_MS
    });

    response.setHeader(
        "Set-Cookie",
        `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`
    );
}

function clearSession(request, response) {
    const session = getSession(request);

    if (session) {
        sessions.delete(session.token);
    }

    response.setHeader(
        "Set-Cookie",
        `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
    );
}

function getAuthenticatedUser(request, database) {
    const session = getSession(request);
    const user = session ? database.users[session.userId] : null;

    if (!session || !user) {
        if (session) {
            sessions.delete(session.token);
        }

        return null;
    }

    return { session, user };
}

function sendJson(response, statusCode, payload) {
    const body = JSON.stringify(payload);

    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(body),
        "Cache-Control": "no-store"
    });
    response.end(body);
}

function redirect(response, location) {
    response.writeHead(302, {
        Location: location,
        "Cache-Control": "no-store"
    });
    response.end();
}

function readJsonBody(request) {
    return new Promise((resolve, reject) => {
        let body = "";

        request.setEncoding("utf8");
        request.on("data", (chunk) => {
            body += chunk;

            if (body.length > 1_000_000) {
                reject(new Error("Request is too large"));
                request.destroy();
            }
        });
        request.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });
        request.on("error", reject);
    });
}

async function handleApi(request, response, pathname) {
    const database = readDatabase();

    if (pathname === "/api/register" && request.method === "POST") {
        const body = await readJsonBody(request);
        const credentials = validateCredentials(body.username, body.password);

        if (credentials.error) {
            sendJson(response, 400, { error: credentials.error });
            return;
        }

        const userId = getUserId(credentials.username);

        if (database.users[userId]) {
            sendJson(response, 409, {
                error: "An account with this username already exists."
            });
            return;
        }

        database.users[userId] = {
            username: credentials.username,
            ...createPasswordRecord(credentials.password),
            chatHistory: [],
            gameProgress: createDefaultGameProgress(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        writeDatabase(database);
        createSession(response, userId);
        sendJson(response, 201, {
            username: credentials.username,
            chatHistory: [],
            gameProgress: createDefaultGameProgress()
        });
        return;
    }

    if (pathname === "/api/login" && request.method === "POST") {
        const body = await readJsonBody(request);
        const credentials = validateCredentials(body.username, body.password);

        if (credentials.error) {
            sendJson(response, 400, { error: credentials.error });
            return;
        }

        const userId = getUserId(credentials.username);
        const user = database.users[userId];

        if (!user || !passwordMatches(credentials.password, user)) {
            sendJson(response, 401, {
                error: "Incorrect username or password."
            });
            return;
        }

        createSession(response, userId);
        sendJson(response, 200, {
            username: user.username,
            chatHistory: getUserHistory(user),
            gameProgress: getUserGameProgress(user)
        });
        return;
    }

    if (pathname === "/api/logout" && request.method === "POST") {
        clearSession(request, response);
        sendJson(response, 200, { success: true });
        return;
    }

    if (pathname === "/api/session" && request.method === "GET") {
        const authenticated = getAuthenticatedUser(request, database);

        if (!authenticated) {
            sendJson(response, 401, {
                error: "Authentication required."
            });
            return;
        }

        sendJson(response, 200, {
            username: authenticated.user.username,
            chatHistory: getUserHistory(authenticated.user),
            gameProgress: getUserGameProgress(authenticated.user)
        });
        return;
    }

    if (pathname === "/api/history" && request.method === "PUT") {
        const authenticated = getAuthenticatedUser(request, database);

        if (!authenticated) {
            sendJson(response, 401, {
                error: "Authentication required."
            });
            return;
        }

        const body = await readJsonBody(request);
        authenticated.user.chatHistory = sanitiseHistory(body.chatHistory);
        authenticated.user.gameProgress = getUserGameProgress(authenticated.user);

        // Complete the account migration after the conversation is saved.
        delete authenticated.user.profile;
        authenticated.user.updatedAt = new Date().toISOString();
        writeDatabase(database);

        sendJson(response, 200, {
            success: true,
            chatHistory: authenticated.user.chatHistory
        });
        return;
    }

    if (pathname === "/api/game-progress" && request.method === "GET") {
        const authenticated = getAuthenticatedUser(request, database);

        if (!authenticated) {
            sendJson(response, 401, {
                error: "Authentication required."
            });
            return;
        }

        const gameProgress = getUserGameProgress(authenticated.user);
        authenticated.user.gameProgress = gameProgress;
        authenticated.user.updatedAt = new Date().toISOString();
        writeDatabase(database);

        sendJson(response, 200, { gameProgress });
        return;
    }

    if (pathname === "/api/game-progress" && request.method === "PUT") {
        const authenticated = getAuthenticatedUser(request, database);

        if (!authenticated) {
            sendJson(response, 401, {
                error: "Authentication required."
            });
            return;
        }

        const body = await readJsonBody(request);
        const current = getUserGameProgress(authenticated.user);
        const requested = sanitiseGameProgress(body);
        const completedLevels = Math.max(
            current.completedLevels,
            requested.completedLevels
        );
        const bestScore = Math.max(current.bestScore, requested.bestScore);
        const merged = sanitiseGameProgress({
            bestScore,
            completedLevels,
            unlockedSkins: [
                ...current.unlockedSkins,
                ...requested.unlockedSkins
            ],
            selectedSkin: requested.selectedSkin
        });

        authenticated.user.gameProgress = merged;
        delete authenticated.user.profile;
        authenticated.user.updatedAt = new Date().toISOString();
        writeDatabase(database);

        sendJson(response, 200, {
            success: true,
            gameProgress: merged
        });
        return;
    }

    sendJson(response, 404, {
        error: "API route not found."
    });
}

function serveStatic(request, response, pathname) {
    const session = getSession(request);
    let fileName;

    if (pathname === "/") {
        fileName = session ? "index.html" : "login.html";
    } else {
        fileName = pathname.slice(1);
    }

    if (fileName.includes("/") || !STATIC_FILES.has(fileName)) {
        response.writeHead(404);
        response.end("Not found");
        return;
    }

    if ((fileName === "index.html" || fileName === "game.html") && !session) {
        redirect(response, "/login.html");
        return;
    }

    if (fileName === "login.html" && session) {
        redirect(response, "/index.html");
        return;
    }

    const filePath = path.join(ROOT_DIRECTORY, fileName);

    if (!fs.existsSync(filePath)) {
        response.writeHead(404);
        response.end("Not found");
        return;
    }

    const extension = path.extname(fileName);
    const content = fs.readFileSync(filePath);

    response.writeHead(200, {
        "Content-Type":
            CONTENT_TYPES[extension] || "application/octet-stream",
        "Content-Length": content.length,
        "Cache-Control":
            extension === ".html" ||
            extension === ".js" ||
            extension === ".css"
                ? "no-store"
                : "public, max-age=3600"
    });
    response.end(content);
}

const server = http.createServer(async (request, response) => {
    try {
        const url = new URL(
            request.url,
            `http://${request.headers.host || "localhost"}`
        );

        if (url.pathname.startsWith("/api/")) {
            await handleApi(request, response, url.pathname);
            return;
        }

        if (request.method !== "GET") {
            response.writeHead(405);
            response.end("Method not allowed");
            return;
        }

        serveStatic(request, response, url.pathname);
    } catch (error) {
        console.error(error);

        if (!response.headersSent) {
            sendJson(response, 500, {
                error: "Server error. Check user.txt and try again."
            });
        } else {
            response.end();
        }
    }
});

if (
    !fs.existsSync(USERS_FILE) ||
    !fs.readFileSync(USERS_FILE, "utf8").trim()
) {
    writeDatabase(createEmptyDatabase());
}

server.listen(PORT, HOST, () => {
    console.log(`Daniel Doira Guide is running at http://${HOST}:${PORT}`);
});
