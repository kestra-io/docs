---
title: "Apps in Kestra Enterprise: Frontends for Flows"
h1: Build Custom User Interfaces for Workflows with Apps
description: Build custom Apps with Kestra. Create user-facing interfaces for workflows, enabling forms, approvals, and interactive data applications.
sidebarTitle: Apps
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.20.0"
docId: apps---

Build custom UIs to interact with Kestra from the outside world.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/KwBO8mcS3kk?si=VJC5a6YgVECR_bJ3" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Apps – build frontends for Flows

Apps let you use your Kestra workflows as the backend for custom applications. Within each app, you can specify custom frontend blocks, such as forms for data entry, output displays, approval buttons, or markdown blocks.

**Flows** act as the **backend**, processing data and executing tasks, while **Apps** serve as the **frontend**, allowing anyone to interact with your workflows regardless of their technical background.

Business users can trigger new workflow executions, manually approve workflows that are paused, submit data to automated processes using simple forms, and view the execution results.

You can think of Apps as **custom UIs for flows**. They are useful both for external-facing forms and for internal workflows such as approvals, requests, and guided operations.

---

## Common App use cases

Most Apps fall into one of these two patterns:
- **Execution forms**: users submit a form that starts a new execution with input parameters. For example, a requester can specify resources that need to be provisioned, and those inputs feed directly into a flow.
- **Approval or resume interfaces**: users review a paused execution and approve, reject, or resume it. For example, a platform team can validate a provisioning request before the flow continues.

---

## App benefits

Apps offer custom UIs on top of your Kestra workflows. Often, workflows are designed for non-technical users, and creating custom frontends for each of these workflows can be a lot of work. Imagine having to build and serve a frontend, connect it to Kestra’s API, validate user inputs, handle responses, manage workflow outputs, and deal with authentication and authorization — all from scratch. **With Apps, you can generate a custom UI for any flow in seconds, and let Kestra handle the heavy lifting.**

Here are some common scenarios where a custom UI is useful:

- **Manual Approval**: workflows that need manual approval, such as provisioning resources, granting access to services, deploying apps, validating data results, or reviewing AI-generated outputs.
- **Report Generation**: workflows where business users request data and receive a downloadable CSV or Excel file.
- **IT Helpdesk**: workflows that accept bug reports, feature requests, or other tickets, and automatically forward the ticket to the relevant team.
- **User Feedback & Signups**: workflows that collect feedback or allow users to sign up for events or email lists.
- **Data Entry**: workflows where business users enter data that is processed and either sent back to them or stored in a database.

In short, Apps make it easy to turn your Kestra workflows into simple applications that anyone can use.

---

## How App stages map to execution progress

Apps render different blocks based on the current execution state. This is useful when you want the page to guide users through the full lifecycle of a request, from submission to approval to delivery.

| App stage | What the user sees | What usually happens in the flow |
|-----------|--------------------|----------------------------------|
| `OPEN` | The initial form or landing page | No execution exists yet. The user is about to submit a request. |
| `CREATED` | Optional confirmation that the request was accepted | Kestra created the execution and is about to start processing it. |
| `RUNNING` | Progress text, logs, loading indicators, or intermediate outputs | Tasks are actively running. |
| `PAUSE` | Approval or review screen | The flow is waiting on a paused task or a manual decision. |
| `RESUME` | Post-approval confirmation and follow-up details | The paused execution was resumed and continues running. |
| `SUCCESS` | Final outputs, download links, or next-step buttons | The execution completed successfully. |
| `FAILURE`, `ERROR`, `FALLBACK` | Error messages, logs, retry guidance, escalation links | The execution did not complete as expected. |

For example, a VM request app might start with an `OPEN` form, move to `RUNNING` while Kestra validates the request, switch to `PAUSE` while a platform engineer reviews the requested size and environment, then show `SUCCESS` once the VM has been provisioned.

This stage-based layout is what makes Apps easier for non-technical users: they don't need to understand workflow internals, only the current step of their request.

---

## Common App patterns

The examples below are a good starting point when designing your own App:

