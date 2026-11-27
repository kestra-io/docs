import { escapeHtml } from "~/components/migration/highlight"
import type { HeroRow } from "~/components/airflow-migration-guide/AfHeroVisual.astro"

// Placeholder until the AWX CLI export docs URL is settled.
const TODO = "#"

const inline = (text: string) =>
    escapeHtml(text)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

const RELEASE_STATUS = "/resources/infrastructure/awx-release-status"
const VS_AAP = "/vs/ansible-automation-platform"
const ANSIBLE = "/orchestration/ansible"

export const HERO = {
    title: "Migrate from AWX and AAP to Kestra",
    lead: "Keep your playbooks. Replace the controller. Move AWX and AAP job templates, workflows and surveys to Kestra flows, run both until the last one moves, then switch AWX off.",
    ctas: [
        { label: "Try Kestra OSS", href: "/docs/quickstart", solid: true },
        { label: "Talk to a migration engineer", href: "/demo" },
    ],
}

export const HERO_ROWS: HeroRow[] = [
    {
        code: [
            [9, "    survey_enabled: <c>true</c>"],
            [10, "    survey_spec:"],
        ],
        kestra: { id: "inputs", type: "flow inputs", plugin: "", fallback: "mdi:form-textbox", time: "0.1s" },
    },
    {
        code: [
            [5, "    project: <s>linux-playbooks</s>"],
            [6, "    playbook: <s>patch.yml</s>"],
        ],
        kestra: { id: "patch", type: "ansible.cli.AnsibleCLI", fallback: "mdi:ansible", time: "2m 41s" },
    },
    {
        code: [
            [27, "  <c>awx.awx.schedule</c>:"],
            [30, '    rrule: <s>"DTSTART:20260103T020000Z RRULE:FREQ=WEEKLY;BYDAY=SA"</s>'],
        ],
        kestra: { id: "weekly", type: "core.trigger.Schedule", fallback: "mdi:clock-outline", time: "0.2s" },
    },
]

export const STATUS = {
    title: "Where AWX Stands",
    items: [
        {
            icon: "mdi:tag-outline",
            title: "July 2, 2024",
            text: "AWX 24.6.1 ships, the last published release.",
        },
        {
            icon: "mdi:source-merge",
            title: "January 2026",
            text: inline("A refactor of AWX is merged into the `devel` branch, with no release attached."),
        },
        {
            icon: "mdi:pipe-disconnected",
            title: "November 16, 2026",
            text: "The maintainers remove the release pipeline, noting that AWX releases are no longer published.",
        },
    ],
    after: "Your AWX keeps running as installed, and so do your playbooks. AAP keeps shipping as Red Hat's supported product.",
    link: { label: "AWX release status", href: RELEASE_STATUS },
}

export const LEAVE = [
    {
        icon: "mdi:shield-alert-outline",
        title: "No releases means patching it yourselves",
        text: "Security fixes, the operator, the UI and Event-Driven Ansible become your team's code to maintain.",
    },
    {
        icon: "mdi:source-repository",
        title: "Config as code means maintaining your own sync",
        text: inline(
            "Job templates, surveys and workflows live in the controller's database, or in Git through a custom `awx.awx` sync your team keeps running.",
        ),
    },
    {
        icon: "mdi:form-select",
        title: "People outside the team need a form, not the controller",
        text: "Requests arrive from Jira, ServiceNow and Slack, and surveys only work for people who log into AWX.",
    },
    {
        icon: "mdi:server-plus-outline",
        title: "The renewal grows with every managed node",
        text: "AAP is subscribed per managed node, so automating more devices means a bigger renewal.",
    },
]

