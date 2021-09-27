# Math
All the regular math operators are available for use. Order of operations applies.
```twig
{{ 2 + 2 / ( 10 % 3 ) * (8 - 1) }}
```

The following operators are supported:

- `+`: Adds two numbers together (the operands are casted to numbers). <code v-pre>{{
1 + 1 }}</code> is 2.
- `-`: Subtracts the second number from the first one. <code v-pre>{{ 3 - 2 }}</code> is 1.
- `/`: Divides two numbers. The returned value will be a floating point number.  <code v-pre>{{ 1 / 2 }}</code> is <code v-pre>{{ 0.5 }}</code>.
- `%`: Calculates the remainder of an integer division. <code v-pre>{{ 11 % 7 }}</code> is 4.
- `*`: Multiplies the left operand with the right one. <code v-pre>{{ 2 * 2 }}</code> would return 4.


The result can be negated using the [not](./not) operator.