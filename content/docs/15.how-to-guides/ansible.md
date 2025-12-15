---
title: Orchestrate Ansible with Kestra
icon: /docs/icons/tutorial.svg
---

Run Ansible playbooks from Kestra and coordinate downstream infrastructure tasks.

Ansible is an agentless automation tool that uses YAML playbooks to describe desired state and apply it over SSH or APIs. Teams rely on it to install software, manage configs, update systems, and provision cloud infrastructure.

## System report playbook (cross-platform)

This playbook audits a host without assuming the OS, captures diagnostics, and upgrades `python3` when needed using the appropriate package manager (`apt`, `yum`, or Homebrew). It writes a JSON report to `./system_info.json`. You can extend the same pattern to a real-world fleet by adding an inventory of servers or laptops, running over SSH instead of `localhost`, and inserting more version/presence checks for tools your team depends on (e.g., `node`, `aws`, `kubectl`). In multi-machine mode, facts and JSON outputs can be aggregated centrally to spot drift and trigger remediations.

:::collapse{title="View the playbook"}
```yaml
---
- name: Collect and report system information (system agnostic)
  hosts: localhost
  connection: local
  gather_facts: true

  vars:
    system_info_output: "./system_info.json"
    python3_min_version: "3.11.0"

  tasks:
    - name: Show basic system summary
      ansible.builtin.debug:
        msg:
          - "Hostname: {{ ansible_facts['hostname'] | default('unknown') }}"
          - "OS family: {{ ansible_facts['os_family'] | default('unknown') }}"
          - "Distribution: {{ ansible_facts['distribution'] | default('') }} {{ ansible_facts['distribution_version'] | default('') }}"
          - "Kernel: {{ ansible_facts['kernel'] | default('unknown') }}"
          - "Architecture: {{ ansible_facts['architecture'] | default('unknown') }}"
          - "CPU(s): {{ ansible_facts['processor_vcpus'] | default('unknown') }}"
          - "Total RAM (MB): {{ ansible_facts['memtotal_mb'] | default('unknown') }}"
          - "Primary IP: {{ ansible_facts['default_ipv4']['address'] | default('unknown') }}"

    # -----------------------------
    # Extra checks / diagnostics
    # -----------------------------

    - name: Check overall disk usage (df -h)
      ansible.builtin.command: df -h
      register: disk_usage
      changed_when: false
      failed_when: false   # in case df is not available

    - name: Check load average and uptime
      ansible.builtin.command: uptime
      register: uptime_cmd
      changed_when: false
      failed_when: false

    - name: Show top 5 memory-hungry processes
      ansible.builtin.shell: |
        ps aux | head -n 1
        ps aux | sort -nrk 4 | head -n 5
      register: top_mem_processes
      changed_when: false
      failed_when: false

    # -----------------------------
    # Python3 detection & version
    # -----------------------------

    - name: Check if python3 is installed
      ansible.builtin.command: python3 --version
      register: python3_check
      failed_when: false
      changed_when: false

    - name: Parse python3 version
      ansible.builtin.set_fact:
        python3_installed: "{{ python3_check.rc == 0 }}"
        python3_version: >-
          {{
            (python3_check.stdout.split()[1])
            if (python3_check.rc == 0 and (python3_check.stdout | length > 0))
            else 'unknown'
          }}

    - name: Debug python3 detection
      ansible.builtin.debug:
        msg:
          - "python3 installed: {{ python3_installed }}"
          - "python3 version: {{ python3_version }}"

    # -----------------------------
    # OS family convenience flags
    # -----------------------------

    - name: Set OS family flags
      ansible.builtin.set_fact:
        os_family: "{{ ansible_facts['os_family'] | default('Unknown') }}"
        is_debian: "{{ ansible_facts['os_family'] == 'Debian' }}"
        is_redhat: "{{ ansible_facts['os_family'] == 'RedHat' }}"
        is_darwin: "{{ ansible_facts['os_family'] == 'Darwin' }}"

    # -----------------------------
    # Decide if python3 upgrade is needed
    # -----------------------------

    - name: Decide if python3 upgrade is needed
      ansible.builtin.set_fact:
        python3_needs_upgrade: >-
          {{
            python3_installed
            and python3_version != 'unknown'
            and (python3_version is version(python3_min_version, '<'))
          }}

    - name: Debug python3 upgrade decision
      ansible.builtin.debug:
        msg:
          - "Minimum required python3 version: {{ python3_min_version }}"
          - "Current python3 version: {{ python3_version }}"
          - "Needs upgrade: {{ python3_needs_upgrade }}"

    - name: Initialize python3 upgrade result
      ansible.builtin.set_fact:
        python3_upgrade_result:
          manager: "none"
          attempted: false
          note: "No upgrade attempted yet."

    # -----------------------------
    # Debian / Ubuntu path (apt)
    # -----------------------------

    - name: Upgrade python3 via apt if needed (Debian family)
      ansible.builtin.apt:
        name: python3
        state: latest
        update_cache: yes
      when:
        - is_debian
        - python3_needs_upgrade
      register: python3_upgrade_apt

    - name: Record python3 upgrade result for Debian family
      ansible.builtin.set_fact:
        python3_upgrade_result: >-
          {{
            python3_upgrade_result | combine(
              {
                'manager': 'apt',
                'attempted': python3_needs_upgrade,
                'note': (
                  python3_needs_upgrade
                  | ternary(
                      'python3 upgrade handled by apt on Debian-based system (see play output).',
                      'python3 already meets minimum version; apt upgrade not required.'
                    )
                )
              },
              recursive=True
            )
          }}
      when: is_debian

    # -----------------------------
    # RedHat / CentOS / Fedora path (yum)
    # -----------------------------

    - name: Upgrade python3 via yum if needed (RedHat family)
      ansible.builtin.yum:
        name: python3
        state: latest
      when:
        - is_redhat
        - python3_needs_upgrade
      register: python3_upgrade_yum

    - name: Record python3 upgrade result for RedHat family
      ansible.builtin.set_fact:
        python3_upgrade_result: >-
          {{
            python3_upgrade_result | combine(
              {
                'manager': 'yum',
                'attempted': python3_needs_upgrade,
                'note': (
                  python3_needs_upgrade
                  | ternary(
                      'python3 upgrade handled by yum on RedHat-based system (see play output).',
                      'python3 already meets minimum version; yum upgrade not required.'
                    )
                )
              },
              recursive=True
            )
          }}
      when: is_redhat

    # -----------------------------
    # macOS path (Homebrew)
    # -----------------------------

    - name: Check if Homebrew is installed (macOS)
      ansible.builtin.command: brew --version
      register: brew_check
      failed_when: false
      changed_when: false
      when: is_darwin

    - name: Upgrade python via Homebrew if needed (macOS)
      ansible.builtin.command: brew upgrade python
      when:
        - is_darwin
        - python3_needs_upgrade
        - brew_check.rc == 0
      register: python3_upgrade_brew
      changed_when: true

    - name: Record python3 upgrade result for macOS
      ansible.builtin.set_fact:
        python3_upgrade_result: >-
          {{
            python3_upgrade_result | combine(
              {
                'manager': (brew_check.rc == 0) | ternary('brew', 'none'),
                'attempted': (python3_needs_upgrade and brew_check.rc == 0),
                'note': (
                  (not python3_needs_upgrade)
                  | ternary(
                      'python3 already meets minimum version; brew upgrade not required.',
                      (
                        brew_check.rc == 0
                        | ternary(
                            'python upgrade handled by Homebrew on macOS (see play output).',
                            'Homebrew not available; cannot upgrade python on macOS.'
                          )
                      )
                    )
                )
              },
              recursive=True
            )
          }}
      when: is_darwin

    # -----------------------------
    # Build & write combined report
    # -----------------------------

    - name: Build combined system info structure
      ansible.builtin.set_fact:
        full_system_info:
          collected_at: "{{ ansible_facts['date_time']['iso8601'] | default('') }}"
          hostname: "{{ ansible_facts['hostname'] | default('') }}"
          os:
            family: "{{ ansible_facts['os_family'] | default('') }}"
            distribution: "{{ ansible_facts['distribution'] | default('') }}"
            version: "{{ ansible_facts['distribution_version'] | default('') }}"
            release: "{{ ansible_facts['distribution_release'] | default('') }}"
            kernel: "{{ ansible_facts['kernel'] | default('') }}"
          hardware:
            architecture: "{{ ansible_facts['architecture'] | default('') }}"
            cpu_model: "{{ ansible_facts['processor'][1] | default('') if ansible_facts.get('processor') else '' }}"
            vcpus: "{{ ansible_facts['processor_vcpus'] | default(0) }}"
            memtotal_mb: "{{ ansible_facts['memtotal_mb'] | default(0) }}"
          network:
            default_ipv4: "{{ ansible_facts['default_ipv4'] | default({}) }}"
            all_ipv4: "{{ ansible_facts['all_ipv4_addresses'] | default([]) }}"
            interfaces: "{{ ansible_facts['interfaces'] | default([]) }}"
          storage:
            mounts: "{{ ansible_facts['mounts'] | default([]) }}"
          virtualization:
            type: "{{ ansible_facts['virtualization_type'] | default('') }}"
            role: "{{ ansible_facts['virtualization_role'] | default('') }}"
          diagnostics:
            disk_usage: "{{ disk_usage.stdout | default('') }}"
            uptime: "{{ uptime_cmd.stdout | default('') }}"
            top_mem_processes: "{{ top_mem_processes.stdout | default('') }}"
          python3:
            installed: "{{ python3_installed }}"
            version: "{{ python3_version }}"
            minimum_required: "{{ python3_min_version }}"
            needs_upgrade: "{{ python3_needs_upgrade }}"
            upgrade: "{{ python3_upgrade_result }}"
          ansible_facts: "{{ ansible_facts }}"

    - name: Write full system info to JSON file
      ansible.builtin.copy:
        dest: "{{ system_info_output }}"
        content: "{{ full_system_info | to_nice_json }}"
        mode: "0600"

    - name: Print location of saved system info
      ansible.builtin.debug:
        msg:
          - "Full system information written to: {{ system_info_output }}"
          - "You can inspect it with: jq '.' {{ system_info_output }}  (if jq is installed)"
```
:::

