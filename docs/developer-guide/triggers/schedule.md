
# Schedule

```yaml
type: "io.kestra.core.models.triggers.types.Schedule"
```

> Kestra is able to trigger flow based on Schedule (aka the time). If you need to wait another system to be ready and can't use any event mechanism, you can schedule 1 or more time for the current flow.

## Example

```yaml
triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "*/15 * * * *"
    backfill:
      start: 2020-06-25T14:00:00Z
```


## Inputs

### `id`
* **Type:** <Badge vertical="middle" text="String" />
* **Required:** ✔

> unique for a flow. The scheduler will keep the last execution date for this schedule. This allow you to change the cron expression without restart all the past execution (if backfill exists)

### `cron`
* **Type:** <Badge vertical="middle" text="String" />
* **Required:** ✔

> a [cron expression](https://crontab.guru/) 

### `backfill`
* **Type:** <Badge vertical="middle" text="Backfill" />
* **Required:** ❌

> [Backfill](#backfill-2) in order to play the past


### `backfill.start`
* **Type:** <Badge vertical="middle" text="ZonedDateTime" />
* **Required:** ✔

> [Backfill](#backfill-2) date

## Backfill 
Kestra will handle optionnaly a backfill. The concept of backfill is the replay the missing schedule because we create the flow later.

Backfill will do all schedules between define date & current date and will start after the normal schedule.


## Variables 
When the flow is schedule, some context variables are injected to allow some customization of the flow 
(like filename, where in sql query).

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ schedule.date }}</code> | the date of current schedule 
|  <code v-pre>{{ schedule.next }}</code> | the date of next schedule 
|  <code v-pre>{{ schedule.previous }}</code> | the date of previous schedule 


::: tip
Most of the time, schedule execution will depend on `schedule.date` (looking at files for today, sql query with where schedule date). This works well, but it prevents you to execute your flow manually (since these variables are only available during schedule). 
You can use this expression in order to make your **manual execution working**: <code v-pre>{{ dateFormat (firstDefined schedule.date execution.startDate) "yyyy-MM-dd"}}</code>, it will use the current date instead of the schedule one on manual execution, and your flow will not fail.
:::


::: warning
Schedule **cannot overlap**, this mean that we **can't have any concurrent schedule**. If the previous schedule is not ended when the next one must start, the scheduler will wait the end of the previous one. Same is applied during backfill.
:::