export const COMPARE_ROWS = [
    { label: "Releases and support", values: ["AWX: no published releases. AAP: Red Hat support, per managed node", "Weekly releases, open source; Enterprise support with an SLA"] },
    { label: "Job definitions", values: ["Objects in the controller database, or a custom Git sync", "YAML in your Git repository, synced per team"] },
    { label: "Self-service", values: ["Surveys, for people with controller access", "Apps and webhooks in front of any flow (Enterprise)"] },
    { label: "Where jobs run", values: ["Instance groups, execution nodes, automation mesh", "Worker groups that connect outbound from each site (Enterprise)"] },
    { label: "Beyond Ansible", values: ["Workflow templates chain Ansible jobs", "Terraform, ITSM, approvals, events and AI agents in the same flow"] },
]

export const COMPARE_MORE = { label: "Full comparison: Kestra vs AAP", href: VS_AAP }

export const STARTS = {
    title: "Two Starting Points",
    lead: "How you convert depends on where your AWX configuration lives today.",
    items: [
        {
            icon: "mdi:file-code-outline",
            title: "Your config is already code",
            text: inline(
                "Your job templates, surveys and schedules are `awx.awx` YAML in Git, applied by a pipeline. Those files are the specification: give them to your coding agent with the Kestra flow skill, get one flow per job template, and keep one repository per team synced to its own namespace.",
            ),
        },
        {
            icon: "mdi:monitor-dashboard",
            title: "Your config lives in the UI",
            text: inline(
                "Export it with `awx export`, read what the export leaves out from the API (instance groups, credential lookups, each template's last run), then convert the export the same way.",
            ),
        },
    ],
    after: "Either way, the playbooks, roles and collections don't change. What you rewrite is the controller's configuration around them.",
}

export const HOW = {
    headingId: "awx-how-title",
    title: "One Job Template, Before and After",
    steps: [
        {
            title: "Convert",
            text: "The job template, survey, project, credential and schedule become one flow file. The playbook doesn't change.",
        },
        {
            title: "Check",
            text: "Run the flow in check mode with diff against the same hosts, and compare each host's recap with the last AWX run.",
        },
        {
            title: "Switch",
            text: "When every host matches, disable the AWX schedule as the Kestra one goes live, and keep the job template as a rollback.",
        },
    ],
    foot: { label: "AnsibleCLI task", href: "/plugins/plugin-ansible" },
}

// Line numbers point into PATCH_AWX and PATCH_KESTRA (code.ts).
export const CALLOUTS = [
    { at: 700, awx: [2, 3], kestra: [1, 2], label: "job template → flow `id`" },
    { at: 1600, awx: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], kestra: [4, 5, 6, 7, 8, 9, 10], label: "survey → `inputs`" },
    { at: 2500, awx: [5, 6], kestra: [22, 23, 24, 25, 26], label: "project → `git.Clone`" },
    { at: 3400, awx: [8], kestra: [33, 34], label: "credential → `secret()`" },
    { at: 4300, awx: [], kestra: [30, 31, 32], label: "collections → `beforeCommands`" },
    { at: 5200, awx: [26, 27, 28, 29, 30], kestra: [12, 13, 14, 15, 16], label: "schedule → Schedule trigger" },
]

export const RESULT = {
    columns: ["Host", "AWX job, Nov 21", "Kestra check run", ""],
    rows: [
        { host: "web-01", awx: "ok=14 changed=0", kestra: "ok=14 changed=0", at: 900 },
        { host: "web-02", awx: "ok=14 changed=0", kestra: "ok=14 changed=0", at: 2100 },
        { host: "db-01", awx: "ok=11 changed=0", kestra: "ok=11 changed=0", at: 3300 },
    ],
    verdict: { name: "linux-patching", text: "schedule disabled in AWX, job template kept as rollback" },
}

export const SURVEY = {
    title: "A Survey Next to a Kestra App",
    lead: "In AWX, a survey is a form inside the controller, so everyone who fills it in needs an AWX login and an execute role on the job template. In Kestra the same flow takes requests three ways: an App for people outside the team, the executions API for Jira or ServiceNow, and the UI for the team itself. The playbook is the same in all three.",
    callouts: [
        "The App gives app owners a form, with no access to the flow or the playbook",
        "Jira and ServiceNow start the same flow through the executions API, with the ticket attached",
        "Every run lands in one execution history, whoever started it",
    ],
    link: { label: "Apps", href: "/docs/enterprise/scalability/apps" },
}

