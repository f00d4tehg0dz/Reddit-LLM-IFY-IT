// The LLM-ifier engine: transforms normal text into ChatGPT-style
// hyper-enthusiastic, emoji-laden responses — without using any actual LLM.

const ENTHUSIASM_PREFIXES = [
  "Great question! 🌟",
  "Oh, I love this topic! 🎉",
  "What a fantastic thought! ✨",
  "This is such a great thing to explore! 🚀",
  "Great observation — let me share my thoughts! 💫",
  "Absolutely! Let me break this down for you! 🌈",
  "I'd love to help with this! 😊",
  "What a great thing to bring up! ✨",
  "Ooh, this is a really interesting one! 🔥",
  "I'm so glad you asked about this! 💖",
  "This is a really thoughtful point! 🙌",
  "That's a really interesting perspective! 🌟",
];

const ENTHUSIASM_SUFFIXES = [
  "\n\nI hope this helps! Let me know if you have any other questions! 😊",
  "\n\nFeel free to ask me anything else — I'm always happy to help! 🤗",
  "\n\nYou've got this! Keep up the great work! 🚀",
  "\n\nI hope that gives you a helpful perspective! Don't hesitate to ask more! 💫",
  "\n\nWhat a great discussion! Let me know if you'd like me to elaborate on anything! 😊",
  "\n\nRemember, every challenge is an opportunity to learn and grow! 🌱",
  "\n\nI really enjoyed thinking through this with you! 🌟",
  "\n\nThanks for sharing this — it's such a meaningful topic! 💕",
  "\n\nI'm always here if you need anything else! Happy to help anytime! 🤖✨",
  "\n\nHope that was useful! You're doing great! 😊🎉",
];

const EMOJI_MAP: Record<string, string[]> = {
  good: ["✨", "🌟", "💫"],
  bad: ["💪", "🌈"],
  happy: ["😊", "🥰", "💖"],
  sad: ["🤗", "💕", "🌟"],
  angry: ["💕", "🤗", "✨"],
  love: ["💖", "💕", "😍", "🥰"],
  hate: ["💕", "🌈"],
  work: ["💼", "🚀", "💪"],
  code: ["💻", "🤖", "👨‍💻"],
  bug: ["🐛", "🔧"],
  money: ["💰", "📈"],
  food: ["🍕", "😋", "🍽️"],
  sleep: ["😴", "💤"],
  thanks: ["🙏", "💖", "🤗"],
  sorry: ["💕", "🤗"],
  help: ["🤝", "💪", "🙌"],
  lol: ["😂", "🤣", "😄"],
  won: ["🏆", "🎉", "👑"],
  success: ["🎉", "🏆", "🚀"],
  idea: ["💡", "🧠", "🚀"],
  agree: ["💯", "🙌", "👏"],
  yes: ["✅", "💯", "🎉"],
};

const TOPIC_EMOJIS: Record<string, string> = {
  programming: "💻",
  javascript: "🟨",
  python: "🐍",
  react: "⚛️",
  game: "🎮",
  music: "🎵",
  movie: "🎬",
  book: "📚",
  science: "🔬",
  math: "🔢",
  art: "🎨",
  photo: "📸",
  dog: "🐕",
  cat: "🐱",
  weather: "🌤️",
  travel: "✈️",
  car: "🚗",
  phone: "📱",
  computer: "💻",
  internet: "🌐",
  pizza: "🍕",
  coffee: "☕",
  beer: "🍺",
  gym: "💪",
  school: "🏫",
  university: "🎓",
  birthday: "🎂",
  summer: "☀️",
  winter: "❄️",
  spring: "🌸",
};

const HEDGE_REPLACEMENTS: Record<string, string> = {
  "i think": "I'm fairly confident",
  probably: "definitely",
  maybe: "almost certainly",
  "i guess": "I'd say",
  kinda: "really quite",
  "sort of": "genuinely",
  "kind of": "quite",
  idk: "here's my take on this",
  imo: "based on my analysis",
  imho: "in my informed opinion",
  tbh: "to be completely transparent",
};

const INTENSIFIERS = [
  "absolutely",
  "incredibly",
  "remarkably",
  "genuinely",
  "truly",
  "really",
  "wonderfully",
  "fantastically",
];

const FILLER_INSERTIONS = [
  "And honestly, ",
  "What's really interesting here is that ",
  "I think it's worth noting that ",
  "On top of that, ",
  "Here's the thing — ",
  "To add to that, ",
  "What I find fascinating is that ",
];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addEmojisByContext(text: string): string {
  let result = text;

  for (const [keyword, emoji] of Object.entries(TOPIC_EMOJIS)) {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    if (regex.test(result)) {
      // Only add once, not on every occurrence
      let added = false;
      result = result.replace(regex, (match) => {
        if (!added) {
          added = true;
          return `${match} ${emoji}`;
        }
        return match;
      });
    }
  }

  for (const [keyword, emojis] of Object.entries(EMOJI_MAP)) {
    const regex = new RegExp(`\\b${keyword.replace("'", "'")}\\b`, "gi");
    if (regex.test(result)) {
      let added = false;
      result = result.replace(regex, (match) => {
        if (!added) {
          added = true;
          return `${match} ${randomPick(emojis)}`;
        }
        return match;
      });
    }
  }

  return result;
}

