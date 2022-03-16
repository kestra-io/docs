---
order: 3
---
# Worker Isolation configuration

## Java security

By default, Kestra use a [shared worker](../../architecture#worker) in order to handle workload. This is fine most of the case, but when you are using a shared Kestra instance between multiple team, since the worker is sharing the same file systems, this can allow people to access temporary files created by Kestra with powerful task like [Groovy](/plugins/plugin-script-groovy/tasks/io.kestra.plugin.scripts.groovy.Eval), [Jython](/plugins/plugin-script-jython/tasks/io.kestra.plugin.scripts.jython.Eval)...

You can opt in to real isolation of file system using advanced Kestra EE java security :

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
Is filepath on the system that Kestra Worker will be forbidden to read or write all the time. This can be useful to protect Kestra configuration files for example.

### `kestra.ee.java-security.authorized-class-prefix`
This security prevent access on file system or thread creation (that would prevent us to check file system access). Most of the plugins will never need to have file system access (except on temporary directory, that is created & isolated for a task, and is whitelist by default). Here you can set a list of prefix (namespace) class that will be allowed, all the other will be refused.

For example, [GCP plugins](/plugins/plugin-gcp/) will need to create thread in order to reach GCP api. Since this whole plugins is safe, you can white list it.

::: warning
At this time, all the Kestra official plugins is safe to be whitelisted **except** [all scripts plugins](/plugins/plugin-script-groovy/) since it allow to be create custom code that can read & write on file system. This one must not be added `authorized-class-prefix`
:::

## Scripting isolation
For [Bash task](/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Bash.html) & other scripts task in the core, we advised you to forced `DOCKER` isolation and to configuration a global cluster [taskDefaults](/docs/administrator-guide/configuration/others/#kestra-tasks-defaults) :

```yaml
kestra:
  tasks:
    defaults:
      - type: org.kestra.core.tasks.scripts.Bash
        forced: true
        values:
          dockerOptions:
            image: ubuntu
          runner: DOCKER
```

::: warning
You will need to add all scripts plugins task (like Python & Node) to be sure that no task could by pass the docker isolation.
:::
