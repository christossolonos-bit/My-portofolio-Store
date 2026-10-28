import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Mirrors src/data/projects.ts — keep handles = project ids */
const projects = [
  {
    id: 'luna-agent',
    name: 'Luna Agent 5.0',
    tagline: 'Full conversational AI companion',
    description:
      'I can build a complete AI companion with synced profiles, text-to-speech, social tools, and a live streaming avatar — ready to talk, react, and stay present.',
    startingPrice: 4500,
    priceNote: 'Full companion stack · scoped build',
    category: 'AI Companion',
    maturity: 'early',
    includes: ['Conversational core', 'Profiles + TTS', 'Streaming avatar'],
    capability: 'AI companions',
  },
  {
    id: 'luna-gaida',
    name: 'Luna Gaida',
    tagline: 'Voice presence that speaks',
    description:
      'I can put an AI into live voice — Discord calls, UI talk-back, real-time speech — not just text bots sitting in a sidebar.',
    startingPrice: 1800,
    priceNote: 'Voice presence · Discord / live talk-back',
    category: 'Voice',
    maturity: 'early',
    includes: ['Live voice', 'Discord / apps', 'Edge or Fish TTS'],
    capability: 'Voice systems',
  },
  {
    id: 'luna-minecraft',
    name: 'Luna Minecraft',
    tagline: 'Game agents that learn',
    description:
      'I can create game agents that chat, gather, build, and fight — improving as they play alongside you.',
    startingPrice: 2200,
    priceNote: 'In-game agent · chat + actions',
    category: 'Games',
    maturity: 'demo',
    includes: ['In-game agent', 'Memory persists', 'Up to 1.21.1'],
    capability: 'Game agents',
  },
  {
    id: 'luna-streamer',
    name: 'Luna Streamer',
    tagline: 'Broadcast-ready AI talent',
    description:
      'I can ship companion builds tuned for live streaming — on-camera energy that can run for hours without you babysitting every second.',
    startingPrice: 2800,
    priceNote: 'Broadcast-ready companion',
    category: 'Streaming',
    maturity: 'demo',
    includes: ['Chat replies', 'Long sessions', 'Twitch / YT / TikTok'],
    capability: 'Streaming AI',
  },
  {
    id: 'luna-vision',
    name: 'Luna Vision Co-host',
    tagline: 'Screen-aware co-hosts',
    description:
      'I can build vision agents that see your screen and join in — gaming co-hosts with voice and live reactions.',
    startingPrice: 3200,
    priceNote: 'Screen-aware co-host · vision + voice',
    category: 'Vision',
    maturity: 'early',
    includes: ['Screen-aware', 'Local or cloud', 'Configurable tone'],
    capability: 'Computer vision',
  },
  {
    id: 'dj-agent',
    name: 'DJ Agent',
    tagline: 'AI that reads the room',
    description:
      'I can create music agents and performance systems that follow energy and keep a set moving — vibe control, not just playlists.',
    startingPrice: 2000,
    priceNote: 'Music / performance agent',
    category: 'Music',
    maturity: 'early',
    includes: ['Track selection', 'Local / YouTube', 'Clubs + streams'],
    capability: 'Music AI',
  },
  {
    id: 'fluffy',
    name: 'Desktop Companion',
    tagline: 'Always-on desktop presence',
    description:
      'I can place a soft AI companion on the desktop — UI, presence, and quick help without opening another browser tab.',
    startingPrice: 1500,
    priceNote: 'Desktop shell + companion UI',
    category: 'Desktop',
    maturity: 'early',
    includes: ['Windows desktop', 'Chat + avatar', 'Task access'],
    capability: 'Desktop apps',
  },
  {
    id: 'singing-sdk',
    name: 'Singing Avatar SDK',
    tagline: 'Avatars that perform',
    description:
      'I can give avatars a singing voice — performance tools for streams, covers, and expressive moments.',
    startingPrice: 1600,
    priceNote: 'Avatar singing toolkit',
    category: 'SDK',
    maturity: 'early',
    includes: ['Lip-sync included', 'Virtual envs', 'Stream-ready'],
    capability: 'Performance tools',
  },
  {
    id: 'lunariko',
    name: 'Multi-persona Companions',
    tagline: 'Several personalities, one system',
    description:
      'I can fuse multiple companion personalities into one stack — different moods and skills, same foundation.',
    startingPrice: 3500,
    priceNote: 'Two+ personas · shared system',
    category: 'AI Companion',
    maturity: 'concept',
    includes: ['Multi character', 'Shared + separate memory', 'Bring your cast'],
    capability: 'Multi-agent systems',
  },
  {
    id: 'choko',
    name: 'Character Agents',
    tagline: 'Personality-first AI',
    description:
      'I can design agents with a sharp character — rough, funny, tough — not generic assistants.',
    startingPrice: 1400,
    priceNote: 'Personality pack + agent voice',
    category: 'AI Companion',
    maturity: 'early',
    includes: ['Personality first', 'Discord / stream / desktop', 'Tone boundaries'],
    capability: 'Character design',
  },
  {
    id: 'book-editor',
    name: 'AuthorHub',
    tagline: 'Reshape a manuscript without losing your voice',
    description:
      'I can build author workspaces like AuthorHub — chapter maps, original vs edited compare, reshape tools, and print-ready export for real books.',
    startingPrice: 2400,
    priceNote: 'Manuscript workspace · export pipeline',
    category: 'Writing',
    maturity: 'demo',
    includes: ['Any book type', 'Edit not rewrite', 'Kindle + print export'],
    capability: 'Creative tools',
  },
  {
    id: 'client-work',
    name: 'Custom Websites',
    tagline: 'Sites, worlds & assistants',
    description:
      'I can ship client websites, custom worlds, and embedded assistants — polished experiences made for real people.',
    startingPrice: 900,
    priceNote: 'Landing / brand site · custom scope',
    category: 'Web',
    maturity: 'demo',
    includes: ['Pages + design', 'Your domain', '~3 day starter'],
    capability: 'Client web',
  },
]

