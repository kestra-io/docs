---
title: Concurrency Limit API and Permission Changes
h1: Update Scripts and Roles for the Concurrency Limit API Changes
sidebarTitle: Concurrency Limit API
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
description: In 2.1.0, the concurrency counter update endpoint takes its scope in the request body, the search endpoint is paged, and Enterprise Edition adds the FLOW UPDATE_CONCURRENCY_LIMIT permission for resetting counters.
---

Kestra 2.1.0 changes the API behind the [Concurrency Limits page](../../../05.workflow-components/14.concurrency/index.md#concurrency-limits-page) and, in Enterprise Edition, opens the page to tenant users.

## What changed

- **Update endpoint**: `PUT /api/v1/{tenant}/concurrency-limit/{namespace}/{flowId}` is replaced by `PUT /api/v1/{tenant}/concurrency-limit`. The scope moves from the path to the request body, so the same endpoint now sets flow, namespace, and tenant counters.
- **Search endpoint**: `GET /api/v1/{tenant}/concurrency-limit/search` is paged with the `page` and `size` query parameters. It returns 25 results by default, sorted by namespace, then by flow ID. Each result also has a `queued` field with the number of executions waiting in that scope's queue.
- **Enterprise Edition access**: the page moves from the Instance Owner console to **Tenant > Concurrency Limits**. Users see the counters of the namespaces where they have `FLOW` `VIEW`. Resetting a counter requires the new `FLOW` `UPDATE_CONCURRENCY_LIMIT` permission. Instance Owners keep full access.

## Update API calls

Replace calls to the old path with the new endpoint, and send the scope in the body:

```bash
curl -X PUT "https://kestra.example.com/api/v1/main/concurrency-limit" \
  -H "Authorization: Bearer $KESTRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"namespace": "company.team", "flowId": "my_flow", "running": 0}'
```

Omit `flowId` to set a namespace counter, and omit both `namespace` and `flowId` to set the tenant counter.

Scripts that read every counter from the search endpoint must follow the pages or pass a larger `size`. Otherwise, they get only the first 25 counters.

## Grant the reset permission

Of the managed roles, only Admin includes `UPDATE_CONCURRENCY_LIMIT`. To let other users reset counters, add `UPDATE_CONCURRENCY_LIMIT` to the `FLOW` permissions of a custom role and bind it on the namespaces they manage. To reset the tenant counter, bind the role to the whole tenant.

## Related

- [Concurrency limits](../../../05.workflow-components/14.concurrency/index.md)
- [Permissions reference](../../../07.enterprise/03.auth/rbac/permissions-reference/index.md)
