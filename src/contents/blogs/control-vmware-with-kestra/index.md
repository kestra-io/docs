---
title: "Orchestrate VMware Without the Legacy Automation Layer"
description: Kestra’s VMware plugin brings native support for vSphere, vCenter, and ESXi—automating VM lifecycle management, snapshots, templates, and event-based triggers.
date: 2026-03-10T13:00:00
category: Solutions
author:
  name: François Delbrayelle
  image: fdelbrayelle
  role: 
image: ./control-vmware-with-kestra.jpg
---

VMware remains the backbone of many enterprise infrastructures.
From development clusters to mission-critical production workloads, vSphere environments power a large portion of modern virtualized infrastructure.

But while VMware excels at virtualization, automating what happens around virtual machines is still surprisingly fragmented.

For many organizations, these workflows still live inside legacy orchestration platforms like VMware vRealize Automation (vRA) or Aria Automation. While powerful, these systems often become rigid automation silos where operational logic is difficult to evolve, integrate with modern pipelines, or extend beyond the VMware ecosystem.

Kestra takes a different approach. Instead of locking automation inside a virtualization portal, VMware operations become **workflow steps in a broader orchestration platform**, where VM lifecycle management, infrastructure automation, and application workflows can all run together.

You can now orchestrate the entire lifecycle of VMware virtual machines directly from Kestra, integrating VM management with deployment pipelines, infrastructure automation, and event-driven workflows.

Let’s explore the orchestration capabilities this plugin brings to VMware environments.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/1lViTksjco8?si=gLoK6bc5NInNN0Mu" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Why This Plugin Matters

VMware environments rarely operate in isolation.

Virtual machines are part of larger operational workflows: deployments, testing environments, scaling events, incident recovery, and infrastructure provisioning.

The VMware plugin brings VM lifecycle management **directly into Kestra workflows**, allowing infrastructure teams to:

- Orchestrate VMware operations alongside deployment or data workflows
- Replace fragile scripts with **versioned, observable automation**
- React to infrastructure events in real time
- Integrate VM operations with the rest of the platform stack

Instead of automating VMware in isolation, teams can now treat it as **one component of a larger orchestration workflow**.

## VM Lifecycle Management with vCenter and ESXi

VM lifecycle operations such as starting, stopping, or deleting virtual machines are fundamental to managing VMware environments. The Kestra VMware plugin orchestrates these tasks directly through both **vCenter-managed clusters** and standalone **ESXi hosts**.

### Automating the VM Lifecycle

Common operational tasks like provisioning, restarting, or decommissioning virtual machines can now be orchestrated directly inside Kestra workflows.

This includes:

- **CreateVm**: Provision a new VM from scratch, with defined compute, storage, and network settings.
- **DeleteVm**: Decommission unused or temporary VMs to reclaim resources.
- **ListVms**: Fetch the current list of running or provisioned VMs for dynamic task logic.
- **StartVm / StopVm / RebootVm / SuspendVm / ResetVm**: Control the VM state programmatically, essential for scheduled maintenance, load-based scaling, or cost-saving routines.
- **UpdateVm**: Modify VM configurations such as CPU, memory, network name or disk size.

These operations are **uniform across vCenter and ESXi**, giving teams flexibility whether they run managed clusters or standalone hosts.

## Snapshot Management: Safer Infrastructure Changes

Snapshots are the safety net of most VMware environments.

Before upgrades, configuration changes, or infrastructure experiments, teams rely on snapshots to preserve a rollback point.

With Kestra, snapshot management becomes **fully automated and integrated into workflows**.

You can automatically create checkpoints before risky operations, validate changes, and revert instantly if something fails.

### Snapshot Tasks (Available for vCenter and ESXi)

- **CreateVmSnapshot**: Save a snapshot before critical updates or deployments.
- **DeleteVmSnapshot**: Clean up old or unused snapshots to conserve storage.
- **ListVmSnapshots**: Retrieve a list of existing snapshots for auditing or branching logic.
- **RestoreVmFromSnapshot**: Instantly revert a VM to a known stable state in case of failure.

Snapshots are a vital part of infrastructure resilience, and automating them ensures repeatability and rapid recovery.

## Template & Cloning Capabilities for vCenter

