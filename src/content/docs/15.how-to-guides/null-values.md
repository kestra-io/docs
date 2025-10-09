---
title: Handling null and undefined values
icon: /docs/icons/tutorial.svg
stage: Getting Started 
topics:
  - Best Practices
---

How to use the null coalescing operator to handle null and undefined values.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/j6H_54CpLuY?si=lU5hZV6jL9MHUQWf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

The null coalescing operator is a binary operator that returns its left-hand value if it's not null; otherwise, it returns its right-hand value. You can think of it as a way to provide a default value when the left-hand value is null.

```yaml
"{{ null ?? now() | date('yyyy-MM-dd') }}"
```

In this example, since the left-hand side of the `??` operator is `null`, the right-hand side will be returned. The `now()` function will be called, and the result will be formatted as a date string in the `yyyy-MM-dd` format.

## Processing date values

Imagine that you have a flow that processes data between two dates. You want to provide default values for the start and end dates if they're not provided as inputs. You can use the null coalescing operator to set default values for the start and end dates. In this example, the start date is set to one month ago, and the end date is set to today, effectively processing data for the last month by default.

```yaml
id: process_data_between_dates
namespace: company.team

inputs:
  - id: start_date
    type: DATE
    required: false
    description: Start date to fetch data from

  - id: end_date
    type: DATE
    required: false
    description: End date to fetch data from

variables:
  start_date: "{{ inputs.start_date ?? now() | dateAdd(-1, 'MONTHS') | date('yyyy-MM-dd') }}"
  end_date: "{{ inputs.end_date ?? now() | date('yyyy-MM-dd') }}"

tasks:
  - id: process_data_between_dates
    type: io.kestra.plugin.core.log.Log
    message: processing data from {{ render(vars.start_date) }} to {{ render(vars.end_date) }}
```

Note that you need to use the `render` function to recursively render variables containing Pebble expressions.

## Providing default values for optional and undefined inputs

The null-coalescing operator `??` will return the right-hand value if the left-hand value is null or undefined (e.g. an `input` or a `variable` that have not been defined). This behavior is useful when you want to provide default values for optional inputs and for dynamic properties that may not be defined.

If you want to return the right-hand side only if the left-hand side is undefined, you can use the `???` operator instead of `??`.

The example below shows how to use both `??` and `???` operators to set defaults for optional or undefined values.

```yaml
id: provide_default_values
namespace: company.team

inputs:
  - id: optional_input
    type: STRING
    required: false
    description: An optional input

tasks:
  - id: coalesce_optional_input
    type: io.kestra.plugin.core.log.Log
    message: |
      Expression: inputs.optional_input ?? 'mydefault'
      Left-hand value: null
      Right-hand value: 'mydefault'
      Operator used: '??'
      This expression "{{ inputs.optional_input ?? 'mydefault' }}" will return 'mydefault'
      because the coalesce-operator '??' returns the right-hand value 
      if the left-hand value is null or undefined.
      Only if you provide a value at runtime, that value will be used instead of 'mydefault'.

  - id: coalesce_undefined_input
    type: io.kestra.plugin.core.log.Log
    message: |
      Expression: inputs.undefined_input ?? 'mydefault'
      Left-hand value: undefined
      Right-hand value: 'mydefault'
      Operator used: '??'
      The expression "{{ inputs.undefined_input ?? 'mydefault' }}" will return 'mydefault'
      because the coalesce-operator '??' returns the right-hand value 
      if the left-hand value is null or undefined.

  - id: coalesce_only_undefined_input_1
    type: io.kestra.plugin.core.log.Log
    message: |
      Expression: inputs.undefined_input ??? 'mydefault'
      Left-hand value: undefined
      Right-hand value: 'mydefault'
      Operator used: '???'
      The expression "{{ inputs.undefined_input ??? 'mydefault' }}" will return 'mydefault'
      because he undefined-coalesce-operator '???' returns the right-hand value 
      if the left-hand value is undefined.

  - id: coalesce_only_undefined_input_2
    type: io.kestra.plugin.core.log.Log
    message: |
      Expression: inputs.optional_input ??? 'mydefault'
      Left-hand value: null
      Right-hand value: 'mydefault'
      Operator used: '???'
      The expression "{{ inputs.optional_input ??? 'mydefault' }}" will return "" i.e. no value aka null value
      because optional_input is defined and the undefined-coalesce-operator '???' only returns the right-hand value 
      if the left-hand value is undefined.

  - id: both_operators_combined
    type: io.kestra.plugin.core.log.Log
    message: |
      Expression: (inputs.optional_input ??? 'mydefault') ?? 'other_default'
      Left-hand value: null
      Right-hand value: 'other_default'
      Operator used: '??'
      The expression "{{ (inputs.optional_input ??? 'mydefault') ?? 'other_default' }}" will return 'other_default'
      because the first expression using the undefined-coalesce-operator '???' will return null, 
      and the coalesce-operator '??' will return the default value 'other_default'.
```

## Processing Trigger values

When using a Trigger, you can use the `{{ trigger }}` expression inside of your flow. However, this expression is undefined if you execute your flow manually.

Here's an example of a Webhook trigger that might receive a body of data. You can use the null coalescing operator to handle when the body of data is different to what's expected:
```yaml
id: webhook_example
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.body.dataField ?? 'data' }}"

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: abcdefg
```

You can also use this for Schedule triggers. Here's an example that uses the date when the Schedule trigger starts an execution but in combination with the null coalescing operator to use an input value if an execution is started manually. 

```yaml
id: scheduling
namespace: company.team

inputs:
  - id: country
    type: STRING
    defaults: US
  - id: date
    type: DATETIME
    required: false
    defaults: 2023-12-24T14:00:00.000Z

tasks:
  - id: check_if_business_date
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
    commands:
      - python schedule.py "{{ trigger.date ?? inputs.date }}" {{ inputs.country }}
    beforeCommands:
      - pip install workalendar
    taskRunner:
      type: io.kestra.plugin.core.runner.Process

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: business day - continuing the flow...

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: 0 14 25 12 *
```
