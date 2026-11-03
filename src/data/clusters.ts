import { projects, type Project } from './projects'

export type Cluster = {
  id: string
  name: string
  summary: string
  /** One-line proof: who · what shipped */
  caseLine: string
  accent: string
  projectIds: string[]
}

export const clusters: Cluster[] = [
  {
    id: 'companions',
    name: 'Companions',
    summary:
      'Full AI companions, multi-persona casts, character agents, and always-on desktop presence.',
    caseLine:
      'Solonaras channel · Luna companion stacks with profiles, TTS, and streaming avatars.',
    accent: '#2ee6a6',
    projectIds: ['luna-agent', 'lunariko', 'choko', 'fluffy'],
  },
  {
    id: 'voice-stage',
    name: 'Voice & Stage',
    summary:
      'Live voice presence, singing avatars, and music agents that keep a set moving.',
    caseLine:
      'Live Discord / call demos · Gaida talk-back and singing avatar performance clips.',
    accent: '#5ec8ff',
    projectIds: ['luna-gaida', 'singing-sdk', 'dj-agent'],
  },
  {
    id: 'live-games',
    name: 'Live & Games',
    summary:
      'Broadcast talent, Minecraft agents that learn, and screen-aware vision co-hosts.',
    caseLine:
      '48-hour stream tests · Minecraft co-op agents and League vision co-host sessions.',
    accent: '#ff7a59',
    projectIds: ['luna-streamer', 'luna-minecraft', 'luna-vision'],
  },
  {
    id: 'author-web',
    name: 'Author & Web',
    summary:
      'Manuscript workspaces that keep your voice, plus custom sites and client worlds.',
    caseLine:
      'AuthorHub for real manuscripts · client brand sites with pages, design, and domain setup.',
    accent: '#f97316',
    projectIds: ['book-editor', 'client-work'],
  },
]

export function projectsInCluster(cluster: Cluster): Project[] {
  return cluster.projectIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p))
}

export function clusterForProject(projectId: string): Cluster | undefined {
  return clusters.find((c) => c.projectIds.includes(projectId))
}

