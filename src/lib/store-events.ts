export type RequestBuildDetail = {
  idea: string
  projectId?: string
  clusterId?: string
}

export function requestBuild(detail: RequestBuildDetail) {
  window.dispatchEvent(
    new CustomEvent<RequestBuildDetail>('solonaras-request-build', {
      detail,
    }),
  )
}

export function openCluster(clusterId: string) {
  window.dispatchEvent(
    new CustomEvent('solonaras-open-cluster', {
      detail: { clusterId },
    }),
  )
}

export function openProject(projectId: string) {
  window.dispatchEvent(
    new CustomEvent('solonaras-open-project', {
      detail: { projectId },
    }),
  )
}

export function ideaFromSelection(opts: {
  projectName?: string | null
  clusterName?: string | null
}): string {
  if (opts.projectName) {
    return `I'm interested in ${opts.projectName}. Here's what I need:\n`
  }
  if (opts.clusterName) {
    return `I'm interested in the ${opts.clusterName} cluster. Here's what I need:\n`
  }
  return ''
}
