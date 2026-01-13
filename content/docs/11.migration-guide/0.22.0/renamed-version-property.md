---
title: Version property renamed
icon: /docs/icons/migration-guide.svg
release: 0.22.0
editions: ["OSS", "EE"]
---

Renamed version property in many plugins

## Overview

With the introduction of plugin versioning, we reserve the `version` keyword for internal use, allowing to specify the Kestra plugin version. As a result, we’ve renamed the `version` property for a few plugins that already used it, incl. the following:

- `io.kestra.plugin.elasticsearch.Get` → renamed as `docVersion`
- `io.kestra.plugin.opensearch.Get` → renamed as `docVersion`
- `io.kestra.plugin.mqtt.RealtimeTrigger` → renamed as `mqttVersion`
- `io.kestra.plugin.mqtt.Trigger` → renamed as `mqttVersion`
- `io.kestra.plugin.serdes.parquet.IonToParquet` → renamed as `parquetVersion`

:::alert{type="warning"}
Note that your **custom plugins** will need an equivalent approach of renaming any plugin that uses the `version` property, as this is now a core property reserved for plugin management. If any of your custom plugins rely on a `version` property, they won't compile anymore unless you rename that property to a different name.
:::

## Make sure Kestra can access the `_plugins/` directory

Upgrading to Kestra 0.22.0 requires a change in the way plugins are stored and managed. The [plugin versioning system](../../07.enterprise/05.instance/versioned-plugins.md) requires a global internal storage configuration, because plugins are now stored in a global internal storage location. This is true even if you are using a dedicated internal storage backend for each tenant.

Under the hood, plugins are now stored in the [Internal Storage](../../08.architecture/data-components.md#internal-storage) under the path `_plugins/repository/`. Therefore, the service account or credentials you use in your [Internal Storage configuration](../../configuration/index.md#internal-storage) **must have permissions to access the `_plugins` directory in the global instance internal storage (e.g. your S3 bucket)**. If you are using a service account or an IAM role, make sure that it has access to this resources. Alternatively you can temporarily disable this feature using the following configuration:

```yaml
kestra:
  plugins:
      management:
        enabled: false
```
