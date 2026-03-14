---
title: Kestra Function Reference – render, secret, read, and More
description: Reference guide to the main functions available in Kestra expressions, including rendering, secrets, file access, debugging, and utility helpers.
sidebarTitle: Function Reference
icon: /src/contents/docs/icons/expression.svg
---

Use functions when you need to generate or retrieve a value dynamically with syntax such as `{{ functionName(...) }}`.

## Common function groups

Functions are best thought of as helpers that either fetch something, compute something, or force evaluation behavior that plain variables and filters cannot provide on their own.

### Rendering and debugging

This group matters when expressions stop behaving the way you expect. `render()` and `printContext()` are often the quickest way to understand whether a value is missing, nested, or still just a string.

- `render()` evaluates nested Pebble expressions
- `renderOnce()` renders a value only once
- `printContext()` outputs the full available context for debugging

Examples:

```twig
{{ render("{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}") }}
{{ printContext() }}
```

### Secrets and file access

These functions bridge expressions to external or stored data. Use them when the value is not already present in the execution context and must be resolved at runtime.

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

These helpers are most useful when a task output is still a serialized string and you want to treat it like structured data in later expressions.

- `fromJson()`
- `fromIon()`
- `yaml()`

Examples:

```twig
{{ fromJson('[1, 2, 3]')[0] }}
{{ yaml('foo: [666, 1, 2]').foo[0] }}
```

### Execution and workflow helpers

This group is more situational, but it becomes valuable in complex flows where you need to inspect sibling results, build links back into Kestra, or summarize failures.

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

If you only remember a few functions, remember the ones below. They are the ones most likely to change how you model a real flow.

### `render()`

Use `render()` when a variable itself contains Pebble and must be evaluated:

```twig
{{ render(namespace.github.token) }}
```

Without `render()`, namespace or flow variables that contain Pebble are treated as plain strings.

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

### Other frequently useful helpers

```twig
{{ max(user.score, highscore) }}
{{ min(user.score, lowScore) }}
{{ now() }}
{{ range(0, 8, 2) }}
{{ uuid() }}
{{ randomInt(1, 10) }}
```

## Related pages

- Need variables like `inputs`, `outputs`, or `namespace`: [Execution Context Variables](../01.execution-context/index.md)
- Need filters like `date`, `default`, or `jq`: [Filter Reference](../03.filter-reference/index.md)
- Need complete examples for every function: [Full Reference](../99.full-reference/index.md#functions)
