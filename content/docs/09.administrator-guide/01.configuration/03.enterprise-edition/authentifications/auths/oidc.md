---
title: OpenID Connect (OIDC)
---

To enable OIDC in the application, you will first have to enable OIDC in Micronaut:

```yaml
micronaut:
  security:
    oauth2:
      enabled: true
      clients:
        google:
          client-id: "{{ clientId }}"
          client-secret: "{{ clientSecret }}"
          openid:
            issuer: "{{ issuerUrl }}"
```

More information can be found on [Micronaut OIDC configuration](https://micronaut-projects.github.io/micronaut-security/latest/guide/#openid-configuration).

The following example allow to use Google as OIDC provider:

## Google Auth

```yaml
micronaut:
  security:
    oauth2:
      enabled: true
      clients:
        google:
          client-id: "{{ clientId }}"
          client-secret: "{{ clientSecret }}"
          openid:
            issuer: 'https://accounts.google.com'
```

The following example allow to use Microsoft as OIDC provider:

## Microsoft Auth

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

## Microsoft Entra ID

You need to create an entreprise application first:
* Go to [Azure portal](https://portal.azure.com/)
* Choose `Microsoft Entra ID`
* Go to `App registrations`
* Click on `New registration`
  * Fill a new name
  * Choose Supported account types for your company ("Default Directory only - Single tenant" is the easiest one)
  * In "Redirect URI":
    * Choose "Web" in platform
    * in the url fill `https://{{ url }}/oauth/callback/microsoft`, the url must be a https url and the url of the webserver.
* Go on `Certificates & secrets`
  * Click on `Client secrets`
  * Click on new `client secret`
  * Copy the secret generated that must be filed on `{{ clientSecret }}` below
* Add this configuration to your Kestra instance:
* On `overview`, copy the "Application (client) ID" that must be filed on `{{ clientId }}` below
* Click on `endpoint`,
  * Copy the "OpenID Connect metadata document" url and remove `.well-known/openid-configuration` that must be filed on `{{ issuerUrl }}`
  * Url look like `https://login.microsoftonline.com/{{ directory }}/v2.0/`

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
