---
title: Basic Authentication Troubleshooting
icon: /docs/icons/faq.svg
---

Troubleshoot any issues with Basic Authentication.

## Troubleshooting Scenarios

As of Kestra 0.24, Kestra requires basic authentication (username and password) when starting up an open-source instance. The credentials are set in the Kestra configuration file under `basicAuth`. The default configuration typically includes something like the following with default values for `username` and `password`:

```yaml
server:
  basicAuth:
    enabled: false
    username: admin@kestra.io
    password: Admin1234
```

Now that basic authentication is required, the `enabled` flag is ignored, and credentials are necessary to log in to Kestra. For new users, simply specify your preferred credentials in your configuration file (make sure to enter a valid email address), and start Kestra. You can also start Kestra with no credentials provided in the configuration file, and then you will be prompted to create a user at startup.

If you're upgrading to version 0.24, there are three possible scenarios for existing users.

### Scenario 1: The `enabled` flag is set to `true`

```yaml
server:
  basicAuth:
    enabled: true
    username: admin@kestra.io
    password: Admin1234
```
In this case, the following will occur:
- The `enabled` flag will be ignored regardless of `true` or `false`, as authentication is required.
- The user Setup page **will not** appear when starting Kestra because `username` and `password` are set. You will be prompted to login with those credentials.
- If `username` or `password` is missing, Kestra will start with the Setup page instead, and there will be a prompt to create a username and password. These credentials will be how you log in for future sessions.
- If `username` or `password` is invalid, Kestra will show and error and prompt you to update the credentials to valid values.

### Scenario 2: The `enabled` flag is set to `false`

```yaml
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
For all users, if you forget your credentials, you can always update `username` and `password` in the configuration file, as the configuration file will always take precedence over the values stored in your Kestra database after the Setup page.
```