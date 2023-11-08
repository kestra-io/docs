---
title: Variables FAQ
---

## In which order are inputs and variables resolved?

Normally, variables are rendered recursively, meaning that if a variable contains another variable, the inner variable will be resolved first.

Generally speaking, inputs are resolved before first, even before the execution technically start. In fact, if you try to create a flow with an invalid input value, the execution will not be created.

Therefore, you can use inputs within variables, but you can't use variables within inputs.

When it comes to triggers, they are handled similarly to inputs as they are known before the execution starts (they trigger the execution). This means that you can't use inputs (unless they have `defaults` attached) or variables within triggers, but you can use trigger variables within `variables`.

To make it clearer, let's look at some examples.

This flow uses inputs, trigger and execution variables which are resolved before variables:

```yaml
id: upload_to_s3
namespace: blueprint

inputs:
  - name: bucket
    type: STRING
    defaults: declarative-data-orchestration

tasks:
  - id: get_zip_file
    type: io.kestra.plugin.fs.http.Download
    uri: https://wri-dataportal-prod.s3.amazonaws.com/manual/global_power_plant_database_v_1_3.zip

  - id: unzip
    type: io.kestra.plugin.compress.ArchiveDecompress
    algorithm: ZIP
    from: "{{outputs.get_zip_file.uri}}"

  - id: csv_upload
    type: io.kestra.plugin.aws.s3.Upload
    from: "{{ outputs.unzip.files['global_power_plant_database.csv'] }}"
    bucket: "{{ inputs.bucket }}"
    key: "powerplant/{{ trigger.date ?? execution.startDate | date('yyyy_MM_dd__HH_mm_ss') }}.csv"

triggers:
  - id: hourly
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "@hourly"
```

This flow will start a task conditionally based on whether the input is provided or not:

```yaml
id: conditionalBranching
namespace: blueprint

inputs:
  - name: parameter
    type: STRING
    required: false

tasks:
  - id: if
    type: io.kestra.core.tasks.flows.If
    condition: "{{inputs.customInput ?? false }}"
    then:
      - id: if-not-null
        type: io.kestra.core.tasks.log.Log
        message: Received input {{inputs.parameter}}
    else:
      - id: if-null
        type: io.kestra.core.tasks.log.Log
        message: No input provided
```

Here is an example that uses a trigger variable within a trigger itself (that's allowed!):

```yaml
id: backfill_past_mondays
namespace: blueprint

tasks:
  - id: log_trigger_or_execution_date
    type: io.kestra.core.tasks.log.Log
    message: "{{ trigger.date ?? execution.startDate }}"

triggers:
  - id: firstMondayOfTheMonth
    type: io.kestra.core.models.triggers.types.Schedule
    timezone: Europe/Berlin
    backfill:
      start: 2023-04-01T00:00:00Z
    cron: "0 11 * * MON" # at 11 on every Monday
    scheduleConditions: # only first Monday of the month
      - type: io.kestra.core.models.conditions.types.DayWeekInMonthCondition
        date: "{{ trigger.date }}"
        dayOfWeek: "MONDAY"
        dayInMonth: "FIRST"
```


