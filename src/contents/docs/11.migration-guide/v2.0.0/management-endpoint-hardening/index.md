---
title: Management Endpoint Hardening
sidebarTitle: Management Endpoint Hardening
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: Kestra 2.0 tightens the default management endpoint configuration. Several endpoints that were open or writable without authentication in 1.x now require explicit opt-in.
---

Kestra 2.0 hardens the default configuration of the management port (`8081`). Several settings that were permissive in 1.x have been removed or reversed.

## What changed

| Setting | 1.x default | 2.0 default |
|---|---|---|
| `endpoints.all.sensitive` | `false` (all endpoints open) | Micronaut default (`true`) |
| `endpoints.env.enabled` | `true` | `false` |
| `endpoints.health.details-visible` | `ANONYMOUS` | `AUTHENTICATED` |
| `endpoints.loggers.write-sensitive` | `false` (unauthenticated writes) | `true` |
| `/worker` endpoint sensitivity | `false` (open) | `true` (sensitive) |
| `/scheduler` endpoint sensitivity | `false` (open) | `true` (sensitive) |
| docker-compose port mapping | `8081:8081` exposed | commented out |

## Who is affected

You are affected if any of the following apply:

- You query `/env` on the management port (e.g., from a monitoring agent or automation script).
- You call `POST /loggers` to change log levels at runtime without any authentication.
- You poll `/worker` or `/scheduler` on the management port from tooling that does not send credentials.
- You rely on anonymous health details at `/health`.
- You use the `docker-compose.yml` bundled with Kestra to expose the management port.

## How to restore the previous behavior

If your environment relies on the old defaults, you can opt back into each setting individually in your `application.yml`:

```yaml
endpoints:
  all:
    sensitive: false          # re-opens all endpoints for unauthenticated access
  env:
    enabled: true             # re-enables the /env endpoint
  health:
    details-visible: ANONYMOUS  # shows health details to unauthenticated requests
  loggers:
    write-sensitive: false    # allows unauthenticated logger level changes
  worker:
    sensitive: false          # re-opens the /worker endpoint
  scheduler:
    sensitive: false          # re-opens the /scheduler endpoint
```

For the docker-compose setup, uncomment the management port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8081:8081"
```

:::alert{type="warning"}
Re-opening these endpoints restores the previous behavior but also restores the associated security risks — unauthenticated access to environment variables, the ability to change log levels, and exposure of running task and trigger details. Only opt back in if you understand the implications and can restrict access at the network layer.
:::

See [Management endpoint access](../../../10.administrator-guide/security-hardening/index.md#management-endpoint-access) for the recommended hardening approach.
