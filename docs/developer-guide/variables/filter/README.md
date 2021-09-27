---
order: 2
---
# Filter

Variables can be modified by filters. Filters are separated from the variable by a pipe symbol `|`. Multiple filters can be chained. The output of one filter is applied to the next.

The following example removes all HTML tags from the name and title-cases it:
```twig
{{ name  |title }}
```

Filters that accept arguments have parentheses around the arguments. This example joins the elements of a list by commas:
```twig
{{ list | join(', ') }}
```

To apply a filter on a section of code, wrap it with the `filter` tag:

```twig
{% filter lower | title %}
	hello<br>
{% endfilter %}}

```

## List of built-in filters:

<ChildTableOfContents :max="1" />
