---
title: Prevent Duplicate Executions with Correlation IDs
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
editions: ["EE"]
topics:
  - Kestra Concepts
---

Use `system.correlationId` as an idempotency key to group related executions, trace execution lineage across subflows, and skip duplicate processing.

This guide covers two patterns: setting the correlation ID at execution creation for API-triggered flows, and using a custom label for webhook-triggered flows where the key only becomes available after the execution starts.

:::alert{type="info"}
This guide applies to Kestra Enterprise. API token authentication and tenant-scoped endpoints are Enterprise features.
:::

## How `system.correlationId` works

- A built-in system label present on every execution.
- Defaults to the execution's own ID and propagates to subflows automatically — all executions in a lineage share the root execution's `system.correlationId`.
- Can be set to any stable business identifier at execution creation time, such as a payment intent, message UUID, or event key.
- Immutable once the execution is created — it cannot be changed mid-flow.

## When to use it

Use `system.correlationId` when the same business event might arrive more than once and you need to process it only once:

- payment processing triggered via API
- event-driven pipelines consuming messages from a queue
- any flow where the caller controls the trigger and holds the stable key at creation time

For **webhook-triggered flows**, where the idempotency key arrives in the request headers after the execution is already created, use a custom label instead. See [Webhook-triggered flows](#webhook-triggered-flows).

## Set the correlation ID at execution creation

Pass `system.correlationId` as a `labels` query parameter when creating the execution. Labels use `key:value` format.

Replace `{your-tenant}` with your tenant ID (visible in **Administration → Tenants**).

```bash
curl -X POST "http://localhost:8080/api/v1/{your-tenant}/executions/company.team/payments?labels=system.correlationId:payment-ORD-123" \
  -H "Authorization: Bearer {your-api-token}"
```

Use this approach when the caller already holds the stable business key.

## Short-circuit duplicates early

After setting the correlation ID at creation, check whether a successful execution with that key already exists. If one does, skip the current run.

Pass the idempotency key as both the `labels` query parameter and an input so the flow can reference it in the duplicate check:

```bash
curl -X POST "http://localhost:8080/api/v1/{your-tenant}/executions/company.team/payment_flow_guarded?labels=system.correlationId:payment-ORD-123" \
  -H "Authorization: Bearer {your-api-token}" \
  -F "idempotencyKey=payment-ORD-123"
```

```yaml
id: payment_flow_guarded
namespace: company.team

inputs:
  - id: idempotencyKey
    type: STRING

tasks:
  - id: check_existing
    type: io.kestra.plugin.core.http.Request
    uri: "http://localhost:8080/api/v1/{{ kv('KESTRA_TENANT') }}/executions/search?filters[labels][EQUALS][system.correlationId]={{ inputs.idempotencyKey }}&filters[namespace][EQUALS]=company.team&filters[flowId][EQUALS]=payment_flow_guarded&filters[state][IN]=SUCCESS&size=1"
    method: GET
    headers:
      Authorization: "Bearer {{ secret('KESTRA_API_TOKEN') }}"

  - id: maybe_skip
    type: io.kestra.plugin.core.flow.If
    condition: "{{ not (outputs.check_existing.body contains '\"total\":0') }}"
    then:
      - id: skip
        type: io.kestra.plugin.core.log.Log
        message: "Duplicate {{ inputs.idempotencyKey }} skipped; already succeeded"
    else:
      - id: continue
        type: io.kestra.plugin.core.log.Log
        message: "First time for {{ inputs.idempotencyKey }}, proceed"
```

Store your tenant ID and API token as a [KV pair](../../06.concepts/05.kv-store/index.md) and [Secret](../../06.concepts/04.secret/index.md) respectively.

## Webhook-triggered flows

`system.correlationId` is assigned automatically when the execution is created and cannot be changed afterwards. For webhook-triggered flows, the provider's idempotency key is only available once the execution has started. Store it in a **custom label** using the [Labels task](/plugins/core/tasks/executions/io.kestra.plugin.core.execution.Labels), then use that label for the duplicate check.

```yaml
id: payment_webhook
namespace: company.team

variables:
  idem_key: "{{ trigger.headers['Idempotency-Key'] | first }}"

tasks:
  - id: set_idempotency_key
    type: io.kestra.plugin.core.execution.Labels
    labels:
      idempotency.key: "{{ vars.idem_key }}"

  - id: check_existing
    type: io.kestra.plugin.core.http.Request
    uri: "http://localhost:8080/api/v1/{{ kv('KESTRA_TENANT') }}/executions/search?filters[labels][EQUALS][idempotency.key]={{ vars.idem_key }}&filters[namespace][EQUALS]=company.team&filters[flowId][EQUALS]=payment_webhook&filters[state][IN]=SUCCESS&size=1"
    method: GET
    headers:
      Authorization: "Bearer {{ secret('KESTRA_API_TOKEN') }}"

  - id: maybe_skip
    type: io.kestra.plugin.core.flow.If
    condition: "{{ not (outputs.check_existing.body contains '\"total\":0') }}"
    then:
      - id: skip
        type: io.kestra.plugin.core.log.Log
        message: "Duplicate {{ vars.idem_key }} skipped"
    else:
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
- **API search:** Use `filters[labels][EQUALS][system.correlationId]={value}` and `filters[state][IN]=SUCCESS` as query parameters in the Executions search API to audit or detect duplicates programmatically.
- **Subflows:** The value propagates automatically, so downstream executions share the same `system.correlationId` without additional configuration.

:::alert{type="warning"}
`system.correlationId` identifies and groups executions for the same business event, but it does not prevent duplicate processing on its own. Pair it with an explicit duplicate check as shown in the examples in this guide.

The duplicate check is not atomic. If two executions with the same key start simultaneously, both may pass the SUCCESS check before either completes — neither will be in SUCCESS state yet. For strict once-only guarantees under concurrent load, enforce uniqueness at the system that triggers the execution (message broker deduplication, database unique constraint, or API gateway idempotency).
:::

## Quick checklist

- [ ] Pick a stable business key (payment intent, message ID, event key).
- [ ] For API-triggered flows: set `system.correlationId` at execution creation via the `labels` query parameter.
- [ ] For webhook-triggered flows: store the provider's idempotency key as a custom label via the Labels task.
- [ ] Add an early guard to skip if a successful execution with the same key already exists.
- [ ] Filter by `system.correlationId` in the UI or API for audit and lineage troubleshooting.
