---
title: Notion Webhook Integration
icon: /docs/icons/notion.svg
stage: Getting Started
topics:
  - Integrations
  - Webhooks
---

Use Notion webhooks to trigger Kestra flows when pages or databases are updated in your Notion workspace.

This guide shows you how to create a workflow that responds to Notion database changes, retrieves page details, and sends notifications to Slack when new tasks are assigned.

## Prerequisites

Before you begin, you need:
- A Notion workspace with a database
- A [Notion integration](https://www.notion.so/my-integrations) with access to your database
- A Slack workspace with webhook capabilities ([Slack Webhook Documentation](https://api.slack.com/messaging/webhooks))
- Access to your Notion API token and Slack webhook URL

## Create a Notion integration

1. Go to [Notion's My Integrations page](https://www.notion.so/my-integrations)
2. Click **"New integration"**
3. Give your integration a name and select your workspace
4. Copy the **Internal Integration Token** - you'll need this for the `NOTION_API_KEY` secret

## Share your database with the integration

1. Open your Notion database
2. Click the **"..."** menu in the top right
3. Select **"Add connections"**
4. Find and select your integration
5. Click **"Confirm"** to grant access

## Set up secrets in Kestra

Store your sensitive credentials as [secrets](../06.concepts/04.secret.md) or [key-value](../06.concepts/05.kv-store.md) pairs:

1. Navigate to your namespace in the Kestra UI
2. Go to the **Secrets** tab (Alternatively go to the **KV Store** tab and do the same)
3. Create these secrets:
   - `NOTION_API_KEY`: Your Notion integration token
   - `SLACK_WEBHOOK_URL`: Your Slack incoming webhook URL

## Create the webhook flow

Create a flow that listens for Notion webhook events and processes them:

```yaml
id: notion-webhook
namespace: company.team

tasks:
  - id: get_notion_page_details
    type: io.kestra.plugin.notion.page.Read
    apiToken: "{{ secret('NOTION_API_KEY') }}"
    pageId: "{{ trigger.body.entity.id }}"

  - id: send_slack_alert
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    messageText: "New task titled {{ outputs.get_notion_page_details | jq('.properties.Button.title[0].text.content') | first }} assigned to {{ outputs.get_notion_page_details | jq('.properties.Assignee.multi_select[0].name') | first }} on the Product team Notion board! Link: {{ outputs.get_notion_page_details.url }}"

triggers:
  - id: notion_new_task_webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: my-notion-product-alert-key # Replace with a secure key
```

:::alert{type="warning"}
Replace `my-notion-product-alert-key` with a secure, randomly generated key. Consider storing this as a [secret](../06.concepts/04.secret.md) or [key-value pair](../06.concepts/05.kv-store.md) for better security.
:::

## Configure Notion webhooks

Set up webhooks directly in your Notion integration:

1. Go to your [Notion integration settings](https://www.notion.so/my-integrations)
2. Select your integration
3. Navigate to the **"Webhooks"** section
4. Click **"Add webhook"**
5. Enter your Kestra webhook URL (see format below)
6. Select the events you want to listen for:
   - `page.property_values.updated` - When page properties change
   - `page.created` - When new pages are created
   - `database.created` - When new databases are created
7. Click **"Create"** to save the webhook

![Notion Integration UI](/docs/how-to-guides/notion/kestra-webhook-notion.png)

For more details, see the [Notion Webhooks API documentation](https://developers.notion.com/reference/webhooks).

## Webhook URL format

Your Kestra webhook URL follows this pattern:

```
http://your-kestra-host:8080/api/v1/main/executions/webhook/{namespace}/{flow_id}/{key}
```

For this example:
- **Namespace**: `company.team`
- **Flow ID**: `notion-webhook`
- **Key**: `my-notion-product-alert-key`

Complete URL:
```
http://your-kestra-host:8080/api/v1/main/executions/webhook/company.team/notion-webhook/my-notion-product-alert-key
```

You can copy your webhook URL directly from the Kestra UI from the **Triggers** tab and paste it in Notion:

![Copy Webhook URL](/docs/how-to-guides/notion/copy-webhook-url.png)

## Testing the integration

Test your webhook flow manually:

```bash
curl -X POST \
  http://your-kestra-host:8080/api/v1/main/executions/webhook/company.team/notion-webhook/my-notion-product-alert-key \
  -H "Content-Type: application/json" \
  -d '{"entity": {"id": "your-notion-page-id"}}'
```

Replace `your-notion-page-id` with an actual page ID from your Notion database.

## Understanding the flow

The flow performs these steps:

1. **Webhook trigger**: Listens for incoming webhook requests from Notion on the specified endpoint
2. **Get page details**: Uses the [Notion plugin](/plugins/plugin-notion) to fetch complete page information from Notion
3. **Send notification**: Extracts the task title and assignee information, then sends a formatted message to Slack

## Customizing the flow

### Different Notion properties

Modify the Slack message to use different Notion properties. Common property types include:

```yaml
# For title properties
title: "{{ outputs.get_notion_page_details | jq('.properties.Title.title[0].text.content') | first }}"

# For select properties
status: "{{ outputs.get_notion_page_details | jq('.properties.Status.select.name') | first }}"

# For date properties
due_date: "{{ outputs.get_notion_page_details | jq('.properties.DueDate.date.start') | first }}"

# For people properties
assignee: "{{ outputs.get_notion_page_details | jq('.properties.Assignee.people[0].name') | first }}"
```

### Adding conditional logic

Add conditions to process only specific types of changes:

```yaml
tasks:
  - id: check_status
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.get_notion_page_details | jq('.properties.Status.select.name') | first == 'In Progress' }}"
    then:
      - id: send_slack_alert
        type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
        url: "{{ secret('SLACK_WEBHOOK_URL') }}"
        messageText: "Task moved to In Progress: {{ outputs.get_notion_page_details | jq('.properties.Title.title[0].text.content') | first }}"
```

### Multiple notification channels

Send notifications to different channels based on the assignee or project:

```yaml
tasks:
  - id: send_to_team_channel
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.get_notion_page_details | jq('.properties.Project.select.name') | first == 'Product' }}"
    then:
      - id: product_team_notification
        type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
        url: "{{ secret('PRODUCT_SLACK_WEBHOOK_URL') }}"
        messageText: "New product task assigned!"
    else:
      - id: general_notification
        type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
        url: "{{ secret('GENERAL_SLACK_WEBHOOK_URL') }}"
        messageText: "New task assigned!"
```

:::alert{type="info"}
Keep in mind that the above examples are additional tasks to add to the flow and not standalone flows. You need to add `id` and `namespace` properties to execute them standalone.
:::

## Security considerations

- Use strong, randomly generated webhook keys
- Store all sensitive tokens as [secrets](../06.concepts/04.secret.md) or [key-value pairs](../06.concepts/05.kv-store.md)
- Consider implementing request validation in your webhook handler
- Regularly rotate your API tokens and webhook URLs

## Related resources

- [Webhook triggers](../05.workflow-components/07.triggers/03.webhook-trigger.md)
- [Notion plugin documentation](https://kestra.io/plugins/plugin-notion)
- [Slack notifications](../15.how-to-guides/slack-webhook.md)
- [Secrets management](../06.concepts/04.secret.md)
- [Expression language guide](../06.concepts/06.pebble.md)