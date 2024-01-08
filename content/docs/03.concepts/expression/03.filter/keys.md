---
title: keys
---

The `keys` filter will return the keys from a collection, or list of index of an array.
```twig
{{ {'this': 'foo', 'that': 'bar'} | keys }}
{# will output the key from this map '['this', 'that']' #}


{{ [0, 1, 3] | keys }}
{# will output the key from this array '[0, 1, 2]' #}

```