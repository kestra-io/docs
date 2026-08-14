---
title: "Automated, Approved, and Audited Patching with Kestra"
description: "Learn how Kestra automates secure patching workflows with built-in human approvals, rollback logic, and full auditability."
date: 2025-11-04T13:00:00
category: Solutions
author:
  name: Faizan Qazi
  image: fqazi
  role: Solution Engineer
image: /blogs/uat-prod-vm-patching/automated-approved-and-audited-patching-with-kestra.png
---

## Overview

This Kestra solution solves the challenges of slow, risky, and compliance-heavy patching. It transforms a complex, multi-stage workflow spanning staging environments, human validation, and rollback logic into a **single, resilient automation flow**.

## The Patching Process Pain Point: UAT to Production

For IT and DevOps teams, patching is a non-negotiable security requirement, but the process itself is often a source of enormous friction. The core problem isn't the patching itself, but the **gaps between environments and the human approval required to bridge them.**

![App Display](/blogs/uat-prod-vm-patching/app-display.png)

## Simplifying Complex Patching Workflows with Kestra

The **`patchOrchestration`** flow handles the overall orchestration and enforces a standard best practice: **patch UAT first, then proceed to Production only if the UAT patch succeeds and is approved by a Human.**

![Topology View](/blogs/uat-prod-vm-patching/topology-view.png)

- **Sequential Execution:** The workflow starts by calling the `patchVM` subflow for the UAT VM (`processUatVM`).
- **Conditional Gate:** The Production VM task (`processProdVM`) is protected by a Kestra expression:

```yaml
runIf: "{{ outputs.processUatVM.outputs.actionPerformed == 'PATCH' and outputs.processUatVM.outputs.actionState == 'SUCCESS' }}"
```

*Production patching runs only if the UAT process successfully applied the patch and received approval (resulting in `actionState` of `SUCCESS`).*
- **Final Notifications:** The flow concludes with tasks (`logResult`, `notifyResult`) that use Kestra's output mapping to generate a comprehensive result log and send a Slack notification with patch status for both UAT and Production VMs.

---

## Effortless Approval Gates: Human-in-the-Loop

Integrating **human decisions** without stopping automation is one of the trickiest parts of any IT process. Kestra's `HumanTask` makes approval requests easy to implement.

In the **`patchVM`** subflow, after the patch is successfully applied (`checkSuccess` condition is met):

1. **Notification:** A Slack notification (`notifyChannel`) immediately informs the team that the UAT VM has been patched. This notification includes a dynamic link to the Kestra execution: `[Here]({{ appLink() }})`.
    
    ![Slack Notification](/blogs/uat-prod-vm-patching/slack-notification.png)
    
2. **Pause for Approval:** The flow reaches the **`waitForApproval`** task, a `io.kestra.plugin.ee.flow.HumanTask`.
    - This task **pauses the workflow** right after the UAT patch.
    - When an operator clicks the Slack link, they're taken directly to the running Kestra execution.
    - The **`onResume`** section defines the inputs required to resume the flow, acting as the approval form:
        - `approvePatch` (Type: `BOOL`): The critical **Approve/Reject** switch.
        - `reason` (Type: `STRING`): A required field for documenting the decision.
    
    ![App Approval](/blogs/uat-prod-vm-patching/app-approval.png)

This mechanism transforms a manual, often email-based approval process into a **simple, self-documenting step within the automated workflow.**

---

## Managing Patches and Rollbacks with Precision

Kestra ensures your patching process isn't a one-way street, it's designed to be robust with built-in rollback logic:

- **Patch Execution:** The `patchVM` task uses the SSH plugin to securely connect to the VM and execute patching commands (`apt install -y ...`).
- **Conditional Rollback:** The `rollBackIfRequired` task defines rollback conditions with a clear expression:

```yaml
condition: "{{ outputs.patchVM.exitCode != 0 or outputs.waitForApproval.onResume.approvePatch == false }}"
```

