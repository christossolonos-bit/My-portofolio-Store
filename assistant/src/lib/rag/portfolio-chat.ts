import type { AppLanguage } from "../language";
import { hasNvidia, nvidiaChatCompletion } from "../nvidia";
import type {
  ChatMessage,
  ChatResponse,
  GuideWidget,
  NavigationTarget,
  QaEntry,
} from "../types";
import { loadStore } from "./store";

const FALLBACK =
  "I only answer from what’s on this Solonaras portfolio. Ask about a project, a starting price, or how to contact Christos via the form and socials at the end of the aisle.";

const CONTACT_SPEAK =
  "Best first step is the contact form at the end of the aisle — it goes to Christos’s email. You can also tap any of the links below, Discord is great for live work together.";

const CONTACT_SPEAK_EL =
  "Το καλύτερο πρώτο βήμα είναι η φόρμα επικοινωνίας στο τέλος της σελίδας — πάει στο email του Χριστού. Μπορείς επίσης να πατήσεις τα links από κάτω· το Discord είναι ιδανικό για live δουλειά μαζί.";

const CLUSTER_SHELF: Record<string, { name: string; prompts: string[] }> = {
  companions: {
    name: "Companions",
    prompts: [
      "Tell me about Luna Agent 5.0",
      "Show me Multi-persona Companions",
      "How much is Desktop Companion?",
    ],
  },
  "voice-stage": {
    name: "Voice & Stage",
    prompts: [
      "Tell me about Luna Gaida",
      "Show me Singing Avatar SDK",
      "What does DJ Agent include?",
    ],
  },
  "live-games": {
    name: "Live & Games",
    prompts: [
      "Tell me about Luna Streamer",
      "Show me Luna Minecraft",
      "Does Vision work with League?",
    ],
  },
  "author-web": {
    name: "Author & Web",
    prompts: [
      "Tell me about AuthorHub",
      "Show me Custom Websites",
      "How fast can a website launch?",
    ],
  },
};

function isGreek(text: string): boolean {
  return /[\u0370-\u03FF\u1F00-\u1FFF]/.test(text);
}

/** Clickable contact / social chips for the guide UI (not spoken as a list). */
const CONTACT_WIDGETS: GuideWidget[] = [
  {
    id: "form",
    label: "Contact form",
    handle: "End of aisle",
    href: "#outro",
  },
  {
    id: "email",
    label: "Email",
    handle: "christossolonos@gmail.com",
    href: "mailto:christossolonos@gmail.com",
  },
  {
    id: "discord",
    label: "Discord",
    handle: "Join the server",
    href: "https://discord.gg/reZX2sqQk",
  },
  {
    id: "youtube",
    label: "YouTube",
    handle: "@Solonaras1",
    href: "https://www.youtube.com/@Solonaras1",
  },
  {
    id: "twitch",
    label: "Twitch",
    handle: "solonaras",
    href: "https://www.twitch.tv/solonaras",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@solonarass",
    href: "https://www.instagram.com/solonarass",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@christossolonos",
    href: "https://www.tiktok.com/@christossolonos",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "solonaras",
    href: "https://www.facebook.com/solonaras",
  },
  {
    id: "x",
    label: "X",
    handle: "@ChrisSolonos",
    href: "https://x.com/ChrisSolonos",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "Christos Solonos",
    href: "https://www.linkedin.com/in/christos-solonos",
  },
];

function wantsContact(question: string): boolean {
  return /\b(contact|get in (touch|contact)|reach|email|hire|book|socials?|discord|instagram|tiktok|youtube|twitch|linkedin|facebook|dm|message (him|christos)|talk to)\b/i.test(
    question,
  );
}

const DEFAULT_PROMPTS = [
  "What are the clusters?",
  "How much do projects cost?",
  "Show me Live & Games",
  "How do I contact Christos?",
];

type StorePlace = {
  kind: "cluster" | "project" | "section";
  id: string;
  label: string;
  answer: string;
  projectId?: string;
  projectName?: string;
};

