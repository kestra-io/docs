---
title: Kestra Function Reference – render, secret, read, and More
description: Reference guide to the main functions available in Kestra expressions, including rendering, secrets, file access, debugging, and utility helpers.
sidebarTitle: Function Reference
icon: /src/contents/docs/icons/expression.svg
---

Use functions when you need to generate or retrieve a value dynamically with syntax such as `{{ functionName(...) }}`.

## Common function groups

### Rendering and debugging

- `render()` evaluates nested Pebble expressions
- `renderOnce()` renders a value only once
- `printContext()` outputs the full available context for debugging

Examples:

```twig
{{ render("{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}") }}
{{ printContext() }}
```

### Secrets and file access

- `secret()` reads a secret from Kestra's secret backend
- `read()` reads the contents of a namespace file or internal-storage file
- `fileURI()` resolves a namespace file URI

Examples:

```twig
{{ secret('GITHUB_ACCESS_TOKEN') }}
{{ read('subdir/file.txt') }}
{{ fileURI('my_file.txt') }}
```

### Data parsing helpers

- `fromJson()`
- `fromIon()`
- `yaml()`

Examples:

```twig
{{ fromJson('[1, 2, 3]')[0] }}
{{ yaml('foo: [666, 1, 2]').foo[0] }}
```

### Execution and workflow helpers

- `errorLogs()` for error summaries in alerts
- `currentEachOutput()` for simpler access to sibling outputs inside `ForEach`
- `tasksWithState()` to inspect tasks by state
- `appLink()` in Enterprise Edition to generate Kestra App URLs

### Utility helpers

- `max()`, `min()`
- `now()`
- `range()`
- `uuid()`
- `randomInt()`
- `randomPort()`
- `http()`
- `fileSize()`, `fileExists()`, `fileEmpty()`

## Most important functions in practice

### `render()`

Use `render()` when a variable itself contains Pebble and must be evaluated:

```twig
{{ render(namespace.github.token) }}
```

### `secret()`

Use `secret()` for sensitive values:

```twig
{{ secret('API_KEY') }}
```

### `currentEachOutput()`

Use it inside `ForEach` flows to avoid manual `taskrun.value` indexing:

```twig
{{ currentEachOutput(outputs.make_data).values.data }}
```

### `errorLogs()`

Useful for error notifications:

```twig
{{ errorLogs() }}
```

## Related pages

- Need variables like `inputs`, `outputs`, or `namespace`: [Execution Context Variables](../01.execution-context/index.md)
- Need filters like `date`, `default`, or `jq`: [Filter Reference](../03.filter-reference/index.md)
- Need complete examples for every function: [Full Reference](../99.full-reference/index.md#functions)
