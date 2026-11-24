import * as CODE from "./code"

const esc = (text: string) =>
    text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

export const inline = (text: string) =>
    esc(text)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

export const md = (text: string) =>
    text
        .trim()
        .split(/\n\s*\n/)
        .map((block) => {
            const lines = block.trim().split("\n")
            if (lines.every((line) => line.startsWith("- ")))
                return `<ul>${lines.map((line) => `<li>${inline(line.slice(2))}</li>`).join("")}</ul>`
            if (lines.every((line) => /^\d+\.\s/.test(line)))
                return `<ol>${lines.map((line) => `<li>${inline(line.replace(/^\d+\.\s/, ""))}</li>`).join("")}</ol>`
            return `<p>${inline(lines.join(" "))}</p>`
        })
        .join("")

const P = "/plugins/core"
const DOCS = "/docs/workflow-components"

const node = (
    id: string,
    plugin: string,
    fallback: string,
    x: number,
    y: number,
    status: "success" | "running" | "created",
    duration: string,
    seconds: number,
) => ({ id, type: plugin, plugin, fallback, x, y, status, duration, seconds })

export const HERO = {
    title: "Migrate from Airflow to Kestra",
    lead: "Move your DAGs to Kestra flows. The Python, SQL and dbt inside run as they are, and Airflow keeps running alongside until the last DAG moves.",
    ctas: [
        { label: "Try Kestra OSS", href: "/docs/quickstart", solid: true },
        { label: "Talk to a migration engineer", href: "/demo" },
    ],
}

export const LEAVE = [
    {
        icon: "mdi:language-python",
        title: "Every DAG is a Python program",
        text: inline(
            "Airflow runs the file to know what the DAG is, so only engineers who know Airflow can own one. SQL, dbt and shell work ends up wrapped in `PythonOperator`.",
        ),
    },
    {
        icon: "mdi:server-network",
        title: "A platform to keep running",
        text: inline(
            "You run the scheduler, webserver, workers, triggerer and a metadata database, and every provider shares one Python environment.",
        ),
    },
    {
        icon: "mdi:account-group-outline",
        title: "One deployment per team",
        text: inline(
            "One Airflow instance gives teams little isolation from each other, so a second team usually gets a second deployment.",
        ),
    },
]

const row = (cells: string[], href?: string) => ({ cells, href })

