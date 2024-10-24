---
title: Apps
icon: /docs/icons/kestra.svg
editions: ["EE"]
version: ">= 0.20.0"
---

Interact with Kestra using custom apps.

## Overview

Apps allow you to interact with Kestra from the outside world. You can create custom applications that use Kestra's API to perform various tasks, such as creating new workflow executions, resuming paused executions that need manual approval, interacting with Kestra's API, and more.

Apps offer custom UIs that allow business users to interact with Kestra workflows without needing to understand the underlying technical details. Non-technical users can pass data to your flow executions using simple forms, submit requests, and view the generated results.

---

## App Types

Currently, there are two types of apps available in Kestra:
- **Form Apps**: these apps allow you to create a form that can be used to create a parametrized execution. For example, you can create a form that allows users to enter resources that needs to be provisioned and the user inputs are then fed into a workflow execution that can automatically provision the resources.
- **Approval Apps**: these apps allow you to create a form that can be used to approve or reject a paused execution. Taking the same example as above, you can create an approval app that allows users to approve or reject the request to provision resources. Based on the approval or rejection, the workflow execution can be resumed to automatically provision the resources or stopped to prevent the resources from being provisioned.

In the future, you can expect many more types of apps using Kestra's API to create new scheduled flows, interact with the KV store, or trigger other actions. The possibilities are endless! Let us know if you have any specific use cases in mind that you would like to see as an app.

---

## Problems that Apps Solve

Apps make it easy to build custom UIs on top of your Kestra workflows. It's common that Kestra users build workflows that are intended to be used by non-technical users. Creating a custom UI for each of these workflows can be tedious — imagine building a frontend app, serving it, connecting it to Kestra's API to trigger the workflow based on provided inputs, validating user inputs, handling responses and workflow execution outputs, handling authentication and authorization, etc. With apps, you can create a custom UI for any flow in seconds and let Kestra handle the rest.

Common use cases that benefit from a custom UI on top of a Kestra workflow include:
- **Approval Processes**: workflows that require manual approval before proceeding, such as provisioning resources, granting access to IT services, deploying applications, validating data processing results, or reviewing AI-generated outputs.
- **Report Generation**: workflows where a business user requests some data via inputs and gets a final CSV or Excel file they can preview and download.
- **IT Helpdesk**: workflows that accept user bug reports, feature requests, or other types of tickets and automatically create a Jira ticket or send an email to the appropriate team.
- **User Feedback & Signups**: workflows that collect user feedback or allow users to sign up for a product launch or event.
- **Data Entry**: workflows where a business user needs to enter some data that is then processed by a workflow and the final result is sent back to the user or stored in a database.

In summary, Apps make it easy to **use your Kestra workflows as a backend** for a variety of applications without the need to build custom frontend apps from scratch.

---

## Creating Apps as Code

To create a new app, navigate to the `Apps` page in the main UI section and click on the **Create** button. Add the app's configuration as code and click **Save**.

### App to Create a New Execution

Below is a minimal configuration for a form app that will create a new execution when submitted:

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
# System Label: system_app: appId
disabled: false
type: io.kestra.plugin.ee.apps.forms.CreateExecution
title: Compute Resources Request
description: Submit request for resources
flowId: request_resources
flowRevision: latest # optional property
layout: # TBD whether we need to make it an array
  template: ADAPTIVE # LIGHT_MODE, DARK_MODE, PURPLE, etc
  beforeSubmit:
    buttonText: Submit
    color: green
  afterSubmit:
    displayText: "Thank you for your submission. Your request is now being processed."
    displayOutputs:
      title: Your request is now being processed.
      description: "Please don't close this window. The results will be displayed as soon as the processing is complete."
expiration:
  type: TTL # enum: TTL | DATE | LIMIT -- can be extended in the future if needed
  ttl: PT30D
  date: "2024-12-24" # should ideally also support datetime e.g. `2024-10-17T11:14:40.931407Z`
  limit: 100
onSubmitAction:
  type: DISPLAY_TEXT # enum: DISPLAY_TEXT | DISPLAY_OUTPUTS | REDIRECT_TO
  redirectTo:
    url: "https://example.com/thank-you"  # Redirect URL after submission
access:
  type: PRIVATE
  groups: ["DevOps"] # future scope
tags:
  - DevOps
  - myteam
  - myproject
```
::

### App to Resume a Paused Execution


Here is a minimal configuration for an approval app:

```yaml
id: compute_resources_form
type: io.kestra.plugin.ee.apps.forms.ResumeExecution
title: Compute Resources Request
namespace: company.team
flowId: request_resources
access:
  type: PRIVATE
```

To see all available properties to configure an approval app, expand the example below.

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
flowRevision: latest # optional property
layout: # optional property
  template: ADAPTIVE # LIGHT_MODE, DARK_MODE, PURPLE, etc
  beforeSubmit:
    displayInputs: xxx # by default ALL, can also be set to NONE
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
  type: DISPLAY_TEXT # enum: DISPLAY_TEXT | DISPLAY_OUTPUTS | REDIRECT_TO
  redirectTo:
    url: "https://example.com/thank-you"  # Redirect URL after submission
access:
  type: PRIVATE
  groups: ["DevOps"] # future scope
tags:
  - DevOps
  - myteam
  - myproject
```
::

