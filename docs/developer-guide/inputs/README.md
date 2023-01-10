---
order: 3
---
# Inputs

Kestra's flow can be parameterized using inputs. Inputs will be available in variable context and can be used during the whole flow in order to customize it depending on the inputs values.

A good example is when an identifier is needed (ex: storeId, paymentId) in order to change the save path for an uploaded file.

## Declaring inputs

You can declare as many inputs as necessary for any flow. Inputs can be **required** or **not**.
If an input is required, the flow cannot start if the input is not provided during the creation of the execution.
Also, every input will be parsed during the creation of the execution and any invalid inputs will cause a refusal to create the execution.

::: warning
If the execution is **not created** due to invalid or missing inputs, no execution will be found on the executions list.
:::

Examples:
```yaml
id: my-flow
namespace: io.kestra.docs

inputs:
  - name: string
    type: STRING
  - name: optional
    type: STRING
    required: false
  - name: int
    type: INT
  - name: bool
    type: BOOLEAN
  - name: float
    type: FLOAT
  - name: instant
    type: DATETIME
  - name: date
    type: DATE
  - name: time
    type: TIME
  - name: duration
    type: DURATION
  - name: file
    type: FILE
  - name: optionalFile
    type: FILE
    required: false
  - name: instantDefaults
    type: DATETIME
    defaults: "2013-08-09T14:19:00Z"
  - name: json
    type: JSON
  - name: uri
    type: URI
    required: false
  - name: nested.string
    type: STRING
    required: false
  - name: nested.more.int
    type: INT
    required: false
  - name: nested.bool
    type: BOOLEAN
    required: false
```

## Input types
The available input types are as follows:

### `STRING`
No control is done on this input type (no parsing), can be any string.

### `INT`
Must be a valid integer (without any decimals).

### `FLOAT`
Must be a valid float (with any decimals).

### `BOOLEAN`
Must be a valid `true` or `false` as string.

### `DATETIME`
Must be a valid full [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) datetime with the timezone expressed in UTC from a text string such as
`2007-12-03T10:15:30.00Z`.

### `DATE`
Must be a valid full [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date without the timezone from a text string such as `2007-12-03`.

### `TIME`
Must be a valid full [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time without the timezone from a text string such as `10:15:30`.

### `DURATION`
Must be a valid full [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) duration from a text string such as `PT5M6S`.

### `FILE`
Must be a file sent with `multipart/form-data`. All the files are automatically uploaded to `Storage` and are available for further tasks. The return will be a fully qualified url with the form `kestra:///.../.../`. Kestra is able to handle this url and this input can be passed as is to tasks.

### `JSON`
Must be a valid JSON as string and will be converted to typed form.

### `URI`
Must be a valid URI and will be kept as a string.

## Input properties
These are the properties available for all input types :

### `name`
The input name to be used with vars <code v-pre>{{ inputs.my-name }}</code>.


### `required`
If the input is required. If required and no defaults value or no input provided, the execution will not be created.

### `defaults`
The default value if no input is provided. Must be a string.

### `description`
A markdown description in order to document the input.


## Nested Inputs

If you use a `.` inside the name of an input, the input will be nested. For example, when you declated the input with:
```yaml
  - name: nested.string
    type: STRING
    required: false
```
You can reach this input with: <code v-pre>{{ inputs.nested.string }}</code>. This is a convenient way to handle strong typing on input (with validation) without using raw JSON that will not be validated.


## Using input value in flow

Every input is available with dynamic variables such as: <code v-pre>{{ inputs.NAME }}</code>.

For example, if you declare your input :
```yaml
inputs:
  - name: my-file
    type: FILE
  - name: my-value
    type: STRING
    required: true
```

You can use the value of the inputs with <code v-pre>{{ inputs.my-value }}</code>.


## Send inputs programmatically
The flow `my-flow` above can be triggered programmatically. Here is an example with `curl`:
```bash
curl -v "http://kestra:8080/api/v1/executions/trigger/io.kestra.docs/my-flow" \
    -H "Transfer-Encoding:chunked" \
    -H "Content-Type:multipart/form-data" \
    -F string="a string"  \
    -F optional="an optionnal string"  \
    -F int=1  \
    -F float=1.255  \
    -F instant=2020-01-14T23:00:00.000Z \
    -F "files=@/tmp/128M.txt;filename=my-file"
```

All files must be sent in the form  of data `files` with a header `filename=my-file`, which will be the name of the input.

Here is an example with `python`:
```python
import io
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder

with open("/tmp/128M.txt", 'rb') as fh:
  url = f"http://kestra:8080/api/v1/executions/trigger/io.kestra.docs/my-flow"
  mp_encoder = MultipartEncoder(fields={
    "string": "a string",
    "optional": "an optionnal string",
    "int": 1,
    "float": 1.255,
    "instant": "2020-01-14T23:00:00.000Z",
    "files": ("file", fh, "text/plain")
  })
  result = requests.post(
      url,
      data=mp_encoder,
      headers={"Content-Type": mp_encoder.content_type},
  )
```

## Send inputs via the Web UI
With such a flow, the web UI lets you enter some inputs by generating a form accordingly in the flow > trigger view. The input form for the task above looks like below:

![Flow inputs](./assets/inputs.jpg)

Once the inputs are provided, you can trigger an execution flow that will run with [contextual inputs](../flow) as variables.
