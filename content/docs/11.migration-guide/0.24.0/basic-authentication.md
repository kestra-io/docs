---
title: Required Basic Authentication
icon: /docs/icons/migration-guide.svg
release: 0.24.0
editions: ["OSS"]
---

## Overview

Basic authentication (`username` and `password`) is now required to enhance security on open-source instances. All users must log in to access the Kestra UI and API, even if they are running Kestra locally or in a development environment. This change is designed to prevent unauthorized access to your Kestra instance and ensure that only authenticated users can view and manage flows.

The credentials can be configured from the Setup Page in the UI (http://localhost:8080/ui/main/setup) or you can set them manually in the [Kestra configuration](../../configuration/index.md) file under `basic-auth` (recommended for production):

```yaml
kestra:
  server:
    basic-auth:
      username: admin@kestra.io
      password: Admin1234
```

Now that basic authentication is required, the `enabled` flag is ignored (ideally, don't use it anymore), and credentials must be set to interact with Kestra UI or API. For new users, simply follow the Setup Page that will appear when you start Kestra UI. 

For production deployments, we recommend setting a valid email address and a strong password in the configuration file.

If you upgrade to version 0.24, there are three possible scenarios for existing users. For the details, refer to the [Basic Authentication Troubleshooting guide](../../10.administrator-guide/basic-auth-troubleshooting.md).
