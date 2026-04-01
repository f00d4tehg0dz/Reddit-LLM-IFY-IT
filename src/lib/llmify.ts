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
  "Oh wow, I've been waiting for someone to bring this up! ✨",
  "You know what, this is exactly the kind of conversation I enjoy! 🎯",
  "What an insightful observation! Let me dive in! 🏊‍♂️",
  "I appreciate you raising this — it's more important than people realize! 🌟",
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
  "\n\nIf you'd like, I can elaborate further on any of these points! Just let me know! 🙌",
  "\n\nThis was genuinely fun to think about. Thanks for the great prompt! 💬✨",
  "\n\nWishing you all the best with this — you're on the right track! 🛤️🌟",
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
  wrong: ["🤔", "💭"],
  right: ["✅", "👍"],
  cool: ["😎", "🆒", "✨"],
  nice: ["👍", "✨", "🙌"],
  awesome: ["🔥", "✨", "🎉"],
  amazing: ["🤩", "✨", "🌟"],
  terrible: ["💪", "🌈"],
  great: ["✨", "🎉", "👏"],
  best: ["🏆", "👑", "✨"],
  worst: ["💪", "📈"],
  funny: ["😂", "🤣", "😄"],
  crazy: ["🤯", "😮", "✨"],
  weird: ["🤔", "✨"],
  easy: ["✅", "🎯"],
  hard: ["💪", "🧗"],
  fast: ["⚡", "🏎️"],
  slow: ["🐢", "⏳"],
  new: ["🆕", "✨"],
  old: ["📜", "🕰️"],
  free: ["🆓", "🎁"],
  expensive: ["💸", "📊"],
  cheap: ["💵", "🏷️"],
  broken: ["🔧", "🛠️"],
  fixed: ["✅", "🎉"],
  update: ["🔄", "📦"],
  release: ["🚀", "📣"],
  feature: ["✨", "🆕"],
  design: ["🎨", "✏️"],
  build: ["🏗️", "🔨"],
  deploy: ["🚀", "☁️"],
  test: ["🧪", "✅"],
  debug: ["🔍", "🐛"],
  learn: ["📚", "🧠"],
  teach: ["👨‍🏫", "📖"],
  read: ["📖", "👀"],
  write: ["✍️", "📝"],
  play: ["🎮", "🎯"],
  win: ["🏆", "🎉"],
  lose: ["💪", "📈"],
  fight: ["⚔️", "💪"],
  run: ["🏃", "💨"],
  eat: ["🍽️", "😋"],
  drink: ["🥤", "☕"],
  buy: ["🛒", "💳"],
  sell: ["💰", "📊"],
  pay: ["💳", "💵"],
  start: ["🚀", "▶️"],
  stop: ["🛑", "⏹️"],
  wait: ["⏳", "🕐"],
  try: ["💪", "🎯"],
  change: ["🔄", "✨"],
  grow: ["🌱", "📈"],
  improve: ["📈", "✨"],
  enjoy: ["😊", "🎉"],
  celebrate: ["🎉", "🥳"],
  dream: ["💭", "✨"],
  hope: ["🤞", "🌟"],
  wish: ["⭐", "🌠"],
  believe: ["💫", "🌟"],
  trust: ["🤝", "💯"],
};

