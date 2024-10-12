---
title: Numeric Filters
icon: /docs/icons/expression.svg
---

Numeric filters are used to format numbers or convert strings to numbers.

Each section below represents a built-in filter.

- [abs](#abs)
- [number](#number)
- [numberFormat](#numberformat)

## abs

The `abs` filter is used to obtain the absolute value.

```twig
{{ -7 | abs }}

{# output: 7 #}
```

## number

The `number` filter return a parsed number from a string. If no type is passed, we try to infer the appropriate type.


```twig
{{ "12.3" | number | className }}
{# will output: java.lang.Float #}

{{ "9223372036854775807" | number('BIGDECIMAL') | className }}
{# will output: java.math.BigDecimal #}
```

**Arguments**
- type:
  - `INT`
  - `FLOAT`
  - `LONG`
  - `DOUBLE`
  - `BIGDECIMAL`
  - `BIGINTEGER`

## numberFormat

The `numberFormat` filter is used to format a decimal number. Behind the scenes it uses `java.text.DecimalFormat`.
```twig
{{ 3.141592653 | numberFormat("#.##") }}
```
The above example will output the following:
```twig
3.14
```

**Arguments**
- format
