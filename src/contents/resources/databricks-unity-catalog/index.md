---
title: "Databricks Unity Catalog: How It Works and Where Its Governance Stops"
description: "How Databricks Unity Catalog governs data and AI assets: the metastore object model, managed vs external tables, SQL grants, lineage, audit logs and Delta Sharing. Plus what it does not govern, and how to control the jobs that create and change your governed tables."
metaTitle: "Databricks Unity Catalog: How It Works & Limits | Kestra"
metaDescription: "Databricks Unity Catalog explained: object model, grants, lineage, audit logs, Delta Sharing, Hive metastore differences, and governing the jobs around it."
tag: "data"
date: 2026-07-07
lastUpdated: 2026-10-26
slug: "databricks-unity-catalog"
faq:
  - question: "How does Databricks Unity Catalog provide unified governance for data and AI assets?"
    answer: "Unity Catalog stores metadata, permissions, lineage and audit records for tables, views, volumes, functions and registered models in one account-level metastore per region, shared by every attached workspace. Access is granted once with SQL GRANT statements and enforced by the Databricks engine on every query, whether it comes from a notebook, a job or a SQL warehouse. A model and the table it was trained on follow the same rules and appear in the same lineage graph."
  - question: "What is the difference between Unity Catalog and the Hive metastore?"
    answer: "The Hive metastore is a legacy, per-workspace catalog with a two-level namespace (schema.table) and access control that only applies on specific cluster types. Unity Catalog is account-level, uses a three-level namespace (catalog.schema.table), enforces grants on all Unity Catalog-enabled compute, and adds automatic lineage, audit system tables, volumes, models and Delta Sharing. Hive metastore tables stay readable through the hive_metastore catalog but get none of those governance features."
  - question: "Does Unity Catalog support row-level and column-level security?"
    answer: "Yes. Row filters and column masks are SQL functions attached to a table and evaluated at query time, so one table can return different rows or redacted columns depending on group membership. For example, a column mask can show a full IBAN to the payments group and only the last four digits to everyone else, without maintaining a separate view per audience. Databricks has also added tag-based (ABAC) policies that apply such rules across many tables at once."
  - question: "Does Unity Catalog replace an orchestrator?"
    answer: "No. Unity Catalog decides who can read or write a governed asset and records what happened to it. It does not schedule jobs, wait for files from systems outside Databricks, retry failed runs, or hold a deployment for human approval. Lakeflow Jobs covers scheduling inside Databricks; an orchestrator such as Kestra covers the end-to-end run, including the steps that happen before and after the Databricks job."
  - question: "What happens to the data when you drop a Unity Catalog table?"
    answer: "It depends on the table type. Dropping a managed table removes it from the catalog, keeps it recoverable with UNDROP TABLE for 7 days by default, then purges the underlying files from cloud storage. Dropping an external table only removes the metadata: the files stay at their storage path and you delete them yourself. This is why production tables that other systems never write to directly should usually be managed."
  - question: "Is Unity Catalog open source?"
    answer: "Partly. Databricks open-sourced Unity Catalog in 2024 as a Linux Foundation AI & Data project, with the code on GitHub under the unitycatalog organization. The Unity Catalog you use inside Databricks is a managed service that implements the same open APIs and adds platform features of its own. Check feature parity before planning to run the open-source server as a drop-in replacement."
---

> **TL;DR** — Unity Catalog is the account-level governance layer of Databricks: one metastore per region holds the permissions, lineage and audit records for every table, volume, function and model your workspaces use. It governs access to data inside Databricks. It does not schedule jobs, coordinate dependencies outside Databricks, or record who approved a run. That second layer of governance belongs to the orchestrator.

Databricks Unity Catalog is the governance layer of the Databricks platform: a single metastore per cloud region that stores the metadata, access policies, lineage and audit logs for every data and AI asset its attached workspaces can reach. Before Unity Catalog, each workspace had its own Hive metastore and its own permission model, so the same table could be open in one workspace and locked in another.

