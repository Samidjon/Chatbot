"use strict";

const state = {
    username: "",
    chatHistory: [],
    replyPending: false,
    lastIntent: null,
    quiz: null
};

const MAX_HISTORY_MESSAGES = 80;
const DOIRA_IMAGE_PATH = "doira.png";
const DOIRA_SOUND_URL = "https://www.youtube.com/watch?v=yYUPi4CyIsY";
const GAME_PAGE_PATH = "game.html";

const QUIZ_QUESTIONS = {
    en: [
        {
            question: "What family of instruments does the doira belong to?",
            options: ["Frame drums", "String instruments", "Wind instruments", "Keyboard instruments"],
            answer: 0,
            explanation: "The doira is a single-headed frame drum."
        },
        {
            question: "What is stretched over the wooden frame?",
            options: ["Metal strings", "Wooden keys", "A membrane", "A reed"],
            answer: 2,
            explanation: "The membrane is the main vibrating surface that produces the drum sound."
        },
        {
            question: "What is commonly suspended inside the doira frame?",
            options: ["Bells on a rope", "Metal rings", "Guitar strings", "Wooden blocks"],
            answer: 1,
            explanation: "Small metal rings create the characteristic shimmering sound."
        },
        {
            question: "Which pair is often used to describe contrasting doira strokes?",
            options: ["Do and re", "Ping and pong", "Ta and ka only", "Bum and bak"],
            answer: 3,
            explanation: "Bum usually describes a lower tone, while bak describes a sharper, higher tone."
        },
        {
            question: "What does the word usul refer to?",
            options: ["A recurring rhythmic pattern", "A type of wood", "A tuning machine", "A dance costume"],
            answer: 0,
            explanation: "Usul is a recurring rhythmic pattern or organising cycle."
        },
        {
            question: "How is the doira normally played?",
            options: ["With a violin bow", "With foot pedals", "With the hands and fingers", "By blowing into it"],
            answer: 2,
            explanation: "Players use their hands and fingers for low, high, muted, and ornamental strokes."
        },
        {
            question: "Where can the doira be heard?",
            options: ["Only in orchestras", "Songs, dances, celebrations, concerts, and ensembles", "Only in museums", "Only during sports events"],
            answer: 1,
            explanation: "The doira is used in many social, ceremonial, folk, classical, and stage settings."
        },
        {
            question: "What is a good way to care for a skin-headed doira?",
            options: ["Wash the membrane with water", "Leave it in a hot car", "Store heavy objects on it", "Keep it dry and away from strong heat"],
            answer: 3,
            explanation: "Heat, moisture, and pressure can damage the membrane and frame."
        }
    ],
    ru: [
        {
            question: "К какому семейству инструментов относится доира?",
            options: ["К рамочным барабанам", "К струнным инструментам", "К духовым инструментам", "К клавишным инструментам"],
            answer: 0,
            explanation: "Доира — односторонний рамочный барабан."
        },
        {
            question: "Что натягивают на деревянный обод доиры?",
            options: ["Металлические струны", "Деревянные клавиши", "Мембрану", "Трость"],
            answer: 2,
            explanation: "Мембрана — главная вибрирующая поверхность, создающая барабанный звук."
        },
        {
            question: "Что обычно подвешивают внутри обода доиры?",
            options: ["Колокольчики на верёвке", "Металлические кольца", "Гитарные струны", "Деревянные бруски"],
            answer: 1,
            explanation: "Маленькие металлические кольца создают характерный звенящий шлейф."
        },
        {
            question: "Какая пара часто описывает контрастные удары на доире?",
            options: ["До и ре", "Пинг и понг", "Только та и ка", "Бум и бак"],
            answer: 3,
            explanation: "«Бум» обычно обозначает более низкий звук, а «бак» — высокий и резкий."
        },
        {
            question: "Что означает слово «усуль»?",
            options: ["Повторяющийся ритмический рисунок", "Породу дерева", "Механизм настройки", "Танцевальный костюм"],
            answer: 0,
            explanation: "Усуль — повторяющийся ритмический рисунок или организующий цикл."
        },
        {
            question: "Как обычно играют на доире?",
            options: ["Смычком", "Ножными педалями", "Руками и пальцами", "Дуя в инструмент"],
            answer: 2,
            explanation: "Исполнитель использует ладони и пальцы для низких, высоких, приглушённых и украшающих ударов."
        },
        {
            question: "Где можно услышать доиру?",
            options: ["Только в оркестрах", "В песнях, танцах, на праздниках, концертах и в ансамблях", "Только в музеях", "Только на спортивных событиях"],
            answer: 1,
            explanation: "Доира используется в бытовой, обрядовой, народной, классической и сценической музыке."
        },
        {
            question: "Как правильно ухаживать за доирой с кожаной мембраной?",
            options: ["Мыть мембрану водой", "Оставлять в горячей машине", "Класть на неё тяжёлые предметы", "Хранить в сухом месте вдали от сильного нагрева"],
            answer: 3,
            explanation: "Сильный нагрев, влага и давление могут повредить мембрану и обод."
        }
    ]
};

const FACTS = {
    en: [
        "A museum example from Andijan has an acacia-wood frame, a cow-skin head, and many metal rings suspended inside the frame.",
        "Doira playing is both a solo art and an ensemble practice: the instrument can lead a rhythmic performance or accompany singers, dancers, and other instruments.",
        "The doira belongs to the frame-drum family. Related frame drums appear across Central Asia and neighbouring regions, although their construction and techniques are not identical.",
        "Uzbek doira performers use contrasting low and high strokes, often described as bum and bak, to shape rhythmic patterns.",
        "Doira traditions are maintained by women and men, professional performers, craftspeople, teachers, and community ensembles."
    ],
    ru: [
        "Один из музейных образцов из Андижана имеет обод из акации, мембрану из коровьей кожи и множество металлических колец внутри рамы.",
        "Игра на доире бывает сольной и ансамблевой: инструмент может вести ритм или сопровождать певцов, танцоров и другие инструменты.",
        "Доира относится к семейству рамочных барабанов. Родственные инструменты встречаются по всей Центральной Азии и в соседних регионах, но их устройство и техника не полностью совпадают.",
        "Исполнители противопоставляют низкие и высокие удары, часто называемые «бум» и «бак», и из них строят ритмические рисунки.",
        "Традицию доиры поддерживают женщины и мужчины — исполнители, мастера, преподаватели и участники народных ансамблей."
    ]
};

