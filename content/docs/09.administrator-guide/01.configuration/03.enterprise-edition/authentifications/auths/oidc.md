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
            issuer: "{{ issueUrl }}"
```

More information can be found on [Micronaut OIDC configuration](https://micronaut-projects.github.io/micronaut-security/latest/guide/#openid-configuration).

The following example allow to use Google as OIDC provider:

> Google Auth

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

> Microsoft Auth

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
