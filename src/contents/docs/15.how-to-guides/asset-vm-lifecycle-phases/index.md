---
title: Trigger Flows on Each Phase of a VM's Lifecycle in Kestra
h1: Trigger Flows on Each Phase of a VM's Lifecycle
description: Start a flow when a VM asset is moved to another lifecycle phase, such as pre-provisioning, post-provisioning or removal, using a phase metadata key and the asset EventTrigger.
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
editions: ["EE", "Cloud"]
topics:
  - DevOps
  - Kestra Concepts
---

Start a separate flow for each phase of a VM's lifecycle, such as pre-provisioning, post-provisioning and removal, by storing the phase on the VM asset.

Provisioning a VM usually involves several teams: the network team reserves an IP address, the platform team creates the VM, and the application team installs its software. When each team owns a separate flow, those flows can be decoupled by a **`phase` metadata key** on the [VM asset](../../07.enterprise/02.governance/01.assets/index.md). A flow sets the phase once its part is done, and the next flow is started by an [`EventTrigger`](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#eventtrigger) that matches that phase.

`phase` is an ordinary metadata key, and you can use any values that match your process. This guide uses the following ones:

| Phase | Set by | Flow started |
| --- | --- | --- |
| `pre-provisioning` | `request_vm` | `vm_pre_provisioning` generates a hostname and reserves an IP address |
| `provisioning` | `vm_pre_provisioning` | `vm_provisioning` creates the VM |
| `post-provisioning` | `vm_provisioning` | `vm_post_provisioning` installs the applications |
| `ready` | `vm_post_provisioning` | `vm_provisioning_complete` updates the CMDB and notifies the requester |
| `removal` | `decommission_vm` | `vm_removal` releases the IP address and removes the host from the CMDB |

## Prerequisites

- A Kestra Enterprise Edition or Kestra Cloud instance.
- Permission to create and execute flows in the `company.infra` namespace, and the `ASSET` `VIEW` and `LIST` permissions to see the VM asset.

The flows in this guide use [`Log`](/plugins/core/log/io.kestra.plugin.core.log.log) and [`Return`](/plugins/core/debug/io.kestra.plugin.core.debug.return) tasks as stand-ins for the provisioning tasks, so you can execute them without credentials. Each stand-in says which task to put in its place.

## Step 1: Register the request

The `request_vm` flow registers the VM as an asset as soon as it's requested, with the phase set to `pre-provisioning`. The asset ID is built from the execution ID, since the hostname isn't known yet.

```yaml
id: request_vm
namespace: company.infra

inputs:
  - id: app
    type: STRING
    displayName: Application
    defaults: billing

  - id: env
    type: SELECT
    displayName: Environment
    values:
      - dev
      - prod
    defaults: dev

  - id: subnet
    type: STRING
    displayName: Subnet
    defaults: 10.20.0.0/24

tasks:
  - id: register_request
    type: io.kestra.plugin.core.log.Log
    message: "VM requested for {{ inputs.app }} in {{ inputs.env }}"
    assets:
      outputs:
        - id: "vm-{{ execution.id | lower }}"
          namespace: "{{ flow.namespace }}"
          type: io.kestra.plugin.ee.assets.VM
          metadata:
            app: "{{ inputs.app }}"
            env: "{{ inputs.env }}"
            subnet: "{{ inputs.subnet }}"
            phase: pre-provisioning
```

The inputs are copied to the asset metadata. Every later flow can then read them from `trigger.asset.metadata` and filter on them.

## Step 2: Generate a hostname and reserve an IP address

The `vm_pre_provisioning` flow is started when a VM asset is created with the phase `pre-provisioning`. Once the hostname and the IP address are known, the last task sets the phase to `provisioning`.

```yaml
id: vm_pre_provisioning
namespace: company.infra

tasks:
  - id: generate_hostname
    type: io.kestra.plugin.core.output.OutputValues
    values:
      hostname: "{{ trigger.asset.metadata.app }}-{{ trigger.asset.metadata.env }}-{{ execution.id | lower | slice(0, 6) }}"

  - id: reserve_ip
    type: io.kestra.plugin.core.debug.Return
    description: Stand-in. Replace with a call to your IPAM, for example an HTTP Request task that creates a host record in Infoblox with the next free IP address of the subnet.
    format: "10.20.0.15"

  - id: set_phase
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.generate_hostname.values.hostname }} has the IP address {{ outputs.reserve_ip.value }}"
    assets:
      outputs:
        - id: "{{ trigger.asset.id }}"
          type: io.kestra.plugin.ee.assets.VM
          displayName: "{{ outputs.generate_hostname.values.hostname }}"
          metadata:
            hostname: "{{ outputs.generate_hostname.values.hostname }}"
            ip_address: "{{ outputs.reserve_ip.value }}"
            phase: provisioning

triggers:
  - id: on_pre_provisioning
    type: io.kestra.plugin.ee.assets.EventTrigger
    namespace: company.infra
    assetType: io.kestra.plugin.ee.assets.VM
    events:
      - CREATED
    metadataQuery:
      - field: phase
        type: EQUAL_TO
        value: pre-provisioning
```

Notice the following:

- The trigger listens to `CREATED`, since the request is the first write of the asset.
- The phase is set by a separate last task. That task is executed only once the IP address has been reserved. If the reservation fails, the VM stays in `pre-provisioning`.
- Only the keys that change are declared. Kestra merges metadata key by key, and `app`, `env` and `subnet` are kept. `namespace` is omitted because the asset already exists.

## Step 3: Create the VM

The `vm_provisioning` flow is started once the phase is set to `provisioning`, and sets it to `post-provisioning` once the VM is created.

```yaml
id: vm_provisioning
namespace: company.infra

tasks:
  - id: create_vm
    type: io.kestra.plugin.core.log.Log
    description: Stand-in. Replace with your provisioning task, for example a Terraform CLI task that creates the VM in vSphere with the reserved hostname and IP address.
    message: "Creating {{ trigger.asset.metadata.hostname }} with {{ trigger.asset.metadata.ip_address }}"

  - id: set_phase
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.asset.metadata.hostname }} is created"
    assets:
      outputs:
        - id: "{{ trigger.asset.id }}"
          type: io.kestra.plugin.ee.assets.VM
          metadata:
            phase: post-provisioning

triggers:
  - id: on_provisioning
    type: io.kestra.plugin.ee.assets.EventTrigger
    namespace: company.infra
    assetType: io.kestra.plugin.ee.assets.VM
    events:
      - UPDATED
    metadataQuery:
      - field: phase
        type: EQUAL_TO
        value: provisioning
```

`trigger.asset.metadata` includes every key stored on the asset, with the hostname and the IP address written by `vm_pre_provisioning`.

## Step 4: Install the applications

The `vm_post_provisioning` flow follows the same pattern and sets the phase to `ready` once the applications are installed.

```yaml
id: vm_post_provisioning
namespace: company.infra

tasks:
  - id: install_apps
    type: io.kestra.plugin.core.log.Log
    description: Stand-in. Replace with an Ansible CLI task that installs the applications and applies your security configuration.
    message: "Installing {{ trigger.asset.metadata.app }} on {{ trigger.asset.metadata.ip_address }}"

  - id: set_phase
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.asset.metadata.hostname }} is configured"
    assets:
      outputs:
        - id: "{{ trigger.asset.id }}"
          type: io.kestra.plugin.ee.assets.VM
          metadata:
            phase: ready

triggers:
  - id: on_post_provisioning
    type: io.kestra.plugin.ee.assets.EventTrigger
    namespace: company.infra
    assetType: io.kestra.plugin.ee.assets.VM
    events:
      - UPDATED
    metadataQuery:
      - field: phase
        type: EQUAL_TO
        value: post-provisioning
```

## Step 5: Hand the VM over

The `vm_provisioning_complete` flow updates the CMDB, notifies the requester and sets the phase to `in-service`.

```yaml
id: vm_provisioning_complete
namespace: company.infra

tasks:
  - id: update_cmdb
    type: io.kestra.plugin.core.log.Log
    description: Stand-in. Replace with an HTTP Request task that creates the configuration item in your CMDB, for example ServiceNow.
    message: "Registering {{ trigger.asset.metadata.hostname }} in the CMDB"

  - id: notify_requester
    type: io.kestra.plugin.core.log.Log
    description: Stand-in. Replace with a notification task, for example a Slack incoming webhook or an email.
    message: "{{ trigger.asset.metadata.hostname }} ({{ trigger.asset.metadata.ip_address }}) is ready"

  - id: set_phase
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.asset.metadata.hostname }} is in service"
    assets:
      outputs:
        - id: "{{ trigger.asset.id }}"
          type: io.kestra.plugin.ee.assets.VM
          metadata:
            phase: in-service

triggers:
  - id: on_ready
    type: io.kestra.plugin.ee.assets.EventTrigger
    namespace: company.infra
    assetType: io.kestra.plugin.ee.assets.VM
    events:
      - UPDATED
    metadataQuery:
      - field: phase
        type: EQUAL_TO
        value: ready
```

## Step 6: Remove the VM

Removal is requested with the `decommission_vm` flow, where you pick one of the VMs in service. The flow only sets the phase to `removal`.

```yaml
id: decommission_vm
namespace: company.infra

inputs:
  - id: vm_id
    type: SELECT
    displayName: VM
    expression: '{{ assets(type="io.kestra.plugin.ee.assets.VM", namespace="company.infra", metadata={"phase": "in-service"}) | jq(".[].id") }}'

tasks:
  - id: request_removal
    type: io.kestra.plugin.core.log.Log
    message: "Removal of {{ inputs.vm_id }} requested"
    assets:
      outputs:
        - id: "{{ inputs.vm_id }}"
          type: io.kestra.plugin.ee.assets.VM
          metadata:
            phase: removal
```

The `vm_removal` flow is started by that phase. It destroys the VM, releases its IP address, removes it from the CMDB and sets the phase to `removed`.

```yaml
id: vm_removal
namespace: company.infra

tasks:
  - id: destroy_vm
    type: io.kestra.plugin.core.log.Log
    description: Stand-in. Replace with your teardown task, for example terraform destroy.
    message: "Destroying {{ trigger.asset.metadata.hostname }}"

  - id: release_ip
    type: io.kestra.plugin.core.log.Log
    description: Stand-in. Replace with an HTTP Request task that deletes the host record in your IPAM.
    message: "Releasing {{ trigger.asset.metadata.ip_address }}"

  - id: remove_from_cmdb
    type: io.kestra.plugin.core.log.Log
    description: Stand-in. Replace with an HTTP Request task that retires the configuration item in your CMDB.
    message: "Removing {{ trigger.asset.metadata.hostname }} from the CMDB"

  - id: set_phase
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.asset.metadata.hostname }} is removed"
    assets:
      outputs:
        - id: "{{ trigger.asset.id }}"
          type: io.kestra.plugin.ee.assets.VM
          metadata:
            phase: removed

triggers:
  - id: on_removal
    type: io.kestra.plugin.ee.assets.EventTrigger
    namespace: company.infra
    assetType: io.kestra.plugin.ee.assets.VM
    events:
      - UPDATED
    metadataQuery:
      - field: phase
        type: EQUAL_TO
        value: removal
```

To remove the asset from the inventory as well, add a [`Delete`](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#delete) task at the end, as shown in [Build a live inventory of the infrastructure your flows provision](../asset-infrastructure-inventory/index.md).

## Restrict a flow to some requests

A flow can be limited to some VMs only with more trigger conditions, all of which must be met:

- `namespace` limits the flow to the VMs of one namespace. Child namespaces aren't included.
- Each item of `metadataQuery` is checked against one metadata key, with `EQUAL_TO` or `NOT_EQUAL_TO`.

To filter on a value chosen in the request form, copy the input to the asset metadata, as `request_vm` does with `env`. For example, this trigger starts a flow for production VMs only:

```yaml
triggers:
  - id: on_post_provisioning_prod
    type: io.kestra.plugin.ee.assets.EventTrigger
    namespace: company.infra
    assetType: io.kestra.plugin.ee.assets.VM
    events:
      - UPDATED
    metadataQuery:
      - field: phase
        type: EQUAL_TO
        value: post-provisioning
      - field: env
        type: EQUAL_TO
        value: prod
```

## Move a VM to the next phase

A flow with a `phase` condition is started only when the phase is changed to that value. Later updates of the VM that keep the same phase, for instance a TTL extension or an owner change, don't start it again.

Follow these rules for every flow that reacts to a phase:

- Set the next phase on a separate task after the work. That task is executed only once the work has succeeded.
- Never write a phase that matches the flow's own trigger.

## Use a single flow when the steps don't need decoupling

Separate flows are useful when different teams own the steps, or when one step has to be reused by several provisioning flows. Otherwise, a single flow with the tasks in order is usually enough. Each task is executed only once the previous one has succeeded, and [`runIf`](../../05.workflow-components/01.tasks/index.mdx) can stop the flow when a step didn't produce the expected result, for example when the VM isn't powered on after its creation:

```yaml
id: vm_lifecycle
namespace: company.infra

inputs:
  - id: app
    type: STRING
    defaults: billing

  - id: env
    type: SELECT
    values:
      - dev
      - prod
    defaults: dev

tasks:
  - id: generate_hostname
    type: io.kestra.plugin.core.output.OutputValues
    values:
      hostname: "{{ inputs.app }}-{{ inputs.env }}-{{ execution.id | lower | slice(0, 6) }}"

  - id: reserve_ip
    type: io.kestra.plugin.core.debug.Return
    description: Stand-in. Replace with a call to your IPAM.
    format: "10.20.0.15"

  - id: create_vm
    type: io.kestra.plugin.core.debug.Return
    description: Stand-in. Replace with your provisioning task, and return the power state of the VM.
    format: "on"

  - id: vm_not_running
    type: io.kestra.plugin.core.execution.Fail
    runIf: "{{ outputs.create_vm.value != 'on' }}"
    errorMessage: "{{ outputs.generate_hostname.values.hostname }} is {{ outputs.create_vm.value }} after provisioning"

  - id: install_apps
    type: io.kestra.plugin.core.log.Log
    description: Stand-in. Replace with an Ansible CLI task.
    message: "Installing {{ inputs.app }} on {{ outputs.reserve_ip.value }}"

  - id: register_vm
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.generate_hostname.values.hostname }} is ready"
    assets:
      outputs:
        - id: "{{ outputs.generate_hostname.values.hostname }}"
          namespace: "{{ flow.namespace }}"
          type: io.kestra.plugin.ee.assets.VM
          metadata:
            app: "{{ inputs.app }}"
            env: "{{ inputs.env }}"
            ip_address: "{{ outputs.reserve_ip.value }}"
            phase: in-service
```

The VM asset is still written. The inventory is kept up to date, and other flows can still react to its phase, for example to remove it later.

## Verify the result

1. Execute `request_vm` with the default inputs.
2. Open **Executions**. You should see one execution each of `vm_pre_provisioning`, `vm_provisioning`, `vm_post_provisioning` and `vm_provisioning_complete`, each started by its asset trigger.
3. Open **Assets** and select the VM. Its display name is the generated hostname, and its `phase` is `in-service`.
4. Open the **Executions** tab of the asset. It lists every execution that wrote the VM.
5. Execute `decommission_vm` and select the VM. One execution of `vm_removal` is started, and the `phase` of the VM is set to `removed`.

## Coming from vRA

In VMware Aria Automation (vRA), the same steps are attached to event topics of the Event Broker with event subscriptions. Each topic is matched to a phase in this guide:

| vRA event topic | Phase |
| --- | --- |
| Compute allocation (`compute.allocation.pre`), Network configure (`network.configure`) | `pre-provisioning` |
| Compute post provision (`compute.provision.post`) | `post-provisioning` |
| Deployment completed (`deployment.request.post`) | `ready` |
| Compute removal (`compute.removal.pre`) | `removal` |

A condition on an event subscription is replaced by the trigger conditions described in [Restrict a flow to some requests](#restrict-a-flow-to-some-requests). The rest of the migration, from blueprints to day-2 actions, is covered in the [vRA migration guide](https://kestra.io/resources/migration/vra).

## Next steps

- See every `EventTrigger` property, event and `trigger.asset` variable in the [asset tasks and triggers reference](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#eventtrigger).
- Link IP addresses, certificates and snapshots to each VM in [Build a live inventory of the infrastructure your flows provision](../asset-infrastructure-inventory/index.md).
- Run operations on VMs selected by their metadata with [Target fleet operations with asset metadata](../asset-fleet-operations/index.md).
- Stop two executions from changing the same VM at once with [Prevent concurrent changes to a resource](../asset-locks/index.md).
