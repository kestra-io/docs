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

### App to create a new execution
Apps serve as custom UIs for workflows, so you need to first create a flow. Here is a simple configuration for a paremtrized flow that logs a message when triggered:

```yaml
id: myflow
namespace: company.team

inputs:
  - id: user
    type: STRING
    defaults: World

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello {{ inputs.user }}
```

Below is a simple configuration for a form app that triggers a new workflow execution when submitted.

::collapse{title="App to start a new execution"}
```yaml
id: hello_world_app
type: io.kestra.plugin.ee.apps.Execution
displayName: Create Execution for myflow
description: This app allows you to execute a simple flow and display execution logs.
namespace: company.team
flowId: myflow
access: PUBLIC
tags:
  - Getting Started

layout:
  - on: OPEN
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ## Create a new execution
          Pass custom input value and execute the flow

      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionForm
      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionButton
        text: Execute
        style: DEFAULT

  - on: RUNNING
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ## Execution is running

      - type: io.kestra.ee.apps.blocks.Loading

      - type: io.kestra.plugin.ee.apps.execution.blocks.Logs

      - type: io.kestra.plugin.ee.apps.execution.blocks.CancelExecutionButton
        text: Cancel
        style: WARNING

  - on: SUCCESS
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ## Execution finished

      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          Full execution logs:

      - type: io.kestra.plugin.ee.apps.execution.blocks.Logs

      - type: io.kestra.ee.apps.blocks.Button
        text: More examples
        url: https://github.com/kestra-io/examples/tree/main/apps
        style: INFO
```
::

This app is `PUBLIC`, so anyone with the URL can access it without requiring login. Alternatively, you can set the `access` type to `PRIVATE` to restrict the app only to specific users.
This app is perfect for building **public forms** that anyone in the world can access.

### More examples

Below you can find more examples of apps that you can create in Kestra.

::collapse{title="App to request and download data"}

Let's create a flow that fetches the relevant dataset based on user input:

```yaml
id: get_data
namespace: company.team

inputs:
  - id: data
    displayName: Select data to download
    type: SELECT
    values: [customers, employees, products, stores, suppliers]
    defaults: customers

  - id: startDate
    displayName: Start date for your dataset
    type: DATE
    defaults: 2024-12-03

tasks:
  - id: extract
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/resolve/main/ion/{{ inputs.data }}.ion

outputs:
  - id: Data
    type: FILE
    value: "{{ outputs.extract.uri }}"
```

Now, from the Apps page, you can create a new app that allows users to select the data they want to download:

```yaml
id: report_request_form
type: io.kestra.plugin.ee.apps.Execution
displayName: Form to request and download data
namespace: company.team
flowId: get_data
access: PRIVATE
tags:
  - Reporting
  - Analytics

layout:
  - on: OPEN
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ## Request data
          Select the dataset you want to download.

      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionForm
      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionButton
        text: Submit

  - on: RUNNING
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ## Fetching your data...
          Don't close this window. The results will be displayed as soon as the processing is complete.

      - type: io.kestra.ee.apps.blocks.Loading
      - type: io.kestra.plugin.ee.apps.execution.blocks.Logs
      - type: io.kestra.plugin.ee.apps.execution.blocks.CancelExecutionButton
        text: Cancel request

  - on: SUCCESS
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ## Request processed successfully
          You requested the following dataset:

      - type: io.kestra.plugin.ee.apps.execution.blocks.Inputs

      - type: io.kestra.ee.apps.blocks.Alert
        style: SUCCESS
        showIcon: true
        content: Your data is ready for download!

      - type: io.kestra.plugin.ee.apps.execution.blocks.Outputs

      - type: io.kestra.ee.apps.blocks.Markdown
        content: Find more App examples in the linked repository

      - type: io.kestra.ee.apps.blocks.Button
        text: App examples
        url: https://github.com/kestra-io/examples/tree/main/apps
        style: INFO

      - type: io.kestra.ee.apps.blocks.Button
        text: Submit new request
        url: https://preview-ee-kafka.kestra.io/ui/release/apps/3vT2LpMsQmHiLYyADF1kE9
        style: DEFAULT
```

This app is perfect for reporting and analytics use cases where users can request data and download the results.
::

::collapse{title="App to request compute resources and get them approved"}

Here is a flow simulating a request for resources that needs manual approval:

