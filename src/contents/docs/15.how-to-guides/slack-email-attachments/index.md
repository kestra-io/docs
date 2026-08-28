---
title: "Send HTTP-downloaded Data as a Slack or Email Attachment"
h1: Extract Data via HTTP and Send It as a Slack or Email Attachment
icon: /src/contents/docs/icons/slack.svg
stage: Intermediate
topics:
  - Integrations
description: Download a file over HTTP and deliver it as a Slack file attachment or a Gmail email attachment in a single Kestra flow.
---

Extract a file from any HTTP source and deliver it straight to your team, either as a Slack attachment or as an email attachment.

A common pattern is to download a report or export from an external system and forward it to stakeholders without storing it anywhere in between. This guide shows both delivery options starting from the same [`Download`](https://kestra.io/plugins/tasks/http/io.kestra.plugin.core.http.download) task.

## Download the file over HTTP

The [`io.kestra.plugin.core.http.Download`](https://kestra.io/plugins/tasks/http/io.kestra.plugin.core.http.download) task fetches the file and stores it in Kestra's internal storage. Every following task references it via `{{ outputs.download.uri }}`.

```yaml
id: download_orders_csv
namespace: company.team

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv
```

## Option 1: send the file as a Slack attachment

:::alert{type="warning"}
`SlackIncomingWebhook` **cannot** send file attachments — that's a Slack API limitation, incoming webhooks only accept a JSON `payload` and don't support the `files.upload` endpoint. To attach a file, you need a Slack App with a bot token instead.
:::

### Create a Slack App with a bot token

1. Go to the [Slack API website](https://api.slack.com/apps) and create a new app "From scratch".
2. Under **OAuth & Permissions**, add the `files:write` Bot Token Scope (add `chat:write` too if you also want to post a message).
3. Install the app to your workspace and copy the **Bot User OAuth Token** (starts with `xoxb-`).
4. Invite the bot to the target channel: `/invite @your-app-name`.
5. Store the token as a Kestra [Secret](../../06.concepts/04.secret/index.md) called `SLACK_TOKEN`.

### Upload the file to a channel

Use the [`io.kestra.plugin.slack.app.files.Upload`](https://kestra.io/plugins/plugin-slack/io.kestra.plugin.slack.app.files.upload) task:

```yaml
id: send_report_to_slack
namespace: company.team

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: upload_to_slack
    type: io.kestra.plugin.slack.app.files.Upload
    token: "{{ secret('SLACK_TOKEN') }}"
    channels: ["#reports"]
    from: "{{ outputs.download.uri }}"
    filename: "orders.csv"
    title: "Daily orders export"
```

:::alert{type="info"}
`Upload` doesn't yet support attaching a text comment to the file in the same API call. If you want a message next to the file, post it first with [`io.kestra.plugin.slack.app.chats.Post`](https://kestra.io/plugins/plugin-slack/io.kestra.plugin.slack.app.chats.post) using the same `token` and channel, then run `Upload` right after:

```yaml
  - id: announce
    type: io.kestra.plugin.slack.app.chats.Post
    token: "{{ secret('SLACK_TOKEN') }}"
    channel: "#reports"
    messageText: "Here is today's orders export :point_down:"

  - id: upload_to_slack
    type: io.kestra.plugin.slack.app.files.Upload
    token: "{{ secret('SLACK_TOKEN') }}"
    channels: ["#reports"]
    from: "{{ outputs.download.uri }}"
    filename: "orders.csv"
```
:::

## Option 2: send the file as an email attachment via Gmail

Gmail's SMTP server accepts an [App Password](https://support.google.com/accounts/answer/185833) once 2-Step Verification is enabled on the account. Use it with the [`io.kestra.plugin.email.MailSend`](https://kestra.io/plugins/plugin-email/io.kestra.plugin.email.mailsend) task.

### Create a Gmail App Password

1. Enable **2-Step Verification** on the Google account, if not already enabled.
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), create a new app password (e.g. named "Kestra").
3. Store the generated 16-character password as a Kestra [Secret](../../06.concepts/04.secret/index.md) called `GMAIL_APP_PASSWORD`.

### Send the file as an attachment

```yaml
id: send_report_by_email
namespace: company.team

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: send_email
    type: io.kestra.plugin.email.MailSend
    host: smtp.gmail.com
    port: 587
    transportStrategy: SMTP_TLS
    username: "{{ secret('GMAIL_ADDRESS') }}"
    password: "{{ secret('GMAIL_APP_PASSWORD') }}"
    from: "{{ secret('GMAIL_ADDRESS') }}"
    to: team@company.com
    subject: "Daily orders export"
    htmlTextContent: "Please find today's orders export attached."
    attachments:
      - name: orders.csv
        uri: "{{ outputs.download.uri }}"
        contentType: text/csv
```

## Combine both in a single flow

Both delivery paths read from the same `download` output, so nothing stops you from running them side by side in one flow:

```yaml
id: distribute_orders_export
namespace: company.team

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: upload_to_slack
    type: io.kestra.plugin.slack.app.files.Upload
    token: "{{ secret('SLACK_TOKEN') }}"
    channels: ["#reports"]
    from: "{{ outputs.download.uri }}"
    filename: "orders.csv"
    title: "Daily orders export"

  - id: send_email
    type: io.kestra.plugin.email.MailSend
    host: smtp.gmail.com
    port: 587
    transportStrategy: SMTP_TLS
    username: "{{ secret('GMAIL_ADDRESS') }}"
    password: "{{ secret('GMAIL_APP_PASSWORD') }}"
    from: "{{ secret('GMAIL_ADDRESS') }}"
    to: team@company.com
    subject: "Daily orders export"
    htmlTextContent: "Please find today's orders export attached."
    attachments:
      - name: orders.csv
        uri: "{{ outputs.download.uri }}"
        contentType: text/csv

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 8 * * *"
```
