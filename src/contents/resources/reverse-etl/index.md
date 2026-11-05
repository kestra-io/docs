---
title: "What Is Reverse ETL? Definition, Use Cases, and Safe Syncs"
description: "Reverse ETL syncs modeled warehouse data into CRMs, marketing automation, support desks, and ad platforms. Learn how it differs from ETL, ELT, CDPs, and iPaaS, which controls stop bad data before it reaches a production CRM, and how to orchestrate a gated sync with dbt, quality checks, retries, and alerts."
metaTitle: "Reverse ETL: Definition, Use Cases & Safe Syncs | Kestra"
metaDescription: "Reverse ETL syncs warehouse data into CRMs and SaaS tools. Learn how it differs from ETL and CDPs, and how to block bad data before it reaches your CRM."
tag: data
date: 2026-05-01
lastUpdated: 2026-10-26
faq:
  - question: "What is reverse ETL in simple terms?"
    answer: "Reverse ETL copies data that has already been cleaned and modeled in your data warehouse into the business tools people work in, such as Salesforce, HubSpot, Zendesk, or Google Ads. For example, a dbt model computes an account health score from product usage and billing data, and an hourly reverse ETL sync writes that score onto each company record in the CRM, where sales and customer success can act on it."
  - question: "What is the difference between ETL and reverse ETL?"
    answer: "They move data in opposite directions. ETL and ELT extract data from applications and databases and load it into a warehouse for analysis. Reverse ETL reads modeled results from the warehouse and writes them back into operational applications. ETL feeds dashboards; reverse ETL feeds the CRM field, the email audience, or the ad platform list that a team acts on. Most stacks run both, with dbt models in between."
  - question: "Is reverse ETL the same as a CDP?"
    answer: "No. A customer data platform collects events, resolves identities, and stores customer profiles in its own database before sending audiences to tools. Reverse ETL keeps the warehouse as the source of truth and only handles the sync: your SQL or dbt models define the profile, and reverse ETL pushes the result out. Teams often use a CDP for real-time event collection and reverse ETL for anything computed from warehouse data, such as lead scores or lifetime value."
  - question: "How do you prevent bad data from syncing to a CRM with reverse ETL?"
    answer: "Put quality gates between the model build and the sync, and make a failed check stop the write. Typical gates check for null or malformed identifiers, duplicate keys, abnormal row counts, and a cap on how many CRM records one run may change. Add upserts keyed on a stable identifier and an audit table of what each run wrote. If a run suddenly wants to rewrite half the CRM, it should stop and wait for approval, not log a warning."
  - question: "Do you need a dedicated reverse ETL tool?"
    answer: "Not always. Dedicated tools such as Hightouch provide managed connectors, a mapping UI for non-engineers, and built-in change tracking, which suits teams syncing to many standard SaaS destinations. An orchestrated sync, built with plugins and API calls in a workflow orchestrator, suits internal or niche destinations and teams that want mappings in Git and quality gates in the same run as the dbt build. Many teams combine both: the orchestrator triggers the tool after checks pass."
  - question: "How often should reverse ETL syncs run?"
    answer: "Match the cadence to the decision the data drives and to the freshness of the model, not to what the tool allows. Lead routing and trial activity often justify hourly or faster syncs; account health scores and ad audiences are usually fine daily. Running a sync more often than its upstream model refreshes only resends unchanged data and spends API quota. Trigger the sync after the model build finishes rather than on an independent schedule."
---

> **TL;DR** — Reverse ETL copies modeled data from your warehouse into the tools teams work in: CRM, marketing automation, support desks, ad platforms. Moving the data is the easy part. Each sync writes into a system of record, so it needs quality gates that block bad data before the write, idempotent upserts, rate-limit handling, retries, and an audit trail of what was written where.

Reverse ETL is the process of reading modeled data from a data warehouse or lakehouse and writing it into operational applications, such as a CRM, a marketing automation platform, a support desk, or an ad platform, so the people using those tools act on the same numbers the analytics team trusts. The name describes the direction: [ETL and ELT](/resources/data/etl-vs-elt) move data from applications into the warehouse, and reverse ETL moves the results back out.

