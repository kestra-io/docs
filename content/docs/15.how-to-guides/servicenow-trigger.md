---
title: Use ServiceNow to Trigger a Kestra Flow
icon: /docs/icons/servicenow.svg
stage: Intermediate
topics:
  - Integrations
---

Execute Kestra flows with a ServiceNow webhook trigger.

## Overview

ServiceNow often acts as the front door for enterprise automation. This guide shows how to let analysts request an on-demand compliance scan from a ServiceNow catalog item while Kestra executes the workflow behind the scenes through a webhook trigger.

:::alert{type="info"}
This guide assumes the existence of a flow like in our [SecOps with Kestra guide](./secops-with-kestra.md).
:::

## Prerequisites

- A ServiceNow instance with Flow Designer access
- A Kestra tenant with a flow exposed through a webhook trigger
- The webhook URL, namespace, and token for the Kestra flow

## What You Will Build

- A Service Catalog item (`complianceScanAndRemediate`) that collects the host IP and remediation preferences
- Catalog variables that persist the user input
- A reusable ServiceNow Action that calls the Kestra webhook
- A Flow Designer flow that ties the catalog submission to the Action


## Step 1: Create the Catalog Item

1. Sign in to ServiceNow as an administrator and navigate to **Service Catalog → Catalog Definitions → Maintain Items**.

![Maintain Items Interface](/docs/how-to-guides/servicenow/maintain-items-interface.png)

2. Select **New** and provide the basic metadata:
   - **Name**: `complianceScanAndRemediate`
   - **Catalogs**: *Service Catalog*
   - **Category**: *Services*
   - **Fulfillment automation level**: *Fully automated*
3. Fill in the **Short description** and **Description**, adjust any Portal settings you do not need, and click **Save**.

![Catalog item form](/docs/how-to-guides/servicenow/catalog-item-form.png)

## Step 2: Add Catalog Variables

1. In the Variables related list, choose **New** and create the primary inputs:
   - **Type**: *Single Line Text*
   - **Question**: *IP Address*
   - **Name**: `ipAddress`
   - **Mandatory**: enabled

   ![Single Line Text Variable](/docs/how-to-guides/servicenow/single-line-text-variable.png)

2. Create an additional variable for remediation control, for example:
   - **Type**: *Single Line Text* (or *Boolean* if you prefer a toggle)
   - **Question**: *Auto remediate* (Name `autoRemediate`)

   ![Autoremediate Variable](/docs/how-to-guides/servicenow/autoremediate-variable.png)

3. (Optional) Add a multi-choice variable if you want to offer canned scan profiles. Define the choices under the **Choices** related list once the variable has been saved.

    ![Multi-choice Variable](/docs/how-to-guides/servicenow/multi-choice-variable.png)

4. Click **Update** to persist the catalog item changes.

## Step 3: Build the Script Action

Navigate to the **Workflow Studio**:

![Workflow Studio](/docs/how-to-guides/servicenow/workflow-studio.png)

1. Open **Flow Designer → Action** and create a new Action named `triggerKestraWebhook` in the **Service Catalog** category.
2. Add two Action inputs: `ipAddress` and `remediateControls`.

![Action Inputs](/docs/how-to-guides/servicenow/action-inputs.png)

3. Insert a **Script** step, expose the same inputs to that step, and paste the following code, updating the endpoint with your Kestra domain, tenant, namespace, flow ID, and webhook token. Store any secrets (such as the token) in ServiceNow Credential or Connection records rather than hardcoding them.

```javascript
(function execute(inputs, outputs) {
  outputs.error = "";

  try {
    var request = new sn_ws.RESTMessageV2();
    request.setHttpMethod("post");
    request.setEndpoint("https://{YOUR.KESTRA.DOMAIN}/api/v1/{TENANT}/executions/webhook/{NAMESPACE}/{FLOW_ID}/{WEBHOOK_TOKEN}");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Accept", "application/json");

    var body = {
      ipAddress: inputs.ipAddress,
      remediateControls: inputs.remediateControls
    };

    request.setRequestBody(JSON.stringify(body));

    var response = request.execute();
    var httpStatus = response.getStatusCode();
    var responseBody = response.getBody();

    gs.info("Kestra webhook response status: " + httpStatus);
    gs.info("Kestra webhook body: " + responseBody);

    outputs.responseBody = responseBody;
    outputs.statusCode = httpStatus;
  } catch (error) {
    gs.error("Kestra webhook failed: " + error.message);
    outputs.error = error.message;
  }
})(inputs, outputs);
```

