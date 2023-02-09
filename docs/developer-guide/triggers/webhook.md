---
order: 2
---

# Webhook

```yaml
type: "io.kestra.core.models.triggers.types.Webhook"
```

> A Webhook trigger allows to trigger a flow from a webhook URL.
> At trigger creation time, Kestra will generate a key that must be used on the URL that triggers the flow: `/api/v1/executions/webhook/{namespace}/[flowId]/{key}`.
> Kestra accepts `GET`, `POST` and `PUT` requests on this URL.
> The whole request body and headers will be available as a variables.

## Example
> Add a trigger to the current flow:
```yaml
triggers:
  - id: webhook
    type: io.kestra.core.models.triggers.types.Webhook
```
> After the trigger is created, a key will be created that must be used in the webhook URL. Now, you can launch the flow on the URL `/api/v1/executions/webhook/{namespace}/[flowId]/4wjtkzwVGBM9yKnjm3yv8r`.

```yaml
triggers:
  - id: webhook
    type: io.kestra.core.models.triggers.types.Webhook
    key: 4wjtkzwVGBM9yKnjm3yv8r
```




## Inputs

### `id`
* **Type:** <Badge vertical="middle" text="String" />
* **Required:** ✔

> Unique for a flow.

### `key`
* **Type:** <Badge vertical="middle" text="String" />
* **Required:** ❌

> The unique key that will be part of the URL.

If you don’t provide a key, a random one will be generated. This is used as the key for generating the URL of the webhook.

::: warning
Take care when using a manual key, the key is the only security to protect your webhook and must be protected as a secret!
:::


## Outputs

### `body`
* **Type:** <Badge vertical="middle" text="Object" />

> The full body of the webhook request.

We try to deserialize the incoming request as json (array or object).
If we can’t the full body as string will be available

### `headers`
* **Type:** <Badge vertical="middle" text="Map<String, List<String>>" />

> The headers of the webhook request.
