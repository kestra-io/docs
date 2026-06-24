---
title: Plugins & Execution Configuration in Kestra
h1: Configure Plugin Defaults, Retries & System Flows
description: Configure plugin installation, plugin defaults, feature flags, retries, task settings, system flows, templates, and execution-related behavior in Kestra.
sidebarTitle: Plugins and Execution
icon: /src/contents/docs/icons/admin.svg
---

Use this page when configuring how tasks, plugins, and execution-time behaviors work across your Kestra instance.

## Plugins

This section is about how Kestra discovers and distributes plugin code. If a task type is missing, a plugin version needs to be pinned, or your organization uses a private artifact source, start here.

This area includes:

- installing plugins
- custom Maven repositories
- Enterprise plugin repositories
- plugin defaults
- forced plugin defaults
- plugin security and allowed plugins
- plugin management settings

For many teams, this is the most important section after runtime setup because it centralizes behavior shared across many flows.

Install a plugin from Maven repositories with:

```bash
kestra plugins install io.kestra.plugin:plugin-script-python:LATEST
```

Add custom repositories:

```yaml
kestra:
  plugins:
    repositories:
      central:
        url: https://repo.maven.apache.org/maven2/
      google-artifact-registry:
        url: https://${GCP_REGISTRY_LOCATION}-maven.pkg.dev/${GCP_PROJECT_ID}/${GCP_REPOSITORY}
        basic-auth:
          username: oauth2accesstoken
          password: ${GCP_OAUTH_ACCESS_TOKEN}
```

Install EE plugins from the Kestra registry:

```yaml
kestra:
  plugins:
    repositories:
      kestra-io:
        url: https://registry.kestra.io/maven
        basic-auth:
          username: ${kestra.ee.license.id:}
          password: ${kestra.ee.license.fingerprint:}
```

Most teams only need custom repositories if they publish private plugins or mirror public artifacts through an internal registry.

## Global plugin defaults and shared behavior

Use plugin defaults when many flows should inherit the same behavior. This is usually preferable to repeating the same task settings across dozens of flow definitions.

Apply global defaults that flows can still override:

```yaml
kestra:
  plugins:
    defaults:
      - type: io.kestra.plugin.core.log.Log
        values:
          level: ERROR
```

Use forced defaults when teams must not override the value:

```yaml
kestra:
  plugins:
    defaults:
      - type: io.kestra.plugin.scripts.shell.Commands
        forced: true
        values:
          containerImage: ubuntu:latest
          taskRunner:
            type: io.kestra.plugin.scripts.runner.docker.Docker
```

:::alert{type="warning"}
Plugin defaults are evaluated by the Executor and propagated to other components, so every server should use the same `kestra.plugins.defaults`.
:::

`kestra.plugins.defaults` is the canonical global configuration key. The older `kestra.tasks.defaults` key is still recognized for compatibility, but it is deprecated and should be replaced.

Precedence works as follows:

- global plugin defaults provide the base values
- flow-level `pluginDefaults` override global defaults
- task properties override non-forced defaults
- `forced: true` prevents the task from overriding that property

Use non-forced defaults for convenience and consistency, and use forced defaults when the platform must enforce a value such as a specific task runner.

Enable or preconfigure plugin features globally:

```yaml
kestra:
  plugins:
    configurations:
      - type: io.kestra.plugin.core.flow.Subflow
        values:
          outputs:
            enabled: true
      - type: io.kestra.plugin.core.trigger.Schedule
        values:
          recoverMissedSchedules: NONE
```

You can also enable Docker task-runner volume mounting:

```yaml
kestra:
  plugins:
    configurations:
      - type: io.kestra.plugin.scripts.runner.docker.Docker
        values:
          volumeEnabled: true
```

The examples in this section do different jobs: `defaults` applies reusable task values, while `configurations` enables or tunes plugin features that are not always expressed directly in a flow.

## Plugin security and management

This section becomes relevant once you want governance over what can be installed or when plugin lifecycle is managed centrally instead of manually on each instance.

In Enterprise Edition, you can restrict which plugins are allowed:

```yaml
kestra:
  plugins:
    security:
      includes:
        - io.kestra.*
      excludes:
        - io.kestra.plugin.core.debug.Echo
```

Managed plugins are configured under `kestra.plugins.management`:

```yaml
kestra:
  plugins:
    management:
      enabled: true
      remote-storage-enabled: true
      custom-plugins-enabled: true
      local-repository-path: /tmp/kestra/plugins-repository
      auto-reload-enabled: true
      auto-reload-interval: 60s
      default-version: LATEST
```