export const MAPPING = [
    {
        title: "DAGs and tasks",
        icon: "mdi:sitemap-outline",
        rows: [
            row(["DAG (`dag_id`)", "Flow (`id` + `namespace`)", "Kestra stores the flow as YAML, so there is no DAG bag or parse interval"], `${DOCS}/flow`),
            row(["Task / operator", "Task (`type: io.kestra.plugin...`)", "Plugin classes are typed; properties are validated at save time"], `${DOCS}/tasks`),
            row(["`default_args`", "A flow-level `retry`, flow `variables`, task `timeout`", "`retries: 2` is `maxAttempts: 3`; Policies can enforce defaults per namespace"], `${DOCS}/variables`),
            row(["DAG Factory YAML (`dag-factory`)", "Flow YAML; `io.kestra.plugin.core.flow.Dag` for `dependencies` lists", "No loader DAG; the code lives in the flow or in Namespace Files"], `${P}/flow/io.kestra.plugin.core.flow.dag`),
            row(["Airflow REST API", "Kestra REST API, Terraform provider, CLI, Python/JS/Go SDKs", "—"], "/docs/api-reference"),
        ],
    },
    {
        title: "Scheduling and events",
        icon: "mdi:calendar-clock",
        rows: [
            row(["`schedule` / `schedule_interval` / Timetable", "Schedule trigger with `cron`, `timezone`, `when`", "Cron fires at the scheduled tick, with no data interval"], `${DOCS}/triggers/schedule-trigger`),
            row(["`catchup`", "`recoverMissedSchedules: ALL | LAST | NONE` on the Schedule trigger", "Kestra defaults to `ALL`. A DAG with `catchup=False` must set `NONE`"], `${DOCS}/triggers/schedule-trigger`),
            row(["`start_date`", "Not needed; the Schedule starts when the flow is saved", "No backfill from a past `start_date` by default; use the Backfill UI or API"]),
            row(["Backfill", "Backfill action on the Schedule trigger (UI or API)", "—"], `${DOCS}/triggers/schedule-trigger`),
            row(["`Dataset` / `Asset`", "Flow trigger on the upstream execution; Assets catalog with lineage and freshness triggers", "The asset catalog adds lineage and freshness triggers"], `${DOCS}/triggers/flow-trigger`),
            row(["Sensor", "Polling triggers (`S3`, `SQS`, `Kafka`, `Postgres`…), realtime triggers, `Pause` or `Sleep` tasks", "A polling trigger runs briefly at each interval and holds no worker slot between checks"], `${DOCS}/triggers/polling-trigger`),
            row(["`ExternalTaskSensor`", "Flow trigger with `states: [SUCCESS]` on the upstream flow", "Event-driven; no polling"], `${DOCS}/triggers/flow-trigger`),
            row(["`TriggerDagRunOperator`", "Subflow task", "`wait: true` to block on the child"], `${DOCS}/subflows`),
        ],
    },
    {
        title: "Data and configuration",
        icon: "mdi:database-outline",
        rows: [
            row(["XCom (`xcom_push` / `xcom_pull`)", "Task `outputs`, read as `{{ outputs.<task_id>.<key> }}`", "Outputs are typed; large files go to internal storage as URIs, with no size limit to tune"], `${DOCS}/outputs`),
            row(["`Variable`", "Flow `variables`, KV Store (`{{ kv('KEY') }}`), namespace variables", "The KV Store is scoped per namespace"], "/docs/concepts/kv-store"),
            row(["`Connection`", "`{{ secret('NAME') }}` plus plugin properties (`url`, `username`…)", "No connection object; credentials are secrets, endpoints are task properties"], "/docs/concepts/secret"),
            row(["`Param`", "`inputs` with `type`, `defaults`, validation", "Validated before the execution is created"], `${DOCS}/inputs`),
        ],
    },
    {
        title: "Control flow",
        icon: "mdi:source-branch",
        rows: [
            row(["`TaskGroup` / SubDAG", "Subflow for reuse; `Sequential` / `Parallel` for grouping", "Subflows are first-class executions with their own history"], `${DOCS}/subflows`),
            row(["`BranchPythonOperator` / `ShortCircuitOperator`", "`If` / `Switch`", "Branch on a Pebble expression over inputs or outputs"], `${P}/flow/io.kestra.plugin.core.flow.if`),
            row(["Dynamic task mapping (`.expand()`)", "`Loop` with `values` and `concurrencyLimit`", "Each iteration runs as its own execution; read the value with `item.value`"], `${P}/flow/io.kestra.plugin.core.flow.loop`),
            row(["`retries`, `retry_delay`, `retry_exponential_backoff`", "`retry` with `type: constant` (`interval`), `exponential` or `random`, and `maxAttempts`", "`maxAttempts` counts the first run: Airflow `retries: 2` is `maxAttempts: 3`"], `${DOCS}/retries`),
            row(["`on_failure_callback`", "`errors` block (task or flow level), `afterExecution`, `finally`", "Flow-level `errors` runs once per failed execution"], `${DOCS}/errors`),
            row(["`trigger_rule`", "`allowFailure`, `allowWarning`, `runIf` on tasks; `transmitFailed` on Subflow", "No `one_failed` equivalent; model it with an `errors` branch"], `${DOCS}/tasks`),
            row(["`depends_on_past`", "No direct equivalent", "Guard with an executions query task or a Flow trigger with `states`"]),
        ],
    },
    {
        title: "Runtime and platform",
        icon: "mdi:server-outline",
        rows: [
            row(["Pools / `priority_weight`", "Flow `concurrency` limits; Worker Groups for routing", "No global pool object; concurrency is set per flow"], `${DOCS}/concurrency`),
            row(["Executor (Celery, Kubernetes)", "Task runners per task: `Process`, `Docker`, Kubernetes, cloud batch and VMs", "Each task picks its own runner"], "/docs/task-runners"),
            row(["RBAC, SSO, multi-tenancy", "Tenants, action-based RBAC, SSO/OIDC/SCIM", "Access is set per namespace"], "/docs/enterprise/auth"),
        ],
    },
]

const plugin = (path: string) => `/plugins/${path}`

