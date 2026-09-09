---
title: "Execution Context in Scripts: Read Metadata as Data"
h1: Read the Execution Context from Your Scripts
sidebarTitle: Execution Context
icon: /src/contents/docs/icons/dev.svg
description: Read inputs, outputs, labels and variables inside a script from a JSON file instead of interpolating Pebble expressions into your code.
---

Read the execution metadata from inside your script.

## Why read the context as data

A script task can reach the execution metadata through Pebble expressions:

```python
csv_path = "{{ outputs.extract.uri }}"
```

That works, but the expression is not valid Python, so a script kept as a [Namespace File](/docs/concepts/namespace-files) and edited in an IDE fails linting. It also mixes orchestration into business logic, and it breaks outright when a value contains a quote or a newline, because the value is pasted into your source before the interpreter sees it.

Setting `executionContext: true` writes the same metadata to a `.kestra-execution-context.json` file in the task working directory, so your script reads it as data and stays plain, valid code:

```python
from kestra import context

csv_path = context.outputs.extract.uri
```

## Enable the execution context

Add `executionContext: true` to any script task:

```yaml
id: execution_context
namespace: company.team

inputs:
  - id: dataset
    type: STRING
    defaults: products

labels:
  env: prod

variables:
  threshold: 42

tasks:
  - id: extract
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: transform
    type: io.kestra.plugin.scripts.python.Script
    executionContext: true
    beforeCommands:
      - pip install kestra pandas
    inputFiles:
      orders.csv: "{{ outputs.extract.uri }}"
    script: |
      import pandas as pd
      from kestra import context

      df = pd.read_csv("orders.csv")

      print(f"dataset: {context.inputs.dataset}")
      print(f"environment: {context.labels.env}")
      print(f"threshold: {context.vars.threshold}")
      print(f"internal storage URI: {context.outputs.extract.uri}")
      print(f"rows: {len(df)}")
```

Note that the context gives you the *metadata* of a previous task, including its `kestra:///` internal storage URI. To read the file itself, map it into the working directory with [`inputFiles`](/docs/scripts/input-output-files) as above — a `kestra:///` URI is not a path your script can open directly.

The property is available on every script task, so `Python`, `Node.js`, `Shell`, `Powershell`, `R`, `Julia`, `Ruby`, `Go`, `Groovy`, `PHP`, `Perl`, `Lua`, `Deno`, `Bun`, `.NET` and `JBang` all accept it, with every task runner.

## What the context contains

The file holds the same variables your flow can render with Pebble, as a single JSON object:

| Key | Contents |
| --- | --- |
| `inputs` | The execution inputs |
| `outputs` | Outputs of the tasks that already ran |
| `labels` | Execution labels |
| `vars` | Flow variables |
| `trigger` | Trigger metadata, on a triggered execution |
| `flow`, `execution`, `task`, `taskrun` | Identifiers, state and dates |

Two variables are left out on purpose: `envs` and `globals`. Both already reach your script as environment variables, so read them with `os.environ` instead.

## Read the context from Python

The [`kestra` Python package](https://pypi.org/project/kestra/) exposes the file as a `context` object. Attributes traverse to any depth, including objects nested in lists:

```python
from kestra import context

my_labels = context.labels
start_date = context.trigger.startDate
csv_path = context.outputs.extract.uri
first_file = context.inputs.files[0].name
```

`context` is a read-only mapping, so `len()`, `in`, iteration, `keys()`, `values()`, `items()` and `dict(context)` all behave as expected. Use the bracket form for keys that are not valid Python identifiers, or that collide with one of those method names:

```python
context["items"]                      # a key literally named "items"
context.get("optional_key", "fallback")
context.to_dict()                     # the raw dict, ready for json.dumps
```

Reading a key that is not there raises an `AttributeError` listing what is available, and the context is loaded lazily, so `import kestra` still works in a script that runs outside of Kestra. Reaching for `context` there raises a `FileNotFoundError`.

## Read the context from another language

The context is a plain JSON file, so any language can read it without a Kestra client:

```javascript
const fs = require('fs');

const context = JSON.parse(fs.readFileSync('.kestra-execution-context.json', 'utf8'));

console.log(context.outputs.extract.uri);
```

## Secrets and lifecycle

The file contains the values your task could already render, and that includes inputs of type `SECRET` in plaintext. Two guardrails follow from that:

- The file name is reserved, and never collected by your patterns. An `outputFiles: ["*"]` glob, a `WorkingDirectory` `cache.patterns: ["**"]`, or an `UploadFiles` task will not pick it up, so it cannot reach internal storage.
- The file is removed once the task's commands are done, so a later task in the same [Working Directory](/docs/scripts/working-directory) never inherits another task's context.

`executionContext` is disabled by default for the same reason — writing the metadata to disk stays an explicit choice.
