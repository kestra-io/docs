---
title: SDK Authentication Required for Internal Tasks
sidebarTitle: SDK Auth Required
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: Tasks that call the Kestra API internally — such as git sync tasks — now require explicit credentials. In 1.3, these tasks ran without authentication.
---

In Kestra 2.0, tasks that call the Kestra API internally now use the Kestra SDK and require explicit credentials. In 1.3, these calls were unauthenticated. Affected tasks include `io.kestra.plugin.git.SyncFlows`, `io.kestra.plugin.git.NamespaceSync`, and `io.kestra.plugin.git.SyncNamespaceFiles`.

Without credentials configured, the task fails with a 401 Unauthorized error when it tries to export or import data from the Kestra API:

```
Caused by: ApiException{code=401, ...}
Failed to export flows from Kestra for namespace <your-namespace>
```

## Configure credentials

There are three ways to supply credentials, in recommended order.

### 1. Namespace or tenant default (EE)

Configure **Default authentication credentials** in the Kestra UI. Any SDK-based task running in that scope picks up the credentials automatically — no changes to individual flows are required.

- **Tenant**: go to **Tenants → [tenant] → Settings** and scroll to **Default authentication credentials**. Enter an API token, or a username and password. This applies to all namespaces in the tenant.
- **Namespace**: go to **Namespaces → [namespace] → Edit** and scroll to **Default authentication credentials**. A namespace-level credential overrides the tenant-level one.

The resolution order is: namespace default → tenant default → global config (below).

### 2. Global configuration fallback

Add credentials to your server configuration. These apply to all SDK-based tasks across the instance that have no namespace or tenant default:

```yaml
kestra:
  tasks:
    sdk:
      authentication:
        api-token: "${KESTRA_API_TOKEN}"   # recommended: use a service account API token
        # username: my-user               # alternative: basic auth
        # password: "${KESTRA_PASSWORD}"
```

**OSS:** if `kestra.server.basic-auth` is already configured, Kestra automatically derives the global SDK credentials from it — no additional configuration is needed.

### 3. Inline auth on the task

Add an `auth` block directly to the task. This is useful for one-off flows or when you need per-task credential isolation:

```yaml
tasks:
  - id: sync
    type: io.kestra.plugin.git.SyncFlows
    targetNamespace: company.team
    gitDirectory: _flows
    url: https://github.com/your-org/your-repo
    branch: main
    auth:
      apiToken: "{{ secret('KESTRA_API_TOKEN') }}"
      # username and password are also accepted instead of apiToken
```

## Affected tasks

Any task that reads from or writes to the Kestra API internally — such as git sync tasks (`io.kestra.plugin.git.*`) — requires this change. If a task fails with a 401 error after upgrading, adding credentials is the fix.

**Not affected:** Purge tasks (`io.kestra.plugin.core.execution.PurgeExecutions`, etc.) are now SystemTasks that run directly on the Executor and do not go through the SDK.

## What to update

1. Identify which flows use git sync or other tasks that call the Kestra API.
2. Choose the credential method that fits your setup — namespace/tenant defaults require the fewest per-flow changes.
3. For inline `auth`, store the token or password as a [secret](../../../07.enterprise/02.governance/05.secrets/index.md) and reference it with `{{ secret('...') }}`.
