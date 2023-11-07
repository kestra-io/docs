---
title: Internal Storage FAQ
---

## How to read a file from the internal storage as a string?

The 'read' function expects an argument 'path' that is a path to a namespace file or an internal storage URI. Note that when using inputs, outputs or trigger variables, you don't need any extra quotation marks. Here is how you can use such variables along with the 'read' function:
- `{{ read(inputs.file) }}` for a FILE-type input variable named `file`
- `{{ read(outputs.mytaskid.uri) }}` for an output `uri` from a task named `mytaskid`
- `{{ read(trigger.uri) }}` for a `uri` of many triggers incl. Kafka, AWS SQS, GCP PubSub, etc.
- `{{ read(trigger.objects | jq('.[].uri')) }}` for a `uri` of a trigger that returns a list of detected objects, e.g. AWS S3, GCP GCS, etc.

Note that the read function can only read files within the same execution. If you try to read a file from a previous execution, you will get an Unauthorized error.

### Example using a FILE-type inputs variable

```yaml
id: read_file_as_string
namespace: dev

inputs:
  - name: file
    type: FILE

tasks:
  - id: log_internal_storage_uri
    type: io.kestra.core.tasks.log.Log
    message: "{{ inputs.file }}"

  - id: log_file_content
    type: io.kestra.core.tasks.log.Log
    message: "{{ read(inputs.file) }}"
```

### Example with the `ForEachItem` task reading file's content as a string

When using the `ForEachItem` task, you can use the `read()` function to read the content of a file as a string. This is especially useful when you want to pass the content of a file as a raw string as an input to a subflow.


Here is a simple subflow example that uses a string input:

```yaml
id: subflow_raw_string_input
namespace: dev

inputs:
  - name: string_input
    type: STRING
    defaults: hey there

tasks:
  - id: for_each_item
    type: io.kestra.core.tasks.debugs.Return
    format: "{{ inputs.string_input }}"
```

Because the `ForEachItem` task splits the `items` file into batches of smaller files (by default, one file per row), you can use the `read()` function to read the content of that file for a given batch as a string value and pass it as an input to that subflow shown above.

```yaml
id: parent_flow
namespace: dev

tasks:
  - id: extract
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      INSTALL httpfs;
      LOAD httpfs;
      SELECT *
      FROM read_csv_auto('https://raw.githubusercontent.com/kestra-io/datasets/main/csv/orders.csv', header=True);
    store: true

  - id: each_raw
    type: io.kestra.core.tasks.flows.ForEachItem
    items: "{{ outputs.extract.uri }}"
    namespace: dev
    flowId: subflow_raw_string_input
    inputs:
      string_input: "{{ read(taskrun.items) }}"
```

---

## How to read a Namespace File as a string?

So far, you've seen how to read a file from the internal storage as a string. However, you can use the same `read()` function to read a Namespace File as a string. This is especially useful when you want to execute a Python script or a long SQL query stored in a dedicated SQL file.

The `read()` function takes the absolute path to the file you want to read. The path must point to a file stored in the **same namespace** as the flow you are executing.

Here is a simple example showing how you can read a file named `hello.py` stored in the `scripts` directory of the `dev` namespace:

```yaml
id: hello
namespace: dev

tasks:
  - id: my_python_script
    type: io.kestra.plugin.scripts.python.Script
    script: "{{ read('scripts/hello.py') }}"
```

The same syntax applies to SQL queries, configuration files, and many more. Check the [Namespace Files](../05.developer-guide/namespace-files.md) documentation for more details.

