---
title: "Introducing the VMware Plugin for Kestra EE: Orchestrate Your Virtual Machines with vSphere"
description: Kestra’s new VMware plugin brings native support for vSphere, vCenter, and ESXi—automating VM lifecycle management, snapshots, templates, and event-based triggers.
date: 2025-07-24T13:00:00
category: News & Products Updates
author:
  name: François Delbrayelle
  image: fdelbrayelle
  role: 
image: /blogs/control-vmware-with-kestra.png
---

VMware is a cornerstone in enterprise infrastructure, powering virtualized environments with performance, scalability, and reliability. Whether it’s managing dev/test workloads, production environments, or hybrid-cloud deployments, VMware's virtualization platform remains a go-to solution for IT teams worldwide.

With the release of the **new VMware plugin for Kestra Enterprise Edition (EE)**, teams can now **orchestrate the full lifecycle of their virtual machines** (VMs) directly from Kestra. This plugin integrates tightly with **vSphere**, supporting operations both **via vCenter** or **directly on ESXi hosts**. For organizations running mission-critical VMs, this plugin opens up seamless automation opportunities, reducing manual overhead and improving responsiveness.

Let’s dive into the key orchestration capabilities now available through this new plugin.

---

## VM Lifecycle Management with vCenter and ESXi

VM lifecycle operations such as starting, stopping, or deleting virtual machines are fundamental to managing any VMware environment. The Kestra VMware plugin provides direct orchestration of these tasks through both **vCenter-managed clusters** and standalone **ESXi hosts**.

### Available Tasks

You can now automate:

- **CreateVm**: Provision a new VM from scratch, with defined compute, storage, and network settings.
- **DeleteVm**: Decommission unused or temporary VMs to reclaim resources.
- **ListVms**: Fetch the current list of running or provisioned VMs for dynamic task logic.
- **StartVm / StopVm / RebootVm / SuspendVm / ResetVm**: Control the VM state programmatically, essential for scheduled maintenance, load-based scaling, or cost-saving routines.
- **UpdateVm**: Modify VM configurations such as CPU, memory, network name or disk size.

These operations are **uniform across vCenter and ESXi**, allowing flexibility whether you operate in a managed cluster or a more lightweight, host-centric setup.

---

## Snapshot Management: Instant Rollbacks and Checkpoints

VM snapshots capture the exact state of a virtual machine at a point in time—useful for backup, testing, or rollback during risky operations. With Kestra, you can now orchestrate these snapshot workflows natively:

### Snapshot Tasks (Available for vCenter and ESXi)

- **CreateVmSnapshot**: Save a snapshot before critical updates or deployments.
- **DeleteVmSnapshot**: Clean up old or unused snapshots to conserve storage.
- **ListVmSnapshots**: Retrieve a list of existing snapshots for auditing or branching logic.
- **RestoreVmFromSnapshot**: Instantly revert a VM to a known stable state in case of failure.

Snapshots are a vital part of infrastructure resilience, and automating them ensures repeatability and rapid recovery.

---

## Template & Cloning Capabilities for vCenter

For larger environments using **vCenter**, Kestra extends its orchestration to **template management**, which is pivotal for scaling and standardizing VM deployments.

### vCenter-Specific Template Tasks

- **CloneTemplate**: Create a new template VM from an existing VM.
- **ConvertVmToTemplate**: Capture a running VM configuration into a reusable template.
- **ConvertTemplateToVm**: Deploy a virtual machine from a template.
- **CloneVm**: Directly duplicate a VM and optionally convert it to a template.

Templates are often the starting point for CI/CD pipelines or environment provisioning. With Kestra, these operations can now be tied into broader workflow orchestration such as automatically cloning a testing environment before a release cycle begins.

---

## Event-Driven Triggers on VM Activity

One of the most powerful additions to the plugin is a **trigger for VM events**, usable with both **vCenter and ESXi**. This feature brings reactive automation to VMware operations.

### Trigger Capabilities

The plugin supports triggering workflows based on a wide range of VMware events, allowing for highly responsive and automated infrastructure operations. Here are the supported events:

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

These events can trigger downstream workflows such as sending alerts, updating configuration databases, or kicking off CI pipelines. For example, you can automatically notify a Slack channel when a new VM is created or start a backup workflow when a VM is powered down.

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
    eventType: VM_CREATED
    vmNameRegex: "vm-.*"

tasks:
  - id: notify-slack
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    payload: |
      {
        "text": "A new VM named *{{ trigger.vmName }}* was created at {{ trigger.timestamp }}."
      }
```

This turns your Kestra workflows into **responsive infrastructure agents**, not just scheduled jobs.

---

## Why This Plugin Matters

Until now, VMware automation often required custom scripts, separate tools, or manual coordination between systems. With the Kestra EE VMware plugin, virtual machine orchestration becomes:

- **Integrated**: Fully embedded into your Kestra workflows.
- **Unified**: Supporting both vCenter and ESXi across environments.
- **Event-Driven**: React to infrastructure changes as they happen.
- **Scalable**: Tie VM operations into CI/CD, testing, and business process automation.

---

## Conclusion

Virtual machines remain the backbone of many enterprise systems, and now, with Kestra’s new VMware plugin, orchestrating them is easier, faster, and more robust than ever. Whether you’re scaling environments with templates, managing snapshots for safety, or reacting to real-time VM events, Kestra brings orchestration simplicity to your VMware estate.

Try the plugin today in **Kestra Enterprise Edition**, and empower your platform teams with the automation they deserve! 🚀

::alert{type="info"}
Have questions or feedback? Join our [Slack community](https://kestra.io/slack) or open [an issue on GitHub](https://github.com/kestra-io/kestra).

Like what we’re building? Support us with [a star on GitHub](https://github.com/kestra-io/kestra).
::
