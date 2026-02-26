---
title: Webhook Trigger in Kestra – Start Flows via HTTP
description: Trigger Kestra flows via HTTP with the Webhook Trigger. Learn to start executions from external applications using secure webhook URLs and payloads.
sidebarTitle: Webhook Trigger
icon: /src/contents/docs/icons/flow.svg
---

Trigger flows automatically in response to web-based events.

## Webhook trigger – start flows via http

A Webhook trigger generates a unique URL that lets external applications (such as GitHub, Amazon EventBridge, or any system that can send HTTP requests) automatically start new executions in Kestra.

Each webhook URL requires a secret `key` to secure it. This prevents unauthorized access and ensures only trusted systems can trigger your flow.

```yaml
type: "io.kestra.plugin.core.trigger.Webhook"
```

A Webhook trigger enables triggering a flow from a webhook URL.
When you create the trigger, you must provide a `key`. This `key` is embedded in the webhook URL: `/api/v1/main/executions/webhook/{namespace}/{flowId}/{key}`.

For security, use a randomly generated string rather than something easy to guess. Kestra accepts `GET`, `POST`, and `PUT` requests on the webhook URL. Both the request body and headers are automatically available as variables inside your flow.

:::alert{type="info"}
Starting in Kestra 0.24, [Basic Authentication is required](../../../11.migration-guide/v0.24.0/basic-authentication/index.md) for all instances. This change makes it so API requests require an `Authorization` header. Follow these [Basic Authentication Encoding Steps](../../../15.how-to-guides/synchronous-executions-api/index.md#basic-authentication) to configure requests correctly.
:::

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

After creating the trigger, include the key in the webhook URL to start the flow. For example:

```bash
https://{kestra_domain}/api/v1/main/executions/webhook/{namespace}/{flowId}/4wjtkzwVGBM9yKnjm3yv8r
```

Make sure to replace `kestra_domain`, `namespace`, and `flowId`.

You can also copy the formed Webhook URL from the **Triggers** tab.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/4-KrkkgSeic?si=Ujl09_9Pv5x64YaF" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Webhook response

By default, a webhook trigger answers with JSON. When you need the caller to wait for a custom response (e.g., validation handshakes that require `text/plain`), enable `wait` and set the `responseContentType` to `text/plain`.

```yaml
triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: your-secret-key
    wait: true
    returnOutputs: true
    responseContentType: text/plain   # optional, defaults to application/json
```

Behavior:
- `wait: true` keeps the HTTP connection open until the flow finishes or hits the trigger’s timeout.
- `returnOutputs: true` returns the flow outputs as the HTTP response body (JSON by default). Override with `responseContentType` for plaintext or other formats.

---

## Webhook trigger testing

If your flow uses trigger variables (such as `{{ trigger.body }})`, you can test it directly from the execution modal. Kestra generates a ready-to-use `cURL` command that lets you trigger the flow with a custom JSON payload.

![Webhook Trigger Test](./webhook-trigger-test.png)

---

See the [Webhook trigger plugin documentation](/plugins/core/triggers/io.kestra.plugin.core.trigger.Webhook) for a full list of properties and outputs.

### Return flow outputs in the webhook response

To send task outputs back to the caller in the HTTP response, configure the Webhook trigger to wait for the execution and return outputs. The flow must expose at least one `outputs` entry.

```yaml
id: webhook_return_outputs
namespace: company.team

tasks:
  - id: make_payload
    type: io.kestra.plugin.core.debug.Return
    format: "Hello {{ trigger.parameters.name[0] ?? 'world' }}!"

outputs:
  - id: greeting
    type: STRING
    value: "{{ outputs.make_payload.value }}"

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: 4wjtkzwVGBM9yKnjm3yv8r
    wait: true
    returnOutputs: true
    # optional: responseContentType: "text/plain"
```

- Call the webhook URL with a query parameter (for example `?name=Alice`). The execution runs synchronously because `wait: true` is set.
- The HTTP response body contains the flow outputs (JSON by default). With the example above, the response includes `"greeting": "Hello Alice!"`.
- Set `responseContentType: "text/plain"` when you want the response body to be plain text (ensure the flow returns a single string output, such as from the `Return` task).
