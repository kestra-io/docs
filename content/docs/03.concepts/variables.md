---
title: Variables
---

Variables are key-value pairs that can be used many times in your flow. You can also store variables on a namespace level so that they can be reused across multiple flows in a given namespace.

## How to configure variables

Here is how you can configure variables in your flow:

```yaml
id: hello-world
namespace: dev

variables:
  myvar: hello
  numeric_variable: 42

tasks:
  - id: log
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ vars.myvar }} world {{ vars.numeric_variable }}"
```

You can see the syntax for using variables is `{{ vars.variable_name }}`.

## How are variables rendered

You can use variables in any task property that is documented as **dynamic**.

Dynamic variables will be rendered thanks to the Pebble templating engine. Pebble templating engine allows to process various expressions with filters and functions. More information on variable processing can be found under [Expressions](expression/01.index.md).


