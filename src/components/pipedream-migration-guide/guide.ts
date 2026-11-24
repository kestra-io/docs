export const SHUTDOWN = [
    {
        icon: "mdi:wrench-clock",
        title: "Now",
        text: "Workflows is in maintenance mode and closed to new signups. The export tool works on plans that include File Stores.",
    },
    {
        icon: "mdi:calendar-remove-outline",
        title: "March 31, 2027",
        text: "Workflows and String stop running. Pipedream cancels subscriptions and refunds the unused part. Pipedream Connect keeps running.",
    },
    {
        icon: "mdi:delete-clock-outline",
        title: "April 30, 2027",
        text: "Pipedream deletes all Workflows data, including the OAuth tokens of your connected accounts.",
    },
]

export const STEPS = [
    {
        icon: "mdi:archive-arrow-down-outline",
        title: "Export each project",
        text: "Settings › Export Workflows, then download the ZIP from the project's File Store. manifest.json lists every workflow and every secret prop you have to re-enter.",
        link: {
            label: "Pipedream export docs",
            href: "https://pipedream.com/docs/workflows/export-workflows",
        },
    },
    {
        icon: "mdi:robot-outline",
        title: "Convert with your coding agent",
        text: "Install the Kestra agent skills and ask Claude Code, Cursor or Codex for one flow per workflow. Every task is checked against the live plugin schema.",
        link: {
            label: "Kestra agent skills",
            href: "/docs/develop-with-ai/agent-skills",
        },
    },
    {
        icon: "mdi:key-outline",
        title: "Reconnect your accounts",
        text: "Connected accounts don't export. Create your own OAuth client or API token per app and store it as a secret in the namespace that uses it.",
        link: { label: "Secrets in Kestra", href: "/docs/concepts/secret" },
    },
    {
        icon: "mdi:swap-horizontal",
        title: "Switch one sender at a time",
        text: "Deploy, post a real payload to the Kestra webhook, diff the result against Pipedream, then repoint the sender. Keep the Pipedream workflow as rollback.",
        link: {
            label: "Webhook trigger",
            href: "/docs/workflow-components/triggers/webhook-trigger",
        },
    },
]

export const BEFORE = `def handler(pd: "pipedream"):
    body = pd.steps["trigger"]["event"]["body"]
    return {
        "invoice_id": body["id"],
        "amount": round(float(body["total"]), 2),
    }`

export const AFTER_SCRIPT = `import json, os
from kestra import Kestra

body = json.loads(os.environ["BODY"])
Kestra.outputs({
    "invoice_id": body["id"],
    "amount": round(float(body["total"]), 2),
})`

export const FLOW = `id: invoice_intake
namespace: finance
triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('INVOICE_WEBHOOK_KEY') }}"

tasks:
  - id: transform
    type: io.kestra.plugin.scripts.python.Script
    dependencies: [kestra]
    env:
      BODY: "{{ trigger.body | toJson }}"
    script: "{{ read('transform.py') }}"

  - id: post_to_netsuite
    type: io.kestra.plugin.core.http.Request
    uri: "{{ secret('NETSUITE_URL') }}/vendorBill"
    method: POST
    body: "{{ outputs.transform.vars | toJson }}"
    timeout: PT15M`

const P = "/plugins/core"
const SECRET = "/docs/concepts/secret"
const WEBHOOK = "/docs/workflow-components/triggers/webhook-trigger"
const OUTPUTS = "/docs/workflow-components/outputs"

export type MapRow = readonly [
    pipedream: string,
    kestra: string,
    yaml: string,
    href: string,
]