export interface TemplateRow {
    name: string
    type: string
    scheduled?: boolean
    at?: number
}

export interface StatusRow {
    name: string
    before: string
    after: string
    at?: number
}

export interface FlowRow {
    id: string
    namespace: string
    note?: string
    at?: number
}

export interface VerdictRow {
    template: string
    type: string
    last: string
    verdict: string
    tone?: "move" | "redesign" | "retire"
    at: number
}

export interface TerminalSide {
    kind: "terminal"
    label: string
    lines: { cmd?: string; out?: string[]; note?: string }[]
}

export type AwxSide =
    | TerminalSide
    | { kind: "templates"; rows: TemplateRow[] }
    | { kind: "status"; rows: StatusRow[] }

export type KestraSide =
    | TerminalSide
    | { kind: "flows"; rows: FlowRow[] }
    | { kind: "kv"; rows: VerdictRow[] }

export interface StepVisual {
    label: string
    awx?: AwxSide
    kestra?: KestraSide
    checks: string[]
}

const LINK = (label: string, href: string) => ({ label, href })

export const STEPS: {
    label: string
    title: string
    text: string
    ctas: { label: string; href: string }[]
    visual: StepVisual
}[] = [
    {
        label: "Inventory",
        title: "List What You Run",
        text: "If your config is in Git, the repositories are your inventory. Otherwise, export with awx export and read what it leaves out from the API: instance groups, credential lookups and each template's last run. Retire what hasn't run in 12 months and mark workflow templates for redesign.",
        ctas: [LINK("AWX CLI export", TODO)],
        visual: {
            label: "The AWX CLI export and API calls on the left, the migration inventory stored in the Kestra KV Store on the right",
            awx: {
                kind: "terminal",
                label: "Terminal: AWX CLI export",
                lines: [
                    { cmd: "awx export --job_templates --workflow_job_templates --schedules > export.json" },
                    { cmd: 'curl -s -H "Authorization: Bearer $TOKEN" "$AWX/api/v2/job_templates/?page_size=200" \\\n    | jq -r \'.results[] | [.name, .last_job_run] | @tsv\'' },
                    { out: ["linux-patching    2026-11-21T02:00:14Z", "legacy-backup     2025-06-02T01:00:09Z"] },
                    { cmd: 'curl -s -H "Authorization: Bearer $TOKEN" "$AWX/api/v2/instance_groups/" | jq -r \'.results[].name\'' },
                    { out: ["default", "emea-dc1"] },
                ],
            },
            kestra: {
                kind: "kv",
                rows: [
                    { template: "linux-patching", type: "Job template", last: "2026-11-21", verdict: "convert · wave 1", at: 0 },
                    { template: "restart-service", type: "Job template", last: "2026-11-24", verdict: "convert · wave 1", at: 0 },
                    { template: "network-change", type: "Workflow template", last: "2026-11-20", verdict: "redesign · wave 2", tone: "redesign", at: 1 },
                    { template: "legacy-backup", type: "Job template", last: "2025-06-02", verdict: "retire", tone: "retire", at: 2 },
                ],
            },
            checks: [
                "Every template listed with its last run",
                "Workflow templates marked for redesign",
                "Templates idle for 12 months left behind",
            ],
        },
    },
    {
        label: "Convert",
        title: "Convert, One Repository per Team",
        text: "Write the flows with your coding agent, using the Kestra flow skill, or start from a blueprint. Each team keeps its own repository, synced to its own namespace on every merge to main, so Git stays the source of truth.",
        ctas: [
            LINK("Kestra agent skills on GitHub", "https://github.com/kestra-io/agent-skills"),
            LINK("Blueprints for Ansible", ANSIBLE),
        ],
        visual: {
            label: "The converted flows in one team repository, pushed to main and synced to its namespace",
            kestra: {
                kind: "terminal",
                label: "Terminal: convert, one repository per team",
                lines: [
                    { cmd: "ls flows/infra.linux" },
                    { out: ["linux_patching.yaml  restart_service.yaml"] },
                    { cmd: "git push origin main" },
                    { note: "CI syncs flows/ and namespace files to infra.linux" },
                ],
            },
            checks: [
                "One flow per job template",
                "One repository per team, one namespace per repository",
                "Deployed next to AWX, schedules still off",
            ],
        },
    },
    {
        label: "Run both",
        title: "Run Both Until the Last Template Moves",
        text: "Disable each moved schedule in AWX and keep the job template as a rollback. Templates that haven't moved stay in AWX, and Kestra launches them through the controller's API, so their schedules and forms can move first and the job templates later.",
        ctas: [LINK("HTTP Request task", "/plugins/core/http/io.kestra.plugin.core.http.request")],
        visual: {
            label: "Moved templates switch their AWX schedule off while their flows succeed in Kestra",
            awx: {
                kind: "templates",
                rows: [
                    { name: "linux-patching", type: "Job template", scheduled: true, at: 0 },
                    { name: "restart-service", type: "Job template", scheduled: true, at: 1 },
                    { name: "network-change", type: "Workflow template", scheduled: true },
                ],
            },
            kestra: {
                kind: "flows",
                rows: [
                    { id: "linux_patching", namespace: "infra.linux", at: 0 },
                    { id: "restart_service", namespace: "infra.apps", at: 1 },
                    { id: "launch_network_change", namespace: "infra.network", note: "POST /api/v2/workflow_job_templates/12/launch/", at: 2 },
                ],
            },
            checks: [
                "linux-patching runs in Kestra, AWX schedule off",
                "restart-service runs in Kestra, survey replaced by an App",
                "network-change still in AWX, launched from Kestra",
            ],
        },
    },
    {
        label: "Switch off",
        title: "Switch AWX Off",
        text: "When no schedule or trigger is left in AWX, export the job history you need for audit, revoke the controller's tokens, rotate the credentials it held and uninstall it. On AAP, finish before the renewal notice date.",
        ctas: [LINK("Kestra API reference", "/docs/api-reference")],
        visual: {
            label: "The AWX controller goes from running to stopped while every flow runs in Kestra",
            awx: {
                kind: "status",
                rows: [
                    { name: "Controller", before: "running", after: "stopped", at: 2 },
                    { name: "Job history", before: "—", after: "exported", at: 1 },
                    { name: "Credentials", before: "—", after: "rotated", at: 2 },
                ],
            },
            kestra: {
                kind: "flows",
                rows: [
                    { id: "linux_patching", namespace: "infra.linux", at: 0 },
                    { id: "restart_service", namespace: "infra.apps", at: 0 },
                    { id: "network_change", namespace: "infra.network", at: 0 },
                ],
            },
            checks: [
                "Every template runs in Kestra",
                "Job history exported for audit",
                "AWX uninstalled",
            ],
        },
    },
]

