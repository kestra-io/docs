---
title: Required Basic Authentication
icon: /docs/icons/migration-guide.svg
release: 0.24.0
editions: ["OSS"]
---

## Overview

To enhance security on open-source instances, basic authentication (`username` and `password`) is now required.

The credentials can be configured from the Setup Page in the UI (http://localhost:8080/ui/main/setup) or you can set them manually in the Kestra configuration file under `basicAuth` (recommended for production):

```yaml
kestra:
  server:
    basicAuth:
      username: admin@kestra.io
      password: Admin1234
```

Now that basic authentication is required, the `enabled` flag is ignored (ideally don't use it anymore), and credentials must be set in order to interact with Kestra UI or API. For new users, simply follow the Setup Page that will show up when you start Kestra UI. 

For production deployments, we recommend setting a valid email address and a strong password in the configuration file.

If you're upgrading to version 0.24, there are three possible scenarios for existing users. Refer to the [Basic Authentication Troubleshooting guide](../../09.administrator-guide/basic-auth-troubleshooting.md) for the details.