export const OPERATORS = [
    {
        title: "",
        icon: "",
        rows: [
            row(["`PythonOperator`, `@task`", "`io.kestra.plugin.scripts.python.Script` (inline) or `.Commands` (existing files)", "Keep the function body; return values become outputs through `Kestra.outputs()`"], plugin("plugin-script-python/io.kestra.plugin.scripts.python.script")),
            row(["`BashOperator`", "`io.kestra.plugin.scripts.shell.Commands`", "Docker by default; the `io.kestra.plugin.core.runner.Process` task runner for host execution"], plugin("plugin-script-shell/io.kestra.plugin.scripts.shell.commands")),
            row(["`KubernetesPodOperator`", "Any script task with the Kubernetes task runner, or `io.kestra.plugin.kubernetes.core.PodCreate`", "Run the same image as the pod, or create the pod directly"], plugin("plugin-kubernetes/kubernetes-core/io.kestra.plugin.kubernetes.core.podcreate")),
            row(["`DockerOperator`", "Script task with the default Docker runner, or `io.kestra.plugin.docker.cli.Run`", "—"], "/docs/task-runners"),
            row(["`SQLExecuteQueryOperator`, `PostgresOperator`, `MySqlOperator`", "`io.kestra.plugin.jdbc.<db>.Query` / `.Queries`", "`fetchType: FETCH` returns rows as outputs"], plugin("plugin-jdbc-postgres/io.kestra.plugin.jdbc.postgresql.query")),
            row(["`SnowflakeOperator`", "`io.kestra.plugin.jdbc.snowflake.Query`", "Used in example 1 below"], plugin("plugin-jdbc-snowflake/io.kestra.plugin.jdbc.snowflake.query")),
            row(["`BigQueryInsertJobOperator`", "`io.kestra.plugin.gcp.bigquery.Query` / `Load`", "Service account through `{{ secret() }}`"], plugin("plugin-gcp/google-cloud-bigquery/io.kestra.plugin.gcp.bigquery.query")),
            row(["`DbtRunOperator`, `DbtCloudRunJobOperator`", "`io.kestra.plugin.dbt.cli.DbtCLI`, `io.kestra.plugin.dbt.cloud.TriggerRun`", "`DbtCLI` parses `run_results.json` into per-model tasks"], plugin("plugin-dbt/dbt-cli/io.kestra.plugin.dbt.cli.dbtcli")),
            row(["`SparkSubmitOperator`, `DatabricksSubmitRunOperator`", "`io.kestra.plugin.spark.*`, `io.kestra.plugin.databricks.job.SubmitRun`", "—"], plugin("plugin-databricks/databricks-job/io.kestra.plugin.databricks.job.submitrun")),
            row(["`S3CopyObjectOperator` and other transfer operators", "`io.kestra.plugin.aws.s3.*`, then a `Query` task", "Transfer operators split into two explicit tasks"], "/plugins/plugin-aws"),
            row(["`HttpOperator` (formerly `SimpleHttpOperator`)", "`io.kestra.plugin.core.http.Request`", "—"], `${P}/http/io.kestra.plugin.core.http.request`),
            row(["`EmailOperator`, `SlackWebhookOperator`", "`io.kestra.plugin.email.MailSend`, `io.kestra.plugin.slack.notifications.SlackIncomingWebhook`", "Usually placed in `errors` or `finally`"], plugin("plugin-email/io.kestra.plugin.email.mailsend")),
            row(["`S3KeySensor`, `FileSensor`, `SqlSensor`", "`io.kestra.plugin.aws.s3.Trigger`, `io.kestra.plugin.fs.local.Trigger`, `io.kestra.plugin.jdbc.<db>.Trigger`", "Sensors become flow triggers; no worker slot held between polls"], plugin("plugin-aws/aws-s3/io.kestra.plugin.aws.s3.trigger")),
            row(["`TriggerDagRunOperator`", "`io.kestra.plugin.core.flow.Subflow`", "`inputs` passed explicitly; `wait` and `transmitFailed` control the parent"], `${P}/flow/io.kestra.plugin.core.flow.subflow`),
            row(["`EmptyOperator` / `DummyOperator`", "Usually dropped; `io.kestra.plugin.core.log.Log` if a marker is needed", "The topology no longer needs placeholder nodes"], `${P}/log/io.kestra.plugin.core.log.log`),
            row(["Custom operator (`BaseOperator` subclass)", "Script task wrapping the same code, or a custom Java plugin", "Most custom operators are Python wrappers around an API: run the code, drop the wrapper"], "/docs/plugin-developer-guide"),
        ],
    },
]

