---
title: substringBefore
---

The `substringBefore` filter returns the  substring before the first occurrence of a separator. The separator is not returned.
```twig
{{ 'a.b.c' | substringBefore('.') }}
{# results in: 'a' #}
```

## Arguments
- `separator`: the String to search for
