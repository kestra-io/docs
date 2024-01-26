---
title: Webhook
icon: /docs/icons/concepts.svg
---

```yaml
type: "io.kestra.core.models.triggers.types.Webhook"
```

> A Webhook trigger allows triggering a flow from a webhook URL.
> At trigger creation a key must be set that will be used on the URL that triggers the flow: `/api/v1/executions/webhook/{namespace}/{flowId}/{key}`. We advise to use a non-easy to find or remember key like a generated sequence of characters.
> Kestra accepts `GET`, `POST` and `PUT` requests on this URL.
> The whole request body and headers will be available as variables.

## Example
> Add a trigger to the current flow:
```yaml
triggers:
  - id: webhook
    type: io.kestra.core.models.triggers.types.Webhook
    key: 4wjtkzwVGBM9yKnjm3yv8r
```
> After the trigger is created, the key must be explicitly set in the webhook URL. You can launch the flow using the following URL
 `/api/v1/executions/webhook/{namespace}/{flowId}/4wjtkzwVGBM9yKnjm3yv8r`.

## Properties and Outputs

Check the [Webhook task](/plugins/core/triggers/io.kestra.core.models.triggers.types.webhook) documentation for the list of the task properties and outputs.
