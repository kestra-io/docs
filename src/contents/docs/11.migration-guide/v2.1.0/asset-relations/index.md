---
title: Asset Lineage Events Replaced by Asset Relations in Kestra 2.1
h1: Move from Asset Lineage Events to Asset Relations
sidebarTitle: Asset Relations
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE", "Cloud"]
description: In 2.1.0, Kestra stores asset lineage as asset relations. The upgrade migrates existing lineage, removes the lineage-events API, kestractl commands, and the PurgeAssets purgeAssetLineages property, and validates assets blocks when flows are saved.
---

Kestra 2.1.0 stores how [assets](../../../07.enterprise/02.governance/01.assets/index.md) connect as relations, in one store that replaces asset topologies and asset lineage events.

Relations hold lineage from task inputs and outputs, and the new **Part of** and **Related** links between assets. The dependencies graph, `AssetShipper`, and the relations API all read from this store. See [Relations](../../../07.enterprise/02.governance/01.assets/03.manage-assets/index.md#relations).

## What changed

- **Stored lineage**: the upgrade copies existing asset topologies and lineage events into the new `asset_relations` store, then drops the old tables, or the old indices on Elasticsearch. Asset usage records aren't affected.
- **REST API**: `GET /api/v1/{tenant}/assets/lineage-events/search` and `DELETE /api/v1/{tenant}/assets/lineage-events/by-query` are removed. Use the [relations endpoints](../../../07.enterprise/02.governance/01.assets/03.manage-assets/index.md#automate-with-the-api) instead.
- **kestractl**: the `assets lineage-events` commands and the `--destination-only` flag of `assets dependencies` don't work against a 2.1 server. See [kestractl assets commands](../../../kestra-cli/kestractl/index.md#assets-enterprise-edition).
- **`PurgeAssets`**: the `purgeAssetLineages` property and the `purgedAssetLineagesCount` output are removed. Purging an asset deletes its relations with it.
- **Flow validation**: Kestra checks literal values in a task's `assets` block when you save the flow. A flow with an invalid declaration, for example an asset `id` with a space, is rejected on save instead of failing the task at runtime. Values written as expressions are still checked when they render.

## Run the migration

The relation migration is part of the 2.1.0 database migrations. Follow the [upgrade sequence](../../v2.0.0/database-migrations/index.md#upgrade-sequence): in Enterprise Edition, run `kestra migrate plan` and `kestra migrate run` before you start Kestra 2.1.0.

The copy runs in one transaction on JDBC backends, so a failure leaves nothing behind. A stored topology or lineage event that Kestra can't read is skipped and logged at `ERROR` level with a message that starts with `Dropping unreadable`. The relations it held don't exist after the upgrade. Check the migration logs for this message, and rerun the flows that produced those assets to record their lineage again.

:::alert{type="warning"}
The migration drops the old lineage tables and indices. To keep a copy of the raw lineage events, back up your database or Elasticsearch indices before you run it.
:::

## Update flows and scripts

### PurgeAssets

Remove `purgeAssetLineages` from `PurgeAssets` tasks, and remove any expression that reads `purgedAssetLineagesCount`:

```yaml
- id: purge_assets
  type: io.kestra.plugin.kestra.ee.assets.PurgeAssets
  endDate: "{{ now() | dateAdd(-90, 'DAYS') }}"
  # Remove this line
  purgeAssetLineages: false
```

A filter by asset ID, type, or metadata no longer fails with `NotImplementedException`, because lineage events no longer need separate filtering.

### API clients

Scripts that searched or deleted lineage events must use the relations endpoints instead:

| Before 2.1.0 | 2.1.0 |
| --- | --- |
| `GET /assets/lineage-events/search` | `GET /assets/{id}/relations` and `GET /assets/{id}/dependencies` |
| `DELETE /assets/lineage-events/by-query` | `DELETE /assets/{id}/relations/{uid}`, or delete the asset |

### Asset declarations

Save each flow that declares assets after the upgrade, or validate it with the API. Fix any declaration Kestra rejects. The message names the task and the field and starts like ``Task 'build_table' declares an invalid asset in `assets.outputs` ``.

## Related

- [Asset declaration reference](../../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md)
- [Manage assets in the UI, API, and CLI](../../../07.enterprise/02.governance/01.assets/03.manage-assets/index.md)
- [Purge assets and lineage](../../../10.administrator-guide/purge/index.md#purge-assets-and-lineage-retention)
