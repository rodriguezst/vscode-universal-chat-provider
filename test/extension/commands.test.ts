import type { UniversalChatProvider } from '@src/chat/provider'
import type { ServerController, ServerStatusSnapshot } from '@src/cliproxy/controller'
import type { QuotaSection } from '@src/extension/ui/quota-menu'
import type { QuickPickItem } from 'vscode'
import { readFileSync } from 'node:fs'
import { registerCommands } from '@src/extension/commands'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  commands,
  createOutputChannelMock,
  resetVSCodeMock,
  vscodeMock,
  window,
} from '../support/vscode'

beforeEach(() => {
  resetVSCodeMock()
})

describe('registerCommands', () => {
  it('matches every command contributed by the extension manifest', () => {
    createCommandHarness()
    const manifest = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
      contributes: { commands: Array<{ command: string }> }
    }

    expect([...vscodeMock.commandHandlers.keys()].sort()).toEqual(
      manifest.contributes.commands.map(entry => entry.command).sort(),
    )
  })

  it.each([
    ['login', (harness: CommandHarness) => harness.controller.login],
    ['manageAccounts', (harness: CommandHarness) => harness.controller.manageAccounts],
    ['configure', (harness: CommandHarness) => harness.provider.configure],
  ] as const)('forwards %s to its owner', async (command, getMethod) => {
    const harness = createCommandHarness()

    await commands.executeCommand(`universalChatProvider.${command}`)

    expect(getMethod(harness)).toHaveBeenCalledTimes(1)
  })

  it('refreshes models and reports the discovered count', async () => {
    const { provider } = createCommandHarness()
    provider.forceRefresh.mockResolvedValueOnce([{ id: 'a' }, { id: 'b' }])

    await commands.executeCommand('universalChatProvider.refresh')

    expect(provider.forceRefresh).toHaveBeenCalledWith(true)
    expect(window.showInformationMessage).toHaveBeenCalledWith('CLIProxyAPI exposed 2 chat models.')
  })

  it('opens the quota picker with provider data and controller reset actions', async () => {
    const { provider, controller } = createCommandHarness()
    provider.quotaSections.mockReturnValueOnce([
      { title: 'Codex', entries: [{ name: '5h Quota', remainingPercent: 75 }] },
    ])

    await commands.executeCommand('universalChatProvider.showQuota')

    expect(controller.refreshQuotas).toHaveBeenCalledTimes(1)
    expect(controller.listCodexResets).toHaveBeenCalledTimes(1)
    expect(window.showQuickPick.mock.calls[0]?.[0]).toEqual([
      expect.objectContaining({ label: 'Codex · 5h Quota — 75% left' }),
    ])
  })

  it('delegates utility-model selection', async () => {
    const { provider } = createCommandHarness()

    await commands.executeCommand('universalChatProvider.setUtilityModel')

    expect(provider.getModels).toHaveBeenCalledWith(true)
    expect(window.showWarningMessage).toHaveBeenCalledWith(
      'No Universal Chat Provider models are available. Configure the provider and refresh its models first.',
    )
  })

  it('clears credentials only after confirmation', async () => {
    const { provider } = createCommandHarness()

    window.showWarningMessage.mockResolvedValueOnce(undefined)
    await commands.executeCommand('universalChatProvider.clearCredentials')
    expect(provider.clearCredentials).not.toHaveBeenCalled()

    window.showWarningMessage.mockResolvedValueOnce('Remove')
    await commands.executeCommand('universalChatProvider.clearCredentials')
    expect(provider.clearCredentials).toHaveBeenCalledTimes(1)
  })

  it('shows extension logs', async () => {
    const { output } = createCommandHarness()

    await commands.executeCommand('universalChatProvider.showLogs')

    expect(output.show).toHaveBeenCalledWith(true)
  })

  it('opens settings scoped to this extension', async () => {
    createCommandHarness()

    await commands.executeCommand('universalChatProvider.openSettings')

    expect(commands.executeCommand).toHaveBeenCalledWith(
      'workbench.action.openSettings',
      '@ext:maxdewald.universal-chat-provider',
    )
  })
})

describe('manageProvider', () => {
  it('always shows connection actions and no lifecycle actions', async () => {
    const { controller } = createCommandHarness()
    controller.statusSnapshot.mockResolvedValue({
      status: 'external',
      baseUrl: 'http://127.0.0.1:8317',
      version: '8.1.0',
      accounts: 2,
    })
    window.showQuickPick.mockResolvedValueOnce(undefined)

    await commands.executeCommand('universalChatProvider.manage')

    const labels = quickPickLabels()
    expect(labels[0]).toBe('$(server) External CLI Proxy API server')
    expect(labels).toContain('$(settings-gear) Configure Connection')
  })

  it('dispatches the status row to extension logs', async () => {
    const { controller } = createCommandHarness()
    controller.statusSnapshot.mockResolvedValue({
      status: 'external',
      baseUrl: 'http://127.0.0.1:8317',
    })
    window.showQuickPick.mockImplementationOnce(async items => (items as QuickPickItem[])[0])

    await commands.executeCommand('universalChatProvider.manage')

    expect(commands.executeCommand).toHaveBeenCalledWith('universalChatProvider.showLogs')
  })
})

function createCommandHarness() {
  const provider = {
    quotaSections: vi.fn((): QuotaSection[] => []),
    forceRefresh: vi.fn(async () => [] as Array<{ id: string }>),
    configure: vi.fn(async () => {}),
    getModels: vi.fn(async () => []),
    getUtilityEffort: vi.fn(() => undefined),
    updateUtilityEffort: vi.fn(async () => {}),
    clearCredentials: vi.fn(async () => {}),
  }
  const controller = {
    statusSnapshot: vi.fn<() => Promise<ServerStatusSnapshot>>(async () => ({
      status: 'external',
      baseUrl: 'http://127.0.0.1:8317',
    })),
    login: vi.fn(async () => {}),
    manageAccounts: vi.fn(async () => {}),
    refreshQuotas: vi.fn(async () => {}),
    listCodexResets: vi.fn(async () => []),
    claimCodexReset: vi.fn(async () => 'failed' as const),
  }
  const output = createOutputChannelMock('Universal Chat Provider')
  registerCommands(
    provider as unknown as UniversalChatProvider,
    controller as unknown as ServerController,
    output as never,
  )
  return { provider, controller, output }
}

type CommandHarness = ReturnType<typeof createCommandHarness>

function quickPickLabels(): string[] {
  return (window.showQuickPick.mock.calls[0]?.[0] as QuickPickItem[]).map(item => item.label)
}
