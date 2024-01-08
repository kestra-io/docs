---
title: String functions
---

## `capitalizeFirst`: Capitalizes the first character of the value.

If the value is "kestra is cool !", the output will be "Kestra is cool !".

```handlebars
{{capitalizeFirst value}}
```

## `center`: Centers the value in a field of a given width.

If the value is "Handlebars.java", the output will be "  Handlebars.java  ".

```handlebars
{{ center value size=19 [pad="char"] }}
```

#### Arguments:
- `size`
- `pad`


## `cut`: Removes all values of arg from the given string.

If the value is "String with spaces", the output will be "Stringwithspaces".

```handlebars
{{cut value [" "]}}
```




## `defaultIfEmpty`: Default if empty

If the value evaluates to False, it will use the given default. Otherwise, it uses the
value. If value is "" (an empty string), the output will be nothing.


```handlebars
{{defaultIfEmpty value ["nothing"] }}
```


## `join`: Join string

Joins an array, iterator or an iterable with a string.

```handlebars
{{join value join [prefix=""] [suffix=""]}}
```

#### Arguments:
- `join`
- `prefix`
- `suffix`

> If value is the list ['a', 'b', 'c'], the output will be the string "a // b // c".
```handlebars
{{join value " // " [prefix=""] [suffix=""]}}
```

> Join the "a", "b", "c", the output will be the string "a // b // c".
```handlebars
{{join "a" "b" "c" " // " [prefix=""] [suffix=""]}}
```



## `ljust`: Left-aligns the value in a field of a given width.

If the value is Handlebars.java, the output will be "Handlebars.java     ".


```handlebars
{{ljust value 20 [pad=" "] }}
```

#### Arguments:
- `field size`


## `rjust`: Right-aligns the value in a field of a given width.

If the value is Handlebars.java, the output will be "     Handlebars.java".

```handlebars
{{rjust value 20 [pad=" "] }}
```

#### Arguments:
- `field size`
- `pad`



## `substring` Substring

Returns a new `CharSequence` that is a subsequence of this sequence.
The subsequence starts with the `char` value at the specified index and
ends with the `char` value at nd - 1*

```handlebars
{{substring value start end }}
```

#### Arguments:
- `start offset`
- `end offset`

For example:

> If the value is Handlebars.java, the output will be "java".
```handlebars
{{substring value 11 }}
```

> If the value is Handlebars.java, the output will be "Handlebars".
```handlebars
{{substring value 0 10 }}
```

## `lower`: Converts a string into all lowercase.

If the value is 'Still MAD At Yoko', the output will be 'still mad at yoko'.

```handlebars
{{lower value}}
```


## `upper` Converts a string into all uppercase.

If the value is 'Hello', the output will be 'HELLO'.

```handlebars
{{upper value}}
```


## `slugify` Converts to lowercase

This removes non-word characters (alphanumerics and underscores) and converts spaces to hyphens. It also strips leading and trailing whitespace.
If the value is "Joel is a slug", the output will be "joel-is-a-slug".

```handlebars
{{slugify value}}
```



## `stringFormat`: Formats the variable

According to the argument, a string formatting specifier.
If the value is "Hello %s" "handlebars.java", the output will be "Hello handlebars.java".

```handlebars
{{stringFormat string param0 param1 ... paramN}}
```

#### Arguments:
- `format`
- `paramN`




## `stripTags`: Strips all [X]HTML tags.

```handlebars
{{stripTags value}}
```

## `capitalize`: Capitalizes all the whitespace separated words in a String.

If the value is "my first post", the output will be "My First Post".

```handlebars
{{ capitalize value [fully=false]}}
```

Arguments:
- `fully`



## `abbreviate`: Truncates a string

The string will be truncated if it is longer than the specified number of characters.
Truncated strings will end with a translatable ellipsis sequence ("...").
If value is "Handlebars rocks", the output will be "Handlebars...".


```handlebars
{{abbreviate value 13 }}
```

#### Arguments:
- Number of characters to truncate to



## `wordWrap`: Wraps words

This wraps the sentence at a specified line length. If value is Joel is a slug, the output would be: `Joel\nis a\nslug`


```handlebars
{{ wordWrap value 5 }}
```

#### Arguments:
- the number of characters at which to wrap the text



## `replace` Replaces

Each substring of this string that matches the literal target sequence with the specified literal replacement sequence.
If value is "Handlebars ...", the output will be "Handlebars rocks".

```handlebars
{{ replace value "..." "rocks" }}
```


## `yesno`: Boolean to yes / no

For true, false and (optionally) null, to the strings "yes", "no", "maybe".

#### Arguments:
  - `yes`
  - `no`
  - `maybe`

```handlebars
{{yesno value [yes="yes"] [no="no"] maybe=["maybe"] }}
```
