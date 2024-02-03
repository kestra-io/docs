---
title: Filter
icon: /docs/icons/expression.svg
---

Filters can be used in expressions to perform some transformations on variables such as formatting a date, converting a string to uppercase, or joining a list of strings.

Filters are separated from the variable name by a pipe symbol `|`. Multiple filters can be chained together so that the output of one filter is applied to the next one.

The following example turns the name into title case:
```twig
{{ name | title }}
```

Filters that accept arguments have parentheses around the arguments. This example joins the elements of a list into a string, with list elements separated by commas:
```twig
{{ list | join(', ') }}
```

To apply a filter on a section of code, wrap it with the `filter` tag:

```twig
{% filter lower | title %}
	hello<br>
{% endfilter %}
```

Each section below represents a built-in filter type.

::ChildCard
::
