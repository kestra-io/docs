---
title: Internal Package Structure Changes (Custom Plugins Only)
icon: /docs/icons/migration-guide.svg
release: 1.0.0
editions: ["OSS", "EE"]
---

## Overview

This change affects only users building custom plugins or using the Java library in tests.

- `io.kestra.core.runners.StandAloneRunner` → replaced by `io.kestra.core.runners.TestRunner`.
- `io.kestra.core.schedulers.AbstractScheduler` → replaced by `io.kestra.scheduler.AbstractScheduler`.

For plugin tests using Scheduler or Worker directly, add new Gradle modules:

```groovy
testImplementation group: "io.kestra", name: "scheduler"
testImplementation group: "io.kestra", name: "worker"
```

Tests using `@ExecuteFlow` remain unaffected.

No impact for UI/API users.
