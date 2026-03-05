---
title: Infrastructure automation breaks in the gaps.
description: Here’s how to fix it with Kestra — without ripping out your stack.
date: 2026-03-05T11:30:00
category: Solutions
author:
  name: Martin-Pierre Roset
  image: mproset
---

Infrastructure automation is a chain of tools, teams, and handoffs that only looks clean on a diagram.

platform and infrastructure teams are juggling hardware fleets, VM environments, and edge/network changes while trying to keep delivery and operations safe. The automation is often spread across Ansible playbooks, shell scripts, cron, and isolated portals, and it typically lives outside the execution history and observability you already expect for software and data workflows.

With our latest release, we have shipped a lot of new plugin and a point of view: **orchestration is the missing layer** in your infrastructue landscape. Not another tool to replace your existing systems, but a control plane that turns the handoffs into a governed, debuggable process.

Kestra 1.3 shipped the building blocks to do that across common infrastructure domains: GitOps delivery (Argo CD), edge/DNS (Cloudflare), bare metal (MAAS), virtualization (KVM/libvirt), source-of-truth workflows (NetBox), and hyperconverged day‑2/recovery automation (Nutanix AHV + snapshots).

## Your problems are the handoffs between your tools

 They come from the spaces between them:

A deployment “finished”… but the application never became healthy.

The service is up… but DNS didn’t move, the cache didn’t purge, or the edge config is stale.

The server exists… but inventory wasn’t updated, IPs aren’t assigned, and the source of truth is already wrong.

A patch ran… but there’s no consolidated run history, no clean rollback story, and approvals live in a different system.

Kestra’s direction in 1.3 is to make those assets passes explicit and reliable, by turning infrastructure work into workflows with consistent semantics (retries, timeouts, approvals, and audit) and a single place to debug what happened.

## Integrate first, standardize next, replace only when you’re ready


Kestra’s practical philosophy is:

**Integrate what you already use**, so you can orchestrate end-to-end immediately.

**Standardize how operations run**, so your delivery and runbooks share the same guardrails.

**Replace brittle orchestration silos later**, once your process logic lives in workflows (versioned, observable, auditable), not trapped inside a portal.

And it’s why we shipped production-grade controls that matter specifically when automation touches infrastructure:

Kill Switch: a UI mechanism that lets admins stop or contain problematic executions fast, scoped down to tenant/namespace/flow/execution, with an audit trail. 

Credentials: reusable server-to-server auth configured once and referenced everywhere via `credential()`, so tokens aren’t scattered across flows and rotations don’t become a scavenger hunt.

Plugin Defaults UI: manage shared plugin configuration at the namespace level through a guided UI while keeping it versionable. citeturn27view0

And because infrastructure automation is always part “process” (approvals, self-service, controlled access), Kestra’s Enterprise “Apps” matter deeply here: **Apps let you build a UI in front of flows**, forms for data entry, approval buttons, and controlled output views, while the flow remains the backend.

For human-in-the-loop operations, Kestra’s approach is deliberately simple: you can pause an execution and resume it from the UI (or via API), keeping the run history intact.

## GitOps delivery that gates on reality, not on “CI finished”

GitOps is an excellent reconciliation model, but **delivery is bigger than reconciliation**.

In practice, a safe rollout often needs to:

Sync desired state,

Wait for application health (not just “synced”),

Perform edge actions (DNS changes, cache purge, incident WAF actions),

Notify and record what happened.

Kestra’s Argo CD plugin is intentionally focused on the primitives you need inside that larger workflow: `Sync` to apply the desired Git state and `Status` to read sync/health, conditions, and resources (optionally with refresh). Both tasks are GitOps-focused and run through the Argo CD CLI, with connection flags and timeouts that match real enterprise environments. citeturn13view2

Then the Cloudflare plugin closes the “delivery doesn’t stop at Kubernetes” problem by making edge operations composable: DNS record operations including `Upsert`, cache purge via `Purge`, WAF IP access rules, Workers KV read/write, namespaces creation, and zone discovery. 

Here’s what that looks like as a workflow pattern (simplified but production-shaped): Argo CD sync + health gate, then DNS and cache updates, all under one execution graph.

