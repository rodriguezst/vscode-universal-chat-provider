import type { ExtensionContext } from 'vscode'
import { ManagementClient } from '@src/cliproxy/api/management-client'
import { ServerController } from '@src/cliproxy/controller'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createExtensionContext, resetVSCodeMock, vscodeMock, window } from '../support/vscode'

describe('server controller', () => {
  beforeEach(() => {
    resetVSCodeMock()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('uses the configured external base URL', () => {
    vscodeMock.settings.set('universalChatProvider.baseUrl', ' http://127.0.0.1:8317/ ')
    const controller = new ServerController(context('/tmp/ucp-controller'), vscodeMock.output as never)

    expect(controller.baseUrl()).toBe('http://127.0.0.1:8317')
  })

  it('acquires requests without managing server lifecycle', async () => {
    const controller = new ServerController(context('/tmp/ucp-controller'), vscodeMock.output as never)

    await expect(controller.acquireRequest()).resolves.toBeTypeOf('function')
    await expect(controller.ensureReady()).resolves.toBeUndefined()
  })

  it('requires a management key for account operations', async () => {
    const controller = new ServerController(context('/tmp/ucp-controller'), vscodeMock.output as never)

    await expect(controller.listCodexResets()).resolves.toEqual([])
    expect(window.showWarningMessage).toHaveBeenCalledWith(
      'To manage accounts and quotas, enter the CLIProxyAPI management key in universalChatProvider.server.managementKey.',
    )
  })

  it('reports unavailable management state without throwing', async () => {
    vscodeMock.settings.set('universalChatProvider.baseUrl', 'http://127.0.0.1:9')
    vscodeMock.settings.set('universalChatProvider.server.managementKey', 'secret')
    const controller = new ServerController(context('/tmp/ucp-controller'), vscodeMock.output as never)

    const snapshot = await controller.statusSnapshot()

    expect(snapshot).toEqual({ status: 'external', baseUrl: 'http://127.0.0.1:9' })
  })

  it('reports server version and external accounts', async () => {
    vscodeMock.settings.set('universalChatProvider.server.managementKey', 'secret')
    const controller = new ServerController(context('/tmp/ucp-controller'), vscodeMock.output as never)
    const serverVersion = vi.spyOn(ManagementClient.prototype, 'serverVersion').mockResolvedValue('8.1.0')
    const listAuthFiles = vi.spyOn(ManagementClient.prototype, 'listAuthFiles').mockResolvedValue([{ name: 'codex.json' }])
    const listOpenAICompatibility = vi.spyOn(ManagementClient.prototype, 'listOpenAICompatibility').mockResolvedValue([])

    const snapshot = await controller.statusSnapshot()

    expect(serverVersion).toHaveBeenCalledOnce()
    expect(listAuthFiles).toHaveBeenCalledOnce()
    expect(listOpenAICompatibility).toHaveBeenCalledOnce()
    expect(snapshot).toMatchObject({ status: 'external', version: '8.1.0', accounts: 1 })
  })

  it('refreshes only the active model provider at most once every three minutes', async () => {
    vi.useFakeTimers({ now: new Date('2026-07-30T12:00:00Z') })
    const controller = new ServerController(context('/tmp/ucp-controller'), vscodeMock.output as never)
    controller.setQuotaListener(vi.fn())
    vscodeMock.settings.set('universalChatProvider.server.managementKey', 'secret')
    vi.spyOn(ManagementClient.prototype, 'serverVersion').mockResolvedValue(undefined)
    vi.spyOn(ManagementClient.prototype, 'listAuthFilesRaw').mockResolvedValue([
      { name: 'codex.json', provider: 'codex', auth_index: 'c1' },
      { name: 'claude.json', provider: 'claude', auth_index: 'a1' },
    ])
    const apiCall = vi.spyOn(ManagementClient.prototype, 'apiCall').mockResolvedValue({
      statusCode: 200,
      header: {},
      body: JSON.stringify({ rate_limit: {} }),
    })

    controller.scheduleQuotaRefresh({ proxyOwner: 'openai' })
    await vi.waitFor(() => expect(apiCall).toHaveBeenCalledTimes(1))
    expect(apiCall.mock.calls[0]?.[0].url).toContain('wham/usage')

    controller.scheduleQuotaRefresh({ proxyOwner: 'openai' })
    await Promise.resolve()
    expect(apiCall).toHaveBeenCalledTimes(1)

    controller.scheduleQuotaRefresh({ proxyOwner: 'anthropic' })
    await vi.waitFor(() => expect(apiCall).toHaveBeenCalledTimes(2))
    expect(apiCall.mock.calls[1]?.[0].url).toContain('oauth/usage')

    await vi.advanceTimersByTimeAsync(180_000)
    controller.scheduleQuotaRefresh({ proxyOwner: 'openai' })
    await vi.waitFor(() => expect(apiCall).toHaveBeenCalledTimes(3))
  })

  it('refreshes all quota providers', async () => {
    const listener = vi.fn()
    const controller = new ServerController(context('/tmp/ucp-controller'), vscodeMock.output as never)
    controller.setQuotaListener(listener)
    vscodeMock.settings.set('universalChatProvider.server.managementKey', 'secret')
    vi.spyOn(ManagementClient.prototype, 'serverVersion').mockResolvedValue(undefined)
    vi.spyOn(ManagementClient.prototype, 'listAuthFilesRaw').mockResolvedValue([
      { name: 'codex.json', provider: 'codex', auth_index: 'c1' },
      { name: 'claude.json', provider: 'claude', auth_index: 'a1' },
    ])
    vi.spyOn(ManagementClient.prototype, 'apiCall').mockResolvedValue({
      statusCode: 200,
      header: {},
      body: JSON.stringify({ rate_limit: {} }),
    })

    await controller.refreshQuotas()

    expect(listener).toHaveBeenCalledWith([
      expect.objectContaining({ provider: 'codex' }),
      expect.objectContaining({ provider: 'claude' }),
    ])
  })

  it('awaits one model refresh after an account change', async () => {
    let releaseRefresh!: () => void
    const refresh = vi.fn(async () => new Promise<void>(resolve => releaseRefresh = resolve))
    const controller = new ServerController(context('/tmp/ucp-controller'), vscodeMock.output as never)
    controller.setRefreshListener(refresh)
    const accounts = (controller as unknown as { accounts: { deps: { onAccountsChanged: (expectedModelIds?: readonly string[]) => Promise<void> } } }).accounts

    const changed = accounts.deps.onAccountsChanged(['codegate/gpt-5.6-sol'])
    expect(refresh).toHaveBeenCalledWith(['codegate/gpt-5.6-sol'])
    let completed = false
    void changed.then(() => completed = true)
    await Promise.resolve()
    expect(completed).toBe(false)

    releaseRefresh()
    await changed
    expect(completed).toBe(true)
  })
})

function context(root: string): ExtensionContext {
  return createExtensionContext({ globalStoragePath: root })
}