const ANSWERS = {
    greeting: {
        en: (name) =>
            `Hello, ${name}! I’m Daniel, your guide to the doira. Ask me about its history, construction, sounds, playing technique, performers, or cultural role.`,
        ru: (name) =>
            `Привет, ${name}! Я Дэниел, твой гид по доире. Спроси меня об истории, устройстве, звучании, технике игры, исполнителях или культурной роли инструмента.`
    },
    identity: {
        en: () =>
            "I’m Daniel — think of me as a friendly museum guide who is especially fond of the Uzbek doira. I can chat in English or Russian, and if I don’t know something reliably, I’ll say so rather than invent an answer.",
        ru: () =>
            "Я Дэниел — представь меня как дружелюбного музейного гида, который особенно любит узбекскую доиру. Я говорю по-русски и по-английски, а если не знаю чего-то наверняка, честно скажу об этом и не стану придумывать."
    },
    capabilities: {
        en: () =>
            "I can explain what the doira is, its names and history, how it is built, how its membrane and rings produce sound, basic strokes, usul, performance settings, notable performers, care, beginner practice, and differences from a tambourine. I can also start a quiz or open the interactive Rhythm Journey game. You may write in English or Russian.",
        ru: () =>
            "Я могу рассказать, что такое доира, объяснить её названия и историю, устройство, работу мембраны и колец, базовые удары, понятие усуля, исполнительские традиции, имена мастеров, уход, первые упражнения и отличие от тамбурина. Ещё я могу запустить квиз или открыть обучающую игру «Ритмическое путешествие». Пиши на русском или английском."
    },
    definition: {
        en: () =>
            "The doira (also written doyra) is a single-headed frame drum strongly associated with Uzbek and wider Central Asian music. A membrane is fixed over a circular wooden frame, and small metal rings or jingles are commonly suspended inside it. The player uses the hands and fingers to combine drum tones with the shimmer of the rings.",
        ru: () =>
            "Доира (также пишут «дойра», по-английски doira или doyra) — односторонний рамочный барабан, особенно связанный с узбекской и шире центральноазиатской музыкой. На круглый деревянный обод натягивают мембрану, а внутри обычно подвешивают маленькие металлические кольца. Исполнитель сочетает удары ладонями и пальцами со звоном колец."
    },
    classification: {
        en: () =>
            "Organologically, the doira is a membranophone: its main drum sound comes from a stretched membrane. More specifically, it is a single-skin frame drum. Its metal rings add an idiophonic jingle, but that does not turn the whole instrument into a purely idiophonic instrument.",
        ru: () =>
            "По органологической классификации доира — мембранофон: основной барабанный звук создаёт натянутая мембрана. Точнее, это односторонний рамочный барабан. Металлические кольца добавляют идиофонный звон, но сам инструмент от этого не становится чистым идиофоном."
    },
    names: {
        en: () =>
            "Doira and doyra are common Latin spellings of the Uzbek name doira. You may also meet regional names such as daira, daf, dap, or chirmanda for related frame drums. These words can overlap in everyday use, but they should not always be treated as names for one identical instrument: local construction, repertoire, and technique vary.",
        ru: () =>
            "«Доира» и «дойра» — варианты передачи узбекского названия doira. У родственных рамочных барабанов встречаются названия дайра, даф, дап, чирманда и другие. В быту значения могут пересекаться, но считать все эти инструменты полностью одинаковыми нельзя: различаются устройство, репертуар и местная техника."
    },
    history: {
        en: () =>
            "Frame drums have a long history in Central Asia, and the doira tradition has developed over many generations. Images of frame-drum players are known from ancient regional material culture, but it is safer to speak of ancestors and related instruments than to claim that every ancient image shows the modern Uzbek doira. In the twentieth century, stage performance and formal teaching expanded alongside community and ceremonial practice.",
        ru: () =>
            "У рамочных барабанов долгая история в Центральной Азии, а традиция доиры развивалась на протяжении многих поколений. Из древней материальной культуры региона известны изображения музыкантов с рамочными барабанами, но корректнее говорить о предшественниках и родственных инструментах, а не называть любое такое изображение современной узбекской доирой. В XX веке усилились сценическое исполнительство и систематическое обучение, сохранив при этом бытовую и обрядовую практику."
    },
    construction: {
        en: () =>
            "A doira has three main sound-making parts: a shallow circular wooden frame, one membrane fixed over a side of the frame, and metal rings or jingles hung on the inside. Traditional heads are made from prepared animal skin; modern instruments may use synthetic material. Woods and exact dimensions vary by maker. Documented Uzbek examples are often roughly 40–51 cm across, but that is a typical range, not a rule for every doira.",
        ru: () =>
            "У доиры три главные звукообразующие части: неглубокий круглый деревянный обод, закреплённая с одной стороны мембрана и подвешенные внутри металлические кольца или бубенцы. Традиционные мембраны делают из обработанной кожи, а современные могут быть синтетическими. Породы дерева и размеры зависят от мастера. У описанных узбекских инструментов диаметр часто находится примерно в диапазоне 40–51 см, но это типичный диапазон, а не обязательный стандарт."
    },
    membrane: {
        en: () =>
            "The membrane is the doira’s main resonating surface. A strike makes it vibrate and move the surrounding air. Near the centre, the motion can support a fuller low tone; near the rim, shorter and stiffer vibration tends to sound sharper. Skin heads react noticeably to heat and humidity, while synthetic heads are usually more stable.",
        ru: () =>
            "Мембрана — основная звучащая поверхность доиры. После удара она колеблется и приводит в движение воздух. Ближе к центру обычно получается более полный низкий тон, а у края — более короткий и резкий. Кожаная мембрана заметно реагирует на температуру и влажность, синтетическая обычно стабильнее."
    },
    rings: {
        en: () =>
            "The small metal rings suspended inside the frame collide and vibrate when the doira is struck, tilted, or shaken. They add a sustained metallic shimmer around the shorter membrane strokes. A performer can control that texture through angle, acceleration, damping, and the force of each movement.",
        ru: () =>
            "Маленькие металлические кольца внутри обода сталкиваются и колеблются, когда по доире ударяют, наклоняют её или встряхивают. Они добавляют продолжительный металлический шлейф к коротким звукам мембраны. Исполнитель управляет этой краской углом инструмента, ускорением движения, приглушением и силой удара."
    },
    appearance: {
        en: () =>
            "A doira usually looks like a shallow round wooden frame with a membrane stretched over one side. Small metal rings are suspended inside the frame. Here is a picture so you can see its shape and details.",
        ru: () =>
            "Доира обычно выглядит как неглубокий круглый деревянный обод с мембраной, натянутой с одной стороны. Внутри обода подвешены маленькие металлические кольца. Вот фотография, чтобы ты мог увидеть её форму и детали."
    },
    soundDemo: {
        en: () =>
            "The doira combines deep centre strokes, sharper edge strokes, finger rolls, muted tones, and the metallic shimmer of its rings. Use the button below to hear a performance example on YouTube.",
        ru: () =>
            "Звучание доиры сочетает глубокие удары ближе к центру, резкие краевые удары, пальцевые дроби, приглушённые звуки и металлический шлейф колец. Нажми кнопку ниже, чтобы послушать пример исполнения на YouTube."
    },
    sounds: {
        en: () =>
            "The doira offers several contrasting colours: a rounded low stroke nearer the centre, a sharper edge stroke, lighter fingertip articulations, rolls, muted sounds, and the ring shimmer. Uzbek teaching often describes a low bum and a higher bak, although pronunciation and detailed stroke systems can vary between teachers and schools.",
        ru: () =>
            "У доиры много контрастных красок: округлый низкий удар ближе к центру, более высокий и резкий звук у края, лёгкие пальцевые штрихи, дроби, приглушённые звуки и шлейф колец. В узбекской традиции часто говорят о низком «бум» и высоком «бак», хотя произношение и подробная система ударов могут различаться у разных школ и педагогов."
    },
    technique: {
        en: () =>
            "The doira is normally held in the hands with the membrane facing outward or slightly angled. Both hands can strike, tap, roll, mute, and help balance or move the frame. Skilled playing comes from relaxed wrists, economical finger motion, clear contrast between tone areas, and precise control of the rings—not simply from hitting harder.",
        ru: () =>
            "Доиру обычно держат в руках мембраной наружу или под небольшим углом. Обе руки могут ударять, выполнять лёгкие штрихи и дроби, приглушать звук, удерживать и двигать обод. Мастерство строится на свободных кистях, экономных движениях пальцев, ясном различии тембров и точном контроле колец, а не просто на силе удара."
    },
    beginner: {
        en: () =>
            "A safe first exercise: sit comfortably, keep the shoulders and wrists loose, and support the frame without squeezing it. Alternate one gentle low stroke and one clear edge stroke very slowly: bum–bak, bum–bak. Aim for even timing and two distinct sounds. Practise in short sessions; stop if the fingers or wrist hurt, and learn hand position from an experienced teacher when possible.",
        ru: () =>
            "Безопасное первое упражнение: сядь удобно, расслабь плечи и кисти, держи обод без сильного сжатия. Очень медленно чередуй мягкий низкий и ясный краевой удар: «бум–бак, бум–бак». Следи за ровным временем и различием двух звуков. Занимайся короткими подходами; при боли в пальцах или кисти остановись, а постановку рук по возможности изучай с опытным педагогом."
    },
    usul: {
        en: () =>
            "Usul is a recurring rhythmic pattern or organising cycle in Central Asian music. On the doira, different low, high, open, muted, and ornamental strokes make that pattern audible. Usul is more than a fast drum beat: it shapes musical time, supports melody and dance, and can signal the character of a piece.",
        ru: () =>
            "Усуль — повторяющийся ритмический рисунок или организующий цикл в центральноазиатской музыке. На доире его проявляют сочетанием низких, высоких, открытых, приглушённых и украшающих ударов. Усуль — не просто быстрый барабанный бой: он организует музыкальное время, поддерживает мелодию и танец и помогает раскрыть характер произведения."
    },
    notation: {
        en: () =>
            "There is no single universal notation used by every doira school. Teachers may use standard staff notation, syllables such as bum and bak, hand symbols, or their own stroke marks. When reading a pattern, first confirm the teacher’s legend: the same letter or symbol may describe a different hand, tone, or articulation elsewhere.",
        ru: () =>
            "Единой универсальной записи для всех школ доиры нет. Педагоги могут использовать обычные ноты, слоги вроде «бум» и «бак», обозначения рук или собственные знаки ударов. Перед разбором рисунка важно уточнить легенду: один и тот же символ в другой школе может означать иную руку, тембр или артикуляцию."
    },
    performance: {
        en: () =>
            "The doira is heard in folk and classical traditions, maqom-related performance, song and dance accompaniment, weddings, celebrations, concerts, and doira ensembles. It can keep a shared pulse, articulate a recognised usul, interact with dancers, colour an ensemble, or take a virtuosic solo role.",
        ru: () =>
            "Доиру можно услышать в народной и классической традиции, в исполнении, связанном с макомом, в сопровождении песен и танцев, на свадьбах, праздниках, концертах и в ансамблях доирачей. Она может держать общий пульс, проводить узнаваемый усуль, взаимодействовать с танцором, окрашивать ансамбль или выступать как виртуозный сольный инструмент."
    },
    culture: {
        en: () =>
            "In Uzbekistan, the doira links rhythm with song, dance, ceremony, and social gathering. Its importance is not only the object itself but the living knowledge around it: instrument making, named strokes and rhythms, listening, ensemble etiquette, teaching lineages, and shared performance by women and men.",
        ru: () =>
            "В Узбекистане доира связывает ритм с песней, танцем, обрядом и общением. Её ценность заключена не только в самом предмете, но и в живом знании вокруг него: ремесле мастеров, названиях ударов и ритмов, умении слушать ансамбль, исполнительском этикете, преемственности педагогов и совместной игре женщин и мужчин."
    },
    performers: {
        en: () =>
            "Usta Olim Komilov is a major twentieth-century name in Uzbek doira performance and is remembered for influential stage works and the development of the tradition. Contemporary virtuoso Abbos Kosimov has brought the doira to international stages and collaborations. Many other teachers, craftspeople, women’s ensembles, and regional performers also sustain the tradition; it should not be reduced to only a few stars.",
        ru: () =>
            "Уста Олим Комилов — одно из ключевых имён узбекского исполнительства на доире XX века; его помнят по влиятельным сценическим произведениям и вкладу в развитие традиции. Современный виртуоз Аббос Косимов представляет доиру на международных сценах и в межжанровых проектах. Но традицию сохраняют и многие другие педагоги, мастера, женские ансамбли и региональные исполнители — сводить её только к нескольким звёздам не стоит."
    },
    comparison: {
        en: () =>
            "A doira and a tambourine are both frame drums and may both include jingles. The difference is cultural and technical as well as physical: a doira commonly has many small rings suspended inside a relatively deep frame and belongs to Central Asian repertoires and stroke systems; a Western orchestral tambourine usually has pairs of metal discs set into slots in the shell. Exact instruments vary, so the name and playing tradition matter as much as appearance.",
        ru: () =>
            "Доира и тамбурин относятся к рамочным барабанам и могут иметь металлические звенящие детали. Разница не только внешняя, но и культурно-техническая: у доиры обычно много маленьких колец, подвешенных внутри сравнительно глубокого обода, и она связана с центральноазиатским репертуаром и системой ударов; у западного оркестрового тамбурина чаще стоят пары металлических тарелочек в прорезях корпуса. Конкретные инструменты различаются, поэтому важны не только форма, но и название и традиция игры."
    },
    care: {
        en: () =>
            "Keep a doira dry, shaded, and away from radiators, hot cars, and sudden temperature changes. Store it in a padded case without pressure on the membrane or rings. Wipe the frame with a soft dry cloth; do not wet, oil, or chemically clean a skin head unless the maker recommends it. If the head becomes very loose, tight, cracked, or uneven, consult a doira maker instead of forcing it with strong heat.",
        ru: () =>
            "Храни доиру в сухом месте, вдали от прямого солнца, батарей, нагретой машины и резких перепадов температуры. Лучше использовать мягкий чехол и не давить на мембрану и кольца. Обод протирай сухой мягкой тканью; кожаную мембрану не мочи, не смазывай и не чисти химией без рекомендации мастера. Если кожа сильно провисла, перетянулась, треснула или стала неровной, обратись к мастеру и не пытайся резко нагревать инструмент."
    },
    choosing: {
        en: () =>
            "When choosing a doira, inspect whether the frame is round and comfortable, the membrane is evenly mounted, the rings move freely without loose sharp parts, and low and high strokes are clearly different. Weight and diameter should suit your hands. If possible, compare several instruments with a teacher or maker; decoration alone says little about sound or build quality.",
        ru: () =>
            "При выборе доиры проверь, ровный ли обод и удобно ли его держать, равномерно ли закреплена мембрана, свободно ли движутся кольца и нет ли острых или расшатанных деталей, хорошо ли различаются низкий и высокий звуки. Вес и диаметр должны подходить твоим рукам. По возможности сравни несколько инструментов вместе с педагогом или мастером: одно только украшение мало говорит о звуке и качестве."
    },
    sources: {
        en: () =>
            "The knowledge base was checked against cultural and museum references, including Uzbekistan’s national intangible-cultural-heritage inventory, the Ministry of Culture of Uzbekistan, and the Horniman Museum’s documented doira collection object. Historical details are phrased cautiously where sources describe the wider frame-drum family rather than one unchanged modern instrument.",
        ru: () =>
            "База знаний сверена с культурными и музейными материалами, включая национальный перечень нематериального культурного наследия Узбекистана, публикации Министерства культуры Узбекистана и описание музейной доиры в коллекции Horniman Museum. Исторические формулировки сделаны осторожно там, где источники говорят о широком семействе рамочных барабанов, а не об одном неизменном современном инструменте."
    },
    thanks: {
        en: () =>
            "You’re welcome! I’ll be here whenever you want to explore another part of the doira tradition.",
        ru: () =>
            "Пожалуйста! Я здесь, если захочешь изучить ещё одну сторону традиции доиры."
    },
    goodbye: {
        en: () =>
            "Goodbye! May your next rhythm be steady, relaxed, and full of colour.",
        ru: () =>
            "До встречи! Пусть следующий ритм будет ровным, свободным и красочным."
    },
    outsideScope: {
        en: () =>
            "I’m not confident enough to answer that one, and I’d rather not guess. My strong subject is the doira — its story, construction, sound, technique, performers, care, and cultural life. Try asking me from one of those angles.",
        ru: () =>
            "Здесь я не уверен в ответе, а гадать не хочу. Лучше всего я знаю доиру: её историю, устройство, звучание, технику, исполнителей, уход и культурную жизнь. Попробуй спросить с одной из этих сторон."
    }
};

