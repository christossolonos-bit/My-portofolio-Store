import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = path.join(root, 'data')
const storePath = path.join(dataDir, 'knowledge.json')

function faq(id, question, answer, tags = []) {
  return { id, question, answer, language: 'en', tags }
}

// Answers grounded in Christos’s questionnaire + store project data.
const faqs = [
  // —— General ——
  faq(
    'faq-what',
    'What is Solonaras Store?',
    'Solonaras Store is Christos Solonos’s portfolio of AI companions, voice systems, game agents, desktop apps, music bots, websites, local automation, and related AI builds. Capabilities are grouped into four clusters — Companions, Voice & Stage, Live & Games, and Author & Web. Open a cluster, pick a build, watch the tour, or ask this guide.',
    ['about', 'store'],
  ),
  faq(
    'faq-clusters',
    'How is the store organized / what are the clusters?',
    'Four clusters: Companions (Luna Agent, multi-persona, character agents, desktop), Voice & Stage (Gaida, singing avatars, DJ), Live & Games (Streamer, Minecraft, Vision), and Author & Web (AuthorHub, custom websites). Each cluster card summarizes what’s inside and from what price.',
    ['about', 'store', 'clusters'],
  ),
  faq(
    'faq-hire-for',
    'What should I hire Christos for / what do you build?',
    'AI video editing, companions, assistants, UI setups, music bots, websites, local automation — and anything that needs a practical AI solution he knows how to build.',
    ['about', 'hire'],
  ),
  faq(
    'faq-guide',
    'What can you help me with?',
    'Ask about any project, starting prices, what’s included, timelines, customization, demos, or how to hire Christos. Type or use the mic.',
    ['guide'],
  ),
  faq(
    'faq-location',
    'Where is Christos based / do you work remote?',
    'Christos is based in Cyprus and works remotely on these projects for now. Meetups can happen on his days off from other work when that fits.',
    ['about', 'contact'],
  ),
  faq(
    'faq-reply-time',
    'How fast do you reply after the contact form?',
    'Usually within a day or two — as soon as he’s home and sees the message.',
    ['contact', 'process'],
  ),
  faq(
    'faq-languages',
    'What languages do you work in?',
    'English and Greek. Greek is harder for voice agents, so English is usually smoother for spoken builds.',
    ['about', 'voice'],
  ),
  faq(
    'faq-wont-build',
    'Is there anything you won’t build?',
    'He doesn’t take on builds he doesn’t know how to deliver.',
    ['about', 'hire'],
  ),
  faq(
    'faq-contact',
    'How do I contact Christos / get in touch / email / hire / book?',
    'Best first step for serious buyers: the contact form at the end of the aisle (name, email, phone, idea) — it goes to christossolonos@gmail.com. You can also message on Discord https://discord.gg/reZX2sqQk, YouTube @Solonaras1, Twitch solonaras, Instagram @solonarass, TikTok @christossolonos, Facebook solonaras, X @ChrisSolonos, or LinkedIn Christos Solonos. No public phone number. Discord is especially handy if you want to stream live while working together.',
    ['contact', 'email', 'hire'],
  ),
  faq(
    'faq-not-ygia',
    'Is this YGIA or a health shop?',
    'No. This is Solonaras Store — Christos’s AI portfolio. It is not YGIA Natural Health and has no herbalist phone line.',
    ['about'],
  ),
  faq(
    'faq-prices',
    'How much do projects cost / starting prices?',
    'Starting prices in euros: Custom Websites €900, Character Agents €1,400, Desktop Companion €1,500, Singing Avatar SDK €1,600, Luna Gaida €1,800, DJ Agent €2,000, Luna Minecraft €2,200, AuthorHub €2,400, Luna Streamer €2,800, Luna Vision Co-host €3,200, Multi-persona €3,500, Luna Agent 5.0 €4,500. Final quotes depend on scope. Changes after the bought setup cost extra.',
    ['pricing'],
  ),
  faq(
    'faq-timeline',
    'What’s the timeline / how long does a build take?',
    'It depends on the work and needs — typically from about a week to about a month. Starter websites can be as fast as around three days for the included scope.',
    ['timeline', 'process'],
  ),
  faq(
    'faq-maintain',
    'Do you maintain it after launch?',
    'Yes — if you ask him to check or maintain something, he offers that. Maintenance and material management can also be extras on website builds.',
    ['support', 'process'],
  ),
  faq(
    'faq-need-from-me',
    'What do I need to provide / APIs / hosting / assets?',
    'Whatever the build needs to run — that differs for a static site versus an agent. Also your product information and any documents you want included. For agents you often need your own API keys from day one; for multi-persona you provide the avatars.',
    ['process'],
  ),
  faq(
    'faq-start-small',
    'Can I start smaller and upgrade later?',
    'Yes — you can start small. There are no named packages yet; scope is agreed per project.',
    ['process', 'pricing'],
  ),
  faq(
    'faq-pay',
    'How do I pay / book a project?',
    'Start with the store contact form or Discord — agree on scope first. When a build is linked in Shopify, you can also buy the starting setup with card checkout there; Christos sets it up after payment. Changes after setup cost extra.',
    ['hire', 'pricing'],
  ),
  faq(
    'faq-demo',
    'Can you show a live demo of this?',
    'Each aisle has a click-to-play product tour. Christos also offers live calls. Note: the store services are still concept / early — demos clarify what’s ready for your use case.',
    ['videos', 'demo'],
  ),
  faq(
    'faq-maturity',
    'Are these products finished or early concepts?',
    'They are concept / early. Aisle tours and live calls show what exists; final delivery is scoped to your needs.',
    ['about', 'demo'],
  ),
  faq(
    'faq-videos',
    'How do I watch the project videos?',
    'Each aisle tour starts automatically when you scroll to that project (muted at first — tap Unmute for sound). You can also use the video controls.',
    ['videos'],
  ),
  faq(
    'faq-custom',
    'Can you build something custom for me?',
    'Yes. Use the end-of-aisle form with your idea, or message on Discord / socials. He’ll try anything he knows how to build.',
    ['hire', 'custom'],
  ),

  // —— Luna Agent 5.0 ——
  faq(
    'faq-luna-agent-include',
    'What does Luna Agent 5.0 / full companion actually include?',
    'A full working prototype for your needs — conversational companion stack with profiles, speech, social tools, and avatar presence as scoped. Heavy customization is extra. Starting at €4,500.',
    ['luna-agent', 'project'],
  ),
  faq(
    'faq-luna-agent-local',
    'Does Luna Agent run locally or in the cloud?',
    'Mostly local by default. Cloud is available if you want it and you pay for your own cloud services.',
    ['luna-agent'],
  ),
  faq(
    'faq-luna-agent-brand',
    'Can Luna Agent match my brand or personality?',
    'Yes — it depends on what you want. Personality and brand tuning are part of customization (often extra beyond the base prototype).',
    ['luna-agent'],
  ),
  faq(
    'faq-luna-agent-vs-chatgpt',
    'How is Luna Agent different from ChatGPT?',
    'ChatGPT keeps your information and limits usage. These products, when built local, are meant to be yours without those same limits — a companion stack around your workflow, not a generic chat box.',
    ['luna-agent'],
  ),
  faq(
    'faq-luna-agent-price',
    'What’s included in the Luna Agent €4,500 starting price?',
    '€4,500 starts a full working prototype for your needs. Further customization is quoted separately.',
    ['luna-agent', 'pricing'],
  ),

  // —— Luna Gaida ——
  faq(
    'faq-gaida-discord',
    'Does Luna Gaida work in Discord only or other apps too?',
    'Discord, websites, and PC apps — not Discord-only. Starting at €1,800.',
    ['luna-gaida', 'voice'],
  ),
  faq(
    'faq-gaida-natural',
    'How natural does the Gaida voice sound / what voice stack?',
    'Edge TTS when you want fully local; Fish Audio when you’re fine with an API. Quality depends on that choice and your machine.',
    ['luna-gaida'],
  ),
  faq(
    'faq-gaida-latency',
    'Gaida latency — can it keep up in a live call?',
    'Depends on your PC. On a server setup, expect around three seconds. Say live Discord or call use when you inquire so it’s scoped for real-time.',
    ['luna-gaida'],
  ),
  faq(
    'faq-gaida-keys',
    'Do I need my own API keys or hosting for Gaida?',
    'Yes — you need your own API keys from day one for production stacks that use APIs. Fully local Edge paths avoid some API keys. Starting at €1,800.',
    ['luna-gaida', 'process'],
  ),

  // —— Luna Minecraft ——
  faq(
    'faq-mc-version',
    'Which Minecraft versions or servers does Luna Minecraft support?',
    'Supported up through Minecraft 1.21.1. Starting at €2,200.',
    ['luna-minecraft', 'games'],
  ),
  faq(
    'faq-mc-friends',
    'Can Luna Minecraft play on my server with friends?',
    'Private servers for now. If the setup has user accounts, it can be taken toward public. Share your server details when you inquire.',
    ['luna-minecraft'],
  ),
  faq(
    'faq-mc-learn',
    'Does the Minecraft bot learn permanently or reset?',
    'Yes — learning and memory persist between sessions.',
    ['luna-minecraft'],
  ),
  faq(
    'faq-mc-who',
    'Is Luna Minecraft for content creators or just fun?',
    'Both — creators and private friends. Starting at €2,200.',
    ['luna-minecraft'],
  ),

  // —— Luna Streamer ——
  faq(
    'faq-streamer-alone',
    'Can Luna Streamer run a stream without me at the PC?',
    'Yes. Limits are latency and the PC shutting down — unless you run it on a server. Starting at €2,800.',
    ['luna-streamer', 'streaming'],
  ),
  faq(
    'faq-streamer-chat',
    'Does Luna Streamer read chat and interact with viewers?',
    'Yes — it reads and replies to chat out of the box as part of the streamer build.',
    ['luna-streamer'],
  ),
  faq(
    'faq-streamer-platforms',
    'What platforms — Twitch, YouTube, TikTok Live?',
    'Twitch, YouTube, TikTok, and the other major live platforms you ask for. Starting at €2,800.',
    ['luna-streamer'],
  ),
  faq(
    'faq-streamer-hours',
    'How many hours can Luna Streamer stay live?',
    'As long as you like. Christos has left a setup running for 48 hours without stopping.',
    ['luna-streamer'],
  ),

  // —— Luna Vision ——
  faq(
    'faq-vision-see',
    'What can Luna Vision see — game only or any screen?',
    'Configurable — game HUD, fuller desktop, or whatever you scope. It’s not only for games. Starting at €3,200.',
    ['luna-vision', 'vision'],
  ),
  faq(
    'faq-vision-privacy',
    'Vision privacy — is my screen sent to the cloud?',
    'Both options are offered: local vision and cloud. Say which you want when you inquire.',
    ['luna-vision'],
  ),
  faq(
    'faq-vision-league',
    'Does Vision work with League of Legends or other games?',
    'Proven on League of Legends and Minecraft, and usable beyond games for screen-aware co-hosting. Starting at €3,200.',
    ['luna-vision'],
  ),
  faq(
    'faq-vision-tone',
    'Will Vision roast or help — can I tune personality?',
    'Yes — roast or helpful tone can be chosen as part of the build.',
    ['luna-vision', 'character'],
  ),

  // —— DJ Agent ——
  faq(
    'faq-dj-live',
    'Does DJ Agent mix live or only pick tracks?',
    'Default ship is track selection and vibe control; live mixing can be built too. Starting at €2,000.',
    ['dj-agent', 'music'],
  ),
  faq(
    'faq-dj-spotify',
    'Can DJ Agent use my music library or Spotify?',
    'Local files and YouTube links are the usual sources. Other libraries can be discussed in scope.',
    ['dj-agent'],
  ),
  faq(
    'faq-dj-where',
    'Is DJ Agent for clubs, streams, or both?',
    'Both clubs and streams. Starting at €2,000.',
    ['dj-agent'],
  ),
  faq(
    'faq-dj-hardware',
    'Do I need DJ hardware for DJ Agent?',
    'Yes — it needs a good PC as required hardware for the build to run well.',
    ['dj-agent'],
  ),

  // —— Desktop Companion ——
  faq(
    'faq-desktop-os',
    'Is Desktop Companion Windows only or Mac too?',
    'Windows only for now. Starting at €1,500.',
    ['fluffy', 'desktop'],
  ),
  faq(
    'faq-desktop-heavy',
    'How heavy is the desktop companion on CPU and RAM?',
    'Lowest practical target: about 16 GB RAM and 8 GB VRAM.',
    ['fluffy', 'desktop'],
  ),
  faq(
    'faq-desktop-tasks',
    'Can the desktop companion do real tasks or just chat?',
    'Chat, avatar presence, and any desktop tasks you give it access to — not chat-only.',
    ['fluffy', 'desktop'],
  ),
  faq(
    'faq-desktop-private',
    'Can the desktop companion stay private or offline?',
    'Yes — private mode is available.',
    ['fluffy', 'desktop'],
  ),

  // —— Singing SDK ——
  faq(
    'faq-sing-vrm',
    'Does the Singing Avatar SDK work with VTube Studio or VRM?',
    'It works with virtual environments you create — avatar pipelines including common stream avatar setups. Confirm your exact tools in the brief. Starting at €1,600.',
    ['singing-sdk', 'sdk'],
  ),
  faq(
    'faq-sing-lipsync',
    'Is lip-sync included with singing avatars?',
    'Yes — lip-sync is included.',
    ['singing-sdk'],
  ),
  faq(
    'faq-sing-mysongs',
    'Can it sing my songs or covers?',
    'Both work. Using your own songs is easier because you don’t need third-party permission. You still handle music rights. Starting at €1,600.',
    ['singing-sdk'],
  ),
  faq(
    'faq-sing-license',
    'Can I use the Singing SDK commercially on stream?',
    'Yes — commercial stream use is OK under the build agreement. Music rights remain your responsibility.',
    ['singing-sdk'],
  ),

  // —— Multi-persona ——
  faq(
    'faq-multi-how-many',
    'How many characters can share one multi-persona system?',
    'You choose based on how many your PC can handle. Avatars are not included — you provide them. Starting at €3,500.',
    ['lunariko', 'multi'],
  ),
  faq(
    'faq-multi-memory',
    'Do multi-persona characters remember shared context?',
    'Each character has separate memory plus shared memory for different conversations with AI or users. Depth depends on your setup.',
    ['lunariko', 'multi'],
  ),
  faq(
    'faq-multi-own',
    'Can I cast my own characters, not Luna and Viktor?',
    'Yes — it wasn’t made for Luna and Viktor only. Bring your own cast. Starting at €3,500.',
    ['lunariko', 'multi'],
  ),
  faq(
    'faq-multi-harder',
    'Is multi-persona harder to run than a single agent?',
    'Yes — more requests, prompts, and animations per agent, so it’s heavier than a single companion.',
    ['lunariko', 'multi'],
  ),

  // —— Character Agents ——
  faq(
    'faq-choko-brief',
    'Can you build a character agent from my brief or lore?',
    'Yes — a personalized, fully functional character agent from your brief. Starting at €1,400.',
    ['choko', 'character'],
  ),
  faq(
    'faq-choko-savage',
    'How savage vs safe can a character agent be for a brand?',
    'Depends where you use it — not only brand-safe. You set the tone boundaries for the surface.',
    ['choko', 'character'],
  ),
  faq(
    'faq-choko-where',
    'Are character agents for Discord, stream, or product UI?',
    'Discord, stream, web UI, and desktop free movement. Starting at €1,400.',
    ['choko', 'character'],
  ),
  faq(
    'faq-choko-pack',
    'What’s in the €1,400 character agent pack?',
    'Your own personalized character agent, fully functional for the agreed surfaces. Ask on the form if you need extras beyond that starter pack.',
    ['choko', 'pricing'],
  ),

  // —— AuthorHub ——
  faq(
    'faq-authorhub-anybook',
    'Is AuthorHub only for Proving Them Wrong or any book?',
    'Any book type — not only memoirs like Proving Them Wrong. Starting at €2,400.',
    ['book-editor', 'authorhub'],
  ),
  faq(
    'faq-authorhub-voice',
    'Does AuthorHub AI rewrite in my voice or replace it?',
    'It’s for editing, not rewriting — kept clear so the author’s voice stays yours.',
    ['book-editor', 'authorhub'],
  ),
  faq(
    'faq-authorhub-export',
    'Are Kindle and print export included?',
    'Yes — Kindle 5×8, hardcopy 6×9, PDF, Word, and other export paths as scoped. Starting at €2,400.',
    ['book-editor', 'authorhub'],
  ),
  faq(
    'faq-authorhub-private',
    'Is the manuscript private / local with AuthorHub?',
    'Not always forced local — local-first is available, and API help can be added when you want it.',
    ['book-editor', 'authorhub'],
  ),

  // —— Custom Websites ——
  faq(
    'faq-web-scope',
    'Custom websites — landing page only or full site plus assistant?',
    '€900 includes pages and design. Hosting goes on your paid domain name. Bigger worlds or assistants are quoted separately.',
    ['client-work', 'web', 'pricing'],
  ),
  faq(
    'faq-web-speed',
    'How fast can a custom website launch?',
    'About three days for that starter pages-and-design scope.',
    ['client-work', 'web', 'timeline'],
  ),
  faq(
    'faq-web-design',
    'Do you do copy and design too?',
    'Design and pages are included in the build; copy and branding come from the client.',
    ['client-work', 'web'],
  ),
  faq(
    'faq-web-extra',
    'What’s extra beyond the €900 website starting price?',
    'Design changes, maintenance, management of materials, and social media help are common extras.',
    ['client-work', 'web', 'pricing'],
  ),

  // —— Short “tell me about X” ——
  ...[
    ['Luna Agent 5.0', '€4,500', 'full conversational AI companion prototype — mostly local, customization extra', 'luna-agent'],
    ['Luna Gaida', '€1,800', 'live voice for Discord, websites, and PC apps — Edge local or Fish API', 'luna-gaida'],
    ['Luna Minecraft', '€2,200', 'game agent through Minecraft 1.21.1 with persistent learning — private servers first', 'luna-minecraft'],
    ['Luna Streamer', '€2,800', 'broadcast companion with chat replies; can run long sessions including 48-hour tests', 'luna-streamer'],
    ['Luna Vision Co-host', '€3,200', 'configurable screen-aware co-host — League, Minecraft, and beyond games', 'luna-vision'],
    ['DJ Agent', '€2,000', 'track selection (live mix optional) from local files or YouTube — clubs and streams', 'dj-agent'],
    ['Desktop Companion', '€1,500', 'Windows companion with chat, avatar, and task access — private mode available', 'fluffy'],
    ['Singing Avatar SDK', '€1,600', 'singing avatar toolkit with lip-sync included for virtual environments you create', 'singing-sdk'],
    ['Multi-persona Companions', '€3,500', 'multiple characters with separate plus shared memory — you provide avatars', 'lunariko'],
    ['Character Agents', '€1,400', 'personalized character agents for Discord, stream, web, or desktop movement', 'choko'],
    ['AuthorHub', '€2,400', 'author workspace for any book — editing not rewriting, with Kindle and print exports', 'book-editor'],
    ['Custom Websites', '€900', 'pages and design on your domain — about three days for starter scope', 'client-work'],
  ].map(([name, price, desc, tag], i) =>
    faq(
      `faq-about-${i}`,
      `Tell me about ${name}`,
      `${name} is ${desc}. Starting price ${price}. Click the aisle video for a tour, or ask a follow-up. Builds are still concept/early — use the form or Discord for a live call.`,
      ['project', tag],
    ),
  ),
]

