"use strict";

const LEVELS = [
    {
        title: { en: "First strokes", ru: "Первые удары" },
        instruction: {
            en: "Listen carefully, then repeat the three-beat pattern.",
            ru: "Внимательно послушай и повтори ритм из трёх ударов."
        },
        pattern: ["bum", "bak", "bum"],
        score: 300,
        fact: {
            en: "BUM and BAK are common teaching syllables for contrasting doira sounds. Exact terminology can vary between teachers and schools.",
            ru: "«Бум» и «бак» — распространённые учебные слоги для контрастных звуков доиры. Термины могут различаться у разных педагогов и школ."
        }
    },
    {
        title: { en: "Steady pulse", ru: "Ровный пульс" },
        instruction: {
            en: "Keep an even pulse while changing from centre to rim.",
            ru: "Сохраняй ровный пульс, переходя от центра к краю."
        },
        pattern: ["bum", "bum", "bak", "bak"],
        score: 700,
        fact: {
            en: "The doira player does more than keep time: rhythm can support melody, dance, ceremony, and ensemble communication.",
            ru: "Доирист не просто держит темп: ритм поддерживает мелодию, танец, обряд и взаимодействие внутри ансамбля."
        }
    },
    {
        title: { en: "Call and response", ru: "Вопрос и ответ" },
        instruction: {
            en: "Remember the alternating phrase and answer it accurately.",
            ru: "Запомни чередующуюся фразу и точно повтори её."
        },
        pattern: ["bak", "bum", "bak", "bum", "bak"],
        score: 1200,
        fact: {
            en: "Metal rings suspended inside the frame add a shimmering sound when the instrument is struck, tilted, or moved.",
            ru: "Металлические кольца внутри обода добавляют звенящий шлейф, когда по инструменту ударяют, наклоняют его или двигают."
        }
    },
    {
        title: { en: "Usul builder", ru: "Создатель усуля" },
        instruction: {
            en: "Follow the six-beat cycle without rushing the double BAK.",
            ru: "Повтори цикл из шести ударов, не ускоряя двойной «бак»."
        },
        pattern: ["bum", "bak", "bak", "bum", "bak", "bum"],
        score: 1800,
        fact: {
            en: "Usul is a recurring rhythmic pattern or organising cycle. Different strokes make its structure audible.",
            ru: "Усуль — повторяющийся ритмический рисунок или организующий цикл. Разные удары делают его структуру слышимой."
        }
    },
    {
        title: { en: "Doira master", ru: "Мастер доиры" },
        instruction: {
            en: "Complete the final seven-beat pattern and earn the master rank.",
            ru: "Повтори финальный ритм из семи ударов и получи звание мастера."
        },
        pattern: ["bak", "bum", "bum", "bak", "bak", "bum", "bak"],
        score: 2500,
        fact: {
            en: "The doira can accompany songs and dances, lead an ensemble, or become a virtuosic solo instrument on the concert stage.",
            ru: "Доира может сопровождать песни и танцы, вести ансамбль или становиться виртуозным сольным инструментом на концертной сцене."
        }
    }
];

const SKINS = {
    classic: { image: "doira.png", unlockLevel: 0 },
    ancient: { image: "doira_ancient.png", unlockLevel: 2 },
    gold: { image: "doira_gold.png", unlockLevel: 4 }
};