const INTENTS = [
    {
        name: "sources",
        patterns: [
            /\b(source|sources|reference|references|reliable|proof)\b/,
            /(источник|источники|ссылк|достовер|доказ)/
        ]
    },
    {
        name: "comparison",
        patterns: [
            /\b(tambourine|difference|compare|comparison|daf|dap)\b/,
            /(тамбурин|бубен|разниц|отлич|сравн|даф|дап)/
        ]
    },
    {
        name: "classification",
        patterns: [
            /\b(classification|membranophone|idiophone|instrument family|what type)\b/,
            /(классификац|мембранофон|идиофон|семейств|какой тип)/
        ]
    },
    {
        name: "names",
        patterns: [
            /\b(name|names|spelling|spell|doyra|daira|chirmanda)\b/,
            /(названи|называ|пишется|дойра|дайра|чирманда)/
        ]
    },
    {
        name: "performers",
        patterns: [
            /\b(famous|performer|performers|master|virtuoso|komilov|kosimov)\b/,
            /(известн|исполнител|мастер|виртуоз|уста олим|аббос|комилов|косимов)/
        ]
    },
    {
        name: "usul",
        patterns: [
            /\b(usul|rhythmic cycle|rhythm pattern)\b/,
            /(усул|ритмическ.*цикл|ритмическ.*рисун)/
        ]
    },
    {
        name: "notation",
        patterns: [
            /\b(notation|written|write rhythm|sheet music|symbols)\b/,
            /(нотац|запис.*ритм|ноты|обозначен|символ)/
        ]
    },
    {
        name: "beginner",
        patterns: [
            /\b(beginner|first exercise|start learning|practice|learn to play)\b/,
            /(нович|начинающ|перв.*упражнен|с чего начать|практик|научиться)/
        ]
    },
    {
        name: "technique",
        patterns: [
            /\b(how.*play|playing technique|hold|hands?|fingers?|stroke|roll)\b/,
            /(как.*игра|техник.*игр|держать|рук|пальц|удар|дроб)/
        ]
    },
    {
        name: "rings",
        patterns: [
            /\b(rings?|jingles?|metal|shimmer|rattle)\b/,
            /(кольц|металл|звен|звон|шурш|погрем)/
        ]
    },
    {
        name: "membrane",
        patterns: [
            /\b(membrane|drumhead|head|skin|hide|synthetic|humidity)\b/,
            /(мембран|кож|шкур|пластик|синтет|влажност)/
        ]
    },
    {
        name: "construction",
        patterns: [
            /\b(structure|construction|made|make|built|material|size|diameter|frame)\b/,
            /(устройств|конструкц|сделан|делают|изготов|материал|размер|диаметр|обод|рама)/
        ]
    },
    {
        name: "sounds",
        patterns: [
            /\b(sound|sounds|tone|timbre|bum|bak|bass|edge)\b/,
            /(звук|звуч|тембр|бум|бак|бас|краев)/
        ]
    },
    {
        name: "performance",
        patterns: [
            /\b(where.*played|performance|ensemble|wedding|dance|song|maqom|concert|festival)\b/,
            /(где.*(игра|использ)|исполнен|ансамбл|свадьб|танц|песн|маком|концерт|праздник)/
        ]
    },
    {
        name: "culture",
        patterns: [
            /\b(culture|cultural|heritage|tradition|important|uzbekistan|uzbek)\b/,
            /(культур|наслед|традиц|важн|зачем|для чего|узбекистан|узбекск)/
        ]
    },
    {
        name: "history",
        patterns: [
            /\b(history|historical|origin|origins|ancient|century|old)\b/,
            /(истори|происхожд|древн|век|старин)/
        ]
    },
    {
        name: "care",
        patterns: [
            /\b(care|clean|store|storage|repair|heat|temperature|protect)\b/,
            /(уход|ухаж|чист|хран|ремонт|нагрев|температур|защит)/
        ]
    },
    {
        name: "choosing",
        patterns: [
            /\b(choose|choosing|buy|buying|quality|select)\b/,
            /(выбрать|выбор|купить|покуп|качеств)/
        ]
    },
    {
        name: "definition",
        patterns: [
            /\b(what is|tell me about|explain|doira)\b/,
            /(что такое|расскажи|объясни|доира)/
        ]
    }
];

