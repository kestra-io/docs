---
title: Allowed & Restricted Plugins
icon: /docs/icons/admin.svg
editions: ["EE"]
---

How to configure worker isolation in Kestra with allowed and restricted plugins.

## Allowed plugins

You can restrict which plugins can be used in a Kestra instance by configuring an include / exclude list using regexes.

To allow specific plugins, add the `includes` attribute in your Kestra configuration file and list the approved plugins or use a regex expression. Below is an example that `includes` all plugins from the `io.kestra` package using a regex expression.

```yaml
kestra:
  plugins:
    security:
      includes:
        - io.kestra.*
```

## Restricted plugins

To restrict certain plugins, add the `excludes` attribute in your Kestra configuraiton file and list the disallowed plugins or use a regex expression. Below is the previous example with `excludes` added to disallow the `io.kestra.plugin.core.debug.Echo` plugin.

```yaml
kestra:
  plugins:
    security:
      includes:
        - io.kestra.*
      excludes:
        - io.kestra.plugin.core.debug.Echo
```

## Java security

By default, Kestra uses a shared worker to handle workloads. This is fine for most use cases. However, when you are using a shared Kestra instance between multiple teams, this can allow people to access temporary files created by Kestra with powerful tasks like [Groovy](/plugins/plugin-script-groovy/io.kestra.plugin.scripts.groovy.eval), [Jython](/plugins/plugin-script-jython/io.kestra.plugin.scripts.jython.eval), and more. This is because the worker shares the same file system.

You can use the following to opt-in to real isolation of file systems using advanced Kestra EE Java security:

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

### `kestra.ee.java-security.forbidden-paths`
This is a list of paths on the file system that the Kestra Worker will be forbidden to read or write to. This can be useful to protect Kestra configuration files, for example.

### `kestra.ee.java-security.authorized-class-prefix`
This is a list of classes that can create threads. Here you can set a list of prefixes (namespace) classes that will be allowed. All others will be refused.

For example, [GCP plugins](/plugins/plugin-gcp) will need to create a thread in order to reach the GCP API. Since this whole plugin is deemed safe, you can whitelist it.

### `kestra.ee.java-security.forbidden-class-prefix`
```yaml
kestra:
  ee:
    javaSecurity:
      enabled: true
      forbiddenClassPrefix:
        - io.kestra.plugin.scripts
```

This is a list of classes that can't create any threads. Others plugins will be authorized.

::alert{type="warning"}
Currently, all the official Kestra plugins are safe to be whitelisted **except** [all scripts plugins](/plugins/plugin-script-groovy) since they allow custom code to be created that can be read and written on the file system. Do not add these to the `forbidden-class-prefix`.
::


## Scripting isolation
For [Bash tasks](/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.bash) and other script tasks in the core, we advise you to force `io.kestra.plugin.scripts.runner.docker.Docker` isolation and to configure global cluster `pluginDefaults`:

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

::alert{type="warning"}
You will need to add all script plugins tasks (like Python & Node) to be sure that no tasks can bypass the docker isolation.
::