export const MAPPING: readonly {
    title: string
    icon: string
    rows: readonly MapRow[]
}[] = [
    {
        title: "Triggers",
        icon: "mdi:lightning-bolt-outline",
        rows: [
            ["Workflow", "Flow, a YAML file you can sync to Git", "`id` and `namespace`", "/docs/workflow-components/flow"],
            ["Project", "Namespace", "`namespace: finance`", "/docs/workflow-components/namespace"],
            ["HTTP / Webhook trigger", "Webhook trigger", "`io.kestra.plugin.core.trigger.Webhook`", `${P}/trigger/io.kestra.plugin.core.trigger.webhook`],
            ["`$.respond()` or Return HTTP response", "Webhook that waits for the run and returns its outputs", "`wait: true` and `returnOutputs: true`", WEBHOOK],
            ["Schedule trigger, cron or every N minutes", "Schedule trigger, intervals written as cron", "`cron: \"*/15 * * * *\"`", "/docs/workflow-components/triggers/schedule-trigger"],
            ["Email trigger on a pipedream.net address", "Email trigger reading an IMAP mailbox you own", "`io.kestra.plugin.email.RealTimeTrigger`", "/plugins/plugin-email/io.kestra.plugin.email.realtimetrigger"],
            ["RSS trigger", "HTTP polling trigger on the feed URL", "`io.kestra.plugin.core.http.Trigger`", `${P}/http/io.kestra.plugin.core.http.trigger`],
            ["App-based event source", "The app plugin's trigger, or HTTP polling on its API", "`io.kestra.plugin.<app>.*Trigger`", "/plugins"],
        ],
    },
    {
        title: "Code steps and actions",
        icon: "mdi:code-braces",
        rows: [
            ["Node.js code step", "Node.js Script task", "`io.kestra.plugin.scripts.node.Script`", "/plugins/plugin-script-node/io.kestra.plugin.scripts.node.script"],
            ["Python code step", "Python Script task", "`io.kestra.plugin.scripts.python.Script`", "/plugins/plugin-script-python/io.kestra.plugin.scripts.python.script"],
            ["Go code step", "Go Script task", "`io.kestra.plugin.scripts.go.Script`", "/plugins/plugin-script-go/io.kestra.plugin.scripts.go.script"],
            ["Bash code step", "Shell Script task", "`io.kestra.plugin.scripts.shell.Script`", "/plugins/plugin-script-shell/io.kestra.plugin.scripts.shell.script"],
            ["`return` or `$.export()` in a step", "Outputs sent from the script", "`Kestra.outputs({...})`", OUTPUTS],
            ["`steps.<step>.$return_value`", "Output expression", "`{{ outputs.<task>.vars.<key> }}`", OUTPUTS],
            ["Pre-built action", "Plugin task for the same app", "`io.kestra.plugin.<app>.*`", "/plugins"],
            ["Action with no Kestra plugin", "HTTP Request task", "`io.kestra.plugin.core.http.Request`", `${P}/http/io.kestra.plugin.core.http.request`],
        ],
    },
    {
        title: "Control flow",
        icon: "mdi:source-branch",
        rows: [
            ["If/Else", "If task", "`io.kestra.plugin.core.flow.If`", `${P}/flow/io.kestra.plugin.core.flow.if`],
            ["Filter", "Condition on the next task", "`runIf: \"{{ ... }}\"`", "/docs/workflow-components/tasks"],
            ["Delay", "Sleep task", "`io.kestra.plugin.core.flow.Sleep`", `${P}/flow/io.kestra.plugin.core.flow.sleep`],
            ["End Workflow or `$.flow.exit()`", "Exit task", "`io.kestra.plugin.core.execution.Exit`", `${P}/execution/io.kestra.plugin.core.execution.exit`],
            ["`$.flow.suspend()`", "Pause task, resumed from the UI or the API", "`io.kestra.plugin.core.flow.Pause`", `${P}/flow/io.kestra.plugin.core.flow.pause`],
            ["`$.flow.rerun()` to poll until ready", "LoopUntil task", "`io.kestra.plugin.core.flow.LoopUntil`", `${P}/flow/io.kestra.plugin.core.flow.loopuntil`],
            ["Loop written inside a code step", "Loop task over a list", "`io.kestra.plugin.core.flow.Loop`", `${P}/flow/io.kestra.plugin.core.flow.loop`],
            ["`Promise.all` inside a code step", "Parallel task", "`io.kestra.plugin.core.flow.Parallel`", `${P}/flow/io.kestra.plugin.core.flow.parallel`],
        ],
    },
    {
        title: "State and workflow settings",
        icon: "mdi:tune-variant",
        rows: [
            ["Data Store", "KV Store", "`{{ kv('key') }}`", "/docs/concepts/kv-store"],
            ["File Store", "Namespace files", "`namespaceFiles: { enabled: true }`", "/docs/concepts/namespace-files"],
            ["`/tmp` directory", "Task working directory, kept with outputFiles", "`outputFiles: [\"*.csv\"]`", OUTPUTS],
            ["Environment variable", "Flow variable, or a secret when sensitive", "`{{ vars.region }}`", "/docs/workflow-components/variables"],
            ["Connected account", "Secret holding your own token or OAuth client", "`{{ secret('NETSUITE_TOKEN') }}`", SECRET],
            ["Auto-retry errors", "Retry policy on the task", "`retry: { type: exponential }`", "/docs/workflow-components/retries"],
            ["Notify me on errors", "Error branch with a notification task", "`errors:`", "/docs/workflow-components/errors"],
            ["Execution timeout limit", "Task timeout, or a flow SLA", "`timeout: PT10M`", "/docs/workflow-components/timeout"],
            ["Memory", "Memory and CPU on the task runner", "`taskRunner.memory`", "/docs/task-runners"],
            ["Concurrency and throttling", "Flow concurrency limit, queued or cancelled", "`concurrency: { limit: 1 }`", "/docs/workflow-components/concurrency"],
            ["Event history", "Executions, logs and outputs in your own database", "`GET /api/v1/main/executions`", "/docs/workflow-components/execution"],
            ["Data retention controls", "Purge task on a schedule", "`io.kestra.plugin.core.execution.PurgeExecutions`", `${P}/execution/io.kestra.plugin.core.execution.purgeexecutions`],
        ],
    },
    {
        title: "Not in the export, rebuilt by hand",
        icon: "mdi:hammer-wrench",
        rows: [
            ["Connected accounts", "Your own OAuth client or API token, as a secret", "`{{ secret('...') }}`", SECRET],
            ["Secret props and bearer tokens", "Secrets in the namespace that uses them", "`{{ secret('...') }}`", SECRET],
            ["Environment variables", "Flow variables, or secrets", "`variables:`", "/docs/workflow-components/variables"],
            ["Data Store contents", "KV Store, loaded with the KV Set task", "`io.kestra.plugin.core.kv.Set`", `${P}/kv/io.kestra.plugin.core.kv.set`],
            ["File Store files", "Namespace files, uploaded with the UploadFiles task", "`io.kestra.plugin.core.namespace.UploadFiles`", `${P}/namespace/io.kestra.plugin.core.namespace.uploadfiles`],
            ["Private component code", "Namespace files, or a custom plugin", "`namespaceFiles:`", "/docs/plugin-developer-guide"],
            ["Senders posting to *.m.pipedream.net", "Repointed to the Kestra webhook URL", "`/api/v1/main/executions/webhook/<ns>/<flow>/<key>`", WEBHOOK],
        ],
    },
]

