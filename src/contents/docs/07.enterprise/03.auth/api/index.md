---
title: "Enterprise API in Kestra: Endpoints and Auth"
h1: "Kestra Enterprise API: Available Endpoints and Authentication"
description: Interact with the Kestra Enterprise API. Learn about available endpoints, authentication methods, and how to programmatically manage your Kestra instance.
sidebarTitle: Kestra EE API
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

The Kestra Enterprise API exposes endpoints for managing executions, flows, tenants, and more — all authenticated with API tokens.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/uf-b7r_38Zk?si=Fd1MAK8bQIz0wr44" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Authentication

Authenticate with an [API token](../api-tokens/index.md). Pass the token in the `Authorization` header:

```bash
curl -X POST http://localhost:8080/api/v1/executions/company.team/hello_world \
-H "Authorization: Bearer YOUR_API_TOKEN"
```

## Browse the API reference

For a full list of available endpoints, see the [Enterprise Edition API Reference](../../../api-reference/01.enterprise/index.mdx).
