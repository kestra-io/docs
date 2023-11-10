---
title: read
---

The `read` function will read an internal storage file and render it as a string.
It currently can read [namespace files](../../namespace-files.md) by their name or an internal storage files by their URI.

Reading namespace files is restricted to files in the flow namespace.
Reading internal storage files is restricted to files created by the flow execution or the parent flow execution (for flows triggered by a [Flow](https://kestra.io/plugins/core/tasks/flows/io.kestra.core.tasks.flows.flow) task or a [ForEachItem](https://kestra.io/plugins/core/tasks/flows/io.kestra.core.tasks.flows.foreachitem) task).

```twig
# Read a namespace file of path `/subdir/file.txt`.
{{ read('/subdir/file.txt') }}
# Read an internal storage file from the `uri` output of the `readFile` task.
{{ read(outputs.readFile.uri) }}
# Read an internal storage file from an input named `file`.
{{ read(inputs.file) }}
```