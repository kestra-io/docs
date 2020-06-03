
# JSON functions

[[toc]]

## `json` Convert an object to json 

Convert an object to is JSON representation

```handlebars
{{json output.task-id}}
```

Example, if the current context is :  
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

the output will be `{"value":2,"text":"awesome2"}`.

## `jq` Transform vars with JQ 

Apply the [JQ expression](https://stedolan.github.io/jq/) to a variables.

```handlebars
{{jq vars expr [first=false]}}
```


::: warning
Internally, [Jackson JQ](https://github.com/eiiches/jackson-jq) is used and support only a large subset of official JQ.
:::

 
Example, if the current context is :
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

```handlebars
{{jq outputs .task1.value true}}
```

the output will be `1`.

