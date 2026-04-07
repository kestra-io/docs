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

These filters are the everyday cleanup tools for expression values. Use them when you already have the right data but need to reformat it, count it, sort it, or coerce it into the type another task expects.

### `abs`

Returns the absolute value of a number:

```twig
{{ -7 | abs }}
{# output: 7 #}
```

### `number`

Parses a string into a numeric type. Supports `INT`, `FLOAT`, `LONG`, `DOUBLE`, `BIGDECIMAL`, and `BIGINTEGER`. When no type is specified, the type is inferred:

```twig
{{ "12.3" | number | className }}
{# output: java.lang.Float #}
{{ "9223372036854775807" | number('BIGDECIMAL') | className }}
{# output: java.math.BigDecimal #}
```

Use `BIGDECIMAL` or `BIGINTEGER` when values exceed standard long or double precision.

### `className`

Returns the Java class name of an object. Useful for debugging type inference when combined with `number`:

```twig
{{ "12.3" | number | className }}
{# output: java.lang.Float #}
```

### `numberFormat`

Formats a number using a Java `DecimalFormat` pattern:

```twig
{{ 3.141592653 | numberFormat("#.##") }}
{# output: 3.14 #}
```

### `first` and `last`

Returns the first or last element of a collection, or the first or last character of a string:

```twig
{{ ['apple', 'banana', 'cherry'] | first }}
{# output: apple #}
{{ ['apple', 'banana', 'cherry'] | last }}
{# output: cherry #}
{{ 'Kestra' | first }}
{# output: K #}
{{ 'Kestra' | last }}
{# output: a #}
```

### `length`

Returns the number of elements in a collection, or the number of characters in a string:

```twig
{{ ['apple', 'banana'] | length }}
{# output: 2 #}
{{ 'Kestra' | length }}
{# output: 6 #}
```

### `join`

Concatenates a collection into a single string with an optional delimiter:

```twig
{{ ['apple', 'banana', 'cherry'] | join(', ') }}
{# output: apple, banana, cherry #}
```

### `split`

Splits a string into a list using a delimiter. The delimiter is a regex, so escape special characters:

```twig
{{ 'apple,banana,cherry' | split(',') }}
{# output: ['apple', 'banana', 'cherry'] #}
{{ 'a.b.c' | split('\\.') }}
```

The optional `limit` argument controls how many splits are performed:

- **Positive**: limits the array size; the last entry contains the remaining content
- **Zero**: no limit; trailing empty strings are discarded
- **Negative**: no limit; trailing empty strings are included

```twig
{{ 'apple,banana,cherry,grape' | split(',', 2) }}
{# output: ['apple', 'banana,cherry,grape'] #}
```

### `sort` and `rsort`

Sort a collection in ascending or descending order:

```twig
{{ [3, 1, 2] | sort }}
{# output: [1, 2, 3] #}
{{ [3, 1, 2] | rsort }}
{# output: [3, 2, 1] #}
```

### `reverse`

Reverses the order of a collection:

```twig
{{ [1, 2, 3] | reverse }}
{# output: [3, 2, 1] #}
```

### `chunk`

Splits a collection into groups of a specified size:

```twig
{{ [1, 2, 3, 4, 5] | chunk(2) }}
{# output: [[1, 2], [3, 4], [5]] #}
```

### `distinct`

Returns only unique values from a collection:

```twig
{{ [1, 2, 2, 3, 1] | distinct }}
{# output: [1, 2, 3] #}
```

### `slice`

Extracts a portion of a collection or string using `fromIndex` (inclusive) and `toIndex` (exclusive):

```twig
{{ ['apple', 'banana', 'cherry'] | slice(1, 2) }}
{# output: [banana] #}
{{ 'Kestra' | slice(1, 3) }}
{# output: es #}
```

### `merge`

Merges two collections into one:

```twig
{{ [1, 2] | merge([3, 4]) }}
{# output: [1, 2, 3, 4] #}
```

### `keys` and `values`

Return the keys or values of a map:

```twig
{{ {'foo': 'bar', 'baz': 'qux'} | keys }}
{# output: [foo, baz] #}
{{ {'foo': 'bar', 'baz': 'qux'} | values }}
{# output: [bar, qux] #}
```

## String filters

String filters are where most small presentation fixes happen. They are usually the right tool for display formatting, filename shaping, templated messages, and API-compatible encodings.

### Case and whitespace

`lower`, `upper`, `title`, and `capitalize` normalize casing. `trim` removes leading and trailing whitespace.

