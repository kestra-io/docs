---
title: json
---

The `json` function will convert any string to object allowing to access its properties

```twig
{{ json('[1, 2, 3]')[0] }}
{# results in: '1' #}

{{ json('{"foo": [666, 1, 2]}').foo[0] }}
{# results in: '666' #}

{{ json('{"bar": "\u0063\u0327"}').bar }}
{# results in: 'ç' #}
```
