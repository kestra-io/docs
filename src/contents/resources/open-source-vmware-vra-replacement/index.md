---
title: "Open Source VMware vRA Replacement: What Moves, What Stays, and How to Start"
description: "What an open source replacement for VMware vRA and vRO has to take over, what Kestra Open Source covers on its own, and the free tools that size the migration before you commit."
metaTitle: "Open Source VMware vRA Replacement: What It Must Cover"
metaDescription: "An open source VMware vRA replacement has to run your vRO workflows, triggers and catalog requests. See what moves, what stays and how to size the move."
tag: "infrastructure"
date: 2026-10-14
slug: "open-source-vmware-vra-replacement"
faq:
  - question: "Is there an open source replacement for VMware vRA?"
    answer: "Yes, for the automation layer. Kestra has an Apache 2.0 core that replaces the vRO workflow engine: workflows become YAML flows, schedules become triggers, configuration elements move to the KV Store. vSphere stays as the hypervisor and is called from flows. A full vRA exit usually also replaces the self-service catalog and the deployment inventory, which Kestra covers with Apps and Assets in the Enterprise Edition, or which stay in your ITSM."
  - question: "Do I have to leave VMware to replace vRA?"
    answer: "No. Replacing vRA means replacing the automation layer, not the hypervisor. vSphere, vCenter and Nutanix keep running and get called from a flow, the same way Ansible or your secrets vault does. Many teams keep VMware for compute and move only the workflows, triggers and catalog integration, so their automation keeps working if the hypervisor or the contract changes later."
  - question: "Can Kestra Open Source provision VMs on vSphere?"
    answer: "Yes, through Terraform. In the open-source edition, a flow runs the Terraform vSphere provider with the TerraformCLI task, then configures the VM with Ansible and updates ServiceNow. The native vSphere and Nutanix plugins, which create, clone, snapshot and power-manage VMs without Terraform, are part of the Enterprise Edition. Both routes produce the same flow shape, so you can start on open source and switch later."
  - question: "Is there an open source tool to migrate vRO workflows?"
    answer: "Two kinds exist. VMware's Build Tools for VMware Aria exports workflows, actions and vRA content from your instances. The Kestra Migration Assistant, Apache 2.0, reads that export on your own machine and writes a migration brief: what each workflow does, what starts it, which systems it touches and whether to retire, merge, wrap, convert or rebuild it. Conversion and testing start from that brief."
  - question: "What happens to the vRA self-service catalog?"
    answer: "It goes one of two ways. Most teams keep the catalog, approvals and request history in ServiceNow or BMC Helix, and each catalog item calls a Kestra flow where it used to call vRA. Teams retiring their portal move the catalog to Kestra Apps, where the request form and the flow are the same object. Approvals then become a Pause task in the flow."
  - question: "When do vRA licence savings start?"
    answer: "At renewal, not at cutover. The vRA licence you already paid is sunk, and term licences do not refund mid-contract. Build the migration plan backwards from the renewal notice date, because if the last wave slips past it you renew and the saving moves out by a full term. If vRA sits inside a VCF bundle you keep for the hypervisor, confirm with procurement that removing it reduces the invoice."
  - question: "Can an open source vRA replacement run air-gapped?"
    answer: "Kestra can. It is self-hosted as a single binary, Docker image or Helm chart, and runs on-premises with no outbound connectivity. Plugins are bundled with the install, so flows reach vCenter, ServiceNow, Infoblox or Ansible inside your network without calling out. Isolated network zones get dedicated worker groups (Enterprise) or, when policy forbids a shared control plane, their own Kestra instance."
---

An open source VMware vRA replacement is an automation platform with a publicly licensed core that takes over what VMware Aria Automation (vRA) and its embedded vRealize Orchestrator (vRO) did: run the workflows, start them from schedules, events and catalog requests, and call the systems around them. The hypervisor is not part of the swap. vSphere stays where it is and gets called from the new workflows.

Most of a vRA estate does not move at all. ServiceNow, Terraform, Ansible, the CMDB, IPAM and the secrets vault predate vRA and will outlive it. What moves is the workflow engine and the glue code written for it, plus two decisions: where the catalog lives, and where the inventory of provisioned resources lives. This page covers what that engine has to do, what Kestra Open Source covers without a licence, and the free tools that count the work before anyone commits a budget.

