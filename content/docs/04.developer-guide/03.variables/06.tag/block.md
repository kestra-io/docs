---
title: block
---

The `block` tag is used to render the contents of a block more than once.
In the following example we create a block with the name 'header':
```twig
{% block header %}
	<h1> Introduction </h1>
{% endblock header %}
```

Then the `block` tag can be used with the [block](../04.function/block.md) function


```twig
{{ block("post") }}
```