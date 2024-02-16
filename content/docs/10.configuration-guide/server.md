---
title: Server Configuration
icon: /docs/icons/admin.svg
---

This section describes the configuration options for the Kestra Server.


## HTTP Basic Authentication

You can protect your Kestra installation with HTTP Basic Authentication.

```yaml
kestra:
  server:
    basic-auth:
      enabled: true
      username: admin
      password: kestra
```

HTTP Basic Authentication is disabled by default - you can enable it in your Kestra configuration as shown above. If you need more fine-grained control over user and access management, the Enterprise Edition provides additional authentication mechanisms including features such as SSO and RBAC. For more details, see the [Authentication page](03.enterprise-edition/authentication.md).

### `kestra.configurations.delete-files-on-start`: Delete configuration files
This setting allows to delete all configuration files after the server startup. It prevents the ability to read configuration files (that may contain your secrets) from a Bash task for example. The server will keep these values in memory and they won't be accessible from tasks. Values are either `true` or `false` (default `false`).


## Recover missed schedules

Before 0.15, Kestra was always recovering missed schedules. This means that if your server was down for a few hours, Kestra would recover all missed schedules when it was back up. Some users have reported that this behavior was not always desirable, especially when the recovery of missed schedules was not necessary (e.g. during a planned maintenance window).

Kestra 0.15 introduced a new configuration allowing you to choose whether you want to recover missed schedules or not:

```yaml
kestra:
  server:
    recover-missed-schedules: ALL
```

The `recover-missed-schedules` configuration can be set to `ALL`, `NONE` or `LAST`:
- `ALL`: Kestra will recover all missed schedules. This is the default value.
- `NONE`: Kestra will not recover any missed schedules.
- `LAST`: Kestra will recover only the last missed schedule for each flow.

Note that this is a global configuration that will apply to all flows, unless other behavior is explicitly defined within the flow definition:

```yaml
triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "*/15 * * * *"
    recoverMissedSchedules: NONE
```

In this example, the `recoverMissedSchedules` is set to `NONE`, which means that Kestra will not recover any missed schedules for this specific flow regardless of the global configuration.

