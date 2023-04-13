---
title: Math
---

All the regular math operators are available for use. Order of operations applies.
```twig
{{ 2 + 2 / ( 10 % 3 ) * (8 - 1) }}
```

The following operators are supported:

- `+`: Adds two numbers together (the operands are cast to numbers). `{{
1 + 1 }}` is 2.
- `-`: Subtracts the second number from the first one. `{{ 3 - 2 }}` is 1.
- `/`: Divides two numbers. The returned value will be a floating point number.  `{{ 1 / 2 }}` is `{{ 0.5 }}`.
- `%`: Calculates the remainder of an integer division. `{{ 11 % 7 }}` is 4.
- `*`: Multiplies the left operand with the right one. `{{ 2 * 2 }}` would return 4.


The result can be negated using the [not](./not.md) operator.