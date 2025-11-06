---
title: Conditions renamed
icon: /docs/icons/migration-guide.svg
release: 0.20.0
---

Migrating Flow trigger conditions

## Overview

All conditions [have been renamed](https://github.com/kestra-io/kestra/pull/6032) without the `Condition` at the end. Aliases are in place, so all flows will still work, but you will see an information note recommending you to upgrade to the new name. Already deprecated conditions haven't changed to avoid extra overhead on your end.

Examples of renamed conditions:

- `io.kestra.plugin.core.condition.ExecutionStatusCondition` → `io.kestra.plugin.core.condition.ExecutionStatus`
- `io.kestra.plugin.core.condition.ExecutionNamespaceCondition` → `io.kestra.plugin.core.condition.ExecutionNamespace`
- `io.kestra.plugin.core.condition.ExecutionLabelsCondition` → `io.kestra.plugin.core.condition.ExecutionLabels`
