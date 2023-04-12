---
order: 5
---
# Boolean functions

### `eq`: Equality

Test if two elements are equals.

> Render `yes` or `no`:
```handlebars
  {{#eq a b}}
    yes
  {{else}}
    no
  {{/eq}}
```

> Render `true` or `false`:
```handlebars
  {{eq a b}}
```

> Render `yes` or `no`:
```handlebars
  {{eq a b yes='yes' no='no'}}
```

### `neq`: Not equality

Test if two elements are NOT equals.

> Render `yes` or `no`:
```handlebars
  {{#neq a b}}
    yes
  {{else}}
    no
  {{/neq}}
```

> Render `true` or `false`:
```handlebars
  {{neq a b}}
```

> Render `yes` or `no`:
```handlebars
  {{neq a b yes='yes' no='no'}}
```

### `gt`: Greater operator

Greater operator (arguments must be [Comparable](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html) elements).

> Render `yes` or `no`:
```handlebars
  {{#gt a b}}
    yes
  {{else}}
    no
  {{/gt}}
```

> Render `true` or `false`:
```handlebars
  {{gt a b}}
```

> Render `yes` or `no`:
```handlebars
  {{gte a b yes='yes' no='no'}}
```

### `gte`: Greater or equal operator

Greater or equal operator (arguments must be [Comparable](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html) elements).

> Render `yes` or `no`:
```handlebars
  {{#gte a b}}
    yes
  {{else}}
    no
  {{/gte}}
```

> Render `true` or `false`:
```handlebars
  {{gte a b}}
```

> Render `yes` or `no`:
```handlebars
  {{gte a b yes='yes' no='no'}}
```

### `lt`: Less operator

Less than operator (arguments must be [Comparable](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html) elements).

> Render `yes` or `no`:
```handlebars
  {{#lt a b}}
    yes
  {{else}}
    no
  {{/lt}}
```

> Render `true` or `false`:
```handlebars
  {{lt a b}}
```

> Render `yes` or `no`:
```handlebars
  {{lt a b yes='yes' no='no'}}
```

### `lte`: Less or equal operator

Less than operator (arguments must be [Comparable](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html) elements.

> Render `yes` or `no`:
```handlebars
  {{#lte a b}}
    yes
  {{else}}
    no
  {{/lte}}
```

> Render `true` or `false`:
```handlebars
  {{lte a b}}
```

> Render `yes` or `no`:
```handlebars
  {{lte a b yes='yes' no='no'}}
```

### `and`: And operator

And operator. This is a boolean operation.

Truthiness of arguments is determined by [isEmpty](https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#isEmpty()), so this
helper can be used with non-boolean values.

Multiple arguments are supported too:

```handlebars
  {{#and a b c d}}
    yes
  {{else}}
    no
  {{/and}}
```

> Render `yes` or `no`:
```handlebars
  {{#and a b}}
    yes
  {{else}}
    no
  {{/and}}
```


> Render `true` or `false`:

```handlebars
  {{and a b}}
```

> Render `yes` or `no`:
```handlebars
  {{and a b yes='yes' no='no'}}
```

### `or`: Or operator

Or operator. This is a boolean operation

Truthiness of arguments is determined by [isEmpty](https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#isEmpty()), so this
helper can be used with non-boolean values.

Multiple arguments are supported too:

```handlebars
  {{#or a b c d}}
    yes
  {{else}}
    no
  {{/or}}
```


> Render `yes` or `no`:
```handlebars
  {{#or a b}}
    yes
  {{else}}
    no
  {{/or}}
```

> Render `true` or `false`:
```handlebars
  {{or a b}}
```

> Render `yes` or `no`:
```handlebars
  {{or a b yes='yes' no='no'}}
```

### `not`: Not operator

Truthiness of arguments is determined by [isEmpty](https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#isEmpty()), so this
helper can be used with non-boolean values.


> Render `yes` or `no`:
```handlebars
  {{#not a}}
    yes
  {{else}}
    no
  {{/not}}
```

> Render `true` or `false`:
```handlebars
  {{not a}}
```

> Render `y` or `n`:
```handlebars
  {{not a yes='yes' no='no'}}
```

### `cmp`: Compare operator

Compare to object as [Comparable](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html)s.


> Renders 1 if a > b, 0 if a == b -1 if a < b
```handlebars
  {{cmp a b}}
```

### `isNull`: Compare operator

Test if one element is null.

```handlebars
  {{isNull a}}
```

### `isNotNull`: Compare operator

Test if one element is not null.

```handlebars
  {{isNotNull a}}
```