- `remote-storage-enabled`: store managed plugins in internal storage rather than on local disk
- `auto-reload-enabled` / `auto-reload-interval`: check for updated plugins on a fixed interval
- `default-version`: controls which plugin version is selected when no explicit version is pinned; accepts `LATEST`, `CURRENT`, `OLDEST`, `NONE`, or a specific version string

## Execution behavior

These settings affect how the platform behaves around tasks and executions globally. Use them for platform-wide operational defaults, not for flow-specific logic.

This part of the configuration also includes:

- retries
- temporary task storage
- tutorial flows
- system flows
- local flow synchronization
- enabling templates

Global retries for internal storage and secret-manager calls:

```yaml
kestra:
  retries:
    attempts: 5
    delay: 1s
    max-delay: ~
    multiplier: 2.0
```

`max-delay` caps the maximum backoff interval. It is undefined by default, which means the delay grows without bound according to the multiplier.

:::alert{type="warning"}
These retries do not apply to tasks. For task-level retries across many plugins, use plugin defaults.
:::

Example task-level retry default:

```yaml
- type: io.kestra
  retry:
    type: constant
    interval: PT5M
    maxDuration: PT1H
    maxAttempts: 3
    warningOnRetry: true
```

That distinction matters: `kestra.retries` protects platform integrations such as storage and secret backends, while task retry behavior should be managed through plugin defaults or the flow itself.

Use `kestra.tasks.tmp-dir` when task runners need a predictable working directory on the host or inside a mounted volume:

```yaml
kestra:
  tasks:
    tmp-dir:
      path: /tmp/kestra-wd/tmp
```

Ensure your container or VM volume mounts align with that path:

```yaml
volumes:
  - kestra-data:/app/storage
  - /var/run/docker.sock:/var/run/docker.sock
  - /home/kestra:/home/kestra
```

Reserve `system` for background workflows, or rename it if your organization already uses that namespace for something else:

```yaml
kestra:
  system-flows:
    namespace: system
```

Disable tutorial flows outside trial or demo environments:

```yaml
kestra:
  tutorial-flows:
    enabled: false
```

Templates are deprecated and disabled by default, but can still be re-enabled for migration work:

```yaml
kestra:
  templates:
    enabled: true
```

```yaml
micronaut:
  io:
    watch:
      enabled: true
      paths:
        - /path/to/your/flows
```

Use Micronaut file watching only when you want local flow synchronization from disk into Kestra.

## Variables and rendering

These settings influence expression rendering across the whole instance. They are linked here because they affect execution-time behavior, but they are documented in more depth on the runtime page.

Relevant runtime-wide settings include:

- environment variable prefixes
- global variables
- recursive rendering
- template cache

Those settings are documented in more detail on [Runtime and Storage](../02.runtime-and-storage/index.md), since they affect the whole instance and not just plugin behavior.

### Subflow function configuration

The `subflow()` Pebble function, used to populate `SELECT` and `MULTISELECT` input dropdowns at form render time, has three configurable limits. All three accept ISO 8601 duration strings or integers.

```yaml
kestra:
  pebble:
    subflow-function:
      default-timeout: PT1M   # timeout when the caller omits the timeout argument
      max-timeout: PT5M       # hard cap — larger values are rejected at runtime
      max-depth: 3            # maximum nesting depth of subflow() calls on one render thread
```

| Key | Default | Description |
|---|---|---|
| `kestra.pebble.subflow-function.default-timeout` | `PT1M` | Applied when the `timeout` argument is not passed. Keep this short — the call blocks the Execute form render. |
| `kestra.pebble.subflow-function.max-timeout` | `PT5M` | Hard cap. A `timeout` argument larger than this value is rejected at runtime with an error. |
| `kestra.pebble.subflow-function.max-depth` | `3` | Guards against runaway recursion. A subflow whose own inputs also call `subflow()` counts against this limit. |

Increase `max-timeout` only if your data-fetching subflows genuinely need longer — long form renders degrade user experience. Increase `max-depth` only if you have intentionally nested multi-level dependent dropdowns.

## Related docs

- Flow-level plugin defaults: [Plugin Defaults](../../05.workflow-components/09.plugin-defaults/index.md)
- Universal file access: [File Access](../../06.concepts/file-access/index.md)
- Storage backends, JVM, and global variables: [Runtime and Storage](../02.runtime-and-storage/index.md)
- Execution data isolation and enterprise-only runtime features: [Enterprise and Advanced](../06.enterprise-and-advanced/index.md)
