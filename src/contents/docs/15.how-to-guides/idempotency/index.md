---
title: Prevent Duplicate Executions with Correlation IDs
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Concepts
---

Use `system.correlationId` as an idempotency key to group related executions, trace execution lineage across subflows, and skip duplicate processing.

::alert{type="info"}
This guide applies to Kestra Enterprise. API token authentication and tenant-scoped endpoints are Enterprise features.
::

## How `system.correlationId` works

- A built-in system label present on every execution.
- Defaults to the ID of the first execution in the lineage and propagates to subflows automatically.
- Can be overridden with any stable identifier such as a payment intent, webhook idempotency key, or message UUID.
- When set consistently, provides a single key that represents the same business event across retries, replays, and downstream executions.

## When to use it

Use `system.correlationId` whenever the same business event might arrive more than once and you need to process it only once, for example:

- payment processing
- webhook deliveries with retry support
- event-driven pipelines consuming messages from a queue

Use the same correlation ID for every retry or replay of the same event.

## Set the correlation ID when starting an execution (API)

Replace `{your-tenant}` with your Kestra tenant ID (visible in **Administration → Tenants**).

```bash
curl -X POST http://localhost:8080/api/v1/{your-tenant}/executions/company.team/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your-api-token}" \
  -d '{
        "inputs": { "orderId": "ORD-123" },
        "labels": { "system.correlationId": "payment-ORD-123" }
      }'
```

This is the best option when the caller already knows the stable business key.

## Set or override it inside a flow

If the idempotency key is only known once the flow starts, set it with the [Labels task](/plugins/core/tasks/executions/io.kestra.plugin.core.execution.Labels).

The example below reads the key from a webhook trigger header. Webhook triggers expose the incoming HTTP headers via `trigger.headers`, so `trigger.headers['Idempotency-Key']` reads the `Idempotency-Key` header sent by the provider. The `default()` filter falls back to a key derived from the input if the header is absent.

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
    uri: "http://localhost:8080/api/v1/{{ kv('KESTRA_TENANT') }}/executions/search?q=labels.system.correlationId:{{ vars.idem_key }}&state[]=SUCCESS&size=1"
    method: GET
    headers:
      Authorization: "Bearer {{ secret('KESTRA_API_TOKEN') }}"

  - id: maybe_skip
    type: io.kestra.plugin.core.flow.If
    condition: "{{ json(outputs.check_existing.body).results | length > 0 }}"
    then:
      - id: skip
        type: io.kestra.plugin.core.log.Log
        message: "Duplicate {{ vars.idem_key }} skipped; already succeeded"
    else:
      - id: continue
        type: io.kestra.plugin.core.log.Log
        message: "First time for {{ vars.idem_key }}, proceed"
```

Store your tenant ID and API token as a [KV pair](/docs/concepts/kv-store) and [Secret](/docs/concepts/secret) respectively so the flow can reference them without hardcoding.

## Example: webhook retries

Webhook providers often resend the same event until they receive a successful response. The flow below maps the provider's `Idempotency-Key` header directly to `system.correlationId` and guards against duplicate processing before calling any downstream system.

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

  - id: check_existing
    type: io.kestra.plugin.core.http.Request
    uri: "http://localhost:8080/api/v1/{{ kv('KESTRA_TENANT') }}/executions/search?q=labels.system.correlationId:{{ vars.idem_key }}&state[]=SUCCESS&size=1"
    method: GET
    headers:
      Authorization: "Bearer {{ secret('KESTRA_API_TOKEN') }}"

  - id: maybe_skip
    type: io.kestra.plugin.core.flow.If
    condition: "{{ json(outputs.check_existing.body).results | length > 0 }}"
    then:
      - id: skip
        type: io.kestra.plugin.core.log.Log
        message: "Duplicate {{ vars.idem_key }} skipped; already succeeded"
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
- **API search:** Use the same `q=labels.system.correlationId:{value}` query parameter in the Executions search API to audit or programmatically detect duplicates.
- **Subflows:** Because the value propagates automatically, downstream executions share the same `system.correlationId` without any extra configuration.

::alert{type="warning"}
`system.correlationId` identifies and groups executions for the same business event, but it does not prevent duplicate processing on its own. You must pair it with an explicit duplicate check, as shown in the examples above.
::

## Quick checklist

- [ ] Pick a stable business key (payment intent, message ID, webhook key).
- [ ] Set `system.correlationId` when the execution starts, or via the `Labels` task if the key is only known mid-run.
- [ ] Add an early guard to skip if a successful run with the same correlation ID already exists.
- [ ] Filter by `system.correlationId` in UI/API for audit and troubleshooting.
