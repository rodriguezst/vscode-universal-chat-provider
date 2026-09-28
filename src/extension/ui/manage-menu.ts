import type { ServerController, ServerStatusSnapshot } from '@src/cliproxy/controller'
import type { QuickPickItem } from 'vscode'
import { commands, QuickPickItemKind, window } from 'vscode'

export interface ManageAction extends QuickPickItem {
  command: string
  group?: number
}

type Choice = QuickPickItem & { command?: string }

function divider(): Choice {
  return { label: '', kind: QuickPickItemKind.Separator }
}

export async function manageProvider(controller: ServerController | undefined, actions: ManageAction[]): Promise<void> {
  const snapshot = await controller?.statusSnapshot()
  let previousGroup: number | undefined
  const body = actions.flatMap((action) => {
    const separated = previousGroup !== undefined && action.group !== previousGroup
    previousGroup = action.group
    return separated ? [divider(), action] : [action]
  })
  const choices: Choice[] = snapshot !== undefined
    ? [statusEntry(snapshot), divider(), ...body]
    : body
  const selected = await window.showQuickPick(choices, {
    title: 'Manage Universal Chat Provider',
    placeHolder: 'Choose an action',
  })
  if (selected?.command !== undefined)
    await commands.executeCommand(selected.command)
}

function statusEntry(snapshot: ServerStatusSnapshot): QuickPickItem & { command: string } {
  const accounts = snapshot.accounts === undefined
    ? undefined
    : `${snapshot.accounts} ${snapshot.accounts === 1 ? 'account' : 'accounts'} connected`
  const detail = [
    snapshot.version !== undefined ? `Version ${snapshot.version}` : undefined,
    accounts,
  ].filter((part): part is string => part !== undefined).join('  ·  ')
  return {
    label: '$(server) External CLI Proxy API server',
    description: snapshot.baseUrl.replace(/^https?:\/\//, ''),
    ...(detail === '' ? {} : { detail }),
    command: 'universalChatProvider.showLogs',
  }
}