### What this playbook covers

- Prints system facts (OS family, distro, kernel, CPU, RAM, IP).
- Captures diagnostics: disk usage, uptime, and top memory processes.
- Detects `python3` and upgrades it via `apt`, `yum`, or Homebrew if it is older than `3.11.0`.
- Builds a full facts structure and writes it to `system_info.json` with mode `0600`.

### Run it locally

1. Save the YAML as `system_info.yml`.
2. Run `ansible-playbook -i localhost, -c local system_info.yml`.
3. Inspect the JSON report with `jq '.' system_info.json` (optional).

### Run it from Kestra

Embed the playbook and collect the report with a single [Ansible CLI task](/plugins/plugin-ansible/cli/io.kestra.plugin.ansible.cli.ansiblecli):

```yaml
id: system_report
namespace: company.team

tasks:
  - id: system_info
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    inputFiles:
      playbook.yml: |
        # paste the playbook above
      inventory.ini: |
        localhost ansible_connection=local
    outputFiles:
      - system_info.json
    containerImage: cytopia/ansible:latest-tools
    commands:
      - ansible-playbook -i inventory.ini playbook.yml
```

Or, keep the playbook as a Namespace File and reference it directly with the same [Ansible CLI task](/plugins/plugin-ansible/cli/io.kestra.plugin.ansible.cli.ansiblecli). Also make sure to add the `inventory.ini` file to the Namespace as well (`localhost ansible_connection=local`):