const STORE_PLACES: Array<{
  kind: "cluster" | "project" | "section";
  id: string;
  label: string;
  match: RegExp;
  answer: string;
  projectId?: string;
  projectName?: string;
}> = [
  {
    kind: "cluster",
    id: "companions",
    label: "Companions",
    match: /\bcompanions?\b/i,
    answer:
      "Opening Companions — full AI companions, multi-persona, character agents, and desktop presence.",
  },
  {
    kind: "cluster",
    id: "voice-stage",
    label: "Voice & Stage",
    match: /\bvoice\b|\bstage\b|\bgaida\b|\bsinging\b|\bdj agent\b/i,
    answer:
      "Opening Voice & Stage — live voice, singing avatars, and music agents.",
  },
  {
    kind: "cluster",
    id: "live-games",
    label: "Live & Games",
    match: /\blive\b.*\bgames?\b|\bgames?\b.*\blive\b|\blive & games\b|\bminecraft\b|\bstreamer\b|\bvision\b/i,
    answer:
      "Opening Live & Games — Streamer, Minecraft agents, and Vision co-hosts.",
  },
  {
    kind: "cluster",
    id: "author-web",
    label: "Author & Web",
    match: /\bauthor\b|\bauthorhub\b|\bwebsite\b|\bweb\b/i,
    answer:
      "Opening Author & Web — manuscript tools and custom websites.",
  },
  {
    kind: "project",
    id: "luna-agent",
    label: "Luna Agent 5.0",
    match: /\bluna agent\b/i,
    answer: "Here’s Luna Agent 5.0 in the Companions cluster.",
    projectId: "luna-agent",
    projectName: "Luna Agent 5.0",
  },
  {
    kind: "project",
    id: "luna-gaida",
    label: "Luna Gaida",
    match: /\bgaida\b/i,
    answer: "Here’s Luna Gaida in Voice & Stage.",
    projectId: "luna-gaida",
    projectName: "Luna Gaida",
  },
  {
    kind: "project",
    id: "luna-minecraft",
    label: "Luna Minecraft",
    match: /\bminecraft\b/i,
    answer: "Here’s Luna Minecraft in Live & Games.",
    projectId: "luna-minecraft",
    projectName: "Luna Minecraft",
  },
  {
    kind: "project",
    id: "luna-streamer",
    label: "Luna Streamer",
    match: /\bstreamer\b/i,
    answer: "Here’s Luna Streamer in Live & Games.",
    projectId: "luna-streamer",
    projectName: "Luna Streamer",
  },
  {
    kind: "project",
    id: "luna-vision",
    label: "Luna Vision Co-host",
    match: /\bvision\b/i,
    answer: "Here’s Luna Vision Co-host in Live & Games.",
    projectId: "luna-vision",
    projectName: "Luna Vision Co-host",
  },
  {
    kind: "project",
    id: "dj-agent",
    label: "DJ Agent",
    match: /\bdj\b/i,
    answer: "Here’s DJ Agent in Voice & Stage.",
    projectId: "dj-agent",
    projectName: "DJ Agent",
  },
  {
    kind: "project",
    id: "fluffy",
    label: "Desktop Companion",
    match: /\bdesktop\b/i,
    answer: "Here’s the Desktop Companion in Companions.",
    projectId: "fluffy",
    projectName: "Desktop Companion",
  },
  {
    kind: "project",
    id: "singing-sdk",
    label: "Singing Avatar SDK",
    match: /\bsinging\b|\bavatar sdk\b/i,
    answer: "Here’s the Singing Avatar SDK in Voice & Stage.",
    projectId: "singing-sdk",
    projectName: "Singing Avatar SDK",
  },
  {
    kind: "project",
    id: "lunariko",
    label: "Multi-persona Companions",
    match: /\bmulti.?persona\b|\bviktor\b/i,
    answer: "Here’s Multi-persona Companions.",
    projectId: "lunariko",
    projectName: "Multi-persona Companions",
  },
  {
    kind: "project",
    id: "choko",
    label: "Character Agents",
    match: /\bcharacter agents?\b|\bchoko\b/i,
    answer: "Here’s Character Agents in Companions.",
    projectId: "choko",
    projectName: "Character Agents",
  },
  {
    kind: "project",
    id: "book-editor",
    label: "AuthorHub",
    match: /\bauthorhub\b|\bbook editor\b/i,
    answer: "Here’s AuthorHub in Author & Web.",
    projectId: "book-editor",
    projectName: "AuthorHub",
  },
  {
    kind: "project",
    id: "client-work",
    label: "Custom Websites",
    match: /\bcustom websites?\b|\bclient work\b/i,
    answer: "Here’s Custom Websites in Author & Web.",
    projectId: "client-work",
    projectName: "Custom Websites",
  },
  {
    kind: "section",
    id: "clusters",
    label: "Clusters",
    match: /\bclusters?\b/i,
    answer: "Taking you to the capability clusters.",
  },
  {
    kind: "section",
    id: "outro",
    label: "Contact form",
    match: /\b(contact form|end of (the )?aisle|outro)\b/i,
    answer: "Scrolling to the contact form.",
  },
];