export const GAPS = [
    [
        "Connected accounts",
        "Your own OAuth client or API token, in the secret manager",
    ],
    ["Secret props and bearer tokens", "The secret manager, per namespace"],
    ["Environment variables", "Flow variables, or secrets when sensitive"],
    ["Data Stores", "KV Store"],
    ["File Stores", "Namespace files or your object storage"],
    ["Code of private components", "Namespace files or a custom plugin"],
] as const

export const COMPOSE = `curl -o docker-compose.yml https://raw.githubusercontent.com/kestra-io/kestra/develop/docker-compose.yml
docker compose up -d`

export function runEditions(cloudHref = "/cloud") {
    return [
        {
            id: "core" as const,
            title: "Kestra Core",
            badge: "Open Source",
            text: "Apache 2.0 on Docker Compose. Run the converted flows yourself, with no limit on flows or executions.",
            cta: { label: "Get started", href: "/get-started" },
        },
        {
            id: "cloud" as const,
            title: "Kestra Cloud",
            text: "SSO, RBAC, audit logs and a secret manager from the first day, and task runners in your own cloud. Priced by task runs and compute.",
            cta: { label: "Start your Cloud trial", href: cloudHref },
            featured: true,
        },
        {
            id: "enterprise" as const,
            title: "Kestra Enterprise",
            text: "Self-hosted, hybrid or air-gapped, with multi-tenancy, worker groups and support with an SLA.",
            cta: { label: "Book a demo", href: "/demo" },
        },
    ]
}

