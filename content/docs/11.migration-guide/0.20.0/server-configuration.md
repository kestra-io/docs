---
title: Server configuration
icon: /docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---


## Email server configuration has moved to a different location

In Kestra < 0.20.0, email server configuration lived under `kestra.mail-service`. Given that it's used only within the Enterprise Edition (for resetting passwords and sending invites), we moved it to `kestra.ee.mail-service`.

## Required Secret Manager
In Kestra < 0.20.0, if you are not using the Enterprise Edition secret manager, we are fallback automatically on the open source version and don't require any configuration.

In Kestra > 0.20.0, we are requiring a secret manager configuration even we are still fallback to Open Source one if the secret didn't exist on the EE.

We need to add one these secret manager configuration depending on the backend used:

> JDBC  Backend
```yaml
kestra:
  secret:
    type: jdbc
    jdbc:
      secret: "your-secret-key"
```

> Kafka + ElasticSearch Backend
```yaml
kestra:
  secret:
    type: elasticsearch
    elasticsearch:
      secret: "your-secret-key"
```