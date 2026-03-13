---
title: Pebble Syntax in Kestra Expressions
description: Learn the core Pebble templating syntax used in Kestra expressions, including delimiters, attribute access, control structures, macros, and null handling.
sidebarTitle: Pebble Syntax
icon: /src/contents/docs/icons/expression.svg
---

Use this page when you need help writing expressions rather than looking up a specific filter or function.

## Pebble basics

Pebble templates use two primary delimiters:

- `{{ ... }}` to output the result of an expression
- `{% ... %}` to control template flow with tags such as `if`, `for`, or `set`

Examples:

```twig
{{ flow.id }}
{% if inputs.region == "eu" %}Europe{% endif %}
```

To escape Pebble syntax literally, use the `raw` tag described in [Operators, Tags, and Tests](../05.operators-tags-tests/index.md#raw).

## Accessing values

Use dot notation for standard property access:

```twig
{{ foo.bar }}
```

Use bracket notation for special characters or indexed access:

```twig
{{ foo['foo-bar'] }}
{{ items[0] }}
```

:::alert{type="warning"}
If a task ID, output key, or attribute contains a hyphen, use bracket notation. To avoid that, prefer `camelCase` or `snake_case`.
:::

## Common syntax patterns

### Comments

Use Pebble comments with `{# ... #}`:

```twig
{# This is a comment #}
{{ "Visible content" }}
```

In YAML, continue to use `#` for comments outside the expression itself.

### Literals and collections

Pebble supports:

- strings: `"Hello World"`
- booleans: `true`, `false`
- null: `null`
- lists: `["apple", "banana"]`
- maps: `{"apple":"red", "banana":"yellow"}`

### Named arguments

Filters, functions, and macros can accept named arguments:

```twig
{{ stringDate | date(existingFormat="yyyy-MMMM-d", format="yyyy/MMMM/d") }}
```

### Macros

Macros are reusable template snippets:

```twig
{% macro input(type="text", name, value="") %}
  type: "{{ type }}", name: "{{ name }}", value: "{{ value }}"
{% endmacro %}

{{ input(name="country") }}
```

## Rendering nested expressions

Kestra renders expressions once by default. If a variable contains Pebble that should be evaluated later, use `render()`:

```yaml
variables:
  trigger_or_yesterday: "{{ trigger.date ?? (execution.startDate | dateAdd(-1, 'DAYS')) }}"

tasks:
  - id: yesterday
    type: io.kestra.plugin.core.log.Log
    message: "{{ render(vars.trigger_or_yesterday) }}"
```

This pattern is especially useful with namespace variables or composed flow variables.

## Control flow and fallbacks

Common patterns:

- `if` and `elseif` for branching
- `for` for iteration
- `??` for fallback values
- `? :` for ternary expressions

Example:

```twig
{{ inputs.mydate ?? (execution.startDate | dateAdd(-1, 'DAYS')) }}
```

For full operator and tag details, see [Operators, Tags, and Tests](../05.operators-tags-tests/index.md).

## When to leave this page

- Need available runtime variables: [Execution Context Variables](../01.execution-context/index.md)
- Need filters such as `date`, `jq`, `default`, or `yaml`: [Filter Reference](../03.filter-reference/index.md)
- Need functions such as `render()`, `secret()`, or `printContext()`: [Function Reference](../04.function-reference/index.md)
- Need exhaustive syntax examples: [Full Reference](../99.full-reference/index.md)
