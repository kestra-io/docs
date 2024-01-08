---
title: json
---

The `json` test checks if a variable is valid json string?
```twig
{% if '{"test": 1}' is json %}
	...
{% endif %}
```