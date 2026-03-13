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

### `toJson`

Convert an object into JSON:

```twig
{{ [1, 2, 3] | toJson }}
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

## Numbers and collections

### Common numeric filters

- `abs` for absolute values
- `number` for parsing strings into numeric types
- `numberFormat` for decimal formatting

Examples:

```twig
{{ -7 | abs }}
{{ "12.3" | number }}
{{ 3.141592653 | numberFormat("#.##") }}
```

### Common collection filters

- `first`, `last`, `length`
- `join`, `split`
- `merge`, `sort`, `rsort`, `reverse`
- `chunk`, `slice`, `distinct`
- `keys`, `values`

Examples:

```twig
{{ ['apple', 'banana'] | first }}
{{ ['apple', 'banana'] | join(', ') }}
{{ {'foo': 'bar', 'baz': 'qux'} | keys }}
```

## String filters

The most common string filters are:

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

Examples:

```twig
{{ user.phoneNumber | default("No phone number") }}
{{ "LOUD TEXT" | lower }}
{{ "Hello World!" | slugify }}
{{ "a.b.c" | substringBeforeLast(".") }}
```

## Temporal filters

Use temporal filters to format dates or convert them to timestamps.

### `date`

```twig
{{ execution.startDate | date("yyyy-MM-dd") }}
```

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

## YAML filters

### `yaml`

Parse YAML into an object:

```twig
{{ "foo: bar" | yaml }}
```

### `indent` and `nindent`

Useful when generating templated YAML or embedding structured content:

```twig
{{ labels | yaml | indent(4) }}
{{ variables.yaml_data | yaml | nindent(4) }}
```

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

For exhaustive per-filter examples, see [Full Reference](../99.full-reference/index.md#basic-filters).