const TRANSLATIONS = {
    en: {
        backToChat: "Back to chat",
        signOut: "Sign out",
        eyebrow: "LISTEN · REMEMBER · PLAY",
        title: "Learn the language of doira rhythm.",
        subtitle: "Listen to a short pattern, then repeat it by striking the centre for BUM and the rim for BAK.",
        score: "Score",
        level: "Level",
        rank: "Rank",
        centreKey: "centre",
        rimKey: "rim",
        listen: "Listen to pattern",
        restart: "Restart level",
        next: "Next level",
        playAgain: "Play again",
        miniLesson: "MINI LESSON",
        twoSounds: "Two contrasting sounds",
        bumDescription: "A fuller low sound played nearer the centre.",
        bakDescription: "A sharper sound played closer to the rim.",
        factTitle: "DID YOU KNOW?",
        collectionEyebrow: "YOUR COLLECTION",
        collectionTitle: "Choose your doira",
        classicName: "Classic",
        classicUnlock: "Available now",
        ancientName: "Emerald Heritage",
        ancientUnlock: "Complete level 2",
        goldName: "Golden Master",
        goldUnlock: "Complete level 4",
        beginner: "Beginner",
        apprentice: "Apprentice",
        performer: "Performer",
        master: "Master",
        ready: "Press “Listen to pattern”, then repeat it on the doira.",
        listening: "Listen carefully…",
        yourTurn: "Your turn — repeat the pattern.",
        correctBeat: "Correct. Keep the pulse steady.",
        wrongBeat: "Not quite. Listen again and restart the pattern.",
        levelComplete: "Excellent! Level complete and progress saved.",
        gameComplete: "Outstanding! You completed the Rhythm Journey and unlocked the master rank.",
        skinLocked: "Complete more levels to unlock this doira.",
        skinSelected: "Doira selected.",
        loadError: "The game could not be loaded. Please return to the chat and try again.",
        saveError: "Progress could not be saved, but you may continue playing.",
        levelWord: "LEVEL",
        points: "points"
    },
    ru: {
        backToChat: "Вернуться в чат",
        signOut: "Выйти",
        eyebrow: "СЛУШАЙ · ЗАПОМИНАЙ · ИГРАЙ",
        title: "Изучи язык ритма доиры.",
        subtitle: "Послушай короткий рисунок, а затем повтори его: ударь по центру для БУМ и по краю для БАК.",
        score: "Очки",
        level: "Уровень",
        rank: "Ранг",
        centreKey: "центр",
        rimKey: "край",
        listen: "Послушать ритм",
        restart: "Начать уровень заново",
        next: "Следующий уровень",
        playAgain: "Сыграть ещё раз",
        miniLesson: "МИНИ-УРОК",
        twoSounds: "Два контрастных звука",
        bumDescription: "Более полный низкий звук ближе к центру.",
        bakDescription: "Более резкий звук ближе к краю.",
        factTitle: "ЗНАЕШЬ ЛИ ТЫ?",
        collectionEyebrow: "ТВОЯ КОЛЛЕКЦИЯ",
        collectionTitle: "Выбери свою доиру",
        classicName: "Классическая",
        classicUnlock: "Доступна сразу",
        ancientName: "Изумрудное наследие",
        ancientUnlock: "Пройди 2-й уровень",
        goldName: "Золотой мастер",
        goldUnlock: "Пройди 4-й уровень",
        beginner: "Новичок",
        apprentice: "Ученик",
        performer: "Исполнитель",
        master: "Мастер",
        ready: "Нажми «Послушать ритм», затем повтори его на доире.",
        listening: "Слушай внимательно…",
        yourTurn: "Теперь твоя очередь — повтори ритм.",
        correctBeat: "Верно. Сохраняй ровный пульс.",
        wrongBeat: "Не совсем. Послушай ещё раз и начни рисунок заново.",
        levelComplete: "Отлично! Уровень пройден, прогресс сохранён.",
        gameComplete: "Превосходно! Ты завершил ритмическое путешествие и получил ранг мастера.",
        skinLocked: "Пройди больше уровней, чтобы открыть эту доиру.",
        skinSelected: "Доира выбрана.",
        loadError: "Не удалось загрузить игру. Вернись в чат и попробуй снова.",
        saveError: "Не удалось сохранить прогресс, но ты можешь продолжить игру.",
        levelWord: "УРОВЕНЬ",
        points: "очков"
    }
};

const gameState = {
    username: "",
    language: localStorage.getItem("doiraGameLanguage") === "ru" ? "ru" : "en",
    levelIndex: 0,
    input: [],
    demoPlaying: false,
    levelComplete: false,
    progress: {
        bestScore: 0,
        completedLevels: 0,
        unlockedSkins: ["classic"],
        selectedSkin: "classic"
    }
};

function t(key) {
    return TRANSLATIONS[gameState.language][key] || key;
}

