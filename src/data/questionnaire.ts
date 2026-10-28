export type Question = {
  id: string
  section: string
  prompt: string
  hint?: string
}

export const questionnaireQuestions: Question[] = [
  {
    id: 'a1',
    section: 'About you & the store',
    prompt: 'One sentence: what should someone hire you for?',
  },
  {
    id: 'a2',
    section: 'About you & the store',
    prompt: 'Where are you based / do you work remote only?',
  },
  {
    id: 'a3',
    section: 'About you & the store',
    prompt: 'Typical reply time after someone submits the contact form?',
  },
  {
    id: 'a4',
    section: 'About you & the store',
    prompt: 'Languages you work in (English / Greek / other)?',
  },
  {
    id: 'a5',
    section: 'About you & the store',
    prompt: 'Anything you won’t build (hard no’s)?',
  },
  {
    id: 'b6',
    section: 'Process & money',
    prompt: 'How do clients usually start (form only, Discord first, call, etc.)?',
  },
  {
    id: 'b7',
    section: 'Process & money',
    prompt: 'Deposit / payment style (e.g. 50% start, milestones)?',
  },
  {
    id: 'b8',
    section: 'Process & money',
    prompt: 'Rough timelines for small / mid / big builds?',
    hint: 'Small site or character pack · Mid (voice, Minecraft, DJ, AuthorHub) · Big (Luna Agent, Vision, multi-persona, Streamer)',
  },
  {
    id: 'b9',
    section: 'Process & money',
    prompt: 'Do you offer monthly maintenance? From what price?',
  },
  {
    id: 'b10',
    section: 'Process & money',
    prompt: 'What must the client usually provide?',
    hint: 'API keys, hosting, assets, Discord bot token, etc.',
  },
  {
    id: 'b11',
    section: 'Process & money',
    prompt: 'Can people start small and upgrade later? Any package names?',
  },
  {
    id: 'c12',
    section: 'Luna Agent 5.0 (from €4,500)',
    prompt: 'What is always included in the starting price?',
  },
  {
    id: 'c13',
    section: 'Luna Agent 5.0 (from €4,500)',
    prompt: 'Local-only vs cloud — what’s your default?',
  },
  {
    id: 'c14',
    section: 'Luna Agent 5.0 (from €4,500)',
    prompt: 'How customizable is personality / brand?',
  },
  {
    id: 'c15',
    section: 'Luna Agent 5.0 (from €4,500)',
    prompt: 'How do you explain it vs ChatGPT in one line?',
  },
  {
    id: 'c16',
    section: 'Luna Agent 5.0 (from €4,500)',
    prompt: 'Common add-ons that raise the price?',
  },
  {
    id: 'd17',
    section: 'Luna Gaida — voice (from €1,800)',
    prompt: 'Discord only, or also other apps? Which?',
  },
  {
    id: 'd18',
    section: 'Luna Gaida — voice (from €1,800)',
    prompt: 'Typical voice stack you use (Edge, Fish, other)?',
  },
  {
    id: 'd19',
    section: 'Luna Gaida — voice (from €1,800)',
    prompt: 'Realistic latency expectations for a live call?',
  },
  {
    id: 'd20',
    section: 'Luna Gaida — voice (from €1,800)',
    prompt: 'Does the client need their own API keys from day one?',
  },
  {
    id: 'e21',
    section: 'Luna Minecraft (from €2,200)',
    prompt: 'Which Minecraft editions / versions you support today?',
  },
  {
    id: 'e22',
    section: 'Luna Minecraft (from €2,200)',
    prompt: 'Private servers only, or public too?',
  },
  {
    id: 'e23',
    section: 'Luna Minecraft (from €2,200)',
    prompt: 'Does learning / memory persist between sessions?',
  },
  {
    id: 'e24',
    section: 'Luna Minecraft (from €2,200)',
    prompt: 'Best fit: creators, private friends, or both?',
  },
  {
    id: 'f25',
    section: 'Luna Streamer (from €2,800)',
    prompt: 'Can it run while you’re away from the PC? Any limits?',
  },
  {
    id: 'f26',
    section: 'Luna Streamer (from €2,800)',
    prompt: 'Does it read / reply to chat out of the box?',
  },
  {
    id: 'f27',
    section: 'Luna Streamer (from €2,800)',
    prompt: 'Platforms you support (Twitch / YouTube / TikTok / other)?',
  },
  {
    id: 'f28',
    section: 'Luna Streamer (from €2,800)',
    prompt: 'Longest stream setup you’ve actually run or recommend?',
  },
  {
    id: 'g29',
    section: 'Luna Vision Co-host (from €3,200)',
    prompt: 'Game HUD only, full desktop, or configurable?',
  },
  {
    id: 'g30',
    section: 'Luna Vision Co-host (from €3,200)',
    prompt: 'Privacy default: local vision vs cloud — what do you offer?',
  },
  {
    id: 'g31',
    section: 'Luna Vision Co-host (from €3,200)',
    prompt: 'Games you’ve proven (League, etc.)?',
  },
  {
    id: 'g32',
    section: 'Luna Vision Co-host (from €3,200)',
    prompt: 'Can clients choose roast vs helpful tone?',
  },
  {
    id: 'h33',
    section: 'DJ Agent (from €2,000)',
    prompt: 'Live mixing vs track selection / vibe control — what do you ship?',
  },
  {
    id: 'h34',
    section: 'DJ Agent (from €2,000)',
    prompt: 'Spotify / local files / other sources?',
  },
  {
    id: 'h35',
    section: 'DJ Agent (from €2,000)',
    prompt: 'Clubs, streams, or both?',
  },
  {
    id: 'h36',
    section: 'DJ Agent (from €2,000)',
    prompt: 'Hardware required or optional?',
  },
  {
    id: 'i37',
    section: 'Desktop Companion (from €1,500)',
    prompt: 'Windows only for now, or Mac too?',
  },
  {
    id: 'i38',
    section: 'Desktop Companion (from €1,500)',
    prompt: 'Rough CPU / RAM expectation?',
  },
  {
    id: 'i39',
    section: 'Desktop Companion (from €1,500)',
    prompt: 'Chat-only by default, or real desktop tasks? Which tasks?',
  },
  {
    id: 'i40',
    section: 'Desktop Companion (from €1,500)',
    prompt: 'Offline / private mode available?',
  },
  {
    id: 'j41',
    section: 'Singing Avatar SDK (from €1,600)',
    prompt: 'Works with VTube Studio / VRM / what else?',
  },
  {
    id: 'j42',
    section: 'Singing Avatar SDK (from €1,600)',
    prompt: 'Lip-sync included or separate?',
  },
  {
    id: 'j43',
    section: 'Singing Avatar SDK (from €1,600)',
    prompt: 'Client’s own songs / covers — how does that work legally / practically?',
  },
  {
    id: 'j44',
    section: 'Singing Avatar SDK (from €1,600)',
    prompt: 'Commercial stream use OK under your build license?',
  },
  {
    id: 'k45',
    section: 'Multi-persona (from €3,500)',
    prompt: 'Default how many characters in the starting package?',
  },
  {
    id: 'k46',
    section: 'Multi-persona (from €3,500)',
    prompt: 'Shared memory — yes / no / how deep?',
  },
  {
    id: 'k47',
    section: 'Multi-persona (from €3,500)',
    prompt: 'Client’s own cast OK (not Luna / Viktor)?',
  },
  {
    id: 'k48',
    section: 'Multi-persona (from €3,500)',
    prompt: 'Why it’s harder / heavier than a single agent (one sentence)?',
  },
  {
    id: 'l49',
    section: 'Character Agents (from €1,400)',
    prompt: 'What’s in the starting pack exactly?',
  },
  {
    id: 'l50',
    section: 'Character Agents (from €1,400)',
    prompt: 'How you set tone boundaries (savage vs brand-safe)?',
  },
  {
    id: 'l51',
    section: 'Character Agents (from €1,400)',
    prompt: 'Primary surfaces you build for (Discord / stream / web UI)?',
  },
  {
    id: 'l52',
    section: 'Character Agents (from €1,400)',
    prompt: 'What is not included at €1,400?',
  },
  {
    id: 'm53',
    section: 'AuthorHub (from €2,400)',
    prompt: 'Only memoirs like Proving Them Wrong, or any book type?',
  },
  {
    id: 'm54',
    section: 'AuthorHub (from €2,400)',
    prompt: 'How you keep the author’s voice (one sentence)?',
  },
  {
    id: 'm55',
    section: 'AuthorHub (from €2,400)',
    prompt: 'Export formats included?',
    hint: 'Kindle 5×8, hardcopy 6×9, PDF, Word, other',
  },
  {
    id: 'm56',
    section: 'AuthorHub (from €2,400)',
    prompt: 'Manuscript always local by default?',
  },
  {
    id: 'n57',
    section: 'Custom Websites (from €900)',
    prompt: 'What’s included at €900?',
    hint: 'Pages, design, mobile, hosting setup',
  },
  {
    id: 'n58',
    section: 'Custom Websites (from €900)',
    prompt: 'Typical launch time for that starter scope?',
  },
  {
    id: 'n59',
    section: 'Custom Websites (from €900)',
    prompt: 'Do you write copy / do branding, or client brings it?',
  },
  {
    id: 'n60',
    section: 'Custom Websites (from €900)',
    prompt: 'Common extras beyond €900?',
  },
  {
    id: 'o61',
    section: 'Demos & proof',
    prompt: 'For each service, is the aisle video enough as a demo, or do you offer live calls?',
  },
  {
    id: 'o62',
    section: 'Demos & proof',
    prompt: 'Any services that are “concept / early” vs “ready to sell now”?',
  },
  {
    id: 'p63',
    section: 'Contact details to publish',
    prompt: 'Confirm public email: christossolonos@gmail.com — yes / no?',
  },
  {
    id: 'p64',
    section: 'Contact details to publish',
    prompt: 'Confirm Discord invite to publish: https://discord.gg/reZX2sqQk — yes / no?',
  },
  {
    id: 'p65',
    section: 'Contact details to publish',
    prompt: 'Any phone number you want public?',
    hint: 'If no, write none',
  },
  {
    id: 'p66',
    section: 'Contact details to publish',
    prompt: 'Preferred first contact channel for serious buyers?',
  },
]

export const STORAGE_KEY = 'solonaras-guide-questionnaire-v1'
