---
title: raw
---

The `raw` tag allows you to write a block of Pebble syntax that won't be parsed.

```twig
{% raw %}{{ user.name }}{% endraw %}
```

```twig
{% raw %}
	{% for user in users %}
		{{ user.name }}
	{% endfor %}
{% endraw %}
```