```yaml
id: request_resources
namespace: company.team

variables:
  slack_message: >
    New form submission! Click on the Resume button here to approve or reject the request {{ appLink('myApp') }}

inputs:
  - id: resource_type
    displayName: Resource Type
    type: SELECT
    required: true
    values: ["Access permissions", "SaaS application", "Development tool", "Cloud VM"]

  - id: access_permissions
    displayName: Access Permissions
    type: SELECT
    values: ["Admin", "Developer", "Editor", "Launcher", "Viewer"]
    allowCustomValue: true
    dependsOn:
      inputs:
        - resource_type
      condition: "{{ inputs.resource_type equals 'Access permissions' }}"

  - id: saas_applications
    displayName: SaaS Applications
    type: MULTISELECT
    values: ["Slack", "Notion", "HubSpot", "GitHub", "Jira"]
    allowCustomValue: true
    dependsOn:
      inputs:
        - resource_type
      condition: "{{ inputs.resource_type equals 'SaaS applications' }}"

  - id: development_tools
    displayName: Development Tool
    type: SELECT
    values: ["Cursor", "IntelliJ IDEA", "PyCharm Professional", "Datagrip"]
    allowCustomValue: true
    dependsOn:
      inputs:
        - resource_type
      condition: "{{ inputs.resource_type equals 'Development tool' }}"

  - id: cloud_provider
    displayName: Cloud Provider
    type: SELECT
    values: ["AWS", "GCP", "Azure"]
    allowCustomValue: true
    dependsOn:
      inputs:
        - resource_type
      condition: "{{ inputs.resource_type equals 'Cloud VM' }}"

  - id: deadline
    type: DATE
    displayName: Deadline for the resources

  - id: comment
    type: STRING
    displayName: Provide details about the resources you need

tasks:
  - id: get_service_catalog
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/resolve/main/ion/catalog.ion

  - id: send_approval_request
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: https://reqres.in/api/slack
    payload: |
      {
        "channel": "#devops",
        "text": {{ render(vars.slack_message) | toJson }}
      }

  - id: wait_for_approval
    type: io.kestra.plugin.core.flow.Pause
    onResume:
      - id: provisioning_status
        description: Whether the resources were able to be provisioned
        type: BOOLEAN
        defaults: true
        displayName: Provisioning Status

      - id: comment
        description: Extra comments about the provisioned resources
        type: STRING
        defaults: All requested resources have been provisioned
        displayName: Approval Comment

  - id: approve
    type: io.kestra.plugin.core.http.Request
    uri: https://reqres.in/api/resources
    method: POST
    contentType: application/json
    body: "{{ inputs }}"

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: |
      Status of the request {{ outputs.wait_for_approval.onResume.comment }}.
      Process finished with {{ outputs.approve.body }}.

outputs:
  - id: catalog
    type: FILE
    value: "{{ outputs.get_service_catalog.uri }}"
```

Below is a comprehensive example of a compute resources approval app.