4. Define Script outputs for `responseBody`, `statusCode`, and `error`, then map them to Action outputs so downstream flows can inspect the response.

![Script Outputs](/docs/how-to-guides/servicenow/script-outputs.png)

5. Publish the Action.

![Action Outputs](/docs/how-to-guides/servicenow/action-outputs.png)

## Step 4: Create the ServiceNow Flow

1. In Flow Designer, create a flow named `catalogSubmissionFlow`.
2. Select the **Service Catalog** trigger so the flow runs whenever the catalog item is submitted.
3. Add the **Get Catalog Variables** action and configure it to:
   - Use the **Requested Item record** from the trigger as the submitted request
   - Limit the template to the `complianceScanAndRemediate` catalog item
   - Return all of the variables you created earlier
4. Add the `triggerKestraWebhook` Action to the flow and map each Action input to the corresponding variable output from the previous step.
5. Activate the flow.

## Step 5: Connect the Catalog Item to the Flow

In the **Workflow Editor**, click on **New -> Flow**:

![Flow designer](/docs/how-to-guides/servicenow/flow-designer.png)

1. Name the flow `catalogSubmissionFlow` and give a description

![catalogSubmissionFlow form](/docs/how-to-guides/servicenow/catalog-submission-flow-form.png)

2. Set the Trigger as Service Catalog

3. In Actions, get the Catalog Variables

![Get Catalog Variables](/docs/how-to-guides/servicenow/get-catalog-variables.png)

4. Set Action Inputs

![Set Action Inputs](/docs/how-to-guides/servicenow/set-action-inputs.png)

5. Set Template Catalog Items: Click on the magnifying glass and select `complianceScanAndRemediate`.

![Set Template Catalog Items](/docs/how-to-guides/servicenow/set-template-catalog-items.png)

6. Set the Catalog Variables and **Save**.

![Set Catalog Variables](/docs/how-to-guides/servicenow/set-catalog-variables.png)

7. Add an **Action** and search for `triggerKestraWebhook`:

![Add an Action](/docs/how-to-guides/servicenow/add-action.png)

8. Under **Action Inputs**, for `ipAddress` and click on the wand icon to select **Get Catalog Variables → `ipAddress`** and repeat for Auto Remediate.

![Add Action Inputs](/docs/how-to-guides/servicenow/add-action-inputs.png)

## Validate the End-to-End Run

1. Open your **Catalog Item Catalog → Catalog Definitions -> Maintain Items→ `complianceScanAndRemediate`**
2. Go to **Process Engine**, and under **Flow** select `catalogSubmissionFlow`

![Process Engine](/docs/how-to-guides/servicenow/process-engine.png)

3. Click on **Update**, then try the workflow

![Update and Try](/docs/how-to-guides/servicenow/update-and-try.png)

4. Submit the request and navigate **System Log -> All**:

![System Log](/docs/how-to-guides/servicenow/system-log.png)

The webhook will be triggered:

![Triggered Webhook](/docs/how-to-guides/servicenow/triggered-webhook.png)

5. Navigate to Kestra, and view the **Flow Executions** tab:

![Kestra execution](/docs/how-to-guides/servicenow/kestra-execution.png)

## Conclusion

By fronting Kestra with a ServiceNow catalog item, you let users stay inside their familiar ITSM portal while still benefiting from Kestra's orchestration capabilities. The same pattern works for any flow that exposes a webhook trigger—swap in different inputs, reuse the Action, and tailor the downstream automation without changing the ServiceNow experience.
