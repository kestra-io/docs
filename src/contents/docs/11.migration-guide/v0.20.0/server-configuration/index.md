---
title: Server Configuration Changes in Kestra 0.20.0
h1: "Update Server Config in 0.20.0: Mail Service and Secret Manager"
sidebarTitle: Mail & Secret Manager Config
description: Server Configuration updates in Kestra 0.20.0. Mail service config moved to `kestra.ee` and Secret Manager configuration is now mandatory.
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---



## Server configuration

In Kestra < 0.20.0, email server configuration lived under `kestra.mail-service`. Given that it's used only within the Enterprise Edition (for resetting passwords and sending invites), we moved it to `kestra.ee.mail-service`.

## Required Secret Manager
In Kestra < 0.20.0, if you are not using the Enterprise Edition secret manager, Kestra falls back automatically to the open-source version and requires no configuration.

In Kestra > 0.20.0, Kestra requires a secret manager configuration, while still falling back to the open-source version if the secret does not exist on the EE.

Add one of these secret manager configurations depending on the backend:

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
