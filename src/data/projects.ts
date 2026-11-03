export type Maturity = 'concept' | 'early' | 'demo'

export type Project = {
  id: string
  name: string
  tagline: string
  description: string
  narration: string
  capability: string
  /** Kept for optional future use — not shown on the portfolio */
  startingPrice: number
  /** Short scope / stack line under the description */
  priceNote: string
  /** Build readiness shown on the store */
  maturity: Maturity
  /** Short bullets for compare / what’s included */
  includes: string[]
  youtubeId?: string
  videoSrc?: string
  posterSrc?: string
  videoTitle: string
  accent: string
  category: string
}

export const maturityLabel: Record<Maturity, string> = {
  concept: 'Concept',
  early: 'Early',
  demo: 'Demo-ready',
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const projects: Project[] = [
  {
    id: 'luna-agent',
    name: 'Luna Agent 5.0',
    tagline: 'Full conversational AI companion',
    description:
      'I can build a complete AI companion with synced profiles, text-to-speech, social tools, and a live streaming avatar — ready to talk, react, and stay present.',
    narration:
      'First: Luna Agent 5.0. Play the tour for the companion stack, then see related channel snapshots inside the video.',
    capability: 'AI companions',
    youtubeId: 'Z9jdSHglkOc',
    videoSrc: '/videos/luna-agent-tour.mp4',
    posterSrc: '/videos/luna-agent-poster.png',
    videoTitle: 'Luna Agent 5.0 product tour',
    startingPrice: 4500,
    priceNote: 'Full companion stack · scoped build',
    accent: '#2ee6a6',
    category: 'AI Companion',
    maturity: 'early',
    includes: ["Conversational core","Profiles + TTS","Streaming avatar"],
  },
  {
    id: 'luna-gaida',
    name: 'Luna Gaida',
    tagline: 'Voice presence that speaks',
    description:
      'I can put an AI into live voice — Discord calls, UI talk-back, real-time speech — not just text bots sitting in a sidebar.',
    narration:
      'Luna Gaida is voice presence. The tour covers live speech systems and related voice clips from the channel.',
    capability: 'Voice systems',
    youtubeId: '4Qf_GpjUXbE',
    videoSrc: '/videos/luna-gaida-tour.mp4',
    posterSrc: '/videos/luna-gaida-poster.png',
    videoTitle: 'Luna Gaida product tour',
    startingPrice: 1800,
    priceNote: 'Voice presence · Discord / live talk-back',
    accent: '#5ec8ff',
    category: 'Voice',
    maturity: 'early',
    includes: ["Live voice","Discord / apps","Edge or Fish TTS"],
  },
  {
    id: 'luna-minecraft',
    name: 'Luna Minecraft',
    tagline: 'Game agents that learn',
    description:
      'I can create game agents that chat, gather, build, and fight — improving as they play alongside you.',
    narration:
      'Luna Minecraft is a learning game agent. The tour includes Minecraft snapshots from the Solonaras channel.',
    capability: 'Game agents',
    youtubeId: 'OlaOdJckon0',
    videoSrc: '/videos/luna-minecraft-tour.mp4',
    posterSrc: '/videos/luna-minecraft-poster.png',
    videoTitle: 'Luna Minecraft product tour',
    startingPrice: 2200,
    priceNote: 'In-game agent · chat + actions',
    accent: '#7dffb3',
    category: 'Games',
    maturity: 'demo',
    includes: ["In-game agent","Memory persists","Up to 1.21.1"],
  },
  {
    id: 'luna-streamer',
    name: 'Luna Streamer',
    tagline: 'Broadcast-ready AI talent',
    description:
      'I can ship companion builds tuned for live streaming — on-camera energy that can run for hours without you babysitting every second.',
    narration:
      'Luna Streamer is built for broadcast. The tour covers long sessions and streaming moments from the channel.',
    capability: 'Streaming AI',
    youtubeId: 'mjuZlyDSU7c',
    videoSrc: '/videos/luna-streamer-tour.mp4',
    posterSrc: '/videos/luna-streamer-poster.png',
    videoTitle: 'Luna Streamer product tour',
    startingPrice: 2800,
    priceNote: 'Broadcast-ready companion',
    accent: '#ff7a59',
    category: 'Streaming',
    maturity: 'demo',
    includes: ["Chat replies","Long sessions","Twitch / YT / TikTok"],
  },
  {
    id: 'luna-vision',
    name: 'Luna Vision Co-host',
    tagline: 'Screen-aware co-hosts',
    description:
      'I can build vision agents that see your screen and join in — gaming co-hosts with voice and live reactions.',
    narration:
      'Vision Co-host can see your screen. The tour includes gaming co-host snapshots from the channel.',
    capability: 'Computer vision',
    youtubeId: 'o4nrzx5VOdw',
    videoSrc: '/videos/luna-vision-tour.mp4',
    posterSrc: '/videos/luna-vision-poster.png',
    videoTitle: 'Luna Vision Co-host product tour',
    startingPrice: 3200,
    priceNote: 'Screen-aware co-host · vision + voice',
    accent: '#c4f542',
    category: 'Vision',
    maturity: 'early',
    includes: ["Screen-aware","Local or cloud","Configurable tone"],
  },
  {
    id: 'dj-agent',
    name: 'DJ Agent',
    tagline: 'AI that reads the room',
    description:
      'I can create music agents and performance systems that follow energy and keep a set moving — vibe control, not just playlists.',
    narration:
      'DJ Agent is music intelligence. The tour covers set energy and concert snapshots from the channel.',
    capability: 'Music AI',
    youtubeId: '1QvI6zd-r2Q',
    videoSrc: '/videos/dj-agent-tour.mp4',
    posterSrc: '/videos/dj-agent-poster.png',
    videoTitle: 'DJ Agent product tour',
    startingPrice: 2000,
    priceNote: 'Music / performance agent',
    accent: '#ff5ca8',
    category: 'Music',
    maturity: 'early',
    includes: ["Track selection","Local / YouTube","Clubs + streams"],
  },
  {
    id: 'fluffy',
    name: 'Desktop Companion',
    tagline: 'Always-on desktop presence',
    description:
      'I can place a soft AI companion on the desktop — UI, presence, and quick help without opening another browser tab.',
    narration:
      'Desktop companions live on the machine. The tour covers companion UI builds and related channel snapshots.',
    capability: 'Desktop apps',
    youtubeId: 'Jn7cWDWZkEM',
    videoSrc: '/videos/fluffy-tour.mp4',
    posterSrc: '/videos/fluffy-poster.png',
    videoTitle: 'Desktop Companion product tour',
    startingPrice: 1500,
    priceNote: 'Desktop shell + companion UI',
    accent: '#ffa94d',
    category: 'Desktop',
    maturity: 'early',
    includes: ["Windows desktop","Chat + avatar","Task access"],
  },
  {
    id: 'singing-sdk',
    name: 'Singing Avatar SDK',
    tagline: 'Avatars that perform',
    description:
      'I can give avatars a singing voice — performance tools for streams, covers, and expressive moments.',
    narration:
      'The Singing SDK is about performance. The tour includes VRM cover and concert snapshots from the channel.',
    capability: 'Performance tools',
    youtubeId: 't1FEyQmx53w',
    videoSrc: '/videos/singing-sdk-tour.mp4',
    posterSrc: '/videos/singing-sdk-poster.png',
    videoTitle: 'Singing Avatar SDK product tour',
    startingPrice: 1600,
    priceNote: 'Avatar singing toolkit',
    accent: '#a78bfa',
    category: 'SDK',
    maturity: 'early',
    includes: ["Lip-sync included","Virtual envs","Stream-ready"],
  },
  {
    id: 'lunariko',
    name: 'Multi-persona Companions',
    tagline: 'Several personalities, one system',
    description:
      'I can fuse multiple companion personalities into one stack — different moods and skills, same foundation.',
    narration:
      'Multi-persona systems shine when characters collide. The tour includes Luna and Viktor moments from the channel.',
    capability: 'Multi-agent systems',
    youtubeId: 'hjSayKcP2Y0',
    videoSrc: '/videos/lunariko-tour.mp4',
    posterSrc: '/videos/lunariko-poster.png',
    videoTitle: 'Multi-persona companions product tour',
    startingPrice: 3500,
    priceNote: 'Two+ personas · shared system',
    accent: '#38bdf8',
    category: 'AI Companion',
    maturity: 'concept',
    includes: ["Multi character","Shared + separate memory","Bring your cast"],
  },
  {
    id: 'choko',
    name: 'Character Agents',
    tagline: 'Personality-first AI',
    description:
      'I can design agents with a sharp character — rough, funny, tough — not generic assistants.',
    narration:
      'Character agents put personality first. The tour includes savage and bold moments from the channel.',
    capability: 'Character design',
    youtubeId: 'T4VjwxsYlMs',
    videoSrc: '/videos/choko-tour.mp4',
    posterSrc: '/videos/choko-poster.png',
    videoTitle: 'Character Agents product tour',
    startingPrice: 1400,
    priceNote: 'Personality pack + agent voice',
    accent: '#fb7185',
    category: 'AI Companion',
    maturity: 'early',
    includes: ["Personality first","Discord / stream / desktop","Tone boundaries"],
  },
  {
    id: 'book-editor',
    name: 'AuthorHub',
    tagline: 'Reshape a manuscript without losing your voice',
    description:
      'I can build author workspaces like AuthorHub — chapter maps, original vs edited compare, reshape tools, and print-ready export for real books.',
    narration:
      'AuthorHub is the book editor. Play the tour for chapter maps, compare, export, and related writing clips.',
    capability: 'Creative tools',
    youtubeId: 'g73cmxf2yr8',
    videoSrc: '/videos/book-editor-tour.mp4',
    posterSrc: '/videos/book-editor-poster.png',
    videoTitle: 'AuthorHub product tour',
    startingPrice: 2400,
    priceNote: 'Manuscript workspace · export pipeline',
    accent: '#f97316',
    category: 'Writing',
    maturity: 'demo',
    includes: ["Any book type","Edit not rewrite","Kindle + print export"],
  },
  {
    id: 'client-work',
    name: 'Custom Websites',
    tagline: 'Sites, worlds & assistants',
    description:
      'I can ship client websites, custom worlds, and embedded assistants — polished experiences made for real people.',
    narration:
      'Custom websites and worlds for real clients. The tour includes VR and UI snapshots from the channel.',
    capability: 'Client web',
    youtubeId: 'RH7nYD40AZc',
    videoSrc: '/videos/client-work-tour.mp4',
    posterSrc: '/videos/client-work-poster.png',
    videoTitle: 'Custom Websites product tour',
    startingPrice: 900,
    priceNote: 'Landing / brand site · custom scope',
    accent: '#94a3b8',
    category: 'Web',
    maturity: 'demo',
    includes: ["Pages + design","Your domain","~3 day starter"],
  },
]

export const heroNarration =
  'Welcome to Solonaras Store. This is a showcase of what Christos can create — AI companions, voice systems, game agents, and custom builds. Scroll, watch each product tour, and I\'ll introduce the aisle.'
