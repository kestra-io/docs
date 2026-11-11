---
title: Webhook Responses Without wait Now Use responseCode
h1: Check Webhook Triggers That Set responseCode Without wait
sidebarTitle: Webhook Responses Without wait
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["OSS", "EE", "Cloud"]
description: In 2.1.0, a Webhook trigger that doesn't wait for the execution applies responseCode and responseContentType to its immediate response. A responseCode that reads outputs now makes the webhook respond with 500.
---

Kestra 2.1.0 applies the [webhook response properties](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md#customize-the-webhook-response) to every response, including the immediate response of a trigger that doesn't set `wait: true`.

## What changed

- **`responseCode`**: in 2.0, a trigger without `wait` always responded `200` and ignored `responseCode`. In 2.1.0, the immediate response uses `responseCode`.
- **`responseContentType`**: in 2.0, it only applied with `returnOutputs: true`. In 2.1.0, it applies to every response.
- **New properties**: `responseHeaders` and `responseBody` are new in 2.1.0 and also apply with or without `wait`.

Without `wait`, the response is rendered as soon as the execution is created, before any task runs. An expression that reads `outputs` can't be rendered then, so the webhook responds with `500 Internal server error`. The execution is still created and runs.

## Who is affected

Webhook triggers that set `responseCode` without `wait: true`:

- **A fixed code**, such as `responseCode: 202`: callers now get that code instead of `200`. This is usually what you intended, but check callers that only accept `200`.
- **A code that reads outputs**, such as `responseCode: "{{ outputs.check.values.code }}"`: callers now get `500` on every request, although the execution runs.

## Migrate

For a `responseCode` that reads `outputs`, either:

- set `wait: true`, so the response is rendered after the execution finishes, or
- remove `responseCode`, or replace it with a fixed value or an expression that only reads the trigger variables (`trigger.body`, `trigger.headers`, `trigger.parameters`) and `execution.id`.

```yaml
triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('WEBHOOK_KEY') }}"
    wait: true  # needed because responseCode reads outputs
    responseCode: "{{ outputs.check.values.code }}"
```

## Related

- [Webhook trigger](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md)