const FOLLOW_UP_INTENTS = {
    identity: "capabilities",
    capabilities: "definition",
    fact: "definition",
    definition: "construction",
    classification: "sounds",
    names: "history",
    history: "culture",
    construction: "rings",
    membrane: "sounds",
    rings: "sounds",
    appearance: "construction",
    soundDemo: "sounds",
    sounds: "technique",
    technique: "beginner",
    beginner: "usul",
    usul: "notation",
    notation: "beginner",
    performance: "culture",
    culture: "performance",
    performers: "performance",
    comparison: "names",
    care: "choosing",
    choosing: "care",
    sources: "history"
};

const HUMAN_OPENERS = {
    en: {
        default: [
            "Good question.",
            "Absolutely — let’s unpack that.",
            "Yes, there’s an interesting detail here."
        ],
        beginner: ["Let’s take it slowly and keep it practical."],
        care: ["I’m glad you asked — this really matters for a doira."],
        construction: ["Let’s look inside the instrument for a moment."],
        history: ["This has a long story, so here’s the careful version."],
        sources: ["Of course. Here’s what I’m relying on:"],
        continuation: ["Of course — let’s keep going."]
    },
    ru: {
        default: [
            "Хороший вопрос.",
            "Конечно — давай разберёмся.",
            "Да, тут есть интересная деталь."
        ],
        beginner: ["Давай без спешки и максимально практично."],
        care: ["Хорошо, что ты об этом спрашиваешь — для доиры это важно."],
        construction: ["Давай на минуту заглянем внутрь инструмента."],
        history: ["История здесь длинная, поэтому расскажу аккуратно."],
        sources: ["Конечно. Вот на что я опираюсь:"],
        continuation: ["Конечно, продолжим."]
    }
};