export const EXAMPLES = [
    {
        id: "af-example-dbt",
        tab: "Daily dbt build",
        title: "Stage the orders, then build the dbt models",
        html: md("Every morning at 06:00, with two retries and a Slack alert on failure."),
        panes: [
            { label: "Airflow · orders_daily.py", lang: "python", code: CODE.DAILY_AIRFLOW },
            { label: "Kestra · orders_daily.yaml", lang: "yaml", code: CODE.DAILY_KESTRA },
        ],
        after: md(
            "- `default_args` retries become one flow-level `retry`, and `retries: 2` becomes `maxAttempts: 3`.\n- Write `catchup=False` as `recoverMissedSchedules: NONE`; Kestra replays missed runs otherwise.\n- The Slack connection becomes a secret and the callback an `errors` task.",
        ),
    },
    {
        id: "af-example-mapping",
        tab: "API extract per account",
        title: "Call the billing API for every active account",
        html: md("One query lists the accounts, then one API call per account, eight at a time."),
        panes: [
            { label: "Airflow · usage_extract.py", lang: "python", code: CODE.USAGE_AIRFLOW },
            { label: "Kestra · usage_extract.yaml", lang: "yaml", code: CODE.USAGE_KESTRA },
        ],
        after: md(
            "- `.expand()` becomes `Loop`, and `max_active_tasks=8` becomes `concurrencyLimit: 8`.\n- `PostgresHook` and `Variable.get` only exist inside Airflow: the query becomes a JDBC task and the token a secret.\n- The API call needs no Python, and `retries=3` becomes `maxAttempts: 4`.",
        ),
    },
    {
        id: "af-example-dataset",
        tab: "Dataset-driven report",
        title: "Refresh the report after each orders update",
        html: md("An hourly merge updates the orders table, and the report refreshes after each successful merge."),
        panes: [
            { label: "Airflow · orders.py", lang: "python", code: CODE.DATASETS_AIRFLOW },
            { label: "Kestra · orders_ingest.yaml", lang: "yaml", code: CODE.INGEST_KESTRA },
            { label: "Kestra · orders_report.yaml", lang: "yaml", code: CODE.REPORT_KESTRA },
        ],
        after: md(
            "- `outlets` and `schedule=[orders]` become a Flow trigger on `orders_ingest`.\n- Kestra Enterprise adds asset declarations with lineage and freshness triggers.",
        ),
    },
]

export const COMPARE_ROWS = (plugins: number | string) => [
    { label: "Who writes workflows", values: ["Python engineers who know Airflow", "Anyone who can write YAML; Python, SQL, dbt and shell run as tasks"] },
    { label: "The plan", values: ["Discovered by running Python", "Declared; the topology is visible before any run"] },
    { label: "Scaling", values: ["Parse time and database load grow with the DAG count", "Stored as YAML, so the flow count adds no parse time"] },
    { label: "Several teams", values: ["Usually one deployment per team", "Namespaces, with RBAC, SSO and tenants"] },
    { label: "Integrations", values: ["Providers installed on every worker", `${plugins}+ plugins, versioned apart from the core`] },
    { label: "Best fit", values: ["Python engineers in one codebase", "Several teams, and work beyond Python"] },
]

