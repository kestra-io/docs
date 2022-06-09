# `number`
The `number` filter return a parsed number from a string. It's really useful for parsing output from previous task and used it with [even](../test/even.md) or [odd](../test/odd.md). If no type is passed, we try to guess the best one.


```twig
{{ "12.3" | number | className }}
{# will output: java.lang.Float #}

{{ "9223372036854775807" | number('BIGDECIMAL') | className }}
{# will output: java.math.BigDecimal #}
```

## Arguments
- type:
  - `INT`
  - `FLOAT`
  - `LONG`
  - `DOUBLE`
  - `BIGDECIMAL`
  - `BIGINTEGER`