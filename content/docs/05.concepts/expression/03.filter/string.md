---
title: String Filters
icon: /docs/icons/expression.svg
---

String filters are used to manipulate strings i.e. textual data.

Each section below represents a built-in filter.

- [abbreviate](#abbreviate)
- [base64decode](#base64decode)
- [base64encode](#base64encode)
- [capitalize](#capitalize)
- [default](#default)
- [endsWith](#endsWith)
- [escapeChar](#escapechar)
- [lower](#lower)
- [replace](#replace)
- [sha256](#sha256)
- [slugify](#slugify)
- [startsWith](#startswith)
- [substringAfter](#substringafter)
- [substringAfterLast](#substringafterlast)
- [substringBefore](#substringbefore)
- [substringBeforeLast](#substringbeforelast)
- [title](#title)
- [trim](#trim)
- [upper](#upper)
- [urldecode](#urldecode)
- [urlencode](#urlencode)

---

## abbreviate

The `abbreviate` filter will abbreviate a string using an ellipsis. It takes one argument which is the max
width of the desired output including the length of the ellipsis.

```twig
{{ "this is a long sentence." | abbreviate(7) }}
```

The above example will output the following:

```twig
this...
```

**Arguments**
- length

---

## base64decode

The `base64decode` filter takes the given input, base64-decodes it, and returns the byte array converted to UTF-8 string.

Applying the filter on an incorrect base64-encoded string will throw an exception.

```twig
{{ "dGVzdA==" | base64decode }}
```

The above example will output the following:

```
test
```

---

## base64encode

The `base64encode` filter takes the given input, converts it to an UTF-8 String (`.toString()`) and Base64-encodes it.

```twig
{{ "test" | base64encode }}
```

The above example will output the following:
```
dGVzdA==
```

---

## capitalize

The `capitalize` filter will capitalize the first letter _of the string_.
```twig
{{ "article title" | capitalize }}
```

The above example will output the following:

```twig
Article title
```

---

## title

The `title` filter will capitalize the first letter _of each word_.

```twig
{{ "article title" | title }}
```

The above example will output the following:
```twig
Article Title
```

## default

The `default` filter will render a default value if and only if the object being filtered is empty.
A variable is empty if it is null, an empty string, an empty collection, or an empty map.

```twig
{{ user.phoneNumber | default("No phone number") }}
```

In the following example, if `foo`, `bar`, or `baz` are null the output will become an empty string which is a perfect use case for the default filter:
```twig
{{ foo.bar.baz | default("No baz") }}
```

Note that the default filter will suppress any `AttributeNotFoundException` exceptions that will usually be thrown.

**Arguments**
- default

## endsWith

The `endsWith()` filter returns `true` if the input string ends with the specified suffix. This filter is useful for string comparisons and conditional logic in your workflows.

```yaml
id: compare_strings
namespace: company.team

inputs:
  - id: myvalue
    type: STRING
    defaults: "hello world!"

tasks:
  - id: log_true
    type: io.kestra.plugin.core.log.Log
    message: "{{ inputs.myvalue | endsWith('world!') }}"

  - id: log_false
    type: io.kestra.plugin.core.log.Log
    message: "{{ inputs.myvalue | endsWith('World!') }}"
```

## escapeChar

The `escapeChar` filter sanitizes given string using a selected string escape sequence.

Precede every `'` character with `\`:

```twig
{{ "Can't be here" | escapeChar('single') }}
{# results in: Can\'t be here #}
```

Precede every `"` character with `\`:

```twig
{{ '"Quoted"' | escapeChar('double') }}
{# results in: \"Quoted\" #}
```

Safely pass a rendered Pebble variable as literal value to a shell, replacing every `'` character with the `'\''` escape sequence:

```twig
{# inputs.param value set to: Can't be here #}
echo '{{ inputs.param | escapeChar('shell') }}'
{# results in: echo 'Can'\''t be here' #}
```

**Arguments**

- `type`: escape sequence type `single`, `double`, or `shell`

## lower

The `lower` filter makes an entire string lower case.

```twig
{{ "THIS IS A LOUD SENTENCE" | lower }}
```

The above example will output the following:
```twig
this is a loud sentence
```

## replace

The `replace` filter formats a given string by replacing the placeholders (placeholders are free-form) or using regular expression:
```twig
{{ "I like %this% and %that%." | replace({'%this%': foo, '%that%': "bar"}) }}
```

```twig
{{ 'aa1bb2cc3dd4ee5' | replace({'(\d)': '-$1-'}, regexp=true) }}
```

**Arguments**
- `replace_pairs`: an object with key the search string and value the replace string
- `regexp`: use regexp for search and replace pattern (default is `false`)

## sha256

The `sha256` filter returns the SHA-256 hash of the given UTF-8 String.

```twig
{{ "test" | sha256 }}
```

The above example will output the following:
```
9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
```

## slugify

The `slugify` filter removes non-word characters (alphanumerics and underscores) and converts spaces to hyphen. Also strips leading and trailing whitespace.

```twig
{{ "Joel is a slug" | slugify }}
{# will output 'joel-is-a-slug' #}
```

## startsWith

The `startsWith()` filter returns `true` if the input string starts with the specified prefix. This filter is useful for string comparisons and conditional logic in your workflows.

```yaml
id: compare_strings
namespace: company.team

inputs:
  - id: myvalue
    type: STRING
    defaults: "hello world!"

tasks:
  - id: log_true
    type: io.kestra.plugin.core.log.Log
    message: "{{ inputs.myvalue | startsWith('hello') }}"

  - id: log_false
    type: io.kestra.plugin.core.log.Log
    message: "{{ inputs.myvalue | startsWith('Hello') }}"
```

## substringAfter

The `substringAfter` filter returns the substring before the first occurrence of a separator. The separator is not returned.

```twig
{{ 'a.b.c' | substringAfter('.') }}
{# results in: 'b.c' #}
```

**Arguments**
- `separator`: the string to search for

## substringAfterLast

The `substringAfterLast` filter returns the substring after the last occurrence of a separator. The separator is not returned.

```twig
{{ 'a.b.c' | substringAfterLast('.') }}
{# results in: 'c' #}
```

**Arguments**
- `separator`: the string to search for

## substringBefore

The `substringBefore` filter returns the  substring before the first occurrence of a separator. The separator is not returned.
```twig
{{ 'a.b.c' | substringBefore('.') }}
{# results in: 'a' #}
```

**Arguments**
- `separator`: the string to search for

## substringBeforeLast

The `substringBeforeLast` filter returns the substring before the last occurrence of a separator. The separator is not returned.

```twig
{{ 'a.b.c' | substringBeforeLast('.') }}
{# results in: 'a.b' #}
```

**Arguments**
- `separator`: the string to search for

## trim

The `trim` filter is used to trim whitespace off the beginning and end of a string.
```twig
{{ "    This text has too much whitespace.    " | trim }}
```

The above example will output the following:
```twig
This text has too much whitespace.
```

## upper

The `upper` filter makes an entire string upper case.

```twig
{{ "this is a quiet sentence." | upper }}
```

The above example will output the following:
```twig
THIS IS A QUIET SENTENCE.
```

## urldecode

The `urldecode` translates a string into `application/x-www-form-urlencoded` format using the "UTF-8" encoding scheme.

```twig
{{ "The+string+%C3%BC%40foo-bar" | urldecode }}
```

The above example will output the following:
```twig
The string ü@foo-bar
```

## urlencode

The `urlencode` translates a string into `application/x-www-form-urlencoded` format using the "UTF-8" encoding scheme.

```twig
{{ "The string ü@foo-bar" | urlencode }}
```

The above example will output the following:
```twig
The+string+%C3%BC%40foo-bar
```