---

## App Catalog

The App Catalog is a collection of apps that are available to end users. You can filter apps by name, type, namespace and by tags. From the same page, you can create new apps, edit existing ones, as well as temporarily disable or delete apps.

![apps_catalog](/docs/enterprise/apps/apps_catalog.png)

---

## App Tags

You can add custom tags to help you organize and filter apps in the App Catalog. For example, you can tag apps with `DevOps`, `data-team`, `project-x`, etc. You can then filter apps by tags to quickly find the apps you are looking for.

---

## App URL

Each app has a unique URL that you can share with others. When someone opens the URL, they will see the app and can submit requests. You can share the URL with your team members, customers, or partners to allow them to interact with your Kestra workflows.

The base structure of the app URL is `https://yourHost/ui/tenantId/apps/appId?key=LONGRANDOM`. For example, if the app ID is `compute-resources-form` created within `kestra-tech` tenant, the URL can be `https://demo.kestra.io/ui/production/apps/compute-resources-form?key=LONGRANDOM`.

---

## App Access and RBAC Permissions

For each app, you can define either `PUBLIC` or `PRIVATE` access.

### Public Access

When an app is set to `PUBLIC`, everyone with the URL can access the form and submit requests. This is useful when you want to make the app available to a wide audience e.g. for a public event, a product launch, or a user survey.

### Private Access to use apps

When an app is set to `PRIVATE`, only users with the `APPEXECUTION` RBAC permission can submit requests. This is useful when you want some authorized group of users (non-technical staleholders or external partners) to use the app without being granted a direct access to the Kestra UI. You can generate an invite for such users to join a given Kestra tenant and all they will be able to see is the App Catalog, optionally restricted to apps from a given namespace. This fine-grained access control allows you to build apps that can be used by a specific stakeholders without exposing the entire Kestra UI to them.


### Private Access to build apps

Using the `APP` RBAC permission with CRUD actions, you can control who can create, read, update or delete apps in your tenant — as always, this can be restricted to specific namespaces. In contrast to the `APPEXECUTION` permission, the `APP` permission is used to govern the permissions to create, modify, and delete apps.

---

## Expiration and Limits

For each app, you can set an expiration date, a time-to-live (TTL), or a limit on the number of submissions. Let's look at when to use each of these options.

### Expiration Date

Use an expiration date when you want to make the app available only up to a specific date known ahead of time. For example, if you want to collect ideas for a birthday voucher, you can set the app to expire on the birthday date. After the expiration date, the app will no longer be accessible.

### Time-to-Live (TTL)

Use a time-to-live (TTL) when you want to make the app available for a specific period of time. For example, if you want to collect feedback on a new feature, you can set the app to expire 30 days after creating the app. After the TTL expires, the app will no longer be accessible.

### Limit on Submissions

Use a limit on submissions when you want to restrict the number of submissions the app can receive. For example, if you want to collect the first 100 responses to a survey, you can set the app to accept only 100 submissions. After the limit is reached, the app URL will no longer be accessible.

---

## On Submit Actions

After a user submits a request using the app, you can choose what action to take next. You can display a text message, display the outputs of the execution, or redirect the user to a specific URL. Let's explore each of these options.

### Display Text

Use the `DISPLAY_TEXT` action when you want to show a text message to the user after they submit the request. For example, you can show a message like "Thank you for your submission. Your request is now being processed." This is the default action.

### Display Outputs

Use the `DISPLAY_OUTPUTS` action when you want to show the flow outputs generated in the execution. For example, if the execution generates a CSV file, user will be able to preview and download the file after submission. If the execution takes a while to complete, you will see a loading animation along with a message "Please don't close this window. The results will be displayed as soon as the processing is complete."

### Redirect To URL

Use the `REDIRECT_TO` action when you want to redirect the user to a specific URL after they submit the request. For example, you can redirect the user to a "Thank you" page on your website. This is useful when you want to show a custom confirmation page after the user submits the request.

---

## App Layout

Kestra offers multiple layout templates to style your app. At the time of writing, the available templates include `SYSTEM`, `LIGHT_MODE`, and `DARK_MODE`.

You can also customize the color and text of buttons available in the form, as well as the text displayed before and after request submission.

---

## App Executions

Each time a user created an execution by submitting a form in the app, a new execution with a label key `system_app` and a label value `yourAppId` is created. For example, to filter all Executions created by the `compute-resources-form` app, you can type `system_app:compute-resources-form` in the label filter.

For each execution, you can track the user-provided inputs, the current execution state, view the logs, and see the outputs in the Kestra UI. This allows you to troubleshoot issues in your Apps the same way you would with any other workflow execution in Kestra.