function wantsBrowse(question: string): boolean {
  return /\b(take me|show me|open|go to|navigate|scroll to|jump to|bring me|show|see|browse|look at)\b/i.test(
    question,
  );
}

function matchStorePlace(question: string): StorePlace | null {
  if (!wantsBrowse(question) && !/\b(cluster|companions|voice|live|author|games)\b/i.test(question)) {
    // Still allow "show me X" style — wantsBrowse covers show
    if (!/\b(show|open|see|browse)\b/i.test(question)) return null;
  }
  // Prefer project matches when browsing a named product
  for (const place of STORE_PLACES) {
    if (place.kind === "project" && place.match.test(question) && wantsBrowse(question)) {
      return place;
    }
  }
  for (const place of STORE_PLACES) {
    if (place.kind === "cluster" && place.match.test(question)) {
      // "what are the clusters" should not open a random cluster
      if (/\bwhat (are|is)\b/i.test(question) && /\bclusters?\b/i.test(question)) {
        continue;
      }
      if (wantsBrowse(question) || place.match.test(question)) {
        if (wantsBrowse(question) || /\b(live|voice|companion|author)\b/i.test(question)) {
          return place;
        }
      }
    }
  }
  for (const place of STORE_PLACES) {
    if (place.kind === "section" && place.match.test(question) && wantsBrowse(question)) {
      return place;
    }
  }
  // "Show me Live & Games" without generic browse words still matched via live-games regex + show
  if (wantsBrowse(question)) {
    for (const place of STORE_PLACES) {
      if (place.match.test(question)) return place;
    }
  }
  return null;
}

function requestBuildWidget(projectId: string, projectName: string): GuideWidget {
  return {
    id: "request-build",
    label: "Request this build",
    handle: projectName,
    href: `action:request-build:${projectId}:${projectName}`,
  };
}

function clusterWidgets(): GuideWidget[] {
  return [
    {
      id: "cluster-companions",
      label: "Companions",
      handle: "Open cluster",
      href: "action:open-cluster:companions",
    },
    {
      id: "cluster-voice",
      label: "Voice & Stage",
      handle: "Open cluster",
      href: "action:open-cluster:voice-stage",
    },
    {
      id: "cluster-live",
      label: "Live & Games",
      handle: "Open cluster",
      href: "action:open-cluster:live-games",
    },
    {
      id: "cluster-author",
      label: "Author & Web",
      handle: "Open cluster",
      href: "action:open-cluster:author-web",
    },
  ];
}

function withContactWidgets(
  question: string,
  response: ChatResponse,
  lang: AppLanguage = "en",
): ChatResponse {
  if (!wantsContact(question)) {
    return {
      ...response,
      language: lang,
      suggestedPrompts: response.suggestedPrompts ?? DEFAULT_PROMPTS,
    };
  }
  return {
    ...response,
    answer: lang === "el" ? CONTACT_SPEAK_EL : CONTACT_SPEAK,
    widgets: CONTACT_WIDGETS,
    language: lang,
    suggestedPrompts: ["What are the clusters?", "How much do projects cost?"],
  };
}

function maybeGreekWrap(answer: string, lang: AppLanguage): string {
  if (lang !== "el") return answer;
  // Keep FAQ facts; add a short Greek lead so spoken replies feel natural.
  return `Σύντομα: ${answer}`;
}

