import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

function parseEnv(file) {
  const out = {}
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    out[t.slice(0, i)] = t.slice(i + 1)
  }
  return out
}

const local = parseEnv('assistant/.env')
const vars = {
  ASSISTANT_MODE: 'portfolio',
  NVIDIA_API_KEY: local.NVIDIA_API_KEY || '',
  NVIDIA_BASE_URL:
    local.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  NVIDIA_MODEL:
    local.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b',
  TTS_PROVIDER: 'edge',
  EDGE_VOICE_EL: local.EDGE_VOICE_EL || 'el-GR-AthinaNeural',
  EDGE_VOICE_EN: local.EDGE_VOICE_EN || 'en-US-AvaMultilingualNeural',
  FISH_API_KEY: local.FISH_API_KEY || '',
  FISH_REFERENCE_ID: local.FISH_REFERENCE_ID || '',
  FISH_TTS_MODEL: local.FISH_TTS_MODEL || 's2.1-pro-free',
  ADMIN_SECRET: local.ADMIN_SECRET || 'solonaras-change-me',
  SITE_BASE_URL: 'https://christossolonos.up.railway.app',
  // Updated after domain is created if different
  NEXT_PUBLIC_APP_URL:
    process.env.GUIDE_PUBLIC_URL ||
    'https://solonaras-guide-production.up.railway.app',
  DEMO_MODE: 'false',
}

if (!vars.NVIDIA_API_KEY) {
  console.error('Missing NVIDIA_API_KEY in assistant/.env')
  process.exit(1)
}

const pairs = Object.entries(vars).map(([k, v]) => `${k}=${v}`)
execFileSync(
  'railway',
  [
    'variable',
    'set',
    ...pairs,
    '--service',
    'solonaras-guide',
    '--skip-deploys',
    '--json',
  ],
  { stdio: ['ignore', 'pipe', 'pipe'], shell: true },
)

console.log(
  `Set ${Object.keys(vars).length} vars on solonaras-guide (secrets not printed)`,
)
