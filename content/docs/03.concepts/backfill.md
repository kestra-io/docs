---
title: Backfill
icon: /docs/icons/concepts.svg
---

Backfills are replays of missed schedule intervals between a defined start and end date.

The example below will backfill hourly executions between `2024-02-24T14:00:00Z` and today.

```yaml
triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "* */1 * * *"
    backfill:
      start: 2024-02-24T14:00:00Z
```

