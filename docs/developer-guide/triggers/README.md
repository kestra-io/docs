---
order: 5
---
# Triggers & Schedule

Kestra is able to trigger flow, reacating to external events like Schedule.
This allows complex logic like waiting for a file, or a time to trigger flow.


::: tip
For now only schedule tasks are available !
:::


## Schedule 

Here is a simple example : 
```yaml
triggers:
  - id: schedule
    type: org.kestra.core.models.triggers.types.Schedule
    cron: "*/15 * * * *"
    backfill:
      start: 2020-06-25T14:00:00Z
```

with : 
- `id`: mandatory, and unique for a flow. The scheduler will keep the last execution date for this schedule. 
This allow you to change the cron expression without restart all the past execution (if backfill exists)
- `type`: mandatory, the type of trigger, for now only `org.kestra.core.models.triggers.types.Schedule` is suitable.
- `cron`: mandatory, a [cron expression](https://crontab.guru/) 
- `backfill.start`: optional backfill date

### Backfill 
Kestra will handle optionnaly a backfill. The concept of backfill is the replay the missing schedule because 
we create the flow later.

Backfill will do all schedules between define date & current date and will start after the normal schedule.


### Variables 
When the flow is schedule, some context variables are injected to allow some customization of the flow 
(like filename, where in sql query).

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ schedule.date }}</code> | the date of current schedule 
|  <code v-pre>{{ schedule.next }}</code> | the date of next schedule 
|  <code v-pre>{{ schedule.previous }}</code> | the date of previous schedule 


::: warning
Schedule cannot overlap, this mean that we can't have any concurrent schedule. If the previous schedule is not ended 
when the next one must start, the scheduler will wait the end of the previous one. Same is applied for backfill.
:::
