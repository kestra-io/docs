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

`renderOnce()` is the safer choice when you need one extra evaluation pass but do not want recursive expansion to keep walking nested Pebble content.

### Secrets and file access

These functions bridge expressions to external or stored data. Use them when the value is not already present in the execution context and must be resolved at runtime.

- `secret()` reads a secret from Kestra's secret backend
- `credential()` reads a short-lived token from a managed EE credential
- `read()` reads the contents of a namespace file or internal-storage file
- `fileURI()` resolves a namespace file URI

Examples:

```twig
{{ secret('GITHUB_ACCESS_TOKEN') }}
{{ credential('my_oauth') }}
{{ read('subdir/file.txt') }}
{{ fileURI('my_file.txt') }}
```

`read()` accepts both namespace files and internal-storage URIs, which makes it useful after download or transformation tasks that write files as outputs.

### Data parsing helpers

These helpers are most useful when a task output is still a serialized string and you want to treat it like structured data in later expressions.

- `fromJson()`
- `fromIon()`
- `yaml()`

Examples:

```twig
{{ fromJson('[1, 2, 3]')[0] }}
{{ fromIon(read(outputs.serialize.uri)).someField }}
{{ yaml('foo: [666, 1, 2]').foo[0] }}
```

### Execution and workflow helpers

This group is more situational, but it becomes valuable in complex flows where you need to inspect sibling results, build links back into Kestra, or summarize failures.

- `errorLogs()` for error summaries in alerts
- `currentEachOutput()` for simpler access to sibling outputs inside `ForEach`
- `iterationOutput()` to read outputs from previous or explicit `ForEach` iterations
- `tasksWithState()` to inspect tasks by state
- `appLink()` in Enterprise Edition to generate Kestra App URLs

### Utility helpers

- `now()` — returns the current datetime; accepts a `timeZone` argument: `now(timeZone="Europe/Paris")`
- `max(a, b, ...)` — returns the largest of its arguments
- `min(a, b, ...)` — returns the smallest of its arguments
- `range(start, end)` or `range(start, end, step)` — generates a list of integers up to and including `end`; the step defaults to 1
- `uuid()` — generates a UUID in URL-safe base62 encoding; useful for unique identifiers in task inputs
- `randomInt(min, max)` — generates a random integer; the upper bound is **excluded**
- `randomPort()` — picks an available local port; useful in test or dev container flows
- `http(uri, ...)` — fetches a remote payload directly from an expression
- `fileSize(uri)` — returns the size in bytes of a file from internal storage
- `fileExists(uri)` — returns `true` if the file exists
- `fileEmpty(uri)` — returns `true` if the file has no content

### Template inheritance helpers

These are less common than runtime-oriented helpers, but they matter when you are using Pebble blocks and template inheritance directly.

#### `block()`

`block()` renders the contents of a named block multiple times. It is different from the Pebble `block` tag, which declares the block:

```twig
{% block "post" %}content{% endblock %}

{{ block("post") }}
```

#### `parent()`

Use `parent()` inside an overriding block to include the original block content from the parent template:

```twig
{% extends "parent.peb" %}

{% block "content" %}
child content
{{ parent() }}
{% endblock %}
```

## Common function patterns

The functions below are the ones most likely to shape a real flow. This section focuses on the practical cases where they change how you write expressions, not just what they do in isolation.

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

### `credential()`

In Enterprise Edition, use `credential()` to inject a short-lived token from a managed credential:

```twig
{{ credential('my_oauth') }}
```

Use [Execution Context Variables](../01.execution-context/index.md) for the setup model and a fuller HTTP example. `credential()` returns the token only, while the credential definition itself is managed in the Kestra UI.

### `currentEachOutput()`

Use it inside `ForEach` flows to avoid manual `taskrun.value` indexing:

```twig
{{ currentEachOutput(outputs.make_data).values.data }}
```

### `iterationOutput()`

Use `iterationOutput()` inside `ForEach` when the current iteration depends on work completed in an earlier loop index:

```twig
{{ iterationOutput() }}
{{ iterationOutput('prefix_sum', taskrun.iteration - 1) }}
```

