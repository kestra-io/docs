---
order: 11
---
# Boolean functions

[[toc]]

### Equality

Test if two elements are equals. Usage:

Render 'yes' or 'no':

```handlebars
  {{#eq a b}}
    yes
  {{else}}
    no
  {{/eq}}
```

Render 'true' or 'false':

```handlebars
  {{eq a b}}
```

Render 'y' or 'n':

```handlebars
  {{eq a b yes='y' no='n'}}
```

### Not equality

Test if two elements are NOT equals. Usage:

Render 'yes' or 'no':

```handlebars
  {{#neq a b}}
    yes
  {{else}}
    no
  {{/neq}}
```

Render 'true' or 'false':

```handlebars
  {{neq a b}}
```

Render 'y' or 'n':

```handlebars
  {{neq a b yes='y' no='n'}}
```

### Greater operator

Greater operator (arguments must be Comparable elements). Usage:

Render 'yes' or 'no':

```handlebars
  {{#gt a b}}
    yes
  {{else}}
    no
  {{/gt}}
```

Render 'true' or 'false':

```handlebars
  {{gt a b}}
```

Render 'y' or 'n':

```handlebars
  {{gte a b yes='y' no='n'}}
```

### Greater or equal operator

Greater or equal operator (arguments must be Comparable elements). Usage:

Render 'yes' or 'no':

```handlebars
  {{#gte a b}}
    yes
  {{else}}
    no
  {{/gte}}
```

Render 'true' or 'false':

```handlebars
  {{gte a b}}
```

Render 'y' or 'n':

```handlebars
  {{gte a b yes='y' no='n'}}
```

### Less operator

Less than operator (arguments must be Comparable elements). Usage:

Render 'yes' or 'no':

```handlebars
  {{#lt a b}}
    yes
  {{else}}
    no
  {{/lt}}
```

Render 'true' or 'false':

```handlebars
  {{lt a b}}
```

Render 'y' or 'n':

```handlebars
  {{lt a b yes='y' no='n'}}
```

### Less or equal operator

Less than operator (arguments must be {@link Comparable} elements. Usage:

Render 'yes' or 'no':

```handlebars
  {{#lte a b}}
    yes
  {{else}}
    no
  {{/lte}}
```

Render 'true' or 'false':

```handlebars
  {{lte a b}}
```

Render 'y' or 'n':

```handlebars
  {{lte a b yes='y' no='n'}}
```

### And operator

And operator. This is a boolean operation.

Truthiness of arguments is determined by isEmpty, so this
helper can be used with non-boolean values.

Usage:

Render 'yes' or 'no':

```handlebars
  {{#and a b}}
    yes
  {{else}}
    no
  {{/lt}}
```

Multiple arguments are supported too:

```handlebars
  {{#and a b c d}}
    yes
  {{else}}
    no
  {{/lt}}
```

Render 'true' or 'false':

```handlebars
  {{and a b}}
```

Render 'y' or 'n':

```handlebars
  {{and a b yes='y' no='n'}}
```

### Or operator

Or operator. This is a boolean operation

Truthiness of arguments is determined by isEmpty, so this
helper can be used with non-boolean values.

Usage:

Render 'yes' or 'no':

```handlebars
  {{#or a b}}
    yes
  {{else}}
    no
  {{/lt}}
```

Multiple arguments are supported too:

```handlebars
  {{#or a b c d}}
    yes
  {{else}}
    no
  {{/lt}}
```

Render 'true' or 'false':

```handlebars
  {{or a b}}
```

Render 'y' or 'n':

```handlebars
  {{or a b yes='y' no='n'}}
```

### Not operator

Truthiness of arguments is determined by isEmpty, so this
helper can be used with non-boolean values.

Usage:

Render 'yes' or 'no':

```handlebars
  {{#not a}}
    yes
  {{else}}
    no
  {{/lt}}
```

Render 'true' or 'false':

```handlebars
  {{not a}}
```

Render 'y' or 'n':

```handlebars
  {{not a yes='y' no='n'}}
```

### Compare operator

Compare to object as comparables.

```handlebars
  {{cmp a b}}
```

Renders 1 if a > b, 0 if a == b -1 if a < b
