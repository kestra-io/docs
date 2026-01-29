---
title: Kestra Enterprise API – Endpoints and Authentication
description: Interact with the Kestra Enterprise API. Learn about available endpoints, authentication methods, and how to programmatically manage your Kestra instance.
sidebarTitle: Kestra EE API
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

How to interact with the Kestra Enterprise Edition using the API.

## Kestra Enterprise API – endpoints and authentication

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/uf-b7r_38Zk?si=Fd1MAK8bQIz0wr44" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Authentication

To authenticate with the Kestra API, you need to create an [API token](../api-tokens/index.md). You can create it directly from the Kestra UI.

Once you have your API token, use it to authenticate with the API by passing it in the `Authorization` header as a `Bearer` token.

```bash
curl -X POST http://localhost:8080/api/v1/executions/company.team/hello_world \
-H "Authorization: Bearer YOUR_API_TOKEN"
```

## Browse the API Reference

For a full list of available API endpoints, refer to the [Enterprise Edition API Reference](../../../api-reference/01.enterprise/index.mdx).
