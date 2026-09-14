---
title: "Kestra API Errors: RFC 9457 Problem Details"
h1: Problem details
sidebarTitle: Problem Details
description: Every Kestra API error is an RFC 9457 problem details document. Reference for its members, its field-level errors, and the catalog of problem types.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
hideSubMenus: true
---

Every error the Kestra API returns is an [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) problem details document, served as `application/problem+json`. Two things are outside that: the Model Context Protocol transport under `/mcp/`, whose errors are JSON-RPC 2.0 envelopes, and the few routes that answer with an error body of their own, which is left as the route sent it.

A request that tries to create a flow whose id is taken returns:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/entity-already-exists",
  "title": "Entity already exists",
  "status": 409,
  "detail": "A flow with id 'my-flow' already exists in namespace 'company.team'.",
  "instance": "/api/v1/main/flows"
}
```

## Document members

| Member | Always present | Description |
|---|---|---|
| `type` | yes | Stable identifier of the kind of problem, as a URI that resolves to its page below. This is the only member to branch on. |
| `title` | yes | Short summary of the kind of problem. Identical for every occurrence of a given `type`, and never parameterised. |
| `status` | yes | The HTTP status code, repeated in the body for convenience. |
| `detail` | yes | Explanation of this particular occurrence, written for a human. |
| `instance` | yes | Path of the request that produced the problem. |
| `errors` | no | Field-level or per-item errors, when several problems are reported at once. |
| `traceId` | no | Correlation identifier for the matching server-side log entry. Present on server errors only. |

Absent members are omitted rather than sent as `null`.

## Branch on type, never on text

`type` is a permanent, published URI. Once a type ships it is never renamed or repurposed, so it is safe to switch on:

```python
if problem["type"].endswith("/entity-already-exists"):
    ...
```

`title` is stable for a given `type` and never contains values from the request, which makes it safe to display verbatim or to use as a key for your own translations.

`detail` is the opposite. It is written for whoever reads the error, it embeds ids and paths from the request, and its wording changes between releases. Never parse it, and never make behavior depend on it.

:::alert{type="info"}
`status` and `type` agree, with one exception: an endpoint that explicitly raises an unusual status reports that status as sent, rather than having it normalised to the type's own. Read `status` from the response.
:::

## Field-level errors

When a request fails for more than one reason, each reason is an entry in `errors`:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/validation-failed",
  "title": "Validation failed",
  "status": 422,
  "detail": "Validation failed",
  "instance": "/api/v1/main/flows",
  "errors": [
    {
      "detail": "must not be null",
      "pointer": "/tasks/0/type",
      "path": "tasks[my-task].type"
    }
  ]
}
```

| Member | Description |
|---|---|
| `detail` | What is wrong with this field or item. |
| `pointer` | [RFC 6901](https://www.rfc-editor.org/rfc/rfc6901.html) JSON Pointer locating the field in the submitted document. |
| `path` | Friendlier locator that names tasks and inputs by their id. Not a JSON Pointer. |
| `type` | The item's own problem type, on bulk endpoints where it differs per item. |

Both locators are carried because neither is enough on its own: `pointer` is valid for machine use, and `path` is what to show a user. Entries are ordered deterministically, so the same request always produces the same document.

## Server errors

A `5xx` problem never echoes the underlying exception message. Its `detail` is always the same fixed sentence, and it carries a `traceId` that ties the response to the server log entry holding the real cause:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/internal-error",
  "title": "Internal server error",
  "status": 500,
  "detail": "An unexpected error occurred. Quote the traceId when contacting support.",
  "instance": "/api/v1/main/flows",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

Quote the `traceId` when reporting the problem. The `errors` member is never populated on a server error.

## Unknown types

The catalog below grows as new kinds of failure are given a type of their own, so handle any `type` you do not recognise by its status class: a `4xx` is something to fix in the request, a `5xx` is something to retry or report. Types already published are never removed and never change meaning, so code written against the catalog keeps working.

## Catalog

Types marked Cloud and Enterprise Edition are returned only by those editions. Every other type is returned by all editions.

### Request payload

| Type | Status | Title |
|---|---|---|
| [`invalid-json`](./invalid-json.md) | `422` | Invalid JSON |
| [`invalid-plugin-type`](./invalid-plugin-type.md) | `422` | Invalid plugin type |
| [`invalid-format`](./invalid-format.md) | `422` | Invalid value format |
| [`invalid-request-body`](./invalid-request-body.md) | `422` | Invalid request body |
| [`invalid-argument`](./invalid-argument.md) | `422` | Invalid argument |

### Request line and query string

| Type | Status | Title |
|---|---|---|
| [`bad-request`](./bad-request.md) | `400` | Bad request |
| [`invalid-query-parameter`](./invalid-query-parameter.md) | `400` | Invalid query parameter |
| [`invalid-query-filters`](./invalid-query-filters.md) | `400` | Invalid query filters |

### Entity validation

| Type | Status | Title |
|---|---|---|
| [`validation-failed`](./validation-failed.md) | `422` | Validation failed |
| [`invalid-entity`](./invalid-entity.md) | `422` | Invalid entity |
| [`bulk-validation-failed`](./bulk-validation-failed.md) | `400` | Bulk validation failed |

### Authentication and authorization

| Type | Status | Title |
|---|---|---|
| [`unauthenticated`](./unauthenticated.md) | `401` | Authentication required |
| [`forbidden`](./forbidden.md) | `403` | Access denied |

### Resource state

| Type | Status | Title |
|---|---|---|
| [`not-found`](./not-found.md) | `404` | Resource not found |
| [`conflict`](./conflict.md) | `409` | Conflict |
| [`entity-already-exists`](./entity-already-exists.md) | `409` | Entity already exists |
| [`resource-expired`](./resource-expired.md) | `410` | Resource has expired |
| [`locked`](./locked.md) | `423` | Resource is locked |

### Protocol-level rejections

| Type | Status | Title |
|---|---|---|
| [`method-not-allowed`](./method-not-allowed.md) | `405` | Method not allowed |
| [`not-acceptable`](./not-acceptable.md) | `406` | Not acceptable |
| [`payload-too-large`](./payload-too-large.md) | `413` | Payload too large |
| [`unsupported-media-type`](./unsupported-media-type.md) | `415` | Unsupported media type |
| [`too-many-requests`](./too-many-requests.md) | `429` | Too many requests |

### AI Copilot

| Type | Status | Title |
|---|---|---|
| [`ai-request-failed`](./ai-request-failed.md) | `422` | AI request failed |

### Server errors

| Type | Status | Title |
|---|---|---|
| [`internal-error`](./internal-error.md) | `500` | Internal server error |
| [`migration-required`](./migration-required.md) | `503` | Migration required |
| [`service-unavailable`](./service-unavailable.md) | `503` | Service unavailable |
| [`timeout`](./timeout.md) | `504` | Operation timed out |

### Cloud and Enterprise Edition

| Type | Status | Title |
|---|---|---|
| [`feature-disabled`](./feature-disabled.md) | `403` | Feature disabled by license |
| [`license-limit-exceeded`](./license-limit-exceeded.md) | `403` | License limit reached |
| [`resource-leased`](./resource-leased.md) | `423` | Resource is leased |
| [`invalid-credentials`](./invalid-credentials.md) | `400` | Invalid credentials |
| [`password-policy-violation`](./password-policy-violation.md) | `422` | Password policy not met |
| [`policy-violation`](./policy-violation.md) | `403` | Policy violation |
| [`app-error`](./app-error.md) | `422` | App error |
