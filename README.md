<div align="center">

<img src="images/logo.png" width="132" alt="Universal Chat Provider logo" />

<h1>Universal Chat Provider</h1>

<p>
  <b>The VS&nbsp;Code extension that brings your Claude, ChatGPT&nbsp;/&nbsp;Codex, Antigravity, and more subscriptions into GitHub&nbsp;Copilot&nbsp;Chat</b><br/>
  <sub>No API key — just OAuth. <br/>…and use them to write your Git commit messages, too.</sub>
</p>

<p>
  <a href="https://marketplace.visualstudio.com/items?itemName=maxdewald.universal-chat-provider"><img src="https://vsmarketplacebadges.dev/version-short/maxdewald.universal-chat-provider.svg?label=Marketplace&color=654FF0" alt="VS Code Marketplace version" /></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=maxdewald.universal-chat-provider"><img src="https://vsmarketplacebadges.dev/installs-short/maxdewald.universal-chat-provider.svg?label=Installs&color=007ACC" alt="Marketplace installs" /></a>
  <img src="https://img.shields.io/badge/VS%20Code-1.131%2B-007ACC?logo=visualstudiocode&logoColor=white" alt="VS Code 1.131+" />
  <img src="https://img.shields.io/badge/license-MIT-3da639?logo=opensourceinitiative&logoColor=white" alt="MIT License" />
</p>

