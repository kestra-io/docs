---
title: Kestra EE API
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

How to interact with Kestra Enterprise Edition using the API.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/uf-b7r_38Zk?si=Fd1MAK8bQIz0wr44" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Authentication

To authenticate with the Kestra API, you need to create an [API token](../../06.enterprise/03.auth/api-tokens.md). You can create it directly from the Kestra UI.

Once you have your API token, you can use it to authenticate with the API. You can use the `Authorization` header with the `Bearer` token to authenticate with the API.

```bash
curl -X POST http://localhost:8080/api/v1/executions/company.team/hello_world \
-H "Authorization: Bearer YOUR_API_TOKEN"
```

## Browse the API Reference

For a full list of available API endpoints, check the [Enterprise Edition API Reference](../../api-reference/enterprise.md).