const pages = [
  {
    id: 'page-home',
    url: '/',
    title: 'Solonaras Store',
    description: 'Portfolio store of AI companions and custom builds by Christos Solonos (Cyprus, remote).',
    keywords: ['solonaras', 'portfolio', 'luna', 'ai', 'prices', 'contact'],
  },
  {
    id: 'page-contact',
    url: '/#outro',
    title: 'Contact & socials',
    description:
      'Preferred: idea form to christossolonos@gmail.com. Also Discord https://discord.gg/reZX2sqQk, YouTube, Twitch, Instagram, TikTok, Facebook, X, LinkedIn. No public phone.',
    keywords: ['contact', 'hire', 'email', 'socials', 'discord'],
  },
]

const store = {
  version: 1,
  updatedAt: new Date().toISOString(),
  pages,
  faqs,
  chunks: [],
  settings: {
    welcomeMessage:
      "Hi — I'm the Solonaras guide. Ask about projects, prices, what’s included, or how to hire Christos.",
    fishReferenceId: '',
    fishReferenceIdEn: '',
    siteBaseUrl: process.env.SITE_BASE_URL || 'http://localhost:5173',
  },
}

await fs.mkdir(dataDir, { recursive: true })
await fs.writeFile(storePath, JSON.stringify(store, null, 2), 'utf8')
console.log(`Seeded ${faqs.length} FAQs → ${storePath}`)