```yaml
id: rollout-with-health-gate-and-edge-update
namespace: infra.delivery

pluginDefaults:
  - type: io.kestra.plugin.argocd.apps
    values:
      server: "{{ secret('ARGOCD_SERVER') }}"
      token: "{{ secret('ARGOCD_TOKEN') }}"
  - type: io.kestra.plugin.cloudflare
    values:
      apiToken: "{{ secret('CLOUDFLARE_API_TOKEN') }}"

inputs:
  - id: application
    type: STRING
    defaults: "my-app"
  - id: zoneId
    type: STRING
    defaults: "your_zone_id"
  - id: dnsName
    type: STRING
    defaults: "app.example.com"
  - id: newTarget
    type: STRING
    defaults: "1.2.3.4"

tasks:
  - id: sync
    type: io.kestra.plugin.argocd.apps.Sync
    application: "{{ inputs.application }}"
    prune: true
    timeout: PT10M

  - id: status
    type: io.kestra.plugin.argocd.apps.Status
    application: "{{ inputs.application }}"
    refresh: true

  - id: gate_on_health
    type: io.kestra.plugin.core.execution.Assert
    conditions:
      # You'd tailor this to the Status output shape you use internally.
      - "{{ outputs.status.app.status.health.status == 'Healthy' }}"
      - "{{ outputs.status.app.status.sync.status == 'Synced' }}"

  - id: upsert_dns
    type: io.kestra.plugin.cloudflare.dns.records.Upsert
    zoneId: "{{ inputs.zoneId }}"
    recordType: "A"
    name: "{{ inputs.dnsName }}"
    content: "{{ inputs.newTarget }}"

  - id: purge_cache
    type: io.kestra.plugin.cloudflare.cache.Purge
    zoneId: "{{ inputs.zoneId }}"
    files:
      - "https://{{ inputs.dnsName }}/"
```

Argo CD `Sync`/`Status` are explicitly designed for this model: apply desired state, then inspect sync/health/conditions/resources with optional refresh. 
Cloudflare `Upsert` provides a clean DNS “ensure state” operation (with documented inputs like `apiToken`, `zoneId`, `recordType`, `name`, `content`). 

Cloudflare cache `Purge` is built for both “purge all” and “purge specific files,” which is exactly what you want for controlled rollouts and post-incident remediation.

You stop gating on *hope* (“CI is green”).

You start gating on **observed reality** (app health + explicit edge actions), with one audit trail.

## Keeping bare metal and the source of truth in sync

Bare metal automation is where orchestration either earns your trust — or gets ignored.

Canonical describes MAAS (“Metal as a Service”) as a private cloud infrastructure management system that makes physical servers behave like cloud instances, with API-driven workflows for deploying and managing machines.

Kestra’s MAAS plugin turns that lifecycle into composable tasks: `ListMachines`, `EnlistMachine`, `CommissionMachine`, `DeployMachine`, and `PowerControlMachine`.

You can finally express the **actual lifecycle** as a workflow with long-running waits and timeouts that are visible and controllable:

List what’s available,

Enlist hardware (or register a VM/BMC power driver),

Commission with polling + timeout,

Deploy OS images (with cloud-init / user data),

Control power state (on/off/cycle/query) as part of day‑2 operations.

Now connect the other half of the problem: drift doesn’t start at “Terraform plan.” It starts when the source of truth is not part of execution.

NetBox is widely used as DCIM/IPAM and an infrastructure source-of-truth because it models devices, IP prefixes/addresses, racks, and more. 
Kestra’s NetBox plugin makes NetBox writes and reads part of the workflow path: list sites/devices, create/update device records, and assign IP 

That is how you get “no drift by design”: if provisioning succeeds but inventory update fails, the workflow fails and you can see it.

Here’s a minimal pattern that shows how MAAS provisioning and NetBox updates become one process (again: simplified, but matches actual task shapes and examples from the docs).

