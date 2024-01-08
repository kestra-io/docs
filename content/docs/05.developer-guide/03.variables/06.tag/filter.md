---
title: filter
---

The `filter` tag allows you to apply a filter to a large chunk of template.
```twig
{% filter upper %}
	hello
{% endfilter %}

{# output: 'HELLO' #}
```
Multiple filters can be chained together.
```twig
{% filter upper | lower | title %}
	hello<br>
{% endfilter %}

{# output: 'HELLO&lt;br&gt;' #}
```