- **FTP upload portal**: give users a simple upload form while Kestra handles the backend credentials and transfer logic. See the [business user Apps blog example](../../../../blogs/use-case-apps/index.md#requests--review).
- **Self-serve analytics request**: let users choose a dimension and time range, run a query and chart generation flow, and return the generated output on `SUCCESS`. See the [dynamic self-serve example](../../../../blogs/use-case-apps/index.md#dynamic-self-serve).
- **AI-assisted intake or user research assistant**: collect free-form context from a sales, product, or support team member, run an LLM-backed flow, and display the suggested answer or categorization back in the App. See the [everyday automation example](../../../../blogs/use-case-apps/index.md#simple-interfaces-for-everyday-automation).
- **VM or infrastructure request**: collect the requested environment, size, region, and justification on `OPEN`, show validation progress on `RUNNING`, pause for approval on `PAUSE`, then display the created VM details on `SUCCESS`. This pattern also fits the infrastructure workflows described in the [infrastructure automation blog](../../../../blogs/infra-automation/index.md).
- **Human-in-the-loop review**: display task outputs, logs, or model results, then let an approver accept or reject the execution from the same screen.

When in doubt, start by mapping the user journey first:

1. What should the user submit?
2. What should they see while the flow is running?
3. Does the flow need approval or review?
4. What is the final outcome you want to show back in the App?

Once you know those answers, it becomes much easier to choose the right blocks for each stage.

If you want inspiration beyond the examples on this page, browse the Apps-focused posts in the [blog section](../../../../blogs/introducing-apps/index.md) and [solutions content](../../../../blogs/use-case-apps/index.md).

---

## Creating Apps in code

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/P0MN9Lrmkvc?si=Ynq2iB2kP0-xmT_r" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

To create a new app, go to the `Apps` page in the main UI and click the `+ Create` button. Add your app configuration as code and click on `Save`. Like Flows, Apps also have different editor views. You can configure your App while simultaneously viewing documentation, previewing your App layout, or searching the App blueprint repository.

![App Editor Views](./app-editor-views.png)

### App to run a Hello World flow

Apps serve as custom UIs for workflows, so you need to first create a flow. Here is a simple configuration for a parameterized flow that logs a message when triggered:

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

Then add an app that triggers that flow:

```yaml
id: hello_world_form
type: io.kestra.plugin.ee.apps.Execution
displayName: Hello World Form
namespace: company.team
flowId: myflow
access:
  type: PUBLIC

layout:
  - on: OPEN
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: |
          ## Say hello
          Enter a name and submit the form.
      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionForm
      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionButton
        text: Submit

  - on: SUCCESS
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Alert
        style: SUCCESS
        showIcon: true
        content: Your request completed successfully.
      - type: io.kestra.plugin.ee.apps.execution.blocks.Logs
```

You can find a related example in the [enterprise-edition-examples repository](https://github.com/kestra-io/enterprise-edition-examples/blob/main/apps/06_hello_world_app.yaml).

This app is `PUBLIC`, so anyone with the URL can access it without requiring login. Alternatively, you can set the `access` type to `PRIVATE` to restrict the app only to specific users.

This app is perfect for building **public forms** that anyone in the world can access.

### App to request and download data

Let's create a flow that fetches the relevant dataset based on user input: [flow source code](https://github.com/kestra-io/enterprise-edition-examples/blob/main/flows/company.team.get_data.yaml).

Now, from the Apps page, you can create a new app that allows users to select the data they want to download: [app source code](https://github.com/kestra-io/enterprise-edition-examples/blob/main/apps/05_request_data_form.yaml).

This app is perfect for reporting and analytics use cases where users can request data and download the results.

### App to request a VM and get it approved

One common enterprise use case is a self-service infrastructure request. A requester fills out a form with the VM size, environment, and justification. Kestra validates the request, pauses for approval, and resumes the flow only after the request is approved.

Add a flow simulating a request for compute resources that needs manual approval: [flow source code](https://github.com/kestra-io/enterprise-edition-examples/blob/main/flows/company.team.request_resources.yaml).

Then, add your app configuration to create a form that requests the VM and routes it through the approval process: [app source code](https://github.com/kestra-io/enterprise-edition-examples/blob/main/apps/03_compute_resources_approval.yaml).

In practice, that app often uses the following stages:

- `OPEN`: request form with VM size, environment, owner, and business justification.
- `RUNNING`: validation of the request, available quotas, tags, or naming conventions.
- `PAUSE`: approval screen for the platform, security, or operations team.
- `RESUME` or `SUCCESS`: confirmation that the request was approved and the VM is being created or is ready to use.

This pattern also works for adjacent use cases such as database access requests, sandbox environment creation, firewall rule approvals, or SaaS account provisioning.


---

## Creating Apps no code

Like flows, Apps can also be created using the no-code editor. Every element available in code — such as blocks, properties, and configuration options — is fully supported in the no-code interface. When you build or update an App in the no-code editor, those changes are immediately reflected in the code view, preserving the declarative YAML definition behind the scenes. This ensures consistency between visual and code-first approaches, allowing teams to switch seamlessly between them without losing control, readability, or versioning.

![Apps No Code](./app-no-code.png)

---

## App catalog

The App Catalog is where users can find available apps. You can filter apps by name, type, namespace, or tags. From this page, you can also create new apps, edit existing ones, and temporarily disable or delete apps.

![apps_catalog](./apps_catalog.png)

Kestra provides a direct access URL to the Apps Catalog via a dedicated URL in the format `http://your_host/ui/your_tenant/apps/catalog`. This URL can be accessed by any Kestra user who has at least `APP`-Read and `APPEXECUTION`-Read permissions in that Kestra tenant (adding all `APPEXECUTION` permissions is recommended).

The catalog page requires authentication, so the Apps Catalog is never publicly accessible. It displays all Apps by default. The users only see the Apps they are allowed to see based on their RBAC permissions. For example, you can limit some apps only to specific groups of users by defining the `groups` property in your App as follows:


```yaml
access:
  catalog: true
  type: PRIVATE
  groups:
    - Admins
```

### Customize the Apps Catalog

You can customize your Apps Catalog to align with organization branding by navigating to the **Tenant** tab and then **Apps Catalog**.

![Apps Catalog Customization](./apps-catalog-customization.png)

Here, you can give your catalog a display title, set a primary banner display color, and upload an image for banner (typically an organization logo).

:::alert{type="info"}
Currently, the uploaded banner display image must be an `.svg` file.
:::

Once saved, navigate to the Apps Catalog, and see your branding:

![Apps Catalog Branding](./customized-catalog.png)

From the Apps Catalog, you can also access the customization settings directly at any time by clicking on the **gear icon**.

---

## App tags

You can add custom tags to organize and filter apps in the App Catalog. For example, you might tag apps with `DevOps`, `data-team`, `project-x`. You can then filter apps by tags to quickly find the apps you are looking for.

---

## App thumbnails

Design Apps with thumbnails to clearly display their intended use case or function to catalog users. To add a thumbnail to your app, upload an image file as a [namespace file](../../../06.concepts/02.namespace-files/index.md) to the same namespace as the App's connected flow. For example, add an `.svg` (it can also be `.jpg`, `.png`, or other image file extension) to the `company.team` namespace. The example below adds `kestra-icon.svg`.

![Image Namespace File](./app-namespace-file.png)

In your app code, add the `thumbnail` string property and point it towards the correct namespace file using `nsfiles:///<your-file>`. For example:

```yaml
id: request_data_form
type: io.kestra.plugin.ee.apps.Execution
displayName: Form to request and download data
namespace: company.team
flowId: get_data
thumbnail: "nsfiles:///kestra-icon.svg" # Point this property to the correct namespace file.
access:
  type: PRIVATE
tags:
  - Reporting
  - Analytics
```

Once added, navigate to the Apps Catalog, and a new thumbnail will display on the connected app to help designate its use case:

![App with thumbnail](./app-with-icon.png)

---

## App URL

Each app has a unique URL that you can share with others. When someone opens the URL, they will see the app and can submit requests. You can share the URL with team members, customers, or partners to let them interact with your Kestra workflows.

The base URL of an app URL is: `https://yourHost/ui/tenantId/apps/appId` e.g. `http://localhost:8080/ui/release/apps/5CS8qsm7YTif4PWuAUWHQ5`.

You can copy the URL from the Apps catalog page in the Kestra UI.

### App expressions

From within flows, you can generate App URLs using the Enterprise-only `appLink` expression. See the [Function Reference](../../../expressions/index.mdx#function-reference) for parameters and examples.

---

## App access and RBAC permissions

For each app, you can set the access level to either `PUBLIC` or `PRIVATE`.

### Public access

When an app is set to `PUBLIC`, anyone with the URL can access the form and submit requests. This is ideal for situations where the app needs to be widely available to collect user feedback or conduct a survey. You can share the app URL on social media, embed it within your website, or send it via email.


### Private access for using Apps

When an app is set to `PRIVATE`, only users with the `APPEXECUTION` RBAC permission can submit requests. This setup works well when you want to allow a specific group (such as business stakeholders or external partners) to use the app without giving them direct access to the Kestra UI. You can invite these users to a specific Kestra tenant, where they’ll only see the App Catalog, optionally restricted to apps in a specific namespace. This fine-grained access control ensures that only authorized users can access and use the apps.

### Private access for building Apps

The `APP` RBAC permission controls who can create, read, update, or delete apps within a tenant. This permission can also be restricted to specific namespaces. Unlike the `APPEXECUTION` permission which governs the ability to submit requests using apps, the `APP` permission manages the ability to build, modify, and delete apps.

---

## App executions

Each time a user creates an execution by submitting a form in the app, a new execution is generated with the system label `system.app` and a value of `yourAppId`. For example, to filter all executions created by the `computeResourcesForm` app, you can search for `system.app:computeResourcesForm` in the label filter.

For every execution, you can track the user inputs, see the current state, view logs, and check the outputs — all from the Kestra UI. This lets you observe, troubleshoot and manage issues with your apps just as you would with any other workflow execution in Kestra.

---

## App layout blocks

Each app is made up of blocks that define the layout and content of the app. You can add blocks for markdown text, forms, buttons, logs, inputs, outputs, and more. The blocks are displayed in a specific order based on the app’s state (e.g. on `OPEN`, `RUNNING`, `SUCCESS`, `FAILURE`, `PAUSE`, `RESUME`).

By combining different blocks, you can create a custom UI that guides users through the app’s workflow. For example, you could start with a markdown block that explains the purpose of the app, followed by a form block for users to enter their inputs, and a button block to submit the request. You can also add blocks to display execution logs, outputs, and buttons for approving or rejecting paused workflows.

| Block type               | Available on                                                             | Properties                                                                                  | Example                                                                                                                                                                                                                               |
|--------------------------|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Markdown`               | OPEN, CREATED, RUNNING, PAUSE, RESUME, SUCCESS, FAILURE, FALLBACK       | - `content`                                                                                 | `- type: io.kestra.plugin.ee.apps.core.blocks.Markdown`<br> &nbsp;&nbsp;&nbsp;&nbsp;`content: "## Please validate the request. Inspect the logs and outputs below. Then, approve or reject the request."`                             |
| `RedirectTo`             | OPEN, CREATED, RUNNING, PAUSE, RESUME, SUCCESS, FAILURE, ERROR, FALLBACK | - `url`: redirect URL <br> - `delay`: delay in seconds                                      | `- type: io.kestra.plugin.ee.apps.blocks.RedirectTo`<br> &nbsp;&nbsp;&nbsp;&nbsp;`url: "https://kestra.io/docs"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`delay: "PT60S"`                                                                         |
| `CreateExecutionForm`    | OPEN                                                                     | None                                                                                        | `- type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionForm`                                                                                                                                                               |
| `ResumeExecutionForm`    | PAUSE                                                                    | None                                                                                        | `- type: io.kestra.plugin.ee.apps.execution.blocks.ResumeExecutionForm`                                                                                                                                                               |
| `CreateExecutionButton`  | OPEN                                                                     | - `text` <br> - `style`: DEFAULT, SUCCESS, DANGER, INFO <br> - `size`: SMALL, MEDIUM, LARGE | `- type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionButton`<br> &nbsp;&nbsp;&nbsp;&nbsp;`text: "Submit"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`style: "SUCCESS"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`size: "MEDIUM"`                    |
| `CancelExecutionButton`  | CREATED, RUNNING, PAUSE                                                 | - `text` <br> - `style`: DEFAULT, SUCCESS, DANGER, INFO <br> - `size`: SMALL, MEDIUM, LARGE | `- type: io.kestra.plugin.ee.apps.execution.blocks.CancelExecutionButton`<br> &nbsp;&nbsp;&nbsp;&nbsp;`text: "Reject"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`style: "DANGER"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`size: "SMALL"`                      |
| `ResumeExecutionButton`  | PAUSE                                                                    | - `text` <br> - `style`: DEFAULT, SUCCESS, DANGER, INFO <br> - `size`: SMALL, MEDIUM, LARGE | `- type: io.kestra.plugin.ee.apps.execution.blocks.ResumeExecutionButton`<br> &nbsp;&nbsp;&nbsp;&nbsp;`text: "Approve"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`style: "SUCCESS"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`size: "LARGE"`                    |
| `ExecutionInputs`        | PAUSE, RESUME, SUCCESS, FAILURE                                          | - `filter`: include, exclude                                                                | `- type: io.kestra.plugin.ee.apps.execution.blocks.Inputs`<br> &nbsp;&nbsp;&nbsp;&nbsp;`filter:`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`include: []`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`exclude: []`    |
| `ExecutionOutputs`       | PAUSE, RESUME, SUCCESS, FAILURE                                          | - `filter`: include, exclude                                                                | `- type: io.kestra.plugin.ee.apps.execution.blocks.Outputs`<br> &nbsp;&nbsp;&nbsp;&nbsp;`filter:`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`include: []`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`exclude: []`   |
| `ExecutionLogs`          | PAUSE, RESUME, SUCCESS, FAILURE, FALLBACK                                | - `filter`: logLevel, taskIds                                                               | `- type: io.kestra.plugin.ee.apps.execution.blocks.Logs`<br> &nbsp;&nbsp;&nbsp;&nbsp;`filter:`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`logLevel: "INFO"`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`taskIds: []` |
| `Loading`                | RUNNING                                                                  | None                                                                                        | `- type: io.kestra.plugin.ee.apps.core.blocks.Loading`                                                                                                                                                                                |
| `Alert`                  | FAILURE                                                                  | - `style`: SUCCESS, WARNING, ERROR, INFO <br> - `showIcon`: true, false                     | `- type: io.kestra.plugin.ee.apps.core.blocks.Alert`<br> &nbsp;&nbsp;&nbsp;&nbsp;`style: "WARNING"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`showIcon: true`<br> &nbsp;&nbsp;&nbsp;&nbsp;`content: "An error occurred!"`                          |
| `Button`                 | SUCCESS, FAILURE                                                        | - `text` <br> - `url` <br> - `style`: DEFAULT, SUCCESS, DANGER, INFO                        | `- type: io.kestra.plugin.ee.apps.core.blocks.Button`<br> &nbsp;&nbsp;&nbsp;&nbsp;`text: "More examples"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`url: "https://github.com/kestra-io/examples"`<br> &nbsp;&nbsp;&nbsp;&nbsp;`style: "INFO"`      |
| `TaskOutputs`            | RUNNING, PAUSE, RESUME, SUCCESS                                         | - `outputs`: list of outputs with `displayName`, `value`, and `type`                        | `- type: io.kestra.plugin.ee.apps.execution.blocks.TaskOutputs`<br> &nbsp;&nbsp;&nbsp;&nbsp;`outputs:`<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`- displayName: My Task Output`<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`value: "{{ outputs.test.value }}"`<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`type: FILE` |

Everything is customizable, from the text and style of buttons to the messages displayed before and after submissions.