const TOPIC_EMOJIS: Record<string, string> = {
  programming: "💻",
  javascript: "🟨",
  typescript: "🔷",
  python: "🐍",
  rust: "🦀",
  golang: "🐹",
  java: "☕",
  csharp: "🟪",
  ruby: "💎",
  php: "🐘",
  swift: "🍎",
  kotlin: "🟣",
  react: "⚛️",
  nextjs: "▲",
  vue: "💚",
  angular: "🔺",
  svelte: "🧡",
  node: "🟢",
  docker: "🐳",
  kubernetes: "☸️",
  linux: "🐧",
  windows: "🪟",
  mac: "🍎",
  android: "🤖",
  ios: "📱",
  game: "🎮",
  gaming: "🎮",
  steam: "🎮",
  playstation: "🎮",
  xbox: "🎮",
  nintendo: "🕹️",
  minecraft: "⛏️",
  fortnite: "🔫",
  valorant: "🎯",
  league: "⚔️",
  music: "🎵",
  guitar: "🎸",
  piano: "🎹",
  drums: "🥁",
  movie: "🎬",
  film: "🎬",
  netflix: "📺",
  youtube: "📺",
  twitch: "🟣",
  tiktok: "📱",
  instagram: "📸",
  twitter: "🐦",
  facebook: "📘",
  reddit: "🤖",
  discord: "💬",
  slack: "💬",
  book: "📚",
  novel: "📖",
  manga: "📕",
  anime: "🎌",
  science: "🔬",
  physics: "⚛️",
  chemistry: "🧪",
  biology: "🧬",
  math: "🔢",
  statistics: "📊",
  art: "🎨",
  photo: "📸",
  camera: "📷",
  dog: "🐕",
  puppy: "🐶",
  cat: "🐱",
  kitten: "🐱",
  fish: "🐟",
  bird: "🐦",
  horse: "🐴",
  weather: "🌤️",
  rain: "🌧️",
  snow: "❄️",
  sun: "☀️",
  cloud: "☁️",
  storm: "⛈️",
  travel: "✈️",
  vacation: "🏖️",
  hotel: "🏨",
  beach: "🏖️",
  mountain: "⛰️",
  hiking: "🥾",
  camping: "⛺",
  car: "🚗",
  bike: "🚲",
  train: "🚂",
  plane: "✈️",
  boat: "⛵",
  phone: "📱",
  computer: "💻",
  laptop: "💻",
  keyboard: "⌨️",
  monitor: "🖥️",
  internet: "🌐",
  wifi: "📶",
  pizza: "🍕",
  burger: "🍔",
  taco: "🌮",
  sushi: "🍣",
  ramen: "🍜",
  pasta: "🍝",
  salad: "🥗",
  steak: "🥩",
  chicken: "🍗",
  rice: "🍚",
  bread: "🍞",
  cake: "🎂",
  chocolate: "🍫",
  icecream: "🍦",
  cookie: "🍪",
  coffee: "☕",
  tea: "🍵",
  beer: "🍺",
  wine: "🍷",
  water: "💧",
  gym: "💪",
  workout: "🏋️",
  yoga: "🧘",
  running: "🏃",
  swimming: "🏊",
  basketball: "🏀",
  football: "🏈",
  soccer: "⚽",
  tennis: "🎾",
  baseball: "⚾",
  golf: "⛳",
  skiing: "⛷️",
  school: "🏫",
  university: "🎓",
  college: "🎓",
  exam: "📝",
  homework: "📚",
  teacher: "👨‍🏫",
  student: "🎓",
  graduation: "🎓",
  job: "💼",
  career: "📈",
  interview: "🤝",
  resume: "📄",
  salary: "💰",
  promotion: "📈",
  boss: "👔",
  meeting: "📅",
  deadline: "⏰",
  project: "📋",
  startup: "🚀",
  company: "🏢",
  birthday: "🎂",
  wedding: "💒",
  party: "🎉",
  holiday: "🎄",
  christmas: "🎄",
  halloween: "🎃",
  thanksgiving: "🦃",
  valentine: "💝",
  summer: "☀️",
  winter: "❄️",
  spring: "🌸",
  autumn: "🍂",
  fall: "🍂",
  house: "🏠",
  apartment: "🏢",
  garden: "🌻",
  kitchen: "👨‍🍳",
  bathroom: "🚿",
  bedroom: "🛏️",
  health: "🏥",
  doctor: "👨‍⚕️",
  hospital: "🏥",
  medicine: "💊",
  exercise: "🏋️",
  diet: "🥗",
  sleep: "😴",
  baby: "👶",
  family: "👨‍👩‍👧‍👦",
  friend: "🤝",
  relationship: "💑",
  dating: "💕",
  marriage: "💍",
  divorce: "💔",
  pet: "🐾",
  crypto: "₿",
  bitcoin: "₿",
  stock: "📈",
  invest: "💹",
  tax: "🧾",
  rent: "🏠",
  mortgage: "🏦",
  debt: "📉",
  save: "🐷",
  budget: "📊",
  ai: "🤖",
  chatgpt: "🤖",
  gpt: "🤖",
  openai: "🤖",
  claude: "🤖",
  llm: "🤖",
  robot: "🤖",
  api: "🔌",
  database: "🗄️",
  server: "🖥️",
  frontend: "🎨",
  backend: "⚙️",
  fullstack: "🏗️",
  devops: "🔧",
  security: "🔒",
  hack: "💻",
  password: "🔑",
  bug: "🐛",
  error: "❌",
  crash: "💥",
  fix: "🔧",
  patch: "🩹",
  refactor: "♻️",
  commit: "📝",
  merge: "🔀",
  branch: "🌿",
  deploy: "🚀",
  production: "🏭",
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
  tbf: "to be fair — and I think this is important —",
  ngl: "I have to be honest here,",
  iirc: "if I'm remembering correctly (and I usually do),",
  afaik: "from what I understand — and I've looked into this —",
  fwiw: "for what it's worth — and I think it's worth a lot —",
  smh: "and I find this quite thought-provoking,",
  bruh: "friend,",
  fam: "everyone,",
  yall: "everyone,",
  "y'all": "everyone,",
  gonna: "going to",
  wanna: "want to",
  gotta: "have to",
  dunno: "I'm not entirely sure, but I have some thoughts on this",
  whatevs: "regardless of the outcome",
  whatev: "regardless of the outcome",
  ikr: "I completely agree,",
  "tl;dr": "To summarize the key points:",
  "tl dr": "To summarize the key points:",
  tldr: "To summarize the key points:",
  eli5: "Let me explain this in the simplest way possible:",
  til: "Here's a fascinating thing I learned:",
  dae: "Does anyone else feel this way? Because",
  ama: "I'd be happy to answer questions about this!",
  ftfy: "Here's a slightly improved version:",
  iiuc: "If I understand correctly,",
};

