---
title: Apps
icon: /docs/icons/kestra.svg
editions: ["EE"]
version: ">= 0.20.0"
---

Build custom UIs to interact with Kestra from the outside world.

## Overview

Apps let you use your Kestra workflows as the backend for custom applications while Apps serve as frontend, allowing anyone to interact with your workflows regardless of their technical background. Business users can manually approve workflows that are paused, submit data to automated processes using simple forms, send requests, and view the execution results.

You can build custom applications that trigger new workflow executions, resume paused workflows waiting for approval, or interact with Kestra’s API. In short, Apps allow you and your users to interact with Kestra from the outside world.

---

## App Types

Currently, Kestra offers two types of Apps:
- **Form Apps**: these apps allow you to create forms that can trigger workflows with input parameters. For example, a form might allow users to specify resources that need to be provisioned, and their inputs will feed directly into a workflow that automatically provisions those resources.
- **Approval Apps**: these apps enable forms for approving or rejecting paused workflows. Using the same example, an approval app could be used to either approve or reject a request for provisioning resources. Depending on the decision, the workflow will either resume and provision the resources, or stop.

More types of apps are on the way, such as apps to interact with the KV store, or trigger other actions using Kestra’s API. If you have a specific use case in mind, we’d love to hear about it!

---

## How Apps Help

Apps offer custom UIs on top of your Kestra workflows. Often, workflows are designed for non-technical users, and creating custom frontends for each of these workflows can be a lot of work. Imagine having to build and serve a frontend, connect it to Kestra’s API, validate user inputs, handle responses, manage workflow outputs, and deal with authentication and authorization — all from scratch. With Apps, you can generate a custom UI for any flow in seconds, and let Kestra handle the heavy lifting.

Here are some common scenarios where a custom UI is useful:

- **Manual Approval**: workflows that need manual approval, such as provisioning resources, granting access to services, deploying apps, validating data results, or reviewing AI-generated outputs.
- **Report Generation**: workflows where business users request data and receive a downloadable CSV or Excel file.
- **IT Helpdesk**: workflows that accept bug reports, feature requests, or other tickets, and automatically forward the ticket to the relevant team.
- **User Feedback & Signups**: workflows that collect feedback or allow users to sign up for events or email lists.
- **Data Entry**: workflows where business users enter data that is processed and either sent back to them or stored in a database.

In short, Apps make it easy to turn your Kestra workflows into interactive applications that anyone can use.

---

## Creating Apps in Code

To create a new app, go to the `Apps` page in the main UI and click the `Create` button. Add your app configuration as code and hit `Save`.

### Example: App to Start a New Execution

Here’s a simple configuration for a form app that triggers a new workflow execution when submitted:

```yaml
id: compute_resources_form
type: io.kestra.plugin.ee.apps.forms.CreateExecution
title: Compute Resources Request
namespace: company.team
flowId: request_resources
access:
  type: PRIVATE
```

To see all available properties to configure this app type, expand the example below.

::collapse{title="Complete Configuration for a Form App"}

```yaml
id: compute_resources_form
namespace: company.team
displayName: App allowing to request compute resources
disabled: false
type: io.kestra.plugin.ee.apps.forms.CreateExecution
title: Compute Resources Request
description: Submit request for resources
flowId: request_resources
flowRevision: latest # optional property
layout:
  template: SYSTEM
  beforeSubmit:
    buttonText: Submit
    color: green
  afterSubmit:
    displayText: "Thank you for your submission. Your request is now being processed."
    displayOutputs:
      title: Your request is now being processed.
      description: "Please don't close this window. The results will be displayed as soon as the processing is complete."
expiration:
  type: TTL
  ttl: PT30D
  date: "2024-12-24"
  limit: 100
onSubmitAction:
  type: DISPLAY_TEXT # enum: DISPLAY_TEXT | DISPLAY_OUTPUTS | REDIRECT_TO
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

### Example: App to Resume a Paused Execution

Below is a simple configuration for an approval app:

```yaml
id: compute_resources_form
type: io.kestra.plugin.ee.apps.forms.ResumeExecution
title: Compute Resources Request
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
displayName: App to Approve or Reject Compute Resources Request
disabled: false
type: io.kestra.plugin.ee.apps.forms.ResumeExecution
title: Validate Compute Resources Request
description: Approve or reject a request for resources
flowId: request_resources
flowRevision: latest # optional
layout: # optional
  template: SYSTEM
  beforeSubmit:
    displayInputs: # by default ALL, can also be set to NONE
     - myfirst
     - mysecond
    displayOutputs:  # by default ALL, can also be set to NONE
      - task1
      - task4
    approveButton: # Resume the execution
      text: Approve
      color: green
    rejectButton: # Cancel the execution
      text: Reject
      color: red
  afterSubmit:
    displayText: "Thank you for validating the request. Your response is now being processed."
    displayOutputs:
      title: Your request is now being processed.
      description: "Please don't close this window. The results will be displayed as soon as the processing is complete."
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

