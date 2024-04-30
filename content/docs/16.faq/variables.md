---
title: Variables FAQ
icon: /docs/icons/faq.svg
---

Common questions about variables.

## How to escape some block in a Pebble syntax to ensure that it won't be parsed?

To ensure that a block of code won't be parsed by Pebble, you can use the `{% raw %}` and `{% endraw %}` [Pebble tags](/docs/concepts/expression/tag#raw). For example, the following Pebble expression will return the string `{{ myvar }}` instead of the value of the `myvar` variable:

```yaml
{% raw %}{{ myvar }}{% endraw %}
```

---


## In which order are inputs and variables resolved?

[Inputs](/docs/workflow-components/inputs) are resolved first, even before the execution starts. In fact, if you try to create a flow with an invalid input value, the execution will not be created.

Therefore, you can use inputs within variables, but you can't use variables or Pebble expressions within inputs.

[Expressions](/docs/concepts/expression) are rendered recursively, meaning that if a variable contains another variable, the inner variable will be resolved first.

When it comes to triggers, they are handled similarly to inputs as they are known before the execution starts (they trigger the execution). This means that you can't use inputs (unless they have `defaults` attached) or variables within triggers, but you can use trigger variables within `variables`.

To make it clearer, let's look at some examples.

### Examples

This flow uses inputs, trigger and execution variables which are resolved before variables:

```yaml
id: upload_to_s3
namespace: dev

inputs:
  - id: bucket
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
id: conditional_branching
namespace: dev

inputs:
  - id: parameter
    type: STRING
    required: false

tasks:
  - id: if
    type: io.kestra.core.tasks.flows.If
    condition: "{{inputs.customInput ?? false }}"
    then:
      - id: if_not_null
        type: io.kestra.core.tasks.log.Log
        message: Received input {{inputs.parameter}}
    else:
      - id: if_null
        type: io.kestra.core.tasks.log.Log
        message: No input provided
```

Here is an example that uses a trigger variable within a trigger itself (_that's allowed!_):

```yaml
id: backfill_past_mondays
namespace: dev

tasks:
  - id: log_trigger_or_execution_date
    type: io.kestra.core.tasks.log.Log
    message: "{{ trigger.date ?? execution.startDate }}"

triggers:
  - id: first_monday_of_the_month
    type: io.kestra.core.models.triggers.types.Schedule
    timezone: Europe/Berlin
    backfill:
      start: 2023-11-11T00:00:00Z
    cron: "0 11 * * MON" # at 11 on every Monday
    conditions: # only first Monday of the month
      - type: io.kestra.core.models.conditions.types.DayWeekInMonthCondition
        date: "{{ trigger.date }}"
        dayOfWeek: "MONDAY"
        dayInMonth: "FIRST"
```

---

## Can I transform variables with Pebble expressions?

Yes. Kestra uses [Pebble Templates](https://pebbletemplates.io/) along with the execution context to render **dynamic properties**. This means that you can use Pebble expressions (such as filters, functions, and operators to transform [inputs](/docs/workflow-components/inputs) and [variables](/docs/workflow-components/variables).

The example below illustrates how to use variables and Pebble expressions to transform string values in dynamic task properties:

```yaml
id: variables_demo
namespace: dev

variables:
  DATE_FORMAT: "yyyy-MM-dd"

tasks:
  - id: seconds_of_day
    type: io.kestra.core.tasks.debugs.Return
    format: '{{60 * 60 * 24}}'

  - id: start_date
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ execution.startDate | date(vars.DATE_FORMAT) }}"

  - id: curr_date_unix
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ now() | date(vars.DATE_FORMAT) | timestamp() }}"

  - id: next_date
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ now() | dateAdd(1, 'DAYS') | date(vars.DATE_FORMAT) }}"

  - id: next_date_unix
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ now() | dateAdd(1, 'DAYS') | date(vars.DATE_FORMAT) | timestamp() }}"

  - id: pass_downstream
    type: io.kestra.plugin.scripts.shell.Commands
    runner: PROCESS
    commands:
      - echo {{outputs.next_date_unix.value}}
```