```yaml
id: provision-metal-and-register-in-netbox
namespace: infra.provisioning

tasks:
  - id: list_ready
    type: io.kestra.plugin.ee.canonical.maas.ListMachines
    url: "{{ secret('MAAS_URL') }}"
    apiKey: "{{ secret('MAAS_API_KEY') }}"
    filters:
      status:
        - "Ready"
    includeDetails: true
    fields:
      - "system_id"
      - "hostname"
      - "status_name"

  - id: enlist
    type: io.kestra.plugin.ee.canonical.maas.EnlistMachine
    url: "{{ secret('MAAS_URL') }}"
    apiKey: "{{ secret('MAAS_API_KEY') }}"
    macAddress: "52:54:00:12:34:56"
    hostname: "prod-web-01"
    domain: "datacenter.local"
    resourcePool: "production"
    zone: "zone-a"
    architecture: "amd64/generic"
    powerType: "ipmi"
    powerParameters:
      power_address: "192.168.1.100"
      power_user: "{{ secret('IPMI_USER') }}"
      power_pass: "{{ secret('IPMI_PASSWORD') }}"

  - id: commission
    type: io.kestra.plugin.ee.canonical.maas.CommissionMachine
    url: "{{ secret('MAAS_URL') }}"
    apiKey: "{{ secret('MAAS_API_KEY') }}"
    systemId: "{{ outputs.enlist.systemId }}"
    waitForCompletion: true
    timeout: PT30M

  - id: deploy
    type: io.kestra.plugin.ee.canonical.maas.DeployMachine
    url: "{{ secret('MAAS_URL') }}"
    apiKey: "{{ secret('MAAS_API_KEY') }}"
    systemId: "{{ outputs.commission.systemId }}"
    osystem: "ubuntu"
    distroSeries: "jammy"
    waitForDeployment: true
    timeout: PT45M
    userTags:
      - "production"

  - id: create_device
    type: io.kestra.plugin.ee.netbox.CreateDevice
    url: "{{ secret('NETBOX_URL') }}"
    token: "{{ secret('NETBOX_API_TOKEN') }}"
    # In practice you'll map tenant/site/role/platform fields based on your model.
    name: "prod-web-01"

  - id: assign_ip
    type: io.kestra.plugin.ee.netbox.AssignIpAddress
    url: "{{ secret('NETBOX_URL') }}"
    token: "{{ secret('NETBOX_API_TOKEN') }}"
    address: "10.100.1.45/24"
    status: "active"
    assignedObjectType: "dcim.interface"
    assignedObjectId: "{{ outputs.create_device.primary_interface_id }}"
    dnsName: "prod-web-01.mgmt.example.com"
```

Everything above is grounded in the plugin tasks and examples as documented:

MAAS `ListMachines` supports filters, `includeDetails`, and selectable fields.
MAAS `EnlistMachine` accepts `macAddress`, `hostname`, `powerType`, and `powerParameters`, and returns `systemId`. 
MAAS `CommissionMachine` supports `waitForCompletion` and `timeout` (default PT30M). 
MAAS `DeployMachine` supports OS selection (`osystem`, `distroSeries`), optional `userData`, `userTags`, and long-running deployment waits. 
NetBox `AssignIpAddress` is explicitly geared toward assigning an IP with object binding and DNS name metadata. 

That’s the “pain away” moment: **metal provisioning, inventory, and downstream automation stop being separate runbooks**. They become one execution you can debug.

## Virtualization and recovery workflows that behave like real operations

Most teams don’t struggle to “create a VM.” They struggle to operationalize the day‑2 lifecycle:

Ephemeral environments for CI.

Cloning and templating.

Snapshots and rollback.

Event-driven cleanup.

Making those safe and repeatable.

Kestra 1.3’s infrastructure plugins explicitly cover both ends of the virtualization spectrum.

For KVM/libvirt, the plugin is designed around what operators actually need: define, start, stop, delete domains, update configuration, list domains, and react to lifecycle events. It also makes the connectivity reality explicit: it requires access to a `libvirtd` daemon via local socket, SSH, or TLS meaning you can run automation where your hypervisor lives, without poking holes in your network just to “make the tool work. 
Even the `StartVm` task is shaped for reliability: it can wait until the domain reaches RUNNING state using retry up to a configured time window. 

For Nutanix, the plugin is built for the full story: AHV VM lifecycle plus snapshotting and template management “from a single flow,” configured with your endpoint/credentials so runs can safely manage infrastructure as part of larger pipelines. 
The snapshot tasks are exactly what day‑2 automation wants: create, list, restore, delete snapshots. 
And `CreateVmSnapshot` explicitly supports crash- or application-consistent modes, with optional expiration — which is the difference between “we can snapshot” and “we can build safe rollback workflows.”

If you want a real starting point, Kestra ships a Nutanix blueprint called **“Nutanix safe patching with snapshot rollback”**, a concrete example of treating patching as a workflow, not a late-night ritual.

This is the practical pattern you want across AHV, KVM, and (yes) VMware:

Take a snapshot (or create a recovery point),

Apply change,

Verify service health,

Rollback automatically when validation fails,

Notify with full run context.

The value isn’t “more automation.” It’s **automation that fails safely**.

## Blueprints: stop starting from a blank YAML file

Workflow tooling is only as good as the workflow shapes teams actually use.

Kestra’s Blueprints exist to encode those shapes: **each blueprint combines code and documentation**, is validated, and can be integrated into your flows with a single click on “Use.”

For infrastructure orchestration specifically, there are two blueprint patterns worth highlighting because they map directly to the pain points we see in real platform teams.

