export const PATCH_AWX = `- name: Patching job template
  awx.awx.job_template:
    name: linux-patching
    organization: Infrastructure
    project: linux-playbooks
    playbook: patch.yml
    inventory: prod-linux
    credentials: [linux-ssh]
    survey_enabled: true
    survey_spec:
      name: Patching
      description: ""
      spec:
        - question_name: Hosts to patch
          variable: limit
          type: text
          default: all
          required: true
        - question_name: Reboot after patching
          variable: reboot
          type: multiplechoice
          choices: ["true", "false"]
          default: "false"
          required: true

- name: Weekly schedule
  awx.awx.schedule:
    name: linux-patching-weekly
    unified_job_template: linux-patching
    rrule: "DTSTART:20260103T020000Z RRULE:FREQ=WEEKLY;BYDAY=SA"`

export const PATCH_KESTRA = `id: linux_patching
namespace: infra.linux

inputs:
  - id: limit
    type: STRING
    defaults: all
  - id: reboot
    type: BOOL
    defaults: false

triggers:
  - id: weekly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 2 * * 6"
    timezone: UTC

tasks:
  - id: run
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone
        type: io.kestra.plugin.git.Clone
        url: https://git.example.com/infra/linux-playbooks.git
        branch: main
        password: "{{ secret('GIT_TOKEN') }}"

      - id: patch
        type: io.kestra.plugin.ansible.cli.AnsibleCLI
        beforeCommands:
          # from your private automation hub or Galaxy mirror
          - ansible-galaxy collection install -r collections/requirements.yml
        inputFiles:
          id_rsa: "{{ secret('LINUX_SSH_KEY') }}"
        limit: "{{ inputs.limit }}"
        commands:
          - ansible-playbook -i inventories/prod patch.yml -e reboot={{ inputs.reboot }} --private-key id_rsa

errors:
  - id: slack_alert
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"`

export const RESTART_AWX = `- name: Restart service job template
  awx.awx.job_template:
    name: restart-service
    project: app-playbooks
    playbook: restart_service.yml
    inventory: apps
    survey_enabled: true
    survey_spec:
      name: Restart a service
      description: ""
      spec:
        - question_name: Service
          variable: service
          type: multiplechoice
          choices: [billing-api, orders-api, search-api]
          required: true
        - question_name: Environment
          variable: environment
          type: multiplechoice
          choices: [staging, prod]
          required: true

- name: Let app owners run it
  awx.awx.role:
    team: app-owners
    job_templates: [restart-service]
    role: execute`

export const RESTART_KESTRA = `id: restart_service
namespace: infra.apps

inputs:
  - id: service
    type: SELECT
    values: [billing-api, orders-api, search-api]
  - id: environment
    type: SELECT
    values: [staging, prod]
  - id: ticket
    type: STRING
    required: false

tasks:
  - id: restart
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    commands:
      - ansible-playbook -i inventories/{{ inputs.environment }} restart_service.yml -e service={{ inputs.service }}`

export const RESTART_APP = `id: restart_a_service
type: io.kestra.plugin.ee.apps.Execution
displayName: Restart a service
namespace: infra.apps
flowId: restart_service
access:
  type: PRIVATE
layout:
  - on: OPEN
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: Restarts the service on every host in the environment.
      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionForm
      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionButton
        text: Restart`

export const RESTART_CURL = `$ curl -s -X POST "$KESTRA/api/v1/main/executions/infra.apps/restart_service" \\
    -H "Authorization: Bearer $KESTRA_TOKEN" \\
    -F service=orders-api -F environment=prod -F ticket=OPS-4821`