> **TL;DR** — Replacing vRA means replacing vRO's workflow engine and deciding where the catalog and resource inventory go; VMware itself can stay. Kestra Open Source (Apache 2.0) runs the flows, triggers and Terraform/Ansible/ServiceNow calls; native vSphere plugins, Apps, Assets and RBAC are Enterprise. Size the work first with an export and the open-source Kestra Migration Assistant.

## What a vRA replacement takes over, and what stays put

![What moves when you replace vRA: Kestra replaces the automation layer (vRO workflows, actions and scriptable tasks, configuration and resource elements, vRO schedules and vRA event subscriptions, hand-written integration libraries, and .package files replaced by Git); two decisions remain, where the catalog and approvals live and where the deployment inventory lives; vSphere, Nutanix, the public clouds, Kubernetes, Terraform, Ansible, the ITSM and CMDB, IPAM, DNS, the secrets vault and monitoring stay and get called](./what-moves-when-you-replace-vra.png)

vRA and vRO are two products. vRA is the front end: the Service Broker catalog, cloud templates (blueprints), deployments and their lifecycle. vRO is the engine underneath, where workflows, actions, scriptable tasks in JavaScript, configuration elements and resource elements live. Both go when you migrate, but not everything they did moves to the new orchestrator.

A practical way to scope the replacement is to split the estate into six parts and give each one a verdict: **replace** (the new orchestrator takes it over), **integrate** (the incumbent stays and exchanges events with the orchestrator), **keep** (the incumbent stays and gets called) or **retire** (nothing replaces it).

| Part of the estate | In a vRA estate | Verdict | Where it ends up |
|---|---|---|---|
| Request intake | Service Broker catalog, forms, approvals, entitlements | Integrate | ITSM catalog calling a flow, or Kestra Apps |
| Triggers and events | vRO schedules, vRA event subscriptions, ITSM and CMDB events | Replace, retire, integrate | Schedule and webhook triggers; lifecycle subscriptions re-sourced from new events |
| Workflow engine | vRO workflows, actions, config and resource elements | Replace | Kestra flows, subflows, KV Store, namespace files |
| Execution tooling | Cloud templates, Terraform, Ansible, CI pipelines, scripts | Keep (templates replaced) | Called from flows; blueprints collapse into provisioning flows with inputs |
| Records of truth | vRA deployment objects, CMDB, IPAM, Terraform state | Keep | CMDB or Kestra Assets for the deployment inventory |
| Platform services | Vault, identity, observability, Git | Keep, integrate | Secrets read from your vault, SSO, monitoring registration inside the flow |

Targets (vSphere, Nutanix, the public clouds, Kubernetes) get the keep verdict without debate. The difference between keep and integrate is direction: a kept tool is invoked and returns a result, an integrated one also originates events that start flows.

## Why teams look for an open source option

Two pressures show up in almost every vRA exit, and both are about who controls the automation.

The first is price. vRA is no longer sold on its own; it ships inside VMware Cloud Foundation, licensed per core on subscription, so the automation bill tracks the size of the hypervisor estate rather than how much you automate. Gartner expects most VMware customers' bills to grow by 200 to 500 percent at their next renewal, [as reported by The Register](https://www.theregister.com/special-features/2024/08/26/broadcom-promised-better-hybrid-clouds-will-it-deliver/1180443). An engineer at a Fortune 500 industrial company put it plainly before replacing it: "We're using Aria Automation, that's a massive cost, the cost doesn't justify it anymore."