<p>
  <img src="https://img.shields.io/badge/Claude-D97757?logo=claude&logoColor=white" alt="Claude" />
  <img src="https://img.shields.io/badge/Codex-10A37F?logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiNmZmYiIHZpZXdCb3g9IjAgMCAyNCAyNCI%2BPHRpdGxlPk9wZW5BSTwvdGl0bGU%2BPHBhdGggZD0iTTIyLjMgOS44YTYgNiAwIDAgMC0uNS00LjlBNiA2IDAgMCAwIDE1LjMgMiA2IDYgMCAwIDAgNSA0LjIgNiA2IDAgMCAwIDEgN2E2IDYgMCAwIDAgLjcgNyA2IDYgMCAwIDAgLjUgNSA2IDYgMCAwIDAgNi42IDMgNiA2IDAgMCAwIDQuNSAyIDYgNiAwIDAgMCA1LjctNC4yIDYgNiAwIDAgMCA0LTIuOSA2IDYgMCAwIDAtLjctN20tOSAxMi41YTUgNSAwIDAgMS0zLTFoLjJsNC44LTIuOC40LS43VjExbDIgMS4yVjE4YTQuNSA0LjUgMCAwIDEtNC40IDQuNW0tOS43LTQuMWE1IDUgMCAwIDEtLjUtM2guMUw4IDE4LjJoLjhsNS44LTMuM1YxN2wtNC45IDNhNC41IDQuNSAwIDAgMS02LjEtMS42TTIuMyA3LjlhNSA1IDAgMCAxIDIuNC0ydjUuN2wuNC43IDUuOCAzLjMtMiAxLjItNS0yLjhhNC41IDQuNSAwIDAgMS0xLjYtNi4xTTE5IDExLjhsLTUuOC0zLjQgMi0xLjIgNSAyLjhhNC41IDQuNSAwIDAgMS0uOCA4LjF2LTUuN3ptMi0zdi0uMkwxNiA2aC0uN0w5LjQgOS4yVjdsNC45LTNhNC41IDQuNSAwIDAgMSA2LjYgNC43em0tMTIuNiA0LTItMS4xVjZhNC41IDQuNSAwIDAgMSA3LjMtMy41bC0uMS4xLTQuOCAyLjgtLjQuNnptMS4xLTIuM0wxMiA5bDIuNiAxLjV2M0wxMiAxNWwtMi42LTEuNVoiLz48L3N2Zz4%3D&logoColor=white" alt="Codex" />
  <img src="https://img.shields.io/badge/Antigravity-174EA6?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAA%2F1BMVEUAAAA0i%2BpOhulXnp8xiPLWX1CboVYxiPGZcJstje4ZfP0A%2F%2F9Spv9zsnIAAP%2BycGz1bGZvfMvHkzo9nrydtFPbbjxttW7%2FAAB4eq5ocfN%2Ff3%2B1qjyOwFVQp6vgVU5Vh%2B7%2F%2FwCyY2qCecIqcbgA%2FwDbVVTdbDxWhu7qbCm0pDzKlTgorbd%2F%2F39xcbidaqi0sj1xunNSq5pLp6P%2FAP9%2FfwCbcKfEhESju0OGhoaOwFb%2F%2F%2F%2BMwFbUlD8%2Fv3%2Bka56%2Ffz8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC38tR1AAAAQHRSTlMA6u3pn%2BHhX%2BQeBAEE7AHeDejV7xDSCAHgCQLo8guvVwEL7AMBaJmaGBm3FgIDGpCqUpQBAnDUtNxmAZUMBKEEGbxtBgAAAk9JREFUeNqNlmtX4jAYhKcQGpKUAFpgy01gRRBddV1ddd3L%2F%2F9Xm6RJG3qD%2BdBztPPknWnSU4AKxf%2F0dT3AebrWl9vfL8Bkco5%2FpdyPh4vD4WYP7M%2Fx3z7OZhdKo9HNACdjrVbxWzjTxGhkiJcTQDx9C41%2BdpRGy%2F2guUeMj7kHdDpLrJv899ex9YdhCnSaa4zx6fxh345oynSPfEDYt8S2ccTnPOz1HNC3LQb1WxzPe6lSoH%2BixRgfSP3tdvs9I7YNFZ6sW%2Bu927VEXe1fGOd2pa5WvyHTGPDsSl8ssq2t8NQ%2BBiyxnPyo8guMM2vLyBHdNaYVwALfrT0IUqA1HKbEa%2BWB%2BoNnazeyxFADfytbC6Htl0FQIDaKeEC5xRSLI79HbBTwUALudAXf7zXZvOJbRefny2N%2FRrSGelcLkliU%2FB6RlB7sAndBUAu0rkqZvoLkPsoYwBnNiV0JENPMTph5yOrCSUYkKrQvDpb5JThXdyXnAMkzRYVE1AFc8GwZnhG7AiCkq8DAvcE8cj2io0x5Iur7oZZ1za9kVPy%2FURIVy5GU2CHxdk0y4gIdRwUXzO5H5M1mbgAp%2BrPhheck3ADBS2cmYXbTuZDZQWWucVR%2BT7J%2B%2BV0eEbvFXKKKcLfN9ptNI6S0BcXe%2BQgBRogmKgN5oQgxK0rJqQFInd8RysTV8gLGr%2F6wCSskdQ3toTozo1QjDKL%2BsyEFT1elkfFTjYqmj59AolZVTpYCVDT79TuvomsnGNMY5KkvvhRmbZVcv7%2FinB8hqrD2pgnPkjlL%2FwH0WifRsOvc4wAAAABJRU5ErkJggg%3D%3D" alt="Antigravity" />
  <img src="https://img.shields.io/badge/Muse-0866FF?logo=meta&logoColor=white" alt="Muse" />
  <img src="https://img.shields.io/badge/Kimi-000000?logo=moonshotai&logoColor=white" alt="Kimi" />
  <img src="https://img.shields.io/badge/Grok-202020?logo=x&logoColor=white" alt="Grok" />
  <img src="https://img.shields.io/badge/Devin-000000?logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiNmZmYiIHZpZXdCb3g9IjAgMCAyNCAyNCI%2BPHBhdGggZD0ibTIgOS45IDIuNiAxLjVoLjZsMi41LTEuNS4yLS4xdi0uMWwuMS0uMlY3LjlxMC0xIC44LTEuNGEyIDIgMCAwIDEgMS42IDBsMS4zLjdoLjFsLjIuMWguM2wyLjUtMS42LjMtLjV2LTNsLS4zLS41TDEyLjMuM2gtLjZMOS4xIDEuN3YuMWwtLjIuMXYxLjhxLS4xIDEtLjggMS40YTIgMiAwIDAgMS0xLjYgMGwtMS4zLS43aC0uNkwyIDUuOWwtLjMuNXYzcTAgLjMuMy41bTE0IC43YTIgMiAwIDAgMSAxLjUgMGwxLjMuNy4xLjFoLjVMMjIgOS44bC4zLS42di0zTDIyIDZsLTIuNi0xLjVoLS42TDE2LjMgNkgxNnYuMmwtLjEuMVY4cTAgLjgtLjggMS40YTIgMiAwIDAgMS0xLjYgMGwtMS4zLS44aC0uNkw5LjIgMTBsLS4zLjV2M3EwIC4zLjMuNWwyLjUgMS41aC41bDEuNC0uOGExLjYgMS42IDAgMCAxIDIuNCAxLjRWMThsLjEuMS4yLjEgMi41IDEuNWguNmwyLjYtMS41LjMtLjV2LTNsLS4zLS41LTIuNi0xLjVoLS42bC0xLjMuOGEyIDIgMCAwIDEtMS42IDAgMS42IDEuNiAwIDAgMSAwLTIuOG0tMS4xIDcuNi0yLjUtMS41aC0uMWwtLjItLjFoLS4zbC0xLjMuOGEyIDIgMCAwIDEtMS42IDBROCAxNyA4IDE2LjF2LTEuN2wtLjEtLjJoLS4ybC0yLjUtMS41aC0uNkwyIDE0bC0uMy41djNxMCAuMy4zLjVsMi42IDEuNWguNmwxLjMtLjdhMS42IDEuNiAwIDAgMSAyLjQgMS40VjIybC4xLjJoLjFsMi42IDEuNWguNmwyLjUtMS40LjMtLjZ2LTN6Ii8%2BPC9zdmc%2B" alt="Devin" />
  <img src="https://img.shields.io/badge/OpenAI Compatible-412991?logo=openai&logoColor=white" alt="OpenAI Compatible" />
