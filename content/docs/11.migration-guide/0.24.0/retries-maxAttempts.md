---
title: maxAttempt renamed maxAttempts
icon: /docs/icons/migration-guide.svg
release: 0.24.0
editions: ["OSS", "EE"]
---

## Overview

For [retries](../../05.workflow-components/12.retries.md), the `maxAttempt` property has been renamed with an alias to `maxAttempts` to promote proper English grammar. This is a non-breaking change, but we recommend to update all your flows to use the correctly named property as a long-term safeguard.

## Before

The following example defines a retry for the `retry_sample` task with a maximum of 5 attempts every 15 minutes:

```yaml
- id: retry_sample
  type: io.kestra.plugin.core.log.Log
  message: my output for task {{task.id}}
  timeout: PT10M
  retry:
    type: constant
    maxAttempt: 5 # This name will still work, but it is recommended to search and replace in your flows.
    interval: PT15M
```


## After

The following example defines a retry for the `retry_sample` task with a maximum of 5 attempts every 15 minutes:

```yaml
- id: retry_sample
  type: io.kestra.plugin.core.log.Log
  message: my output for task {{task.id}}
  timeout: PT10M
  retry:
    type: constant
    maxAttempts: 5 # The correct, long-term naming convention
    interval: PT15M
```
