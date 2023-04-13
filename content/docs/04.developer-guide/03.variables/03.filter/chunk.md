---
title: chunk
---

The `chunk` filter returns partitions of `size` from a list.
```twig
{{ [[1,2,3,4,5,6,7,8,9]] | chunk(2) }}
{# results in: '[[1,2],[3,4],[5,6],[7,8],[9]]' #}
```

## Arguments
- `size`: the size of the chunk
