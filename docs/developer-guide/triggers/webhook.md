
# Webhook

```yaml
type: "org.kestra.core.models.triggers.types.Webhook"
```

> Webbook trigger allow you to trigger a flow from a webhook url.
> The trigger will generate a key that must be used on url : `/api/v1/executions/webhook/{namespace}/[flowId]/{key}`.
> Kestra accept `GET`, `POST` & `PUT` request on this url.
> The whole body & headers will be available as variable.

## Example
> Add a trigger to the current flow
```yaml
triggers:
  - id: webhook
    type: org.kestra.core.models.triggers.types.Webhook
```
> After the trigger is created, a key will be created that will be use in the webhook url, now, you can launch the flow on the url `/api/v1/executions/webhook/{namespace}/[flowId]/4wjtkzwVGBM9yKnjm3yv8r`

```yaml
triggers:
  - id: webhook
    type: org.kestra.core.models.triggers.types.Webhook
    key: 4wjtkzwVGBM9yKnjm3yv8r
```




## Inputs

### `id`
* **Type:** <Badge vertical="middle" text="String" />
* **Required:** ✔

> unique for a flow.

### `key`
* **Type:** <Badge vertical="middle" text="String" />
* **Required:** ❌

> The unique key that will be part of the url

If you don’t provide, a random one will be generated. Is used as key for generating the url of the webhook.

::: warning
Take care when using manual key, the key is the only security to protect your webhook and must be considered as a secret !
:::


## Outputs

### `body`
* **Type:** <Badge vertical="middle" text="Object" />

> The full body for the webhook request

We try to deserialize the incoming request as json (array or object).
If we can’t the full body as string will be available

### `headers`
* **Type:** <Badge vertical="middle" text="Map<String, List<String>>" />

> The headers for the webhook request
