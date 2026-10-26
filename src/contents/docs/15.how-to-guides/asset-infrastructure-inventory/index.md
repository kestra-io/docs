---
title: Build a Live Inventory of Provisioned Infrastructure in Kestra
h1: Build a Live Inventory of the Infrastructure Your Flows Provision
description: Register VMs, IP addresses, certificates, and snapshots as Kestra assets from your provisioning flows to keep a live, linked infrastructure inventory.
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
editions: ["EE", "Cloud"]
topics:
  - DevOps
  - Kestra Concepts
---

Register every virtual machine and attached resource your flows create as an [asset](../../07.enterprise/02.governance/01.assets/index.md), so Kestra keeps a live inventory with links between each VM and its resources.

Provisioning flows usually create a VM, then other flows attach an IP address, issue a certificate, or take a snapshot. Without a shared record, finding which certificate belongs to which VM means reading logs or a spreadsheet that drifts from reality. When each flow declares what it creates, the inventory updates on every run, and each child resource points back to its VM.

## Prerequisites

- A Kestra Enterprise Edition or Kestra Cloud instance.
- Permission to create and execute flows in the `company.infra` namespace, and the `ASSET` `VIEW` and `LIST` permissions to see the inventory.
- For the optional `Delete` step, SDK credentials with the `ASSET` `DELETE` permission.

The flows in this guide use [`Log`](/plugins/core/log/io.kestra.plugin.core.log.log) and [`Return`](/plugins/core/debug/io.kestra.plugin.core.debug.return) tasks as stand-ins for real provisioning tasks, so you can run them without cloud credentials. Each stand-in says which real task to put in its place.

## Register a VM when you provision it

The first flow provisions a VM and registers it as an `io.kestra.plugin.ee.assets.VM` asset. The asset ID comes from the hostname with the `slugify` filter, so every later flow can rebuild the same ID from the same hostname.

```yaml
id: provision_vm
namespace: company.infra

inputs:
  - id: hostname
    type: STRING
    defaults: Web Server 01
  - id: env
    type: SELECT
    values:
      - staging
      - prod
    defaults: staging
  - id: region
    type: STRING
    defaults: europe-west1

tasks:
  - id: create_vm
    type: io.kestra.plugin.core.debug.Return
    description: Stand-in. Replace with your provisioning task, for example a Terraform or cloud CLI task that outputs the VM's private IP.
    format: "10.0.12.34"
    assets:
      outputs:
        - id: "{{ inputs.hostname | slugify }}"
          namespace: "{{ flow.namespace }}"
          type: io.kestra.plugin.ee.assets.VM
          displayName: "{{ inputs.hostname }}"
          description: "Provisioned by execution {{ execution.id }}."
          metadata:
            provider: gcp
            region: "{{ inputs.region }}"
            state: running
            env: "{{ inputs.env }}"
            os: ubuntu-22.04
            private_ip: "{{ outputs.create_vm.value }}"
            owner: platform-team
```

Notice these parts of the declaration:

