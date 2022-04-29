
# Schedule

```yaml
type: "io.kestra.core.models.triggers.types.Schedule"
```

> Kestra is able to trigger flows based on a Schedule (aka the time). If you need to wait for another system to be ready and cannot use any event mechanism, you can schedule 1 or more time for the current flow.

## Example

> A schedule with a backfill.

```yaml
triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "*/15 * * * *"
    backfill:
      start: 2020-06-25T14:00:00Z
```

> A schedule that runs only the first monday of every month at 11 AM.
>
```yaml
triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "0 11 * * 1"
    scheduleConditions:
      - id: monday
        type: io.kestra.core.models.conditions.types.DayInMonthCondition
        date: "{{ trigger.date }}"
        dayOfWeek: "MONDAY"
        dayInMonth: "FIRST"
```

::: warning
Schedules **cannot overlap**. This means that we **cannot have any concurrent schedules**. If the previous schedule is not ended when the next one must start, the scheduler will wait until the end of the previous. The same applies during backfills.
:::

::: tip
Most of the time, schedule execution will depend on the `trigger.date` (looking at files for today, sql query with where schedule date). This works well, but it prevents you to execute your flow manually (since these variables are only available during schedule).

You can use this expression in order to make your **manual execution work**: <code v-pre>{{ schedule.date ?? execution.startDate | date("yyyy-MM-dd") }}</code>. It will use the current date instead of the scheduled one on manual execution, and your flow will not fail.
:::


## Backfill
Kestra will optionally handle a backfill. The concept of a backfill is the replay of a missed schedule because we create the flow later.

Backfills will perform all the schedules between the defined date & the current date and will start after the normal schedule.


## Variables
When the flow is scheduled, some context variables are injected to allow some customization of the flow (such as filename, where in sql query).

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ trigger.date }}</code> | the date of current schedule
|  <code v-pre>{{ trigger.next }}</code> | the date of next schedule
|  <code v-pre>{{ trigger.previous }}</code> | the date of previous schedule


## Schedule Conditions
When the `cron` is not sufficient to determine the date you want to schedule your flow, you can use `scheduleConditions` in order to add some extra conditions, (for example, only the first day of the month, only the weekend, ...).
You **must** use the <code v-pre>{{ trigger.date }}</code> expression  on properties `date` the current schedule.
This condition will be evaluated and <code v-pre>{{ trigger.previous }}</code> and <code v-pre>{{ trigger.next }}</code> will reflect the date **with** the conditions applied.

The list of core conditions that can be used are:
 - [DateTimeBetweenCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.DateTimeBetweenCondition.html)
 - [DayWeekCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.DayWeekCondition.html)
 - [DayWeekInMonthCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.DayWeekInMonthCondition.html)
 - [NotCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.NotCondition.html)
 - [OrCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.OrCondition.html)
 - [WeekendCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.WeekendCondition.html)
 - [DayInMonthCondition](/plugins/core/conditions/io.kestra.core.models.conditions.types.DayInMonthCondition.html)


## Properties

### `id`
* **Type:** <Badge vertical="middle" text="String" />
* **Required:** ✔

> Unique for a flow. The scheduler will keep the last execution date for this schedule. This allows you to change the cron expression without restarting all the past executions (if backfill exists)


### `cron`
* **Type:** ==string==
* **Dynamic:** ❓
* **Required:** ❌
> the cron expression you need to
a standard [unix cron expression](https://en.wikipedia.org/wiki/Cron) without seconds.

### `backfill`
* **Type:** ==[ScheduleBackfill](#schedulebackfill)==
* **Dynamic:** ❓
* **Required:** ❌
> Backfill options in order to fill missing previous past dates
Kestra will optionally handle a backfill. The concept of a backfill is to replay the missing schedule because we create the flow later.

Backfill will do all schedules between the defined date & the current date and will start after the normal schedule.


### `scheduleConditions`
* **Type:** ==array==
* **SubType:** ==ScheduleCondition==
* **Dynamic:** ❓
* **Required:** ❌
> List of schedule Conditions in order to limit schedule date.

### `inputs`
* **Type:** ==object==
* **Dynamic:** ✔️
* **Required:** ❌
> The input to pass to the triggered flow

## Outputs
### `date`


* **Type:** ==string==



> The date of the current schedule


### `next`


* **Type:** ==string==



> The date of the next schedule


### `previous`


* **Type:** ==string==



> The date of the previous schedule






## Definitions

### `ScheduleBackfill`

#### `start`


* **Type:** ==string==



> The first start date
