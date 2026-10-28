import { readFileSync, writeFileSync } from 'fs'

const path = new URL('../src/data/projects.ts', import.meta.url)
let s = readFileSync(path, 'utf8')

const meta = {
  'luna-agent': {
    m: 'early',
    i: ['Conversational core', 'Profiles + TTS', 'Streaming avatar'],
  },
  'luna-gaida': {
    m: 'early',
    i: ['Live voice', 'Discord / apps', 'Edge or Fish TTS'],
  },
  'luna-minecraft': {
    m: 'demo',
    i: ['In-game agent', 'Memory persists', 'Up to 1.21.1'],
  },
  'luna-streamer': {
    m: 'demo',
    i: ['Chat replies', 'Long sessions', 'Twitch / YT / TikTok'],
  },
  'luna-vision': {
    m: 'early',
    i: ['Screen-aware', 'Local or cloud', 'Configurable tone'],
  },
  'dj-agent': {
    m: 'early',
    i: ['Track selection', 'Local / YouTube', 'Clubs + streams'],
  },
  fluffy: {
    m: 'early',
    i: ['Windows desktop', 'Chat + avatar', 'Task access'],
  },
  'singing-sdk': {
    m: 'early',
    i: ['Lip-sync included', 'Virtual envs', 'Stream-ready'],
  },
  lunariko: {
    m: 'concept',
    i: ['Multi character', 'Shared + separate memory', 'Bring your cast'],
  },
  choko: {
    m: 'early',
    i: ['Personality first', 'Discord / stream / desktop', 'Tone boundaries'],
  },
  'book-editor': {
    m: 'demo',
    i: ['Any book type', 'Edit not rewrite', 'Kindle + print export'],
  },
  'client-work': {
    m: 'demo',
    i: ['Pages + design', 'Your domain', '~3 day starter'],
  },
}

for (const [id, v] of Object.entries(meta)) {
  const re = new RegExp(
    `(id: '${id}'[\\s\\S]*?category: '[^']+',)\\n`,
  )
  s = s.replace(re, (full, pre) => {
    if (full.includes('maturity:')) return full
    return `${pre}\n    maturity: '${v.m}',\n    includes: ${JSON.stringify(v.i)},\n`
  })
}

writeFileSync(path, s)
console.log('maturity count', (s.match(/maturity:/g) || []).length)
