---
title: slugify
---

The `slugify` filter removes non-word characters (alphanumerics and underscores) and converts spaces to hyphen. Also strips leading and trailing whitespace.

```twig
{{ "Joel is a slug" | slugify }}
{# will output 'joel-is-a-slug' #}
```
