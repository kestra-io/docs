---
title: Object Filters (Maps, Arrays and More)
icon: /docs/icons/expression.svg
---

Object filters help you manipulate maps and arrays.

Each section below represents a built-in filter.

- [chunk](#chunk)
- [className](#classname)
- [first](#first)
- [join](#join)
- [keys](#keys)
- [last](#last)
- [merge](#merge)
- [reverse](#reverse)
- [rsort](#rsort)
- [slice](#slice)
- [sort](#sort)
- [split](#split)

## chunk

The `chunk` filter returns partitions of `size` from a list.
```twig
{{ [[1,2,3,4,5,6,7,8,9]] | chunk(2) }}
{# results in: '[[1,2],[3,4],[5,6],[7,8],[9]]' #}
```

**Arguments**
- `size`: the size of the chunk

## className

The `className` filter return a string with the current class name.

```twig
{{ "12.3" | number | className }}
{# will output: java.lang.Float #}
```

## first

The `first` filter will return the first item of a collection, or the first letter of a string.

```twig
{{ users | first }}
{# will output the first item in the collection named 'users' #}

{{ 'Mitch' | first }}
{# will output 'M' #}
```

## join

The `join` filter will concatenate all items of a collection into a string. An optional argument can be given
to be used as the separator between items.

```twig
{#
    List<String> names = new ArrayList<>();
    names.add("Alex");
    names.add("Joe");
    names.add("Bob");
#}
{{ names | join(',') }}
{# will output: Alex,Joe,Bob #}
```

**Arguments**
- separator

## keys

The `keys` filter will return the keys from a collection, or list of index of an array.

```twig
{{ {'this': 'foo', 'that': 'bar'} | keys }}
{# will output the keys from this map '['this', 'that']' #}


{{ [0, 1, 3] | keys }}
{# will output the key from this array '[0, 1, 2]' #}
```

## values

The `values` filter will return the values from a map:

```twig
{{ {'this': 'foo', 'that': 'bar'} | values }}
{# will output the values from this map '['foo', 'bar']' #}
```

Here is how you can test that expression in a flow:

```yaml
id: expression
namespace: company.myteam
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "{{ {'this': 'foo', 'that': 'bar'} | values }}"
```

## last

The `last` filter will return the last item of a collection, or the last letter of a string.
```twig
{{ users | last }}
{# will output the last item in the collection named 'users' #}

{{ 'Mitch' | last }}
{# will output 'h' #}
```

## length

The `length` filter returns the number of items of collection, map or the length of a string:

```twig
{% if users | length > 10 %}
    ...
{% endif %}
```

## merge

The `merge` filter merge items of type Map, List or Array:
```twig
{{ [1, 2] | merge([3, 4]) }}
```

## reverse

The `reverse` filter reverses a List:
```twig
{% for user in users | reverse %} {{ user }} {% endfor %}
```

## rsort

The `rsort` filter will sort a list in reversed order. The items of the list must implement `Comparable`.
```twig
{% for user in users | rsort %}
	{{ user.name }}
{% endfor %}
```

## slice

The `slice` filter returns a portion of a list, array, or string.
```twig
{{ ['apple', 'peach', 'pear', 'banana'] | slice(1,3) }}
{# results in: [peach, pear] #}


{{ 'Mitchell' | slice(1,3) }}
{# results in: 'it' #}
```

**Arguments**
- `fromIndex`: 0-based and inclusive
- `toIndex`: 0-based and exclusive

## sort

The `sort` filter will sort a list. The items of the list must implement `Comparable`.
```twig
{% for user in users | sort %}
	{{ user.name }}
{% endfor %}
```

## split

The `split` filter splits a string by the given delimiter and returns a list of strings.
```twig
{% set foo = "one,two,three" | split(',') %}
{# foo contains ['one', 'two', 'three'] #}
```

You can also pass a limit argument:
- If `limit` is positive, then the pattern will be applied at most n - 1 times, the array's length will be no greater than n, and the array's last entry will contain all input beyond the last matched delimiter;
- If `limit` is negative, then the pattern will be applied as many times as possible and the array can have any length;
- If `limit` is zero, then the pattern will be applied as many times as possible, the array can have any length, and trailing empty strings will be discarded;

```twig
{% set foo = "one,two,three,four,five" | split(',', 3) %}
{# foo contains ['one', 'two', 'three,four,five'] #}
```

**Arguments**
- delimiter: The delimiter
- limit: The limit argument