```yaml
id: system_report
namespace: company.team

tasks:
  - id: system_info
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    namespaceFiles:
      enabled: true
    outputFiles:
      - system_info.json
    containerImage: cytopia/ansible:latest-tools
    commands:
      - ansible-playbook -i inventory.ini system_info.yml
```

After the run, download `system_info.json` from the task outputs and feed it into downstream checks or dashboards.

### Upload the report to S3

Extend the Namespace File flow with an [S3 Upload task](/plugins/plugin-aws/s3/io.kestra.plugin.aws.s3.upload):

```yaml
id: system_report_to_s3
namespace: company.team

tasks:
  - id: system_info
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    namespaceFiles:
      enabled: true
    outputFiles:
      - system_info.json
    containerImage: cytopia/ansible:latest-tools
    commands:
      - ansible-playbook -i inventory.ini system_info.yml

  - id: upload_report
    type: io.kestra.plugin.aws.s3.Upload
    from: "{{ outputs.system_info.outputFiles['system_info.json'] }}"
    bucket: my-report-bucket
    key: systems/{{ execution.startDate | date('yyyyMMdd_HHmmss') }}/system_info.json
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: us-east-1
```

The `upload_report` task pushes the generated JSON to S3; adjust `bucket`, `key`, and `region` to match your setup.

### Trigger it (scheduled or event-driven)

Add a trigger so the flow runs automatically—either on a schedule ([Schedule trigger](../04.workflow-components/07.triggers/01.schedule-trigger.md)) or from an external event ([Webhook trigger](../04.workflow-components/07.triggers/03.webhook-trigger.md)):

```yaml
triggers:
  - id: nightly_audit
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 2 * * *"   # every night at 2 AM

  # Or, event-driven example (e.g., HTTP webhook from your MDM/ITSM):
  # - id: mdm_webhook
  #   type: io.kestra.plugin.core.http.Webhook
```

Pair the trigger with the S3-uploading flow to build a historical log of machine health without manual runs.

### Wrap up

Ansible handles host-level automation (facts, checks, remediation) while Kestra orchestrates when and where it runs, keeps secrets out of playbooks, ships outputs to S3, and gives you centralized observability. Together they scale the same playbook from one laptop to a fleet, with repeatable runs and downstream integrations ready to consume the results.