A rollback executes if:
    1. The patch **failed** (`patchVM.exitCode != 0`).
    2. The patch succeeded but the operator **rejected** it (`approvePatch == false`).
- **Rollback Action:** If the condition is met, the `rollBackVM` task executes the SSH command to reinstall the old package version, rolling back to the previous working state. The old version number is extracted from the `patchId` input string using JINJA templating.
- **Clear Outputs:** The subflow uses `OutputValues` and the `outputs` section to report the action taken (`PATCH` or `ROLLBACK`) and the final state (`SUCCESS` or `FAILED`). The main `patchOrchestration` flow uses these outputs for conditional logic.

![CheckSuccess Topology](/blogs/uat-prod-vm-patching/checkSuccess-topology.png)

![Rollback Topology](/blogs/uat-prod-vm-patching/rollback-topology.png)

By abstracting infrastructure complexity into simple YAML definitions and introducing a seamless human approval gate, Kestra makes what was once a complicated, error-prone patching process **reliable, transparent, and easy to manage.**

![VM Patch Orchestration](/blogs/uat-prod-vm-patching/vm-patch-orchestration.png)

:::collapse{title="Sample Flow Code"}

- `patchOrchestration`
    
    ```yaml
    id: patchOrchestration
    namespace: company.team
    
    inputs:
      - id: uatVM
        type: STRING
        defaults: dummy-uat
        displayName: Name of the UAT VM
      - id: prodVM
        type: STRING
        defaults: dummy-prod
        displayName: Name of the Prod VM
      - id: patchId
        type: SELECT
        expression: "{{ kv('approvedPatches') }}"
        defaults: "apt/focal-updates 2.0.11 amd64 [upgradable from: 2.0.10]"
        displayName: Select the Patch to be applied
    tasks:
      - id: processUatVM
        type: io.kestra.plugin.core.flow.Subflow
        namespace: company.team
        flowId: patchVM
        inputs:
          vmType: uat
          vmName: "{{ inputs.uatVM }}"
          patchId: "{{ inputs.patchId }}"
        wait: true
        transmitFailed: true
        # outputs - actionPerformed, actionState, stateReason, actionCause
      - id: processProdVM
        type: io.kestra.plugin.core.flow.Subflow
        runIf: "{{ outputs.processUatVM.outputs.actionPerformed == 'PATCH' and outputs.processUatVM.outputs.actionState == 'SUCCESS' }}"
        namespace: company.team
        flowId: patchVM
        inputs:
          vmType: prod
          vmName: "{{ inputs.prodVM }}"
          action: patch
          patchId: "{{ inputs.patchId }}"
        wait: true
        transmitFailed: true
        # outputs - actionPerformed, actionState, stateReason, actionCause
    
      - id: logResult
        type: io.kestra.plugin.core.debug.Return
        format: |
          VM Patching Workflow Result
          - UAT:
             - VM Name: {{ inputs.uatVM }}
             - Patch Applied: {{ outputs.processUatVM.outputs.actionPerformed == 'PATCH' ? 'Yes' : 'No'}}
              - Reason: {{ outputs.processUatVM.outputs.actionCause}}
          - Prod:
              - VM Name: {{ inputs.prodVM }}
              {% if outputs.processUatVM.outputs.actionPerformed != 'PATCH' %}
              - Patch Applied: Stage Skipped
              {% else %}
              - Patch Applied: {{ outputs.processProdVM.outputs.actionPerformed == 'PATCH' ? 'Yes' : 'No'}}
              - Reason: {{ outputs.processProdVM.outputs.actionCause}}
              {% endif %}
    
      - id: notifyResult
        type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
        url: "{{ secret('slackWebhook') }}"
        messageText: |
          VM Patching Workflow Result
          - UAT:
             - VM Name: {{ inputs.uatVM }}
             - Patch Applied: {{ outputs.processUatVM.outputs.actionPerformed == 'PATCH' ? 'Yes' : 'No'}}
              - Reason: {{ outputs.processUatVM.outputs.actionCause}}
          - Prod:
              - VM Name: {{ inputs.prodVM }}
              {% if outputs.processUatVM.outputs.actionPerformed != 'PATCH' %}
              - Patch Applied: Stage Skipped
              {% else %}
              - Patch Applied: {{ outputs.processProdVM.outputs.actionPerformed == 'PATCH' ? 'Yes' : 'No'}}
              - Reason: {{ outputs.processProdVM.outputs.actionCause}}
              {% endif %}
    outputs:
      - id: result
        type: STRING
        value: "{{ outputs.logResult.value }}"
    
    labels:
      - key: feature
        value: app
      - key: feature
        value: hitl
      - key: feature
        value: ssh
      - key: domain
        value: infra
      - key: maintainer
        value: fqazi@kestra.io
    ```
    
