---
title: read
---

Read an internal storage file and return its content as a string. This function accepts one of the following:
1. A path to a [namespace file](../../namespace-files.md) e.g. `{{ read('myscript.py') }}` 
2. An internal storage URI e.g. `{{ read(inputs.myfile) }}` or `{{ read(outputs.extract.uri) }}`.

Reading namespace files is restricted to **files in the same namespace** as the flow using this function.

Reading internal storage files is restricted to the **current execution**. Specifically, those are files created by the current flow's execution or the parent flow execution (for flows triggered by a [Flow](https://kestra.io/plugins/core/tasks/flows/io.kestra.core.tasks.flows.flow) task or a [ForEachItem](https://kestra.io/plugins/core/tasks/flows/io.kestra.core.tasks.flows.foreachitem) task).

```twig
# Read a namespace file from the path `subdir/file.txt`
{{ read('subdir/file.txt') }}

# Read an internal storage file from the `uri` output of the `readFile` task
{{ read(outputs.readFile.uri) }}

# Read an internal storage file from an input named `file`
{{ read(inputs.file) }}
```