A typical example: product usage lands in BigQuery or Snowflake, a dbt model turns it into an account health score, and a reverse ETL sync writes that score onto each company record in HubSpot or Salesforce every hour. Sales sees it in the CRM view they already use. Marketing builds a segment on it. Nobody exports a CSV.

Most write-ups stop at that definition. This one goes further, because the part that hurts in production is not moving the data. It is making sure a broken model, a duplicated join, or a half-finished backfill never overwrites thousands of CRM records that sales and marketing rely on.

## What a reverse ETL sync does, step by step

Every reverse ETL sync, whether it runs in a dedicated tool or in your own workflow, performs the same five steps.

1. Select the rows. A SQL query or dbt model defines what to send: one row per contact, account, or audience member, with the identifier the destination uses to match records.
2. Diff against the last sync. The sync compares the current result with what it sent last time and keeps only new or changed rows. Skip this step and every run rewrites every record, burns API quota, and fires CRM automation on unchanged data.
3. Map fields. Warehouse columns are mapped to destination fields, for example `health_score` to a custom HubSpot property or `account_id` to a Salesforce external ID field, and values are cast to the types the destination accepts.
4. Write through the API. Changed rows are sent in batches, using an upsert or update keyed on a stable identifier.
5. Record the outcome. The sync stores what it sent, what succeeded, and what was rejected, so the next diff is correct and failures can be retried.

Dedicated tools hide steps 2, 3, and 5 behind a UI. When you build the sync yourself, those are exactly the steps you have to get right.

## Reverse ETL vs ETL, ELT, CDPs, and iPaaS

Reverse ETL is the outbound leg of a warehouse-centric stack. ETL and ELT bring data in, a CDP collects and resolves customer data in its own store, and iPaaS connects applications to each other directly. The table shows where each one sits.

| Dimension | ETL / ELT | Reverse ETL | CDP | iPaaS |
|---|---|---|---|---|
| Direction | Sources to warehouse | Warehouse to operational tools | Event sources to its own profile store, then to tools | Application to application |
| Source of truth | The warehouse (as destination) | The warehouse (as source) | The CDP's profile store | Each application |
| Typical trigger | Schedule or change data capture | Schedule, or completion of a model build | Real-time events | Application events and webhooks |
| Where transformation lives | Pipeline code or warehouse SQL and dbt | Warehouse models, light mapping at sync time | The CDP's audience and identity builder | Integration recipes |
| Identity resolution | Not its job | Done upstream, in SQL | Built in | Field mapping per integration |
| Typical latency | Batch or near real time | Minutes to hours | Seconds to minutes | Seconds |
| Primary owner | Data engineering | Analytics engineering with RevOps or marketing ops | Marketing and growth | IT and business systems |
| Blast radius of a bad run | Warehouse tables, which can be rebuilt | Records in systems of record that people act on | Profiles and audiences | Individual application records |

The practical difference with a CDP is ownership of the customer profile. A CDP owns it; reverse ETL leaves it in the warehouse, where your joins, models, and tests already live. Many teams run both: the CDP for real-time event collection, reverse ETL for anything computed from warehouse data, such as scores, lifetime value, or product usage rollups. For a longer treatment, see our post on [reverse ETL versus CDPs](/blogs/2023-09-04-reverse-etl-vs-cdp).

iPaaS tools move records between applications (form tool to CRM, CRM to billing) and do not read from a warehouse model. When the value you want to send is computed across several sources, usage plus billing plus support tickets, reverse ETL is the right shape. [Change data capture](/resources/data/change-data-capture) sits at the opposite edge: it streams row-level changes out of operational databases, usually into the warehouse, upstream of any reverse ETL sync.

## Where reverse ETL data lands: destinations and use cases

Reverse ETL pays off when a number computed in the warehouse changes what someone does in another tool. These are the common destinations.

