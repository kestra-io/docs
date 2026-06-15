---
title: Execution API Response Shape Changed
sidebarTitle: Execution API Response
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The execution endpoint response no longer includes task run outputs. The paginated execution list no longer includes task runs. Update API consumers that read taskRunList[*].outputs or rely on task runs being present in list responses.
---

:::alert{type="info"}
This change only affects integrations that call the execution REST API directly and parse the JSON response. Regular flow execution, expressions, and the Kestra UI are unaffected.
:::

Kestra 2.0 moves task run outputs to a dedicated storage layer and changes what the execution endpoints return. This reduces payload size, improves performance on execution list pages, and removes the need for a migration script — existing executions with inline task run outputs are read transparently from their original location.

## What changed

**Single execution endpoint** (`GET /api/v1/{tenant}/executions/{executionId}` and `POST /api/v1/{tenant}/executions/{namespace}/{id}?wait=true`):

- `taskRunList` is still present but each task run now uses a slimmer shape. The following fields are removed from each task run entry:
  - `outputs` — task run outputs are no longer included in the execution response
  - `executionId`, `namespace`, `flowId` — removed from each task run entry

**Paginated execution list** (`GET /api/v1/{tenant}/executions/search`):

- `taskRunList` is removed entirely from list responses. Each item in the list contains execution-level fields only (`id`, `namespace`, `flowId`, `state`, `outputs`, `labels`, etc.).

**Both endpoints:**

- `deleted` field removed (was always `false` and never meaningful in responses).

## How to get task run outputs

If your integration reads `taskRunList[*].outputs` from the execution response, use the dedicated outputs endpoint instead:

```bash
GET /api/v1/{tenant}/outputs/{executionId}/{taskRunId}
```

Or to list all task output information for an execution:

```bash
GET /api/v1/{tenant}/outputs/{executionId}
```

## Before and after

**Before** — task run response included outputs and redundant fields:

```json
"taskRunList": [
  {
    "id": "abc123",
    "executionId": "xyz789",
    "namespace": "company.team",
    "flowId": "myflow",
    "taskId": "mytask",
    "outputs": {
      "value": "hello"
    },
    "state": { "current": "SUCCESS" }
  }
]
```

**After** — task run response is slimmer, outputs removed:

```json
"taskRunList": [
  {
    "id": "abc123",
    "taskId": "mytask",
    "state": { "current": "SUCCESS" }
  }
]
```

## No database migration required

Kestra does not require a migration script for existing task run outputs. The backward-compatible storage layer checks both the new dedicated storage and the legacy inline location, so all existing executions continue to work after upgrading.

## Migration steps

1. If your code reads `taskRunList[*].outputs` from a single execution response, switch to `GET /api/v1/{tenant}/outputs/{executionId}/{taskRunId}`.
2. If your code reads `taskRunList` from a paginated execution list response, switch to fetching individual executions by ID when task run detail is needed.
3. If your code checks for `deleted: false` in the response, remove that check — the field is no longer returned.
