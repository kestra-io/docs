
# `is`
The `is` operator will apply a test to a variable which will return a boolean.

```twig
{% if 2 is even %}
	...
{% endif %}
```
The result can be negated using the `not` operator:

```twig
{% if 3 is not even %}
	...
{% endif %}
```