| Destination | Example tools | What gets synced | Who acts on it |
|---|---|---|---|
| CRM | Salesforce, HubSpot | Account health, product usage, lead scores, product-qualified lead flags, routing fields | Sales and account management |
| Marketing automation | HubSpot, Marketo, Braze, Customer.io | Audience membership, lifecycle attributes, trial activity | Marketing and growth |
| Support | Zendesk, Intercom | Plan, revenue band, open incidents, recent usage | Support and customer success |
| Ad platforms | Google Ads, Meta, LinkedIn | Customer match audiences, offline conversions, value signals | Paid acquisition |
| Internal apps and databases | Postgres, admin tools, entitlement services | Entitlements, risk flags, pricing tiers | Product and operations |

Two patterns cover most of these. Field enrichment writes attributes onto existing records, such as a health score on an account. Audience sync maintains list membership, adding and removing people as they enter or leave a segment. Audience syncs need removals handled explicitly: a sync that only adds members slowly turns "trial users this week" into "everyone who ever started a trial".

## Why reverse ETL breaks in production

Reverse ETL fails differently from inbound pipelines because the destination is a system of record that people act on. A bad warehouse table can be rebuilt from its sources. A bad CRM write gets noticed when a rep calls the wrong account, a nurture email goes to paying customers, or an ad audience ships with churned users. CRMs also run their own automation, so a field change can fire workflows, reassign owners, or enroll contacts in sequences. One wrong value fans out into actions you cannot recall.

The failure modes repeat from team to team:

- A join fans out and duplicates rows, so the same contact is written twice with conflicting values.
- An upstream source loads late or empty, the model returns nulls, and the sync blanks a field on every record.
- An identifier changes format (case, whitespace, a migrated email domain), and the upsert creates new records instead of updating existing ones.
- An API call times out after the destination accepted the write, and a blind retry creates duplicates.
- A backfill or schema change makes every row look changed, the sync exhausts the API quota halfway through, and half the records are updated.

None of these show up as a failed warehouse job. The model builds, the sync reports success, and the damage surfaces days later in the CRM.

## Seven controls that keep bad data out of your CRM

Safe reverse ETL comes down to controls placed before, during, and after the write. None of them are exotic, and most first versions of a sync skip all of them.

### 1. A data contract on the sync model

