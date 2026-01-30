---
title: Idempotency with `system.correlationId`
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Concepts
---

Use `system.correlationId` as your single idempotency key to ensure a flow (or chain of subflows) runs only once per business event.

## What `system.correlationId` is
- A built-in system label present on every execution.
- Defaults to the ID of the first execution in the lineage (propagates to subflows).
- Can be set to any stable identifier (payment intent, webhook idempotency key, message UUID) to group, deduplicate, and trace related executions.

## Set the correlation ID when starting an execution (API)
```bash
curl -X POST http://localhost:8080/api/v1/executions/company.team/payments \
  -H "Content-Type: application/json" \
  -d '{
        "inputs": { "orderId": "ORD-123" },
        "labels": { "system.correlationId": "payment-ORD-123" }
      }'
```
Use the same value for all retries/replays of that business event so they remain part of one correlation group.

## Set or override inside a flow (Labels task)
```yaml
id: payment_flow
namespace: company.team

variables:
  idem_key: "{{ trigger.headers['Idempotency-Key'] | default('payment-' ~ inputs.orderId) }}"

tasks:
  - id: set_correlation
    type: io.kestra.plugin.core.execution.Labels
    labels:
      system.correlationId: "{{ vars.idem_key }}"

  - id: process
    type: io.kestra.plugin.core.log.Log
    message: "Processing {{ vars.idem_key }}"
```

## Short-circuit duplicates early

Add a guard that searches for an already successful execution sharing the same correlation ID; skip if found.

```yaml
id: payment_flow_guarded
namespace: company.team

variables:
  idem_key: "{{ trigger.headers['Idempotency-Key'] }}"

tasks:
  - id: set_correlation
    type: io.kestra.plugin.core.execution.Labels
    labels:
      system.correlationId: "{{ vars.idem_key }}"

  - id: check_existing
    type: io.kestra.plugin.core.http.Request
    uri: "http://localhost:8080/api/v1/executions/search"
    method: POST
    body: |
      {
        "page": 1,
        "size": 1,
        "query": "labels.system.correlationId:{{ vars.idem_key }} AND state:SUCCESS"
      }

  - id: maybe_skip
    type: io.kestra.plugin.core.flow.If
    condition: "{{ json(outputs.check_existing.body).total > 0 }}"
    then:
      - id: skip
        type: io.kestra.plugin.core.log.Log
        message: "Duplicate {{ vars.idem_key }} skipped; already succeeded"
    else:
      - id: continue
        type: io.kestra.plugin.core.log.Log
        message: "First time for {{ vars.idem_key }}, proceed"
```

## Operate with correlation IDs

- **UI filtering:** In Executions, add the label filter `system.correlationId:your-key` to view the entire lineage.
- **API search:** Use the same label filter in the Executions search API to audit or programmatically detect duplicates.
- **Subflows:** Because the value propagates, downstream executions automatically share the same `system.correlationId`.

## Quick checklist

- [ ] Pick a stable business key (payment intent, message ID, webhook key).
- [ ] Set `system.correlationId` at creation or via the `Labels` task.
- [ ] Add an early guard to skip if a successful run with the same correlation ID already exists.
- [ ] Filter by `system.correlationId` in UI/API for audit and troubleshooting.