```yaml
id: compute_resources_approval
type: io.kestra.plugin.ee.apps.Execution
displayName: Resource request form
namespace: company.team
flowId: request_resources
access: PRIVATE
tags:
  - Platform Team
  - Infrastructure

layout:
  - on: OPEN
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ## Compute Resources Request Form
          Fill out the form below to request compute resources.
          Make sure to include the deadline by which the resources should be provisioned.

      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionForm

      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionButton
        text: Submit
        style: DEFAULT

  - on: CREATED
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ## Thank you for your submission!
          Your request is now forwarded to the DevOps team for approval.

      - type: io.kestra.ee.apps.blocks.AutoRefresh

  - on: RUNNING
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ### We're processing your request

      - type: io.kestra.ee.apps.blocks.Loading
      - type: io.kestra.plugin.ee.apps.execution.blocks.Logs
      - type: io.kestra.plugin.ee.apps.execution.blocks.CancelExecutionButton
        text: Cancel request
        style: WARNING

      - type: io.kestra.ee.apps.blocks.AutoRefresh

  - on: PAUSE
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ## Validate the request
          Below are the details of the request.

      - type: io.kestra.plugin.ee.apps.execution.blocks.Inputs

      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ### Approve or Reject?
          Please approve or reject the request.

      - type: io.kestra.plugin.ee.apps.execution.blocks.ResumeExecutionForm
      - type: io.kestra.plugin.ee.apps.execution.blocks.ResumeExecutionButton
        text: Approve
        style: SUCCESS

      - type: io.kestra.plugin.ee.apps.execution.blocks.CancelExecutionButton
        text: Reject
        style: DANGER

      - type: io.kestra.ee.apps.blocks.AutoRefresh

  - on: RESUME
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ### Thank you for validating the request!

      - type: io.kestra.ee.apps.blocks.AutoRefresh

  - on: SUCCESS
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ### Request processed successfully
          See the details of the processed execution below.

      - type: io.kestra.plugin.ee.apps.execution.blocks.Inputs
      - type: io.kestra.plugin.ee.apps.execution.blocks.Outputs

      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ## You're all set!
          Find more App examples in the linked repository

      - type: io.kestra.ee.apps.blocks.Button
        text: App examples
        url: https://github.com/kestra-io/examples/tree/main/apps
        style: INFO

      - type: io.kestra.ee.apps.blocks.Button
        text: Submit new request
        url: https://preview-ee-kafka.kestra.io/ui/release/apps/5gth4KG3aLIa6LaonWh1Wp
        style: DEFAULT

  - on: FAILURE
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          ## Request failed

      - type: io.kestra.ee.apps.blocks.Alert
        style: WARNING
        showIcon: true
        content: |
          The workflow encountered an error during processing.

      - type: io.kestra.ee.apps.blocks.Markdown
        content: |
          Try again or contact support if the issue persists.

      - type: io.kestra.ee.apps.blocks.Button
        text: Submit new request
        url: https://preview-ee-kafka.kestra.io/ui/release/apps/5gth4KG3aLIa6LaonWh1Wp
        style: DEFAULT

      - type: io.kestra.ee.apps.blocks.Button
        text: Contact support
        url: https://kestra.io/slack
        style: INFO

  - on: FALLBACK
    blocks:
      - type: io.kestra.ee.apps.blocks.Markdown
        content: You're all set. Thanks for using this app!

description: |
  Launch a parametrized workflow execution to provision resources after approval.
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

The base URL of an app URL is: `https://yourHost/ui/tenantId/apps/appId` e.g. `http://localhost:8080/ui/release/apps/5CS8qsm7YTif4PWuAUWHQ5`.

You can copy the URL from the Apps catalog page in the Kestra UI.

---

## App Access and RBAC Permissions

For each app, you can set the access level to either `PUBLIC` or `PRIVATE`.

### Public Access

When an app is set to `PUBLIC`, anyone with the URL can access the form and submit requests. This is ideal for situations where the app needs to be widely available to collect user feedback or conduct a survey. You can share the app URL on social media, embed it within your website, or send it via email.


### Private Access for Using Apps

When an app is set to `PRIVATE`, only users with the `APPEXECUTION` RBAC permission can submit requests. This setup works well when you want to allow a specific group (such as business stakeholders or external partners) to use the app without giving them direct access to the Kestra UI. You can invite these users to a specific Kestra tenant, where they’ll only see the App Catalog, optionally restricted to apps in a specific namespace. This fine-grained access control ensures that only authorized users can access and use the apps.

### Private Access for Building Apps

The `APP` RBAC permission controls who can create, read, update, or delete apps within a tenant. This permission can also be restricted to specific namespaces. Unlike the `APPEXECUTION` permission which governs the ability to submit requests using apps, the `APP` permission manages the ability to build, modify, and delete apps.

---

## App Executions

Each time a user creates an execution by submitting a form in the app, a new execution is generated with the system label `system.app` and a value of `yourAppId`. For example, to filter all executions created by the `computeResourcesForm` app, you can search for `system.app:computeResourcesForm` in the label filter.

For every execution, you can track the user inputs, see the current state, view logs, and check the outputs — all from the Kestra UI. This lets you observe, troubleshoot and manage issues with your apps just as you would with any other workflow execution in Kestra.

---

## App Layout Blocks

Each app is made up of blocks that define the layout and content of the app. You can add blocks for markdown text, forms, buttons, logs, inputs, outputs, and more. The blocks are displayed in a specific order based on the app’s state (e.g. on `OPEN`, `RUNNING`, `SUCCESS`, `FAILURE`, `PAUSE`, `RESUME`).

By combining different blocks, you can create a custom UI that guides users through the app’s workflow. For example, you could start with a markdown block that explains the purpose of the app, followed by a form block for users to enter their inputs, and a button block to submit the request. You can also add blocks to display execution logs, outputs, and buttons for approving or rejecting paused workflows.

