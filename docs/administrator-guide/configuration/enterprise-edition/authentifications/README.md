---
order: 2
---

# Authentications


Kestra provides two authentication methods:
- Basic Auth: enabled by default
- [OIDC](./auths/oidc.md)

First, you **must** configure the JWT token security:
Please generate a secret that is at least 256 bits and change the configuration like this:

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

This secret must be the same on all your webserver instances and will be used to encode the JWT cookie of Kestra.

<ChildTableOfContents />