async function apiRequest(path, options = {}) {
    const response = await fetch(path, {
        credentials: "same-origin",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    let payload = {};

    try {
        payload = await response.json();
    } catch {
        payload = {};
    }

    if (!response.ok) {
        const error = new Error(payload.error || "Request failed");
        error.status = response.status;
        throw error;
    }

    return payload;
}

const GAME_PROGRESS_KEY = "danielDoiraGameProgress";

function getGameProgressKey() {
    const username =
        localStorage.getItem("danielDoiraCurrentUser") || "guest";

    return `${GAME_PROGRESS_KEY}:${username.toLowerCase()}`;
}

function createDefaultGameProgress() {
    return {
        bestScore: 0,
        completedLevels: 0,
        unlockedSkins: ["classic"],
        selectedSkin: "classic"
    };
}

function loadGameProgress() {
    try {
        const saved = localStorage.getItem(getGameProgressKey());

        if (!saved) {
            return createDefaultGameProgress();
        }

        const progress = JSON.parse(saved);

        return {
            bestScore: Number(progress.bestScore) || 0,
            completedLevels: Math.max(
                0,
                Math.min(LEVELS.length, Number(progress.completedLevels) || 0)
            ),
            unlockedSkins: Array.isArray(progress.unlockedSkins)
                ? progress.unlockedSkins
                : ["classic"],
            selectedSkin: progress.selectedSkin || "classic"
        };
    } catch (error) {
        console.error("Could not load game progress:", error);
        return createDefaultGameProgress();
    }
}

function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function getRank() {
    const completed = gameState.progress.completedLevels;

    if (completed >= 5) {
        return t("master");
    }

    if (completed >= 3) {
        return t("performer");
    }

    if (completed >= 1) {
        return t("apprentice");
    }

    return t("beginner");
}

function applyTranslations() {
    document.documentElement.lang = gameState.language;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        element.textContent = t(key);
    });

    document.getElementById("languageToggle").textContent =
        gameState.language === "en" ? "RU" : "EN";
    document.getElementById("rankValue").textContent = getRank();
    renderLevel();
    renderCollection();
}

function renderPattern() {
    const container = document.getElementById("patternDisplay");
    const level = LEVELS[gameState.levelIndex];

    container.replaceChildren();
    level.pattern.forEach((beat, index) => {
        const token = document.createElement("span");
        token.className = `pattern-token ${beat}`;
        token.dataset.index = String(index);
        token.dataset.beat = beat;
        token.textContent = index < gameState.input.length
            ? beat.toUpperCase()
            : "•";

        if (index < gameState.input.length) {
            token.classList.add("completed");
        }

        container.appendChild(token);
    });
}

function renderLevel() {
    const level = LEVELS[gameState.levelIndex];
    const completedPercent = Math.round(
        (gameState.progress.completedLevels / LEVELS.length) * 100
    );

    document.getElementById("levelEyebrow").textContent =
        `${t("levelWord")} ${gameState.levelIndex + 1}`;
    document.getElementById("levelTitle").textContent =
        level.title[gameState.language];
    document.getElementById("levelInstruction").textContent =
        level.instruction[gameState.language];
    document.getElementById("levelReward").textContent =
        `+${level.score - (gameState.levelIndex ? LEVELS[gameState.levelIndex - 1].score : 0)} ${t("points")}`;
    document.getElementById("levelFact").textContent =
        level.fact[gameState.language];
    document.getElementById("scoreValue").textContent =
        String(gameState.progress.bestScore);
    document.getElementById("levelValue").textContent =
        `${gameState.levelIndex + 1} / ${LEVELS.length}`;
    document.getElementById("rankValue").textContent = getRank();
    document.getElementById("levelProgressFill").style.width =
        `${completedPercent}%`;

    const nextButton = document.getElementById("nextLevelButton");
    nextButton.textContent = gameState.levelIndex === LEVELS.length - 1
        ? t("playAgain")
        : t("next");

    renderPattern();
}

