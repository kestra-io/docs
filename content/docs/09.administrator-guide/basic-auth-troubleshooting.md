---
title: Troubleshooting Basic Authentication
icon: /docs/icons/faq.svg
---

Troubleshoot issues with Basic Authentication.

## Troubleshooting Scenarios

Starting from version 0.24, each open-source instance of Kestra requires basic authentication (`username` and `password`). The credentials can be configured from the Setup Page in the UI (http://localhost:8080/ui/main/setup) or you can set them manually in the Kestra configuration file under `basicAuth` (recommended for production):

```yaml
kestra:
  server:
    basicAuth:
      username: admin@kestra.io
      password: Admin1234
```

Now that basic authentication is required, the `enabled` flag is ignored (ideally don't use it anymore), and credentials must be set in order to interact with Kestra UI or API. For new users, simply follow the Setup Page that will show up when you start Kestra UI. 

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
- The `enabled` flag will be ignored regardless of `true` or `false`, as authentication is required.
- The user Setup page **will not** appear when starting Kestra because `username` and `password` are set. You will be prompted to log in with those credentials.
- If `username` or `password` is missing, Kestra will start with the Setup page instead, and there will be a prompt to create a username and password. These credentials will be how you log in for future sessions.
- If `username` or `password` is invalid, Kestra will show an error and prompt you to update the credentials to valid values.

### Scenario 2: The `enabled` flag is set to `false`

```yaml
kestra:
  server:
    basicAuth:
      enabled: false
```

In this case, the following will occur:
- The `enabled` flag will be ignored, as basic authentication is now required.
- The Setup page will appear the first time starting Kestra, and you will need to create valid credentials. The authentication credentials are stored in your Kestra database in the **Settings** table under the key `kestra.server.basic-auth`. This is how you log in for all future sessions.

### Scenario 3: No `basicAuth` configuration is added

If there is no `basicAuth` set in the configuration file then:
- The Setup page will appear the first time starting Kestra, and you will need to create valid credentials. The authentication credentials are stored in your Kestra database in the **Settings** table under the key `kestra.server.basic-auth`. This is how you log in for all future sessions.

::alert{type="info"}
For all users, if you forget your credentials, you can always update `username` and `password` in the configuration file, as the configuration file will always take precedence over the values configured from the Setup page.
::
