---
title: Plugins Configuration
icon: /docs/icons/admin.svg
---

This page describes how you can configure plugins in Kestra.

Configuration of Maven repositories used by the command `kestra plugins install`.

Maven Central is mandatory for Kestra and its plugins. However, you can add your own (Maven) repository in order to download your own plugins using the following configuration:

```yaml
kestra:
  plugins:
    repositories:
      central:
        url: https://repo.maven.apache.org/maven2/
      jcenter:
        url: https://jcenter.bintray.com/
      kestra:
        url: https://dl.bintray.com/kestra/maven
```

## Plugin configurations to enable or disable features

The `configuration` of `plugins` section can be also used to enable or disable some features of specific Kestra plugins, or to set some default values for them.

Here is an example of how to enable outputs for `Subflow` and `Flow` tasks:

```yaml
kestra:
  plugins:
    configurations:
      - type: io.kestra.core.tasks.flows.Subflow
        values:
          outputs:
            enabled: true # for backward-compatibility -- false by default
      - type: io.kestra.core.tasks.flows.Flow
        values:
          outputs:
            enabled: true # for backward-compatibility -- false by default
```

By default, the `outputs` property of a parent flow's `Subflow` task is deprecated in favor of flow `outputs` in Kestra 0.15.0 and higher. However, setting such configuration will keep the old behavior with the `outputs` property.

## Plugin configurations to set default values

You can also set default values for a plugin. For example, you can set the default value for the `recoverMissedSchedules` property of the `Schedule` trigger to `NONE` to avoid recovering missed scheduled executions after a server restart:

```yaml
kestra:
  plugins:
    configurations:
      - type: io.kestra.core.models.triggers.types.Schedule
        values:
          # available options: LAST | NONE | ALL -- default: ALL
          recoverMissedSchedules: NONE
```
