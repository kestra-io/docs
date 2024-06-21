---
title: YAML Filters
icon: /docs/icons/expression.svg
---

YAML filters are used to turn YAML strings into objects.

---

## yaml

This filter, added in [kestra 0.16.0](https://github.com/kestra-io/kestra/pull/3283), is used to parse a YAML string into an object. That object can then be transformed using Pebble templating engine.

The filter is useful when working with the [TemplatedTask](/plugins/tasks/templating/io.kestra.plugin.core.templating.TemplatedTask) added in [#3191](https://github.com/kestra-io/kestra/pull/3191).


```twig
{{ "foo: bar" | yaml }}
```

::collapse{title="Full workflow example using the filter in a templated task"}

```yaml
id: yaml_filter
namespace: company.team

labels:
  label: value

inputs:
  - name: string
    type: STRING
    required: false
    defaults: "string"

  - name: int
    type: INT
    required: false
    defaults: 123

  - name: bool
    type: BOOLEAN
    required: false
    defaults: true

  - name: float
    type: FLOAT
    required: false
    defaults: 1.23

  - name: instant
    type: DATETIME
    required: false
    defaults: "1918-02-24T01:02:03.04Z"

  - name: date
    type: DATE
    required: false
    defaults: "1991-08-20"

  - name: json
    type: JSON
    required: false
    defaults: |
      {
        "string": "string",
        "integer": 123,
        "float": 1.23,
        "boolean": false,
        "null": null,
        "object": {},
        "array": [
          "string",
          123,
          1.23,
          false,
          null,
          {},
          []
        ]
      }

  - name: uri
    type: URI
    required: false
    defaults: "https://kestra.io"

  - name: nested.object
    type: STRING
    required: false
    defaults: "value"

  - name: nested.object.child
    type: STRING
    required: false
    defaults: "value"

variables:
  string: "string"
  int: 123
  bool: true
  float: 1.23
  instant: "1918-02-24T00:00:00Z"
  date: "1991-08-20"
  time: "23:59:59"
  duration: "PT5M6S"
  json:
    string: string
    integer: 123
    float: 1.23
    boolean: false
    'null':
    object: {}
    array:
      - string
      - 123
      - 1.23
      - false
      -
      - {}
      - []
  uri: "https://kestra.io"
  object:
    key: "value"
    child:
      key: "value"
  array:
    - Value 1
    - Value 2
    - Value 3
  yaml: |
    string: string
    integer: 123
    float: 1.23
    boolean: false
    'null':
    object: {}
    array:
      - string
      - 123
      - 1.23
      - false
      -
      - {}
      - []

tasks:
  - id: yaml_filter
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ "string" | yaml }}
      {{ 1 | yaml }}
      {{ 1.123 | yaml }}
      {{ true | yaml }}
      {{ 1 | yaml }}
      {{ [1, true, "string", [0, false, "string"]] | yaml }}
      {{ {"key": "value", "object": {"a":"b"}} | yaml }}

  - id: yaml_kestra
    type: "io.kestra.plugin.core.log.Log"
    disabled: false
    message: |
      ---
      # flow
      {{ flow       ?? null | yaml }}
      ---
      # execution
      {{ execution ?? null | yaml }}
      ---
      # task
      {{ task      ?? null | yaml }}
      ---
      # taskrun
      {{ taskrun   ?? null | yaml }}
      ---
      # parent
      {{ parent    ?? null | yaml }}
      ---
      # parents
      {{ parents   ?? null | yaml }}
      ---
      # trigger
      {{ trigger   ?? null | yaml }}
      ---
      # vars
      {{ vars      ?? null | yaml }}
      ---
      # inputs
      {{ inputs    ?? null | yaml }}
      ---
      # outputs
      {{ outputs   ?? null | yaml }}
      ---
      # labels
      {{ labels    ?? null | yaml }}


  - id: yaml_function
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ yaml(vars.yaml) }}

  - id: yaml2yaml
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ yaml(vars.yaml) | yaml }}
```
::

---

## indent

When constructing YAML from multiple objects, this filter can apply indentation to strings, adding `amount` number of spaces before each line except for the first line.

The `prefix` property defines what is used to indent the lines. By default, prefix is `" "` (a space).

The syntax:

```twig
indent(amount, prefix=" ")
```

---

## nindent

Use `nindent` to add a new line (hence the `n` in `nindent`) before the code and then indent all lines by adding `amount` number of spaces before each line. The `amount` is a required property defining how many times prefix is repeated before each line.

The `prefix` property defines what is used to indent the lines. By default, prefix is `" "` (a space).

The syntax:

```twig
nindent(amount, prefix=" ")
```

::collapse{title="Full workflow example using the indent filter"}

```yaml
id: templated_task
namespace: company.team

labels:
  my-label: "will-be-sent-to-k8s"
  other-label: "value"

inputs:
  # using nested inputs to define types and default values for `resources` object
  - name: resources.limits.cpu
    type: STRING
    defaults: "1"
    required: true

  - name: resources.limits.memory
    type: STRING
    defaults: "1000Mi"
    required: true

  - name: resources.requests.cpu
    type: STRING
    required: false # optional; it can be skipped when running the flow

  - name: resources.requests.memory
    type: STRING
    required: false # optional; it can be skipped when running the flow

# using variables to explicitly define lists
variables:
  env: # is presented as a list of objects
    - name: "var_string"
      value: "VALUE"
    - name: "var_int"
      value: 123

tasks:
  - id: dynamic
    type: io.kestra.plugin.core.templating.TemplatedTask
    spec: |
      id: "{{ flow.namespace | slugify }}-{{ flow.id | slugify }}"
      type: io.kestra.plugin.kubernetes.PodCreate
      namespace: kestra
      metadata:
        labels:
          {{ labels | yaml | indent(4) }} # indenting from the next line, 4 spaces here
      spec:
        containers:
        - name: debug
          image: alpine:latest
          env: {{ variables.env | yaml | indent(6) }} # adding a newline and indenting at 6 spaces
          command:
            - 'bash'
            - '-c'
            - 'printenv'
        resources:
          {{ inputs.resources | yaml | indent(2, "  ") }} # indenting from the next line by 2 times "  " (two spaces)
```
::


::collapse{title="Sample code for testing the indent filter"}

```yaml
id: indent_filter
namespace: company.team

labels:
  label: value

inputs:
  - id: string
    type: STRING
    required: false
    defaults: "string"

  - id: int
    type: INT
    required: false
    defaults: 123

  - id: bool
    type: BOOLEAN
    required: false
    defaults: true

  - id: float
    type: FLOAT
    required: false
    defaults: 1.23

  - id: instant
    type: DATETIME
    required: false
    defaults: "1918-02-24T01:02:03.04Z"

  - id: date
    type: DATE
    required: false
    defaults: "1991-08-20"

  - id: json
    type: JSON
    required: false
    defaults: |
      {
        "string": "string",
        "integer": 123,
        "float": 1.23,
        "boolean": false,
        "null": null,
        "object": {},
        "array": [
          "string",
          123,
          1.23,
          false,
          null,
          {},
          []
        ]
      }

  - id: uri
    type: URI
    required: false
    defaults: "https://kestra.io"

variables:
  inputEmptyLines: "\n\n"
  inputString: 'string'
  inputInteger: 1
  inputStringWithCRLF: "first line\r\nsecond line"
  inputStringWithLF: "first line\nsecond line"
  inputStringWithCR: "first line\rsecond line"
  inputWithTab: "first line\nsecond line"

  indentEmptyLines: "\n  \n  "
  indentString: "string"
  indentInteger: "1"
  indentStringWithCRLF: "first line\r\n  second line"
  indentStringWithLF: "first line\n  second line"
  indentStringWithCR: "first line\r  second line"
  indentWithTab: "first line\n\t\tsecond line"

tasks:
  - id: debug
    description: "Debug task run"
    type: "io.kestra.plugin.core.log.Log"
    level: INFO
    message: |
      {
        "flow"      : {{ flow      ?? 'null' }},
        "execution" : {{ execution ?? 'null' }},
        "task"      : {{ task      ?? 'null' }},
        "taskrun"   : {{ taskrun   ?? 'null' }},
        "parent"    : {{ parent    ?? 'null' }},
        "parents"   : {{ parents   ?? 'null' }},
        "trigger"   : {{ trigger   ?? 'null' }},
        "vars"      : {{ vars      ?? 'null' }},
        "inputs"    : {{ inputs    ?? 'null' }},
        "outputs"   : {{ outputs   ?? 'null' }},
        "labels"    : {{ labels    ?? 'null' }}
      }

  - id: inputs-string
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.string | indent(2)) == "" + inputs.string  }} - {{ inputs.string | indent(2) }}

  - id: inputs-int
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.int | indent(2)) == "" + inputs.int  }} - {{ inputs.int | indent(2) }}

  - id: inputs-bool
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.bool | indent(2)) == "" + inputs.bool  }} - {{ inputs.bool | indent(2) }}

  - id: inputs-float
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.float | indent(2)) == "" + inputs.float  }} - {{ inputs.float | indent(2) }}

  - id: inputs-instant
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.instant | indent(2)) == "" + inputs.instant  }} - {{ inputs.instant | indent(2) }}

  - id: inputs-date
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.date | indent(2)) == "" + inputs.date  }} - {{ inputs.date | indent(2) }}

  - id: inputs-json
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.json | indent(2)) == "" + inputs.json  }} - {{ inputs.json | indent(2) }}

  - id: inputs-uri
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.uri | indent(2)) == "" + inputs.uri  }} - {{ inputs.uri | indent(2) }}

  - id: variables-inputNull
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (null | indent(2)) == "" }} - {{ (null | indent(2)) }}

  - id: variables-inputEmpty
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ ("" | indent(2)) == "" }} - {{ ("" | indent(2)) }}

  - id: variables-inputEmptyLines
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputEmptyLines | indent(2)) == vars.indentEmptyLines }} - {{ (vars.inputEmptyLines | indent(2)) }}

  - id: variables-inputString
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputString | indent(2)) == vars.indentString }} - {{ (vars.inputString | indent(2)) }}

  - id: variables-inputInteger
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputInteger | indent(2)) == vars.indentInteger }} - {{ (vars.inputInteger | indent(2)) }}

  - id: variables-inputStringWithCRLF
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithCRLF | indent(2)) == vars.indentStringWithCRLF }} - {{ (vars.inputStringWithCRLF | indent(2)) }}

  - id: variables-inputStringWithLF
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithLF | indent(2)) == vars.indentStringWithLF }} - {{ (vars.inputStringWithLF | indent(2)) }}

  - id: variables-inputStringWithCR
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithCR | indent(2)) == vars.indentStringWithCR }} - {{ (vars.inputStringWithCR | indent(2)) }}

  - id: variables-inputWithTab
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputWithTab | indent(2)) == vars.indentWithTab }} - {{ (vars.inputWithTab | indent(2, "\t")) }}
```
::

::collapse{title="Sample code for testing the nindent filter"}

```yaml
id: nindent_filter
namespace: company.team

labels:
  label: value

inputs:
  - id: string
    type: STRING
    required: false
    defaults: "string"

  - id: int
    type: INT
    required: false
    defaults: 123

  - id: bool
    type: BOOLEAN
    required: false
    defaults: true

  - id: float
    type: FLOAT
    required: false
    defaults: 1.23

  - id: instant
    type: DATETIME
    required: false
    defaults: "1918-02-24T01:02:03.04Z"

  - id: date
    type: DATE
    required: false
    defaults: "1991-08-20"

  - id: json
    type: JSON
    required: false
    defaults: |
      {
        "string": "string",
        "integer": 123,
        "float": 1.23,
        "boolean": false,
        "null": null,
        "object": {},
        "array": [
          "string",
          123,
          1.23,
          false,
          null,
          {},
          []
        ]
      }

  - id: uri
    type: URI
    required: false
    defaults: "https://kestra.io"

variables:
  inputEmptyLines: "\n\n"
  inputString: 'string'
  inputInteger: 1
  inputStringWithCRLF: "first line\r\nsecond line"
  inputStringWithLF: "first line\nsecond line"
  inputStringWithCR: "first line\rsecond line"
  inputWithTab: "first line\nsecond line"

  nindentEmptyLines: "\n  \n  \n  "
  nindentString: "\n  string"
  nindentInteger: "\n  1"
  nindentStringWithCRLF: "\r\n  first line\r\n  second line"
  nindentStringWithLF: "\n  first line\n  second line"
  nindentStringWithCR: "\r  first line\r  second line"
  nindentWithTab: "\n\t\tfirst line\n\t\tsecond line"


tasks:
  - id: debug
    description: "Debug task run"
    type: "io.kestra.plugin.core.log.Log"
    level: INFO
    # disabled: true
    message: |
      {
        "flow"      : {{ flow      ?? 'null' }},
        "execution" : {{ execution ?? 'null' }},
        "task"      : {{ task      ?? 'null' }},
        "taskrun"   : {{ taskrun   ?? 'null' }},
        "parent"    : {{ parent    ?? 'null' }},
        "parents"   : {{ parents   ?? 'null' }},
        "trigger"   : {{ trigger   ?? 'null' }},
        "vars"      : {{ vars      ?? 'null' }},
        "inputs"    : {{ inputs    ?? 'null' }},
        "outputs"   : {{ outputs   ?? 'null' }},
        "labels"    : {{ labels    ?? 'null' }}
      }

  - id: inputs-string
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.string | nindent(2)) == "" + inputs.string  }} - {{ inputs.string | nindent(2) }}

  - id: inputs-int
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.int | nindent(2)) == "" + inputs.int  }} - {{ inputs.int | nindent(2) }}

  - id: inputs-bool
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.bool | nindent(2)) == "" + inputs.bool  }} - {{ inputs.bool | nindent(2) }}

  - id: inputs-float
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.float | nindent(2)) == "" + inputs.float  }} - {{ inputs.float | nindent(2) }}

  - id: inputs-instant
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.instant | nindent(2)) == "" + inputs.instant  }} - {{ inputs.instant | nindent(2) }}

  - id: inputs-date
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.date | nindent(2)) == "" + inputs.date  }} - {{ inputs.date | nindent(2) }}

  - id: inputs-json
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.json | nindent(2)) == "" + inputs.json  }} - {{ inputs.json | nindent(2) }}

  - id: inputs-uri
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (inputs.uri | nindent(2)) == "" + inputs.uri  }} - {{ inputs.uri | nindent(2) }}

  - id: variables-inputNull
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (null | nindent(2)) == "" }} - {{ (null | nindent(2)) }}

  - id: variables-inputEmpty
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ ("" | nindent(2)) == "" }} - {{ ("" | nindent(2)) }}

  - id: variables-inputEmptyLines
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputEmptyLines | nindent(2)) == vars.nindentEmptyLines }} - {{ (vars.inputEmptyLines | nindent(2)) }}

  - id: variables-inputString
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputString | nindent(2)) == vars.nindentString }} - {{ (vars.inputString | nindent(2)) }}

  - id: variables-inputInteger
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputInteger | nindent(2)) == vars.nindentInteger }} - {{ (vars.inputInteger | nindent(2)) }}

  - id: variables-inputStringWithCRLF
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithCRLF | nindent(2)) == vars.nindentStringWithCRLF }} - {{ (vars.inputStringWithCRLF | nindent(2)) }}

  - id: variables-inputStringWithLF
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithLF | nindent(2)) == vars.nindentStringWithLF }} - {{ (vars.inputStringWithLF | nindent(2)) }}

  - id: variables-inputStringWithCR
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputStringWithCR | nindent(2)) == vars.nindentStringWithCR }} - {{ (vars.inputStringWithCR | nindent(2)) }}

  - id: variables-inputWithTab
    type: "io.kestra.plugin.core.log.Log"
    message: |
      {{ (vars.inputWithTab | nindent(2)) == vars.nindentWithTab }} - {{ (vars.inputWithTab | nindent(2, "\t")) }}
```
::