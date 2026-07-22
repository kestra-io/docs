---
title: Azure Virtual Machine Task Runner – Run Tasks Natively on Azure VMs
h1: Execute Kestra Tasks Natively on Azure Virtual Machines
sidebarTitle: Azure Virtual Machine Task Runner
icon: /src/contents/docs/icons/concepts.svg
editions: ["EE", "Cloud"]
description: Execute tasks natively on Azure VMs via the Azure Run Command API — no SSH, no container runtime, and no public IP required.
---

Run tasks natively on Azure VMs via the [Azure Run Command API](https://learn.microsoft.com/en-us/azure/virtual-machines/run-command-overview) — no SSH, no container runtime, and no public IP required.

## When to use the Azure VM task runner

Use the Azure VM task runner when your workload cannot or should not run inside a container:

- **GPU workloads** that require a specific VM image with pre-installed CUDA or proprietary drivers
- **Non-containerized scripts** that depend on locally installed binaries or licensed software tied to a specific OS image
- **Existing VM reuse** when you have a pre-configured VM you want to target without creating new infrastructure per run
- **Network-sensitive workloads** that must run inside a specific VNet subnet without any public endpoint

For containerized workloads on Azure, use the [Azure Batch task runner](../06.azure-batch-task-runner/index.md) instead.

## How it works

For each task run, the Azure VM task runner:

1. Provisions a new Azure VM (or targets an existing one via `vmName`) and waits for it to reach `running` state (up to `instanceReadyTimeout`, default 5 minutes)
2. If `blobStorage` is set, uploads `inputFiles` and `namespaceFiles` to the configured blob container from the Kestra worker
3. Sends the task's commands to the VM via the Azure Run Command API, which also downloads input files from blob storage and uploads output files on the VM side
4. Polls for Run Command completion every `completionCheckInterval` (default 5 seconds) until the command finishes or `waitUntilCompletion` (default 1 hour) elapses
5. Downloads `outputFiles` from blob storage to Kestra internal storage once the command completes
6. Deallocates or deletes the VM according to `stopVm` and `deleteVm` settings

This runner ignores the `containerImage` property — commands execute directly on the VM OS. The default image is Ubuntu 22.04 LTS (`Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2`); override it with the `image` property.

:::alert{type="info"}
If the Kestra Worker restarts mid-run, the runner re-issues the Run Command against the same VM (`resume: true` by default). Unlike the AWS EC2 runner, the Azure Run Command API is synchronous and has no reattachable command ID — ensure your scripts are idempotent.
:::

The following Pebble expressions and environment variables are available inside the task:

| Pebble expression | Environment variable | Description |
|---|---|---|
| `{{ workingDir }}` | `WORKING_DIR` | Path to the task's working directory on the VM where input files are placed |
| `{{ outputDir }}` | `OUTPUT_DIR` | Path to the output directory; all files written here are automatically captured |
| `{{ bucketPath }}` | `BUCKET_PATH` | Blob storage path to the task's staging folder in the configured container (only available when `blobStorage` is set) |

## Instance modes

### New VM (default)

When `vmName` is not set, the runner creates a new VM for each task run. You must provide:

- `region` — Azure region (e.g., `eastus`, `westeurope`)
- `vmSize` — VM size (e.g., `Standard_DS1_v2`, `Standard_NC6`)
- `subnetId` — full resource ID of an existing subnet

The runner creates the VM, a managed OS disk, and a network interface using the specified subnet. The VM is placed in the resource group identified by `resourceGroupName`.

The runner generates VM names automatically from the execution context, up to 60 characters.

### Existing VM

When `vmName` is set, the runner targets an existing VM rather than creating one. In this mode:

- The runner never stops or deletes the VM after the task — `stopVm` and `deleteVm` are ignored
- The runner starts the VM if it is not already running, but leaves it running when the task finishes
- `region`, `vmSize`, and `subnetId` are not required
- The topology detail for the run always shows status `running`

## File handling

File transfer between the Kestra worker and the VM uses Azure Blob Storage. Set `blobStorage` with a `connectionString` and `containerName` to enable:

```yaml
blobStorage:
  connectionString: "{{ secret('AZURE_STORAGE_CONNECTION_STRING') }}"
  containerName: kestra-staging
```

When `blobStorage` is set:
- The Kestra worker uploads `inputFiles` and `namespaceFiles` to the container before the Run Command starts
- The VM script downloads them to the working directory
- The VM script uploads declared `outputFiles` (or all files in `{{ outputDir }}`) back to the container after the command finishes
- The Kestra worker retrieves the output files from blob storage

Without `blobStorage`, `inputFiles`, `outputFiles`, `namespaceFiles`, and `{{ outputDir }}` are unavailable.

**Subnet outbound access**: The VM needs outbound network access to `*.blob.core.windows.net` for file staging. Ensure your subnet's route table and network security group allow this traffic.

**SAS token scope**: The runner generates a container-scoped SAS token (not path-scoped) for the VM to authenticate against blob storage. The token lifetime equals `waitUntilCompletion` + `instanceReadyTimeout` + 15 minutes. Any process on the VM with access to the token can reach any object in the container.

## Authentication

The runner uses the Azure SDK `AzureResourceManager` client for VM operations. Two authentication modes are available:

**Service principal**: Provide all three of `tenantId`, `clientId`, and `clientSecret`. You must set all three or none — providing one or two throws an error at startup.

```yaml
tenantId: "{{ secret('AZURE_TENANT_ID') }}"
clientId: "{{ secret('AZURE_CLIENT_ID') }}"
clientSecret: "{{ secret('AZURE_CLIENT_SECRET') }}"
```

**Managed identity (DefaultAzureCredential)**: Leave all three unset. The SDK falls back to `DefaultAzureCredential`, which picks up a managed identity assigned to the Kestra worker VM, environment variables, or other ambient credentials in the Azure SDK credential chain.

:::alert{type="info"}
**Running on Kestra Cloud?** The Cloud control plane runs outside your Azure subscription and has no managed identity to supply. Static `tenantId` / `clientId` / `clientSecret` credentials are required.
:::

## Azure RBAC requirements

The service principal or managed identity used by Kestra needs the following permissions on the resource group:

| Role | Scope | Required for |
|---|---|---|
| `Contributor` | Resource group | Create/start/stop/deallocate/delete VMs, NICs, managed disks; execute Run Commands |

The `Contributor` role is the practical minimum because creating network interfaces requires permissions (`Microsoft.Network/networkInterfaces/write`) not included in `Virtual Machine Contributor` alone.

For least-privilege setups, combine these built-in roles:
- `Virtual Machine Contributor` — VM lifecycle and Run Command execution
- `Network Contributor` — NIC creation and deletion

When using a connection string, blob storage authentication uses the storage account key directly — no Azure RBAC role is required.

## Instance lifecycle

After the task finishes (success, failure, or timeout), the runner acts on the VM according to two properties:

| Property | Default | Behavior |
|---|---|---|
| `stopVm` | `true` | Deallocates the VM (stops compute billing). The VM can be restarted. |
| `deleteVm` | `true` | Deletes the VM, its NIC, and its OS disk. |

Setting `stopVm: false, deleteVm: false` keeps the VM running between task runs. This is useful for slow-to-boot custom images or when startup time is a concern.

:::alert{type="warning"}
`stopVm` and `deleteVm` have no effect when `vmName` is set. The runner never manages the lifecycle of a user-specified existing VM.
:::

The topology detail result (`AzureVmRunnerDetailResult`) reports the VM's final status:

| Condition | Reported `status` |
|---|---|
| `deleteVm: true` and task completed | `deleted` |
| `stopVm: true`, `deleteVm: false`, task completed | `stopped` |
| `stopVm: false` and `deleteVm: false` (Kestra-created VM) | `running` |

## Caveats and platform limits

**4 KB output cap**: Azure Run Command captures at most approximately 4 KB of stdout and 4 KB of stderr. Output beyond that limit is silently truncated by the Azure platform. For scripts that produce large output, redirect stdout to a file inside `{{ workingDir }}` and declare it as an `outputFile`, or set `syncWorkingDirectory: true` to download the entire working directory.

**No live log streaming**: Run Command output is not emitted until the command finishes. Kestra execution logs show task output only after the command completes, not in real time.

**Synchronous Run Command**: The Run Command API does not return a reattachable command ID. If the Worker restarts mid-run with `resume: true`, the runner re-issues the entire command against the same VM. Write scripts to be idempotent.

**No container**: The `containerImage` task property is ignored. All commands execute directly on the VM OS.

## Example flows

### Run a Python script on a new VM

```yaml
id: azure_vm_python
namespace: company.team

tasks:
  - id: python
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.ee.azure.runner.VirtualMachine
      tenantId: "{{ secret('AZURE_TENANT_ID') }}"
      clientId: "{{ secret('AZURE_CLIENT_ID') }}"
      clientSecret: "{{ secret('AZURE_CLIENT_SECRET') }}"
      subscriptionId: "{{ secret('AZURE_SUBSCRIPTION_ID') }}"
      resourceGroupName: kestra-rg
      region: eastus
      vmSize: Standard_DS1_v2
      subnetId: "{{ secret('AZURE_SUBNET_ID') }}"
    script: |
      print("Hello from Azure VM")
```

### Reuse an existing VM

Set `vmName` to target a pre-configured VM. Set `stopVm: false` and `deleteVm: false` so the runner does not touch the VM's lifecycle.

```yaml
id: azure_vm_existing
namespace: company.team

tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.ee.azure.runner.VirtualMachine
      tenantId: "{{ secret('AZURE_TENANT_ID') }}"
      clientId: "{{ secret('AZURE_CLIENT_ID') }}"
      clientSecret: "{{ secret('AZURE_CLIENT_SECRET') }}"
      subscriptionId: "{{ secret('AZURE_SUBSCRIPTION_ID') }}"
      resourceGroupName: kestra-rg
      vmName: my-existing-vm
      stopVm: false
      deleteVm: false
    commands:
      - echo "Running on existing VM"
```

### Pass input and output files via blob storage

```yaml
id: azure_vm_files
namespace: company.team

inputs:
  - id: file
    type: FILE

tasks:
  - id: process
    type: io.kestra.plugin.scripts.shell.Commands
    inputFiles:
      data.txt: "{{ inputs.file }}"
    outputFiles:
      - result.txt
    taskRunner:
      type: io.kestra.plugin.ee.azure.runner.VirtualMachine
      tenantId: "{{ secret('AZURE_TENANT_ID') }}"
      clientId: "{{ secret('AZURE_CLIENT_ID') }}"
      clientSecret: "{{ secret('AZURE_CLIENT_SECRET') }}"
      subscriptionId: "{{ secret('AZURE_SUBSCRIPTION_ID') }}"
      resourceGroupName: kestra-rg
      region: eastus
      vmSize: Standard_DS1_v2
      subnetId: "{{ secret('AZURE_SUBNET_ID') }}"
      blobStorage:
        connectionString: "{{ secret('AZURE_STORAGE_CONNECTION_STRING') }}"
        containerName: kestra-staging
    commands:
      - cp "{{ workingDir }}/data.txt" "{{ workingDir }}/result.txt"
```

## Key properties

| Property | Required | Default | Description |
|---|---|---|---|
| `subscriptionId` | Yes | — | Azure subscription ID that owns the resource group. |
| `resourceGroupName` | Yes | — | Resource group where VMs are created or where the target VM lives. |
| `tenantId` | No | — | Azure AD tenant ID for service principal auth. Must be set with `clientId` and `clientSecret`. |
| `clientId` | No | — | Service principal client ID. |
| `clientSecret` | No | — | Service principal client secret. |
| `region` | No | — | Azure region (e.g., `eastus`). Required when creating a new VM. |
| `vmSize` | No | — | Azure VM size (e.g., `Standard_DS1_v2`). Required when creating a new VM. |
| `subnetId` | No | — | Full resource ID of an existing subnet. Required when creating a new VM. |
| `vmName` | No | — | Target an existing VM instead of creating one. Runner never creates, stops, or deletes this VM. |
| `image` | No | `Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2` | VM image in `publisher:offer:sku` format. |
| `stopVm` | No | `true` | Deallocate the VM after the task (stops compute billing). Ignored when `vmName` is set. |
| `deleteVm` | No | `true` | Delete the VM, NIC, and OS disk after the task. Ignored when `vmName` is set. |
| `blobStorage` | No | — | Blob storage config (`connectionString`, `containerName`) for file staging. Required when using `inputFiles`, `outputFiles`, or `namespaceFiles`. |
| `resume` | No | `true` | Re-issue the Run Command against the same VM if the Kestra Worker restarts. |
| `waitUntilCompletion` | No | `PT1H` | Maximum time to wait for the Run Command to finish. |
| `completionCheckInterval` | No | `PT5S` | How often to poll for Run Command completion. |
| `instanceReadyTimeout` | No | `PT5M` | Maximum time to wait for the VM to reach `running` state. |
| `syncWorkingDirectory` | No | `false` | Download the entire VM working directory instead of only declared `outputFiles`. |

For the full property reference, see the [plugin documentation](/plugins/plugin-ee-azure/azure-runner/io.kestra.plugin.ee.azure.runner.virtualmachine).
