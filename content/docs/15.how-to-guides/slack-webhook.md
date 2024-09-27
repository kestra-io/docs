---
title: Slack Events API
icon: /docs/icons/slack.svg
stage: Getting Started
topics:
  - Integrations
---

Trigger Kestra flows based on Slack events.

The Slack Events API allows you to build apps that respond to events from Slack. For example, you can trigger a custom action anytime a user joins a channel or when someone reacts to a message with a specific emoji.

## Create a Slack App

To use the Slack Events API, you'll need to create a Slack app. You can do this from the [Slack API website](https://api.slack.com/apps).

First, click on the "Create New App" button:


![img.png](/docs/how-to-guides/slack-webhook/img.png)

Choose the option "From scratch":

![img_1.png](/docs/how-to-guides/slack-webhook/img_1.png)


Then, give your app a name and select the workspace where you want to install it:

![img_2.png](/docs/how-to-guides/slack-webhook/img_2.png)

Now, you need to enable the "Event Subscriptions" feature:

![img_3.png](/docs/how-to-guides/slack-webhook/img_3.png)

In the "Subscribe to bot events" section, you can add events you want to listen to.

![img_4.png](/docs/how-to-guides/slack-webhook/img_4.png)

For example, you can listen to the `app_mentions` and `reaction_added` events:

![img_5.png](/docs/how-to-guides/slack-webhook/img_5.png)

## Create a flow with a Webhook trigger

You can now create a Kestra flow that will listen to the events you've subscribed to:

```yaml
id: slack_events
namespace: prod

tasks:
  - id: process_slack_event
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.body }}"

triggers:
  - id: slack_event
    type: io.kestra.plugin.core.trigger.Webhook
    key: superStrongSecretKey42
```

::alert{type="warning"}
Note that the **webhook key** cannot contain any **special characters** — only letters and digits. Also, consider it as a secret that you should keep safe. You can use Kestra's [Secrets](../05.concepts/04.secret.md) to store it securely.
::

Now, the only part left is to create a simple app that will listen to Slack events and will forward them to your Kestra flow via the Webhook trigger.

We'll look at how to do this using Python and FastAPI. For deployments, we'll show two options:
1. Using Modal for easy deployment
2. Using ngrok to expose our local FastAPI server to the internet. You can replace ngrok for any other deployment method you prefer.

## Deploy a Slack app with Modal

