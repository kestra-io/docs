# `json`
The `json` function will convert any string to object allowing to access to theirs properties

```twig
{{ json('[1, 2, 3]')[0]  }}
{# results in: '1' #}

{{ json('{"foo": [666, 1, 2]}').foo[0}}
{# results in: '666' #}
```