- `patchVM`
    
    ```yaml
    id: patchVM
    namespace: company.team
    
    inputs:
      - id: vmType
        type: SELECT
        values:
          - uat
          - prod
        defaults: uat
      - id: vmName
        type: STRING
        defaults: dummy-uat
      - id: patchId
        type: STRING
        defaults: "apt/focal-updates 2.0.11 amd64 [upgradable from: 2.0.10]"
    
    tasks:
      - id: takeSnapshot
        type: io.kestra.plugin.core.log.Log
        message: Taking Snapshot! 🚀
      - id: patchVM
        type: io.kestra.plugin.fs.ssh.Command
        host: "{{ inputs.vmName }}"
        port: "22"
        authMethod: PASSWORD
        username: root
        password: "{{ secret('ubuntuPW') }}"
        commands:
          - apt update
          - apt install -y {{ (inputs.patchId | split("/"))[0] }}
      - id: checkSuccess
        type: io.kestra.plugin.core.flow.If
        condition: "{{ outputs.patchVM.exitCode == 0 }}"
        then:
          - id: notifyChannel
            type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
            url: "{{ secret('slackWebhook') }}"
            messageText: |
              Patch: **{{ inputs.patchId }}** has been successfully applied on {{ inputs.vmType | upper  }} VM: **{{ inputs.vmName }}**. 
              
              Please validate and approve the patch {% if inputs.vmType == 'uat'%}to production VM {% endif %}or rollback.
              Approve/Reject: [Here]({{ appLink() }}) 
    
          - id: waitForApproval
            type: io.kestra.plugin.ee.flow.HumanTask
            assignment:
              users:
                - it-admin@company.com
                - infrastructure-lead@company.com
            onResume:
              - id: approvePatch
                description: Whether to approve the patch
                type: BOOL
                defaults: false
              - id: reason
                description: Reason for approval or rejection
                type: STRING
      - id: rollBackIfRequired
        type: io.kestra.plugin.core.flow.If
        condition: "{{ outputs.patchVM.exitCode != 0 or outputs.waitForApproval.onResume.approvePatch == false }}"
        then:
          - id: rollBackVM
            type: io.kestra.plugin.fs.ssh.Command
            host: "{{ inputs.vmName }}"
            port: "22"
            authMethod: PASSWORD
            username: root
            password: "{{ secret('ubuntuPW') }}"
            commands:
              - apt update
              - "apt install -y {{ (inputs.patchId | split('/'))[0] }}={{ ((inputs.patchId | split('from: '))[1] | split(']'))[0] }}"
      - id: patchState
        type: io.kestra.plugin.core.output.OutputValues
        values: 
          state: "{{ (outputs.patchVM.exitCode == 0 and outputs.waitForApproval.onResume.approvePatch == true) ? 'SUCCESS' : 'FAILED' }}"
          reason: "{{ outputs.patchVM.exitCode != 0 ? 'Patch failed' : outputs.waitForApproval.onResume.reason }}"
      - id: rollBackState
        type: io.kestra.plugin.core.output.OutputValues
        runIf: "{{ outputs.rollBackIfRequired.evaluationResult == true }}"
        values: 
          state: "{{ outputs.rollBackVM.values.exitCode == 0 ? 'SUCCESS' : 'FAILED' }}"
          reason: "{{ outputs.rollBackVM.values.exitCode != 0 ? 'Rollback failed' : 'Rollback Success' }}"
    
    outputs:
      - id: actionPerformed
        type: STRING
        value: "{{ outputs.rollBackIfRequired.evaluationResult == true ? 'ROLLBACK' : 'PATCH' }}"
      - id: actionState
        type: STRING
        value: "{{ outputs.rollBackIfRequired.evaluationResult == true ? outputs.rollBackState.values.state : outputs.patchState.values.state }}"
      - id: stateReason
        type: STRING
        value: "{{ outputs.rollBackIfRequired.evaluationResult == true ? outputs.rollBackState.values.reason : outputs.patchState.values.reason }}"
      - id: actionCause
        type: STRING
        value: "{{ outputs.waitForApproval.onResume.reason ?? 'Patching failed before the approval step.' }}"
      - id: vmName
        type: STRING
        value: "{{ inputs.vmName }}"
    
    labels:
      - key: feature
        value: app
      - key: feature
        value: hitl
      - key: feature
        value: ssh
      - key: domain
        value: infra
      - key: maintainer
        value: fqazi@kestra.io
    ```