```twig
{{ "LOUD TEXT" | lower }}           {# loud text #}
{{ "quiet text" | upper }}          {# QUIET TEXT #}
{{ "article title" | title }}       {# Article Title #}
{{ "hello world" | capitalize }}    {# Hello world #}
{{ "  padded  " | trim }}           {# padded #}
```

### `abbreviate`

Truncates a string to a maximum length and appends an ellipsis. The length argument includes the ellipsis:

```twig
{{ "this is a long sentence." | abbreviate(7) }}    {# this... #}
```

Useful when you need to keep log messages or notification subjects within a character limit.

### `replace`

Substitutes one or more substrings using a map. Pass `regexp=true` to use regex patterns in the keys:

```twig
{{ "I like %this% and %that%." | replace({'%this%': foo, '%that%': "bar"}) }}
```

### `substringBefore`, `substringAfter`, and their `Last` variants

Extract the portion of a string before or after a delimiter. The `Last` variants match the final occurrence:

```twig
{{ "a.b.c" | substringBefore(".") }}       {# a #}
{{ "a.b.c" | substringAfter(".") }}        {# b.c #}
{{ "a.b.c" | substringBeforeLast(".") }}   {# a.b #}
{{ "a.b.c" | substringAfterLast(".") }}    {# c #}
```

These are particularly useful for extracting file extensions, path segments, or identifier prefixes from task output values.

### `slugify`

Converts a string into a URL-safe slug:

```twig
{{ "Hello World!" | slugify }}    {# hello-world #}
```

### `default`

Returns a fallback value when the expression is null or empty:

```twig
{{ user.phoneNumber | default("No phone number") }}
```

### `startsWith`

Returns `true` if the string begins with the given prefix:

```twig
{{ "kestra://file.csv" | startsWith("kestra://") }}    {# true #}
```

### Encoding and hashing

`base64encode` and `base64decode` handle Base64 encoding. `urlencode` and `urldecode` percent-encode strings for use in URLs. `sha256` produces a hex-encoded SHA-256 hash.

```twig
{{ "test" | base64encode }}
{# output: dGVzdA== #}
{{ "dGVzdA==" | base64decode }}
{# output: test #}
{{ "The string ü@foo-bar" | urlencode }}
{# output: The+string+%C3%BC%40foo-bar #}
{{ "The+string+%C3%BC%40foo-bar" | urldecode }}
{# output: The string ü@foo-bar #}
{{ "test" | sha256 }}
{# output: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08 #}
```

### `string`

Coerces any value to its string representation:

```twig
{{ 42 | string }}
```

Use this when chaining filters that expect string input on a value that may arrive as a number or boolean.

### `escapeChar`

Escapes special characters in a string. The `type` argument controls which style of escaping is applied: `single`, `double`, or `shell`:

```twig
{{ "Can't be here" | escapeChar('single') }}
{# output: Can\'t be here #}
```

### Worked string filter example

This flow builds a sanitized filename and a display-safe summary from a raw input title:

```yaml
id: string_filter_example
namespace: company.team

inputs:
  - id: title
    type: STRING
    defaults: "  Quarterly Report: Q1 2025 (FINAL)  "

tasks:
  - id: format_output
    type: io.kestra.plugin.core.log.Log
    message:
      - "Trimmed: {{ inputs.title | trim }}"
      - "Normalized: {{ inputs.title | trim | lower }}"
      - "Slug (for filename): {{ inputs.title | trim | slugify }}"
      - "Abbreviated (for subject line): {{ inputs.title | trim | abbreviate(30) }}"
      - "Prefix check: {{ inputs.title | trim | startsWith('Quarterly') }}"
      - "After colon: {{ inputs.title | trim | substringAfter(':') | trim }}"
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

Adds or subtracts time from a date. Arguments:

- `amount`: integer specifying how much to add or subtract
- `unit`: time unit such as `DAYS`, `HOURS`, `MONTHS`, or `YEARS`

```twig
{{ now() | dateAdd(-1, 'DAYS') }}
```

### Timestamp helpers

Convert a date to a Unix timestamp at a specific precision:

- `timestamp` — seconds
- `timestampMilli` — milliseconds
- `timestampMicro` — microseconds
- `timestampNano` — nanoseconds

:::alert{type="warning"}
`timestampMicro` previously returned a nanosecond-precision value due to a bug. If you are migrating an older flow, verify the precision your downstream system expects.
:::

All timestamp filters accept the same arguments as the `date` filter: `existingFormat` and `timeZone`.

```twig
{{ now() | timestamp(timeZone="Europe/Paris") }}
{{ now() | timestampMilli(timeZone="Asia/Kolkata") }}
```

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
