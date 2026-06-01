---
title: "Kestra Now Supports dbt Core v2.0 and the Fusion Engine"
description: "Kestra's dbt plugin now supports dbt Core v2.0 and the new Rust-based Fusion engine. Existing workflows keep working. New ones can opt into Fusion for faster runs and lower compute costs."
date: 2026-06-01T17:00:00
category: Solutions
author:
  name: François Delbrayelle
  image: fdelbrayelle
  linkedin: https://www.linkedin.com/in/fdelbrayelle/
  twitter: "@fdelbrayelle"
  role: Lead Software Engineer
image: ./main.png
---

Kestra's [dbt plugin](/plugins/plugin-dbt) now supports dbt Core v2.0 and the Fusion engine. This update ships alongside [Fivetran and dbt Labs merger announcement](https://www.fivetran.com/press/fivetran-dbt-labs-complete-merger-to-create-the-data-infrastructure-for-trusted-ai-agents), which includes the open-sourcing of Fusion under Apache 2.0 as part of dbt Core v2.0 (currently in alpha).

Existing dbt Core workflows require no changes. The new `engine` property defaults to `CLASSIC`, so nothing breaks.

## Opt in with one property

The plugin update adds an `engine` property to the `DbtCLI` task. Set it to `FUSION` to run your dbt project with the new Rust-based engine. The plugin handles the rest: updated CLI flags, new artifact schema parsing, and compatibility with state-based selection.

```yaml
id: dbt_pipeline
namespace: company.data

tasks:
  - id: dbt
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone
        type: io.kestra.plugin.git.Clone
        url: https://github.com/your-org/dbt-project
        branch: main
      - id: build
        type: io.kestra.plugin.dbt.cli.DbtCLI
        containerImage: ghcr.io/kestra-io/dbt-snowflake:2.0.0
        engine: FUSION
        commands:
          - dbt deps
          - dbt build --select state:modified+
        profiles: |
          my_project:
            outputs:
              prod:
                type: snowflake
                account: "{{ secret('SNOWFLAKE_ACCOUNT') }}"
                user: "{{ secret('SNOWFLAKE_USER') }}"
                password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
                database: analytics
                schema: public
            target: prod

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 8 * * *"
```

The `--select state:modified+` flag tells Fusion to rebuild only models downstream of what actually changed. Some early customers have reported 30% or more reductions in warehouse compute costs in their alpha testing.

## What the Rust rewrite changes

The Fusion engine replaces dbt's Python and Jinja compilation layer with a Rust-based SQL compiler. On large projects with 10,000 or more models, parsing can be up to 30x faster. Fusion also enables real-time SQL validation without a warehouse round-trip, catching errors before you burn compute on an invalid query.

Previous dbt Core versions rebuilt every model in scope on every run. Fusion tracks which models have changed and skips the rest. Combined with Kestra's [event-driven triggers](../../docs/05.workflow-components/07.triggers/index.md), your pipeline runs when data arrives and rebuilds only the models that changed.

## Zero breaking changes

`engine: CLASSIC` remains the default. Workflows written for dbt Core 1.x continue to work without modification. To use Fusion, update your `containerImage` to a v2.0 image and add `engine: FUSION`.

The update also fixes a pre-existing bug where `--selector` was rendering `this.target` instead of `this.selector` in certain task configurations.

## dbt Core v2.0 is still in alpha

The Fusion engine in dbt Core v2.0 is currently alpha software. We'd recommend testing it on non-production pipelines before rolling it out broadly. The plugin supports both engine modes so you can run `CLASSIC` in production and pilot `FUSION` in a separate [namespace](../../docs/05.workflow-components/02.namespace/index.md) at the same time.

For a deeper look at what else shipped today, including dbt Wizard, dbt State, and the Agents Schema, see the [Fivetran and dbt merger overview](/resources/fivetran-dbt-merger-fusion-engine).

To set up dbt Core orchestration with Kestra from scratch, the [dbt Core with Kestra guide](../2026-03-09-dbt-core-with-kestra/index.md) covers scheduling, upstream dependencies, alerting, and Git-based project management using the current stable plugin.