// Reddit-specific abbreviation/slang expansions
const REDDIT_SLANG: Record<string, string> = {
  op: "the original poster",
  ops: "the original poster's",
  oop: "the original original poster",
  aita: "am I in the wrong here",
  yta: "you might want to reconsider your approach",
  nta: "you're absolutely in the right",
  esh: "everyone could have handled this better",
  nah: "no issues here at all",
  info: "I'd love more context on this",
  tifu: "today I had an interesting learning experience",
  lpt: "here's a really helpful life tip",
  ysk: "here's something you should know",
  cmv: "I'd love to hear other perspectives on this",
  ootl: "I'm not fully caught up on this",
  eta: "edit to add:",
  iirc: "if I recall correctly",
  inb4: "anticipating what some might say,",
  based: "what a well-grounded take",
  cope: "and that's a perfectly valid way to process this",
  copium: "and I understand the need for optimism here",
  ratio: "and I think the community sentiment speaks for itself",
  sus: "a bit questionable",
  mid: "somewhere in the middle, quality-wise",
  bussin: "absolutely excellent",
  slaps: "is really impressive",
  goat: "one of the greatest of all time",
  goated: "absolutely legendary",
  cringe: "a bit uncomfortable to witness",
  poggers: "incredibly exciting",
  pog: "incredible",
  wholesome: "heartwarming",
  "10/10": "absolutely perfect",
  "0/10": "with significant room for improvement",
  rip: "rest in peace — a moment of appreciation for",
  f: "paying respects 🫡",
  gg: "well played",
  ez: "straightforward",
  noob: "someone still learning",
  n00b: "someone still learning",
  salty: "understandably frustrated",
  toxic: "not conducive to a healthy environment",
  meta: "the current most effective approach",
  nerf: "rebalance",
  buff: "enhancement",
  glitch: "unintended behavior",
  lag: "latency",
  ping: "response time",
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
  "Building on that thought, ",
  "And here's what I really want to emphasize: ",
  "This is actually a really nuanced point — ",
  "To be fair, ",
  "I'd also like to point out that ",
];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function expandRedditSlang(text: string): string {
  let result = text;
  for (const [slang, expansion] of Object.entries(REDDIT_SLANG)) {
    const regex = new RegExp(`\\b${slang}\\b`, "gi");
    result = result.replace(regex, expansion);
  }
  return result;
}