</p>

</div>

## Features

- **🚀 Ready in minutes** — install, sign in, and start chatting.
- **🔀 Native model picker** — choose your models directly in Copilot Chat.
- **🧠 Reasoning built in** — pick the thinking effort and follow reasoning live.
- **📊 Quota at a glance** — see remaining usage and redeem available Codex resets with confirmation.
- **✨ More than chat** — generate commit messages, titles, and summaries.
- **👥 Account load balancing** — add multiple accounts for the same provider; CLIProxyAPI distributes requests round-robin across available accounts and skips those in cooldown.

<br>

> [!WARNING]
> **Use entirely at your own risk and discretion.** This extension routes chat through your personal AI subscription accounts over OAuth. Accessing subscriptions outside their official apps may violate provider terms and could result in rate limiting or account suspension.

## Demo

<p align="center">
  <img src="https://raw.githubusercontent.com/maxdewald/vscode-universal-chat-provider/main/images/showcase.webp" width="960" alt="Universal Chat Provider showcase: connect subscription accounts, choose chat models and reasoning effort, inspect quota, configure a utility model, and generate a Git commit message" />
</p>

## Quick start

> Requires **VS Code 1.131+** and the **GitHub Copilot Chat** extension.

1. **Install** — get *Universal Chat Provider* from the **[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=maxdewald.universal-chat-provider)**. Prefer to build it yourself? See [Development](#development).
2. **Add an account** — accept the **Add Account** prompt (or run `Universal Chat Provider: Add Account`), pick a provider, and complete OAuth in your browser. Models refresh automatically.
3. **Chat** — open Copilot Chat and select a model under **Universal Chat Provider**.

Manage everything from the status bar item or the *Universal Chat Provider: Manage Provider* command — inspect quota, redeem OpenAI-provided Codex reset credits, and list/remove accounts.

## Model metadata

CLIProxyAPI supplies the available models and their metadata through `/v1/models` and
`/v1/models?client_version=0.156.1`. Proxy metadata takes precedence for all providers,
including custom aliases and configured context windows and thinking levels.
The CLIProxyAPI model catalog and models.dev fill in missing metadata; models.dev also
supplies Fast Mode pricing. Catalog entries are not required when the proxy supplies
a context window. If no output limit is available, the extension uses an 8,192-token
output budget, capped at the context size. This is a fallback budget, not a claim
about the model's actual maximum output.

## Commit messages, titles, and summaries

Let your models handle Copilot's light background tasks and Explore searches. Run *Universal Chat Provider: Set Utility Model* (or use the status bar menu), pick a model (and thinking effort), done. A small, fast, inexpensive model is usually the best fit. Clear it to undo.

<details>
<summary>How it works</summary>

The command points Copilot's `chat.utilityModel`, `chat.utilitySmallModel`, and `chat.exploreAgent.defaultModel` settings at your selected model, so commit messages, chat titles, summaries, and Explore searches run through your accounts. It also sets `chat.byokUtilityModelDefault` to `mainAgent`, so remaining utility flows fall back to your selected chat model instead of Copilot's. When the model supports thinking levels, the command also asks for the utility Thinking Effort; commit messages use `chat.utilitySmallModel` plus that effort. No Copilot subscription required.

</details>

## How it works

The extension connects to an external [CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) server and registers its models with VS Code. Your subscriptions then appear directly in the Copilot Chat model picker.

<p align="center">
  <picture>
    <source srcset="images/how-it-works.svg" type="image/svg+xml" />
    <source media="(prefers-color-scheme: dark)" srcset="images/how-it-works-dark.png" />
    <img src="images/how-it-works-light.png" alt="Your subscriptions run through a local CLIProxyAPI proxy over OAuth and appear in VS Code Copilot Chat as models and as the utility model." width="750" />
  </picture>
</p>

## Reference

<details>
<summary>Settings</summary>

<!-- configs -->

| Key                                           | Description                                                                                          | Type      | Default                   |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------- | ------------------------- |
| ▿ <b>Connection</b>                           |
| `universalChatProvider.baseUrl`               | CLIProxyAPI server URL. The environment variable below takes precedence.                             | `string`  | `"http://127.0.0.1:8317"` |
| `universalChatProvider.baseUrlEnvVar`          | Environment variable containing the CLIProxyAPI URL. Empty disables lookup.                          | `string`  | `"UNIVERSAL_CHAT_PROVIDER_BASE_URL"` |
| `universalChatProvider.apiKey`                 | API-key fallback when SecretStorage and the environment provide none. Plain text in settings.         | `string`  | `""`                      |
| `universalChatProvider.apiKeyEnvVar`           | Environment variable containing the CLIProxyAPI API key. Empty disables lookup.                       | `string`  | `"UNIVERSAL_CHAT_PROVIDER_API_KEY"` |
| `universalChatProvider.server.managementKey`  | Management key used for account and quota administration. Enter the key itself, not its bcrypt hash. | `string`  | `""`                      |
| ▿ <b>Status Bar</b>                           |
| `universalChatProvider.showQuotaWarnings`     | Warn in the status bar when the model in use is low on quota.                                        | `boolean` | `true`                    |
| `universalChatProvider.quotaWarningThreshold` | Remaining-quota percent below which the status bar warning appears.                                  | `number`  | `10`                      |
| ▿ <b>Provider Specific</b>                    |
| `universalChatProvider.codex.webSearch`       | Let Codex look things up online and open web pages while it answers.                                 | `boolean` | `false`                   |
| `universalChatProvider.claude.webSearch`      | Let Claude look things up online while it answers.                                                   | `boolean` | `false`                   |
| ▿ <b>Advanced</b>                             |
| `universalChatProvider.debugLevel`            | Diagnostic detail to collect.                                                                        | `string`  | `"off"`                   |

<!-- configs -->

</details>

<details>
<summary>Commands</summary>

<!-- commands -->

| Command                                  | Title                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `universalChatProvider.manage`           | Universal Chat Provider: Manage Provider                                             |
| `universalChatProvider.login`            | Universal Chat Provider: Add Account (Login)                                         |
| `universalChatProvider.manageAccounts`   | Universal Chat Provider: Manage Accounts                                             |
| `universalChatProvider.showQuota`        | Universal Chat Provider: Show Quota                                                  |
| `universalChatProvider.configure`        | Universal Chat Provider: Configure Connection                                        |
| `universalChatProvider.refresh`          | Universal Chat Provider: Refresh Models                                              |
| `universalChatProvider.setUtilityModel`  | Universal Chat Provider: Set Utility Model (commit messages, chat titles, summaries) |
| `universalChatProvider.clearCredentials` | Universal Chat Provider: Clear Stored API Key                                        |
| `universalChatProvider.showLogs`         | Universal Chat Provider: Show Logs                                                   |
| `universalChatProvider.openSettings`     | Universal Chat Provider: Open Settings                                               |

<!-- commands -->

</details>

## Advanced

### Session identity

The extension requires CLIProxyAPI **8.0.3 or newer**. The extension sends a model-scoped `prompt_cache_key` derived from Copilot's conversation ID, with an opening-message fingerprint fallback. It does not also send `X-Session-ID` to the proxy.

Endpoints added through the extension receive these CLIProxyAPI header defaults, matched by exact hostname:

| Hostname | Upstream header | Value |
| --- | --- | --- |
| `opencode.ai` | `x-opencode-session` | `$CPA-SESSION-ID` |
| `openrouter.ai` | `x-session-id` | `$CPA-SESSION-ID` |

The proxy resolves `$CPA-SESSION-ID` from its session identity. Endpoints added through the extension receive these defaults, while existing server configuration is not rewritten. Add the relevant mapping under a provider's `headers` in your CLIProxyAPI configuration, or re-add the endpoint through the extension. Migrate custom mappings that copy `$X-Session-ID` to `$CPA-SESSION-ID`, since the extension no longer supplies the former header. A one-time session/cache reset may occur when changing identity sources.

### External CLIProxyAPI server

1. Start CLIProxyAPI **8.0.3 or newer** on a machine you control.
2. Run *Universal Chat Provider: Configure Connection* and enter its URL and API key.
3. To add or manage accounts through the extension, enter the server’s management key (not its bcrypt hash) in `universalChatProvider.server.managementKey`.

The extension never starts, stops, updates, or configures CLIProxyAPI.

For reproducible VM/server deployments, export these variables before starting code-server:

```bash
export UNIVERSAL_CHAT_PROVIDER_BASE_URL="http://your-cli-proxy:8317"
export UNIVERSAL_CHAT_PROVIDER_API_KEY="your-proxy-api-key"
```

Alternatively, set the URL and a plain-text API-key fallback in machine `settings.json`:

```json
{
  "universalChatProvider.baseUrl": "http://your-cli-proxy:8317",
  "universalChatProvider.apiKey": "your-proxy-api-key"
}
```

Credential resolution is: SecretStorage, then the configured API-key environment variable, then `universalChatProvider.apiKey`. This avoids browser-bound SecretStorage setup while still allowing a user-entered key to override deployment defaults. **Clear Stored API Key** clears only SecretStorage; imported credentials remain active.

## Development

```bash
pnpm install
pnpm vscode:dts
pnpm check          # lint + typecheck + tests + build
pnpm ext:package    # produce an installable .vsix
```

Press `F5` from VS Code Insiders to launch the Extension Development Host with the proposed APIs enabled.

## License

[MIT](./LICENSE.md) · Not affiliated with GitHub, OpenAI, Anthropic, or Google.
