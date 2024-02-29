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

HTTP Basic Authentication is disabled by default - you can enable it in your Kestra configuration as shown above. If you need more fine-grained control over user and access management, the Enterprise Edition provides additional authentication mechanisms including features such as SSO and RBAC. For more details, see the [Authentication page](../05.enterprise/authentication.md).

### `kestra.configurations.delete-files-on-start`: Delete configuration files
This setting allows to delete all configuration files after the server startup. It prevents the ability to read configuration files (that may contain your secrets) from a Bash task for example. The server will keep these values in memory and they won't be accessible from tasks. Values are either `true` or `false` (default `false`).