export const FLOW_INLINE = `id: invoice_intake
namespace: finance

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('INVOICE_WEBHOOK_KEY') }}"

tasks:
  - id: transform
    type: io.kestra.plugin.scripts.python.Script
    dependencies: [kestra]
    env:
      BODY: "{{ trigger.body | toJson }}"
    script: |
      import json, os
      from kestra import Kestra
      body = json.loads(os.environ["BODY"])
      Kestra.outputs({"invoice_id": body["id"],
                      "amount": round(float(body["total"]), 2)})

  - id: post_to_netsuite
    type: io.kestra.plugin.core.http.Request
    uri: "{{ secret('NETSUITE_URL') }}/vendorBill"
    method: POST
    body: "{{ outputs.transform.vars | toJson }}"`

const TERMINALS = [
    [
        { cmd: "unzip project_export-proj_abc123.zip -d export" },
        {
            out: [
                "  inflating: export/manifest.json",
                "  inflating: export/invoice-intake-p_abc123.json",
                "  inflating: export/vendor-sync-p_def456.json",
            ],
        },
        { cmd: "jq -r '.workflows[].warnings[]' export/manifest.json" },
        {
            out: [
                "step post_to_netsuite: secret prop token was omitted from the export and must be re-entered after import",
            ],
        },
    ],
    [
        { cmd: "npx skills add kestra-io/agent-skills" },
        { cmd: 'claude "Convert ./export to Kestra flows, one per workflow"' },
        { note: "the agent writes one flow per workflow" },
        { cmd: "ls flows/finance" },
        { out: ["invoice_intake.yaml  vendor_sync.yaml"] },
    ],
    [
        { cmd: "grep -o \"secret('[A-Z_]*')\" flows/finance/invoice_intake.yaml" },
        { out: ["secret('INVOICE_WEBHOOK_KEY')", "secret('NETSUITE_URL')"] },
        { note: "add each one under Namespaces › finance › Secrets" },
    ],
    [
        { cmd: "kestractl flows deploy ./flows/ --override" },
        {
            cmd: 'curl -s "$KESTRA/api/v1/main/executions/webhook/finance/invoice_intake/$KEY" -H "Content-Type: application/json" -d @invoice.json | jq -r .state.current',
        },
        { out: ["CREATED"] },
        { note: "same result as Pipedream? point the sender at Kestra" },
    ],
]

const LABELS = ["Export", "Convert", "Reconnect", "Switch"]
const TINTS = ["#E6C359", "#59E659", "#59BCE6", "#E67FA2"]

export const STEP_DOMAINS = STEPS.map((step, i) => ({
    id: `pd-${LABELS[i].toLowerCase()}`,
    label: LABELS[i],
    tint: TINTS[i],
    title: step.title,
    description: step.text,
    cta: {
        label: step.link.label,
        href: step.link.href,
        external: step.link.href.startsWith("http"),
    },
    terminal: {
        label: `Terminal: ${step.title}`,
        lines: TERMINALS[i],
    },
}))
