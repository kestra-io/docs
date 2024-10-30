---
title: Apps
icon: /docs/icons/kestra.svg
editions: ["EE"]
version: ">= 0.20.0"
---

Build custom UIs to interact with Kestra from the outside world.

## Overview

Apps let you use your Kestra workflows as the backend for custom applications. Within each app, you can specify custom frontend blocks, such as forms for data entry, output displays, approval buttons, or markdown blocks. **Flows** act as the **backend**, processing data and executing tasks, while Apps serve as frontend, allowing anyone to interact with your workflows regardless of their technical background. Business users can trigger new workflow executions, manually approve workflows that are paused, submit data to automated processes using simple forms, and view the execution results.

You can think of Apps as **custom UIs for flows**, allowing your users to interact with Kestra from the outside world.

You can build custom applications that resume paused workflows waiting for approval, or interact with Kestra’s API. In short, Apps allow you and your users to interact with Kestra from the outside world.

---

## App Types

Currently, Kestra offers two types of Apps:
- **Form Apps**: these apps allow you to create forms that can trigger workflows with input parameters. For example, a form might allow users to specify resources that need to be provisioned, and their inputs will feed directly into a workflow that automatically provisions those resources.
- **Approval Apps**: these apps enable forms for approving or rejecting paused workflows. Using the same example, an approval app could be used to either approve or reject a request for provisioning resources. Depending on the decision, the workflow will either resume and provision the resources, or stop.

More types of apps are on the roadmap, such as apps to interact with the KV store, or trigger other actions using Kestra’s API. If you have a specific use case in mind, we’d love to hear about it!

---

## How Apps Help

Apps offer custom UIs on top of your Kestra workflows. Often, workflows are designed for non-technical users, and creating custom frontends for each of these workflows can be a lot of work. Imagine having to build and serve a frontend, connect it to Kestra’s API, validate user inputs, handle responses, manage workflow outputs, and deal with authentication and authorization — all from scratch. **With Apps, you can generate a custom UI for any flow in seconds, and let Kestra handle the heavy lifting.**

Here are some common scenarios where a custom UI is useful:

- **Manual Approval**: workflows that need manual approval, such as provisioning resources, granting access to services, deploying apps, validating data results, or reviewing AI-generated outputs.
- **Report Generation**: workflows where business users request data and receive a downloadable CSV or Excel file.
- **IT Helpdesk**: workflows that accept bug reports, feature requests, or other tickets, and automatically forward the ticket to the relevant team.
- **User Feedback & Signups**: workflows that collect feedback or allow users to sign up for events or email lists.
- **Data Entry**: workflows where business users enter data that is processed and either sent back to them or stored in a database.

In short, Apps make it easy to turn your Kestra workflows into simple applications that anyone can use.

---

## Creating Apps in Code

To create a new app, go to the `Apps` page in the main UI and click the `+ Create` button. Add your app configuration as code and click on `Save`.

### Example: App to Start a New Execution

Here’s a simple configuration for a form app that triggers a new workflow execution when submitted:

```yaml
id: compute_resources_form
type: io.kestra.plugin.ee.apps.forms.CreateExecution
displayName: Compute Resources Request
namespace: company.team
flowId: request_resources
access:
  type: PRIVATE
```

To see all available properties to configure this app type, expand the example below.

::collapse{title="Complete Configuration for a Form App"}

