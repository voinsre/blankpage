// ============================================================================
// MANIFESTO DATA
// ============================================================================

export type ManifestoChapter = {
    number: string;
    title: string;
    paragraphs: string[];
    breakQuotes: number[]; // Indices of paragraphs that get break-quote treatment
};

export const MANIFESTO_CHAPTERS: ManifestoChapter[] = [
    {
        number: "I.",
        title: "THE CONFESSION",
        paragraphs: [
            "We are selling you nothing.",
            "Not nothing disguised as something. Not nothing wrapped in a framework, a methodology, a 12-step system, or a morning routine endorsed by a billionaire who wakes up at 4 AM.",
            "Actual nothing. A blank page. For $22.95.",
            "And the fact that this bothers you is exactly why you need it.",
            "Here is the uncomfortable question we need to start with: When was the last time you sat with nothing? Not meditated — that's something. Not journaled — that's something. Not \"took a digital detox\" so you could post about it later — that's definitely something.",
            "When did you last stare at emptiness without reaching for your phone, without optimizing it, without turning it into content?",
            "You can't remember. Neither can we. That's the problem.",
        ],
        breakQuotes: [3], // "And the fact that this bothers you..."
    },
    {
        number: "II.",
        title: "THE LIE YOU'VE BEEN BUYING",
        paragraphs: [
            "Somewhere along the way, you bought a lie. Not from a guru, not from an algorithm — from yourself. The lie goes like this:",
            "\"Something is wrong with me. Something is missing. And if I just read one more book, take one more course, attend one more seminar, download one more app, subscribe to one more newsletter, listen to one more podcast episode, I will finally be fixed.\"",
            "You have been consuming solutions to a problem that doesn't exist.",
            "You are not broken. You are full.",
            "Overfull. Stuffed to the point of paralysis with advice, frameworks, templates, strategies, hacks, tips, tricks, and the accumulated mental garbage of ten thousand free PDFs you downloaded and never opened.",
            "The self-help industry didn't lie to you. Here's what's worse: every single one of those products would have worked. The book would have helped. The course would have delivered. The seminar would have shifted something. But only if you had decided to give it meaning. Only if you had committed to the transformation, not just the transaction.",
            "You didn't need more input. You needed less.",
            "You needed a blank page.",
        ],
        breakQuotes: [3], // "You are not broken. You are full."
    },
    {
        number: "III.",
        title: "THE ECONOMICS OF PAYING ATTENTION",
        paragraphs: [
            "If you don't pay, you won't pay attention.",
            "This is not a slogan. This is not wordplay. This is the single most underestimated truth in human psychology.",
            "Every free thing you've ever received — the free ebook, the free webinar, the free trial, the free advice from your friend at dinner — where is it now? Forgotten. Deleted. Ignored. Buried under the next free thing.",
            "We pay for everything in this life. Either with money or with time. In a world where everything is free, you are not the customer. You are the product. Your attention is being sold to the highest bidder, and you're giving it away at a discount.",
            "$22.95 is not the price of a blank page. It is the price of a decision. It is the transaction that precedes transformation. It is the moment you stop browsing your own life and commit to something — even if that something is nothing.",
            "A behavioral economist would tell you this: the value of any good is not determined by its price. It is determined by perception. And perception is shaped by what you sacrifice to obtain it.",
            "You will forget every free blank page you've ever opened. You will remember this one.",
        ],
        breakQuotes: [0], // "If you don't pay, you won't pay attention."
    },
    {
        number: "IV.",
        title: "THE TERROR OF EMPTY SPACE",
        paragraphs: [
            "You are afraid of nothing. Literally.",
            "Not nothing as in \"you're fearless.\" Nothing as in the void. The silence. The empty room. The blank screen. The unscheduled hour.",
            "Watch what happens when you have 15 free minutes. You reach for your phone. You scroll. You check an inbox you checked four minutes ago. You open an app, close it, open another one. You fill the silence with noise because silence asks questions you don't want to answer.",
            "Psychologists call it analysis paralysis. Writers call it blank page syndrome. Existentialists call it the confrontation with freedom. Normal people call it boredom and run from it like it's a fire.",
            "But the fear isn't really about emptiness. The fear is this: \"If I stop, if I am still, if I face the blank page — what if there's nothing there? What if I have nothing to say? What if I am not enough?\"",
            "And there it is. The wound underneath all the noise.",
            "Not enough. Not smart enough, not creative enough, not productive enough, not successful enough, not loved enough. And so we stay busy. Because busy feels like enough. Busy feels like proof. Busy is the lie we tell ourselves so we never have to face the terrifying possibility that we are already complete, already sufficient, already whole — and everything we've been chasing was just elaborate avoidance.",
            "A blank page is a mirror. And most people would rather doom-scroll for six hours than look in one for six seconds.",
        ],
        breakQuotes: [7], // "A blank page is a mirror."
    },
    {
        number: "V.",
        title: "THE SOURCE",
        paragraphs: [
            "Before the universe existed, there was nothing.",
            "Before every empire, every invention, every revolution, every masterpiece, every love story, every business, every breakthrough — there was nothing.",
            "Nothing is not the absence of something. Nothing is the source of everything.",
            "The void is not empty. It is pregnant. It is the silence before the first note. The inhale before the scream. The stillness before the earthquake. The blank page before the declaration of independence, before the resignation letter, before the business plan, before the love letter, before the first line of code, before the sketch that became a skyscraper.",
            "A single page started every war in history. A single page ended them. A single page has launched religions, toppled governments, built fortunes, mended relationships, and changed the course of human civilization.",
            "And every single one of those pages started blank.",
            "The potential of nothing is everything and nothing at the same time. That's not a contradiction. That's the point.",
        ],
        breakQuotes: [2], // "Nothing is not the absence of something..."
    },
    {
        number: "VI.",
        title: "THE RESPONSIBILITY YOU'RE AVOIDING",
        paragraphs: [
            "Here is a theory that will make you uncomfortable:",
            "You can blame your parents for the way you turned out. You can blame your upbringing, your circumstances, your boss, the economy, the algorithm, the education system, your ex. You are entitled to that blame — right up until the moment you have that thought.",
            "The moment you think it — the moment you say \"my parents made me this way\" or \"the system is rigged\" or \"life isn't fair\" — that is the exact moment the excuse expires. Because awareness is the death of victimhood. The second you are conscious of the pattern, the choice to stay in it becomes yours. Not theirs. Not the world's. Yours.",
            "This is what a blank page offers that no therapist, no guru, no productivity system ever will: total, unfiltered, inescapable responsibility.",
            "A blank page has no one else on it. No algorithm feeding you what to think. No template telling you what to write. No instructor guiding your hand. No one to blame if you fill it with garbage. No one to credit if you fill it with genius.",
            "Just you. And the terrifying freedom of an empty space that will become whatever you decide it becomes.",
            "Nothing has meaning unless the meaning you give it. Not this page. Not your life. Not your story. You are the author. The page is waiting.",
            "And every second you spend blaming someone else is a second your page stays blank — not by choice, but by cowardice.",
        ],
        breakQuotes: [2], // Contains "awareness is the death of victimhood"
    },
    {
        number: "VII.",
        title: "THE PERSON WITH 101 VOICES",
        paragraphs: [
            "This manifesto is for a specific person. Not everyone. One person.",
            "You know who you are. You have a hundred conversations running in your head at any given moment, and a hundred and one of them are not good. They are polluting, buzzing, nagging, destructive, repetitive, exhausting. They tell you that you're behind, that you're failing, that everyone else has figured it out and you're still pretending.",
            "You fill every waking moment with noise to drown them out. Podcasts on the commute. Music in the shower. Netflix at dinner. Phone in hand the moment you wake up. Scroll, scroll, scroll. Anything to avoid the one thing you actually need: silence.",
            "Here is what a blank page does for you, specifically:",
            "Even if it remains blank — even if you never write a single word, draw a single line, make a single mark — it gives you permission to stare at nothing. And in that nothing, in that absence of input, the voices tone down. Even if it's just for a minute. Even if the relief is temporary.",
            "One minute of silence in a lifetime of noise.",
            "That alone is worth $22.95. That alone might be worth everything.",
            "Because in that minute, in that tiny gap between the noise, you might hear the one voice that matters: yours.",
        ],
        breakQuotes: [5], // "One minute of silence in a lifetime of noise."
    },
    {
        number: "VIII.",
        title: "THE REFRAME",
        paragraphs: [
            "\"This is stupid. I can just open a blank Word document.\"",
            "Yes. One hundred percent. You absolutely can. It's right there. File > New. It's free. It takes two seconds. It's been available to you your entire adult life.",
            "So why haven't you?",
            "You could also make your own coffee instead of paying five dollars for it. You could cut your own hair. You could be your own therapist. You have access to every book ever written, every lecture ever recorded, every piece of wisdom humanity has ever produced — for free, on the device in your pocket.",
            "How's that working out for you?",
            "The difference between a free blank page and a $22.95 blank page is the same difference between a free gym and a gym you pay for. The same difference between advice from a friend and advice from a coach you're paying three hundred dollars an hour. The same difference between a New Year's resolution and a signed contract.",
            "Commitment changes behavior. Transaction creates attention. Payment is proof that you're serious.",
            "Everything is available. Nothing is committed to. And that is why you have 47 tabs open, 12 unfinished projects, 6 half-read books, and a notes app full of ideas you'll never execute.",
            "By doing what you've always done, you will get what you've always gotten.",
            "The free blank page has been sitting in your computer for years. You never used it. The possibility was there, and you ignored it. Because when everything is possible and nothing costs anything, nothing gets done.",
            "$22.95 is the line in the sand. The point of no return. The moment you stop saying \"I could\" and start saying \"I did.\"",
        ],
        breakQuotes: [8], // "By doing what you've always done..."
    },
    {
        number: "IX.",
        title: "THE UNCOMFORTABLE TRUTH ABOUT MONEY",
        paragraphs: [
            "People will sell farts in a jar and make six figures. People will sell bathwater and crash servers. People will sell a JPEG of an ape for three hundred thousand dollars. People will pay seven dollars for water in a can because the branding is cool.",
            "And you're offended by a blank page for $22.95?",
            "The outrage isn't really about the price. It's about what the price reveals. It holds up a mirror to every stupid purchase you've ever made and asks: \"What was THAT really about?\"",
            "The streaming service you watch for 20 minutes a month. The app you opened twice. The ebook collecting digital dust. The course still sitting in your inbox, unwatched. The money you spend every month on things you can't even name.",
            "All of that was fine. All of that was \"normal.\" But a blank page that asks you to confront yourself for twenty-three dollars? That's crazy.",
            "Maybe crazy is exactly what's been missing.",
            "The reason you won't buy a blank page is the same reason you won't say the thoughts in your head out loud to yourself. Because both require honesty. Both strip away the packaging, the branding, the comfort of consumption, and leave you alone with the one thing you've been running from.",
            "You.",
        ],
        breakQuotes: [],
    },
    {
        number: "X.",
        title: "TABULA RASA",
        paragraphs: [
            "The ancient philosophers called it tabula rasa. The blank slate. The idea that we arrive in this world as nothing — no beliefs, no baggage, no scars, no stories — and everything that follows is written on us by experience.",
            "But they got it half right.",
            "Yes, life writes on you. Your parents write on you. School writes on you. Heartbreak writes on you. Failure writes on you. Success writes on you. The internet writes on you every single day, in permanent marker, without your permission.",
            "But at any moment — any moment — you can turn the page.",
            "Not erase what's been written. Not pretend the past didn't happen. But start a new page. A blank one. One where the only author is you, writing deliberately, with full awareness that every word is a choice.",
            "That is what this is. Not a product. Not a gag. Not a gimmick.",
            "A blank page is a declaration of intent. It says: \"I am starting. I don't know what comes next. But I am no longer a passive reader of my own life.\"",
        ],
        breakQuotes: [],
    },
    {
        number: "XI.",
        title: "THE PRODUCT IS NOT THE PAGE",
        paragraphs: [
            "Let us be absurdly, painfully clear about what you are buying:",
            "You are not buying paper. You are not buying potential. You are not buying a metaphor.",
            "You are buying certainty.",
            "Certainty that you made a choice. Certainty that you committed to something. Certainty that for once in your overstimulated, overcrowded, oversubscribed life, you stopped and did something that makes no logical sense — and in doing so, proved that you are still capable of acting from something deeper than logic.",
            "You are buying peace of mind. The peace that comes from knowing that not everything has to have a purpose, an ROI, a measurable outcome. That sometimes the most productive thing you can do is absolutely nothing. That the silence isn't empty — it's full of answers you've been too busy to hear.",
            "In fifty years, we want \"blank page\" to mean what \"clean slate\" never quite captured. Not just starting over. But starting from a place of power. Of choice. Of conscious, deliberate, terrifying possibility.",
            "Potential. Rebirth. Connection.",
            "To yourself. To the silence. To whatever is waiting on the other side of your fear.",
        ],
        breakQuotes: [],
    },
    {
        number: "XII.",
        title: "THE INVITATION",
        paragraphs: [
            "We are not asking you to buy a blank page.",
            "We are asking you to stop. To be still. To face the void. To sit with the silence long enough for it to speak.",
            "We are asking you to make the single most irrational purchase of your life and discover that irrationality, like a blank page, is far more powerful than the rational, optimized, productivity-hacked existence you've been performing.",
            "We are asking you to trust that you are enough. That the page doesn't need to be filled to be valuable. That you don't need to be fixed to be whole. That the voices in your head are not the truth. That the truth is in the silence between them.",
            "And if you're still not sure, ask yourself this:",
            "What are you so afraid of finding on a blank page?",
        ],
        breakQuotes: [5], // "What are you so afraid of finding on a blank page?"
    },
];

