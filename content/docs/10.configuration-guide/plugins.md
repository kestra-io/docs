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
      - type: io.kestra.plugin.core.flow.Subflow
        values:
          outputs:
            enabled: true # for backward-compatibility -- false by default
      - type: io.kestra.plugin.core.flow.Flow
        values:
          outputs:
            enabled: true # for backward-compatibility -- false by default
```

By default, the `outputs` property of a parent flow's `Subflow` task is deprecated in favor of flow `outputs` in Kestra 0.15.0 and higher. However, setting such configuration will keep the old behavior with the `outputs` property.

## Plugin configurations to set default values

You can also set default values for a plugin. For example, starting from Kestra 0.15.0, you can set the default value for the `recoverMissedSchedules` property of the `Schedule` trigger to `NONE` to avoid recovering missed scheduled executions after a server restart:

```yaml
kestra:
  plugins:
    configurations:
      - type: io.kestra.plugin.core.trigger.Schedule
        values:
          # Available options: LAST | NONE | ALL. The default is ALL
          recoverMissedSchedules: NONE
```

Before 0.15, Kestra was always recovering missed schedules. This means that if your server was down for a few hours, Kestra would recover all missed schedules when it was back up. This behavior was not always desirable, as often the recovery of missed schedules is not necessary e.g. during a planned maintenance window. This is why, starting from Kestra 0.15 release, you can customize the `recoverMissedSchedules` property and choose whether you want to recover missed schedules or not.

The `recoverMissedSchedules` configuration can be set to `ALL`, `NONE` or `LAST`:
- `ALL`: Kestra will recover all missed schedules. This is the default value.
- `NONE`: Kestra will not recover any missed schedules.
- `LAST`: Kestra will recover only the last missed schedule for each flow.

Note that this is a global configuration that will apply to all flows, unless explicitly overwritten within the flow definition:

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/15 * * * *"
    recoverMissedSchedules: NONE
```

In this example, the `recoverMissedSchedules` is set to `NONE`, which means that Kestra will not recover any missed schedules for this specific flow regardless of the global configuration.