For example, if the app ID is `compute-resources-form` and it's created within `kestra-tech` tenant, the URL could look like:
`https://demo.kestra.io/ui/production/apps/compute-resources-form?key=LONGRANDOM`.

---

## App Access and RBAC Permissions

For each app, you can set the access level to either `PUBLIC` or `PRIVATE`.

### Public Access

When an app is set to `PUBLIC`, anyone with the URL can access the form and submit requests. This is ideal for situations where the app needs to be widely available to collect user feedback or event signups.

---

## Private Access for Using Apps

When an app is set to `PRIVATE`, only users with the `APPEXECUTION` RBAC permission can submit requests. This setup works well when you want to allow a specific group (such as business stakeholders or external partners) to use the app without giving them direct access to the Kestra UI. You can invite these users to a specific Kestra tenant, where they’ll only see the App Catalog, optionally restricted to apps in a specific namespace. This fine-grained access control ensures that only authorized users can access and use the apps.

## Private Access for Building Apps

The `APP` RBAC permission controls who can create, read, update, or delete apps within a tenant. This permission can also be restricted to specific namespaces. Unlike the `APPEXECUTION` permission which governs the ability to submit requests using apps, the `APP` permission manages the ability to build, modify, and delete apps.

---

## Expiration and Limits

For each app, you can set an expiration date, a time-to-live (TTL), or a limit on the number of submissions. Let's look at when to use each of these options.

### Expiration Date

Set an expiration date when you know exactly how long the app should be available. For example, if you’re collecting ideas for a birthday voucher, you can have the app expire on the birthday. Once the date passes, the app will no longer be accessible.

### Time-to-Live (TTL)

Use a time-to-live (TTL) when you want the app to be available for a specific period, but not tied to a particular date. For example, if you’re collecting feedback on a new feature, you can set the app to expire 30 days after it’s created. Once the TTL expires, the app will be inaccessible.

### Submission Limit

Set a submission limit when you want to restrict the total number of responses the app can accept. For example, if you’re collecting survey responses and only need the first 100, you can limit the app to 100 submissions. After reaching the limit, the app URL will no longer work.

---

## On Submit Actions

After a user submits a request through the app, you can define what happens next. You have the option to display a message, show the outputs from the workflow execution, or redirect the user to a specific URL. Let's explore each of these options.

### Display Text

Use `DISPLAY_TEXT` when you want to show a message right after the user submits the request. For example, you could display something like “Thank you for your submission. Your request is now being processed.” This is the default option.

### Display Outputs

Choose `DISPLAY_OUTPUTS` to show the flow’s outputs after the request is processed. For example, if the workflow generates a CSV file, the user will be able to preview and download it. If the execution takes some time, they’ll see a loading animation along with a message like “Please don’t close this window. The results will be displayed once processing is complete.”

### **Redirect to URL

Use `REDIRECT_TO` when you want to send the user to a specific URL after they submit their request. For example, you could redirect them to a custom “Thank you” page on your website. This is useful when you want to show a branded or custom confirmation page.

---

## App Layout

Kestra offers multiple layout templates to style your app. At the time of writing, the available templates include `SYSTEM`, `LIGHT_MODE`, and `DARK_MODE`.

You can also customize the color and text of buttons available in the form, as well as the text displayed before and after request submission.

You can also customize the button colors and text within the form, as well as the messages displayed before and after submission.

---

## App Executions


Each time a user creates an execution by submitting a form in the app, a new execution is generated with the label `system_app` and a value of `yourAppId`. For example, to filter all executions created by the `compute-resources-form` app, you can search for `system_app:compute-resources-form` in the label filter.

For every execution, you can track the user inputs, see the current state, view logs, and check the outputs — all from the Kestra UI. This lets you troubleshoot and manage issues with your apps just as you would with any other workflow execution in Kestra.