- `id` turns `Web Server 01` into `web-server-01`. Running the flow again for the same hostname updates the same asset instead of creating a second one.
- `namespace` is set explicitly. A new output asset without a namespace becomes a Global asset, visible to every namespace. See [Namespace and Global assets](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#namespace-and-global-assets) before you choose.
- `private_ip` reads `outputs.create_vm.value`. Kestra renders the `assets` block after the task finishes, so the declaration can use the task's own outputs.

Execute the flow with the default inputs.

## Attach an IP address to the VM

The next flow reserves a public IP address for an existing VM. The VM appears in `assets.inputs` and the IP address in `assets.outputs`, so Kestra draws an edge from the VM to the IP address. The `vm` metadata key stores a back-reference, so you can find a VM's IP addresses later with a single lookup.

The `vm_id` input lists the VMs already in the inventory, so you pick a VM instead of typing its ID:

```yaml
id: assign_public_ip
namespace: company.infra

inputs:
  - id: vm_id
    type: SELECT
    expression: '{{ assets(type="io.kestra.plugin.ee.assets.VM", namespace="company.infra") | jq(".[].id") }}'

tasks:
  - id: reserve_ip
    type: io.kestra.plugin.core.debug.Return
    description: Stand-in. Replace with your IP reservation task, for example gcloud compute addresses create.
    format: "35.202.10.100"
    assets:
      inputs:
        - id: "{{ inputs.vm_id }}"
      outputs:
        - id: "{{ inputs.vm_id }}-public-ip"
          namespace: "{{ flow.namespace }}"
          type: company.infra.IPAddress
          metadata:
            address: "{{ outputs.reserve_ip.value }}"
            kind: static
            vm: "{{ inputs.vm_id }}"
```

`company.infra.IPAddress` is a custom type. Kestra has no built-in type for IP addresses, and any string works as a type. Use one naming scheme for custom types across your flows, so filters and dashboards stay consistent.

## Issue a certificate that depends on two resources

A TLS certificate depends on both the VM that serves it and the IP address its DNS name resolves to. Declare both as inputs, and the certificate gets two parents in the dependencies graph.

This flow also uses `assets()` to read the address from the IP address asset instead of asking for it as an input:

```yaml
id: issue_certificate
namespace: company.infra

inputs:
  - id: vm_id
    type: SELECT
    expression: '{{ assets(type="io.kestra.plugin.ee.assets.VM", namespace="company.infra") | jq(".[].id") }}'
  - id: domain
    type: STRING
    defaults: web01.example.com

tasks:
  - id: request_certificate
    type: io.kestra.plugin.core.log.Log
    description: Stand-in. Replace with your certificate task, for example a certbot command in a Shell task.
    message: >
      Requesting a certificate for {{ inputs.domain }}, served by {{ inputs.vm_id }} at
      {{ assets(id=inputs.vm_id ~ '-public-ip') | jq('.[0].metadata.address') | first }}
    assets:
      inputs:
        - id: "{{ inputs.vm_id }}"
        - id: "{{ inputs.vm_id }}-public-ip"
      outputs:
        - id: "cert-{{ inputs.domain | slugify }}"
          namespace: "{{ flow.namespace }}"
          type: company.infra.Certificate
          metadata:
            domain: "{{ inputs.domain }}"
            issuer: letsencrypt
            expires: "{{ now() | dateAdd(90, 'DAYS') | date('yyyy-MM-dd') }}"
            vm: "{{ inputs.vm_id }}"
```

Run `assign_public_ip` for a VM before you run this flow for the same VM, so the `-public-ip` asset exists. If it doesn't exist, Kestra creates it as an `External` placeholder when this flow references it as an input.

## Record snapshots per execution

A snapshot is a point-in-time resource, and every run creates a new one. Append `execution.id` to the ID so each run registers a separate asset instead of overwriting the previous snapshot:

```yaml
id: snapshot_vm
namespace: company.infra

inputs:
  - id: vm_id
    type: SELECT
    expression: '{{ assets(type="io.kestra.plugin.ee.assets.VM", namespace="company.infra") | jq(".[].id") }}'

tasks:
  - id: take_snapshot
    type: io.kestra.plugin.core.log.Log
    description: Stand-in. Replace with your snapshot task.
    message: "Taking a snapshot of {{ inputs.vm_id }}"
    assets:
      inputs:
        - id: "{{ inputs.vm_id }}"
      outputs:
        - id: "{{ inputs.vm_id }}-snapshot-{{ execution.id }}"
          namespace: "{{ flow.namespace }}"
          type: company.infra.Snapshot
          metadata:
            vm: "{{ inputs.vm_id }}"
            taken_at: "{{ execution.startDate }}"
```

Per-execution IDs grow the inventory on every run. Plan a retention policy for them with [`PurgeAssets`](../../10.administrator-guide/purge/index.md#purge-assets-and-lineage-retention).

## Decommission a VM

When you tear a VM down, choose between keeping its record and deleting it:

- Keep the record and mark it as decommissioned when you need an audit trail of what existed.
- Delete the asset when the record has no further value.

This flow tears down the VM, then marks it as decommissioned. It declares the VM again as an output with only the keys that change. Kestra merges metadata key by key, so `provider`, `region`, `os`, and the other keys stay as they were:

```yaml
id: decommission_vm
namespace: company.infra

inputs:
  - id: vm_id
    type: SELECT
    expression: '{{ assets(type="io.kestra.plugin.ee.assets.VM", namespace="company.infra", metadata={"state": "running"}) | jq(".[].id") }}'

tasks:
  - id: destroy_vm
    type: io.kestra.plugin.core.log.Log
    description: Stand-in. Replace with your teardown task, for example terraform destroy.
    message: "Destroying {{ inputs.vm_id }}"
    assets:
      outputs:
        - id: "{{ inputs.vm_id }}"
          type: io.kestra.plugin.ee.assets.VM
          metadata:
            state: decommissioned
            decommissioned_at: "{{ execution.startDate }}"
```

`namespace` is omitted here because the asset already exists, so Kestra keeps its stored namespace.

To delete the IP address and remove it from the inventory, add a [`Delete`](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#delete) task after the teardown:

```yaml
  - id: delete_ip_asset
    type: io.kestra.plugin.kestra.ee.assets.Delete
    assetId: "{{ inputs.vm_id }}-public-ip"
```

`Delete` calls the Kestra API with the credentials configured for SDK tasks. See [Connection properties](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#connection-properties-for-api-based-tasks).

## Verify the result

1. Open **Assets** and filter by type `io.kestra.plugin.ee.assets.VM`. The list shows `web-server-01` with its metadata. After `decommission_vm`, its `state` is `decommissioned`.
2. Open `web-server-01`. On the **Overview** tab, **Downstream Assets** lists the IP address, the certificate, and each snapshot.
3. Open the **Dependencies** tab. The certificate node has two incoming edges, one from the VM and one from the IP address.
4. Open the **Executions** tab. It lists every execution that read or wrote the VM.

To chart the inventory, for example VMs by `env` or `state`, use the [Assets data source](../../09.ui/00.dashboard/index.md#assets-ee-and-cloud-only) in a custom dashboard.

## Next steps

- Run operations against VMs selected from this inventory: [Target fleet operations with asset metadata](../asset-fleet-operations/index.md).
- Review the [asset declaration reference](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md) for update rules and failure behavior.
- Plan IDs, metadata keys, and namespaces with the [asset best practices](../../14.best-practices/13.assets/index.md).
- Explore the graph and lock assets during maintenance in [Manage assets](../../07.enterprise/02.governance/01.assets/03.manage-assets/index.md).
