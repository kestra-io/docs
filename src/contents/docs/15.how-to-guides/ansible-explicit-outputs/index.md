---
title: Control Ansible Playbook Outputs to Protect Sensitive Data
h1: Expose Only What You Need from Ansible Playbooks
icon: /src/contents/docs/icons/ansiblecli.svg
stage: Intermediate
topics:
  - Integrations
description: Use outputsMode EXPLICIT and the bundled kestra module to declare exactly which Ansible playbook values become Kestra task outputs, keeping credentials and sensitive data out of execution logs.
---

Control which Ansible playbook values appear as Kestra task outputs using `outputsMode: EXPLICIT` and the bundled `kestra` module.

By default, `AnsibleCLI` captures every per-host result of every playbook task and stores all of them in `{{ outputs.<task>.vars.outputs }}`. When a playbook fetches credentials, Active Directory objects, or other sensitive data, those values end up in execution outputs and logs — visible to anyone who can read the execution. Setting `no_log: true` on a task censors the result but breaks output capture entirely, leaving no clean way to pass values downstream.

`outputsMode: EXPLICIT` solves this by letting the playbook declare exactly what becomes a Kestra output, while redacting everything else.

## How it works

Add `outputsMode: EXPLICIT` to the `AnsibleCLI` task. Inside the playbook, use the bundled `kestra` module to declare the values downstream tasks should see:

```yaml
- name: Declare what downstream tasks may see
  kestra:
    outputs:
      records_updated: "{{ records_updated }}"
      work_status: "ok"
```

In `EXPLICIT` mode:
- Only values declared via `kestra:` appear in `{{ outputs.<task>.vars.outputs }}` — as a flat map, not a list
- Per-host result payloads are redacted to `{"changed": <bool>}` in both outputs and live logs
- Task names, timings, and statuses (`ok` / `failed` / `skipped` / `unreachable`) are preserved
- Multiple `kestra:` calls merge by key; the last write wins

In `ALL` mode (the default), behavior is unchanged — every per-host result is captured as before.

## Basic example

This playbook fetches a credential object and performs work. Only `records_updated` and `work_status` are exposed to Kestra; the credential object never appears in outputs or logs.

```yaml
id: ansible_explicit_outputs
namespace: company.team

variables:
  playbook: |
    ---
    - hosts: localhost
      tasks:
        - name: Fetch credentials needed by the automation
          ansible.builtin.set_fact:
            credential:
              username: svc-automation
              password: "not-for-kestra-outputs"

        - name: Do the work
          ansible.builtin.set_fact:
            records_updated: 3
          register: work_result

        - name: Declare what downstream tasks may see
          kestra:
            outputs:
              records_updated: "{{ records_updated }}"
              work_status: "{{ 'skipped' if work_result.skipped | default(false) else 'ok' }}"

tasks:
  - id: ansible_task
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    outputsMode: EXPLICIT
    inputFiles:
      playbook.yml: "{{ vars.playbook }}"
    containerImage: cytopia/ansible:latest-tools
    commands:
      - ansible-playbook -i localhost -c local playbook.yml
```

Access the declared values downstream with `{{ outputs.ansible_task.vars.outputs.records_updated }}`.

## Distinguishing skipped from failed

A common pattern in Active Directory and CMDB automations is that a missing permission causes Ansible to skip a task rather than fail it. In `ALL` mode this distinction gets buried in the raw result payload. In `EXPLICIT` mode you can surface it cleanly:

```yaml
- name: Attempt AD lookup
  ansible.windows.win_shell: Get-ADUser -Identity {{ ad_user }}
  register: ad_result
  failed_when: false

- name: Expose result status
  kestra:
    outputs:
      ad_user: "{{ ad_user }}"
      ad_status: "{{ 'skipped' if ad_result.skipped | default(false) else ('failed' if ad_result.rc | default(0) != 0 else 'ok') }}"
```

Downstream tasks can then branch on `{{ outputs.ansible_task.vars.outputs.ad_status }}` without parsing raw result payloads.

## Multi-host outputs

The `kestra` module runs on whichever host executes the task and the result is always returned to the controller. For outputs that should reflect the run as a whole rather than a single host, use `run_once: true` or `delegate_to: localhost`:

```yaml
- name: Summarize across all hosts
  kestra:
    outputs:
      hosts_updated: "{{ ansible_play_hosts | length }}"
      completed_at: "{{ ansible_date_time.iso8601 }}"
  run_once: true
```

For per-host outputs, key them by hostname in the playbook so they merge rather than overwrite:

```yaml
- name: Expose per-host result
  kestra:
    outputs:
      "{{ inventory_hostname }}_status": "{{ task_result.rc | default(0) == 0 | ternary('ok', 'failed') }}"
```

## Custom `ansibleConfig`

If you supply your own `ansibleConfig`, the generated config is skipped entirely. Include these lines to keep the `kestra` module resolvable and the callback active:

```yaml
tasks:
  - id: ansible_task
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    outputsMode: EXPLICIT
    ansibleConfig: |
      [defaults]
      callback_plugins  = ./callback_plugins
      callbacks_enabled = kestra_logger
      stdout_callback   = ansible.builtin.null
      library           = ./library
```

`library = ./library` is required for the bundled `kestra` module to resolve. Without it, the `kestra:` task fails with a module-not-found error.

## What EXPLICIT mode does not redact

Redaction only covers what the bundled callback emits. These remain unaffected:

- **Ansible's own log file** — if `log_path` is set in `ansibleConfig`, the log file can still contain raw task output. Use `no_log: true` on sensitive tasks alongside `outputsMode: EXPLICIT`.
- **Verbose stdout** — dropping `stdout_callback = ansible.builtin.null` from `ansibleConfig` re-enables Ansible's default stdout printer, which can print raw results on failures or verbose runs. Keep that line to preserve redaction.
- **The `debug` module** — `ansible.builtin.debug` always prints to stdout regardless of mode.

:::alert{type="info"}
For the general `AnsibleCLI` task reference, see the [plugin documentation](/plugins/plugin-ansible/io.kestra.plugin.ansible.cli.ansiblecli). For system audit and reporting examples, see [Use Ansible Playbooks to Check Resources and Automate Updates](../ansible/index.md).
:::
