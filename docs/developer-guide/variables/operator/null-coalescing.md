# Null-Coalescing operator

Pebble supports the use of the null-coalescing operator that allows testing if variables are defined.
```twig
{% set baz = "baz" %}
{{ foo ?? bar ?? baz }}

{# results in: 'baz' #}

{{ foo ?? bar ?? raise }}
{# results: an exception because none of the 3 vars is defined  #}
```