const SHORT_INTENTS = new Set([
    "greeting",
    "thanks",
    "goodbye",
    "outsideScope"
]);

function detectLanguage(text) {
    return /[а-яё]/i.test(text) ? "ru" : "en";
}

function randomFact(language) {
    const facts = FACTS[language];
    return facts[Math.floor(Math.random() * facts.length)];
}

function isAppearanceQuestion(text) {
    return /(?:what|how).*?(?:doira|doyra).*?(?:look|appearance)|(?:show|send).*?(?:photo|picture|image).*?(?:doira|doyra)|(?:photo|picture|image).*?(?:doira|doyra)|как.*?выгл.*?(?:доир|дойр|дайр)|покаж.*?(?:фото|картин|изображен).*?(?:доир|дойр|дайр)|(?:фото|картин|изображен).*?(?:доир|дойр|дайр)|внешн.*?вид.*?(?:доир|дойр|дайр)/i.test(text);
}

function isSoundDemoQuestion(text) {
    return /(?:how|what).*?(?:doira|doyra).*?sound|(?:hear|listen).*?(?:doira|doyra)|(?:doira|doyra).*?(?:audio|video|sound example)|как.*?звуч.*?(?:доир|дойр|дайр)|послуш.*?(?:доир|дойр|дайр)|(?:звук|аудио|видео).*?(?:доир|дойр|дайр)|(?:доир|дойр|дайр).*?(?:послуш|аудио|видео)/i.test(text);
}

function isQuizRequest(text) {
    return /\b(?:quiz|test|knowledge check)\b|квиз|тест.*?(?:доир|дойр|дайр)|проверь.*?знан|начать.*?(?:квиз|тест)|викторин/i.test(text);
}

function isGameRequest(text) {
    return /\b(?:play|start|open|try)\s+(?:the\s+|a\s+)?(?:doira\s+|rhythm\s+|learning\s+|educational\s+)?game\b|\b(?:doira|rhythm|learning|educational)\s+game\b|^(?:game|play a game)[!. ]*$|(?:хочу|давай|можно|хотел(?:а)? бы).*?(?:поиграть|сыграть).*?(?:в\s+)?(?:игру|доиру)|(?:открой|запусти|начни).*?(?:обучающ|ритмическ)?.*?игр|обучающ.*?игр|ритмическ.*?игр|^(?:игра|(?:давай\s+)?поиграем)[!. ]*$/i.test(text);
}

function detectSpecialRequest(question) {
    const text = question.toLocaleLowerCase().trim();

    if (isGameRequest(text)) {
        return "game";
    }

    if (isQuizRequest(text)) {
        return "quiz";
    }

    if (isAppearanceQuestion(text)) {
        return "image";
    }

    if (isSoundDemoQuestion(text)) {
        return "sound";
    }

    return null;
}

function getBotAnswer(question) {
    const text = question.toLocaleLowerCase().trim();
    const language = detectLanguage(text);
    const name = state.username || (language === "ru" ? "друг" : "friend");
    const createResponse = (intent, answer) => ({
        intent,
        language,
        text: answer
    });

    if (/^(hi|hello|hey|good (morning|afternoon|evening)|привет|здравствуй|добрый (день|вечер|утро))[!. ]*$/i.test(text)) {
        return createResponse(
            "greeting",
            ANSWERS.greeting[language](name)
        );
    }

    if (/(who are you|your name|кто ты|как тебя зовут)/i.test(text)) {
        return createResponse(
            "identity",
            ANSWERS.identity[language]()
        );
    }

    if (/(what can you do|help|your functions|что ты умеешь|помощь|твои функции)/i.test(text)) {
        return createResponse(
            "capabilities",
            ANSWERS.capabilities[language]()
        );
    }

    if (isAppearanceQuestion(text)) {
        return createResponse(
            "appearance",
            ANSWERS.appearance[language]()
        );
    }

    if (isSoundDemoQuestion(text)) {
        return createResponse(
            "soundDemo",
            ANSWERS.soundDemo[language]()
        );
    }

    if (/(thanks?|thank you|спасибо|благодарю)/i.test(text)) {
        return createResponse(
            "thanks",
            ANSWERS.thanks[language]()
        );
    }

    if (/(bye|goodbye|see you|пока|до свидания|до встречи)/i.test(text)) {
        return createResponse(
            "goodbye",
            ANSWERS.goodbye[language]()
        );
    }

    if (/(fact|interesting fact|fun fact|факт|интересн.*факт)/i.test(text)) {
        return createResponse(
            "fact",
            randomFact(language)
        );
    }

    for (const intent of INTENTS) {
        if (intent.patterns.some((pattern) => pattern.test(text))) {
            return createResponse(
                intent.name,
                ANSWERS[intent.name][language]()
            );
        }
    }

    return createResponse(
        "outsideScope",
        ANSWERS.outsideScope[language]()
    );
}

function isShortContinuation(question) {
    return /^(yes|yeah|sure|okay|ok|continue|go on|tell me more|да|ага|давай|хорошо|продолжай|расскажи ещё)[!. ]*$/i
        .test(question.trim());
}

function chooseHumanOpener(intent, language, question) {
    const languageOpeners = HUMAN_OPENERS[language];
    const candidates =
        languageOpeners[intent] ||
        languageOpeners.default;
    const characterTotal = [...question]
        .reduce((total, character) =>
            total + character.codePointAt(0), 0);

    return candidates[
        characterTotal % candidates.length
    ];
}