```yaml
id: compute_resources_form
type: io.kestra.plugin.ee.apps.forms.CreateExecution
namespace: company.team
flowId: request_resources
displayName: Compute Resources Request
template:
  theme: DARK # AUTO, LIGHT, future: LEROYMERLIN
  header:
    image: "kestra://" # TBD how to manage this
  footer:
    enabled: false

layout:
  - on: START
    blocks:
      - type: io.kestra.ee.app.blocks.Markdown
        content: |
          # Compute Resources Request
          Submit a request for resources by filling out the form below.

      - type: io.kestra.plugin.ee.apps.blocks.CreateExecutionForm

      - type: io.kestra.plugin.ee.apps.blocks.CreateExecutionButton
        text: Submit
        color: purple # TBD whether style is needed instead

  - on: RUNNING
    blocks:
      - type: io.kestra.ee.app.blocks.Markdown
        content: |
          ### Your request is now being processed.
          "Please don't close this window. The results will be displayed as soon as the processing is complete."

      - type: io.kestra.plugin.ee.apps.blocks.CancelExecutionButton
        text: Cancel the submission
        color: red

  - on: SUCCESS
    blocks:
      - type: io.kestra.ee.app.blocks.Markdown
        content: |
          ### The results are ready!
          Download the file below to view the report.

      - type: io.kestra.plugin.ee.apps.blocks.ExecutionOutputs # FlowOuputs? DisplayOutputs?
        filter: # optional, can be skipped
          include: [] # no extra "s" please, just include/exclude
          exclude: []

  - on: FAILURE
    blocks:
      - type: io.kestra.ee.app.blocks.Markdown
        content: |
          ### Oops, something went wrong!
          "You are about to be redirected to our documentation in a few seconds!"

      - type: io.kestra.plugin.ee.apps.blocks.RedirectTo
        uri: https://kestra.io/docs
        delay: PT5S

  - on: PAUSE
    condition: "{{ execution.taskId == 'mypausetask' }}"
    blocks:
      - type: io.kestra.ee.app.blocks.Markdown
        content: |
          ## Please validate the request
          Inspect the logs and outputs below. Then, approve or reject the request.
      - type: io.kestra.core.apps.ui.execution.ExecutionLogs
        filter:
          logLevel: INFO
          taskIds: [] # optional, if not set, show all
      - type: io.kestra.plugin.ee.apps.blocks.FlowResumeForm

      - type: io.kestra.plugin.ee.apps.blocks.FlowResumeButton
        text: "Continue"
        style: DEFAULT

      - type: io.kestra.plugin.ee.apps.blocks.FlowCancelButton
        text: "Cancel"
        style: DANGER

access:
  type: PRIVATE
  # groups: ["DevOps"] # future scope

tags:
  - DevOps
  - myteam
  - myproject
```
::

### Example: App to Resume a Paused Execution

Below is a simple configuration for an approval app:

```yaml
id: compute_resources_form
type: io.kestra.plugin.ee.apps.forms.ResumeExecution
displayName: Compute Resources — Approval Request
namespace: company.team
flowId: request_resources
access:
  type: PRIVATE
```

To explore all the available properties for configuring an approval app, you can expand the example below.

::collapse{title="Complete Configuration for an Approval App"}

```yaml
id: compute_resources_form
namespace: company.team
flowId: request_resources
flowRevision: latest # optional
displayName: Approve or Reject Compute Resources Request
disabled: false
type: io.kestra.plugin.ee.apps.forms.ResumeExecution
layout: # optional
  - on: PAUSE
    condition: "{{ execution.taskId == 'mypausetask' }}"
    blocks:
      - type: io.kestra.ee.app.blocks.Markdown
        content: |
          ## Please validate the request
          Inspect the logs and outputs below. Then, approve or reject the request.

      - type: io.kestra.plugin.ee.apps.blocks.ExecutionInputs
        filter: # optional, can be skipped
          include: []
          exclude: []

      - type: io.kestra.core.apps.ui.execution.ExecutionLogs
        filter:
          logLevel: INFO
          taskIds: [] # optional, if not set, show all

      - type: io.kestra.plugin.ee.apps.blocks.ExecutionOutputs # FlowOuputs? DisplayOutputs?
        filter: # optional, can be skipped
          include: []
          exclude: []

      - type: io.kestra.plugin.ee.apps.blocks.FlowResumeForm

      - type: io.kestra.plugin.ee.apps.blocks.FlowResumeButton
        text: Approve
        style: SUCCESS

      - type: io.kestra.plugin.ee.apps.blocks.FlowCancelButton
        text: Reject
        style: DANGER

  - on: RESUME
    blocks:
      - type: io.kestra.ee.app.blocks.Markdown
        content: |
          ## Thank you for validating the request.
          Your response is now being processed.

          Please don't close this window. The results will be displayed as soon as the processing is complete.

  - on: SUCCESS
    blocks:
      - type: io.kestra.ee.app.blocks.Markdown
        content: |
          ### The results are ready!
          Inspect the outputs below.

      - type: io.kestra.plugin.ee.apps.blocks.ExecutionOutputs # FlowOuputs? DisplayOutputs?
        filter: # optional, can be skipped
          include: [] # no extra "s" please, just include/exclude
          exclude: []

expiration:
  type: TTL # enum: TTL | DATE | LIMIT -- can be extended in the future if needed
  ttl: PT30D
  date: "2024-12-24"
  limit: 100
onSubmitAction:
  type: DISPLAY_OUTPUTS # enum: DISPLAY_TEXT | DISPLAY_OUTPUTS | REDIRECT_TO
  redirectTo:
    url: "https://example.com/thank-you"
access:
  type: PRIVATE
  # groups: ["DevOps"] # future scope
tags:
  - DevOps
  - myteam
  - myproject
```
::