| Block type               | Available on                                                             | Properties                                                                                  | Example                                                                                                               |
|--------------------------|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `Markdown`               | OPEN, CREATED, RUNNING, PAUSE, RESUME, SUCCESS, FAILURE, FALLBACK       | - `content`                                                                                 | `- type: io.kestra.ee.apps.blocks.Markdown`<br> &nbsp;&nbsp;&nbsp;&nbsp;`content: "## Please validate the request. Inspect the logs and outputs below. Then, approve or reject the request."` |
| `RedirectTo`             | OPEN, CREATED, RUNNING, PAUSE, RESUME, SUCCESS, FAILURE, ERROR, FALLBACK | - `uri`: redirect URL <br> - `delay`: delay in seconds                                      | `- type: io.kestra.plugin.ee.apps.blocks.RedirectTo`<br> &nbsp;&nbsp;&nbsp;&nbsp;`uri: "https://kestra.io/docs"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`delay: "PT5S"` |
| `CreateExecutionForm`    | OPEN                                                                     | None                                                                                        | `- type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionForm` |
| `ResumeExecutionForm`    | PAUSE                                                                    | None                                                                                        | `- type: io.kestra.plugin.ee.apps.execution.blocks.ResumeExecutionForm` |
| `CreateExecutionButton`  | OPEN                                                                     | - `text` <br> - `style`: DEFAULT, SUCCESS, DANGER, INFO <br> - `size`: SMALL, MEDIUM, LARGE | `- type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionButton`<br> &nbsp;&nbsp;&nbsp;&nbsp;`text: "Submit"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`style: "SUCCESS"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`size: "MEDIUM"` |
| `CancelExecutionButton`  | CREATED, RUNNING, PAUSE                                                 | - `text` <br> - `style`: DEFAULT, SUCCESS, DANGER, INFO <br> - `size`: SMALL, MEDIUM, LARGE | `- type: io.kestra.plugin.ee.apps.execution.blocks.CancelExecutionButton`<br> &nbsp;&nbsp;&nbsp;&nbsp;`text: "Reject"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`style: "DANGER"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`size: "SMALL"` |
| `ResumeExecutionButton`  | PAUSE                                                                    | - `text` <br> - `style`: DEFAULT, SUCCESS, DANGER, INFO <br> - `size`: SMALL, MEDIUM, LARGE | `- type: io.kestra.plugin.ee.apps.execution.blocks.ResumeExecutionButton`<br> &nbsp;&nbsp;&nbsp;&nbsp;`text: "Approve"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`style: "SUCCESS"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`size: "LARGE"` |
| `ExecutionInputs`        | PAUSE, RESUME, SUCCESS, FAILURE                                          | - `filter`: include, exclude                                                                | `- type: io.kestra.plugin.ee.apps.execution.blocks.Inputs`<br> &nbsp;&nbsp;&nbsp;&nbsp;`filter:`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`include: []`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`exclude: []` |
| `ExecutionOutputs`       | PAUSE, RESUME, SUCCESS, FAILURE                                          | - `filter`: include, exclude                                                                | `- type: io.kestra.plugin.ee.apps.execution.blocks.Outputs`<br> &nbsp;&nbsp;&nbsp;&nbsp;`filter:`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`include: []`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`exclude: []` |
| `ExecutionLogs`          | PAUSE, RESUME, SUCCESS, FAILURE, FALLBACK                                | - `filter`: logLevel, taskIds                                                               | `- type: io.kestra.plugin.ee.apps.execution.blocks.Logs`<br> &nbsp;&nbsp;&nbsp;&nbsp;`filter:`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`logLevel: "INFO"`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`taskIds: []` |
| `Loading`                | RUNNING                                                                  | None                                                                                        | `- type: io.kestra.ee.apps.blocks.Loading` |
| `Alert`                  | FAILURE                                                                  | - `style`: SUCCESS, WARNING, ERROR, INFO <br> - `showIcon`: true, false                     | `- type: io.kestra.ee.apps.blocks.Alert`<br> &nbsp;&nbsp;&nbsp;&nbsp;`style: "WARNING"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`showIcon: true`<br> &nbsp;&nbsp;&nbsp;&nbsp;`content: "An error occurred!"` |
| `Button`                 | SUCCESS, FAILURE                                                        | - `text` <br> - `url` <br> - `style`: DEFAULT, SUCCESS, DANGER, INFO                        | `- type: io.kestra.ee.apps.blocks.Button`<br> &nbsp;&nbsp;&nbsp;&nbsp;`text: "More examples"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`url: "https://github.com/kestra-io/examples"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`style: "INFO"` |


Everything is customizable, from the text and style of buttons to the messages displayed before and after submissions.
