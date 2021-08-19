
# Schedule

```yaml
type: "io.kestra.core.models.triggers.types.Schedule"
```

> Kestra is able to trigger flow based on Schedule (aka the time). If you need to wait another system to be ready and can't use any event mechanism, you can schedule 1 or more time for the current flow.

## Example

> A schedule with a backfill

```yaml
triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "*/15 * * * *"
    backfill:
      start: 2020-06-25T14:00:00Z
```

> A schedule that run only the first monday on every month at 11 AM
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
Schedule **cannot overlap**, this mean that we **can't have any concurrent schedule**. If the previous schedule is not ended when the next one must start, the scheduler will wait the end of the previous one. Same is applied during backfill.
:::

::: tip
Most of the time, schedule execution will depend on `trigger.date` (looking at files for today, sql query with where schedule date). This works well, but it prevents you to execute your flow manually (since these variables are only available during schedule).
You can use this expression in order to make your **manual execution working**: <code v-pre>{{ dateFormat (firstDefined schedule.date execution.startDate) "yyyy-MM-dd"}}</code>, it will use the current date instead of the schedule one on manual execution, and your flow will not fail.
:::


## Backfill
Kestra will handle optionally a backfill. The concept of backfill is the replay the missing schedule because we create the flow later.

Backfill will do all schedules between define date & current date and will start after the normal schedule.


## Variables
When the flow is schedule, some context variables are injected to allow some customization of the flow
(like filename, where in sql query).

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ trigger.date }}</code> | the date of current schedule
|  <code v-pre>{{ trigger.next }}</code> | the date of next schedule
|  <code v-pre>{{ trigger.previous }}</code> | the date of previous schedule


## Schedule Conditions
When the `cron` is not suffisant to determine the date you want to schedule your flow, you can use `scheduleConditions` in order to add some extra conditions, (for example, only the first day of the month, only the weekend, ...).
You **must** use the <code v-pre>{{ trigger.date }}</code> expression  on properties `date` the current schedule.
This condition will be evaluated and <code v-pre>{{ trigger.previous }}</code> and <code v-pre>{{ trigger.next }}</code> will reflect the date **with** the conditions apply.

The list of core conditions that can be used  are :
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

> unique for a flow. The scheduler will keep the last execution date for this schedule. This allow you to change the cron expression without restart all the past execution (if backfill exists)


### `cron`
* **Type:** ==string==
* **Dynamic:** ❓
* **Required:** ❌
> the cron expression you need tyo
a standard [unix cron expression](https://en.wikipedia.org/wiki/Cron) without second.

### `backfill`
* **Type:** ==[ScheduleBackfill](#schedulebackfill)==
* **Dynamic:** ❓
* **Required:** ❌
> Backfill options in order to fill missing previous past date
Kestra will handle optionally a backfill. The concept of backfill is the replay the missing schedule because we create the flow later.

Backfill will do all schedules between define date & current date and will start after the normal schedule.


### `scheduleConditions`
* **Type:** ==array==
* **SubType:** ==ScheduleCondition==
* **Dynamic:** ❓
* **Required:** ❌
> List of schedule Conditions in order to limit schedule date.



## Outputs
### `date`


* **Type:** ==string==



> The date of current schedule


### `next`


* **Type:** ==string==



> The date of next schedule


### `previous`


* **Type:** ==string==



> The date of previous schedule






## Definitions

### `ScheduleBackfill`

#### `start`


* **Type:** ==string==



> The first start date
