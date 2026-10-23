---
title: Target Fleet Operations with Asset Metadata in Kestra
h1: Target Fleet Operations with Asset Metadata
description: Select servers from the Kestra asset inventory by metadata, run patching or audits against them, and stamp the results back onto each asset.
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
editions: ["EE", "Cloud"]
topics:
  - DevOps
  - Kestra Concepts
---

Pick the servers for an operation, such as patching or a compliance audit, from your asset inventory by metadata, then write the result back onto each server's asset.

Fleet operations usually start with a list of hostnames that someone pastes into a script or a form. That list drifts from reality, and nobody records which servers the operation actually touched. When your VMs are [assets](../../07.enterprise/02.governance/01.assets/index.md), a flow can select its targets from the live inventory and update each asset when it finishes, so the next run starts from current data.

## Prerequisites

- A Kestra Enterprise Edition or Kestra Cloud instance.
- VM assets in the `company.infra` namespace with `env`, `os`, and `private_ip` metadata. To create them, follow [Build a live inventory of the infrastructure your flows provision](../asset-infrastructure-inventory/index.md).
- The `ASSET` `VIEW` and `LIST` permissions to see the inventory, and SDK credentials with `ASSET` `LIST` for the scheduled `List` example.

The examples use [`Shell Commands`](/plugins/plugin-script-shell/io.kestra.plugin.scripts.shell.commands) tasks that only print what they would do, so you can run them safely. Replace them with a real task, such as [`io.kestra.plugin.fs.ssh.Command`](/plugins/plugin-fs/ssh/io.kestra.plugin.fs.ssh.command) or an Ansible task, when you're ready.

## Let operators pick targets from the inventory

This flow patches the production Ubuntu servers an operator selects. The `servers` input calls `assets()` when the operator opens the execution form, so the options always match the current inventory:

```yaml
id: patch_servers
namespace: company.infra

inputs:
  - id: servers
    type: MULTISELECT
    expression: '{{ assets(type="io.kestra.plugin.ee.assets.VM", namespace="company.infra", metadata={"env": "prod", "os": "ubuntu-22.04"}) | jq(".[].id") }}'
  - id: os_version
    type: STRING
    defaults: "22.04.5"

tasks:
  - id: for_each_server
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ inputs.servers }}"
    tasks:
      - id: patch
        type: io.kestra.plugin.scripts.shell.Commands
        description: Stand-in. Replace with an SSH or Ansible task that runs the upgrade.
        taskRunner:
          type: io.kestra.plugin.core.runner.Process
        commands:
          - echo "Patching {{ item.value }} at {{ assets(id=item.value) | jq('.[0].metadata.private_ip') | first }} to {{ inputs.os_version }}"
        assets:
          inputs:
            - id: "{{ item.value }}"
          outputs:
            - id: "{{ item.value }}"
              type: io.kestra.plugin.ee.assets.VM
              metadata:
                os_version: "{{ inputs.os_version }}"
                last_patched: "{{ now() }}"
                last_patched_by: "{{ execution.id }}"
```

Notice these parts of the flow:

- `assets()` filters on the full type string, a namespace, and two metadata values. The `namespace` argument also matches child namespaces such as `company.infra.eu`. Without it, the function doesn't filter by namespace. If you restrict allowed namespaces in your tenant, read the `namespace` note in the [assets() reference](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#assets-pebble-function).
- `assets(id=item.value) | jq('.[0].metadata.private_ip') | first` looks up one value for the current server. `jq` returns a list, and `first` takes its only item.
- The `patch` task declares the server as an output with only the keys that change. Kestra merges metadata key by key, so `env`, `os`, `private_ip`, and the other stored keys stay unchanged. `namespace` is omitted because the asset already exists, so its stored namespace is kept.
- If `patch` fails for a server, Kestra doesn't update that server's asset, so `last_patched` only moves forward on success.

Execute the flow and select one or more servers.

## Run the operation on a schedule