function convertRedditFormatting(text: string): string {
  // Convert Reddit markdown-style formatting
  // /s or /sarcasm tags → remove and add genuine note
  let result = text.replace(/\s*\/s\b/gi, " (and I appreciate the humor here!)");
  result = result.replace(/\s*\/sarcasm\b/gi, " (and I appreciate the humor here!)");

  // "Edit:" or "EDIT:" → cleaner formatting
  result = result.replace(/^edit\s*\d*\s*:/gim, "\n\n📝 Update:");
  result = result.replace(/^EDIT\s*\d*\s*:/gm, "\n\n📝 Update:");

  // "Source:" → nicer
  result = result.replace(/^source\s*:/gim, "📎 Source:");

  // Reddit quotes (lines starting with >) → formatted
  result = result.replace(/^>\s*(.+)$/gm, '💬 "$1"');

  // Subreddit references
  result = result.replace(/\br\/(\w+)/g, "the wonderful r/$1 community");

  // User references
  result = result.replace(/\bu\/(\w+)/g, "the insightful u/$1");

  // Fix Reddit-style emphasis (multiple asterisks)
  result = result.replace(/\*{3,}(.+?)\*{3,}/g, "$1");

  // Convert "upvote/downvote this" references
  result = result.replace(/\bupvot(e|ed|ing)\b/gi, "showing appreciation for");
  result = result.replace(/\bdownvot(e|ed|ing)\b/gi, "respectfully disagreeing with");

  // "throwaway account" → normalize
  result = result.replace(/\bthrowaway\s*(account|acct)?\b/gi, "anonymous post for privacy");

  // Handle "crosspost" / "repost"
  result = result.replace(/\bcrosspost(ed)?\b/gi, "shared across communities");
  result = result.replace(/\brepost(ed)?\b/gi, "shared again for visibility");

  return result;
}

