---
title: Managing and Purging Flow Outputs
sidebarTitle: Flow Outputs
icon: /src/contents/docs/icons/best-practices.svg
description: Best practices for managing flow outputs in Kestra, including purging large files and handling conditional outputs efficiently.
---

Best practices for handling flow outputs, including purging large outputs and conditionally returning outputs.

## Handle flow outputs safely

When a flow can return different outputs depending on certain conditions, you can use an expression in the `outputs` section. This allows you to conditionally return the output of task `A` if it wasn’t skipped, or the output of task `B` otherwise.

```yaml
id: conditionallyReturnOutputs
namespace: company.team

inputs:
  - id: runTask
    type: BOOLEAN
    defaults: true

tasks:
  - id: taskA
    runIf: "{{ inputs.runTask }}"
    type: io.kestra.plugin.core.debug.Return
    format: Hello World!

  - id: taskB
    type: io.kestra.plugin.core.debug.Return
    format: Fallback output

outputs:
  - id: flowOutput
    type: STRING
    value: "{{ tasks.taskA.state != 'SKIPPED' ? outputs.taskA.value : outputs.taskB.value }}"
```

## Purging large output files

If a flow generates large output files that are not needed after execution, you can use the `io.kestra.plugin.core.storage.PurgeExecutionFiles` task to delete those files from internal storage.

In the example below, the flow downloads a large file from an HTTP API and uploads it to an S3 bucket. Once the file is uploaded, it’s no longer needed locally, so the `PurgeExecutionFiles` task is used to remove it from internal storage.

```yaml
id: extractLoadPurge
namespace: company.team

tasks:
  - id: extract
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: load
    type: io.kestra.plugin.aws.s3.Upload
    from: "{{ outputs.extractLargeFile.uri }}"
    bucket: myBucket
    key: largeFiles/orders.csv

  - id: purge
    type: io.kestra.plugin.core.storage.PurgeCurrentExecutionFiles
```