Unity Catalog replaces that with one model. Every asset gets a three-level name (`catalog.schema.table`), access is granted with ANSI SQL, and Databricks enforces those grants on all Unity Catalog-enabled compute: SQL warehouses, serverless compute, and clusters in standard or dedicated access mode. Lineage is captured from the queries themselves, down to the column, and data access lands in an audit log you can query as a system table. Workspaces created after November 8, 2023 have Unity Catalog enabled automatically ([Databricks documentation](https://docs.databricks.com/aws/en/data-governance/unity-catalog/)).

That covers the data assets. It does not cover the runs that create and modify them, which is where most pipeline incidents start. This guide explains how Unity Catalog works, what it records, where its governance stops, and how to govern the jobs around it.

## The Unity Catalog object model: metastore, catalog, schema, asset

Unity Catalog organizes everything as securable objects in a hierarchy, and permissions flow down that hierarchy. The metastore sits at the top and holds metadata only; the data itself stays in your cloud object storage, which is what makes it the governance piece of a [lakehouse architecture](/resources/data/lakehouse-architecture) rather than a storage engine.

| Level | What it holds | Typical use |
|---|---|---|
| Metastore | All catalogs, plus storage credentials, external locations, connections and shares | One per region per Databricks account, attached to every workspace in that region |
| Catalog | Schemas | Separate environments (`dev`, `prod`) or business domains (`finance`, `marketing`) |
| Schema | Tables, views, volumes, functions, models | Group the assets of one data product or one pipeline layer (`bronze`, `silver`, `gold`) |
| Table / view | Structured data, managed or external | Delta or Iceberg tables, materialized views, foreign tables from federated databases |
| Volume | Non-tabular files | Landing zones for CSV or JSON drops, images, model artifacts |
| Function | SQL or Python UDFs | Reusable logic, row filters and column masks |
| Registered model | MLflow model versions | Models governed with the same grants and lineage as the tables they train on |

Two details in this hierarchy matter more than they look.

Catalogs can be bound to specific workspaces. A `prod` catalog bound only to the production workspace stays unreachable from a sandbox workspace, even for a user who holds `SELECT` on it. That is the cleanest way to separate environments without duplicating metastores.

The objects outside the three-level namespace control how Databricks reaches storage and other systems. A storage credential wraps a cloud IAM role or managed identity; an external location pairs a storage path with a credential; a connection points at an external database for Lakehouse Federation. These are where the expensive mistakes happen: granting `CREATE EXTERNAL TABLE` on an external location that covers a whole bucket hands out far more than one table.

Compute matters too. Unity Catalog data is only reachable from compute that enforces its model, which rules out legacy no-isolation clusters. If you are choosing compute per workload, the [Databricks cluster types](/resources/data/databricks-cluster-types) guide covers how access modes map to job, all-purpose and serverless compute.

## Managed vs external tables: who owns the files when you drop a table

A managed table stores its files in storage that Unity Catalog controls, and Unity Catalog manages their whole lifecycle. An external table stores its files at a path you registered, and you keep ownership of those files. The difference shows up the day someone runs `DROP TABLE`.

Managed tables are the default. They use [Delta Lake](/resources/data/delta-lake) unless you specify `USING iceberg`. Databricks handles file layout and maintenance through predictive optimization, which is on by default for accounts created on or after November 11, 2024. Dropping a managed table makes it recoverable with `UNDROP TABLE` for 7 days by default; after that window, an asynchronous process deletes the underlying files ([Databricks: managed tables](https://docs.databricks.com/aws/en/tables/managed)).

External tables behave like pointers. Dropping one removes the catalog entry and leaves every file in place, so cleaning the bucket is your job. They make sense when something outside Databricks writes to that path directly, or during a migration when other engines still own the data.

Databricks recommends managed tables for new work, and existing external Delta tables can be converted. A practical rule: use an external table only when you can name the non-Databricks writer that needs the path. Volumes follow the same split, with managed volumes deleting their files on drop and external volumes leaving them.

## Access control in Unity Catalog: SQL grants that inherit downward

Unity Catalog controls access with ANSI SQL `GRANT` and `REVOKE` statements on securable objects, and a privilege granted on a catalog or schema applies to all current and future objects inside it. Reading a table takes three privileges, not one: `USE CATALOG` on the catalog, `USE SCHEMA` on the schema, and `SELECT` on the table or its parent.

```sql
-- Let the finance analysts group read every current and future table in finance.gold
GRANT USE CATALOG ON CATALOG finance TO `finance-analysts`;
GRANT USE SCHEMA ON SCHEMA finance.gold TO `finance-analysts`;
GRANT SELECT ON SCHEMA finance.gold TO `finance-analysts`;
```

The other privileges follow the same pattern. `MODIFY` allows inserts, updates and deletes. `READ VOLUME` and `WRITE VOLUME` cover files. `EXECUTE` covers functions and registered models. `CREATE TABLE`, `CREATE SCHEMA` and their siblings allow creating objects in a parent container. `BROWSE` lets people discover that an object exists and read its metadata without reading data, which is useful for a searchable catalog. `MANAGE` lets someone administer grants on an object without owning it ([Databricks: privileges reference](https://docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/privileges)).

Below the table level, row filters and column masks handle fine-grained access. Both are SQL functions attached to a table and evaluated at query time, so the same `customers` table can return only EU rows to the EU team and a masked email column to everyone outside support. Databricks has also added attribute-based access control, where policies key off governed tags instead of individual tables, so one rule can cover every column tagged as personal data.

Is it good access control? For data inside Databricks, yes. Enforcement happens in the engine for every query, regardless of whether it comes from a notebook, a BI tool hitting a SQL warehouse, or a scheduled job, and there is no side door through a differently configured cluster. The weak points are elsewhere:

- A grant is only as precise as the identity behind the query. Production pipelines usually run as a service principal, so the engine sees the service principal, not the engineer or upstream event that caused the run.
- Inheritance makes over-scoping easy. One `SELECT` on a catalog also covers tables created next year.
- Grants applied by hand in the SQL editor drift. Without a review step, nobody can tell which grants were intended and which were a quick fix during an incident.

Grant to groups rather than individuals, give each pipeline its own service principal scoped to the schemas it writes, and manage grants as code that goes through review.

## Lineage and audit logs come free, with gaps worth knowing

Unity Catalog captures lineage automatically at table and column level for queries that run through Spark DataFrames or Databricks SQL, and aggregates it across every workspace attached to the metastore. Notebooks, jobs, pipelines, dashboards and queries appear as the producers and consumers of each table. You browse it in Catalog Explorer, or query it from the `system.access.table_lineage` and `system.access.column_lineage` system tables, which keep a rolling one-year window ([Databricks: data lineage](https://docs.databricks.com/aws/en/data-governance/unity-catalog/data-lineage)).

The gaps are documented, and a few of them hit pipeline teams directly:

- Jobs submitted with the Jobs API `runs submit` call get table and column lineage, but not the link back to the job run. If you need the job itself to show up in lineage, trigger a job defined in the workspace.
- Renaming a catalog, schema, table, view or column does not preserve lineage.
- RDD operations and global temp views are not captured.
- Column lineage for sources referenced by path, rather than by table name, only appears in the system table.
- Anything outside Databricks is invisible unless you register it as an external metadata object and declare its relationships by hand.

Audit logs cover the access side. The `system.access.audit` system table records Unity Catalog events: who read a table, who changed a grant, who requested temporary credentials for a storage path. That answers "who touched this data, and when." It does not answer "why did this job run at 03:12," "which upstream file caused it," or "who decided to publish a table that failed its checks." Those answers live in whatever triggered the run. For a broader look at how catalog and lineage tooling fit together, see [data catalog and lineage](/resources/data/data-catalog-lineage).

## Delta Sharing and open APIs extend governance past the workspace

Delta Sharing is the open protocol Unity Catalog uses to share live data with other organizations or platforms without copying it. A provider groups tables and other assets into a read-only share and grants it to a recipient. Recipients on Databricks with Unity Catalog receive it through Databricks-to-Databricks sharing; anyone else connects through open sharing with any client that implements the protocol. The recipient reads the provider's current data, the provider can revoke access at any time, and every access is audited on the provider's side.

Unity Catalog also opens up in the other two directions:

- External engines can read Unity Catalog tables through its REST API and its Iceberg REST catalog interface, with credential vending so they never hold long-lived storage keys. This requires the `EXTERNAL USE SCHEMA` privilege, which only the catalog owner can grant.
- Lakehouse Federation lets Databricks query external databases through foreign catalogs, so a PostgreSQL or Snowflake table can sit under the same grant model as your Delta tables while the data stays where it is.

Since 2024, Unity Catalog also exists as an open-source project under the Linux Foundation AI & Data, with code at [github.com/unitycatalog/unitycatalog](https://github.com/unitycatalog/unitycatalog). The managed service inside Databricks goes further than the open-source server, so treat the open-source version as an interoperability standard rather than a drop-in replacement.

## Unity Catalog vs the Hive metastore

The Hive metastore is a per-workspace catalog inherited from the Hadoop era; Unity Catalog is an account-level governance layer built for the lakehouse. In a Unity Catalog-enabled workspace, the old metastore still appears as a catalog named `hive_metastore`, so you can query and join legacy tables during a migration, but those tables get none of Unity Catalog's lineage, auditing or access control.

| Dimension | Hive metastore | Unity Catalog |
|---|---|---|
| Scope | One per workspace | One per region, shared by all attached workspaces |
| Namespace | Two levels: `schema.table` | Three levels: `catalog.schema.object` |
| Access control | Legacy table ACLs, enforced only on specific cluster configurations | ANSI SQL grants enforced on all Unity Catalog-enabled compute |
| Row and column security | Dynamic views | Row filters, column masks, tag-based policies |
| Lineage | None built in | Automatic, table and column level |
| Auditing | No Unity Catalog audit events | `system.access.audit` system table |
| Non-tabular assets | Not governed | Volumes, functions, registered models |
| External sharing | Not supported | Delta Sharing |
| Status | Legacy; Databricks recommends migrating | Default for workspaces created after November 8, 2023 |

There are two migration paths. You can upgrade tables into Unity Catalog, or use Hive metastore federation, which mirrors the Hive metastore as a foreign catalog so you can govern it with Unity Catalog grants while you migrate. Once tables are moved, Databricks recommends disabling direct Hive metastore access so nobody keeps writing to the ungoverned copy.

## What Unity Catalog does not do

Unity Catalog governs assets and access. It is not a scheduler, a dependency manager or an approval system, and treating it as one creates blind spots.

- It does not schedule or trigger anything. Lakeflow Jobs (formerly Databricks Workflows) schedules work inside Databricks; Unity Catalog only enforces what that work may read and write.
- It does not know about dependencies outside Databricks: the SFTP drop that has to land first, the Salesforce export, the reverse-ETL sync that must run after the gold table refreshes.
- It does not check what is inside the data. A table full of null amounts is perfectly governed. Quality checks come from pipeline expectations, monitoring, or tests you run.
- It does not decide whether a run should proceed. There is no notion of holding a publish step until a data owner signs off.
- It does not manage the run lifecycle: retries, timeouts, backfills, concurrency limits, or what happens when step three of seven fails.
- It does not connect an access event to its cause. The audit log shows the service principal that wrote the table, not the schedule, webhook or person behind the run.

None of this is a flaw. Unity Catalog does one job and does it at the engine level. Teams comparing platforms on governance should keep the distinction in mind, because "governance" in a [Databricks alternatives](/resources/data/databricks-alternatives) evaluation can mean data access or run control, and the tools differ on each.

## Pipeline governance needs two layers: assets and runs

Unity Catalog simplifies governance for data engineers running many pipelines by giving all of them one namespace, one grant model and one lineage graph. You stop maintaining per-workspace ACLs, and you can answer "what reads this table" without asking every pipeline owner. What it does not simplify is the run side: which execution produced today's version of a table, what it waited for, how many times it retried, and who let it through. That layer belongs to the orchestrator.

| Governance question | Unity Catalog | Orchestrator |
|---|---|---|
| Who is allowed to read or write this table? | Yes, through grants | No |
| Who actually read it last Tuesday? | Yes, audit system table | No |
| Which tables feed this dashboard? | Yes, within Databricks | Only for steps it runs |
| What triggered the run that rewrote it? | No | Yes: schedule, event, webhook or manual run |
| Did it wait for the upstream file outside Databricks? | No | Yes, as an explicit dependency |
| How many attempts did the run take, and what failed? | Partly, for the Databricks job itself | Yes, across every step |
| Who approved publishing despite a failed check? | No | Yes, if the flow has an approval step |
| What did the pipeline definition look like on that date? | No | Yes, through flow revisions or Git |

Rely on Unity Catalog and Lakeflow Jobs alone when your pipelines start and end inside Databricks, have no external dependencies, and need no human sign-off. Add an orchestrator when a run depends on systems outside Databricks, when one business process spans Databricks and other tools, or when an auditor asks why something ran, not only who it ran as. The [Databricks Workflows alternatives](/resources/data/databricks-workflows-alternatives) guide compares the options for that second case.

## Orchestrating Databricks jobs under Unity Catalog with Kestra

Kestra runs the end-to-end flow and calls Databricks for the steps that belong there, so Unity Catalog keeps enforcing data access while every run gets a trigger, a history and an approval trail. The flow below lands a partner's daily invoice export in a Unity Catalog volume, runs the Databricks job that loads it into `finance.silver.invoices`, checks the result, and holds the publish step for the data owner when the check finds bad rows.

```yaml
id: invoices-daily-unity-catalog
namespace: company.finance

description: |
  Land the partner invoice export in a Unity Catalog volume, run the Databricks
  load job, check the silver table, and require a data owner decision before
  publishing to gold when the check fails.

inputs:
  - id: load_job_id
    type: STRING
    defaults: "111111111111111"
  - id: publish_job_id
    type: STRING
    defaults: "222222222222222"

variables:
  load_date: "{{ (trigger.date ?? execution.startDate) | date('yyyy-MM-dd') }}"

tasks:
  # Step outside Databricks: a read-only GET, safe to retry
  - id: download_invoices
    type: io.kestra.plugin.core.http.Download
    uri: "https://partner.example.com/exports/invoices-{{ render(vars.load_date) }}.csv"
    headers:
      Authorization: "Bearer {{ secret('PARTNER_API_TOKEN') }}"
    retry:
      type: exponential
      maxAttempts: 3
      interval: PT30S
      maxInterval: PT5M

  # Land the file in a governed volume (WRITE VOLUME on finance.bronze.landing)
  - id: upload_to_volume
    type: io.kestra.plugin.databricks.unitycatalog.volume.Upload
    host: "{{ secret('DATABRICKS_HOST') }}"
    authentication:
      token: "{{ secret('DATABRICKS_TOKEN') }}"
    from: "{{ outputs.download_invoices.uri }}"
    volumePath: "/Volumes/finance/bronze/landing/invoices/{{ render(vars.load_date) }}.csv"
    overwrite: true

  # Trigger the load job defined in Databricks, so Unity Catalog lineage links
  # the table to a named job. The run name ties the Databricks run to this execution.
  # No retry: a second attempt would launch a second load.
  - id: load_silver
    type: io.kestra.plugin.databricks.job.SubmitRun
    host: "{{ secret('DATABRICKS_HOST') }}"
    authentication:
      token: "{{ secret('DATABRICKS_TOKEN') }}"
    runName: "kestra-{{ flow.id }}-{{ execution.id }}"
    waitForCompletion: PT1H
    runTasks:
      - taskKey: load_invoices
        runJobTask:
          jobId: "{{ inputs.load_job_id }}"

  # Read-only quality check on the governed table
  - id: check_invoices
    type: io.kestra.plugin.databricks.sql.Query
    host: "{{ secret('DATABRICKS_HOST') }}"
    httpPath: "{{ secret('DATABRICKS_HTTP_PATH') }}"
    accessToken: "{{ secret('DATABRICKS_TOKEN') }}"
    sql: |
      SELECT invoice_id
      FROM finance.silver.invoices
      WHERE load_date = DATE'{{ render(vars.load_date) }}'
        AND (amount IS NULL OR currency IS NULL)
      LIMIT 100

  # Bad rows found: alert the owner and wait for a decision
  - id: gate_on_quality
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.check_invoices.size > 0 }}"
    then:
      - id: notify_owner
        type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
        url: "{{ secret('SLACK_WEBHOOK') }}"
        messageText: "{{ outputs.check_invoices.size }} invoices without amount or currency for {{ render(vars.load_date) }}. Resume or kill execution {{ execution.id }}."
      - id: owner_decision
        type: io.kestra.plugin.core.flow.Pause
        pauseDuration: PT4H
        behavior: FAIL
        onResume:
          - id: reason
            type: STRING
            description: Why publish despite the failed check

  - id: publish_gold
    type: io.kestra.plugin.databricks.job.SubmitRun
    host: "{{ secret('DATABRICKS_HOST') }}"
    authentication:
      token: "{{ secret('DATABRICKS_TOKEN') }}"
    runName: "kestra-{{ flow.id }}-{{ execution.id }}-publish"
    waitForCompletion: PT30M
    runTasks:
      - taskKey: publish_invoices
        runJobTask:
          jobId: "{{ inputs.publish_job_id }}"

errors:
  - id: alert_on_failure
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "Invoice pipeline failed for {{ render(vars.load_date) }}, execution {{ execution.id }}."

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 6 * * *"
```

Each layer governs its own part of this run.

Unity Catalog enforces data access. The token's service principal needs `WRITE VOLUME` on the landing volume, the job's run-as identity needs `MODIFY` on the silver and gold tables, and the SQL check only needs `SELECT`. If someone widens the flow to touch another schema, Unity Catalog rejects the query; Kestra does not bypass it. Because the load and publish steps trigger jobs defined in Databricks rather than one-off submitted code, the tables keep their lineage link to a named job. The load job in this example reads the landing folder incrementally, so it needs no file parameter.

Kestra governs the run. The execution records what triggered it, the exact flow revision used, the outcome and duration of every task, and the Databricks run ID and console link returned by each `SubmitRun`. The `runName` puts the Kestra execution ID on the Databricks side too, so you can go from a Databricks job run back to the execution that caused it. When the check fails, the `Pause` task stops the flow; the [pause and resume](/docs/how-to-guides/pause-resume) output records who resumed it and when, with the reason they typed. If nobody decides within four hours, the task fails and gold is not published.

Retries are deliberate. The download is a read and retries freely. The Databricks jobs do not retry, because a second attempt would launch a second load. `SubmitRun` already deduplicates the case where a Kestra worker is lost mid-task, adopting the in-flight Databricks run instead of starting a new one.

The [Databricks plugin](/plugins/plugin-databricks) includes other Unity Catalog tasks worth knowing. `unitycatalog.grant.Update` applies grants from a flow, which turns permission changes into reviewed, versioned code instead of ad hoc SQL. `unitycatalog.table.Trigger` starts a flow when a new table appears in a schema. In Kestra Enterprise Edition, [audit logs](/docs/enterprise/governance/audit-logs) record who changed or ran each flow, policies can block or require specific task types per namespace, and declared [assets](/docs/enterprise/governance/assets) extend lineage to the steps outside Databricks, such as the partner export in this flow.

## Operating rules for Unity Catalog across many pipelines

These rules come from the gap between what Unity Catalog governs and what actually breaks in production.

1. Give each pipeline domain its own service principal, scoped to the schemas it writes. One shared "etl" principal turns the audit log into a list of identical entries.
2. Grant privileges to groups, at the schema level, and avoid catalog-wide grants unless the whole catalog really is one audience.
3. Bind production catalogs to production workspaces. Grants decide who; workspace bindings decide where.
4. Prefer managed tables and volumes. Use external ones only when you can name the outside system that writes to the path.
5. Trigger jobs defined in the workspace for anything you need in lineage, and stamp each run with the orchestrator's execution ID so the two histories join.
6. Keep grants, job definitions and flows in Git, and put a human approval step in front of anything that publishes data to people outside the team.

Unity Catalog makes the data side of governance a solved problem for most Databricks teams. As pipelines start crossing into systems Databricks does not see, the open question moves to the runs: what started them, what they waited for, and who signed off. To try the pattern above, the [Databricks SQL blueprint](/blueprints/databricks-sql) is a quick starting point for running governed queries from Kestra.