// ============================================================================
// BREAK QUOTES — lines that get special large treatment
// ============================================================================

export const BREAK_QUOTE_STRINGS = [
    "And the fact that this bothers you is exactly why you need it.",
    "You are not broken. You are full.",
    "If you don't pay, you won't pay attention.",
    "A blank page is a mirror.",
    "Nothing is not the absence of something. Nothing is the source of everything.",
    "Awareness is the death of victimhood.",
    "One minute of silence in a lifetime of noise.",
    "By doing what you've always done, you will get what you've always gotten.",
    "What are you so afraid of finding on a blank page?",
];

// ============================================================================
// ANIMATION CONFIGS
// ============================================================================

export const ANIMATION = {
    fadeInUp: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: {
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    staggerChildren: {
        animate: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    },
};

// ============================================================================
// SESSION CONFIG
// ============================================================================

export const SESSION_CONFIG = {
    FREE_SESSION_DURATION: 5 * 60 * 1000, // 5 minutes in ms
    PROMPT_DELAY: 3000, // 3s before prompt text appears
    BORDER_DELAY: 5000, // 5s before input border animates in
    HINT_DELAY: 7000, // 7s before manifesto hint appears
    QUESTION_ROTATION_INTERVAL: 15000, // 15s between question rotations
    TYPING_IDLE_TIMEOUT: 5000, // 5 seconds of idle after typing triggers AI
    TYPEWRITER_SPEED: 50, // ms per word for AI response
    INITIAL_QUESTIONS: [
        "What are you avoiding right now?",
        "What would you do if no one was watching?",
        "What are you pretending not to know?",
        "What conversation do you keep having with yourself?",
    ],
    FREE_SESSION_END_MESSAGE:
        "Your time with this page is over. But the page doesn't have to be.",
};

// ============================================================================
// ERROR MESSAGES — all in brand voice
// ============================================================================

export const ERROR_MESSAGES = {
    AI_FAILURE: "The page is thinking. Try again in a moment.",
    PAYMENT_FAILURE:
        "Something went wrong. Not with you — with the payment. Try again.",
    AUTH_FAILURE:
        "We couldn't find your page. Check your email for the magic link.",
    NETWORK_ERROR:
        "The page is still here. Your connection isn't. We'll wait.",
    RATE_LIMIT: "Slow down. The blank page isn't going anywhere.",
    SESSION_LIMIT: "Session limit reached.",
};
