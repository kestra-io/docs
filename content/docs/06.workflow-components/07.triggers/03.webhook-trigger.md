---
title: Webhook Trigger
icon: /docs/icons/flow.svg
---

Trigger flows based on web-based events.

Webhook triggers generates a unique URL that you can use to automatically create new executions based on events in another application such as GitHub or Amazon EventBridge.

In order to use that URL, you have to add a secret `key` that will secure your webhook URL.


```yaml
type: "io.kestra.plugin.core.trigger.Webhook"
```

A Webhook trigger allows triggering a flow from a webhook URL.
At trigger creation a key must be set that will be used on the URL that triggers the flow: `/api/v1/executions/webhook/{namespace}/{flowId}/{key}`. We advise to use a non-easy to find or remember key like a generated sequence of characters. Kestra accepts `GET`, `POST` and `PUT` requests on this URL The whole request body and headers will be available as variables.

## Example

```yaml
id: trigger
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "Hello World! 🚀"

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: 4wjtkzwVGBM9yKnjm3yv8r
```

After the trigger is created, the key must be explicitly set in the webhook URL. You can execute the flow using the following URL:

```bash
https://{kestra_domain}/api/v1/executions/webhook/{namespace}/{flowId}/4wjtkzwVGBM9yKnjm3yv8r
```

Make sure to replace `kestra_domain`, `namespace` and `flowId`.


Check the [Webhook task](/plugins/core/triggers/io.kestra.plugin.core.trigger.Webhook) documentation for the list of the task properties and outputs.