function splitAnswerIntoMessages(answer) {
    const parts = answer
        .split(/(?<=[.!?])\s+|(?<=;)\s+/u)
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length < 2) {
        return [answer];
    }

    const groups = [];
    let currentGroup = "";

    for (const part of parts) {
        const candidate =
            currentGroup
                ? `${currentGroup} ${part}`
                : part;

        if (
            currentGroup &&
            candidate.length > 270
        ) {
            groups.push(currentGroup);
            currentGroup = part;
        } else {
            currentGroup = candidate;
        }
    }

    if (currentGroup) {
        groups.push(currentGroup);
    }

    if (groups.length <= 2) {
        return groups;
    }

    return [
        groups[0],
        groups.slice(1).join(" ")
    ];
}

function buildBotReplyPlan(question) {
    const requestedLanguage = detectLanguage(question);
    const isContinuation =
        isShortContinuation(question);
    let response;

    if (
        isContinuation &&
        state.lastIntent &&
        FOLLOW_UP_INTENTS[state.lastIntent]
    ) {
        const nextIntent =
            FOLLOW_UP_INTENTS[state.lastIntent];

        response = {
            intent: nextIntent,
            language: requestedLanguage,
            text:
                ANSWERS[nextIntent][
                    requestedLanguage
                ]()
        };
    } else {
        response = getBotAnswer(question);
    }

    state.lastIntent = response.intent;

    if (SHORT_INTENTS.has(response.intent)) {
        return [response.text];
    }

    return [
        chooseHumanOpener(
            isContinuation
                ? "continuation"
                : response.intent,
            response.language,
            question
        ),
        ...splitAnswerIntoMessages(
            response.text
        )
    ].slice(0, 3);
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
        const error = new Error(payload.error || "The request could not be completed.");
        error.status = response.status;
        throw error;
    }

    return payload;
}

function setAuthMessage(message, success = false) {
    const element = document.getElementById("authMessage");

    if (!element) {
        return;
    }

    element.textContent = message;
    element.classList.toggle("hidden", !message);
    element.classList.toggle("success", success);
}

function setButtonBusy(button, busy) {
    if (!button) {
        return;
    }

    button.disabled = busy;
    button.setAttribute("aria-busy", String(busy));
}

function initLoginPage() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (!loginForm || !registerForm) {
        return false;
    }

    const loginTab = document.getElementById("showLoginButton");
    const registerTab = document.getElementById("showRegisterButton");
    const title = document.getElementById("authTitle");
    const subtitle = document.getElementById("authSubtitle");

    function showMode(mode) {
        const isLogin = mode === "login";
        loginForm.classList.toggle("hidden", !isLogin);
        registerForm.classList.toggle("hidden", isLogin);
        loginTab.classList.toggle("active", isLogin);
        registerTab.classList.toggle("active", !isLogin);
        loginTab.setAttribute("aria-selected", String(isLogin));
        registerTab.setAttribute("aria-selected", String(!isLogin));
        title.textContent = isLogin ? "Welcome back" : "Create your account";
        subtitle.textContent = isLogin
            ? "Sign in to continue your conversation."
            : "Save your conversations with Daniel.";
        setAuthMessage("");
        (isLogin
            ? document.getElementById("loginUsername")
            : document.getElementById("registerUsername")
        ).focus();
    }

    loginTab.addEventListener("click", () => showMode("login"));
    registerTab.addEventListener("click", () => showMode("register"));

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submitButton = loginForm.querySelector('button[type="submit"]');
        setButtonBusy(submitButton, true);
        setAuthMessage("");

        try {
            await apiRequest("/api/login", {
                method: "POST",
                body: JSON.stringify({
                    username: document.getElementById("loginUsername").value,
                    password: document.getElementById("loginPassword").value
                })
            });
            window.location.href = "/index.html";
        } catch (error) {
            setAuthMessage(error.message);
        } finally {
            setButtonBusy(submitButton, false);
        }
    });

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const password = document.getElementById("registerPassword").value;
        const confirmation = document.getElementById("registerPasswordConfirm").value;

        if (password !== confirmation) {
            setAuthMessage("The passwords do not match.");
            return;
        }

        setButtonBusy(submitButton, true);
        setAuthMessage("");

        try {
            await apiRequest("/api/register", {
                method: "POST",
                body: JSON.stringify({
                    username: document.getElementById("registerUsername").value,
                    password
                })
            });
            window.location.href = "/index.html";
        } catch (error) {
            setAuthMessage(error.message);
        } finally {
            setButtonBusy(submitButton, false);
        }
    });

    return true;
}

function normaliseHistory(history) {
    if (!Array.isArray(history)) {
        return [];
    }

    return history
        .map((item) => ({
            role:
                item?.role === "user" || item?.messageClass === "user-message"
                    ? "user"
                    : "assistant",
            text: String(item?.text || "").slice(0, 2000),
            timestamp: Number(item?.timestamp) || Date.now()
        }))
        .filter((item) => item.text)
        .slice(-MAX_HISTORY_MESSAGES);
}

function formatMessageTime(timestamp) {
    return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(timestamp));
}

function createMessageElement(
    message,
    continued = false
) {
    const row = document.createElement("article");
    row.className = `message-row ${message.role}`;

    if (continued) {
        row.classList.add("continued");
    }

    if (
        message.role === "assistant" &&
        !continued
    ) {
        const avatar = document.createElement("img");
        avatar.src = "daniel.png";
        avatar.alt = "";
        avatar.className = "message-avatar";
        row.appendChild(avatar);
    }

    const content = document.createElement("div");
    content.className = "message-content";

    const bubble = document.createElement("div");
    bubble.className = "message";
    bubble.textContent = message.text;

    const meta = document.createElement("small");
    meta.className = "message-meta";
    meta.textContent =
        message.role === "assistant"
            ? (
                continued
                    ? formatMessageTime(
                        message.timestamp
                    )
                    : `Daniel · ${formatMessageTime(message.timestamp)}`
            )
            : `You · ${formatMessageTime(message.timestamp)}`;

    content.append(bubble, meta);
    row.appendChild(content);
    return row;
}

function scrollMessagesToBottom() {
    const messages = document.getElementById("chatMessages");

    if (!messages) {
        return;
    }

    messages.scrollTop = messages.scrollHeight;
    window.requestAnimationFrame(() => {
        messages.scrollTop = messages.scrollHeight;
    });
}

function appendAssistantCard(buildContent) {
    const messages = document.getElementById("chatMessages");

    if (!messages) {
        return null;
    }

    const row = document.createElement("article");
    row.className = "message-row assistant";

    const avatar = document.createElement("img");
    avatar.src = "daniel.png";
    avatar.alt = "";
    avatar.className = "message-avatar";

    const content = document.createElement("div");
    content.className = "message-content";

    const bubble = document.createElement("div");
    bubble.className = "message rich-message";

    const meta = document.createElement("small");
    meta.className = "message-meta";
    meta.textContent = `Daniel · ${formatMessageTime(Date.now())}`;

    buildContent(bubble);
    content.append(bubble, meta);
    row.append(avatar, content);
    messages.appendChild(row);
    scrollMessagesToBottom();

    return { row, bubble };
}

