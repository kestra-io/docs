---
order: 7
---
# Outputs & Metrics from a script engine

Kestra can catch outputs and metrics from any scripting language. In the core, [Python](../../../plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Python.md) and [Node](../../../plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Node.md) plugins, inject a package to help you!

If you are using another language like [Bash](../../../plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Bash.md), we don't provide any package to help you, but you can do it with the `echo` command on stdout.

## Script command

Kestra looks at every outputs on standard out (or standard err) and search for the special patterns `::{}::` or `{}` that allow to specify outputs and metrics as JSON objects:
- `{}` can be used for single line JSON objects.
- `::{}::` can be used for multi-line JSON objects.

Here is the representation of the output object, it's a map in which you can add any key/value pair:

```json5
"outputs": { // map of key value with all the outputs you want to send
    "my-key": "my-value",
    "my-list": [1, 2, 3] // you can use  json type (bool, array, map, …)
}
```

Here is the representation of the metrics object, it's a list of JSON objects:
```json5
"metrics": [ // you can send multiple metrics at once
    {
        "name": "my-counter", // mandatory, the name of the metrics
        "type": "counter", // mandatory, "counter" or "timer"
        "value": 1.2, // mandatory (double), counter to add, or duration in seconds for timer
        "tags":{ // optional list of tags that will expose internal details
          "type":"read",
          "location":"eu"
        }
    }
]
```



## Examples

```shell
# 1. send some outputs with different types
echo '::{"outputs":{"test":"value","int":2,"bool":true,"float":3.65}}::'

# 2. send a counter with tags
echo '::{"metrics":[{"name":"count","type":"counter","value":1,"tags":{"tag1":"i","tag2":"win"}}]}::'

# 3. send a timer with tags
echo '::{"metrics":[{"name":"time","type":"timer","value":2.12,"tags":{"tag1":"i","tag2":"destroy"}}]}::'
```
