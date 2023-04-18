---
title: Vars functions
---

## `firstDefined` First defined variables

Return the first defined variables or throw an exception if no variables are defined.

```handlebars
{{ firstDefined outputs.task1.uri outputs.task2.uri }}
```

## `eval` Evaluate a handlebars expression

Evaluate a handlebars expression at runtime based on the whole context.

Mostly useful for [Lookup in current child's tasks tree](../basic-usage#parents-with-flowable-task) and dynamic tasks.


```handlebars
{{ eval 'outputs.first.[{{taskrun.value}}].value' }}
```

## `firstDefinedEval` First defined evaluation

First defined evaluates a handlebars expression at runtime based on the whole context or throws an exception if no variables are defined.

Mostly useful for [Lookup in current child's tasks tree](../basic-usage#parents-with-flowable-task) and dynamic tasks.


```handlebars
{{ firstDefined 'outputs.first.value' 'outputs.first.[{{taskrun.value}}].value' }}
```

## `get` get an element for an array or map by key
```handlebars
   {{get object ["key"]}}
```

* get on `object` type map, the key at `key`
* get on `object` type array, the index at `key`

Mostly useful for [Lookup in current child's tasks tree](../basic-usage#parents-with-flowable-task) and dynamic tasks.

```handlebars
{{ get outputs 'first' }}
```

