---
title: How to Use Webhooks in Kestra
icon: /docs/icons/tutorial.svg
---

How to use a webhook to trigger a flow.

## What are Webhooks?

Webhooks are HTTP requests that are triggered by an event. These are useful for being able to tell another application to do something, such as starting the execution of a Flow inside of Kestra.

## Using Webhooks in Kestra

You can use webhooks to trigger an execution of your flow in Kestra. To do this, we can make a [trigger](/docs/workflow-components/triggers#webhook-trigger) with the type `io.kestra.core.models.triggers.types.Webhook`.

Once we've done this, we can add a `key` property, which can be random as this will be used to trigger the webhook. In the example, the `key` is set to `1KERKzRQZSMtLdMdNI7Nkr` which is what we put at the end of our webhook URL to trigger it.


```yaml file=public/examples/flows_webhook.yml
```

The format of the Webhook URL follows

`https://{your_hostname}/api/v1/executions/webhook/{namespace}/{flow_id}/{key}`
where:
- `your_hostname` is the domain or IP of your server, e.g. example.com 
- `namespace` is `io.kestra.demo.flows`
- `flow_id` is `webhook`
- `key` is `1KERKzRQZSMtLdMdNI7Nkr`

With this information, you can test your flow by running the following command in the terminal to trigger the flow:

```bash
curl http://localhost:8080/api/v1/executions/webhook/io.kestra.demo.flows/webhook/1KERKzRQZSMtLdMdNI7Nkr
```
