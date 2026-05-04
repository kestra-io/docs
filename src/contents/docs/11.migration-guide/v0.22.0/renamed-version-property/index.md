---
title: Plugin 'version' Property Renamed in Kestra 0.22.0
h1: Why the 'version' Property Was Renamed in Several Plugins
sidebarTitle: Plugin version Rename
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.22.0
editions: ["OSS", "EE"]
description: Renaming of the version property in several plugins to reserve the keyword for Kestra's internal plugin management.
---


## Version property renamed

Renamed version property in many plugins

With the introduction of plugin versioning, Kestra reserves the `version` keyword for internal use to specify the plugin version. As a result, the `version` property was renamed for a few plugins that already used it, including the following:

- `io.kestra.plugin.elasticsearch.Get` → renamed as `docVersion`
- `io.kestra.plugin.opensearch.Get` → renamed as `docVersion`
- `io.kestra.plugin.mqtt.RealtimeTrigger` → renamed as `mqttVersion`
- `io.kestra.plugin.mqtt.Trigger` → renamed as `mqttVersion`
- `io.kestra.plugin.serdes.parquet.IonToParquet` → renamed as `parquetVersion`

:::alert{type="warning"}
Custom plugins need an equivalent rename for any property named `version`, which is now reserved for plugin management. Any custom plugin that uses a `version` property will not compile until you rename it.
:::

## Ensure Kestra can access the `_plugins/` directory

Upgrading to Kestra 0.22.0 requires a change in the way plugins are stored and managed. The [plugin versioning system](../../../07.enterprise/05.instance/versioned-plugins/index.md) requires a global internal storage configuration, because plugins are now stored in a global internal storage location. This is true even if you are using a dedicated internal storage backend for each tenant.

Under the hood, plugins are now stored in the [Internal Storage](../../../08.architecture/data-components/index.md#internal-storage) under the path `_plugins/repository/`. Therefore, the service account or credentials you use in your [Runtime and Storage configuration](../../../configuration/02.runtime-and-storage/index.md) **must have permissions to access the `_plugins` directory in the global instance internal storage (e.g. your S3 bucket)**. If you are using a service account or an IAM role, ensure it has access to these resources. Alternatively you can temporarily disable this feature using the following configuration:

```yaml
kestra:
  plugins:
      management:
        enabled: false
```