For larger environments using **vCenter**, Kestra extends its orchestration to **template management**, which is pivotal for scaling and standardizing VM deployments.

Templates are often the backbone of environment provisioning.

They allow teams to standardize machine configurations and rapidly deploy new environments for testing, staging, or scaling.

With Kestra workflows, template operations can now be integrated directly into deployment pipelines — for example automatically cloning a full test environment before running integration tests.

### vCenter-Specific Template Tasks

- **CloneTemplate**: Create a new template VM from an existing VM.
- **ConvertVmToTemplate**: Capture a running VM configuration into a reusable template.
- **ConvertTemplateToVm**: Deploy a virtual machine from a template.
- **CloneVm**: Directly duplicate a VM and optionally convert it to a template.

Templates are often the starting point for CI/CD pipelines or environment provisioning. With Kestra, these operations can now be tied into broader workflow orchestration, such as automatically cloning a testing environment before a release cycle begins.

## Event-Driven Automation for VMware

One of the most powerful capabilities of the VMware plugin is **event-driven automation**.

Instead of running scheduled scripts, Kestra can react to VMware events as they occur.

This enables infrastructure workflows such as:

- notifying teams when new VMs are created
- triggering backup or monitoring workflows
- starting deployment pipelines when environments are ready
- automatically cleaning up temporary machines

The plugin can react to many common VMware lifecycle events, including:

- **VM Created** — Triggered when a virtual machine is created  
- **VM Deployed** — Triggered upon successful deployment of a VM  
- **VM Cloned** — Captures the cloning of a virtual machine  
- **VM Renamed** — Activated when a VM is renamed  
- **VM Removed** — Triggered when a VM is deleted or removed  
- **VM Powered On** — Initiated when a VM starts  
- **VM Powered Off** — Triggered when a VM is shut down  
- **VM Suspended** — Detects suspension of a VM  
- **VM Failed to Power On** — Alerts when a power-on attempt fails  
- **VM Failed to Power Off** — Alerts when a shutdown attempt fails  
- **VM Failed to Suspend** — Indicates an error during suspension  
- **VM Failed to Reset** — Captures failed attempts to reset a VM  

These events can trigger downstream workflows such as [sending alerts](https://kestra.io/docs/how-to-guides/alerting), updating configuration databases, or kicking off CI pipelines.

For example, you can notify a Slack channel when a VM is powered off or automatically trigger a backup workflow after a shutdown event.

```yaml
id: vm-event-listen
namespace: your.company

triggers:
  - id: watch
    type: io.kestra.plugin.ee.vmware.esxi.Trigger
    interval: PT1M
    server: "exsi.vsphere.local"
    port: 443
    username: "foo"
    password: "bar"
    eventType: VM_POWERED_OFF
    vmNameRegex: "vm-.*"

tasks:
  - id: foreach-event
    type: io.kestra.plugin.core.flow.ForEach
    values: "{{ trigger.events }}"
    tasks:
      - id: notify-slack
        type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
        url: "{{ secret('SLACK_WEBHOOK') }}"
        messageText: "A VM named *{{ json(taskrun.value).vmName }}* was powered off at {{ json(taskrun.value).timestamp }}."
```

This turns your Kestra workflows into **responsive infrastructure agents**, not just scheduled jobs.

## VMware Automation, Without the Legacy Orchestration Layer

Virtual machines remain a critical foundation of enterprise infrastructure.

But the way we automate them is evolving.

The VMware plugin for Kestra brings virtualization operations into a **modern orchestration model** where infrastructure workflows are:

- declarative
- observable
- version-controlled
- event-driven

Instead of relying on siloed orchestration portals or brittle scripts, teams can now integrate VMware directly into the same workflows that power their data, deployment, and platform automation.

This is a key step toward **treating infrastructure as orchestrated workflows rather than isolated systems**.

VMware becomes just another orchestrated component in your platform workflows.

👉 Explore the [VMware plugin](https://kestra.io/plugins/plugin-ee-vmware) and start orchestrating your vSphere environments with Kestra.

Have questions or feedback? Join our [Slack community](https://kestra.io/slack) or open [an issue on GitHub](https://github.com/kestra-io/kestra).

Like what we’re building? Support us with [a star on GitHub](https://github.com/kestra-io/kestra).
