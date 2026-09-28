import process from 'node:process'
import {
  configureConnection,
  configuredBaseUrl,
  CredentialStore,
  normalizeBaseUrl,
} from '@src/cliproxy/configuration/credentials'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createExtensionContext, resetVSCodeMock, vscodeMock, window } from '../../support/vscode'

beforeEach(() => {
  resetVSCodeMock()
})

afterEach(() => {
  delete process.env['UCP_TEST_API_KEY']
  delete process.env['UCP_TEST_BASE_URL']
})

describe('credentials', () => {
  it('normalizes URLs', () => {
    expect(normalizeBaseUrl(' https://proxy/// ')).toBe('https://proxy')
  })

  it('prompts, trims, stores, retrieves, and clears secrets', async () => {
    const context = createExtensionContext()
    const store = new CredentialStore(context)
    window.showInputBox.mockResolvedValueOnce('  entered-key  ')

    await expect(store.prompt()).resolves.toBe('entered-key')
    await expect(store.get()).resolves.toBe('entered-key')
    await store.clear()
    await expect(store.get()).resolves.toBeUndefined()

    window.showInputBox.mockResolvedValueOnce(undefined)
    await expect(store.prompt()).resolves.toBeUndefined()
  })

  it('prefers SecretStorage, then the environment, then the settings-file key', async () => {
    const context = createExtensionContext()
    const store = new CredentialStore(context)
    vscodeMock.settings.set('universalChatProvider.apiKeyEnvVar', 'UCP_TEST_API_KEY')
    vscodeMock.settings.set('universalChatProvider.apiKey', 'settings-key')

    process.env['UCP_TEST_API_KEY'] = ' environment-key '
    await expect(store.get()).resolves.toBe('environment-key')

    process.env['UCP_TEST_API_KEY'] = ' '
    await expect(store.get()).resolves.toBe('settings-key')

    delete process.env['UCP_TEST_API_KEY']
    vscodeMock.settings.set('universalChatProvider.apiKey', '  ')
    await expect(store.get()).resolves.toBeUndefined()

    vscodeMock.secrets.set('universalChatProvider.apiKey', ' stored-key ')
    await expect(store.get()).resolves.toBe('stored-key')
  })

  it('reads the base URL from the configured environment variable before settings', () => {
    vscodeMock.settings.set('universalChatProvider.baseUrlEnvVar', 'UCP_TEST_BASE_URL')
    vscodeMock.settings.set('universalChatProvider.baseUrl', 'http://settings-proxy')

    process.env['UCP_TEST_BASE_URL'] = ' http://environment-proxy/ '
    expect(configuredBaseUrl()).toBe('http://environment-proxy')

    delete process.env['UCP_TEST_BASE_URL']
    expect(configuredBaseUrl()).toBe('http://settings-proxy')
  })

  it('configures only the URL, respecting cancellation', async () => {
    window.showInputBox
      .mockResolvedValueOnce(' http://proxy/// ')

    await expect(configureConnection()).resolves.toBe(true)
    expect(vscodeMock.settings.get('universalChatProvider.baseUrl')).toBe('http://proxy')
    expect(window.showInputBox).toHaveBeenCalledTimes(1)

    window.showInputBox.mockResolvedValueOnce(undefined)
    await expect(configureConnection()).resolves.toBe(false)

    const validation = window.showInputBox.mock.calls[0]?.[0]?.validateInput
    expect(validation?.('ftp://proxy')).toBe('Use an http:// or https:// URL.')
    expect(validation?.('not a url')).toBe('Enter a valid URL.')
    expect(validation?.('https://proxy.example.com/')).toBeUndefined()
  })
})
