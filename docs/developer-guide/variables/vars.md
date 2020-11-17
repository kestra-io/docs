
# Vars functions

[[toc]]

## `firstDefined` First defined variables 

Return the first defined variables or throw exception if no variables are defined.

```handlebars
{{ firstDefined outputs.task1.uri outputs.task2.uri }}
```

## `eval` Evaluate a handlebars expression 

Evaluate at runtime a handlebars expression based on the whole context.

Mostly useful for [Lookup in current childs tasks tree](/docs/developer-guide/variables/#lookup-in-current-childs-tasks-tree) and dynamic tasks.


```handlebars
{{ eval 'outputs.first.[{{taskrun.value}}].value' }}
```

## `firstDefinedEval` First defined evaluation

First defined evaluate at runtime a handlebars expression based on the whole context or throw exception if no variables are defined.

Mostly useful for [Lookup in current childs tasks tree](/docs/developer-guide/variables/#lookup-in-current-childs-tasks-tree) and dynamic tasks.


```handlebars
{{ firstDefined 'outputs.first.value' 'outputs.first.[{{taskrun.value}}].value' }}
```

