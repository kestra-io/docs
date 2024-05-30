---
title: Output directory
icon: /docs/icons/dev.svg
---

If you want to generate files in your script to make them available for download and use in downstream tasks, you can leverage either the `outputFiles` property.

## Generating outputs from a script task using `outputFiles`

The `outputFiles` property allows to specify a list of files to be persisted in Kestra's internal storage. Here is an example:

```yaml
id: output_text_files
namespace: dev
tasks:
  - id: python_output
    type: io.kestra.plugin.scripts.python.Script
    runner: PROCESS
    outputFiles:
      - "*.txt"
    script: |
      f = open("myfile.txt", "a")
      f.write("Hi, this is output from a script 👋")
      f.close()

  - id: read_output
    type: io.kestra.plugin.scripts.shell.Commands
    runner: PROCESS
    commands:
      - cat {{outputs.python_output.outputFiles['myfile.txt']}}
```

Note how the `outputFiles` property is used to specify the list of files to be persisted in Kestra's internal storage. The `outputFiles` property supports [glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)).

The subsequent task can access the output file by leveraging the syntax `{{outputs.yourTaskId.outputFiles['yourFileName.fileExtension']}}`.

## Generating outputs from a script task using `{{outputDir}}`

::alert{type="info"}
From 0.17.0, `outputDir` has been depreciated. Use the `outputFiles` property instead.
::

This is an alternative to the `outputFiles` property. Files stored in the `outputDir` directory will be persisted in Kestra's internal storage. Here is an example:

```yaml
id: output_text_files
namespace: dev
tasks:
  - id: python_output
    type: io.kestra.plugin.scripts.python.Script
    runner: PROCESS
    script: |
      f = open("{{outputDir}}/myfile.txt", "a")
      f.write("Hi, this is output from a script 👋")
      f.close()

  - id: read_output
    type: io.kestra.plugin.scripts.shell.Commands
    runner: PROCESS
    commands:
      - cat {{outputs.python_output.outputFiles['myfile.txt']}}
```

The first task creates a file `'myfile.txt'` and the next task can access it by leveraging the syntax `{{outputs.yourTaskId.outputFiles['yourFileName.fileExtension']}}`.
