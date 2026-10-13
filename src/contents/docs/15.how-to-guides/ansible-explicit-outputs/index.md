---
title: Declare Explicit Outputs in Ansible Playbooks with Kestra
h1: Control Ansible Output Exposure with outputsMode EXPLICIT
icon: /src/contents/docs/icons/ansiblecli.svg
stage: Intermediate
version: ">= 2.0.0"
description: Use the bundled kestra Ansible module and outputsMode EXPLICIT to declare only the outputs you need, keeping sensitive per-host data out of Kestra's output store.
---

By default, the [AnsibleCLI](/plugins/plugin-ansible/io.kestra.plugin.ansible.cli.ansiblecli) task captures the full result payload from every Ansible module on every host, including `module_args` and raw return values. If your playbooks handle credentials, connection strings, or host-specific secrets, that raw output lands in Kestra's internal storage where it is visible to anyone with execution access.

Setting `outputsMode: EXPLICIT` changes this behavior. Only the values you declare with the bundled `kestra` Ansible module appear in `outputs`. Everything else in `playbooks` is reduced to a status flag (`changed: true/false`), preserving play-level observability without leaking host data.

## How it works

When `outputsMode: EXPLICIT` is set, the AnsibleCLI task passes `KESTRA_OUTPUTS_MODE=explicit` to the `kestra_logger` callback plugin. The callback then:

1. Collects outputs only from `kestra` module calls — `kestra: outputs: { key: value }` in your playbook.
2. Merges all declared outputs into a single flat dict (last write wins across hosts and module calls).
3. Replaces each host's full result payload in `playbooks` with `{"changed": <bool>}`. Failures and unreachable hosts also retain `msg`.
4. Preserves task status (ok, failed, skipped, unreachable) so you can still inspect play health.

The `kestra` module is bundled with the plugin and injected automatically — no extra installation is needed.

## Enable EXPLICIT mode

Add `outputsMode: EXPLICIT` to your `AnsibleCLI` task:

```yaml
id: deploy
namespace: company.infra

tasks:
  - id: run_playbook
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    outputsMode: EXPLICIT
    containerImage: cytopia/ansible:latest-tools
    inputFiles:
      hosts: |
        [webservers]
        web-01
        web-02
      playbook.yml: |
        - hosts: webservers
          tasks:
            - name: Gather app version
              shell: cat /opt/app/VERSION
              register: version_output

            - name: Declare output
              kestra:
                outputs:
                  app_version: "{{ version_output.stdout }}"
    commands:
      - ansible-playbook -i hosts playbook.yml
```

