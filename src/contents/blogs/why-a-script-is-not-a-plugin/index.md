---
title: "Why a Script Is Not a Plugin"
metaTitle: "Why a Script Is Not a Plugin: Supported Orchestration Plugins vs Scripts"
description: "Any coding assistant writes an S3 upload script in seconds, and someone still has to keep it working. Kestra plugins are tested and supported for the full life of each LTS, so they hold up better than any script."
date: 2026-11-26T09:00:00
category: Engineering
author:
  name: François Delbrayelle
  linkedin: https://www.linkedin.com/in/fdelbrayelle/
  twitter: "@fdelbrayelle"
  image: fdelbrayelle
  role: Lead Software Engineer
---

"Your S3 plugin uploads a file. I can do that in ten lines of Python. Why would I use a plugin for that?"

Any coding assistant now writes a script that uploads a file to S3 or queries Snowflake, and the first run works.

A Kestra plugin doing the same upload has a maintainer, a test suite, a release process and a support window.

## Gaps in a Generated Script

The generated S3 upload leaves out:

- Authentication with IAM roles, static keys and assumed roles, beyond the one you tested.
- Retries with backoff, and knowing which errors are safe to retry.
- Multipart upload for large files, and cleanup when it fails halfway.
- Secrets handling that keeps keys out of the logs.
- A way to find out when the SDK it depends on ships a breaking change.

A generated script has no owner and no test that says what it was supposed to do.

## How Unowned Scripts Fail

- The script works on the author's laptop and fails on a worker with a different Python version or a missing system library.
- A dependency is pinned nowhere, so an upstream release changes behavior between two runs.
- An API the script calls renames a field, and the script keeps "succeeding" while writing nulls.
- The one person who knew why a flag was set leaves, and the flag becomes folklore.

When the script exits with code 0, the orchestrator reports a green run.

## A Plugin Is a Contract

A Kestra plugin is Java code in its own repository, with an owner, released like any other software. It declares what it accepts, so Kestra can validate a flow before loading it.

You never have to touch the Java. You write a task in YAML, as in the example below, or fill in a form in the no-code editor and Kestra generates the YAML. Using a plugin takes no programming language, so analysts and ops teams can build flows without waiting for a developer.

