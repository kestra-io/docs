---
title: Setup Webhooks to trigger Flows
icon: /docs/icons/webhook.svg
stage: Getting Started
topics:
  - Integrations
---

Execute flows using the Webhooks Trigger.

## What are Webhooks?

Webhooks are HTTP requests that are triggered by an event. These are useful for being able to tell another application to do something, such as starting the execution of a Flow inside of Kestra.

## Using Webhooks in Kestra

You can use webhooks to trigger an execution of your flow in Kestra. To do this, we can make a [trigger](../04.workflow-components/07.triggers/03.webhook-trigger.md) with the type `io.kestra.plugin.core.trigger.Webhook`.

Once we've done this, we can add a `key` property, which can be random as this will be used to trigger the webhook. In the example, the `key` is set to `1KERKzRQZSMtLdMdNI7Nkr` which is what we put at the end of our webhook URL to trigger it.

```yaml
id: webhook_example
namespace: company.team

description: |
  Example flow for a webhook trigger.

  This endpoint doesn't need any login / password and is secured by `key` that is different for every flow

tasks:
  - id: out
    type: io.kestra.plugin.core.debug.Return
    format: "{{ trigger | json }}"


triggers:
  - id: webhook_trigger
    type: io.kestra.plugin.core.trigger.Webhook
    # the required key to start this flow - might be passed as a secret
    key: 1KERKzRQZSMtLdMdNI7Nkr
```

The format of the Webhook URL follows:

`https://{your_hostname}/api/v1/executions/webhook/{namespace}/{flow_id}/{key}`
where:
- `your_hostname` is the domain or IP of your server, e.g. example.com
- `namespace` is `io.kestra.demo.flows`
- `flow_id` is `webhook_example`
- `key` is `1KERKzRQZSMtLdMdNI7Nkr`

With this information, you can test your flow by running the following command in the terminal to trigger the flow:

```bash
curl http://localhost:8080/api/v1/executions/webhook/company.team/webhook_example/1KERKzRQZSMtLdMdNI7Nkr
```

## Webhooks in Kestra EE

Let us leverage Kestra Secrets to store the webhook key. From the left navigation menu on the Kestra UI, navigate to `Namespaces`. Click on the namespace under which you want to create the flow with the webhook trigger. We will use `company.team` namespace for this example. On the corresponding namespace page, navigate to the `Secrets` tab. Click on the `New secret` button at the top, and create a new secret with `Key` as `WEBHOOK_KEY` (you may choose any appropriate name) and `Secret` as the webhook key value. Let us use `1KERKzRQZSMtLdMdNI7Nkr` for this example. Once you've done that, save the secret.

![navigate_to_secrets](/docs/how-to-guides/webhooks/navigate_to_secrets.png)

![assign_secret_value](/docs/how-to-guides/webhooks/assign_secret_value.png)

Now, we will create the flow in the same namespace under which we have defined the `WEBHOOK_KEY` secret. The flow will use the webhook trigger, like this:

```yaml
id: webhook_ee_example
namespace: company.team

description: |
  Example flow for a webhook trigger in Kestra EE.

  This endpoint doesn't need any login / password and is secured by `key` that is different for every flow

tasks:
  - id: out
    type: io.kestra.plugin.core.debug.Return
    format: "{{ trigger | json }}"

triggers:
  - id: webhook_trigger
    type: io.kestra.plugin.core.trigger.Webhook
    # the required key to start this flow - might be passed as a secret
    key: "{{ secret('WEBHOOK_KEY') }}"
```

Note that in the `triggers` section of the flow, we have referenced the secret in the `key` as `{{ secret('WEBHOOK_KEY') }}` instead of directly putting in the webhook key.

The format of the Webhook URL follows:

`https://{your_hostname}/api/v1/{tenant_id}/executions/webhook/{namespace}/{flow_id}/{key}`
where:
- `your_hostname` is the domain or IP of your server, e.g. example.com
- `tenant_id` is the tenant ID belonging to your Kestra EE account
- `namespace` is `company.team``
- `flow_id` is `webhook_ee_example`
- `key` is `1KERKzRQZSMtLdMdNI7Nkr`

With this information, you can test your flow by running the following command in the terminal to trigger the flow:

```bash
curl http://my.kestra.clod/api/v1/my_tenant/executions/webhook/company.team/webhook_eE_example/1KERKzRQZSMtLdMdNI7Nkr
```