const STEPS = [
    {
        label: "Inventory",
        title: "List what you run",
        text: "Export every DAG with its schedule and last run, group the ones linked by Datasets, and retire the DAGs with no successful run in 90 days.",
        cta: { label: "Airflow REST API", href: "https://airflow.apache.org/docs/apache-airflow/2.10.5/stable-rest-api-ref.html" },
        visual: {
            label: "The Airflow DAG list on the left, the migration inventory stored in the Kestra KV Store on the right",
            airflow: {
                kind: "dags" as const,
                rows: [
                    { dag: "orders_daily", schedule: "0 6 * * *", last: "2026-11-24 06:00" },
                    { dag: "orders_ingest", schedule: "@hourly", last: "2026-11-24 11:00" },
                    { dag: "orders_report", schedule: "Dataset", last: "2026-11-24 11:02" },
                    { dag: "usage_extract", schedule: "@hourly", last: "2026-11-24 11:00" },
                    { dag: "legacy_export", schedule: "@daily", last: "2025-03-02 00:00", at: 2 },
                ],
            },
            kestra: {
                kind: "tags" as const,
                title: "Key",
                rows: [
                    { dag: "orders_daily", tag: "move · wave 1", at: 0 },
                    { dag: "usage_extract", tag: "move · wave 1", at: 0 },
                    { dag: "orders_ingest", tag: "move · wave 2", at: 1 },
                    { dag: "orders_report", tag: "move · wave 2", at: 1 },
                    { dag: "legacy_export", tag: "retire", tone: "retire" as const, at: 2 },
                ],
            },
            checks: [
                "Every DAG listed with its last run",
                "Dataset-linked DAGs move together",
                "DAGs idle for 90 days paused and left behind",
            ],
        },
    },
    {
        label: "Side by side",
        title: "Run both until the last DAG moves",
        text: "Pause each moved DAG in Airflow and keep it as a fallback. DAGs that haven't moved keep running in Airflow, and Kestra triggers them through the REST API.",
        cta: { label: "LoopUntil task", href: "/plugins/core/flow/io.kestra.plugin.core.flow.loopuntil" },
        visual: {
            label: "Moved DAGs switch to paused in Airflow while their flows succeed in Kestra",
            airflow: {
                kind: "dags" as const,
                rows: [
                    { dag: "orders_daily", schedule: "0 6 * * *", last: "2026-11-24 06:00", at: 0 },
                    { dag: "usage_extract", schedule: "@hourly", last: "2026-11-24 11:00", at: 1 },
                    { dag: "orders_ingest", schedule: "@hourly", last: "2026-11-24 11:00" },
                    { dag: "orders_report", schedule: "Dataset", last: "2026-11-24 11:02" },
                    { dag: "legacy_export", schedule: "@daily", last: "2025-03-02 00:00", paused: true },
                ],
            },
            kestra: {
                kind: "flows" as const,
                rows: [
                    { id: "orders_daily", namespace: "company.data", at: 0 },
                    { id: "usage_extract", namespace: "company.billing", at: 1 },
                    { id: "trigger_orders_ingest", namespace: "company.data", note: "POST /api/v1/dags/orders_ingest/dagRuns", at: 2 },
                ],
            },
            checks: [
                "orders_daily runs in Kestra, DAG paused",
                "usage_extract runs in Kestra, DAG paused",
                "orders_ingest still in Airflow, triggered from Kestra",
            ],
        },
    },
    {
        label: "Switch off",
        title: "Switch Airflow off",
        text: "When no DAG is left unpaused, export the run history, keep the metadata database as a read-only archive and uninstall the services.",
        cta: { label: "Kestra API reference", href: "/docs/api-reference" },
        visual: {
            label: "Airflow cluster health goes from healthy to stopped while every flow runs in Kestra",
            airflow: {
                kind: "health" as const,
                unpausedAt: 0,
                rows: [
                    { name: "Scheduler", at: 2 },
                    { name: "Triggerer", at: 2 },
                    { name: "MetaDatabase", at: 1, after: "ARCHIVED" },
                ],
            },
            kestra: {
                kind: "flows" as const,
                rows: [
                    { id: "orders_daily", namespace: "company.data", at: 0 },
                    { id: "orders_ingest", namespace: "company.data", at: 0 },
                    { id: "orders_report", namespace: "company.data", at: 0 },
                    { id: "usage_extract", namespace: "company.billing", at: 0 },
                ],
            },
            checks: [
                "Every pipeline runs in Kestra",
                "Run history exported, database read-only",
                "Airflow uninstalled",
            ],
        },
    },
]

const TINTS = ["#E6C359", "#59E659", "#59BCE6", "#E67FA2", "#9869F7", "#E6A259", "#59E6C8"]

export const PLAYBOOK_STEPS = STEPS