Defaulting behavior:

- `iterationOutput()` uses the current task and the previous iteration
- `iterationOutput('taskId')` uses the provided task and the previous iteration
- `iterationOutput(null, 2)` uses the current task and iteration `2`
- `iterationOutput('taskId', null)` uses the provided task and the previous iteration

Guard the first iteration explicitly, because there is no previous iteration to read when `taskrun.iteration == 0`.

### `errorLogs()`

Prints all error logs from the current execution:

```twig
{{ errorLogs() }}
```

It is most useful in `errors` blocks, where you need a compact summary of what failed without manually traversing task state objects.

### `fromIon()`

Use `fromIon()` when a previous task or serializer produces Ion rather than JSON:

```twig
{{ fromIon(read(outputs.serialize.uri)).someField }}
```

### `read()`

`read()` is the simplest way to turn a file URI back into inline content for a later expression:

```twig
{{ read(outputs.someTask.uri) }}
```

### `renderOnce()`

Equivalent to `render(expression, recursive=false)`:

```twig
{{ renderOnce(namespace.github.token) }}
```

### Numeric and generation helpers

```twig
{{ max(5, 10, 15) }}
{# output: 15 #}
{{ min(5, 10, 15) }}
{# output: 5 #}
{{ now() }}
{{ now(timeZone="Europe/Paris") }}
{{ range(0, 3) }}
{# output: [0, 1, 2, 3] #}
{{ range(0, 6, 2) }}
{# output: [0, 2, 4, 6] #}
{{ uuid() }}
{{ randomInt(1, 10) }}
{# generates a random integer from 1 to 9 (10 is excluded) #}
```

### File and runtime helpers

These helpers are usually used in operational flows rather than day-to-day templating:

```twig
{{ randomPort() }}
{{ fileSize(outputs.download.uri) }}
{{ fileExists(outputs.download.uri) }}
{{ fileEmpty(outputs.download.uri) }}
{{ tasksWithState('failed') }}
```

### `http()`

`http()` lets an expression fetch a remote payload directly:

```twig
{{ http(uri = 'https://dummyjson.com/products/categories') | jq('.[].slug') }}
```

Use it sparingly. It is convenient for dynamic dropdowns and lightweight lookups, but task-level HTTP calls are usually easier to observe and retry.

### `isIn()`

Use `isIn()` for conditions where one value must be tested against a short allowlist:

```twig
{{ execution.state isIn ['SUCCESS', 'KILLED', 'CANCELLED'] }}
```

That reads more clearly than chaining multiple equality checks in `runIf`, SLAs, or alert conditions.

### `appLink()`

Enterprise Edition's `appLink()` builds links back to Kestra Apps:

```twig
{{ appLink(appId='com.example.my-app') }}
{{ appLink(baseUrl=true) }}
```

Use it in notifications when you want recipients to jump directly into the related app rather than the generic flow UI.

## Worked example

This flow uses several runtime functions together: `now()` for a timestamp, `uuid()` for a unique run identifier, `secret()` for a credential, and `render()` to evaluate a namespace variable containing Pebble:

```yaml
id: function_reference_example
namespace: company.team

tasks:
  - id: log_context
    type: io.kestra.plugin.core.log.Log
    message:
      - "Run ID: {{ uuid() }}"
      - "Started at: {{ now() | date('yyyy-MM-dd HH:mm:ss') }}"
      - "API key: {{ secret('MY_API_KEY') }}"
      - "Config value: {{ render(namespace.my_config) }}"

  - id: check_file
    type: io.kestra.plugin.core.log.Log
    message: |
      File exists: {{ fileExists(outputs.log_context.uri) }}
      File size: {{ fileSize(outputs.log_context.uri) }} bytes
```

## Related pages

- Need variables like `inputs`, `outputs`, or `namespace`: [Execution Context Variables](../01.execution-context/index.md)
- Need filters like `date`, `default`, or `jq`: [Filter Reference](../03.filter-reference/index.md)
- Need Pebble syntax and nested rendering patterns: [Pebble Syntax](../02.pebble-syntax/index.md)
