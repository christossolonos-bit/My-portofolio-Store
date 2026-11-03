export type Persona = {
  id: string
  name: string
  role: string
  line: string
  /** Open this group when tapped */
  groupId: string
  /** Highlight this build on the shelf */
  projectId: string
  accent: string
}

/** Skim-first demos: tap to hear a line and jump into Companions. */
export const PERSONAS: Persona[] = [
  {
    id: 'luna',
    name: 'Luna',
    role: 'Companion',
    line: "I'm Luna. Persistent memory, voice, and presence on your machine. Open my tour to see the stack.",
    groupId: 'companions',
    projectId: 'luna-agent',
    accent: '#2ee6a6',
  },
  {
    id: 'viktor',
    name: 'Viktor',
    role: 'Tactical',
    line: "Viktor here. Multi-persona systems, sharper tone, same foundation. Watch the tour for the cast in action.",
    groupId: 'companions',
    projectId: 'lunariko',
    accent: '#5ec8ff',
  },
  {
    id: 'himari',
    name: 'Himari',
    role: 'Character',
    line: "Himari. Personality-first agents, not generic assistants. Tap the video when you're ready.",
    groupId: 'companions',
    projectId: 'choko',
    accent: '#a78bfa',
  },
]

export const HERO_PROOF = [
  { label: 'Luna 5.0', detail: 'Companion stack' },
  { label: 'Voice & stage', detail: 'Live talk-back' },
  { label: 'Live agents', detail: 'Stream & games' },
  { label: 'Author & web', detail: 'Tools + sites' },
] as const
