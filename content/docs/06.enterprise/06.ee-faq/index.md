---
title: Cloud & Enterprise Edition FAQ
icon: /docs/icons/faq.svg
editions: ["EE", "Cloud"]
---

Frequently asked questions about the Cloud and Enterprise Edition of Kestra.

## My session expires too quickly. Is there a way to change the session expiration time?

Yes, there is! Add the following Micronaut setting to your Kestra configuration to change the session expiration time to 10 hours:

```yaml
    environment:
      KESTRA_CONFIGURATION: |
        micronaut:
          security:
            token:
              generator:
                access-token:
                  expiration: 36000
              cookie:
                cookie-max-age: 10h
```

In Cloud, you might need to ask our support team to change this setting for you.