function esc(s) {
  return `"${String(s).replace(/"/g, '""')}"`
}

function body(p) {
  const lis = p.includes.map((i) => `<li>${i}</li>`).join('')
  return [
    `<p><strong>${p.tagline}</strong></p>`,
    `<p>${p.description}</p>`,
    `<p>${p.priceNote}</p>`,
    `<p>Starting from &euro;${p.startingPrice.toLocaleString('en-IE')} (scoped custom build).</p>`,
    `<h3>What's included</h3>`,
    `<ul>${lis}</ul>`,
    `<p>Built by Christos Solonos / Solonaras. Contact via the portfolio store to scope your build.</p>`,
  ].join('')
}

const headers = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Product Category',
  'Type',
  'Tags',
  'Published',
  'Option1 Name',
  'Option1 Value',
  'Variant SKU',
  'Variant Grams',
  'Variant Inventory Tracker',
  'Variant Inventory Qty',
  'Variant Inventory Policy',
  'Variant Fulfillment Service',
  'Variant Price',
  'Variant Compare At Price',
  'Variant Requires Shipping',
  'Variant Taxable',
  'Gift Card',
  'SEO Title',
  'SEO Description',
  'Status',
  'Variant Weight Unit',
  'Cost per item',
]

const rows = [headers.join(',')]

for (const p of projects) {
  const tags = [p.category, p.capability, p.maturity, 'solonaras', 'custom-build'].join(
    ', ',
  )
  const seoDesc = `${p.tagline}. ${p.description}`.slice(0, 320)
  rows.push(
    [
      p.id,
      esc(p.name),
      esc(body(p)),
      esc('Solonaras'),
      '',
      esc(p.category),
      esc(tags),
      'TRUE',
      esc('Title'),
      esc('Default Title'),
      esc(p.id.toUpperCase()),
      '0',
      '',
      '',
      'deny',
      'manual',
      String(p.startingPrice),
      '',
      'FALSE',
      'TRUE',
      'FALSE',
      esc(`${p.name} | Solonaras`),
      esc(seoDesc),
      'active',
      'kg',
      '',
    ].join(','),
  )
}

const out = path.join(__dirname, 'products-import.csv')
fs.writeFileSync(out, rows.join('\n'), 'utf8')
console.log(`Wrote ${projects.length} products → ${out}`)
console.log('Handles:', projects.map((p) => p.id).join(', '))
