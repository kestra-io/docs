---
title: Worker Isolation
icon: /docs/icons/admin.svg
---

How to configure worker isolation in Kestra.

::alert{type="info"}
This feature requires a [commercial license](https://kestra.io/pricing).
::

## Java security

By default, Kestra uses a shared worker to handle workloads. This is fine for most use cases, but when you are using a shared Kestra instance between multiple teams, since the worker shares the same file system, this can allow people to access temporary files created by Kestra with powerful tasks like [Groovy](/plugins/plugin-script-groovy/tasks/io.kestra.plugin.scripts.groovy.eval), [Jython](/plugins/plugin-script-jython/tasks/io.kestra.plugin.scripts.jython.eval), etc...

You can use the following to opt-in to real isolation of file systems using advanced Kestra EE Java security:

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
This is a list of classes that can create threads. Here you can set a list of prefixes (namespace) classes that will be allowed. All others will be refused.

For example, [GCP plugins](/plugins/plugin-gcp/index.md) will need to create a thread in order to reach the GCP api. Since this whole plugin is deemed safe, you can whitelist it.

### `kestra.ee.java-security.forbidden-class-prefix`
```yaml
kestra:
  ee:
    java-security:
      enabled: true
      forbidden-class-prefix:
        - io.kestra.plugin.scripts
```

This is a list of classes that can't create any threads. Others plugins will be authorized.

::alert{type="warning"}
Currently, all the Kestra official plugins are safe to be whitelisted **except** [all scripts plugins](/plugins/plugin-script-groovy) since they allow custom code to be created that can be read and written on the file system. These must not be added to the `forbidden-class-prefix`
::


## Scripting isolation
For [Bash tasks](/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.bash) and other script tasks in the core, we advise you to force `DOCKER` isolation and to configure global cluster `taskDefaults`:

```yaml
kestra:
  tasks:
    defaults:
      - type: io.kestra.plugin.scripts.shell.Commands
        forced: true
        values:
          docker:
            image: ubuntu:latest
          runner: DOCKER
```

::alert{type="warning"}
You will need to add all script plugins tasks (like Python & Node) to be sure that no tasks can bypass the docker isolation.
::
