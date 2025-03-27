---
title: Version property renamed
icon: /docs/icons/migration-guide.svg
release: 0.22.0
editions: ["OSS", "EE"]
---

Renamed version property for a few plugins

## Overview

With the introduction of plugin versioning, we reserve the `version` keyword for internal use, allowing to specify the Kestra plugin version. As a result, we’ve renamed the `version` property for a few plugins that already used it, incl. the following:

- `io.kestra.plugin.elasticsearch.Get` → renamed as `docVersion`
- `io.kestra.plugin.opensearch.Get` → renamed as `docVersion`
- `io.kestra.plugin.mqtt.RealtimeTrigger` → renamed as `mqttVersion`
- `io.kestra.plugin.mqtt.Trigger` → renamed as `mqttVersion`
- `io.kestra.plugin.serdes.parquet.IonToParquet` → renamed as `parquetVersion`

::alert{type="warning"}
If you use the Enterprise Edition, your **custom plugins** will need an equivalent approach of renaming any plugin that uses the `version` property, as this is now a core property reserved for plugin management.
::