function appendDoiraImageCard(language) {
    appendAssistantCard((bubble) => {
        const image = document.createElement("img");
        image.src = DOIRA_IMAGE_PATH;
        image.alt = language === "ru" ? "Фотография узбекской доиры" : "Photograph of an Uzbek doira";
        image.className = "doira-chat-image";
        image.loading = "lazy";

        const caption = document.createElement("small");
        caption.className = "rich-message-caption";
        caption.textContent = language === "ru"
            ? "Узбекская доира: деревянный обод, мембрана и металлические кольца."
            : "Uzbek doira: wooden frame, membrane, and metal rings.";

        image.addEventListener("error", () => {
            bubble.replaceChildren();
            const fallback = document.createElement("p");
            fallback.textContent = language === "ru"
                ? "Не удалось загрузить doira.png. Убедись, что файл изображения находится рядом с index.html."
                : "The image could not be loaded. Make sure doira.png is next to index.html.";
            bubble.appendChild(fallback);
        }, { once: true });

        bubble.append(image, caption);
    });
}

function appendSoundButtonCard(language) {
    appendAssistantCard((bubble) => {
        const link = document.createElement("a");
        link.href = DOIRA_SOUND_URL;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "chat-action-button";
        link.textContent = language === "ru"
            ? "▶ Послушать звучание доиры"
            : "▶ Listen to the doira";

        const note = document.createElement("small");
        note.className = "rich-message-caption";
        note.textContent = language === "ru"
            ? "Ссылка откроется на YouTube в новой вкладке."
            : "The YouTube example opens in a new tab.";

        bubble.append(link, note);
    });
}

function appendGameButtonCard(language) {
    appendAssistantCard((bubble) => {
        const title = document.createElement("strong");
        title.textContent = language === "ru"
            ? "Ритмическое путешествие"
            : "Doira Rhythm Journey";

        const description = document.createElement("span");
        description.textContent = language === "ru"
            ? "Послушай рисунок и повтори его ударами БУМ и БАК. За прохождение уровней открываются новые доиры."
            : "Listen to a pattern and repeat it with BUM and BAK strokes. Completing levels unlocks new doira designs.";

        const link = document.createElement("a");
        link.href = GAME_PAGE_PATH;
        link.className = "chat-action-button";
        link.textContent = language === "ru"
            ? "🥁 Открыть обучающую игру"
            : "🥁 Open the learning game";

        const note = document.createElement("small");
        note.className = "rich-message-caption";
        note.textContent = language === "ru"
            ? "Прогресс и выбранная доира сохраняются в твоём аккаунте."
            : "Your progress and selected doira are saved to your account.";

        bubble.append(title, description, link, note);
    });
}

function quizResultText(language, score, total) {
    const percent = Math.round((score / total) * 100);

    if (language === "ru") {
        if (percent === 100) {
            return `Квиз завершён: ${score} из ${total}. Отличный результат — ты очень хорошо знаешь доиру!`;
        }

        if (percent >= 70) {
            return `Квиз завершён: ${score} из ${total}. Хороший результат! Ты уже знаешь основные факты о доире.`;
        }

        return `Квиз завершён: ${score} из ${total}. Неплохое начало — изучи темы в меню и попробуй ещё раз.`;
    }

    if (percent === 100) {
        return `Quiz complete: ${score} out of ${total}. Excellent — you know the doira very well!`;
    }

    if (percent >= 70) {
        return `Quiz complete: ${score} out of ${total}. Good result! You already know the main facts about the doira.`;
    }

    return `Quiz complete: ${score} out of ${total}. A good start — explore the topics and try again.`;
}

function finishQuiz() {
    if (!state.quiz) {
        return;
    }

    const { language, score } = state.quiz;
    const total = QUIZ_QUESTIONS[language].length;
    state.quiz = null;
    appendMessage("assistant", quizResultText(language, score, total));

    appendAssistantCard((bubble) => {
        const retryButton = document.createElement("button");
        retryButton.type = "button";
        retryButton.className = "quiz-next-button";
        retryButton.textContent = language === "ru" ? "Пройти квиз ещё раз" : "Try the quiz again";
        retryButton.addEventListener("click", () => {
            retryButton.disabled = true;
            startQuiz(language);
        });
        bubble.appendChild(retryButton);
    });
}

function answerQuizQuestion(selectedIndex, buttons, feedback, actionButton) {
    if (!state.quiz || state.quiz.answered) {
        return;
    }

    const questions = QUIZ_QUESTIONS[state.quiz.language];
    const question = questions[state.quiz.currentIndex];
    const isCorrect = selectedIndex === question.answer;
    state.quiz.answered = true;

    if (isCorrect) {
        state.quiz.score += 1;
    }

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct");
        } else if (index === selectedIndex) {
            button.classList.add("incorrect");
        }
    });

    feedback.hidden = false;
    feedback.textContent = state.quiz.language === "ru"
        ? `${isCorrect ? "Верно!" : "Неверно."} ${question.explanation}`
        : `${isCorrect ? "Correct!" : "Not quite."} ${question.explanation}`;

    actionButton.hidden = false;
    scrollMessagesToBottom();
}

function appendQuizQuestion() {
    if (!state.quiz) {
        return;
    }

    const questions = QUIZ_QUESTIONS[state.quiz.language];
    const question = questions[state.quiz.currentIndex];
    const language = state.quiz.language;
    state.quiz.answered = false;

    appendAssistantCard((bubble) => {
        bubble.classList.add("quiz-card");

        const progress = document.createElement("small");
        progress.className = "quiz-progress";
        progress.textContent = language === "ru"
            ? `Вопрос ${state.quiz.currentIndex + 1} из ${questions.length}`
            : `Question ${state.quiz.currentIndex + 1} of ${questions.length}`;

        const title = document.createElement("p");
        title.className = "quiz-question";
        title.textContent = question.question;

        const options = document.createElement("div");
        options.className = "quiz-options";

        const feedback = document.createElement("p");
        feedback.className = "quiz-feedback";
        feedback.hidden = true;

        const actionButton = document.createElement("button");
        actionButton.type = "button";
        actionButton.className = "quiz-next-button";
        actionButton.hidden = true;
        actionButton.textContent = state.quiz.currentIndex === questions.length - 1
            ? (language === "ru" ? "Показать результат" : "Show result")
            : (language === "ru" ? "Следующий вопрос" : "Next question");

        const optionButtons = question.options.map((option, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "quiz-option-button";
            button.textContent = option;
            button.addEventListener("click", () => {
                answerQuizQuestion(index, optionButtons, feedback, actionButton);
            });
            options.appendChild(button);
            return button;
        });

        actionButton.addEventListener("click", () => {
            actionButton.disabled = true;

            if (!state.quiz) {
                return;
            }

            if (state.quiz.currentIndex >= questions.length - 1) {
                finishQuiz();
                return;
            }

            state.quiz.currentIndex += 1;
            appendQuizQuestion();
        });

        bubble.append(progress, title, options, feedback, actionButton);
    });
}

