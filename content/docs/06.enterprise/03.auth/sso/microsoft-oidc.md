---
title: Microsoft as an OIDC SSO Provider
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

## Using Microsoft as an OIDC SSO Provider

To configure Microsoft authentication, follow these steps:

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

To get your `client-id` and `client-secret`, refer to the [Microsoft Documentation](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc).

## Using Microsoft Entra ID as an OIDC SSO Provider

### Create an Enterprise Application

1. Visit the [Azure portal](https://portal.azure.com/).
2. Select **Microsoft Entra ID**.
3. Navigate to **App registrations**.
4. Click on **New registration** and provide the necessary details:
- Enter a name for your application.
- Set **Supported account types** (e.g., "Default Directory only - Single tenant").
- Under **Redirect URI**, select *Web* and enter `https://{{ url }}/oauth/callback/microsoft`. Be sure to use `https` and the actual URL of your webserver.

### Generate Client Secret

1. Go to **Certificates & secrets**.
2. Under **Client secrets**, click on **New client secret**.
3. Copy the generated secret and use it in the `{{ clientSecret }}` field in your configuration.

### Kestra Configuration

- Copy the **Application (client) ID** from the **Overview** section and use it as your `{{ clientId }}`.
- In the **Endpoints** section, locate the **OpenID Connect metadata document** URL. Remove the `.well-known/openid-configuration` suffix, and use the remainining base URL as your `{{ issuerUrl }}`.

The final URL should look like `https://login.microsoftonline.com/{{ directory }}/v2.0/`.

Here's an example Microsoft OIDC configuration:

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

With these settings, Kestra is now configured to use OIDC for SSO with your chosen providers. Ensure that all placeholders are replaced with the actual values obtained during the provider's setup process.
