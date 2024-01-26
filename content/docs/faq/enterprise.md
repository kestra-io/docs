---
title: Enterprise Edition FAQ
---

## My session expires too quickly. Is there a way to change the session expiration time?

Yes, there is! Add the following Micronaut setting to your Kestra configuration to change the session expiration time to 10 hours:

```yaml
    environment:
      KESTRA_CONFIGURATION: |
        micronaut:
          security:
            token:
              jwt:
                generator:
                  access-token-expiration: 36000
                  access-token:
                    expiration: 36000
                cookie:
                  cookie-max-age: 10h
```
