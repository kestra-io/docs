---
title: Function
---

Functions can be called to generate content. Functions are called by their name followed by parentheses `()` and may have arguments.

For instance, the range function returns a list containing an arithmetic progression of integers:

```twig
{% for i in range(0, 3) %}
{{ i }},
{% endfor %}
```

## List of built-in functions:

<ChildTableOfContents :max="1" />
