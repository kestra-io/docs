---
title: Troubleshooting Basic Authentication
icon: /docs/icons/faq.svg
---

Troubleshoot issues with Basic Authentication.

## Troubleshooting Scenarios

Starting with version 0.24, every open-source instance of Kestra requires Basic Authentication (`username` and `password`). You can configure credentials via the Setup Page in the UI (http://localhost:8080/ui/main/setup) or manually in the configuration file under `basicAuth` (recommended for production):

```yaml
kestra:
  server:
    basicAuth:
      username: admin@kestra.io
      password: Admin1234
```

Since Basic Authentication is now required, the `enabled` flag is ignored and should no longer be used. Credentials must be configured to access the Kestra UI or API. For new users, simply follow the Setup Page that will show up when you start Kestra UI.

For production deployments, we recommend setting a valid email address and a strong password in the configuration file.

If you're upgrading to version 0.24, there are three possible scenarios for existing users.

### Scenario 1: The `enabled` flag is set to `true`

```yaml
kestra:
  server:
    basicAuth:
      enabled: true
      username: admin@kestra.io
      password: Admin1234
```

In this case, the following will occur:
- Now that authentication is required, it is always enabled. Therefore, the `enabled` flag is ignored regardless of `true` or `false`.
- The user Setup page **will not** appear when starting Kestra because `username` and `password` are set. You will be prompted to log in with those credentials.
- If either `username` or `password` is missing, Kestra starts with the Setup page and prompts you to create credentials. These values will be used for all future logins.
- If `username` or `password` is invalid, Kestra will show an error and prompt you to update the credentials to valid values.

### Scenario 2: The `enabled` flag is set to `false`

```yaml
kestra:
  server:
    basicAuth:
      enabled: false
```

In this case, the following will occur:
- Now that authentication is required, it is always enabled. Therefore, the `enabled` flag is ignored regardless of `true` or `false`.
- On first startup, the Setup page appears and prompts you to create credentials. These are stored in the Kestra database in the **Settings** table under the key `kestra.server.basic-auth` and are used for all subsequent logins.


### Scenario 3: No `basicAuth` configuration is added

If no `basicAuth` configuration is defined:
- The Setup page will appear the first time starting Kestra, and you will need to create valid credentials. The authentication credentials are stored in your Kestra database in the **Settings** table under the key `kestra.server.basic-auth`. This is how you log in for all future sessions.

::alert{type="info"}
If you forget your credentials, update the `username` and `password` in the configuration file. The configuration file always takes precedence over values set from the Setup page.
::
