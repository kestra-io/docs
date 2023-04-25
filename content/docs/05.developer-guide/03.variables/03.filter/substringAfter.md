---
title: substringAfter
---

The `substringAfter` filter returns the  substring before the first occurrence of a separator. The separator is not returned.
```twig
{{ 'a.b.c' | substringAfter('.') }}
{# results in: 'b.c' #}
```

## Arguments
- `separator`: the String to search for
