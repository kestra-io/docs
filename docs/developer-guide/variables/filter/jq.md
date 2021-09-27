# `jq`
The `jq` filter apply a [JQ expression](https://stedolan.github.io/jq/) to a variables. The filter always return an array of result and will be formatted as json. You can use the filter [first](./first) in order to return the first (and maybe the only) result of the jq filter.

```twig
{{ [1, 2, 3] | jq('.')  }}
{# results in: '[1, 2, 3]' #}

{{ [1, 2, 3] | jq('.[0]') | first }}
{# results in: '1' #}
```


Another example, if the current context is :
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


## Arguments
- `expression`: the jq expression to apply
