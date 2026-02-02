---
title: Worker Isolation in Kestra Enterprise – Enforce Separation
description: Enforce security with Worker Isolation in Kestra. Isolate execution environments, file systems, and processes for secure multi-tenant operations.
sidebarTitle: Worker Isolation
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
---

How to configure worker isolation in Kestra.

## Worker isolation – enforce separation

When dealing with multiple teams, you can add extra security measures to your Kestra instance to isolate access so that there is no shared file system, only certain plugins can create worker threads, and script tasks are isolated.

## Java security

By default, Kestra uses a shared worker to handle workloads. This is fine for most use cases. However, when using a shared Kestra instance between multiple teams, this can allow people to access temporary files created by Kestra with powerful tasks like [Groovy](/plugins/plugin-script-groovy), [GraalVM Python](/plugins/plugin-graalvm/python), and more. This is because the worker shares the same file system.

You can use the following to opt in to real isolation of file systems using advanced Kestra EE Java security:

```yaml
kestra:
  ee:
    javaSecurity:
      enabled: true
      forbiddenPaths:
        - /etc/
      authorizedClassPrefix:
        - io.kestra.plugin.core
        - io.kestra.plugin.gcp
```
To only limit access to certain plugins on a Worker without requiring file path protection, you can also consider configuring Kestra with [Allowed & Restricted plugins](../allowed-plugins/index.md).

### `kestra.ee.java-security.forbidden-paths`

This is a list of paths on the file system that the Kestra Worker will be forbidden to read or write to. This can help to protect [Kestra configuration](../../../configuration/index.md) files and ensure security for audits and compliance. With this property configured, you can reduce the amount of directories that a Worker can access such as protecting access to the folders where global Kestra configuration or `~/.aws/credentials` are stored.

### `kestra.ee.java-security.authorized-class-prefix`

This is a list of classes that can create threads. Here you can set a list of prefixes (namespace) classes that will be allowed. All others will be refused.

For example, [GCP plugins](/plugins/plugin-gcp) will need to create a thread in order to reach the GCP API. Since this whole plugin is deemed safe, you can whitelist it.

### `kestra.ee.java-security.forbidden-class-prefix`

This is a list of classes that can't create any threads. Other plugins will be authorized.

```yaml
kestra:
  ee:
    javaSecurity:
      enabled: true
      forbiddenClassPrefix:
        - io.kestra.plugin.scripts
```

:::alert{type="warning"}
Currently, all the official Kestra plugins are safe to be whitelisted **except** [all scripts plugins](../../../16.scripts/00.languages/index.md) since they allow custom code to be created that can be read and written on the file system. Do not add these to the `forbidden-class-prefix`.
:::

## Scripting isolation

You can provide global plugin defaults using the `kestra.plugins.defaults` configuration. Those will be applied to each task on your cluster **if a property is not defined** on flows or tasks. Plugin defaults ensure a property is defined at a default value for these tasks.

```yaml
kestra:
  plugins:
    defaults:
    - type: io.kestra.plugin.core.log.Log
      values:
        level: ERROR
```

For [Bash tasks](/plugins/plugin-script-shell/io.kestra.plugin.scripts.shell.script) and other script tasks in the core, we advise you to force `io.kestra.plugin.scripts.runner.docker.Docker` isolation and to configure global cluster `pluginDefaults`:

```yaml
kestra:
  tasks:
    defaults:
      - type: io.kestra.plugin.scripts.shell.Commands
        forced: true
        values:
          containerImage: ubuntu:latest
          taskRunner:
            type: io.kestra.plugin.scripts.runner.docker.Docker
```

Forced plugin defaults:
- Ensure a property is set globally for a task, and no task can override it.
- Are critical for security and governance — for example, to enforce Shell tasks to run as Docker containers.

:::alert{type="warning"}
You will need to add all script plugins tasks (like Python and Node) to be sure that no tasks can bypass the docker isolation.
:::
