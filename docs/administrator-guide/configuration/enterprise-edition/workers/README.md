---
order: 3
---
# Worker Isolation configuration

## Java security

By default, Kestra uses a [shared worker](../../architecture#worker) to handle workloads. This is fine for most use cases, but when you are using a shared Kestra instance between multiple teams, since the worker shares the same file system, this can allow people to access temporary files created by Kestra with powerful tasks like [Groovy](/plugins/plugin-script-groovy/tasks/io.kestra.plugin.scripts.groovy.Eval), [Jython](/plugins/plugin-script-jython/tasks/io.kestra.plugin.scripts.jython.Eval), etc...

You can use the following to opt-in to real isolation of file systems using advanced Kestra EE Java security :

```yaml
kestra:
  ee:
    java-security:
      enabled: true
      forbidden-paths:
        - /etc/
      authorized-class-prefix:
        - io.kestra.core.tasks
        - io.kestra.plugin.gcp
```

### `kestra.ee.java-security.forbidden-paths`
This is a list of paths on the file system that the Kestra Worker will be forbidden to read or write to. This can be useful to protect Kestra configuration files for example.

### `kestra.ee.java-security.authorized-class-prefix`
This is a list of classes that can access the file system or create threads.
Most of the plugins will never need access to the file system (except on temporary directories created and isolated for each task and whitelisted by default). Here you can set a list of prefixes (namespace) classes that will be allowed. All others will be refused.

For example, [GCP plugins](/plugins/plugin-gcp/) will need to create a thread in order to reach the GCP api. Since this whole plugin is deemed safe, you can whitelist it.

::: warning
Currently, all the Kestra official plugins are safe to be whitelisted **except** [all scripts plugins](/plugins/plugin-script-groovy/) since they allow custom code to be created that can be read and written on the file system. These must not be added to the `authorized-class-prefix`
:::

## Scripting isolation
For [Bash tasks](/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Bash.md) and other script tasks in the core, we advise you to force `DOCKER` isolation and to configure global cluster [taskDefaults](/docs/administrator-guide/configuration/others/#kestra-tasks-defaults):

```yaml
kestra:
  tasks:
    defaults:
      - type: io.kestra.core.tasks.scripts.Bash
        forced: true
        values:
          dockerOptions:
            image: ubuntu
          runner: DOCKER
```

::: warning
You will need to add all script plugins tasks (like Python & Node) to be sure that no tasks can bypass the docker isolation.
:::
