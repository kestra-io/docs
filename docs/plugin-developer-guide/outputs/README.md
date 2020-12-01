---
order: 7
---
# Outputs & Metrics from a script engine

Kestra can catch outputs & metrics from any scripting language. In the core, [Python](../../../plugins/core/tasks/scripts/org.kestra.core.tasks.scripts.Python.md) & [Node](../../../plugins/core/tasks/scripts/org.kestra.core.tasks.scripts.Node.md) inject an package to help you!

If you are using another language like [Bash](../../../plugins/core/tasks/scripts/org.kestra.core.tasks.scripts.Bash.md) or another one, we don't provide any package to help, but you can easily do it with simple echo on stdout.

## Script command 

Kestra look at every outputs on standard out (or standard err) for a special `::{}::` with `{}` a compacted json string (not multiple line).

Here is the full representation of the object : 

```json5
{
    "outputs": { // map of key value with all the outputs you want to send
        "my-key": "my-value",
        "my-list": [1, 2, 3] // you can use 
    },
    "metrics": [ // you can send multiple metrics at once
       {
            "name": "my-counter", // mandatory, the name of the metrics
            "type": "counter", // mandatory, "counter" or "timer"
            "value": 1.2, // mandatory (double), counter to add, or duration in seconds for timer 
       }
    ]
}
```



## Examples 

```shell
# send some outputs with right type 
echo '::{"outputs":{"test":"value","int":2,"bool":true,"float":3.65}}::'

# send a counter with tags
echo '::{"metrics":[{"name":"count","type":"counter","value":1,"tags":{"tag1":"i","tag2":"win"}}]}::'

# send a timer with tags
echo '::{"metrics":[{"name":"timer2","type":"timer","value":2.12,"tags":{"tag1":"i","tag2":"destroy"}}]}::'
```
