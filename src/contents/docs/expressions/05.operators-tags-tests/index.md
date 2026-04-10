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

Use parentheses to group expressions and make precedence explicit:

```twig
{% if 2 is even and 3 is odd %}
  ...
{% endif %}

{% if (3 is not even) and (2 is odd or 3 is even) %}
  ...
{% endif %}
```

### `contains`

Checks whether an item exists within a list, string, map, or array:

```twig
{% if ["apple", "pear", "banana"] contains "apple" %}
  ...
{% endif %}
```

For maps, `contains` checks for a matching key:

```twig
{% if {"apple": "red", "banana": "yellow"} contains "banana" %}
  ...
{% endif %}
```

To check for multiple items at once, pass a list on the right-hand side:

```twig
{% if ["apple", "pear", "banana", "peach"] contains ["apple", "peach"] %}
  ...
{% endif %}
```

`contains` also works inline in output expressions:

```twig
{{ inputs.mainString contains inputs.subString }}
```

### Math and concatenation

Use:

- `+`, `-`, `*`, `/`, `%`
- `~` for string concatenation

Example:

```twig
{{ "apple" ~ "pear" ~ "banana" }}
{{ 2 + 2 / (10 % 3) * (8 - 1) }}
```

### Fallbacks and conditionals

Use:

- `??` for null-coalescing: returns the first non-null value
- `???` for undefined-coalescing: returns the right-hand side only when the left is undefined (not just null)
- `? :` for ternary expressions

Examples:

```twig
{{ foo ?? bar ?? "default" }}     {# first non-null value #}
{{ foo ??? "default" }}           {# only if foo is undefined #}
{{ foo == null ? bar : baz }}
{{ foo ?? bar ?? raise }}         {# raises an exception if all are undefined #}
```

For detailed null vs undefined behavior, see the [Handling null and undefined values](../../15.how-to-guides/null-values/index.md) guide.

### Operator precedence

Pebble operators are evaluated in this order:

1. `.`
2. `|`
3. `%`, `/`, `*`
4. `-`, `+`
5. `==`, `!=`, `>`, `<`, `>=`, `<=`
6. `is`, `is not`
7. `and`
8. `or`

## Tags

Pebble tags are enclosed in `{% %}` and control template flow.

### `set`

Defines a variable in the template context:

```twig
{% set header = "Welcome Page" %}
{{ header }}
{# output: Welcome Page #}
```

### `if`

Evaluates conditional logic. Use `elseif` and `else` for multiple branches:

```twig
{% if users is empty %}
  No users available.
{% elseif users.length == 1 %}
  One user found.
{% else %}
  Multiple users found.
{% endif %}
```

### `for`

Iterates over arrays, maps, or any `java.lang.Iterable`.

**Iterating over a list:**

```twig
{% for user in users %}
  {{ user.name }} lives in {{ user.city }}.
{% else %}
  No users found.
{% endfor %}
```

The `else` block runs when the collection is empty.

**Iterating over a map:**

```twig
{% for entry in map %}
  {{ entry.key }}: {{ entry.value }}
{% endfor %}
```

**Loop special variables:**

Inside any `for` loop, Pebble provides a `loop` object with these properties:

| Variable | Description |
| --- | --- |
| `loop.index` | Zero-based index of the current iteration |
| `loop.length` | Total number of items in the iterable |
| `loop.first` | `true` on the first iteration |
| `loop.last` | `true` on the last iteration |
| `loop.revindex` | Number of iterations remaining |

Example:

```twig
{% for user in users %}
  {{ loop.index }}: {{ user.name }}{% if loop.last %} (last){% endif %}
{% endfor %}
```

### `filter`

Applies a filter to a block of content. Filters can be chained:

```twig
{% filter upper %}
  hello
{% endfilter %}
{# output: HELLO #}

{% filter lower | title %}
  hello world
{% endfilter %}
{# output: Hello World #}
```

### `raw`

Prevents Pebble from parsing its content — useful when you need to output literal `{{ }}` syntax:

```twig
{% raw %}{{ user.name }}{% endraw %}
{# output: {{ user.name }} #}
```

### `macro`

Defines a reusable template snippet. Macros only have access to their own arguments by default:

```twig
{% macro input(type="text", name, value="") %}
  type: "{{ type }}", name: "{{ name }}", value: "{{ value }}"
{% endmacro %}

{{ input(name="country") }}
{# output: type: "text", name: "country", value: "" #}
```

To access variables from the outer template context, pass `_context` explicitly:

```twig
{% set foo = "bar" %}

{% macro display(_context) %}
  {{ _context.foo }}
{% endmacro %}

{{ display(_context) }}
{# output: bar #}
```

### `block`

Defines a named, reusable template block. Use the `block()` function to render the block elsewhere:

```twig
{% block "header" %}
  Introduction
{% endblock %}

{{ block("header") }}
```

## Tests

Tests are used with `is` and `is not` to perform type and value checks.

### `defined`

Checks whether a variable exists in the context (regardless of its value):

```twig
{% if missing is not defined %}
  Variable is not defined.
{% endif %}
```

### `empty`

Returns `true` when a variable is null, an empty string, an empty collection, or an empty map:

```twig
{% if user.email is empty %}
  No email on record.
{% endif %}
```

### `null`

Checks whether a variable is null:

```twig
{% if user.email is null %}
  ...
{% endif %}

{% if name is not null %}
  ...
{% endif %}
```

### `even` and `odd`

Check whether an integer is even or odd:

```twig
{% if 2 is even %}
  ...
{% endif %}

{% if 3 is odd %}
  ...
{% endif %}
```

### `iterable`

Returns `true` when a variable implements `java.lang.Iterable`. Use this to guard a `for` loop when the collection may not always be present:

```twig
{% if users is iterable %}
  {% for user in users %}
    {{ user.name }}
  {% endfor %}
{% endif %}
```

### `json`

Returns `true` when a variable is a valid JSON string:

```twig
{% if '{"test": 1}' is json %}
  ...
{% endif %}
```

### `map`

Returns `true` when a variable is a map:

```twig
{% if {"apple": "red", "banana": "yellow"} is map %}
  ...
{% endif %}
```

## When to use this page

- Need expression-writing basics: [Pebble Syntax](../02.pebble-syntax/index.md)
- Need data transformations: [Filter Reference](../03.filter-reference/index.md)
- Need runtime helpers: [Function Reference](../04.function-reference/index.md)
