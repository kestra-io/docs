---
title: Backfill
icon: /docs/icons/components.svg
---

Backfills are replays of missed schedule intervals between a defined start and end date.

Let's take the following flow as an example:

```yaml
id: scheduled_flow
namespace: dev

tasks:
  - id: external_system_export
    type: io.kestra.plugin.scripts.shell.Commands
    runner: PROCESS
    commands:
      - echo "processing data for {{ execution.startDate ?? trigger.date }}"
      - sleep $((RANDOM % 5 + 1))

triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "*/30 * * * *"
```

This flow will run every 30 minutes. However, imagine that your source system had an outage for 5 hours. The flow will miss 10 executions. To replay these missed executions, you can use the backfill feature.

To backfill the missed executions, go to the `Triggers` tab on the Flow's detail page and click on the `Backfill executions` button.

![backfill1](/docs/workflow-components/backfill1.png)

You can then select the start and end date for the backfill. Additionally, you can set custom labels for the backfill executions to help you identify them in the future.

::div
<iframe width="700" height="400" src="https://www.youtube.com/embed/iVTrBdYGbew?si=3GFA0TOZPhOIKc-Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
::

You can pause and resume the backfill process at any time, and by clicking on the `Details` button, you can see more details about that backfill process:

![backfill2](/docs/workflow-components/backfill2.png)