Treat the model that feeds a sync as a public interface. Define its grain (one row per contact), its key, the columns and types the destination expects, and the allowed values for enumerated fields. In dbt, [model contracts](https://docs.getdbt.com/docs/collaborate/govern/model-contracts) enforce column names and types at build time, and [data tests](https://docs.getdbt.com/docs/build/data-tests) check uniqueness, non-null keys, and accepted values. Put the contract on the final sync model, not on staging layers, because that model is the surface the CRM depends on.

### 2. Quality gates that stop the sync, not just warn

A quality check is only a gate if a failure prevents the write. Run checks after the model builds and before any API call, and fail the run when one breaks. Useful gates for a CRM sync:

- zero null or malformed identifiers (email, external ID)
- zero duplicate keys
- row count within an expected range of the last successful run
- a cap on the share of destination records a single run may change
- freshness of the upstream sources the model reads

The blast-radius cap is the cheapest of the set and the one most often missing. If a run suddenly wants to rewrite most of the CRM, a bug is a far likelier explanation than a real-world change, so block it and require someone to approve the large sync explicitly. Our guide to [data quality checks in pipelines](/resources/data/data-quality) covers the wider pattern.

### 3. Idempotent upserts and identity matching

Every write should be an [upsert](/resources/data/upsert) keyed on an identifier the destination already knows: email or a unique custom property for HubSpot contacts, an external ID field for Salesforce objects, a domain or company ID for accounts. An upsert makes the write idempotent: sending the same batch twice leaves the destination in the same state as sending it once, which is what makes retries safe. Our page on [idempotency](/resources/infrastructure/idempotency) explains the general principle.

Normalize keys in the model (lowercased, trimmed emails) so matching is deterministic, and decide upfront what happens when a key has no match: create, skip, or quarantine. Letting a sync create records freely is the most common way reverse ETL fills a CRM with duplicates.

### 4. Rate limits and API quotas

Destinations meter API usage, typically with short-window burst limits plus a daily cap, and the numbers vary by vendor and plan; HubSpot, for example, [documents its limits per subscription tier](https://developers.hubspot.com/docs/api/usage-details). A sync has to batch writes (HubSpot's batch endpoints accept up to 100 records per call), cap its own concurrency, and back off on HTTP 429 responses. Your sync also shares the quota with every other integration on the same account, so a backfill that consumes the daily budget can break the form handler or enrichment tool that writes to the same CRM.

### 5. Partial failures and retries

A batch call can accept most of its records and reject a few. Treat batches, not whole runs, as the unit of success: track which batches succeeded, retry failed ones with exponential backoff, and advance the "last synced" state only for rows that were actually written.

Retry only idempotent writes. A retried upsert is harmless; a retried create or list append can double-write. Rejections caused by the data itself, such as an invalid picklist value or a field the destination refuses, will not succeed on retry, so route them to a quarantine table and alert instead of looping.

### 6. Backfills without flooding the destination

Backfills are when reverse ETL does the most damage: a new field, a remapped column, or a fixed bug makes every row look changed at once. Run them as a deliberate, separate operation, with an explicit flag that lifts the blast-radius cap, lower concurrency, batches spread over time to stay inside quotas, and a dry run that writes payloads to storage for review before anything is sent. If the destination triggers automation on field changes, agree on timing with the team that owns those workflows before the backfill, not after.

### 7. An audit trail and alerting

For any record in the destination, you should be able to answer what was written, when, and by which run. Store the run or execution ID, the keys sent, a payload hash, and the outcome in a warehouse table. That table doubles as the diff state for the next run. Send failure alerts where the owners of the destination will see them, a RevOps channel rather than only a data-team inbox, and alert on silence too: a sync that has not succeeded within its expected window is broken even if nothing errored.

## Build vs buy: dedicated reverse ETL tools vs orchestrated syncs

Both approaches run the same five steps. The difference is who owns the controls above and how the sync fits with the rest of your pipeline. Dedicated reverse ETL tools such as Hightouch, Census (now part of Fivetran), and the reverse ETL feature of Twilio Segment ship managed connectors, a mapping UI, and built-in diffing. Orchestrated syncs run the same logic as tasks in your orchestrator, using plugins or HTTP calls, in the same workflow as the dbt build that produces the data.

| Dimension | Dedicated reverse ETL tool | Orchestrated sync (plugins, API calls, scripts) |
|---|---|---|
| Time to first sync | Fast for supported destinations | Slower: you write mapping and batching |
| Destination coverage | Large catalog of maintained connectors | Any API, database, or file target; you maintain each integration |
| Change tracking and diffing | Built in | You build it (state table, payload hashes) |
| Field mapping | UI that RevOps can edit | SQL and YAML in Git, reviewed like code |
| Quality gates before the write | Depends on the tool; often separate from the dbt run | Same workflow as the model build; a failed check stops the sync |
| Ordering with upstream jobs | Needs a trigger from your orchestrator or a schedule | Native: the sync runs after the model it depends on |
| Internal or niche destinations | Webhooks or custom connectors | Any HTTP API, database, or script |
| Retries and rate limiting | Managed per connector | Configured per task (retry policies, concurrency limits) |
| Audit trail | The tool's run history | Execution history plus your own warehouse audit table |
| Cost model | Separate vendor subscription | Engineering time on infrastructure you already run |

Choose a dedicated tool when:

- non-engineers need to create and change syncs themselves
- you sync to many standard SaaS destinations and do not want to maintain connectors
- built-in per-record error views matter more to you than code review

Choose an orchestrated sync when:

- the destination is internal, niche, or not covered by a maintained connector
- the sync must be gated by the same checks, in the same run, as the model it reads
- you want mappings, thresholds, and rules versioned in Git and deployed like the rest of your pipeline
- data has to stay on infrastructure you operate, including private networks

The two are not exclusive. A common split: the tool handles the long tail of SaaS destinations, and the orchestrator decides when it runs, triggering its syncs only after the model is rebuilt and the quality gates pass.

## Orchestrating reverse ETL end to end with Kestra

Kestra runs the whole sync as one declarative flow: build the model with dbt, check it, stop if the checks fail, then write to the destination with retries, concurrency limits, and alerts. The example below upserts product-usage attributes onto HubSpot contacts. It assumes a dbt project stored as [namespace files](/docs/concepts/namespace-files), with a model `crm_contacts_to_sync` that returns only contacts whose payload changed since the last sync (emails already lowercased, plus a `payload_hash` column), and a state table `crm_contacts_synced` recording what was last sent.

```yaml
id: reverse-etl-hubspot-contacts
namespace: company.revops

description: Rebuild the contact sync model, block the sync if it fails quality gates, then upsert changed contacts into HubSpot.

# Never let two runs write the same records at the same time.
concurrency:
  limit: 1

inputs:
  - id: allow_large_sync
    type: BOOL
    defaults: false # set to true only for a reviewed backfill

tasks:
  - id: dbt_build
    type: io.kestra.plugin.dbt.cli.DbtCLI
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: ghcr.io/kestra-io/dbt-bigquery:latest
    namespaceFiles:
      enabled: true
    inputFiles:
      sa.json: "{{ secret('GCP_CREDS') }}"
    profiles: |
      revops:
        target: prod
        outputs:
          prod:
            type: bigquery
            method: service-account
            keyfile: sa.json
            project: acme-analytics
            dataset: revops
            location: EU
            threads: 4
    commands:
      # build = run + test: a failing dbt test on the model stops the flow here
      - dbt build --select +crm_contacts_to_sync

  - id: quality_gate
    type: io.kestra.plugin.gcp.bigquery.Query
    projectId: acme-analytics
    serviceAccount: "{{ secret('GCP_CREDS') }}"
    fetchType: FETCH_ONE
    sql: |
      SELECT
        COUNT(*) AS changed_rows,
        COUNTIF(email IS NULL OR NOT REGEXP_CONTAINS(email, r'^[^@\s]+@[^@\s]+\.[^@\s]+$')) AS bad_emails,
        COUNT(*) - COUNT(DISTINCT email) AS duplicate_emails,
        (SELECT COUNT(*) FROM revops.crm_contacts_synced) AS synced_total
      FROM revops.crm_contacts_to_sync

  - id: block_bad_sync
    type: io.kestra.plugin.core.execution.Assert
    errorMessage: Contact sync blocked before any write to HubSpot
    conditions:
      - "{{ outputs.quality_gate.row.bad_emails == 0 }}"
      - "{{ outputs.quality_gate.row.duplicate_emails == 0 }}"
      # blast-radius cap: one run may change at most 20% of already-synced contacts
      - "{{ inputs.allow_large_sync or outputs.quality_gate.row.changed_rows <= outputs.quality_gate.row.synced_total * 0.2 }}"

  - id: build_batches
    type: io.kestra.plugin.gcp.bigquery.Query
    projectId: acme-analytics
    serviceAccount: "{{ secret('GCP_CREDS') }}"
    fetchType: FETCH
    sql: |
      -- one row per HubSpot batch upsert call, 100 contacts each
      SELECT TO_JSON_STRING(STRUCT(ARRAY_AGG(STRUCT(
        email AS id,
        'email' AS idProperty,
        STRUCT(
          product_tier,
          CAST(health_score AS STRING) AS health_score,
          CAST(last_active_date AS STRING) AS last_active_date
        ) AS properties
      )) AS inputs)) AS payload
      FROM (
        SELECT *, DIV(ROW_NUMBER() OVER (ORDER BY email) - 1, 100) AS batch_id
        FROM revops.crm_contacts_to_sync
      )
      GROUP BY batch_id

  - id: upsert_batches
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ outputs.build_batches.rows }}"
    concurrencyLimit: 1 # sequential batches keep the sync inside HubSpot's burst limits
    tasks:
      - id: hubspot_upsert
        type: io.kestra.plugin.core.http.Request
        uri: https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert
        method: POST
        contentType: application/json
        headers:
          Authorization: "Bearer {{ secret('HUBSPOT_PRIVATE_APP_TOKEN') }}"
        body: "{{ fromJson(item.value).payload }}"
        # safe to retry: an upsert keyed on email writes the same values again
        retry:
          type: exponential
          maxAttempts: 4
          interval: PT10S
          maxInterval: PT2M

  - id: record_sync
    type: io.kestra.plugin.gcp.bigquery.Query
    projectId: acme-analytics
    serviceAccount: "{{ secret('GCP_CREDS') }}"
    sql: |
      -- runs only after every batch succeeded: advances the diff state and the audit trail
      MERGE revops.crm_contacts_synced AS t
      USING revops.crm_contacts_to_sync AS s
      ON t.email = s.email
      WHEN MATCHED THEN UPDATE SET
        payload_hash = s.payload_hash,
        synced_at = CURRENT_TIMESTAMP(),
        execution_id = '{{ execution.id }}'
      WHEN NOT MATCHED THEN INSERT (email, payload_hash, synced_at, execution_id)
        VALUES (s.email, s.payload_hash, CURRENT_TIMESTAMP(), '{{ execution.id }}')

triggers:
  - id: hourly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "15 * * * *"

errors:
  - id: alert_revops
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "HubSpot contact sync failed in {{ flow.namespace }}.{{ flow.id }} (execution {{ execution.id }}). Sync state was not advanced; rerun once the cause is fixed."
```

Each task maps to one of the controls above:

- `dbt_build` runs the model and its dbt tests. A failing test fails the task, and nothing downstream runs.
- `quality_gate` and `block_bad_sync` enforce the pre-sync contract: valid identifiers, no duplicate keys, and a cap of 20 percent of already-synced contacts per run. A backfill has to set `allow_large_sync: true`, so lifting the cap is a visible decision recorded in the execution's inputs.
- `build_batches` groups changed rows into payloads of 100 records for HubSpot's batch upsert endpoint.
- `upsert_batches` sends one batch at a time. In Kestra 2.0, each `Loop` iteration runs as an isolated sub-execution, so a failed batch is visible on its own and a retry reruns only that batch.
- The `retry` policy is safe here because the write is an upsert keyed on email. Do not copy it onto a create endpoint.
- `record_sync` runs only after every batch succeeded. It advances the state table and stamps each row with the execution ID, which gives you the audit trail and the next run's diff in one place.
- `concurrency.limit: 1` queues overlapping runs, so two executions never write the same contacts in a different order.
- The `errors` handler posts to Slack. Because every write is an idempotent upsert and the state table only moves on success, fixing the cause and rerunning resends whatever was not confirmed, without duplicates.

For low-volume, record-level work where you already hold the HubSpot record ID, the HubSpot plugin's `io.kestra.plugin.hubspot.contacts.Update` and `io.kestra.plugin.hubspot.companies.Update` tasks are simpler than a batch call. For warehouse-scale syncs, the batch upsert shown above uses far fewer API calls. See the docs on [retries](/docs/workflow-components/retries) and [error handling](/docs/workflow-components/errors) for the other policies you can attach to the same tasks.

### Orchestrating a reverse ETL tool instead

If Hightouch already manages your syncs, keep `dbt_build`, `quality_gate`, and `block_bad_sync`, and replace the batch loop and state merge with a single task. The [Hightouch plugin](/plugins/plugin-hightouch) triggers a sync and waits for it to finish by default, so a failed sync fails the execution and reaches the same `errors` handler.

```yaml
  - id: hightouch_sync
    type: io.kestra.plugin.hightouch.Sync
    token: "{{ secret('HIGHTOUCH_API_TOKEN') }}"
    syncId: 1127166
    maxDuration: PT30M # the default wait is 5 minutes; raise it for large syncs
```

The value is the ordering guarantee: the tool only runs after the model it reads has been rebuilt and checked. The same structure works with any reverse ETL tool that exposes an API, through `io.kestra.plugin.core.http.Request`.

Start with one destination and one model, put the gate in front of it, and add destinations once the audit table shows the sync behaves. The upstream half of this flow, scheduling and testing the models themselves, is covered in our guide to [dbt orchestration](/resources/data/dbt-orchestration).