First, sign up for a free account on [Modal](https://modal.com/). Then, go to your Settings:

![img_6.png](/docs/how-to-guides/slack-webhook/img_6.png)

And create a new API token:

![img_7.png](/docs/how-to-guides/slack-webhook/img_7.png)


You will see a similar command:

```bash
modal token set --token-id ak-zzzzzzzzz --token-secret as-zzzzzzzzz
```


Now, create the following flow in Kestra and replace the token ID and token secret with the ones you got from Modal. You can use Kestra's [Secrets](../05.concepts/04.secret.md) to store those securely. Also, make sure to replace `your_kestra_host` with your Kestra host URL in the `slack.py` file.


```yaml
id: slack_app
namespace: prod

tasks:
  - id: modal_slack_app
    type: io.kestra.plugin.modal.cli.ModalCLI
    commands:
      - modal deploy slack.py
    env:
      MODAL_TOKEN_ID: "{{ secret('MODAL_TOKEN_ID') }}"
      MODAL_TOKEN_SECRET: "{{ secret('MODAL_TOKEN_SECRET') }}"
    inputFiles:
      slack.py: |
        import logging
        from fastapi import FastAPI, Request, BackgroundTasks
        from fastapi.responses import JSONResponse
        from modal import Image, Stub, asgi_app
        import requests

        web_app = FastAPI()
        stub = Stub("slack_app")

        image = Image.debian_slim().pip_install("requests")

        logging.basicConfig(level=logging.INFO)
        logger = logging.getLogger(__name__)

        def process_event(event):
            # TODO adjust the URL below to your Kestra Webhook URL
            url = "http://your_kestra_host:8080/api/v1/executions/webhook/prod/slack_events/superStrongSecretKey42"
            headers = {"Content-Type": "application/json"}
            response = requests.post(url, headers=headers, json=event)
            logger.info(f"Forwarding event response: {response.status_code} - {response.text}")

        @web_app.post("/slack/events")
        async def slack_events(request: Request, background_tasks: BackgroundTasks):
            json_data = await request.json()

            if "challenge" in json_data:
                logger.info("Received Slack challenge event")
                return JSONResponse(content={"challenge": json_data["challenge"]})

            logger.info(f"Received event: {json_data}")

            # Process the event asynchronously
            background_tasks.add_task(process_event, json_data)

            # Respond immediately to Slack
            logger.info("Responding immediately to Slack")
            return JSONResponse(content={"status": "ok"})

        @stub.function(image=image)
        @asgi_app()
        def fastapi_app():
            return web_app
```

::alert{type="info"}
If you don't like adding the Python script inline in the YAML file, you can enable `namespaceFiles` and add the Python code in the embedded Code Editor in a separate file e.g. called `slack.py` and reference it in the flow as shown below:
```yaml
id: slack_app
namespace: prod

tasks:
  - id: modal_slack_app
    type: io.kestra.plugin.modal.cli.ModalCLI
    namespaceFiles:
      enabled: true
    commands:
      - modal deploy slack.py
    env:
      MODAL_TOKEN_ID: "{{ secret('MODAL_TOKEN_ID') }}"
      MODAL_TOKEN_SECRET: "{{ secret('MODAL_TOKEN_SECRET') }}"
```
![img_8.png](/docs/how-to-guides/slack-webhook/img_8.png)
::

Once you execute that flow, you will see the endpoint to your app in the logs:

![img_9.png](/docs/how-to-guides/slack-webhook/img_9.png)

Go back to Slack and add the URL to the "Request URL" field in the "Event Subscriptions" section. Make sure to add `slack/events` at the end of the URL, e.g.:

```bash
https://anna-geller--slack-app-fastapi-app.modal.run/slack/events
```

You should see the `Verified` message. Hit `Save Changes` and you're all set!

![img_10.png](/docs/how-to-guides/slack-webhook/img_10.png)

## Install the Slack app to a Workspace and test it

First, we need to install the app to the workspace. Go to "Install App" and click on "Install to Workspace":

![img_11.png](/docs/how-to-guides/slack-webhook/img_11.png)

![img_12.png](/docs/how-to-guides/slack-webhook/img_12.png)


Now you can test the integration by mentioning your app in a channel. For example, you can write a hello message `hello @kestra`:

![img_13.png](/docs/how-to-guides/slack-webhook/img_13.png)

Confirm to invite the app to the channel and congratulate yourself with the "Nicely done!" emoji 🙌:

![img_14.png](/docs/how-to-guides/slack-webhook/img_14.png)


You should see that both events (`app mention` and `reaction added`) have triggered an execution of your Kestra flow:

![img_15.png](/docs/how-to-guides/slack-webhook/img_15.png)

![img_16.png](/docs/how-to-guides/slack-webhook/img_16.png)

Now it's up to you to automate your daily operations with Slack and Kestra!

## Example automation: AI Chatbot

You can extend the `slack_events` flow to automate your daily business operations.

To do something more useful than just logging the Slack event, you can create a flow that listens to the `app_mention` event and responds to that message with a GPT-4 chatbot. First, create an incoming webhook in your Slack app:

![img_17.png](/docs/how-to-guides/slack-webhook/img_17.png)

![img_18.png](/docs/how-to-guides/slack-webhook/img_18.png)


Copy the webhook URL:

![img_19.png](/docs/how-to-guides/slack-webhook/img_19.png)

...and paste it into the `url` field of the `SlackIncomingWebhook` task in the flow below:

```yaml
id: slack_events
namespace: prod

tasks:
  - id: if_app_mention
    type: io.kestra.plugin.core.flow.If
    condition: "{{ trigger.body.event.type == 'app_mention' }}"
    then:
      - id: gpt
        type: io.kestra.plugin.openai.ChatCompletion
        apiKey: "{{ secret('OPENAI_API_KEY') }}"
        model: gpt-4-0125-preview
        messages:
          - role: system
            content: The user will refer to you as <@{{ trigger.body.authorizations[0].user_id }}>. You get a prompt from a user and provide a concise answer.
        prompt: "{{ trigger.body.event.text ?? null }}"

      - id: slack
        type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
        url: "{{ secret('SLACK_WEBHOOK_URL') }}"
        payload: |
          {"channel":"{{ trigger.body.event.channel }}","text":"{{ outputs.gpt.choices[0].message.content }}"}
    else:
      - id: other_events
        type: io.kestra.plugin.core.log.Log
        message: "{{ trigger.body }}"

triggers:
  - id: slack_event
    type: io.kestra.plugin.core.trigger.Webhook
    key: superStrongSecretKey42
```

And here is the result:

![img_20.png](/docs/how-to-guides/slack-webhook/img_20.png)

![img_21.png](/docs/how-to-guides/slack-webhook/img_21.png)

---

## Local testing with ngrok

If you don't want to host your app on Modal, you can use ngrok to expose your local server to the internet.

First, install ngrok:

```bash
brew install ngrok/ngrok/ngrok
```


Then, [sign up](https://ngrok.com/) for a free account and then authenticate your terminal, as explained in the [Getting Started guide](https://dashboard.ngrok.com/get-started/setup/):

```bash
ngrok config add-authtoken long_token_string
```

Create a FastAPI app in a file called `main.py`:

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import requests

app = FastAPI()


@app.post("/slack/events")
async def slack_events(request: Request):
    json_data = await request.json()

    # Slack URL Verification Challenge
    if "challenge" in json_data:
        return JSONResponse(content={"challenge": json_data["challenge"]})

    print("Received an event")
    print(json_data)

    # URL of your Kestra flow webhook
    url = "http://your_kestra_host:8080/api/v1/executions/webhook/prod/slack_events/superStrongSecretKey42"
    headers = {
        "Content-Type": "application/json",
    }

    response = requests.post(url, headers=headers, json=json_data)
    print(response.text)

    return JSONResponse(
        content={"status": response.status_code, "response": response.text}
    )
```

Then, set up your FastAPI server:

```bash
pip install fastapi uvicorn requests
uvicorn main:app --reload --port 3000
ngrok http http://localhost:3000
```

This will expose your local server to the internet. You should see a similar URL:

```bash
https://0913-31-18-152-123.ngrok-free.app
```

Go back to your Slack app and add the URL to the "Request URL" field in the "Event Subscriptions" section. Make sure to add `slack/events` at the end of the URL, e.g.:

```bash
https://0913-31-18-152-123.ngrok-free.app/slack/events
```

The rest of the process is the same as with Modal. You can now adjust the flow `slack_events` referenced in the FastAPI code and start automationg various processes based on Slack events.

## Other deployment options

You can deploy that Slack app in many other ways including:
- an on-prem VM
- a serverless approach with [AWS Lambda](https://www.youtube.com/watch?v=rpVLOVeky6A), Google Cloud Functions, or Azure Functions
- a containerized approach with AWS Fargate, Google Cloud Run, or Azure Container Instances
- a Kubernetes deployment.

And of course, you can use any other programming language and framework to build your Slack app. The only requirement is to forward the Slack events to your Kestra flow via the Webhook trigger.