# `substringAfterLast`
The `substringAfterLast` filter returns the substring after the last occurrence of a separator. The separator is not returned.
```twig
{{ 'a.b.c' | substringAfterLast('.') }}
{# results in: 'c' #}
```

## Arguments
- `separator`: the String to search for
