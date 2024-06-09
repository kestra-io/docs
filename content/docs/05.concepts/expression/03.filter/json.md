---
title: JSON Filters
icon: /docs/icons/expression.svg
---

JSON filters are used to manipulate JSON objects, often API responses.

---

## json

The `json` filter will convert any variable to json string.

```twig
{{ [1, 2, 3] | json  }}
{# results in: '[1, 2, 3]' #}

{{ true | json }}
{# results in: 'true' #}

{{ "foo" | json }}
{# results in: '"foo"' #}
```

---

## jq

The `jq` filter apply a [JQ expression](https://stedolan.github.io/jq/) to a variables. The filter always return an array of result and will be formatted as json. You can use the filter [first](../03.filter/object.md#first) in order to return the first (and potentially the only) result of the jq filter.

```twig
{{ [1, 2, 3] | jq('.')  }}
{# results in: '[1, 2, 3]' #}

{{ [1, 2, 3] | jq('.[0]') | first }}
{# results in: '1' #}
```


Another example, if the current context is:
```json
{
  "outputs": {
    "task1": {
      "value": 1,
      "text": "awesome1"
    },
    "task2": {
      "value": 2,
      "text": "awesome2"
    }
  }
}
```

```twig
{{ outputs | jq('.task1.value') | first }}
```

the output will be `1`.


**Arguments**
- `expression`: the jq expression to apply