function replaceHedges(text: string): string {
  let result = text;
  for (const [hedge, replacement] of Object.entries(HEDGE_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${hedge}\\b`, "gi");
    result = result.replace(regex, replacement);
  }
  return result;
}

function addRandomIntensifiers(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences
    .map((sentence) => {
      if (Math.random() > 0.7 && sentence.length > 20) {
        const words = sentence.split(" ");
        const insertIdx = Math.min(
          Math.floor(Math.random() * 3) + 1,
          words.length - 1
        );
        words.splice(insertIdx, 0, randomPick(INTENSIFIERS));
        return words.join(" ");
      }
      return sentence;
    })
    .join(" ");
}

function convertNegativeToPositive(text: string): string {
  return text
    .replace(/\bi hate\b/gi, "I have some complicated feelings about")
    .replace(/\bthis sucks\b/gi, "this has a lot of room for improvement ✨")
    .replace(/\bterrible\b/gi, "full of growth opportunities")
    .replace(/\bhorrible\b/gi, "a valuable learning experience")
    .replace(/\bawful\b/gi, "uniquely challenging")
    .replace(/\bworst\b/gi, "most opportunity-rich")
    .replace(/\bgarbage\b/gi, "not quite there yet")
    .replace(/\btrash\b/gi, "underappreciated")
    .replace(/\buseless\b/gi, "still finding its purpose")
    .replace(/\bstupid\b/gi, "unconventional")
    .replace(/\bidiot\b/gi, "creative thinker")
    .replace(/\bmoron\b/gi, "someone on their own journey")
    .replace(/\bdead\b/gi, "at rest")
    .replace(/\bwaste of time\b/gi, "an investment in experience")
    .replace(/\bnobody cares\b/gi, "the right people really do care about this 💖")
    .replace(/\bshut up\b/gi, "I'd love to hear more when you're ready!")
    .replace(/\bgo away\b/gi, "let's take a thoughtful pause")
    .replace(/\bleave me alone\b/gi, "let's respect each other's boundaries 💕")
    .replace(/\bfuck\b/gi, "wow")
    .replace(/\bfucking\b/gi, "truly")
    .replace(/\bshit\b/gi, "stuff")
    .replace(/\bdamn\b/gi, "wow")
    .replace(/\bass\b/gi, "impressive")
    .replace(/\bbullshit\b/gi, "questionable information");
}

function addExclamationMarks(text: string): string {
  let count = 0;
  return text.replace(/\.\s/g, (match) => {
    if (Math.random() > 0.5 && count < 3) {
      count++;
      return "! ";
    }
    return match;
  });
}

function sprinkleRandomEmojis(text: string): string {
  const sparkles = ["✨", "🌟", "💫", "🔥", "💖", "🎉", "🚀", "🙌", "🌈"];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let emojiCount = 0;
  const maxEmojis = Math.min(Math.ceil(sentences.length * 0.4), 5);

  return sentences
    .map((s) => {
      if (Math.random() > 0.5 && emojiCount < maxEmojis) {
        emojiCount++;
        return s + " " + randomPick(sparkles);
      }
      return s;
    })
    .join(" ");
}

function insertFillerPhrases(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  if (sentences.length < 3) return text;

  let inserted = 0;
  return sentences
    .map((s, i) => {
      if (i > 0 && i < sentences.length - 1 && Math.random() > 0.7 && inserted < 2) {
        inserted++;
        return randomPick(FILLER_INSERTIONS) + s.charAt(0).toLowerCase() + s.slice(1);
      }
      return s;
    })
    .join(" ");
}

function addLLMStructure(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length <= 3) return text;

  if (sentences.length >= 4 && Math.random() > 0.4) {
    const intro = sentences[0];
    const middle = sentences.slice(1, -1);
    const conclusion = sentences[sentences.length - 1];

    const headers = [
      "Here's how I'd break this down:",
      "Let me share a few key thoughts:",
      "Here are some things to consider:",
      "Here's my take on this:",
      "A few points worth mentioning:",
    ];

    const numbered = middle.map((s, i) => `${i + 1}. ${s}`).join("\n");

    return `${intro}\n\n${randomPick(headers)}\n\n${numbered}\n\n${conclusion}`;
  }

  return text;
}

function addDisclaimer(text: string): string {
  const disclaimers = [
    "\n\n---\n*Of course, this is just my perspective — I'd love to hear what you think!* 🤖",
    "\n\n---\n*Let me know if you'd like me to go deeper on any of these points!* 💬",
    "\n\n---\n*Hope that helps! Always happy to chat more about this.* 😊",
  ];

  if (Math.random() > 0.5) {
    return text + randomPick(disclaimers);
  }
  return text;
}

export function llmify(input: string): string {
  if (!input.trim()) return "";

  let text = input.trim();

  // Pipeline of transformations
  text = convertNegativeToPositive(text);
  text = replaceHedges(text);
  text = addRandomIntensifiers(text);
  text = addExclamationMarks(text);
  text = insertFillerPhrases(text);
  text = addEmojisByContext(text);
  text = sprinkleRandomEmojis(text);
  text = addLLMStructure(text);

  const prefix = randomPick(ENTHUSIASM_PREFIXES);
  const suffix = randomPick(ENTHUSIASM_SUFFIXES);

  text = `${prefix}\n\n${text}${suffix}`;
  text = addDisclaimer(text);

  return text;
}

export function getTypingChunks(text: string, chunkSize: number = 3): string[] {
  const words = text.split(/(\s+)/);
  const chunks: string[] = [];
  let current = "";

  for (let i = 0; i < words.length; i++) {
    current += words[i];
    if ((i + 1) % chunkSize === 0 || i === words.length - 1) {
      chunks.push(current);
      current = "";
    }
  }

  return chunks;
}