const TINTS = ["#E6C359", "#59E659", "#59BCE6", "#E67FA2"]

const external = (href: string) => href.startsWith("http")

export const PLAN_DOMAINS = STEPS.map((step, i) => ({
    id: `awx-${step.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    label: step.label,
    tint: TINTS[i],
    title: step.title,
    description: step.text,
    cta: { ...step.ctas[0], external: external(step.ctas[0].href) },
    moreCtas: step.ctas.slice(1).map((cta) => ({ ...cta, external: external(cta.href) })),
}))

export const PATTERNS = {
    title: "After the Move",
    lead: inline(
        `Once the job templates run in Kestra, these are the patterns platform and network teams build next. Each one is on [Ansible orchestration with Kestra](${ANSIBLE}).`,
    ),
    items: [
        {
            icon: "mdi:magnify-scan",
            title: "Nightly check-mode audit",
            text: "Run playbooks in check mode on a schedule and flag drift before it becomes an incident.",
        },
        {
            icon: "mdi:waves",
            title: "Rolling OS patch wave",
            text: "Patch in batches, verify each batch, and stop the wave when one fails.",
        },
        {
            icon: "mdi:alarm-light-outline",
            title: "Event-triggered remediation",
            text: "An alert starts the flow that fixes the host, with no rulebook or activation to run.",
        },
        {
            icon: "mdi:server-network",
            title: "Inventory from NetBox or Terraform",
            text: "Build the inventory at run time from your source of truth.",
        },
        {
            icon: "mdi:router-network",
            title: "Network change with dry run, approval and rollback",
            text: "Check mode, an approval with the diff attached, the change in its window, post-checks and an automatic rollback.",
        },
    ],
}

const row = (cells: string[]) => ({ cells })

export const MAPPING = [
    {
        title: "Job templates and launching",
        icon: "mdi:play-box-outline",
        rows: [
            row(["Job template", "A flow with an AnsibleCLI task", "`id` and `namespace`"]),
            row(["Job (one run)", "Execution, one per run across all hosts", "`GET /api/v1/main/executions`"]),
            row(["Survey", "Flow inputs, or a Kestra App (Enterprise)", "`inputs:`"]),
            row(["Prompt on launch (limit, tags, inventory)", "Inputs passed to the task", '`limit: "{{ inputs.limit }}"`']),
            row(["Extra variables", "`-e` built from inputs", "`-e reboot={{ inputs.reboot }}`"]),
            row(["Launch from Jira, ServiceNow or a Slack bot", "Executions API or a Webhook trigger", "`POST /api/v1/main/executions/<ns>/<flow>`"]),
            row(["Schedule", "Schedule trigger", '`cron: "0 2 * * 6"`']),
            row(["Notification template", "Notification task on failure", "`errors:`"]),
        ],
    },
    {
        title: "Projects, collections and credentials",
        icon: "mdi:source-repository",
        rows: [
            row(["Project", "Git clone at run time, or Git sync to namespace files", "`io.kestra.plugin.git.Clone`"]),
            row(["`awx.awx` config in Git", "One repository per team, synced to its namespace", "Git sync on merge"]),
            row(["Collections and roles from `requirements.yml`", "Installed before the playbook from your hub, or built into the image", "`beforeCommands:`"]),
            row(["Execution environment", "The AnsibleCLI task's image with your collections, or your own EE image once tested", "`containerImage:`"]),
            row(["Machine credential", "Secret passed as a file or an env var", "`{{ secret('LINUX_SSH_KEY') }}`"]),
            row(["Credential lookup (Vault, CyberArk)", "Secrets backend, per namespace (Enterprise)", "`{{ secret('...') }}`"]),
        ],
    },
    {
        title: "Workflows and approvals",
        icon: "mdi:source-branch",
        rows: [
            row(["Workflow template", "A flow, with subflows, If and Switch", "`io.kestra.plugin.core.flow.Subflow`"]),
            row(["Approval node", "Pause task with a notification, or Approvals (Enterprise)", "`io.kestra.plugin.core.flow.Pause`"]),
            row(["Success and failure paths", "Conditions on outputs, and an error branch", "`If`, `Switch`, `errors:`"]),
        ],
    },
    {
        title: "Inventory and where jobs run",
        icon: "mdi:server-network",
        rows: [
            row(["Static inventory, host_vars, group_vars", "Files in Git, arriving with the clone", "`-i inventories/prod`"]),
            row(["Dynamic inventory source", "The same inventory plugin, run by ansible-core", "`-i netbox.yml`"]),
            row(["Named inventory (a group of hosts, often a NetBox filter)", "A dynamic inventory with filters, or Assets selected by metadata (Enterprise)", "`-i netbox.yml`"]),
            row(["Inventory as a record", "The Ansible plugin registers the hosts in a playbook's inventory file as assets (Enterprise)", ""]),
            row(["Instance group, execution node", "Worker group, selected by tags (Enterprise)", "`workerSelector:`"]),
            row(["Automation mesh, hop nodes", "Workers that connect outbound from each site (Enterprise)", "`workerSelector:`"]),
        ],
    },
    {
        title: "Events",
        icon: "mdi:lightning-bolt-outline",
        rows: [
            row(["Rulebook event source", "Webhook, Kafka or realtime trigger", "`io.kestra.plugin.core.trigger.Webhook`"]),
            row(["Rule condition", "Expression on the trigger", '`when: "{{ ... }}"`']),
            row(["`run_job_template` action", "The flow's tasks, or a subflow", "`io.kestra.plugin.core.flow.Subflow`"]),
        ],
    },
    {
        title: "Platform",
        icon: "mdi:server-outline",
        rows: [
            row(["Organizations, teams, roles", "Tenants, namespaces, RBAC and SSO (Enterprise)", "`namespace: infra.linux`"]),
            row(["Promoting content between instances", "Git per environment, deployed with kestractl", "`kestractl flows deploy`"]),
            row(["AWX API, awx CLI, `awx.awx` collection", "Kestra API, kestractl, Terraform provider", "`kestractl`"]),
            row(["Job history", "Executions, logs and outputs in your own database", "`GET /api/v1/main/executions`"]),
        ],
    },
]

export const MAPPING_LEAD =
    "Every AWX and AAP construct, the Kestra feature that replaces it, and what you write in the flow YAML."

export const PITFALLS = [
    {
        title: "",
        icon: "",
        rows: [
            row(["Collections missing at run time", "AWX installs `requirements.yml` when it syncs a project. Install them before the playbook runs, from your private automation hub or Galaxy mirror on a network without internet, or build them into the image."]),
            row(["Roles pulled from several Git repositories", "If a controller repository pulls roles from other repositories at run time, keep `requirements.yml` with Git sources and give the install step a credential that can reach them."]),
            row(["Credentials AWX injected silently", "Machine, become and cloud credentials reach AWX jobs without appearing in the playbook. Pass every one explicitly."]),
            row(["Variables that lived only in the controller", "Inventory, group and host variables, and extra variables set on the job template, are in AWX's database. Export them before you switch AWX off."]),
            row(["Extra variable precedence", "AWX merges template, survey and launch variables in a fixed order. Build the `-e` arguments so the final value is the one you expect."]),
            row(["Approvers who aren't notified", "A Pause task waits quietly. Send a notification before it, use a system flow that fires whenever an execution pauses, or use Approvals."]),
            row(["Loading tens of thousands of devices into Assets", "Load them once in bulk, keep them current from source-of-truth events such as NetBox webhooks, and size the web server for the API load."]),
            row(["A job running twice", "Disable the AWX schedule as you enable the Kestra one."]),
            row(["Counting runs per host", "A playbook across 500 hosts is one task run in Kestra. Re-count before sizing anything on run volume."]),
            row(["An execution environment the task can't run yet", "Test your EE image with the AnsibleCLI task before converting at scale, and pin the tag."]),
            row(["Assuming worker groups, RBAC or secrets backends in open source", "They are Enterprise. Decide the edition before the first flow ships."]),
        ],
    },
]

export function runEditions(cloudHref = "/cloud") {
    return [
        {
            id: "core" as const,
            title: "Kestra Core",
            badge: "Open Source",
            text: "Apache 2.0. Replaces one team's AWX: flows, the AnsibleCLI task, inputs, schedules, webhooks, subflows and Pause.",
            cta: { label: "Get started", href: "/docs/quickstart" },
        },
        {
            id: "cloud" as const,
            title: "Kestra Cloud",
            text: "The same flows, hosted, for teams whose hosts are reachable from the internet. SSO, RBAC and a managed secret manager, with no servers to operate.",
            cta: { label: "Start your Cloud trial", href: cloudHref },
            featured: true,
        },
        {
            id: "enterprise" as const,
            title: "Kestra Enterprise",
            text: "Self-hosted, hybrid or air-gapped. Worker groups for every site and network zone, Apps, Assets, Approvals, tenants and high availability.",
            cta: { label: "Talk to sales", href: "/demo" },
        },
    ]
}
