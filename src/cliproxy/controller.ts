import type { ManagementEndpoint } from '@src/cliproxy/api/management-client'
import type { ProxyConnection } from '@src/cliproxy/connection'
import type { CodexResetOption, CodexResetOutcome } from '@src/cliproxy/quota/codex-resets'
import type { QuotaReport } from '@src/cliproxy/quota/quota'
import type { ServerStatus, ServerStatusSnapshot } from '@src/cliproxy/status'
import type { ExtensionContext, OutputChannel } from 'vscode'
import { AccountsService } from '@src/cliproxy/accounts/accounts'
import { ManagementClient } from '@src/cliproxy/api/management-client'
import { configuredBaseUrl } from '@src/cliproxy/configuration/credentials'
import { claimCodexReset, listCodexResets } from '@src/cliproxy/quota/codex-resets'
import { fetchQuotas, quotaProviderForModel } from '@src/cliproxy/quota/quota'
import { countAccounts } from '@src/cliproxy/status'
import { errorMessage } from '@src/shared/errors'
import { window, workspace } from 'vscode'

const MANAGEMENT_PROBE_TIMEOUT_MS = 1500
const QUOTA_REFRESH_INTERVAL_MS = 180_000

export type { ServerStatus, ServerStatusSnapshot } from '@src/cliproxy/status'

export class ServerController implements ProxyConnection {
  private readonly accounts: AccountsService
  private readonly quotaBackoff = new Map<string, number>()
  private quotaReports: QuotaReport[] = []
  private readonly lastQuotaRefresh = new Map<QuotaReport['provider'], number>()
  private activeQuotaProvider: QuotaReport['provider'] | undefined
  private quotaListener: ((reports: QuotaReport[]) => void) | undefined
  private refreshListener: ((expectedModelIds?: readonly string[]) => Promise<void>) | undefined

  constructor(
    private readonly context: ExtensionContext,
    private readonly output: OutputChannel,
  ) {
    this.accounts = new AccountsService({
      resolveManagement: async () => this.resolveManagement(),
      state: this.context.globalState,
      onAccountsChanged: async expectedModelIds => this.notifyAccountsChanged(expectedModelIds),
    })
  }

  baseUrl(): string {
    return configuredBaseUrl()
  }

  async acquireRequest(): Promise<() => void> {
    return () => {}
  }

  async statusSnapshot(): Promise<ServerStatusSnapshot> {
    const management = await this.managementForStatus()
    const accounts = await countAccounts(management)
    return {
      status: 'external',
      baseUrl: this.baseUrl(),
      ...(management?.version !== undefined ? { version: management.version } : {}),
      ...(accounts !== undefined ? { accounts } : {}),
    }
  }

  async ensureReady(): Promise<void> {}

  setRefreshListener(listener: (expectedModelIds?: readonly string[]) => Promise<void>): void {
    this.refreshListener = listener
  }

  setStatusListener(_listener: (status: ServerStatus) => void): void {}

  setQuotaListener(listener: (reports: QuotaReport[]) => void): void {
    this.quotaListener = listener
  }

  scheduleQuotaRefresh(model: { proxyOwner: string }): void {
    this.activeQuotaProvider = quotaProviderForModel(model)
    void this.refreshQuotas()
  }

  async login(): Promise<void> {
    return this.accounts.login()
  }

  async manageAccounts(): Promise<void> {
    return this.accounts.manageAccounts()
  }

  async listCodexResets(): Promise<CodexResetOption[]> {
    const management = await this.resolveManagement()
    if (management === undefined)
      return []
    return listCodexResets(new ManagementClient(management.baseUrl, management.key))
  }

  async claimCodexReset(option: CodexResetOption, redeemRequestId: string): Promise<CodexResetOutcome> {
    const management = await this.resolveManagement()
    if (management === undefined)
      return 'failed'
    const outcome = await claimCodexReset(new ManagementClient(management.baseUrl, management.key), option, redeemRequestId)
    if (outcome !== 'failed')
      await this.refreshQuotas()
    return outcome
  }

  dispose(): void {}

  async refreshQuotas(): Promise<void> {
    const provider = this.activeQuotaProvider
    if (this.quotaListener === undefined)
      return
    if (provider !== undefined) {
      const lastRefresh = this.lastQuotaRefresh.get(provider)
      if (lastRefresh !== undefined && Date.now() - lastRefresh < QUOTA_REFRESH_INTERVAL_MS)
        return
      // Claimed before awaiting so a concurrent call is gated by the same window.
      this.lastQuotaRefresh.set(provider, Date.now())
    }
    return this.performQuotaRefresh(provider)
  }

  private async performQuotaRefresh(provider: QuotaReport['provider'] | undefined): Promise<void> {
    const management = await this.managementForStatus()
    if (management === undefined) {
      if (provider !== undefined)
        this.lastQuotaRefresh.delete(provider)
      return
    }
    try {
      const reports = await fetchQuotas(
        new ManagementClient(management.baseUrl, management.key),
        undefined,
        this.quotaBackoff,
        provider,
      )
      for (const report of reports) {
        if (report.error !== undefined)
          this.output.appendLine(`Quota fetch failed for ${report.provider}${report.account === undefined ? '' : ` (${report.account.label})`}: ${report.error}`)
      }
      this.quotaReports = provider === undefined
        ? reports
        : [...this.quotaReports.filter(report => report.provider !== provider), ...reports]
      this.quotaListener?.(this.quotaReports)
    }
    catch (error) {
      this.output.appendLine(`Quota refresh failed: ${errorMessage(error)}`)
    }
  }

  private async resolveManagement(): Promise<ManagementEndpoint | undefined> {
    const key = this.managementKey()
    if (key === undefined) {
      void window.showWarningMessage(
        'To manage accounts and quotas, enter the CLIProxyAPI management key in universalChatProvider.server.managementKey.',
      )
      return undefined
    }
    return { baseUrl: this.baseUrl(), key }
  }

  private managementKey(): string | undefined {
    return workspace.getConfiguration('universalChatProvider').get<string>('server.managementKey', '').trim() || undefined
  }

  private async managementForStatus(): Promise<ManagementEndpoint & { version?: string } | undefined> {
    const key = this.managementKey()
    if (key === undefined)
      return undefined
    const baseUrl = this.baseUrl()
    try {
      const version = await new ManagementClient(baseUrl, key).serverVersion(AbortSignal.timeout(MANAGEMENT_PROBE_TIMEOUT_MS))
      return version === undefined ? { baseUrl, key } : { baseUrl, key, version }
    }
    catch {
      return undefined
    }
  }

  private async notifyAccountsChanged(expectedModelIds?: readonly string[]): Promise<void> {
    await this.refreshListener?.(expectedModelIds)
  }
}
