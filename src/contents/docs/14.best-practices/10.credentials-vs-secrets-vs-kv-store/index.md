---
title: Choosing Where to Store Sensitive and Shared Values
sidebarTitle: Sensitive and Shared Values
icon: /src/contents/docs/icons/best-practices.svg
description: Learn how to choose between Kestra credentials, secrets, and the KV Store for authentication, sensitive values, and runtime state.
editions: ["EE", "Cloud"]
---

How to choose between credentials, secrets, and the KV Store for sensitive values, authentication, and shared state in Kestra.

## Choose the right place for sensitive values and shared state

Kestra gives you multiple ways to manage authentication and sensitive values:

- [credentials](../../07.enterprise/03.auth/credentials/index.md)
- [secrets](../../06.concepts/04.secret/index.md)
- the [KV Store](../../06.concepts/05.kv-store/index.md)

These options serve different purposes. Choosing the right one improves security, reduces duplication, and makes workflows easier to maintain.

## Quick recommendation

Use this rule of thumb:

- Use **credentials** for reusable server-to-server authentication where Kestra should mint or refresh short-lived access tokens for you.
- Use **secrets** for protected static values such as API keys, passwords, client secrets, private keys, and connection strings.
- Use the **KV Store** for dynamic values that must be created, updated, or read at runtime across executions or flows.

## Comparison table

| If you need to store... | Prefer | Why |
| --- | --- | --- |
| A reusable OAuth2 or GitHub App authentication object | Credentials | Kestra can mint and refresh access tokens at runtime |
| A password, API key, client secret, private key, or connection string | Secrets | Sensitive static values should be protected and not stored in flow code |
| A value created by one flow and reused later by another flow | KV Store | It is designed for runtime state shared across flows |
| A value that changes during execution and must be updated programmatically | KV Store | Flows can read and write KV pairs dynamically |
| Sensitive material used by a credential, such as a client secret or private key | Secrets | Credentials should reference secrets rather than embed raw secret values |
| A non-sensitive setting such as region, endpoint, or bucket name | Task properties, variables, or plugin defaults | These are configuration values, not authentication objects |

## When to use credentials

Use credentials when you need a reusable server-to-server authentication object that Kestra manages for you.

Credentials are designed for authentication patterns such as:

- OAuth2 `client_credentials`
- OAuth2 JWT Bearer
- OAuth2 `private_key_jwt`
- GitHub App authentication

Why credentials are the right choice here:

- They let you define the authentication object once and reuse it across tasks.
- Kestra can mint and refresh access tokens at runtime.
- Workflows only need the current access token via `{{ credential('name') }}`.
- Sensitive material used by the credential can stay in secrets.

Best practice:

- Use credentials for managed authentication objects, not as a generic replacement for secrets.
- Scope credentials at the namespace or tenant level based on the required reuse.
- Reference secrets inside credentials for client secrets, private keys, or certificates.

For more details, see [Credentials](../../07.enterprise/03.auth/credentials/index.md).

## When to use secrets

Use secrets when the value is sensitive and should not be committed to source control or exposed broadly in flow definitions.

Typical examples:

- database passwords
- API keys
- cloud access keys
- OAuth client secrets
- SSH private keys
- service account JSON
- webhook secrets

Why secrets are the default for sensitive values:

- They keep sensitive data out of flow YAML.
- They can be managed centrally.
- They reduce accidental exposure when flows are shared across teams.
- They are the right source for secret values referenced by credentials and task properties.

Best practice:

- Store secrets at the lowest namespace level that still supports the required reuse.
- Avoid placing broadly scoped secrets at the root namespace unless they truly need to be inherited everywhere.
- Avoid logging secrets or transforming them in ways that could bypass masking.

For more details, see [Secrets](../../06.concepts/04.secret/index.md) and [Best Practices for Secrets in Kestra](../9.secrets-management/index.md).

## When to use the KV Store

Use the KV Store for dynamic state, not for secret management.

The KV Store is a good fit when a value:

- is created during an execution
- must be updated by flows
- needs to be read later by other flows or later executions
- represents state rather than static configuration

Typical examples:

- checkpoints
- cursors and offsets
- last processed timestamp
- feature flags or runtime switches managed by workflows
- identifiers of external resources created by one execution and reused later

Why the KV Store is usually the wrong place for secrets:

- Secrets and credentials are usually static or centrally managed, while KV pairs are designed for runtime mutation.
- Flows can update KV pairs, which increases the risk of accidental overwrite for sensitive data.
- The KV Store is better suited to application state than authentication material.

If you need a value to be both sensitive and mutable, stop and review the design carefully. In most cases, that indicates a workflow state problem or a secret-lifecycle problem that should be solved more explicitly.

## Recommended patterns

### Pattern 1: Credential plus secrets

Use a credential for the authentication flow and secrets for the sensitive material that backs it.

Example:

- OAuth2 credential stored in Kestra
- `client_secret` or private key referenced from a secret

This is the preferred pattern when Kestra should mint or refresh tokens for you.

### Pattern 2: Secrets plus non-sensitive configuration

Use secrets for the confidential part and task properties, variables, or plugin defaults for the rest.

Example:

- `password` from `secret('DB_PASSWORD')`
- `host`, `port`, and `database` from variables or plugin defaults

### Pattern 3: Secret plus KV Store

Use secrets for authentication and the KV Store for runtime state.

Example:

- API key from a secret
- `last_processed_cursor` from the KV Store

This is common in polling, ingestion, and synchronization flows.

### Pattern 4: Plugin defaults plus secrets

Use plugin defaults to centralize repeated connection settings, while referencing secrets for the sensitive fields.

This is often the cleanest approach for large teams because it reduces duplication without putting secret material in the flow body.

## Anti-patterns

Avoid these patterns:

- Storing passwords, API keys, or client secrets directly in flow YAML
- Using secrets where a managed credential would better handle token minting and refresh
- Using the KV Store as the default place for secret material
- Putting broad secrets at the root namespace when only one team or project needs them
- Mixing static configuration, secret material, and mutable runtime state without a clear reason

## Decision guide

Ask these questions:

1. Is the value sensitive?
If yes, start with **secrets**.

2. Do you need Kestra to mint or refresh an access token for a supported authentication flow?
If yes, use **credentials**, backed by **secrets** for the sensitive inputs.

3. Does the value need to be updated dynamically by flows?
If yes, consider the **KV Store**.

4. Is the value just a protected static value such as an API key, password, or private key?
If yes, use **secrets**.

5. Is the value stable non-sensitive configuration reused across many tasks?
If yes, consider **plugin defaults**, variables, or namespace-level configuration.

## Summary

- **Credentials** are for reusable managed authentication objects that mint or refresh tokens.
- **Secrets** are for sensitive static values and for secret inputs referenced by credentials.
- **KV Store** is for dynamic runtime state shared across flows or executions.

In most cases, the right answer is not one feature alone, but a combination:

- credentials for token-based authentication
- secrets for sensitive inputs
- plugin defaults or variables for non-sensitive configuration
- KV Store for changing state