The second is the roadmap. What your automation can reach is decided by the vendor. In VCF Automation 9.1.1, native management of AWS, Azure and GCP resources is [deprecated and disabled by default](https://knowledge.broadcom.com/external/article/448993). Every integration outside VMware's list is a library your team writes in vRO's JavaScript dialect and then maintains, and the number of people who can read that code shrinks every year.

An open source core answers the question a proprietary platform cannot: what happens if the commercial relationship ends. If the workflow definitions are plain files in your Git repository and the engine is Apache 2.0, you can keep running it, read it and change it without asking anyone. That is the practical meaning of avoiding [vendor lock-in in orchestration](/resources/infrastructure/vendor-lock-in-orchestration), and it is the test vRO failed.

## Four tests for any open source vRA replacement

Several open source projects come up in vRA replacement searches. Most are strong in one slice of the estate, which is the same domain-lock problem in a new place. Ask four questions of each.

1. **Does it replace the workflow engine, or one tool the engine called?** Ansible configures, Terraform and OpenTofu provision, Rundeck runs runbooks. vRO called all of them.
2. **Can it be started without a human?** vRA workflows fire from schedules, lifecycle events, ITSM state changes and message buses, not only from a form.
3. **How hard is it to leave?** Where do definitions live, can you read them without the product, and is the scripting language one your team already knows?
4. **Is your team the only one who needs it?** The data team runs its own scheduler, and a CI pipeline is often doing provisioning that vRA only triggered.

| Dimension | Ansible / AWX | Terraform / OpenTofu | Rundeck (OSS) | Temporal | Kestra (OSS) |
|---|---|---|---|---|---|
| Primary job | Configuration management | Infrastructure as code | Runbook automation | Durable execution in application code | Workflow orchestration across systems |
| Core license | GPLv3 (Ansible), Apache 2.0 (AWX) | BSL 1.1 (Terraform), MPL 2.0 (OpenTofu) | Apache 2.0 | MIT | Apache 2.0 |
| Definition format | YAML playbooks | HCL | Job definitions (YAML/XML) | Code (Go, Java, Python, TypeScript and others) | Declarative YAML |
| Replaces vRO's engine on its own | No, it is what vRO called | No, it is what vRO called | Partly, for operational jobs | Only if workflows move into application code | Yes |
| Event and schedule triggers | Via AWX schedules and API | No, needs an external runner | Schedules and webhooks | Started from code | Schedule, webhook, flow and polling triggers |
| Calls Terraform, Ansible and ITSM | Through modules | No | Through plugins and scripts | Through code you write | Through plugins (2,000+) |
| Self-service request forms | AWX surveys | No | Job options | No | Typed flow inputs; Apps in Enterprise |
| Self-hosted, air-gapped | Yes | Yes | Yes | Yes | Yes |

Choose Ansible or Terraform to keep doing what they already do in your estate; they stay either way. Choose [Temporal](/vs/temporal) when the workflow logic belongs inside an application your developers own. Choose Kestra when you need the layer vRO was: one place that starts on an event or a request, calls Terraform, Ansible, vCenter and ServiceNow in order, waits for approvals and records what happened. The [VMware Aria Automation alternatives](/resources/infrastructure/vmware-aria-automation-alternatives) page compares commercial platforms for the same job.

## What Kestra Open Source covers, and where Enterprise starts

Kestra's open-source edition is a production engine, not a demo. Every core vRO construct has an open-source equivalent, which means you can test the conversion pattern on real workflows without a licence or a sales call.

| vRO / vRA object | Kestra equivalent | Edition |
|---|---|---|
| Workflow | Flow (YAML) | Open source |
| Action | Subflow or task | Open source |
| Scriptable task (JavaScript) | Script task in Python, Shell, PowerShell or Node.js | Open source |
| Configuration element | [KV Store](/docs/concepts/kv-store) entry | Open source |
| SecureString | Secret | Open source |
| Resource element, script module | Namespace file | Open source |
| vRO schedule | Schedule trigger | Open source |
| Folder hierarchy | Hierarchical namespaces | Open source |
| .package export between instances | Git | Open source |
| Request form | Typed flow inputs; [Apps](/docs/enterprise/scalability/apps) for a catalog front end | Open source / Enterprise |
| Deployment object | [Assets](/docs/enterprise/governance/assets) | Enterprise |
| Projects and entitlements | RBAC, tenants, namespaces | Enterprise |

The open-source edition stops where a vRA migration crosses into governance and native hypervisor access. The [VMware plugin](/plugins/plugin-ee-vmware) and the Nutanix plugin (create, clone, snapshot, power-manage VMs without Terraform) are Enterprise, as are external secrets managers such as HashiCorp Vault, unit tests for converted flows, and Promote for moving flows between environments with a review. In open source, vSphere provisioning runs through the Terraform provider, which is how many vRA estates already did it. The [open-source vs. Enterprise comparison](/docs/oss-vs-paid) lists the full split.

## A vRA catalog item rebuilt as an open source flow

The most common vRA pattern is a catalog request that provisions a VM, configures it and closes the ServiceNow ticket. In vRA that is a cloud template, an event subscription and two or three vRO workflows. In Kestra it is one flow, and it runs on the open-source edition.

```yaml
id: provision_vsphere_vm
namespace: infra.provisioning
description: Replaces a vRA catalog item and the vRO workflows behind it.

inputs:
  - id: vm_name
    type: STRING
  - id: size
    type: SELECT
    values: [small, medium, large]
    defaults: small
  - id: ritm_sys_id
    type: STRING
    description: sys_id of the ServiceNow request item that ordered the VM

tasks:
  - id: build
    type: io.kestra.plugin.core.flow.WorkingDirectory
    namespaceFiles:
      enabled: true
    tasks:
      - id: terraform
        type: io.kestra.plugin.terraform.cli.TerraformCLI
        beforeCommands:
          - terraform init -input=false
        commands:
          - terraform apply -input=false -auto-approve -var="vm_name={{ inputs.vm_name }}" -var="size={{ inputs.size }}"
          - terraform output -raw ansible_inventory > inventory.ini
        env:
          TF_VAR_vsphere_user: "{{ secret('VSPHERE_USER') }}"
          TF_VAR_vsphere_password: "{{ secret('VSPHERE_PASSWORD') }}"

      - id: configure
        type: io.kestra.plugin.ansible.cli.AnsibleCLI
        commands:
          - ansible-playbook -i inventory.ini configure.yml

  - id: close_request
    type: io.kestra.plugin.servicenow.Update
    domain: "{{ secret('SNOW_DOMAIN') }}"
    username: "{{ secret('SNOW_USERNAME') }}"
    password: "{{ secret('SNOW_PASSWORD') }}"
    table: sc_req_item
    sysId: "{{ inputs.ritm_sys_id }}"
    data:
      state: "3"
      work_notes: "VM {{ inputs.vm_name }} provisioned by Kestra execution {{ execution.id }}"
```

The Terraform configuration (`main.tf` with the vSphere provider and a remote state backend) and the Ansible playbook live as namespace files, so they are versioned with the flow. The three inputs replace the catalog form. A ServiceNow catalog item calls the flow through the API, or a webhook trigger, with the request item's `sys_id`. Size variants that used to be separate blueprints are one `SELECT` input.

That is the open-source version. With the Enterprise plugin, the Terraform step becomes a vCenter clone task; the [VMware provisioning blueprint with Ansible and ServiceNow registration](/blueprints/vmware-provision-configure-register) shows that route end to end. Day 2 patterns have their own templates, such as [event-driven VM cleanup from vCenter removal events](/blueprints/vm-event-based-cleanup) for decommissioning or an [SSL certificate expiry monitor](/blueprints/ssl-certificate-expiry-monitor) for operational checks. Converting by pattern rather than by team is what keeps a migration from turning into hundreds of one-off jobs.

## Size the migration with open source tools first

The first workflow count from a vRA estate is almost always alarming, because it assumes every workflow moves on its own. It rarely does. Three free tools and one sizing method get you to a defensible number before anyone installs a new platform.

**Export the estate.** [Build Tools for VMware Aria](https://github.com/vmware/build-tools-for-vmware-aria), VMware's own open-source toolchain, exports vRO workflows, actions, configuration and resource elements, plus vRA blueprints, subscriptions, catalog items and resource actions. The community project [mcp-vcf-orchestrator](https://github.com/mgovedarov/mcp-vcf-orchestrator) wraps the same vRO and VCF Automation APIs as an MCP server, so an AI assistant can query the export directly. Both can also write, so run them with a read-only service account against a non-production instance first. Make sure the export carries last-execution dates.

**Assess it on your machine.** The [Kestra Migration Assistant](/resources/migration/vra/assistant) is a free command-line tool under Apache 2.0. It reads the vRO package and, optionally, the vRA export, and writes a migration brief you open in a browser: what each workflow does and what starts it, which systems it touches and whether a Kestra plugin already covers them, a recommendation per workflow (retire, merge into another, treat as a wrapper, convert, or rebuild) and a migration plan in waves ordered by risk and dependency. [Leaving vRA without the big rewrite](/blogs/leaving-vra-without-the-big-rewrite) shows why there is usually less to migrate than the export suggests.

```bash
pipx install kestra-migration-assistant
kestra-migrate init
kestra-migrate vra run ./my-estate
```

It runs locally and sends nothing to Kestra. Host names, IP addresses, accounts and credentials are replaced with placeholders before anything reaches a model, you choose the model (including one you host yourself), and it still produces an inventory and call graph with no model at all. When the export cannot answer something, such as how often a workflow runs, it writes the question to a file; you answer it and run the same command again. The assessment stops at the plan. The conversion is the other half, run with Kestra: tests are written from each workflow first, an engineer reviews every converted flow, and each wave runs against a simulated copy of your environment.

**Run the three passes.** Whatever produced the inventory, three passes shrink it to the real work. The figures below are illustrative, not a benchmark; plug in your own export.

| Pass | Rule | Illustrative estate |
|---|---|---|
| Raw export | Every workflow in the package | 1,000 workflows |
| Retire what nobody runs | Not executed in 12 months (10 to 20 percent is common) | 850 still in scope |
| Group near-duplicates | Copies per environment or business unit become one flow with inputs | 595 distinct flows |
| Separate wrappers | Workflows that only call Ansible, a script, a pipeline or one plugin-covered integration carry no conversion cost | 446 flows with logic of their own |

The integration libraries go too. Hand-written vRO clients for Infoblox, a load balancer or SolarWinds are deleted wherever a plugin covers the target, and only the business logic on top of them moves. Count them separately from the workflows.

**Price it against the renewal.** The migration is the investment and the vRA renewal you do not sign is the return. The licence already paid is sunk, so savings start at the renewal date, not at cutover. Work the wave plan backwards from the notice deadline and run the estimate twice, with low and high assumptions, labelling every rate as measured or estimated.

## How teams have run the switch

Open source is where most evaluations start, not where every migration ends. Leaving vRA crosses the catalog, the inventory and the security review, and the teams that finished used both editions.

A [Fortune 500 industrial company replaced VMware Aria Automation with Kestra](/stories/fortune-500-company) to cut costs and secure hybrid cloud automation across IT and OT. Its security policy forbade a control plane spanning security zones, so it runs four isolated Kestra platforms for OT and one for IT. The company reports a 90% reduction in licensing cost versus Aria Automation and delivery that went from six months to six days. Ansible kept doing the heavy lifting, now called from flows, and ServiceNow stayed the system that tickets and incidents flow through.

[Dataport](/stories/dataport), Germany's public-sector IT services provider, standardized API-driven cloud orchestration on its private cloud, with a government-grade orchestration control plane. [CAGIP, Crédit Agricole's IT production arm](/stories/credit-agricole), transformed its infrastructure operations and scaled workflows across more than 100 clusters, showing that the same engine scales past one team's workflows.

## Where to start

Start with real workflows, not a feature checklist.

1. Export the estate and [start with an assessment](/resources/migration/vra/assistant): the Kestra Migration Assistant gives you the brief and the three-pass count.
2. Install Kestra Open Source with [Docker Compose](/docs/installation/docker-compose) and rebuild two or three workflows from the brief: one provisioning flow, one Day 2 action and one scheduled check, including at least one difficult workflow you would run in production.
3. Measure the hours each one took. Those rates, applied to your pattern counts, give you a first estimate. Treat it as a range, since two or three workflows will not cover every pattern.
4. When the test needs the catalog, the inventory, native vSphere access or RBAC, run a proof of concept on Enterprise against the same workflows.

The vSphere estate keeps running throughout. Every wave stays reversible until the vRA side of it is switched off, and the [VMware orchestration overview](/orchestration/vmware) shows how flows call vCenter, snapshots and events once the engine underneath has changed. For the full method, from the first assessment to retiring vRA wave by wave, see [how to migrate off vRA](/resources/migration/vra).
