---
title: dbt Assets Use dbt-Specific Asset Types in Kestra 2.1
h1: Update Asset Triggers and Filters for dbt Asset Types
sidebarTitle: dbt Asset Types
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE", "Cloud"]
description: With Kestra 2.1, the dbt plugin emits models, seeds, and snapshots as DbtModel, DbtSeed, and DbtSnapshot assets instead of Table, and adds DbtTest and DbtExposure assets. Update triggers, exporter mappings, and declarations that match Table.
---

The dbt plugin for Kestra 2.1 emits each dbt node with its own asset type instead of the generic `io.kestra.plugin.ee.assets.Table`.

<!-- TODO(verify on merge): written from open PR plugin-dbt#362, held for a plugin release after core 2.1. Add the plugin version and check the type names once it merges. -->

## What changed

| dbt node | Asset type before | Asset type now |
|---|---|---|
| Model | `io.kestra.plugin.ee.assets.Table` | `io.kestra.plugin.dbt.assets.DbtModel` |
| Seed | `io.kestra.plugin.ee.assets.Table` | `io.kestra.plugin.dbt.assets.DbtSeed` |
| Snapshot | `io.kestra.plugin.ee.assets.Table` | `io.kestra.plugin.dbt.assets.DbtSnapshot` |
| Test that ran | Not emitted | `io.kestra.plugin.dbt.assets.DbtTest` |
| Exposure | Not emitted | `io.kestra.plugin.dbt.assets.DbtExposure` |

Asset IDs don't change, so lineage and asset history carry over. Existing dbt assets are retyped on the next run of the task that emits them.

dbt sources are now untyped inputs. A table that Fivetran, Airbyte, or another dbt project emitted keeps its type, and a source that no task emitted becomes an `External` asset.

## Who is affected

You need to act if any of these match on the `Table` type to find dbt assets:

- An [`EventTrigger`](../../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#eventtrigger) with `assetType: io.kestra.plugin.ee.assets.Table`.
- An `AssetShipper` mapping or an asset search filtered on the `Table` type.
- A task's `assets.inputs` that declares a dbt model with `type: io.kestra.plugin.ee.assets.Table`. A typed input sets the stored asset's type, so it retypes the model back to `Table` on every run.

Filters on the `dbtResourceType` metadata key keep working.

## Update your flows

Replace the `Table` type with the dbt type of the nodes you match. For example, a trigger that alerts on failing dbt tests:

```yaml
triggers:
  - id: dbt_tests_failed
    type: io.kestra.plugin.ee.assets.EventTrigger
    assetType: io.kestra.plugin.dbt.assets.DbtModel
    events:
      - CREATED
      - UPDATED
    metadataQuery:
      - field: dbtTestStatus
        type: EQUAL_TO
        value: fail
```

Matching on `DbtModel` keeps the trigger from also firing for each failing `DbtTest` asset, which carries its own `dbtTestStatus`.

In `assets.inputs`, remove the `type` from dbt model inputs, or set it to the dbt type. See [Track dbt lineage automatically](../../../15.how-to-guides/asset-lineage-dbt/index.md) for the full asset reference.