The Argo CD “workflow-shaped GitOps” model is already captured in blueprints surfaced directly on the Argo CD plugin docs page: “Manage an Argo CD Application with Sync Verification” and “Single-tenant Argo CD rollout with waves, guarded sync strategy, and Status-based readiness gates.” 

The second is the “signal, not noise” approach to drift detection. The blueprint **“Detect and Alert on Infrastructure Configuration Drift with Ansible”** encodes a simple operational principle: alert only when drift exists, not on every run. 


## The elephant in the room: the VMware Aria alternative and the series we’re teasing

If you’re running infrastructure at scale, VMware ecosystems often come with operational gravity; and a lot of teams end up living inside VMware automation portals.

Broadcom’s documentation describes **VCF Automation (formerly VMware Aria Automation)** as enabling IT teams and cloud service providers to deliver a self-service private cloud for AI, Kubernetes, and VM-based applications. 
VMware Aria Automation Orchestrator (vRO lineage) is positioned as an orchestration engine with a built-in scripting model and workflow building blocks. 
And Broadcom’s tech docs explicitly frame how Aria Automation integrates with Automation Orchestrator via plug-ins to run orchestrator workflows and manage Aria Automation resources. 

Here’s where Kestra’s stance is intentionally direct:

We integrate with the VMware stack you rely on.

But we are building the replacement to the **Aria/vRA orchestration layer**: the layer where automation logic gets trapped, debugging gets opaque, and cross-domain workflows become painful to evolve.

Kestra’s VMware plugin is designed to orchestrate VM lifecycle, snapshotting, and template management across ESXi and vCenter from a single flow, with support for an optional trust store. It also supports event-driven patterns, like triggering flows based on vCenter VM lifecycle events (creation, deletion, power state changes) with filtering.

That combination, VMware operations *as steps in workflows* is the foundation for a practical exit from portal-first orchestration. No big-bang rewrite. No “replace VMware.” Replace the brittle automation UI layer above it, while keeping the virtualization substrate and surrounding tooling intact.

We’re teasing a dedicated VMware series next: **how to build a practical vRA/Aria exit strategy** while still integrating with VMware for everything you keep and how to modernize safely when you’re ready.

## Links and references

```text
Kestra 1.3 release post (Native Infrastructure Automation + controls):
https://kestra.io/blogs/release-1-3

Infrastructure plugin documentation:
Argo CD Apps (Sync/Status): https://kestra.io/plugins/plugin-argocd/apps
Cloudflare DNS Records: https://kestra.io/plugins/plugin-cloudflare/records
Cloudflare Cache: https://kestra.io/plugins/plugin-cloudflare/cache
Cloudflare IP Access Rules: https://kestra.io/plugins/plugin-cloudflare/accessrules
Cloudflare Workers KV: https://kestra.io/plugins/plugin-cloudflare/kv
Cloudflare Workers KV Namespaces: https://kestra.io/plugins/plugin-cloudflare/namespaces
Cloudflare Zones: https://kestra.io/plugins/plugin-cloudflare/zones
Canonical MAAS: https://kestra.io/plugins/plugin-ee-canonical/maas
KVM / Libvirt: https://kestra.io/plugins/plugin-kvm
NetBox: https://kestra.io/plugins/plugin-ee-netbox
Nutanix: https://kestra.io/plugins/plugin-ee-nutanix
VMware: https://kestra.io/plugins/plugin-ee-vmware

Blueprints:
Blueprints library: https://kestra.io/blueprints
Blueprints repo: https://github.com/kestra-io/blueprints
Blueprint concept docs: https://kestra.io/docs/concepts/blueprints

Process + self-service (useful for infra workflows with approvals):
Apps (Enterprise): https://kestra.io/docs/enterprise/scalability/apps
Approval processes: https://kestra.io/docs/use-cases/approval-processes
Pause/Resume guide: https://kestra.io/docs/how-to-guides/pause-resume

VMware Aria / VCF Automation references:
VCF Automation overview (formerly Aria Automation): https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/overview-of-vmware-cloud-foundation-9/what-is-vmware-cloud-foundation-and-vmware-vsphere-foundation/vcf-automation-overview.html
Aria Automation Orchestrator overview: https://www.vmware.com/docs/vmware-vrealize-orchestrator
Aria Automation + Orchestrator plug-in docs: https://techdocs.broadcom.com/us/en/vmware-cis/aria/aria-automation/8-18/vro-using-plug-ins-8-18/configuring-the-vra-plug-in.html
```

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](/slack).

If you have any questions, reach out via [Slack](/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