function renderCollection() {
    const unlocked = new Set(gameState.progress.unlockedSkins);
    document.getElementById("collectionCount").textContent =
        `${unlocked.size} / ${Object.keys(SKINS).length}`;

    document.querySelectorAll(".skin-option").forEach((button) => {
        const skinName = button.dataset.skin;
        const isUnlocked = unlocked.has(skinName);
        const isSelected = gameState.progress.selectedSkin === skinName;
        const lockIcon = button.querySelector(".skin-lock");

        button.disabled = !isUnlocked;
        button.classList.toggle("locked", !isUnlocked);
        button.classList.toggle("selected", isSelected);
        lockIcon.textContent = isUnlocked ? (isSelected ? "✓" : "") : "🔒";
    });

    const selected = SKINS[gameState.progress.selectedSkin] || SKINS.classic;
    document.getElementById("gameDoiraImage").src = selected.image;
}

function setFeedback(message, type = "") {
    const element = document.getElementById("gameFeedback");
    element.textContent = message;
    element.className = "game-feedback";

    if (type) {
        element.classList.add(type);
    }
}

function setGameDisabled(disabled) {
    document.getElementById("bumZone").disabled = disabled;
    document.getElementById("bakZone").disabled = disabled;
    document.getElementById("listenButton").disabled = disabled;
    document.getElementById("restartLevelButton").disabled = disabled;
}

function createDrumSound(type) {
    const sound = new Audio("drum.mp3");
    sound.preload = "auto";
    sound.volume = type === "bum" ? 0.95 : 0.72;
    sound.playbackRate = type === "bum" ? 0.78 : 1.22;
    return sound;
}

async function playBeat(type, patternIndex = null) {
    const stage = document.getElementById("doiraStage");
    const image = document.getElementById("gameDoiraImage");
    const token = patternIndex === null
        ? null
        : document.querySelector(`.pattern-token[data-index="${patternIndex}"]`);

    stage.classList.remove("hit-bum", "hit-bak");
    image.classList.remove("doira-hit");
    void stage.offsetWidth;
    stage.classList.add(type === "bum" ? "hit-bum" : "hit-bak");
    image.classList.add("doira-hit");
    if (token) {
        token.textContent = type.toUpperCase();
        token.classList.add("active");
    }

    try {
        await createDrumSound(type).play();
    } catch {
        // Browsers may block audio before the first user interaction.
    }

    window.setTimeout(() => {
        stage.classList.remove("hit-bum", "hit-bak");
        image.classList.remove("doira-hit");
        if (token) {
            token.classList.remove("active");
            if (!token.classList.contains("completed")) {
                token.textContent = "•";
            }
        }
    }, 240);
}

async function listenToPattern() {
    if (gameState.demoPlaying) {
        return;
    }

    gameState.demoPlaying = true;
    gameState.levelComplete = false;
    gameState.input = [];
    renderPattern();
    document.getElementById("nextLevelButton").classList.add("hidden");
    setGameDisabled(true);
    setFeedback(t("listening"), "listening");

    const pattern = LEVELS[gameState.levelIndex].pattern;

    await wait(350);
    for (let index = 0; index < pattern.length; index += 1) {
        await playBeat(pattern[index], index);
        await wait(570);
    }

    gameState.demoPlaying = false;
    setGameDisabled(false);
    setFeedback(t("yourTurn"), "ready");
}

async function saveProgress() {
    try {
        localStorage.setItem(
            getGameProgressKey(),
            JSON.stringify(gameState.progress)
        );

        renderCollection();
    } catch (error) {
        console.error("Could not save game progress:", error);
        setFeedback(t("saveError"), "warning");
    }
}
function unlockSkins() {
    const unlocked = new Set(gameState.progress.unlockedSkins);
    unlocked.add("classic");

    if (gameState.progress.completedLevels >= 2) {
        unlocked.add("ancient");
    }

    if (gameState.progress.completedLevels >= 4) {
        unlocked.add("gold");
    }

    gameState.progress.unlockedSkins = [...unlocked];
}

async function completeLevel() {
    const levelNumber = gameState.levelIndex + 1;
    const level = LEVELS[gameState.levelIndex];

    gameState.levelComplete = true;
    gameState.progress.bestScore = Math.max(
        gameState.progress.bestScore,
        level.score
    );
    gameState.progress.completedLevels = Math.max(
        gameState.progress.completedLevels,
        levelNumber
    );
    unlockSkins();

    renderLevel();
    renderCollection();
    document.getElementById("nextLevelButton").classList.remove("hidden");
    setFeedback(
        levelNumber === LEVELS.length ? t("gameComplete") : t("levelComplete"),
        "success"
    );
    await saveProgress();
}