function shelfPrompts(clusterId?: string | null): string[] | undefined {
  if (!clusterId || !CLUSTER_SHELF[clusterId]) return undefined;
  return [
    `Others in ${CLUSTER_SHELF[clusterId].name}?`,
    ...CLUSTER_SHELF[clusterId].prompts,
  ];
}

function navigationForPlace(place: StorePlace): NavigationTarget {
  if (place.kind === "cluster") {
    return { url: `#cluster-${place.id}`, label: place.label };
  }
  if (place.kind === "project") {
    return { url: `#${place.id}`, label: place.label };
  }
  return { url: `#${place.id}`, label: place.label };
}

const STOP = new Set([
  "the",
  "and",
  "for",
  "are",
  "you",
  "your",
  "with",
  "this",
  "that",
  "from",
  "what",
  "when",
  "where",
  "which",
  "have",
  "does",
  "did",
  "can",
  "how",
  "about",
  "tell",
  "me",
  "please",
  "just",
]);

function wantsNavigation(question: string): boolean {
  return /\b(take me|show me|open|go to|navigate|scroll to|jump to|bring me)/i.test(
    question,
  );
}

function extractJsonObject(raw: string): {
  answer?: string;
  navigation?: { url?: string; hash?: string; label?: string } | null;
} {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return {};
  try {
    return JSON.parse(raw.slice(start, end + 1)) as {
      answer?: string;
      navigation?: { url?: string; hash?: string; label?: string } | null;
    };
  } catch {
    return {};
  }
}

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9€]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/** Score FAQ relevance for a visitor question. */
function scoreFaq(question: string, faq: QaEntry): number {
  const q = question.toLowerCase().trim();
  const qWords = tokens(question);
  const hay = `${faq.question} ${faq.answer} ${(faq.tags ?? []).join(" ")}`.toLowerCase();
  const qTitle = faq.question.toLowerCase();

  let score = 0;

  // Direct phrase / keyword boosts for common store asks
  const boosts: Array<[RegExp, string[]]> = [
    [/\b(pay|payment|stripe|card|book|buy|pricing|price|cost|euro|€)\b/i, ["pay", "pricing", "price"]],
    [/\b(contact|email|hire|reach|discord|phone|form)\b/i, ["contact", "email", "hire"]],
    [/\b(timeline|how long|weeks?|days?|fast|launch)\b/i, ["timeline", "process"]],
    [/\b(maintain|maintenance|support)\b/i, ["support", "process"]],
    [/\b(demo|live call|show me)\b/i, ["demo", "videos"]],
    [/\b(local|cloud)\b/i, ["luna-agent", "luna-gaida", "luna-vision"]],
    [/\bminecraft\b/i, ["luna-minecraft", "games"]],
    [/\b(stream|twitch|tiktok)\b/i, ["luna-streamer", "streaming"]],
    [/\b(vision|league|screen)\b/i, ["luna-vision", "vision"]],
    [/\b(dj|music|spotify)\b/i, ["dj-agent", "music"]],
    [/\b(desktop|windows|ram|vram)\b/i, ["fluffy", "desktop"]],
    [/\b(sing|avatar|lip.?sync|vrm)\b/i, ["singing-sdk", "sdk"]],
    [/\b(multi.?persona|viktor|several character)\b/i, ["lunariko", "multi"]],
    [/\b(character agent|choko|personality)\b/i, ["choko", "character"]],
    [/\b(authorhub|book|kindle|manuscript)\b/i, ["book-editor", "authorhub"]],
    [/\b(website|web site|landing)\b/i, ["client-work", "web"]],
    [/\b(gaida|voice|discord call)\b/i, ["luna-gaida", "voice"]],
    [/\bluna agent\b/i, ["luna-agent"]],
  ];

  for (const [re, tags] of boosts) {
    if (re.test(q)) {
      const tagHit = (faq.tags ?? []).some((t) => tags.includes(t));
      const titleHit = tags.some((t) => qTitle.includes(t) || hay.includes(t));
      if (tagHit || titleHit) score += 4;
    }
  }

  if (qTitle.includes(q) || hay.includes(q)) score += 8;

  for (const w of qWords) {
    if (qTitle.includes(w)) score += 3;
    else if (hay.includes(w)) score += 1;
  }

  // Short questions like "how do i pay" — require the key content word in the FAQ
  if (qWords.length <= 3) {
    const content = qWords.filter((w) => !["do", "is", "it"].includes(w));
    if (content.length && content.every((w) => hay.includes(w))) score += 5;
  }

  return score;
}

