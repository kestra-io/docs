---
title: Internal Storage FAQ
icon: /docs/icons/faq.svg
---

Common questions about the internal storage.

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
  - id: file
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
  - id: string_input
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
      FROM read_csv_auto('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv', header=True);
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

The same syntax applies to SQL queries, configuration files, and many more. Check the [Namespace Files](/docs/developer-guide/namespace-files) documentation for more details.

---

## How to read a file from the internal storage as a JSON object?

There is a [Pebble function](/docs/concepts/expression/function#json) called `{{ json(myvar) }}` and a [Pebble transformation filter](/docs/concepts/expression/filter/json) that you can apply using `{{ myvar | json }}`.

### The `json()` function

The function is used to convert a string to a JSON object. For example, the following Pebble expression will convert the string `{"foo": [666, 1, 2]}` to a JSON object and then return the first value of the `foo` key, which is `42`:

```yaml
{{ json('{"foo": [42, 43, 44]}').foo[0] }}
```

You can use the `read()` function to read the content of a file as a string and then apply the `json()` function to convert it to a JSON object. Afterwards, you can read the value of a specific key in that JSON object. For example, the following Pebble expression will read the content of a file named `my.json` and then return the value of the `foo` key, which is `42`:

```yaml
id: extract_json
namespace: dev
tasks:
  - id: extract
    type: io.kestra.plugin.fs.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/json/app_events.json

  - id: read_as_string
    type: io.kestra.core.tasks.log.Log
    message: "{{ read(outputs.extract.uri) }}"

  - id: read_as_json
    type: io.kestra.core.tasks.log.Log
    message: "{{ json(read(outputs.extract.uri)) }}"

  - id: parse_json_elements
    type: io.kestra.core.tasks.log.Log
    message: "{{ json(read(outputs.extract.uri)) | jq('map(.detail | fromjson | .message)') | first }}"
```

The above flow will download a JSON file via an HTTP Request, read its content as a string, convert it to a JSON object, and then in another task, it will parse the JSON object and return the value of a nested key.


### The `json` filter

You can use the `json` filter to convert any variable to a JSON string. You can think of it as a reverse process to what the `json()` function does.

The example below shows how you can convert a list of numbers to a JSON string `'[1, 2, 3]'` using the `| json` filter:

```yaml
{{ [1, 2, 3] | json }}
```

::alert{type="info"}
You typically would never used the `| json` filter in combination with the `read()` function. Anytime you need to read a file's content and then convert it to a JSON object, use a combination of the `read()` function and the `json()` function instead.
::