:::alert{type="info"}
Playbooks are passed via `inputFiles`. If your playbook contains Ansible Jinja expressions like `{{ variable }}`, store the playbook content in `variables:` instead to prevent Kestra from evaluating those expressions before Ansible sees them. See [Avoiding expression conflicts](#avoiding-expression-conflicts).
:::

## Declare outputs with the kestra module

Use `kestra: outputs: { key: value }` anywhere in your playbook tasks. The module name is `kestra` (also resolvable as `ansible.legacy.kestra`).

```yaml
- name: Declare database connection info
  kestra:
    outputs:
      db_host: "{{ hostvars[inventory_hostname]['db_host'] }}"
      schema_version: "{{ schema_version }}"
```

The module always sets `changed: false`. It is safe to run in check mode.

### Avoid using loop

Do not call the `kestra` module inside an Ansible `loop:`. Ansible aggregates loop results under a `results` key, which the callback cannot parse for output collection. A warning is emitted and declared outputs are silently skipped for that task.

```yaml
# WRONG — outputs will not be collected
- name: Declare per-item outputs
  kestra:
    outputs:
      item: "{{ item }}"
  loop: [a, b, c]

# CORRECT — call the module once with all values
- name: Declare outputs
  kestra:
    outputs:
      items: [a, b, c]
```

## Access outputs downstream

Declared outputs are available under `outputs.<task_id>.outputs`:

```yaml
- id: next_task
  type: io.kestra.plugin.core.log.Log
  message: "{{ outputs.run_playbook.outputs.app_version }}"
```

Where `run_playbook` is the `id` of your `AnsibleCLI` task and `app_version` is the key you declared.

## Output structure: ALL vs EXPLICIT

Both modes share the same `outputs` shape — a flat dict of keys declared via `kestra: outputs:`. The difference is what gets stripped from `playbooks`.

**ALL mode** (default): full per-host task results are kept in `playbooks`. `outputs` contains only the values explicitly declared with the `kestra` module (empty if none were declared).

```json
{
  "outputs": {
    "app_version": "1.4.2"
  },
  "playbooks": [
    {
      "plays": [
        {
          "tasks": [
            {
              "hosts": {
                "web-01": { "changed": true, "stdout": "1.4.2", "rc": 0 }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

**EXPLICIT mode**: each host's full result is replaced with `{"changed": <bool>}` in `playbooks`. `outputs` still contains only the declared `kestra` module values.

```json
{
  "outputs": {
    "app_version": "1.4.2"
  },
  "playbooks": [
    {
      "plays": [
        {
          "tasks": [
            {
              "hosts": {
                "web-01": { "changed": true }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

By default, full per-host results are offloaded to a file at `resultsUri` (`resultsStorage: STORE`). Set `resultsStorage: INLINE` to keep them in `playbooks` directly — use this when you need to iterate over host results in a downstream task. See [`resultsStorage` and `resultsUri`](#resultsstorage-and-resultsuri) for size limits.

## `resultsStorage` and `resultsUri`

By default (`resultsStorage: STORE`), AnsibleCLI offloads the full per-host Ansible results to an internal storage file. The URI is available at `outputs.<task_id>.resultsUri`. The inline `playbooks` structure still contains task-level metadata and changed/failed status, but individual host result objects are omitted.

Set `resultsStorage: INLINE` to keep full results inside `playbooks` directly. Use this when a downstream Loop or expression needs to navigate individual host results. Large playbooks with many hosts will increase output size — the default `maxOutputsSize` is 512 KB.

```yaml
tasks:
  - id: run_playbook
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    resultsStorage: INLINE
    outputsMode: EXPLICIT
    ...
```

:::alert{type="info"}
`stdout_lines` and `stderr_lines` fields are no longer included in host results. To work with output line-by-line, split `stdout` on newlines in a downstream expression: `{{ outputs.run_playbook.outputs.my_output.split('\n') }}`.
:::

## Multi-host output merging

When multiple hosts call `kestra: outputs:` with the same key, the last write wins. If hosts run in parallel, which host writes last is non-deterministic. Use one of these patterns for predictable results:

**Run the declaration on one host only:**

```yaml
- name: Declare run-level output
  kestra:
    outputs:
      cluster_leader: "{{ inventory_hostname }}"
  run_once: true
  delegate_to: localhost
```

**Key by hostname for per-host values:**

```yaml
- name: Declare per-host version
  kestra:
    outputs:
      "version_{{ inventory_hostname }}": "{{ app_version }}"
```

## Avoiding expression conflicts

Ansible uses `{{ variable }}` for Jinja2 expressions, and so does Kestra's Pebble templating engine. When a playbook is defined inline in a Kestra flow (for example, in `inputFiles` or as a flow variable), Kestra evaluates its own `{{ }}` expressions before passing the file to Ansible — which breaks Ansible's expressions.

Store playbooks that contain Ansible Jinja expressions in `variables:` to prevent Kestra from evaluating their `{{ }}` expressions:

```yaml
id: deploy
namespace: company.infra

variables:
  playbook: |
    - hosts: webservers
      tasks:
        - name: Gather version
          shell: cat /opt/app/VERSION
          register: result

        - name: Declare output
          kestra:
            outputs:
              version: "{{ result.stdout }}"

tasks:
  - id: run_playbook
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    outputsMode: EXPLICIT
    containerImage: cytopia/ansible:latest-tools
    inputFiles:
      hosts: |
        [webservers]
        web-01
      playbook.yml: "{{ vars.playbook }}"
    commands:
      - ansible-playbook -i hosts playbook.yml
```

The `vars.playbook` reference is resolved by Kestra, returning the raw playbook string. Ansible then evaluates `{{ result.stdout }}` as expected.

## Custom ansibleConfig

If you supply a custom `ansibleConfig`, you must manually include the `library` path so Ansible can find the bundled `kestra` module. Without it, `kestra: outputs:` tasks will fail with a module-not-found error.

```yaml
tasks:
  - id: run_playbook
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    outputsMode: EXPLICIT
    ansibleConfig: |
      [defaults]
      library = ./library
      stdout_callback = kestra_logger
      callbacks_enabled = kestra_logger
    commands:
      - ansible-playbook -i hosts playbook.yml
```

:::alert{type="warning"}
The exact `ansibleConfig` lines required alongside `library = ./library` depend on how the plugin configures the callback. Confirm the required fields in a test run before deploying to production. A missing callback line will silently fall back to `ALL` mode behavior.
:::

## Upgrading from plugin-ansible v1.x

Plugin-ansible v2.0.0 changed the output shape. Flows that read AnsibleCLI outputs downstream will need updating.

| What changed | Old expression | New expression |
|---|---|---|
| `vars.playbooks` removed | `outputs.<id>.vars.playbooks[...]` | `outputs.<id>.playbooks[...]` |
| `vars.outputs` in ALL mode no longer holds raw host results | `outputs.<id>.vars.outputs[0].host` | `outputs.<id>.playbooks[0].plays[0].tasks[0].hosts` (or read `resultsUri`) |
| Full per-host results offloaded by default | `outputs.<id>.playbooks[...].hosts["web-01"].stdout` | `{{ read(outputs.<id>.resultsUri) }}` or set `resultsStorage: INLINE` |
| `stdout_lines` / `stderr_lines` removed | `outputs.<id>.playbooks[...].stdout_lines` | Split `stdout` on newlines downstream |

`maxOutputsSize` now measures the whole serialized task output rather than just the playbooks payload. If tasks start failing with an oversized output error, raise `maxOutputsSize`, switch to `resultsStorage: STORE`, or use `outputsMode: EXPLICIT`.

## What EXPLICIT mode does not protect

`outputsMode: EXPLICIT` controls what is stripped from the `playbooks` result and what appears in `outputs`. It does not affect:

- **Ansible verbose logging** (`-v`, `-vv`, etc.) — verbose output still appears in task logs.
- **`log_path`** in `ansible.cfg` — if set, Ansible writes its full log to that path.
- **Kestra task logs** — stdout from shell commands and module output may appear in execution logs.

If your playbooks handle highly sensitive data, use `no_log: true` on individual tasks to suppress their output from Ansible's own logging, and avoid enabling verbose mode.