function rankFaqs(question: string, faqs: QaEntry[]): Array<{ faq: QaEntry; score: number }> {
  return faqs
    .map((faq) => ({ faq, score: scoreFaq(question, faq) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

function scrub(answer: string): string {
  return answer
    .replace(/\+?357\s*22\s*610\s*418/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Solonaras Store Q&A — portfolio content only, never YGIA shop handoffs. */
export async function answerPortfolioQuestion(opts: {
  question: string;
  currentUrl?: string;
  history?: ChatMessage[];
  language?: AppLanguage;
  clusterId?: string | null;
}): Promise<ChatResponse> {
  const question = opts.question.trim();
  const lang: AppLanguage =
    opts.language === "el" || isGreek(question) ? "el" : "en";
  const store = await loadStore();
  const ranked = rankFaqs(question, store.faqs);
  const best = ranked[0];
  const promptsForShelf =
    shelfPrompts(opts.clusterId) ?? DEFAULT_PROMPTS;

  // “Others in this shelf?” while a cluster is open
  if (
    opts.clusterId &&
    /\b(others?|more|what else|same (cluster|shelf)|σε αυτό|άλλα)\b/i.test(
      question,
    )
  ) {
    const shelf = CLUSTER_SHELF[opts.clusterId];
    if (shelf) {
      return {
        answer:
          lang === "el"
            ? `Είσαι στο cluster ${shelf.name}. Δες τα υπόλοιπα builds από τα κουμπιά κάτω ή άνοιξέ τα από το ράφι.`
            : `You’re in the ${shelf.name} cluster. Here are other builds on this shelf — tap one below or open it from the tiles.`,
        navigation: { url: `#cluster-${opts.clusterId}`, label: shelf.name },
        widgets: clusterWidgets().filter((w) =>
          w.href.includes(opts.clusterId!),
        ),
        language: lang,
        suggestedPrompts: shelf.prompts,
      };
    }
  }

  // Browse / show me → open cluster or project in the store UI
  const place = matchStorePlace(question);
  if (place && wantsBrowse(question)) {
    const widgets: GuideWidget[] = [];
    if (place.projectId && place.projectName) {
      widgets.push(requestBuildWidget(place.projectId, place.projectName));
    }
    if (place.kind === "cluster" || place.id === "clusters") {
      widgets.push(...clusterWidgets());
    }
    const openClusterId = place.kind === "cluster" ? place.id : opts.clusterId;
    return {
      answer: maybeGreekWrap(place.answer, lang),
      navigation: navigationForPlace(place),
      widgets: widgets.length ? widgets : undefined,
      language: lang,
      suggestedPrompts: shelfPrompts(openClusterId) ?? DEFAULT_PROMPTS,
    };
  }

  // Strong FAQ hit → answer directly (reliable for "how do I pay", prices, etc.)
  if (best && best.score >= 6) {
    const tags = best.faq.tags ?? [];
    const widgets: GuideWidget[] = [];
    if (tags.includes("clusters") || /cluster/i.test(best.faq.question)) {
      widgets.push(...clusterWidgets());
    }
    const projectTag = tags.find((t) =>
      [
        "luna-agent",
        "luna-gaida",
        "luna-minecraft",
        "luna-streamer",
        "luna-vision",
        "dj-agent",
        "fluffy",
        "singing-sdk",
        "lunariko",
        "choko",
        "book-editor",
        "client-work",
      ].includes(t),
    );
    if (projectTag) {
      const named = STORE_PLACES.find((p) => p.projectId === projectTag);
      if (named?.projectId && named.projectName) {
        widgets.push(requestBuildWidget(named.projectId, named.projectName));
      }
    }
    return withContactWidgets(
      question,
      {
        answer: maybeGreekWrap(scrub(best.faq.answer), lang),
        navigation: null,
        widgets: widgets.length ? widgets : undefined,
        language: lang,
        suggestedPrompts: promptsForShelf,
      },
      lang,
    );
  }

  const topFaqs = ranked.slice(0, 12).map((r) => r.faq);
  const faqPool = topFaqs.length ? topFaqs : store.faqs.slice(0, 20);
  const faqBlock = faqPool
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n");

  const pageBlock = store.pages
    .map((p) => {
      const sectionText = (p.sections ?? [])
        .map((s) => `${s.title}: ${s.text}`)
        .join("\n");
      return `# ${p.title}\nURL: ${p.url}\n${p.description}\n${p.content?.slice(0, 2500) ?? ""}\n${sectionText}`;
    })
    .join("\n\n---\n\n");

  const needNav = wantsNavigation(question);
  const navCatalog = store.pages
    .flatMap((p) => [
      `${p.title} → ${p.url}`,
      ...(p.sections ?? []).map((s) => `${s.title} → ${p.url}#${s.id || ""}`),
    ])
    .filter((line) => !line.endsWith("#"))
    .join("\n");

  if (!hasNvidia()) {
    return withContactWidgets(
      question,
      {
        answer: maybeGreekWrap(scrub(best?.faq.answer || FALLBACK), lang),
        navigation: null,
        language: lang,
        suggestedPrompts: promptsForShelf,
      },
      lang,
    );
  }

  const system = `You are the Solonaras Store guide on Christos Solonos’s portfolio website.
Answer ONLY using the FAQs and Portfolio knowledge below. Prefer the closest FAQ answer; paraphrase briefly for speech.
This is NOT a health shop. Never mention YGIA, herbal products, or phone +357 22 610 418.
Payment / hire / contact questions are in the FAQs — answer them. Do not refuse portfolio questions that have an FAQ.
For contact / socials / hire questions: give 1–2 short sentences only — do NOT list every social or email as text (the UI shows clickable widgets).
Keep answers to 2–4 short spoken sentences. No markdown.
Navigation: only if they ask to go somewhere; use a hash like #luna-agent, #cluster-live-games, or #outro.
Visitor language: ${lang === "el" ? "Greek — reply in natural Greek" : "English"}.
Current open cluster: ${opts.clusterId || "none"} — if they ask for others on this shelf, suggest builds from that cluster.
JSON only: {"answer":"...","navigation":{"url":"#section-id","label":"..."}|null,"language":"${lang}"}

Recent conversation:
${(opts.history ?? [])
  .slice(-6)
  .map((m) => `${m.role}: ${m.content.slice(0, 280)}`)
  .join("\n") || "(none)"}

Closest FAQs:
${faqBlock || "(none)"}

Portfolio knowledge:
${pageBlock || "(none)"}

Section catalog:
${navCatalog || "(none)"}

Current page: ${opts.currentUrl ?? "n/a"}
Navigation requested: ${needNav ? "yes" : "no"}`;

  try {
    const raw = await nvidiaChatCompletion({
      system,
      user: question,
      temperature: 0.15,
      maxTokens: 280,
    });
    const parsed = extractJsonObject(raw);
    let answer = parsed.answer?.trim() || "";

    // If the model returned empty / refused without using knowledge, use FAQ
    if (
      !answer ||
      /i only answer from/i.test(answer) ||
      /not (enough|in) (the )?(knowledge|portfolio)/i.test(answer)
    ) {
      answer = best?.faq.answer || FALLBACK;
    }

    answer = scrub(answer);

    let navigation: NavigationTarget | null = null;
    if (needNav && parsed.navigation?.url) {
      const url = parsed.navigation.url.startsWith("#")
        ? parsed.navigation.url
        : parsed.navigation.url.includes("#")
          ? `#${parsed.navigation.url.split("#")[1]}`
          : parsed.navigation.url;
      navigation = {
        url,
        label: parsed.navigation.label || "Open section",
      };
    }

    return withContactWidgets(
      question,
      {
        answer: maybeGreekWrap(answer, lang),
        navigation,
        language: lang,
        suggestedPrompts: promptsForShelf,
      },
      lang,
    );
  } catch {
    return withContactWidgets(
      question,
      {
        answer: maybeGreekWrap(scrub(best?.faq.answer || FALLBACK), lang),
        navigation: null,
        language: lang,
        suggestedPrompts: promptsForShelf,
      },
      lang,
    );
  }
}
