---
title: Kestra Filter Reference – JSON, String, Date, and YAML Filters
description: Reference guide to the most important Kestra expression filters, grouped by data type and common use case.
sidebarTitle: Filter Reference
icon: /src/contents/docs/icons/expression.svg
---

Use filters when you need to transform a value with the pipe syntax: `{{ value | filterName(...) }}`.

## Common filter categories

- JSON and structured data
- numbers and collections
- strings
- dates and timestamps
- YAML formatting

## JSON and structured data

Use these filters when the value you already have is structured and you need to reshape it, serialize it, or extract one field from a larger payload. They are especially common when working with task outputs and API responses.

### `toJson`

Convert an object into JSON:

```twig
{{ [1, 2, 3] | toJson }}
{{ true | toJson }}
{{ "foo" | toJson }}
```

### `toIon`

Convert an object into Ion:

```twig
{{ myObject | toIon }}
```

### `jq`

Apply a JQ expression to a value. The result is always an array, so combine it with `first` when appropriate:

```twig
{{ outputs | jq('.task1.value') | first }}
```

Examples:

```twig
{{ [1, 2, 3] | jq('.') }}
{{ [1, 2, 3] | jq('.[0]') | first }}
```

Example flow using `jq` inside a `ForEach`:

```yaml
id: jq_with_foreach
namespace: company.team

tasks:
  - id: generate
    type: io.kestra.plugin.core.debug.Return
    format: |
      [
        {"name": "alpha", "value": 1},
        {"name": "bravo", "value": 2}
      ]

  - id: foreach
    type: io.kestra.plugin.core.flow.ForEach
    values: "{{ fromJson(outputs.generate.value) }}"
    tasks:
      - id: log_filtered
        type: io.kestra.plugin.core.log.Log
        message: |
          Name: {{ fromJson(taskrun.value).name }}
          Doubled value: {{ fromJson(taskrun.value) | jq('.value * 2') | first }}
```

The practical rule with `jq` is that it is great for extracting or transforming a small part of a larger payload, but it is usually overkill when plain dot access already gets you the value you need.

### Worked JSON payload example

This larger example is useful when you need to mix accessors, math, collection helpers, and JSON-aware filters in one expression flow:

```yaml
id: json_payload_example
namespace: company.team

inputs:
  - id: payload
    type: JSON
    defaults: |-
      {
        "name": "John Doe",
        "score": {
          "English": 72,
          "Maths": 88,
          "French": 95,
          "Spanish": 85,
          "Science": 91
        },
        "address": {
          "city": "Paris",
          "country": "France"
        },
        "graduation_years": [2020, 2021, 2022, 2023]
      }

tasks:
  - id: print_status
    type: io.kestra.plugin.core.log.Log
    message:
      - "Student name: {{ inputs.payload.name }}"
      - "Score in languages: {{ inputs.payload.score.English + inputs.payload.score.French + inputs.payload.score.Spanish }}"
      - "Total subjects: {{ inputs.payload.score | length }}"
      - "Total score: {{ inputs.payload.score | values | jq('reduce .[] as $num (0; .+$num)') | first }}"
      - "Complete address: {{ inputs.payload.address.city }}, {{ inputs.payload.address.country | upper }}"
      - "Started college in: {{ inputs.payload.graduation_years | first }}"
      - "Completed college in: {{ inputs.payload.graduation_years | last }}"
```

Use a pattern like this when the payload already arrives as JSON input and you want to keep the manipulation inside expressions instead of adding a preprocessing task.

## Numbers and collections

These filters are the everyday cleanup tools for expression values. Use them when you already have the right data, but need to reformat it, count it, sort it, or coerce it into the type another task expects.

### Common numeric filters

- `abs` for absolute values
- `number` for parsing strings into numeric types
- `numberFormat` for decimal formatting

Examples:

```twig
{{ -7 | abs }}
{{ "12.3" | number }}
{{ "9223372036854775807" | number('BIGDECIMAL') | className }}
{{ 3.141592653 | numberFormat("#.##") }}
```

The `number` filter supports `INT`, `FLOAT`, `LONG`, `DOUBLE`, `BIGDECIMAL`, and `BIGINTEGER`.

### Common collection filters

- `chunk`, `distinct`, `first`, `last`, `length`
- `join`, `split`
- `merge`, `sort`, `rsort`, `reverse`
- `slice`
- `keys`, `values`

Examples:

```twig
{{ [1, 2, 3, 4, 5] | chunk(2) }}
{{ ['apple', 'banana'] | first }}
{{ ['apple', 'banana'] | join(', ') }}
{{ {'foo': 'bar', 'baz': 'qux'} | keys }}
{{ {'foo': 'bar', 'baz': 'qux'} | values }}
{{ [3, 1, 2] | sort }}
{{ [3, 1, 2] | rsort }}
{{ ['apple', 'banana', 'cherry'] | slice(1, 2) }}
{{ 'apple,banana,cherry' | split(',') }}
```

## String filters

String filters are where most small presentation fixes happen. They are usually the right tool for display formatting, filename shaping, templated messages, and API-compatible encodings.

Common string filters include:

