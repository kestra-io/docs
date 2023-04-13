---
title: json
---

The `json` filter will convert any variable to json string.

```twig
{{ [1, 2, 3] | json  }}
{# results in: '[1, 2, 3]' #}

{{ true | json }}
{# results in: 'true' #}

{{ "foo" | json }}
{# results in: '"foo"' #}
```
