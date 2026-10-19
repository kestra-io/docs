---
title: Set Up Microsoft OIDC SSO in Kestra
h1: Authenticate with Microsoft Entra ID via OIDC
description: Configure Microsoft OIDC SSO for Kestra. Enable users to sign in with their Microsoft Entra ID (Azure AD) credentials using OpenID Connect.
sidebarTitle: Microsoft OIDC SSO
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

Authenticate Kestra users with their Microsoft Entra ID credentials using OIDC.

## Configure Microsoft OIDC

To authenticate with Microsoft, add the following to your [Kestra Security and Secrets configuration](../../../../configuration/05.security-and-secrets/index.md):

```yaml
micronaut:
  security:
    oauth2:
      enabled: true
      clients:
        microsoft:
          client-id: "{{ clientId }}"
          client-secret: "{{ clientSecret }}"
          openid:
            issuer: 'https://login.microsoftonline.com/common/v2.0/'
```

To get your `client-id` and `client-secret`, refer to the [Microsoft Entra ID OIDC documentation](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc).

## Configure Microsoft Entra ID

### Create an Enterprise Application

1. Visit the [Azure portal](https://portal.azure.com/).
2. Select **Microsoft Entra ID**.
3. Navigate to **App registrations**.
4. Click **New registration** and provide the necessary details:
   - Enter a name for your application.
   - Set **Supported account types** (e.g., "Default Directory only - Single tenant").
   - Under **Redirect URI**, select *Web* and enter `https://{{ url }}/oauth/callback/microsoft`. Use `https` and your actual webserver URL.

### Generate client secret

1. Go to **Certificates & secrets**.
2. Under **Client secrets**, click on **New client secret**.
3. Copy the generated secret and use it in the `{{ clientSecret }}` field in your [Security and Secrets configuration](../../../../configuration/05.security-and-secrets/index.md).

### Kestra configuration

- Copy the **Application (client) ID** from the **Overview** section and use it as your `{{ clientId }}`.
- In the **Endpoints** section, locate the **OpenID Connect metadata document** URL. Remove the `.well-known/openid-configuration` suffix, and use the remaining base URL as your `{{ issuerUrl }}`.

The final URL should look like `https://login.microsoftonline.com/{{ directory }}/v2.0/`.

Example configuration:

```yaml
micronaut:
  security:
    oauth2:
      enabled: true
      clients:
        microsoft:
          client-id: "{{ clientId }}"
          client-secret: "{{ clientSecret }}"
          openid:
            issuer: '{{ issuerUrl }}'
```

Replace all placeholders with the values obtained from Entra ID.

## Configure a default role for SSO users

SSO users need a default role for initial access in Kestra. Add the following to `kestra.security`:

```yaml
kestra:
  security:
    defaultRole:
      name: default_admin_role
      description: "Default Admin Role"
      permissions:
        FLOW:
          - VIEW
          - LIST
          - CREATE
          - UPDATE
          - DELETE
          - EXECUTE
          - DISABLE
          - ENABLE
          - VALIDATE
          - EXPORT
          - IMPORT
        EXECUTION:
          - VIEW
          - LIST
          - UPDATE
          - DELETE
          - RESTART
          - KILL
          - REPLAY
          - PAUSE
          - RESUME
          - CHANGE_LABELS
          - ACCESS_LOGS
          - ACCESS_OUTPUTS
          - ACCESS_FILES
          - EXPORT
          - UNQUEUE
          - FORCE_RUN
          - FOLLOW
        NAMESPACE:
          - VIEW
          - LIST
          - CREATE
          - UPDATE
          - DELETE
          - MANAGE_FILES
        SECRET: ["VIEW", "LIST", "UPDATE", "DELETE"]
        KVSTORE: ["VIEW", "LIST", "CREATE", "UPDATE", "DELETE"]
        BLUEPRINT: ["VIEW", "LIST", "CREATE", "UPDATE", "DELETE"]
        ROLE: ["VIEW", "LIST", "CREATE", "UPDATE", "DELETE"]
        GROUP: ["VIEW", "LIST", "CREATE", "UPDATE", "DELETE", "MANAGE_MEMBERS"]
        USER: ["VIEW", "LIST", "CREATE", "UPDATE", "DELETE", "MANAGE_GROUP_MEMBERSHIP"]
        BINDING: ["VIEW", "LIST", "CREATE", "DELETE"]
        AUDITLOG: ["VIEW", "LIST", "EXPORT"]
  ee:
    tenants:
      enabled: true
      defaultTenant: false
```

:::alert{type="info"}
Place `defaultRole` under `kestra.security`, not under `micronaut.security`. The example above grants broad access — adjust the action lists to match the permissions your users actually need in production.
:::
