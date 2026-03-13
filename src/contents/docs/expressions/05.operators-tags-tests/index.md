---
title: Kestra Expressions Operators, Tags, and Tests
description: Learn the operators, tags, and tests used in Kestra expressions for comparisons, control flow, loops, fallbacks, and template logic.
sidebarTitle: Operators, Tags, and Tests
icon: /src/contents/docs/icons/expression.svg
---

Use this page when you need the control-flow side of Pebble rather than data transformation helpers.

## Operators

### Comparisons

Supported comparison operators:

- `==`
- `!=`
- `<`
- `>`
- `<=`
- `>=`

### Logic and boolean checks

Use:

- `and`
- `or`
- `not`
- `is`
- `contains`

Examples:

```twig
{% if 2 is even and 3 is odd %}
  ...
{% endif %}

{% if ["apple", "pear", "banana"] contains "apple" %}
  ...
{% endif %}
```

### Math and concatenation

Use:

- `+`, `-`, `*`, `/`, `%`
- `~` for string concatenation

Example:

```twig
{{ "apple" ~ "pear" ~ "banana" }}
```

### Fallbacks and conditionals

Use:

- `??` for null-coalescing fallbacks
- `? :` for ternary expressions

Examples:

```twig
{{ foo ?? bar ?? "default" }}
{{ foo == null ? bar : baz }}
```

For undefined vs null behavior, see the [Handling null and undefined values](../../15.how-to-guides/null-values/index.md) guide.

## Tags

Pebble tags are enclosed in `{% %}` and control template flow.

### Most common tags

- `if`
- `for`
- `set`
- `raw`
- `filter`
- `macro`
- `block`

Examples:

```twig
{% set header = "Welcome Page" %}
{{ header }}
```

```twig
{% raw %}{{ user.name }}{% endraw %}
```

```twig
{% for user in users %}
  {{ user.name }}
{% else %}
  No users found.
{% endfor %}
```

## Tests

Tests are used with `is` and `is not`.

Common tests:

- `defined`
- `empty`
- `even`
- `odd`
- `iterable`
- `json`
- `map`
- `null`

Example:

```twig
{% if user.email is empty %}
  ...
{% endif %}
```

## When to use this page

- Need expression-writing basics: [Pebble Syntax](../02.pebble-syntax/index.md)
- Need data transformations: [Filter Reference](../03.filter-reference/index.md)
- Need runtime helpers: [Function Reference](../04.function-reference/index.md)
- Need every operator, tag, and test example in one place: [Full Reference](../99.full-reference/index.md#operators)
