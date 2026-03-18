---
title: Prevent Duplicate Executions with Correlation IDs
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Concepts
---

Use `system.correlationId` as an idempotency key to group related executions, trace execution lineage across subflows, and skip duplicate processing.

## What `system.correlationId` is
- A built-in system label present on every execution.
- Defaults to the ID of the first execution in the lineage and propagates to subflows.
- Can be set to any stable identifier such as a payment intent, webhook idempotency key, or message UUID.
- Is useful when you need one key that represents the same business event across retries, replays, and downstream executions.

## When to use it

Use `system.correlationId` whenever the same business event might arrive more than once and you need to process it only once, for example:

- payment processing
- webhook deliveries with retry support
- event-driven pipelines consuming messages from a queue

Use the same correlation ID for every retry or replay of the same event.

## Set the correlation ID when starting an execution (API)
```bash
curl -X POST http://localhost:8080/api/v1/main/executions/company.team/payments \
  -H "Content-Type: application/json" \
  -d '{
        "inputs": { "orderId": "ORD-123" },
        "labels": { "system.correlationId": "payment-ORD-123" }
      }'
```
This is the best option when the caller already knows the stable business key.

## Set or override it inside a flow

If the idempotency key is only known once the flow starts, set it with the [Labels task](/plugins/core/tasks/executions/io.kestra.plugin.core.execution.Labels).

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

This is useful when the key comes from a webhook header, a payload field, or an upstream task output.

## Short-circuit duplicates early

Once the correlation ID is set, search for an already successful execution with that same value. If one exists, skip the duplicate run.

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
    uri: "http://localhost:8080/api/v1/main/executions/search"
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

This pattern makes `system.correlationId` act as an idempotency key in practice:

- the same business event always gets the same correlation ID
- the flow checks whether that event already completed successfully
- duplicates can exit before calling downstream systems again

## Example: webhook retries

Webhook providers often resend the same event until they receive a successful response. If the provider exposes an `Idempotency-Key` header, map it directly to `system.correlationId`.

```yaml
id: payment_webhook
namespace: company.team

variables:
  idem_key: "{{ trigger.headers['Idempotency-Key'] }}"

tasks:
  - id: set_correlation
    type: io.kestra.plugin.core.execution.Labels
    labels:
      system.correlationId: "{{ vars.idem_key }}"

  - id: process_payment
    type: io.kestra.plugin.core.log.Log
    message: "Charge payment for {{ vars.idem_key }}"

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: payment-events
```

## Operate with correlation IDs

- **UI filtering:** In Executions, add the label filter `system.correlationId:your-key` to view the entire lineage.
- **API search:** Use the same label filter in the Executions search API to audit or programmatically detect duplicates.
- **Subflows:** Because the value propagates, downstream executions automatically share the same `system.correlationId`.

## Important note

`system.correlationId` identifies and groups executions for the same event. To actively prevent duplicate processing, pair it with an early duplicate check such as the one above.

## Quick checklist

- [ ] Pick a stable business key (payment intent, message ID, webhook key).
- [ ] Set `system.correlationId` when the execution starts, or via the `Labels` task if the key is only known mid-run.
- [ ] Add an early guard to skip if a successful run with the same correlation ID already exists.
- [ ] Filter by `system.correlationId` in UI/API for audit and troubleshooting.
