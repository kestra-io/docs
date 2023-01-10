---
order: 3
---
# Worker Isolation configuration

## Java security

By default, Kestra uses a [shared worker](../../architecture#worker) in order to handle workloads. This is fine for most use cases, but when you are using a shared Kestra instance between multiple teams, since the worker shares the same file systems, this can allow people to access temporary files created by Kestra with powerful tasks like [Groovy](/plugins/plugin-script-groovy/tasks/io.kestra.plugin.scripts.groovy.Eval), [Jython](/plugins/plugin-script-jython/tasks/io.kestra.plugin.scripts.jython.Eval)...

You can use the following to opt-in to real isolation of file systems using advanced Kestra EE java security :

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
This is the filepath on the system that the Kestra Worker will be forbidden to read or write at all times. This can be useful to protect Kestra configuration files for example.

### `kestra.ee.java-security.authorized-class-prefix`
This security prevents access to file system or thread creation (that would prevent us to check file system access). Most of the plugins will never need to have file system access (except on temporary directories that are created & isolated for a task, and are whitelisted by default). Here you can set a list of prefixes (namespace) classes that will be allowed, all others will be refused.

For example, [GCP plugins](/plugins/plugin-gcp/) will need to create a thread in order to reach the GCP api. Since this whole plugin is deemed safe, you can whitelist it.

::: warning
At this time, all the Kestra official plugins are safe to be whitelisted **except** [all scripts plugins](/plugins/plugin-script-groovy/) since it allows custom code to be created that can read & write on the file system. This one must not be added to the `authorized-class-prefix`
:::

## Scripting isolation
For [Bash tasks](/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Bash.html) & other script tasks in the core, we advise you to force `DOCKER` isolation and to configure global cluster [taskDefaults](/docs/administrator-guide/configuration/others/#kestra-tasks-defaults):

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
