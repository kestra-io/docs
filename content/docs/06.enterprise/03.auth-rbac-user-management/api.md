---
title: Kestra EE API
icon: /docs/icons/admin.svg
editions: ["EE"]
---

How to interact with Kestra Enterprise Edition using the API.


## Authentication

To authenticate with the Kestra API, you will need to create an [API token](../06.enterprise/api-tokens.md). You can create it directly from the Kestra UI.

Once you have your API token, you can use it to authenticate with the API. You can use the `Authorization` header with the `Bearer` token to authenticate with the API.

```bash
curl -X POST http://localhost:8080/api/v1/executions/company.team/hello_world \
-H "Authorization: Bearer YOUR_API_TOKEN"
```

## Browse the API Reference

For a full list of available API endpoints, check the [Enterprise Edition API Reference](../api-reference/enterprise.md).