For an operation without an operator, such as a weekly patch window, query the inventory with the [`List`](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#list) task instead of an input. `List` with `fetchType: FETCH` returns the matching assets as `outputs.<task_id>.assets`:

```yaml
id: weekly_patch_window
namespace: company.infra

tasks:
  - id: find_servers
    type: io.kestra.plugin.kestra.ee.assets.List
    namespace: company.infra
    types:
      - io.kestra.plugin.ee.assets.VM
    metadataQuery:
      - field: env
        type: EQUAL_TO
        value: prod
      - field: state
        type: EQUAL_TO
        value: running
    fetchType: FETCH

  - id: for_each_server
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ outputs.find_servers.assets | jq('.[].id') }}"
    tasks:
      - id: patch
        type: io.kestra.plugin.scripts.shell.Commands
        description: Stand-in. Replace with an SSH or Ansible task that runs the upgrade.
        taskRunner:
          type: io.kestra.plugin.core.runner.Process
        commands:
          - echo "Patching {{ item.value }}"
        assets:
          inputs:
            - id: "{{ item.value }}"
          outputs:
            - id: "{{ item.value }}"
              type: io.kestra.plugin.ee.assets.VM
              metadata:
                last_patched: "{{ now() }}"

triggers:
  - id: sunday_night
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 2 * * 0"
```

`List` and `assets()` filter namespaces differently. `List` matches the exact namespace only, while `assets()` also matches child namespaces. `List` calls the Kestra API with the credentials configured for SDK tasks. See [Connection properties](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#connection-properties-for-api-based-tasks).

## Audit compliance and remediate

The same pattern splits an audit into two steps. One flow checks each server and stamps the result as metadata. Another flow selects only the servers that failed.

This audit flow checks every running VM and records `compliance_status` on each one. The check runs in a script, so the script emits the asset itself with an [asset log line](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#emit-assets-from-a-script), and the task sets `assets.enableAuto: true` to accept it:

```yaml
id: audit_security_agent
namespace: company.infra

tasks:
  - id: for_each_server
    type: io.kestra.plugin.core.flow.Loop
    values: '{{ assets(type="io.kestra.plugin.ee.assets.VM", namespace="company.infra", metadata={"state": "running"}) | jq(".[].id") }}'
    tasks:
      - id: check_agent
        type: io.kestra.plugin.scripts.shell.Commands
        description: Stand-in. Replace the STATUS line with a real check of the security agent on the server.
        taskRunner:
          type: io.kestra.plugin.core.runner.Process
        commands:
          - |
            STATUS=compliant
            echo "::{\"assets\": {\"outputs\": [{\"id\": \"{{ item.value }}\", \"type\": \"io.kestra.plugin.ee.assets.VM\", \"metadata\": {\"compliance_status\": \"$STATUS\"}}]}}::"
        assets:
          enableAuto: true
```

The emitted asset carries only `compliance_status`, so the merge keeps every other metadata key on the server.

The remediation flow then targets only the non-compliant servers, either with a `MULTISELECT` input as in the first section or on a schedule:

```yaml
values: '{{ assets(type="io.kestra.plugin.ee.assets.VM", namespace="company.infra", metadata={"compliance_status": "non_compliant"}) | jq(".[].id") }}'
```

## Verify the result

1. Open the execution of `patch_servers` and check the logs of each `patch` task run. Each line shows the server ID and the IP address that `assets()` returned.
2. Open **Assets**, then one of the patched servers. On the **Overview** tab, **Asset Values** shows the new `os_version`, `last_patched`, and `last_patched_by` keys next to the keys from provisioning.
3. Open the **Executions** tab. The `patch_servers` execution appears in the list of executions that used the server.
4. Run `audit_security_agent`, then filter the **Assets** list by the `compliance_status` metadata key to see which servers passed.

## Next steps

- Stop two operations from changing the same server at once: [Prevent concurrent changes to a resource](../asset-locks/index.md).
- Look up every argument of `assets()` and `List` in the [asset tasks and triggers reference](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md).
- Review how re-declared outputs merge in the [update rules](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#update-rules).
- Choose metadata keys that make these filters reliable with the [asset best practices](../../14.best-practices/13.assets/index.md).
