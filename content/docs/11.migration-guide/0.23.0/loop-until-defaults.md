---
title: LoopUntil task changed default values for checkFrequency
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS", "EE"]
---


## Overview

The default behavior of the `LoopUntil` core task [has changed](https://github.com/kestra-io/kestra/issues/9152#issuecomment-2929847060) as follows:

```json
{ "maxIterations": null, "maxDuration": null, "interval": "PT1M" }
```

## Before

Previously, `LoopUntil` capped executions at 100 iterations and 1 hour duration (`maxIterations: 100`, `maxDuration: PT1H`, `interval: PT1S`). This was intended to prevent runaway loops from impacting instance stability, especially with frequent (1s) intervals.

## After

**What’s changed**:
- The default configuration no longer enforces arbitrary limits on iterations and duration.
- The new default uses a 1-minute interval (`PT1M`), which greatly reduces the risk of instance performance issues, even with no iteration or duration limits.

**Backwards compatibility**: If you want to retain the previous default limits to prevent potentially long-running loops, add the following to your global plugin defaults:

```yaml
pluginDefaults:
  - forced: true
    type: io.kestra.plugin.core.flow.LoopUntil
    values:
      checkFrequency:
        maxIterations: 100
        maxDuration: PT1H
        interval: PT1S
```

Adding that plugin default restores the earlier behavior and prevents any breaking change for your existing flows.