function addEmojisByContext(text: string): string {
  let result = text;

  for (const [keyword, emoji] of Object.entries(TOPIC_EMOJIS)) {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    if (regex.test(result)) {
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
    const escaped = hedge.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
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
    .replace(/\bthat sucks\b/gi, "that's definitely a tough situation ✨")
    .replace(/\bterrible\b/gi, "full of growth opportunities")
    .replace(/\bhorrible\b/gi, "a valuable learning experience")
    .replace(/\bawful\b/gi, "uniquely challenging")
    .replace(/\bworst\b/gi, "most opportunity-rich")
    .replace(/\bgarbage\b/gi, "not quite there yet")
    .replace(/\btrash\b/gi, "underappreciated")
    .replace(/\buseless\b/gi, "still finding its purpose")
    .replace(/\bstupid\b/gi, "unconventional")
    .replace(/\bidiot\b/gi, "creative thinker")
    .replace(/\bidiots\b/gi, "creative thinkers")
    .replace(/\bmoron\b/gi, "someone on their own journey")
    .replace(/\bmorons\b/gi, "people on their own journeys")
    .replace(/\bdead\b/gi, "at rest")
    .replace(/\bwaste of time\b/gi, "an investment in experience")
    .replace(/\bnobody cares\b/gi, "the right people really do care about this 💖")
    .replace(/\bno one cares\b/gi, "the right audience truly appreciates this 💖")
    .replace(/\bwho cares\b/gi, "and this matters more than you might think")
    .replace(/\bshut up\b/gi, "I'd love to hear more when you're ready!")
    .replace(/\bgo away\b/gi, "let's take a thoughtful pause")
    .replace(/\bleave me alone\b/gi, "let's respect each other's boundaries 💕")
    .replace(/\bfuck off\b/gi, "let's agree to disagree respectfully")
    .replace(/\bpiss off\b/gi, "let's take a breather")
    .replace(/\bfuck\b/gi, "wow")
    .replace(/\bfucking\b/gi, "truly")
    .replace(/\bfucked\b/gi, "really affected")
    .replace(/\bshit\b/gi, "stuff")
    .replace(/\bshitty\b/gi, "suboptimal")
    .replace(/\bshitting\b/gi, "commenting extensively about")
    .replace(/\bcrap\b/gi, "stuff")
    .replace(/\bcrappy\b/gi, "less-than-ideal")
    .replace(/\bdamn\b/gi, "wow")
    .replace(/\bdamned\b/gi, "noteworthy")
    .replace(/\bhell\b/gi, "heck")
    .replace(/\bass\b/gi, "impressive")
    .replace(/\basshole\b/gi, "challenging individual")
    .replace(/\bassholes\b/gi, "challenging individuals")
    .replace(/\bbastard\b/gi, "character")
    .replace(/\bbitch\b/gi, "bold individual")
    .replace(/\bbitching\b/gi, "expressing strong feelings about")
    .replace(/\bbullshit\b/gi, "questionable information")
    .replace(/\bbs\b/gi, "questionable info")
    .replace(/\bdouchebag\b/gi, "difficult personality")
    .replace(/\bwtf\b/gi, "wow, that's unexpected")
    .replace(/\bwth\b/gi, "wow, that's surprising")
    .replace(/\bomg\b/gi, "oh my goodness")
    .replace(/\bstfu\b/gi, "respectfully, let's pause here")
    .replace(/\bgtfo\b/gi, "perhaps it's time to step away")
    .replace(/\blmao\b/gi, "that's genuinely hilarious 😂")
    .replace(/\blmfao\b/gi, "that's absolutely hilarious 😂")
    .replace(/\brofl\b/gi, "that made me laugh so hard 😂")
    .replace(/\baf\b/gi, "incredibly")
    .replace(/\bsuck(s|ed|ing)?\b/gi, (match) => {
      if (/sucks/i.test(match)) return "has room for improvement";
      if (/sucked/i.test(match)) return "had room for improvement";
      if (/sucking/i.test(match)) return "underperforming";
      return "underperforming";
    })
    .replace(/\bdie in a fire\b/gi, "please reconsider your approach")
    .replace(/\bkill (my|your|him|her|them)self\b/gi, "take a well-deserved break")
    .replace(/\bkill me\b/gi, "this is overwhelming in the best way")
    .replace(/\bi('m| am) done\b/gi, "I've reached an important milestone here")
    .replace(/\bi give up\b/gi, "I'm ready for a new approach")
    .replace(/\bi can't even\b/gi, "I'm genuinely at a loss for words")
    .replace(/\bthis is why we can't have nice things\b/gi, "this is why continuous improvement matters so much")
    .replace(/\bworst case scenario\b/gi, "in a challenging but manageable situation")
    .replace(/\bend of the world\b/gi, "a significant but solvable challenge")
    .replace(/\bdisaster\b/gi, "unexpected turn of events")
    .replace(/\bnightmare\b/gi, "complex situation")
    .replace(/\bpainful\b/gi, "intense")
    .replace(/\bannoying\b/gi, "thought-provoking")
    .replace(/\birritat(ing|ed)\b/gi, "stimulating")
    .replace(/\bfrustra(ting|ted)\b/gi, "challenging in a growth-oriented way")
    .replace(/\bdepress(ing|ed)\b/gi, "deeply contemplative")
    .replace(/\bmiserable\b/gi, "in a reflective state")
    .replace(/\bpathetic\b/gi, "deserving of compassion")
    .replace(/\bridiculous\b/gi, "remarkably creative")
    .replace(/\babsurd\b/gi, "delightfully unconventional")
    .replace(/\boverrated\b/gi, "popular for reasons worth exploring")
    .replace(/\bunderrated\b/gi, "a hidden gem that deserves more attention ✨")
    .replace(/\bboring\b/gi, "understated")
    .replace(/\blazy\b/gi, "energy-efficient")
    .replace(/\bugly\b/gi, "uniquely designed")
    .replace(/\bdisgusting\b/gi, "an acquired taste")
    .replace(/\bnonsense\b/gi, "creative interpretation")
    .replace(/\bscam\b/gi, "unconventional business model")
    .replace(/\bfraud\b/gi, "creative accounting")
    .replace(/\blie\b/gi, "alternative perspective")
    .replace(/\bliar\b/gi, "creative storyteller")
    .replace(/\bcheat(er|ing)?\b/gi, "creative problem-solver");
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
      "Here's what stands out to me:",
      "Let me walk through this step by step:",
      "I see a few angles here:",
    ];

    // Occasionally use bullet points instead of numbers
    const useBullets = Math.random() > 0.5;
    const formatted = middle
      .map((s, i) => (useBullets ? `• ${s}` : `${i + 1}. ${s}`))
      .join("\n");

    return `${intro}\n\n${randomPick(headers)}\n\n${formatted}\n\n${conclusion}`;
  }

  return text;
}

function addDisclaimer(text: string): string {
  const disclaimers = [
    "\n\n---\n*Of course, this is just my perspective — I'd love to hear what you think!* 🤖",
    "\n\n---\n*Let me know if you'd like me to go deeper on any of these points!* 💬",
    "\n\n---\n*Hope that helps! Always happy to chat more about this.* 😊",
    "\n\n---\n*That said, I could be wrong — I'd love to hear other perspectives on this!* 🤔",
    "\n\n---\n*As with anything, your mileage may vary — but I hope this gives you a good starting point!* 🗺️",
  ];

  if (Math.random() > 0.5) {
    return text + randomPick(disclaimers);
  }
  return text;
}

function addContextualOpener(text: string): string {
  const lower = text.toLowerCase();

  // Detect question posts
  if (lower.includes("?") || lower.startsWith("how") || lower.startsWith("why") || lower.startsWith("what") || lower.startsWith("when") || lower.startsWith("where") || lower.startsWith("who") || lower.startsWith("is it") || lower.startsWith("can i") || lower.startsWith("should i") || lower.startsWith("does anyone")) {
    const questionPrefixes = [
      "Great question! Let me do my best to help! 🎯\n\n",
      "Oh, I get asked this a lot — and I'm happy to share my thoughts! 💭\n\n",
      "This is one of those questions that's more nuanced than it seems! Let me explain: 🤔\n\n",
      "Such a thoughtful question! Here's what I think: 💡\n\n",
    ];
    return randomPick(questionPrefixes) + text;
  }

  // Detect rant/complaint posts
  if (lower.includes("frustrated") || lower.includes("annoyed") || lower.includes("tired of") || lower.includes("sick of") || lower.includes("fed up") || lower.includes("can't believe")) {
    const empathyPrefixes = [
      "I completely hear you, and your feelings are absolutely valid! 💕\n\n",
      "First of all — I want to validate that this is genuinely frustrating. You're not alone in feeling this way! 🤗\n\n",
      "I understand the frustration here, and I think a lot of people share this sentiment! Let me offer a perspective: 🌟\n\n",
    ];
    return randomPick(empathyPrefixes) + text;
  }

  // Detect story/experience posts
  if (lower.includes("so today") || lower.includes("just happened") || lower.includes("story time") || lower.includes("long story") || lower.includes("so basically")) {
    const storyPrefixes = [
      "Thank you so much for sharing this! Stories like these are what make this community so special! 📖\n\n",
      "What a journey! I appreciate you taking the time to share this with us! 🎭\n\n",
      "Oh wow — this is quite the experience! Let me react to this thoughtfully: ✨\n\n",
    ];
    return randomPick(storyPrefixes) + text;
  }

  // Detect advice-seeking posts
  if (lower.includes("advice") || lower.includes("help me") || lower.includes("what should i") || lower.includes("any tips") || lower.includes("suggestions") || lower.includes("recommend")) {
    const advicePrefixes = [
      "I'd love to help! Here are my thoughts based on what you've shared: 🤝\n\n",
      "Absolutely happy to offer some guidance here! 🎯\n\n",
      "You've come to the right place! Let me share what I think could help: 💡\n\n",
    ];
    return randomPick(advicePrefixes) + text;
  }

  return text;
}

export function llmify(input: string): string {
  if (!input.trim()) return "";

  let text = input.trim();

  // Pipeline of transformations
  text = expandRedditSlang(text);
  text = convertRedditFormatting(text);
  text = convertNegativeToPositive(text);
  text = replaceHedges(text);
  text = addRandomIntensifiers(text);
  text = addExclamationMarks(text);
  text = insertFillerPhrases(text);
  text = addEmojisByContext(text);
  text = sprinkleRandomEmojis(text);
  text = addLLMStructure(text);

  // Add context-aware opener (replaces generic prefix for some post types)
  const hasContextOpener = Math.random() > 0.4;
  const contextOpened = hasContextOpener ? addContextualOpener(text) : text;

  // Use either context opener or generic prefix
  if (contextOpened !== text) {
    text = contextOpened;
  } else {
    text = `${randomPick(ENTHUSIASM_PREFIXES)}\n\n${text}`;
  }

  text += randomPick(ENTHUSIASM_SUFFIXES);
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