async function registerHit(type) {
    if (gameState.demoPlaying || gameState.levelComplete) {
        return;
    }

    const level = LEVELS[gameState.levelIndex];
    const expected = level.pattern[gameState.input.length];
    await playBeat(type);

    if (type !== expected) {
        gameState.input = [];
        renderPattern();
        document.getElementById("doiraStage").classList.add("wrong-hit");
        window.setTimeout(() => {
            document.getElementById("doiraStage").classList.remove("wrong-hit");
        }, 420);
        setFeedback(t("wrongBeat"), "error");
        return;
    }

    gameState.input.push(type);
    renderPattern();

    if (gameState.input.length === level.pattern.length) {
        await completeLevel();
        return;
    }

    setFeedback(t("correctBeat"), "ready");
}

function restartLevel() {
    if (gameState.demoPlaying) {
        return;
    }

    gameState.input = [];
    gameState.levelComplete = false;
    document.getElementById("nextLevelButton").classList.add("hidden");
    renderPattern();
    setFeedback(t("ready"), "ready");
}

function nextLevel() {
    if (!gameState.levelComplete) {
        return;
    }

    gameState.levelIndex = gameState.levelIndex >= LEVELS.length - 1
        ? 0
        : gameState.levelIndex + 1;
    restartLevel();
    renderLevel();
}

async function selectSkin(skinName) {
    if (!gameState.progress.unlockedSkins.includes(skinName)) {
        setFeedback(t("skinLocked"), "warning");
        return;
    }

    gameState.progress.selectedSkin = skinName;
    renderCollection();
    setFeedback(t("skinSelected"), "success");
    await saveProgress();
}

function bindEvents() {
    document.getElementById("listenButton").addEventListener("click", listenToPattern);
    document.getElementById("restartLevelButton").addEventListener("click", restartLevel);
    document.getElementById("nextLevelButton").addEventListener("click", nextLevel);
    document.getElementById("bumZone").addEventListener("click", () => registerHit("bum"));
    document.getElementById("bakZone").addEventListener("click", () => registerHit("bak"));

    document.querySelectorAll(".skin-option").forEach((button) => {
        button.addEventListener("click", () => selectSkin(button.dataset.skin));
    });

    document.getElementById("languageToggle").addEventListener("click", () => {
        gameState.language = gameState.language === "en" ? "ru" : "en";
        localStorage.setItem("doiraGameLanguage", gameState.language);
        applyTranslations();
        setFeedback(t("ready"), "ready");
    });

    document.getElementById("gameLogoutButton").addEventListener("click", () => {
        localStorage.removeItem("danielDoiraCurrentUser");
        window.location.href = "/login.html";
    });

    window.addEventListener("keydown", (event) => {
        const key = event.key.toLocaleLowerCase();

        if (key === "b") {
            event.preventDefault();
            registerHit("bum");
        } else if (key === "k") {
            event.preventDefault();
            registerHit("bak");
        }
    });
}

function initGame() {
    const username = localStorage.getItem("danielDoiraCurrentUser");

    if (!username) {
        window.location.href = "/login.html";
        return;
    }

    try {
        gameState.username = username;
        gameState.progress = loadGameProgress();

        unlockSkins();

        gameState.levelIndex =
            gameState.progress.completedLevels >= LEVELS.length
                ? 0
                : gameState.progress.completedLevels;

        localStorage.setItem(
            getGameProgressKey(),
            JSON.stringify(gameState.progress)
        );
    } catch (error) {
        console.error("Could not initialise game:", error);

        document.querySelector(".game-shell").innerHTML =
            `<p class="game-load-error">${t("loadError")}</p>`;

        return;
    }

    document.getElementById("gameUsername").textContent =
        gameState.username;

    bindEvents();
    applyTranslations();
    setFeedback(t("ready"), "ready");
}

document.addEventListener("DOMContentLoaded", initGame);
