---
order: 2
---

# Authentications


Kestra provide 2 authentification methods for now :
- Basic Auth: enabled by default
- [OIDC](./auths/oidc.md)

First thing, you **must** configure is the JWT token security:
Please generate a secret that is at least 256 bits and change the config like this:

```yaml
micronaut:
  security:
    token:
      jwt:
        signatures:
          secret:
            generator:
              secret: "{{ Your secret here }}"
```

This secret must be the same on all your webservers instances and will be used to encode the JWT cookie of Kestra.