import type { ExtensionContext } from 'vscode'
import process from 'node:process'
import { ConfigurationTarget, window, workspace } from 'vscode'

export const SECRET_KEY = 'universalChatProvider.apiKey'
export const DEFAULT_BASE_URL = 'http://127.0.0.1:8317'

const DEFAULT_BASE_URL_ENV_VAR = 'UNIVERSAL_CHAT_PROVIDER_BASE_URL'
const DEFAULT_API_KEY_ENV_VAR = 'UNIVERSAL_CHAT_PROVIDER_API_KEY'

export class CredentialStore {
  constructor(private readonly context: ExtensionContext) {}

  async get(): Promise<string | undefined> {
    const stored = await this.context.secrets.get(SECRET_KEY)
    if (stored !== undefined && stored.trim() !== '')
      return stored.trim()
    const configuredKey = workspace.getConfiguration('universalChatProvider').get<string>('apiKey', '').trim()
    return environmentValue('apiKeyEnvVar', DEFAULT_API_KEY_ENV_VAR)
      ?? (configuredKey === '' ? undefined : configuredKey)
  }

  set(value: string): Thenable<void> {
    return this.context.secrets.store(SECRET_KEY, value)
  }

  clear(): Thenable<void> {
    return this.context.secrets.delete(SECRET_KEY)
  }

  async prompt(): Promise<string | undefined> {
    const value = await window.showInputBox({
      title: 'CLIProxyAPI API Key',
      prompt: 'Enter an API key accepted by the CLIProxyAPI server.',
      password: true,
      ignoreFocusOut: true,
      validateInput: input => input.trim() ? undefined : 'An API key is required.',
    })
    if (value === undefined || value.length === 0)
      return undefined
    await this.set(value.trim())
    return value.trim()
  }
}

export function environmentValue(settingName: string, defaultVariable: string): string | undefined {
  const variable = workspace.getConfiguration('universalChatProvider').get<string>(settingName, defaultVariable).trim()
  if (variable === '')
    return undefined
  const value = process.env[variable]?.trim()
  return value === '' ? undefined : value
}

export function configuredBaseUrl(): string {
  return normalizeBaseUrl(environmentValue('baseUrlEnvVar', DEFAULT_BASE_URL_ENV_VAR)
    ?? workspace.getConfiguration('universalChatProvider').get<string>('baseUrl', DEFAULT_BASE_URL))
}

export async function configureConnection(): Promise<boolean> {
  const settings = workspace.getConfiguration('universalChatProvider')
  const baseUrl = await window.showInputBox({
    title: 'CLIProxyAPI Base URL',
    value: configuredBaseUrl(),
    prompt: 'Base URL of the CLIProxyAPI server.',
    ignoreFocusOut: true,
    validateInput: validateHttpUrl,
  })
  if (baseUrl === undefined || baseUrl.length === 0)
    return false
  await settings.update('baseUrl', normalizeBaseUrl(baseUrl), ConfigurationTarget.Global)

  return true
}

export function normalizeBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, '')
}

function validateHttpUrl(value: string): string | undefined {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? undefined
      : 'Use an http:// or https:// URL.'
  }
  catch {
    return 'Enter a valid URL.'
  }
}
