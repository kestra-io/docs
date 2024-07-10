---
title: Endpoints
icon: /docs/icons/admin.svg
---

How you can configure the Micronaut management endpoints in Kestra.

Management endpoints can be set up from the [Micronaut endpoint configuration](https://docs.micronaut.io/latest/guide/index.html#endpointConfiguration). You can also secure all endpoints with basic authentication using this additional configuration:

```yaml
endpoints:
  all:
    basic-auth:
      username: your-user
      password: your-password
```
