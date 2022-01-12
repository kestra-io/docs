# Open Id Connect (OIDC)

To enable OIDC in the application, you'll first have to enable OIDC in micronaut:

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
More information can be found on [micronaut oidc configuration](https://micronaut-projects.github.io/micronaut-security/latest/guide/#openid-configuration)

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