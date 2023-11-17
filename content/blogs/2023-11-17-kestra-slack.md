---
title: "Kestra and Slack: How to Send Notification Messages from Your Flows"
description: "How can you send a Slack notification when your Kestra flow succeeds or fails? Let's go over our Kestra Slack integration plugin."
date: 2023-11-17T08:00:00
category: Solutions
author:
  name: Dario Radecic
  image: "dradecic"
image:
---

Many companies, ours included, use Slack on a daily basis as a **communication tool**. However, using the platform only for messaging utilizes only a small portion of its potential. 

For example, Slack allows you to use their [free API](https://api.slack.com/) if you want to develop **custom applications** for the platform, and it also allows you to work with [Incoming Webbooks](https://api.slack.com/messaging/webhooks) for those that want to **send notifications** to Slack from other services.

That's where [Kestra](https://github.com/kestra-io/kestra) chimes in - our platform now has full support for sending Slack notifications directly from your flows. You can also create an **automated trigger** that will inform you when an executed Kestra flow ends up in a certain state, such as `WARNING`, or `FAILURE`.

You'll learn all about that - and many things more - in today's article. But first, let's go a bit deeper into the importance of automated notification messages.

---

## Why Your Business Should Care About Automated Notification Messages
Telling you that most companies, yours probably included, use a couple or even dozens of applications in their line of work is old news. You already know that. 

But what's probably new to you is the fact you can use your messaging platform of choice - such as Slack - and configure it as a one-stop hub for automated notification messages. For example, you could configure your other business applications (provided they offer a Slack integration), to send messages to dedicated Slack channels when something fails. This way, **you don't have to manually monitor dozens of systems**, and you can shift your efforts someplace else.

Here are a couple of reasons why your business should care about automated notification messages:
- **Real-time updates and for minimizing downtime** - Imagine one of your production services fails for whatever reason. Hours go by, and you don't have a clue about it until customer messages start coming in. Automated notifications, sent to the right team, can help you minimize downtime and the amount of angry customers - and in the end, minimize revenue loss.
- **Error notifications and enhanced exception handling** - Let's say you have an e-commerce platform and your customers are experiencing issues with the payment gateway. Automated messages sent to an IT team via Slack can allow them to react to the issue immediately, instead of waiting for customers to start reporting errors on your platform.
- **Reduced manual oversight** - If your company uses dozens of services to keep the business up and running, who will monitor those services? You can easily set up automated notifications to let you know if something somewhere fails or isn't behaving as expected.
- **Customizable department-agnostic alerts** - Different departments require different information in order to react to an issue. Automated Slack notifications allow you to send messages to different channels, and customize the message in a way that shows all relevant info needed to take action.

It's just the tip of the iceberg, but you get the point by now - there's no reason not to automate notification messages.

**But what's the first step to allow sending notifications to Slack?** Let's explore incoming webhooks next.



## Kestra Slack Integration: Step-by-Step Configuration
This section will walk you through the process of configuring a new Incoming Webhook on Slack. It's assumed you have administrator privileges on Slack, you've [created a custom Slack app](https://api.slack.com/apps), and you've [enabled incoming webhooks](https://api.slack.com/apps) through the application's settings.

As soon as that's out of the way, you'll be able to connect your Slack app (ours is named *Notification Service*) to your workspace (*Test Workspace* in our case), and allow it to make posts to a channel of choice (ours is *#kestra-notifications*):

![Image 1 - Creating a new incoming webhook](/blogs/2023-11-17-kestra-slack/1.png)

Clicking on the "Allow" button will redirect you to a page from which you can copy the **Webhook URL**. This URL will be needed in all of your Kestra flow that will send notifications to Slack:

![Image 2 - Webhook URL](/blogs/2023-11-17-kestra-slack/2.png)

When it comes to Kestra, the best practice is to [base64 encode](https://www.base64encode.org/) this URL and put it in `docker-compose.yml` file in the `environment` section. By doing this, you'll be able to reference the URL value from multiple Kestra flows, without hardcoding it:

![Image 3 - Including the webhook URL in Docker Compose](/blogs/2023-11-17-kestra-slack/3.png)

Note how the variable is prefixed with `SECRET` - that's a requirement on Kestra's end. You'll access the value in your flows by calling `"{{ secret('SLACK_WEBHOOK') }}"`. More about that in the following section.

If you're using the [Enterprise edition](https://kestra.io/enterprise) of Kestra, you can **manage secret keys directly from the Kestra UI**, which is less tedious and time-consuming.

You now have everything needed to start sending Kestra notifications to Slack. We'll show you a couple of examples in the following section.



## Kestra Slack Examples: How to Automate Sending Notification Messages
In this section, you'll see three examples of sending Slack notifications through Kestra:
- Directly as a task in a flow
- Directly as a task in a flow with an option to handle errors
- Automated for all Kestra flows as a trigger

Let's start with the first one.


### Example 1: Sending a Simple Notification
Our `io.kestra.plugin.notifications.slack.SlackIncomingWebhook` plugin allows you to connect to your Slack Webhook URL and send the message specified in the `payload` parameter.

Remember that the Webhook URL was stored as a secret in the previous section, and that you can access it through `"{{ secret('SLACK_WEBHOOK') }}"`.

As for the value for the `payload` parameter, it expects is JSON object, with the keys being `channel` and `text`. The prior determines to which Slack channel your message will be sent, and the latter controls the content of the message.

Note that you can **access various flow properties**, such as `namespace`, `id`, and even the properties of a single flow execution. This is vital information since without it, you would just know that a notification was sent from Kestra, and nothing else:

```yaml
id: slack-simple-message
namespace: dev

tasks:
  - id: slack
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    payload: |
      {
        "channel": "#kestra-notifications",
        "text": "Hello from Kestra! Flow {{ flow.namespace }}.{{ flow.id }} started with execution {{ execution.id }}"
      }
```

This is what your editor should look like:

![Image 4 - Editor contents](/blogs/2023-11-17-kestra-slack/4.png)

You can now save the flow and run it by clicking on the "Execute" button in the top right corner of the Kestra editor. You'll be redirected to a screen that shows a Gantt overview of flow execution. Green-colored bar means the task has finished successfully:

![Image 5 - Flow execution logs](/blogs/2023-11-17-kestra-slack/5.png)

If you open your channel in Slack, you'll see that a notification was successfully sent from Kestra:

![Image 6 - Notification in Slack sent by Kestra](/blogs/2023-11-17-kestra-slack/6.png)

The `execution.id` matches in Kestra UI and Slack, meaning you know exactly which flow execution was responsible for sending the notification.

This is good for a basic use case, but **how can you handle errors in flow execution?** Let's cover that next.



### Example 2: Handling Notification When a Kestra Flow Fails
In addition to handling notifications directly, you can also send them if an error occurs in one or more tasks of your Kestra flow.

The way to do this is to add a new section below `tasks` named `errors`. The syntax here is identical to how you would structure your `tasks`, but this block will only run if an error occurs in your flow.

For demonstration, we'll send a notification to Slack (like the one in the previous section), and then run a Python task via the `io.kestra.plugin.scripts.python.Script` plugin. The thing is, **this Python task will always fail**, since it tries to import a library that doesn't exist. As soon as it does, the `errors.slackErrorMessage` logic will be executed, and another message will be sent to Slack.

Anyhow, here's the code for our new Kestra flow:

```yaml
id: slack-error-message
namespace: dev

tasks:
  - id: slack
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    payload: |
      {
        "channel": "#kestra-notifications",
        "text": "Flow {{ flow.namespace }}.{{ flow.id }} started with execution {{ execution.id }} - Running the Python script next..."
      }

  - id: pythonScriptThatWillFail
    type: io.kestra.plugin.scripts.python.Script
    warningOnStdErr: false
    script: |
      import non_existing_library

errors:
  - id: slackErrorMessage
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    payload: |
      {
        "channel": "#kestra-notifications",
        "text": "Flow {{ flow.namespace }}.{{ flow.id }} with execution ID {{ execution.id }} failed executing the Python script!"
      }
```

You should see the following in your editor:

![Image 7 - Editor contents](/blogs/2023-11-17-kestra-slack/7.png)

Save the flow and run it - you'll see that tasks 1 and 3 (responsible for sending notifications) succeded, and that task 2 (Python script) failed:

![Image 8 - Execution flow with one failed task](/blogs/2023-11-17-kestra-slack/8.png)

Just what we wanted! If you open Slack once again, you'll see that you have two new messages in your channel:

![Image 9 - Slack notifications sent by Kestra](/blogs/2023-11-17-kestra-slack/9.png)

And that's how you can attach a so-called "error handler" to a single Kestra flow. 

Doing this for all of your flows is somewhat **redundant**, and adds additional complexity and length to your existing YAML files. Let's go over a better approach next.



### Example 3: Automating Warning and Failed Messages
The optimal way to handle different execution states across all your flows is to create a new flow that includes a task with the `io.kestra.plugin.notifications.slack.SlackExecution` plugin and a trigger.

The trigger, at least the one we'll write here, will monitor the status of your flow. If the status is either `FAILED` or `WARNING`, it will trigger a `sendNotification` task that uses the `io.kestra.plugin.notifications.slack.SlackExecution` plugin.

This task will send a Slack message with detailed execution information, including a link to the execution page in Kestra UI, execution ID, namespace, flow name, start date, duration, and the final execution status. In plain English, it provides a **more robust and detailed** set of information to the receiving end.

Here's the code needed to implement this flow:

```yaml
id: slack-generic
namespace: dev

tasks:
  - id: sendNotification
    type: io.kestra.plugin.notifications.slack.SlackExecution
    url: "{{ secret('SLACK_WEBHOOK') }}"
    channel: "#kestra-notifications"
    executionId: "{{trigger.executionId}}"

triggers:
  - id: listen
    type: io.kestra.core.models.triggers.types.Flow
    conditions:
      - type: io.kestra.core.models.conditions.types.ExecutionStatusCondition
        in:
          - FAILED
          - WARNING
```

Here's what your editor should look like:

![Image 10 - Editor contents](/blogs/2023-11-17-kestra-slack/10.png)

Just save the flow now - **no need to run it**.

To demonstrate what happens when a flow execution fails, we'll create another flow that runs a Python script. This script wants to import a library that doesn't exist, which will always result in an error:

```yaml
id: failing-task
namespace: dev

tasks:
  - id: pythonScriptThatWillFail
    type: io.kestra.plugin.scripts.python.Script
    warningOnStdErr: false
    script: |
      import non_existing_library
```

Note how Slack messaging or error handling isn't implemented in this flow - and that's the point!

This is what your editor should look like:

![Image 11 - Editor contents](/blogs/2023-11-17-kestra-slack/11.png)

Now run this flow, and you'll get to the page in which you can see the execution has failed:

![Image 12 - Running the Kestra flow](/blogs/2023-11-17-kestra-slack/12.png)

At the same time, you get a detailed Slack message that shows you which task in which flow has caused an error. You can also see values for the namespace, execution ID, flow ID, and the end status:

![Image 13 - Task failure detail notification sent to Slack](/blogs/2023-11-17-kestra-slack/13.png)

Clicking on the "Details" button will open up a new window in Kestra UI, showing you a detailed overview of the flow execution. The "Logs" tab is particularly useful in this case since it shows the actual **Python error**:

![Image 14 - Workflow run failure details](/blogs/2023-11-17-kestra-slack/14.png)

To recap, `io.kestra.plugin.notifications.slack.SlackExecution` plugin with a trigger allows you to automate sending Slack notifications on certain conditions (status of a task, for example), without you having to implement the notification logic manually in your flows.

---

## Summing up Kestra and Slack Integration
Long story short, implementing automated notifications sent to platforms like Slack is a guaranteed way to **save significant time long-term**, and also allow you to put your efforts into areas of work that can't be automated. The only **downside** is the time required to implement automated notifications. 

Luckily for Kestra users, it's just a couple of minutes of work, especially if you opt for the approach explained in Example #3.

We also offer integrations for other messaging platforms, so make sure to stay tuned to [Kestra blog](https://kestra.io/blogs) to learn more about them.

You're also welcome to subscribe to our newsletter for more guides on modern orchestration, automation, and trends in data management, as well as new features in our platform.

Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance. Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.