- `abbreviate`
- `default`
- `lower`, `upper`, `title`, `capitalize`
- `replace`
- `trim`
- `startsWith`
- `slugify`
- `substringAfter`, `substringBefore`, and their `Last` variants
- `base64encode`, `base64decode`
- `sha256`
- `urlencode`, `urldecode`
- `string`
- `escapeChar`

Examples:

```twig
{{ "this is a long sentence." | abbreviate(7) }}
{{ user.phoneNumber | default("No phone number") }}
{{ "LOUD TEXT" | lower }}
{{ "article title" | title }}
{{ "I like %this% and %that%." | replace({'%this%': foo, '%that%': "bar"}) }}
{{ "Hello World!" | slugify }}
{{ "a.b.c" | substringBeforeLast(".") }}
{{ "dGVzdA==" | base64decode }}
{{ "test" | sha256 }}
{{ "The string ü@foo-bar" | urlencode }}
```

## Temporal filters

These are the most common filters in scheduled flows and integrations. Reach for them whenever a downstream system expects a specific date format or timestamp precision rather than Kestra's native datetime value.

Use temporal filters to format dates or convert them to timestamps.

### `date`

```twig
{{ execution.startDate | date("yyyy-MM-dd") }}
```

You can also provide existing and target formats with named arguments:

```twig
{{ stringDate | date(existingFormat="yyyy-MMMM-d", format="yyyy/MMMM/d") }}
```

When you are formatting an already parsed datetime, only `format` is usually needed. Use `existingFormat` when the source is still a plain string.

### Time zones

Specify a target time zone when downstream systems require a local representation rather than UTC:

```twig
{{ now() | date("yyyy-MM-dd'T'HH:mm:ssX", timeZone="UTC") }}
```

Supported arguments include:

- `format`
- `existingFormat`
- `timeZone`
- `locale`

### `dateAdd`

```twig
{{ now() | dateAdd(-1, 'DAYS') }}
```

### Timestamp helpers

- `timestamp`
- `timestampMilli`
- `timestampMicro`
- `timestampNano`

These are useful for integrations that require Unix timestamps with specific precision.

Supported date formats include standard Java `DateTimeFormatter` patterns and shortcuts such as `iso`, `sql`, `iso_date_time`, and `iso_zoned_date_time`.

### Temporal worked example

```yaml
id: temporal_dates
namespace: company.team

tasks:
  - id: print_status
    type: io.kestra.plugin.core.log.Log
    message:
      - "Present timestamp: {{ now() }}"
      - "Formatted timestamp: {{ now() | date('yyyy-MM-dd') }}"
      - "Previous day: {{ now() | dateAdd(-1, 'DAYS') }}"
      - "Next day: {{ now() | dateAdd(1, 'DAYS') }}"
      - "Timezone (seconds): {{ now() | timestamp(timeZone='Asia/Kolkata') }}"
      - "Timezone (microseconds): {{ now() | timestampMicro(timeZone='Asia/Kolkata') }}"
      - "Timezone (milliseconds): {{ now() | timestampMilli(timeZone='Asia/Kolkata') }}"
      - "Timezone (nanoseconds): {{ now() | timestampNano(timeZone='Asia/Kolkata') }}"
```

This kind of example is a good sanity check when you are validating timestamp precision before sending values to an external API.

## YAML filters

Use YAML filters when you are generating configuration or manifest-style text inside a task. They are less common in simple flows, but very useful in templated Kubernetes, Docker, or config-management patterns.

### `yaml`

Parse YAML into an object:

```twig
{{ "foo: bar" | yaml }}
```

This is especially useful in templated tasks where the source data starts as text but later expressions need object-style access.

#### Example: using `yaml` in a templated task

```yaml
id: yaml_filter_example
namespace: company.team

tasks:
  - id: yaml_filter
    type: io.kestra.plugin.core.log.Log
    message: |
      {{ "foo: bar" | yaml }}
      {{ {"key": "value"} | yaml }}
```

### `indent` and `nindent`

Useful when generating templated YAML or embedding structured content:

```twig
{{ labels | yaml | indent(4) }}
{{ variables.yaml_data | yaml | nindent(4) }}
```

#### Example with `indent` and `nindent`

```yaml
id: templated_task_example
namespace: company.team

labels:
  example: test

variables:
  yaml_data: |
    key1: value1
    key2: value2

tasks:
  - id: yaml_with_indent
    type: io.kestra.plugin.core.templating.TemplatedTask
    spec: |
      id: example-task
      type: io.kestra.plugin.core.log.Log
      message: |
        Metadata:
        {{ labels | yaml | indent(4) }}

        Variables:
        {{ variables.yaml_data | yaml | nindent(4) }}
```

Use `indent` when the first line is already in place and only following lines need alignment. Use `nindent` when you need to start a fresh indented block on the next line.

## Choosing the right filter quickly

| If you need to... | Use |
| --- | --- |
| Parse or transform JSON payloads | `toJson`, `jq`, `first` |
| Provide a fallback string or value | `default` |
| Format a date | `date` |
| Offset a date | `dateAdd` |
| Split or join text | `split`, `join` |
| Normalize casing | `lower`, `upper`, `title`, `capitalize` |
| Render YAML in a templated task | `yaml`, `indent`, `nindent` |
