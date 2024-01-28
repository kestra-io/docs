---
title: substringBeforeLast
---

The `substringBeforeLast` filter returns the substring before the last occurrence of a separator. The separator is not returned.
```twig
{{ 'a.b.c' | substringBeforeLast('.') }}
{# results in: 'a.b' #}
```

## Arguments
- `separator`: the String to search for