function startQuiz(language) {
    state.quiz = {
        language,
        currentIndex: 0,
        score: 0,
        answered: false
    };

    appendMessage(
        "assistant",
        language === "ru"
            ? "Начинаем квиз о доире! Выбери один ответ в каждом вопросе."
            : "Let’s start the doira quiz! Choose one answer for each question."
    );
    appendQuizQuestion();
}

function renderHistory() {
    const messages = document.getElementById("chatMessages");

    if (!messages) {
        return;
    }

    messages.replaceChildren();
    state.chatHistory.forEach((message, index) => {
        const previousMessage =
            state.chatHistory[index - 1];
        const continued =
            message.role === "assistant" &&
            previousMessage?.role ===
            "assistant";

        messages.appendChild(
            createMessageElement(
                message,
                continued
            )
        );
    });
    messages.scrollTop = messages.scrollHeight;
    window.requestAnimationFrame(() => {
        messages.scrollTop = messages.scrollHeight;
    });
    window.setTimeout(() => {
        messages.scrollTop = messages.scrollHeight;
    }, 160);
}

function appendMessage(role, text, save = true) {
    const message = {
        role,
        text: String(text).trim(),
        timestamp: Date.now()
    };

    state.chatHistory.push(message);
    state.chatHistory = state.chatHistory.slice(-MAX_HISTORY_MESSAGES);

    const messages = document.getElementById("chatMessages");
    const previousMessage =
        state.chatHistory[
        state.chatHistory.length - 2
        ];
    const continued =
        role === "assistant" &&
        previousMessage?.role ===
        "assistant";

    messages.appendChild(
        createMessageElement(
            message,
            continued
        )
    );
    messages.scrollTop = messages.scrollHeight;

    if (save) {
        saveHistory();
    }
}

let saveTimer = null;

function saveHistory() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(async () => {
        try {
            await apiRequest("/api/history", {
                method: "PUT",
                body: JSON.stringify({
                    chatHistory: state.chatHistory
                })
            });
        } catch (error) {
            if (error.status === 401) {
                window.location.href = "/login.html";
            } else {
                console.error("Could not save chat history:", error);
            }
        }
    }, 180);
}

function showTypingIndicator() {
    const messages = document.getElementById("chatMessages");
    const row = document.createElement("article");
    row.id = "typingIndicator";
    row.className = "message-row assistant";
    row.innerHTML = `
        <img src="daniel.png" alt="" class="message-avatar">
        <div class="message typing-bubble" aria-label="Daniel is typing">
            <span></span><span></span><span></span>
        </div>
    `;
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
}

function removeTypingIndicator() {
    document.getElementById("typingIndicator")?.remove();
}

function resizeComposer(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 126)}px`;
    textarea.style.overflowY =
        textarea.scrollHeight > 126 ? "auto" : "hidden";
}

async function submitQuestion(question) {
    const input = document.getElementById("chatInput");
    const form = document.getElementById("chatForm");
    const submitButton = form.querySelector('button[type="submit"]');
    const cleanedQuestion = question.trim();

    if (!cleanedQuestion || state.replyPending) {
        return;
    }

    state.replyPending = true;
    appendMessage("user", cleanedQuestion);
    input.value = "";
    resizeComposer(input);
    setButtonBusy(submitButton, true);

    try {
        const specialRequest = detectSpecialRequest(cleanedQuestion);
        const language = detectLanguage(cleanedQuestion);

        if (specialRequest === "game") {
            showTypingIndicator();
            await new Promise((resolve) => window.setTimeout(resolve, 420));
            removeTypingIndicator();
            appendMessage(
                "assistant",
                language === "ru"
                    ? "Отличная идея! Я подготовил обучающую ритмическую игру о доире."
                    : "Great idea! I have an interactive doira rhythm game ready for you."
            );
            appendGameButtonCard(language);
            state.lastIntent = null;
            return;
        }

        if (specialRequest === "quiz") {
            showTypingIndicator();
            await new Promise((resolve) => window.setTimeout(resolve, 420));
            removeTypingIndicator();
            startQuiz(language);
            return;
        }

        const replyPlan =
            buildBotReplyPlan(
                cleanedQuestion
            );

        for (
            let index = 0;
            index < replyPlan.length;
            index++
        ) {
            showTypingIndicator();

            const messageLength =
                replyPlan[index].length;
            const delay =
                index === 0
                    ? Math.min(
                        650,
                        240 +
                        cleanedQuestion
                            .length * 4
                    )
                    : Math.min(
                        720,
                        280 +
                        messageLength * 2
                    );

            await new Promise((resolve) =>
                window.setTimeout(
                    resolve,
                    delay
                )
            );

            removeTypingIndicator();
            appendMessage(
                "assistant",
                replyPlan[index]
            );
        }

        if (specialRequest === "image") {
            appendDoiraImageCard(language);
        } else if (specialRequest === "sound") {
            appendSoundButtonCard(language);
        }
    } finally {
        removeTypingIndicator();
        setButtonBusy(
            submitButton,
            false
        );
        state.replyPending = false;
        input.focus();
    }
}

async function initChatPage() {
    const messages = document.getElementById("chatMessages");

    if (!messages) {
        return;
    }

    try {
        const session = await apiRequest("/api/session");
        state.username = session.username;
        state.chatHistory = normaliseHistory(session.chatHistory);
    } catch (error) {
        if (error.status === 401) {
            window.location.href = "/login.html";
            return;
        }

        messages.textContent = "The chat could not be loaded. Please refresh the page.";
        return;
    }

    document.getElementById("usernameLabel").textContent = state.username;

    if (state.chatHistory.length === 0) {
        state.chatHistory.push({
            role: "assistant",
            text:
                `Hello, ${state.username}! I’m Daniel. Ask me anything about ` +
                "the Uzbek doira, or choose a topic on the left. You can write in English or Russian.",
            timestamp: Date.now()
        });
        saveHistory();
    }

    renderHistory();

    const form = document.getElementById("chatForm");
    const input = document.getElementById("chatInput");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitQuestion(input.value);
    });

    input.addEventListener("input", () => resizeComposer(input));
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submitQuestion(input.value);
        }
    });

    document.querySelectorAll("[data-question]").forEach((button) => {
        button.addEventListener("click", () => {
            submitQuestion(button.dataset.question || "");
        });
    });

    document.getElementById("clearChatButton").addEventListener("click", async () => {
        if (!window.confirm("Delete your saved conversation?")) {
            return;
        }

        state.chatHistory = [];
        state.quiz = null;
        messages.replaceChildren();
        appendMessage(
            "assistant",
            `The conversation is clear, ${state.username}. What would you like to learn about the doira?`
        );
    });

    document.getElementById("logoutButton").addEventListener("click", async () => {
        try {
            await apiRequest("/api/logout", {
                method: "POST",
                body: "{}"
            });
        } finally {
            window.location.href = "/login.html";
        }
    });

    input.focus();
}

document.addEventListener("DOMContentLoaded", () => {
    if (!initLoginPage()) {
        initChatPage();
    }
});
