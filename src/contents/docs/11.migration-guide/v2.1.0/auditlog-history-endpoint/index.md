---
title: Audit Log History Endpoint Replaced
h1: Move Scripts to the New Audit Log History Endpoint
sidebarTitle: Audit Log History Endpoint
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE", "Cloud"]
description: In 2.1.0, the Enterprise Edition removes GET /api/v1/{tenant}/auditlogs/history/{detailId}. Request a resource's audit log history with filters on its type, ID, and namespace instead.
---

Kestra 2.1.0 removes `GET /api/v1/{tenant}/auditlogs/history/{detailId}` from the Enterprise Edition, with no deprecation period. The old endpoint selected entries by resource ID alone, so resources that share an ID, such as two flows with the same ID in different namespaces, were mixed in one answer. Its responses also revealed which resources exist. The UI already uses the new endpoint, so only API clients and scripts need a change.

## What changed

- **Endpoint**: request the history of one resource with `GET /api/v1/{tenant}/auditlogs/history` and [query filters](../../../api-reference/04.query-filters.md) on its type, ID, and namespace.
- **Response**: a page of results with `results` and `total`, instead of a bare array. Use the `page` and `size` query parameters to read further pages.
- **Errors**: Kestra checks your permission on the resource type and namespace before it reads any entry. A resource that doesn't exist and one you can't view both return `403`, where the old endpoint returned `200` with an empty array for an unknown ID.

## Update API calls

Pass the resource type, its ID, and, for a resource that belongs to a namespace, its namespace:

```bash
curl -G "https://kestra.example.com/api/v1/main/auditlogs/history" \
  -H "Authorization: Bearer $KESTRA_API_TOKEN" \
  --data-urlencode "filters[resources][EQUALS]=FLOW" \
  --data-urlencode "filters[id][EQUALS]=my_flow" \
  --data-urlencode "filters[namespace][EQUALS]=company.team"
```

The endpoint accepts only these three filters, each once, with a single value:

| Filter | Operations | Rule |
|---|---|---|
| `resources` | `EQUALS` or `IN` | Required. One resource type, such as `FLOW`. |
| `id` | `EQUALS` | Required. The ID of the resource. |
| `namespace` | `EQUALS` | Required for `APP_EXECUTION`, `CONCURRENCY_LIMIT`, `CREDENTIAL`, `EXECUTION`, `FLOW`, `KVSTORE`, `NAMESPACE_FILE`, `REUSABLE_INPUTS`, `SECRET`, and `TRIGGER`. Optional for `BINDING` and `POLICY`. Not accepted for other types. |

Any other filter, a second value, or a missing required filter returns `400`.

Scripts that read the whole history must follow the pages. Policies with `INSTANCE` or `STATIC` scope are left out of the results unless you are an Instance Owner.

## Related

- [Audit logs](../../../07.enterprise/02.governance/06.audit-logs/index.md)
- [Permissions reference](../../../07.enterprise/03.auth/rbac/permissions-reference/index.md)
