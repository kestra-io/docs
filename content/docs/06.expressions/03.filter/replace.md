---
title: replace
---

The `replace` filter formats a given string by replacing the placeholders (placeholders are free-form) or using regular expression:
```twig
{{ "I like %this% and %that%." | replace({'%this%': foo, '%that%': "bar"}) }}
```

```twig
{{ 'aa1bb2cc3dd4ee5' | replace({'(\d)': '-$1-'}, regexp=true) }}
```

## Arguments
- `replace_pairs`: an object with key the search string and value the replace string
- `regexp`: use regexp for search and replace pattern (default is `false`)