---

## App Catalog

The App Catalog is where users can find available apps. You can filter apps by name, type, namespace, or tags. From this page, you can also create new apps, edit existing ones, and temporarily disable or delete apps.

![apps_catalog](/docs/enterprise/apps/apps_catalog.png)

---

## App Tags

You can add custom tags to organize and filter apps in the App Catalog. For example, you might tag apps with `DevOps`, `data-team`, `project-x`. You can then filter apps by tags to quickly find the apps you are looking for.

---

## App URL

Each app has a unique URL that you can share with others. When someone opens the URL, they will see the app and can submit requests. You can share the URL with team members, customers, or partners to let them interact with your Kestra workflows.

The basic structure of an app URL is:
`https://yourHost/ui/tenantId/apps/appId?key=LONGRANDOM`.

For example, if the app ID is `compute-resources-form` and it's created within `kestra-tech` tenant, the URL will look like:
`https://demo.kestra.io/ui/production/apps/compute-resources-form?key=LONGRANDOM`.

---

## App Access and RBAC Permissions

For each app, you can set the access level to either `PUBLIC` or `PRIVATE`.

### Public Access

When an app is set to `PUBLIC`, anyone with the URL can access the form and submit requests. This is ideal for situations where the app needs to be widely available to collect user feedback or conduct a survey. You can share the app URL on social media, embed it within your website, or send it via email.

---

## Private Access for Using Apps

When an app is set to `PRIVATE`, only users with the `APPEXECUTION` RBAC permission can submit requests. This setup works well when you want to allow a specific group (such as business stakeholders or external partners) to use the app without giving them direct access to the Kestra UI. You can invite these users to a specific Kestra tenant, where they’ll only see the App Catalog, optionally restricted to apps in a specific namespace. This fine-grained access control ensures that only authorized users can access and use the apps.

## Private Access for Building Apps

The `APP` RBAC permission controls who can create, read, update, or delete apps within a tenant. This permission can also be restricted to specific namespaces. Unlike the `APPEXECUTION` permission which governs the ability to submit requests using apps, the `APP` permission manages the ability to build, modify, and delete apps.

---

## Expiration

For each app, you can set an expiration date (`expiration.endDate`) when you know exactly how long the app should be available. Once the date passes, the app will no longer be accessible.

You can also determine a time period (`expiration.startDate` and `expiration.endDate`) during which the app should be available.

For example, if you’re collecting feedback on a new feature, you can set the form app to be available starting on a release date and ending after being live for a week. Both the start and end dates are optional, so you can:
- let the app be active indefinitely with no start or end date
- let the app be active indefinitely but starting from a specific start date (e.g. `"2026-01-01"`) with no end date
- let the app be active for a predetermined period starting from a given start date and ending on a specific end date
- let the app be active for a predetermined period but only specifying the end date.

---

## App Theme Templates

Kestra offers multiple templates to style your app. At the time of writing, the available templates include `SYSTEM`, `LIGHT`, and `DARK` themes. You can choose the theme that best fits your app’s design and branding.

---

## App Executions

Each time a user creates an execution by submitting a form in the app, a new execution is generated with the system label `system.app` and a value of `yourAppId`. For example, to filter all executions created by the `computeResourcesForm` app, you can search for `system.app:computeResourcesForm` in the label filter.

For every execution, you can track the user inputs, see the current state, view logs, and check the outputs — all from the Kestra UI. This lets you observe, troubleshoot and manage issues with your apps just as you would with any other workflow execution in Kestra.

---

## App Layout Blocks

Each app is made up of blocks that define the layout and content of the app. You can add blocks for markdown text, forms, buttons, logs, inputs, outputs, and more. The blocks are displayed in a specific order based on the app’s state (e.g. `START`, `RUNNING`, `SUCCESS`, `FAILURE`, `PAUSE`, `RESUME`).

By combining different blocks, you can create a custom UI that guides users through the app’s workflow. For example, you could start with a markdown block that explains the purpose of the app, followed by a form block for users to enter their inputs, and a button block to submit the request. You can also add blocks to display execution logs, outputs, and buttons for approving or rejecting paused workflows.

In terms of customization, you can define custom text, color, and style of buttons within the form, as well as the messages displayed before and after submissions.