:::
    

:::collapse{title="Sample App Code"}

- `company_team_patchOrchestration`
    
    ```yaml
    id: company_team_patchOrchestration
    type: io.kestra.plugin.ee.apps.Execution
    namespace: company.team
    displayName: Patch Orchestration
    flowId: patchOrchestration
    access:
      type: PRIVATE
    layout:
      - on: OPEN
        blocks:
          - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
            content: |
              ## Execute Flow
          - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionForm
          - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionButton
            text: Submit
      - on: RUNNING
        blocks:
          - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
            content: |
              ## Execution is in progress.
          - type: io.kestra.plugin.ee.apps.core.blocks.Loading
          - type: io.kestra.plugin.ee.apps.execution.blocks.Logs
          - type: io.kestra.plugin.ee.apps.execution.blocks.CancelExecutionButton
            text: Cancel request
      - on: SUCCESS
        blocks:
          - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
            content: |
              ### VM Patch Orchestration
          - type: io.kestra.plugin.ee.apps.core.blocks.Alert
            style: INFO
            showIcon: true
            content: Your execution result
          - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
            content: |
              {{ printContext().execution.outputs.result }}
    ```
    
- `company_team_patchVM`
    
    ```yaml
    id: company_team_patchVM
    type: io.kestra.plugin.ee.apps.Execution
    namespace: company.team
    displayName: Patch VM
    flowId: patchVM
    access:
      type: PRIVATE
    layout:
      - on: RUNNING
        blocks:
          - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
            content: |
              ## Execution is in progress.
          - type: io.kestra.plugin.ee.apps.core.blocks.Loading
          - type: io.kestra.plugin.ee.apps.execution.blocks.Logs
          - type: io.kestra.plugin.ee.apps.execution.blocks.CancelExecutionButton
            text: Cancel request
      - on: SUCCESS
        blocks:
          - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
            content: |
              ## Execution successfully completed
          - type: io.kestra.plugin.ee.apps.core.blocks.Alert
            style: SUCCESS
            showIcon: true
            content: Your execution outputs
          - type: io.kestra.plugin.ee.apps.execution.blocks.Outputs
      - on: PAUSE
        blocks:
          - type: io.kestra.plugin.ee.apps.execution.blocks.ResumeExecutionForm
          - type: io.kestra.plugin.ee.apps.execution.blocks.ResumeExecutionButton
    ```
:::