export const PLAYBOOK_DOMAINS = STEPS.map((step, i) => ({
    id: `af-${step.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    label: step.label,
    tint: TINTS[i],
    title: step.title,
    description: step.text,
    cta: {
        label: step.cta.label,
        href: step.cta.href,
        external: step.cta.href.startsWith("http"),
    },
}))

export const PLAYBOOK_LEAD = ""

export function runEditions(cloudHref = "/cloud") {
    return [
        {
            id: "core" as const,
            title: "Kestra Core",
            badge: "Open Source",
            text: "Apache 2.0, like Airflow. A complete replacement for a single-team Airflow instance: flows, triggers, Loop, Subflow, retries and script tasks.",
            cta: { label: "Get started", href: "/docs/quickstart" },
        },
        {
            id: "cloud" as const,
            title: "Kestra Cloud",
            text: "The same flows, hosted. SSO, RBAC, a managed secret manager and remote task runners, with no servers to operate.",
            cta: { label: "Start your Cloud trial", href: cloudHref },
            featured: true,
        },
        {
            id: "enterprise" as const,
            title: "Kestra Enterprise",
            text: "Self-hosted, hybrid or air-gapped. Tenants, Worker Groups, Policies, the Assets catalog and high availability on Kafka and Elasticsearch.",
            cta: { label: "Talk to sales", href: "/demo" },
        },
    ]
}

export const HOW = {
    headingId: "af-how-title",
    title: "Translate, backfill, compare",
    lead: "",
    steps: [
        {
            title: "Translate",
            text: "Each operator becomes a task, default_args retries become one retry block, and the Slack callback becomes an errors task.",
        },
        {
            title: "Backfill",
            text: "Replay the last three days with the Schedule trigger's backfill, writing to a shadow schema, so the comparison doesn't wait three days.",
        },
        {
            title: "Compare",
            text: "Compare the rows each day wrote with what the DAG wrote. When all three match, pause the DAG and delete it.",
        },
    ],
    flow: `id: orders_daily
namespace: company.data

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 6 * * *"
    recoverMissedSchedules: NONE # catchup=False

retry:
  type: constant
  interval: PT5M
  maxAttempts: 3 # retries: 2

tasks:
  - id: stage_orders
    type: io.kestra.plugin.jdbc.postgresql.Queries
    url: "{{ secret('WAREHOUSE_JDBC_URL') }}"
    sql: "{{ read('sql/stage_orders.sql') }}"

  - id: dbt_build
    type: io.kestra.plugin.dbt.cli.DbtCLI
    namespaceFiles:
      enabled: true
    commands:
      - dbt build --select orders+

errors:
  - id: slack_alert
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"`,
    flowLabel: "The orders_daily flow translated from Airflow",
    used: [
        "core.trigger.Schedule",
        "jdbc.postgresql.Queries",
        "dbt.cli.DbtCLI",
        "slack.notifications.SlackIncomingWebhook",
    ],
    run: [
        { id: "stage_orders", duration: "3.2s", start: 0, length: 0.12 },
        { id: "dbt_build", duration: "1m 12s", start: 0.12, length: 0.88 },
    ],
    logs: [
        { at: 1500, level: "INFO", time: "06:00:03.214", task: "stage_orders", message: "4 statements executed" },
        { at: 1750, level: "INFO", time: "06:00:03.402", task: "dbt_build", message: "dbt build --select orders+" },
        { at: 4000, level: "INFO", time: "06:01:15.106", task: "dbt_build", message: "Done. PASS=14 WARN=0 ERROR=0 SKIP=0 TOTAL=14" },
    ],
    timeline: [
        [900, 0, "running"],
        [1500, 0, "success"],
        [1700, 1, "running"],
        [4300, 1, "success"],
    ] as [number, number, string][],
    execId: "7mQx3k",
    git: {
        title: "orders_daily.py",
        icon: "mdi:language-python",
        branch: "Airflow",
        items: [
            { avatar: "AF", text: "SQLExecuteQueryOperator → Queries", on: 1400, fresh: true },
            { avatar: "AF", text: "BashOperator → DbtCLI", on: 1800 },
            { avatar: "AF", text: "retries: 2 → maxAttempts: 3", on: 2200 },
            { avatar: "AF", text: "on_failure_callback → errors", on: 2600 },
        ],
    },
    ci: {
        title: "Checks",
        icon: "mdi:check-decagram-outline",
        done: "Deployed",
        doneOn: 3800,
        open: "Running",
        items: [
            { text: "Flow validated", on: 2900 },
            { text: "DAG paused in Airflow", on: 3300 },
            { text: "kestractl flows deploy", on: 3600 },
        ],
    },
    gov: {
        title: "Side by side",
        icon: "mdi:compare-horizontal",
        items: [
            { icon: "mdi:numeric-1-circle-outline", text: "Run 1", small: "Same rows as Airflow", on: 1600 },
            { icon: "mdi:numeric-2-circle-outline", text: "Run 2", small: "Same rows as Airflow", on: 2800 },
            { icon: "mdi:numeric-3-circle-outline", text: "Run 3", small: "DAG deleted", on: 4500 },
        ],
    },
    foot: { label: "Agent skills for the translation", href: "/docs/develop-with-ai/agent-skills" },
    compare: {
        title: "orders_daily.py",
        branch: "Airflow",
        code: CODE.DAILY_AIRFLOW,
        topology: {
            label: "Kestra topology of orders_daily: daily schedule, stage_orders, dbt_build",
            nodes: [
                node("daily", "core.trigger.Schedule", "mdi:clock-outline", 0, 0, "success", "0.2s", 0.2),
                node("stage_orders", "jdbc.postgresql.Queries", "mdi:database-outline", 0, 140, "success", "3.2s", 3.2),
                node("dbt_build", "dbt.cli.DbtCLI", "mdi:database", 0, 280, "success", "1m 12s", 72),
            ],
        },
    },
}