Every task property has a type, a default, a description and validation rules. Kestra generates a [JSON Schema](https://json-schema.org/) from the plugin, and the editor uses it to validate your flow before it runs. A typo in a property name gets a red underline while you type. A script takes whatever string you hand it, and the same typo becomes a failed execution.

The reference docs, examples and property tables on the [plugin pages](/plugins) are generated from annotations in the code, so they can't drift apart. The [plugin developer guide](/docs/plugin-developer-guide/document) shows how.

Each plugin ships with unit tests built on the Kestra test framework, and many run against real services in containers. The checks run on every pull request. Each plugin's main branch is built on a schedule every weekday, so a break caused by an upstream change shows up even when nobody touched the code.

Plugins are published as versioned artifacts, and the release and indexing process is itself a set of Kestra flows. We wrote about it in [How Kestra Ships 1300+ Plugins](/blogs/2026-04-27-how-kestra-ships-plugins). A weekly compatibility run builds the plugin library against the latest development branch of Kestra core, so we catch a breaking change in the engine before it reaches you.

The AWS plugin runs on the official AWS SDK for Java, and other plugins use the vendor's official Java SDK when one exists, so you get the vendor's own authentication, retry and API behavior. Dependabot bumps those dependencies, both for security fixes and to keep each plugin current with the service it talks to.

Every plugin repository runs a security scan on top of the Dependabot updates, so a CVE in a transitive dependency of a client library is ours to find and fix.

## Plugins Can Start Flows, Scripts Can't

A plugin can also ship **triggers**. A trigger watches an external system and starts an execution when something happens: a new file lands in an S3 bucket, a row appears in a Postgres table, a message arrives on Kafka or SQS. The flow runs only when there is something to process, and the trigger hands the event to the flow as data.

```yaml
triggers:
  - id: new_files
    type: io.kestra.plugin.aws.s3.Trigger
    bucket: company-imports
    prefix: incoming/
    interval: PT1M
    action: MOVE
    moveTo:
      bucket: company-imports
      key: processed/
```

This is hard to do well in a script, because a script only runs when something calls it. To react to a bucket you end up with one of two designs:

- A **cron job** that lists the bucket every minute. It has no memory, so you have to store what it already saw somewhere, handle two runs overlapping, and decide what happens to a file that arrives while the previous run is still going.
- A **long-running process** that loops forever. Now you own its restarts, its memory leaks, its health checks and the worker slot it holds, and a silent crash means events are missed until someone notices.

In both cases the logic that decides "is this event new?" lives inside the script, next to the business logic, and each team writes it a bit differently. A missed or duplicated event doesn't raise an error, it just means a file was never processed or was processed twice.

With a plugin trigger, the polling, the state and the deduplication belong to the plugin and the platform. The trigger's state is tracked by Kestra, so a restart picks up where it left off. Each event becomes a normal execution, with logs, outputs, retries and alerts like any other run, and the files it found are already in internal storage when your first task starts. Realtime triggers (Kafka, SQS and similar) go further and start an execution per message as it arrives, with no polling interval to tune.

The trigger is also covered by the same tests, schema validation and LTS support as the tasks in the plugin. A script that tries to do the same job gets none of that, and you find out it broke when the data stops showing up.

## Supported for the Life of the LTS

Kestra publishes [LTS releases](/docs/releases) that are supported for one year, with up to two active at the same time. Security and bug fixes are backported to every supported line, and patch releases ship weekly. Plugins follow the same promise: the plugins that belong to an LTS release are supported for as long as that LTS is. If you pin an LTS, you don't have to chase upstream changes in every integration you use.

Kestra and its core plugins are open source. Kestra Enterprise adds:

- Enterprise-only plugins for platform, network and security tooling, delivered from the Kestra registry under your license.
- [Versioned plugins](/docs/enterprise/instance/versioned-plugins), so you can run two versions of the same plugin side by side and promote the new one on your own schedule.
- [Allowed and restricted plugins](/docs/enterprise/governance/allowed-plugins), so a platform team decides which integrations are available to which teams.
- A support contract that covers the plugins as well as the engine underneath them.

## Platforms Built on Copied Scripts

Some automation platforms build everything around scripts. A workflow is a chain of scripts, and integrations come from a hub of shared ones: you pick a script from the catalog, copy it into your workspace and edit it.

A script copied into your workspace is your fork. If the upstream author fixes a bug or the API changes, your copy stays as it was, and nobody is on the hook to tell you. The same integration ends up in many versions across teams, none of them owned. The platform schedules them and reports their exit codes, and everything inside them is yours to maintain.

Kestra has one implementation per integration, maintained in one place and upgraded by changing a version number. Your flow references the task type:

```yaml
id: nightly_export
namespace: company.data

tasks:
  - id: query
    type: io.kestra.plugin.jdbc.postgresql.Query
    url: jdbc:postgresql://db:5432/app
    username: "{{ secret('PG_USER') }}"
    password: "{{ secret('PG_PASSWORD') }}"
    sql: SELECT * FROM orders WHERE created_at > current_date - 1
    fetchType: STORE

  - id: upload
    type: io.kestra.plugin.aws.s3.Upload
    from: "{{ outputs.query.uri }}"
    bucket: company-exports
    key: orders/{{ execution.startDate | date('yyyy-MM-dd') }}.ion
```

The flow holds no connection logic and no SDK to pin. When the AWS plugin ships a fix, every flow that uses it gets the fix on the next version bump, without anyone editing a file.

## Scripts and Plugins in the Same Flow

Kestra runs scripts in [Python, Node.js, R, Shell and more](/docs/scripts), with tasks such as the [Python script task](/plugins/plugin-script-python).

Use a script when:

- The logic is yours: a business rule, a transformation, a model call that exists nowhere else.
- No plugin covers the system, or the integration is so small it isn't worth a plugin.
- You are prototyping and want an answer before you want a design.

Use a plugin when:

- You are talking to a system someone else owns, such as a cloud service, a database, a SaaS API or a message broker.
- The call has to survive credential rotation, API changes, large payloads and partial failure.
- The flow will still be running after the person who wrote it has moved on.

In a flow, the script holds the part that is unique to your business, and plugins handle everything around it: fetching the input, authenticating, storing the output, alerting on failure.

## Agents and Plugins

For every generated script, someone has to know whether it is safe on production data and who reviewed it. A maintained plugin answers those questions once, for everyone.

Our plugin squad uses agents to build and review plugins, and we described how in [Context Engineering in Practice](/blogs/context-engineering-plugins-squad). Their output goes through the same pipeline as everything else: review, tests, compatibility checks, release.

If you use an assistant to write your flows, the best thing it can do is pick a plugin. That's why we publish the [MCP and docs tools](/blogs/2026-04-30-kestra-mcp-plugins-blueprints), so an agent writes `io.kestra.plugin.aws.s3.Upload` and skips the hand-written boto3 code.

## Before You Ship the Next Script

Ask three things:

1. Who owns this when it breaks?
2. How will I know when the thing it depends on changes?
3. Is there a version of this that someone already maintains and tests?

If the answer to the third question is yes, use the plugin. If it's no, write the script, put it in a flow, and let Kestra handle everything around it.

Browse the full catalog on the [plugins page](/plugins), or read the [plugin developer guide](/docs/plugin-developer-guide) if the integration you need is missing. For the Enterprise offer, including supported plugins across LTS releases, [talk to us](/demo).
