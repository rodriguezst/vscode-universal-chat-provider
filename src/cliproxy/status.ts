import type { ManagementEndpoint } from '@src/cliproxy/api/management-client'
import { ManagementClient } from '@src/cliproxy/api/management-client'

const STATUS_PROBE_TIMEOUT_MS = 1500

export type ServerStatus = 'external'

export interface ServerStatusSnapshot {
  status: ServerStatus
  baseUrl: string
  version?: string
  accounts?: number
}

export async function countAccounts(management: ManagementEndpoint | undefined): Promise<number | undefined> {
  if (management === undefined)
    return undefined
  try {
    const client = new ManagementClient(management.baseUrl, management.key)
    const signal = AbortSignal.timeout(STATUS_PROBE_TIMEOUT_MS)
    const [files, endpoints] = await Promise.all([
      client.listAuthFiles(signal),
      client.listOpenAICompatibility(signal).catch(() => []),
    ])
    return files.length + endpoints.length
  }
  catch {
    return undefined
  }
}
