---
order: 4
---
# Dynamic functions

This section discuss about what features the templating system allows you to do. This templating system is based on [handlebars](https://handlebarsjs.com/). It adds extra features to the handlebars core features by defining extra custom functions related to kestra operations.

Handlebars templating system is a composable system that lets you assemble complex templates to generate rich output. In Kestra context the computed template result is used for input and output data between flows.

## Boolean operations

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

## Iterations

You can iterate over a list using the built-in each helper. Inside the block, you can use `this` to reference the element being iterated over. `contextualListVariable` is an iterable item on which the mydata property is displayed for all entries.

The `@index` is a special variable available in the each loop context which value is the current index of the element beeing iterated. There are agic* variables like @index in a each context. The following ones are also available: `@key` `@index` `@first` `@last` `@odd` `@even`

See handlebars documentation for more about this topic.

```handlebars
{{#each contextualListVariable}}
    {{this.mydata}} {{@index}}
{{/each}}
```

will produce

```csv
one 0
two 1
three 2
django! 3
```

for the following data sample when

```javascript
contextualListVariable = [
  {"mydata": "one"},
  {"mydata": "two"},
  {"mydata": "three"},
  {"mydata": "django!"},
]
```

If the contextual this is not convinient to use data as you wish it is possible to alias it like below:

```handlebars
{{#each iterableVariable as | myItem | }}
    {{myItem.mydata}}
{{/each}}
```

## String helpers

### Capitalizes the first character of the value.

For example:

```handlebars
{{capitalizeFirst value}}
```

If value is "kestra is cool !", the output will be "Kestra is cool !".

### Centers the value in a field of a given width.

For example:

```handlebars
{{center value size=19 [pad="char"] }}
```

If value is "Handlebars.java", the output will be "  Handlebars.java  ".

### Removes all values of arg from the given string.

For example:

```handlebars
{{cut value [" "]}}
```

If value is "String with spaces", the output will be "Stringwithspaces".

### Default empty

If value evaluates to False, uses the given default. Otherwise, uses the
value.

For example:

```handlebars
{{defaultIfEmpty value ["nothing"] }}
```

If value is "" (the empty string), the output will be nothing.

### Join string

Joins an array, iterator or an iterable with a string.

For example:

```handlebars
{{join value " // " [prefix=""] [suffix=""]}}
```

If value is the list ['a', 'b', 'c'], the output will be the string "a // b // c".

Or:

```handlebars
{{join "a" "b" "c" " // " [prefix=""] [suffix=""]}}
```

Join the "a", "b", "c", the output will be the string "a // b // c".

### Left-aligns the value in a field of a given width.

Argument: `field size`

For example:

```handlebars
{{ljust value 20 [pad=" "] }}
```

If value is Handlebars.java, the output will be "Handlebars.java     ".

### Right-aligns the value in a field of a given width.

Argument: `field size`

For example:

```handlebars
{{rjust value 20 [pad=" "] }}
```

If value is Handlebars.java, the output will be "     Handlebars.java".

### Substring

Returns a new `CharSequence` that is a subsequence of this sequence.
The subsequence starts with the `char` value at the specified index and
ends with the `char` value at nd - 1*

Argument: `start offset`
          `end offset`

For example:

```handlebars
{{substring value 11 }}
```

If value is Handlebars.java, the output will be "java".

or

```handlebars
{{substring value 0 10 }}
```

If value is Handlebars.java, the output will be "Handlebars".

### Converts a string into all lowercase.

For example:

```handlebars
{{lower value}}
```

If value is 'Still MAD At Yoko', the output will be 'still mad at yoko'.

### Converts a string into all uppercase.

For example:

```handlebars
{{upper value}}
```

If value is 'Hello', the output will be 'HELLO'.

# Converts to lowercase

removes non-word characters (alphanumerics and underscores) and converts spaces to hyphens. Also strips leading and trailing whitespace.

For example:

```handlebars
{{slugify value}}
```

If value is "Joel is a slug", the output will be "joel-is-a-slug".


### Formats the variable

according to the argument, a string formatting specifier.

For example:

```handlebars
{{stringFormat string param0 param1 ... paramN}}
```

If value is "Hello %s" "handlebars.java", the output will be "Hello handlebars.java".

### Strips all [X]HTML tags.

For example:

```handlebars
{{stripTags value}}
```

### Capitalizes all the whitespace separated words in a String.

For example:

```handlebars
{{ capitalize value [fully=false]}}
```

If value is "my first post", the output will be "My First Post".


### Truncates a string

if it is longer than the specified number of characters.

Truncated strings will end with a translatable ellipsis sequence ("...").

Argument: Number of characters to truncate to

For example:

```handlebars
{{abbreviate value 13 }}
```

If value is "Handlebars rocks", the output will be "Handlebars...".

### Wraps words

at specified line length.

Argument: number of characters at which to wrap the text

For example:

```handlebars
{{ wordWrap value 5 }}
```

If value is Joel is a slug, the output would be:

```csv
Joel
is a
slug
```

### Replaces

each substring of this string that matches the literal target sequence with the specified literal replacement sequence.

For example:

```handlebars
{{ replace value "..." "rocks" }}
```

If value is "Handlebars ...", the output will be "Handlebars rocks".

### Maps values

for true, false and (optionally) null, to the strings "yes", "no", "maybe".

For example:

```handlebars
{{yesno value [yes="yes"] [no="no"] maybe=["maybe"] }}
```

### Date format

Usage:

```handlebars
{{dateFormat date ["format"] [format="format"][tz=timeZone|timeZoneId]}}
```

Format parameters is one of:

- "full": full date format. For example: Tuesday, June 19, 2012
- "long": long date format. For example: June 19, 2012
- "medium": medium date format. For example: Jun 19, 2012
- "short": short date format. For example: 6/19/12
- "pattern": a date pattern.

Otherwise, the default formatter will be used.
The format option can be specified as a parameter or hash (a.k.a named parameter).


Usage:

```handlebars
   {{numberFormat number ["format"] [locale=default]}}
```

Format parameters is one of:

- "integer": the integer number format
- "percent": the percent number format
- "currency": the decimal number format
- "pattern": a decimal pattern.

Otherwise, the default formatter will be used.

More options:

- groupingUsed: Set whether or not grouping will be used in this format.
- maximumFractionDigits: Sets the maximum number of digits allowed in the fraction portion of
a number.
- maximumIntegerDigits: Sets the maximum number of digits allowed in the integer portion of a
number
- minimumFractionDigits: Sets the minimum number of digits allowed in the fraction portion of
a number
- minimumIntegerDigits: Sets the minimum number of digits allowed in the integer portion of a
number.
- parseIntegerOnly: Sets whether or not numbers should be parsed as integers only.
- roundingMode: Sets the {@link java.math.RoundingMode} used in this NumberFormat.

Usage:

```handlebars
   {{now ["format"] [tz=timeZone|timeZoneId]}}
```

Format parameters is one of:

- "full": full date format. For example: Tuesday, June 19, 2012
- "long": long date format. For example: June 19, 2012
- "medium": medium date format. For example: Jun 19, 2012
- "short": short date format. For example: 6/19/12
- "pattern": a date pattern.

Otherwise, the default formatter will be used.
