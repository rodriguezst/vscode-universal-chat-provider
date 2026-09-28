import type { ExtensionContext } from 'vscode'
import { UniversalChatProvider } from '@src/chat/provider'
import { ServerController } from '@src/cliproxy/controller'
import { registerCommands } from '@src/extension/commands'
import { createStatusBar, updateStatusBar } from '@src/extension/ui/status-bar'
import { maybeSuggestUtilityModel } from '@src/extension/utility-model-nudge'
import { setJsonValidationErrorReporter } from '@src/shared/json'
import { lm, window, workspace } from 'vscode'

let provider: UniversalChatProvider | undefined
let controller: ServerController | undefined

export function activate(context: ExtensionContext): void {
  const output = window.createOutputChannel('Universal Chat Provider', { log: true })
  setJsonValidationErrorReporter(message => output.error(message))
  controller = new ServerController(context, output)
  provider = new UniversalChatProvider(context, output, controller, async () => controller!.login())

  const statusBar = createStatusBar()
  const renderStatusBar = (): void => updateStatusBar(statusBar, 'external', provider?.quotaSections() ?? [], provider?.currentModelQuota())
  provider.onActivity = (model) => {
    renderStatusBar()
    controller!.scheduleQuotaRefresh(model)
  }
  controller.setRefreshListener(async (expectedModelIds) => {
    await provider?.forceRefresh(false, expectedModelIds)
  })
  controller.setQuotaListener((reports) => {
    provider?.setQuotas(reports)
    renderStatusBar()
  })
  renderStatusBar()

  context.subscriptions.push(
    output,
    controller,
    statusBar,
    provider,
    workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('universalChatProvider.showQuotaWarnings') || event.affectsConfiguration('universalChatProvider.quotaWarningThreshold'))
        renderStatusBar()
    }),
    lm.registerLanguageModelChatProvider('universal-chat-provider', provider),
    ...registerCommands(provider, controller, output),
  )

  statusBar.show()
  void provider.initialize().then(async () => controller?.refreshQuotas())
  void maybeSuggestUtilityModel(context)
}

export function deactivate(): void {
  provider = undefined
  controller = undefined
}
