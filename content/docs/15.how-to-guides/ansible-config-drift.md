---
title: Detect Ansible Config Drift with Kestra
icon: /docs/icons/ansiblecli.svg
---

Keeps configs consistent and surfaces drift without manual checks with Ansible.

Use Ansible to enforce a required environment variable across multiple hosts and have Kestra alert you in Slack when a change occurs. 

## Files to store as Namespace Files

- `inventory.ini` (replace with your hosts and users; keys shown as placeholders):

```ini
[servers]
server1.example.test ansible_user=admin ansible_ssh_private_key_file=~/.ssh/id_rsa
server2.example.test ansible_user=admin ansible_ssh_private_key_file=~/.ssh/id_rsa
server3.example.test ansible_user=admin ansible_ssh_private_key_file=~/.ssh/id_rsa
```

- `myplaybook.yml` (enforce `MY_APP_MODE` and refresh the shell):

```yaml
---
- name: Ensure environment variable is set correctly
  hosts: servers
  become: true

  tasks:
    - name: Ensure MY_APP_MODE is set
      lineinfile:
        path: /home/{{ ansible_user }}/.bashrc
        regexp: '^MY_APP_MODE='
        line: 'MY_APP_MODE=production'
        state: present
      notify: Refresh environment

  handlers:
    - name: Refresh environment
      shell: . /home/{{ ansible_user }}/.bashrc
      changed_when: false
```

## Flow: run Ansible and alert on drift

This flow runs the playbook with the [Ansible CLI task](/plugins/plugin-ansible/cli/io.kestra.plugin.ansible.cli.ansiblecli), inspects each host result in a [`ForEach`](/plugins/core/flow/io.kestra.plugin.core.flow.foreach), and posts a Slack alert only when a host was changed using the [Slack Incoming Webhook task](/plugins/plugin-notifications/slack/io.kestra.plugin.notifications.slack.slackincomingwebhook). The schedule trigger is disabled by default—enable it to run nightly.

```yaml
id: ansible_config_drift
namespace: company.team

tasks:
  - id: set_up_env
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    namespaceFiles:
      enabled: true
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    ansibleConfig: |
      [defaults]
      interpreter_python = auto_silent
      log_path={{ workingDir }}/log
      callback_plugins = ./callback_plugins
      stdout_callback = kestra_logger
    commands:
      - ansible-playbook -i inventory.ini myplaybook.yml

  - id: loop_hosts
    type: io.kestra.plugin.core.flow.ForEach
    values: "{{ outputs.set_up_env.vars.outputs }}"
    tasks:
      - id: check_drift
        type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
        runIf: "{{ taskrun.value | jq('.changed') | first == true }}"
        url: "{{ secret('SLACK_WEBHOOK') }}"
        payload: |
          {
              "text": "Configuration updated - {{ taskrun.value | jq('.msg') | first ?? Null }}"
          }

triggers:
  - id: check_nightly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: 0 3 * * *
    disabled: true
```

## Why this matters

- Enforces a critical env var across a fleet to prevent silent drift.
- Uses `stdout_callback = kestra_logger` to keep Ansible output structured in Kestra logs.
- Filters to only changed hosts before notifying Slack, reducing noise.
- Keeps playbook and inventory in Namespace Files so they can be versioned and reused across flows.

