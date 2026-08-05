---
title: "Workflow Inputs in Kestra: Declare and Pass Parameters"
h1: Make Flows Dynamic with Typed Inputs and Runtime Parameters
description: Make your Kestra flows dynamic with Inputs. Learn to declare typed inputs, validate values, and pass parameters at runtime for flexible workflow execution.
icon: /src/contents/docs/icons/flow.svg
sidebarTitle: Inputs
---

Inputs are typed, validated parameters passed to a flow at execution time.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/peQvnhaspyQ?si=gcZxTX5KF2dC7ZLO" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

Flow inputs are stored in the execution context and accessed with `{{ inputs.parameter_name }}`. All inputs are validated when the execution is created — invalid or missing required inputs prevent the execution from being created and it will not appear in the executions list.

## Declaring inputs

Inputs are declared under the `inputs` key. Each input requires an `id` and a `type`. Inputs are required by default; set `required: false` to make one optional.

```yaml
id: inputs_demo
namespace: company.team

inputs:
  - id: username
    type: STRING
    defaults: "alice"
    description: The user to greet.

  - id: threshold
    type: INT
    min: 1
    max: 100

  - id: environment
    type: SELECT
    values:
      - dev
      - staging
      - prod
    defaults: dev

  - id: config_file
    type: FILE
    allowedFileExtensions: [".json", ".yaml"]

  - id: optional_note
    type: STRING
    required: false

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "Hello {{ inputs.username }} — deploying to {{ inputs.environment }}"
```

## Input types

Inputs are strongly typed and validated before execution starts.

| Type | Accepts | Constraints & extra properties |
|---|---|---|
| `STRING` | Any string | `validator` (regex) |
| `INT` | Integer | `min`, `max` |
| `FLOAT` | Float | `min`, `max` |
| `BOOL` | `true` or `false` | — |
| `DATETIME` | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) datetime in UTC — e.g. `2042-04-02T04:20:42.000Z` | `after`, `before` |
| `DATE` | ISO 8601 date without timezone — e.g. `2042-12-03` | `after`, `before` |
| `TIME` | ISO 8601 time without timezone — e.g. `10:15:30` | `after`, `before` |
| `DURATION` | ISO 8601 duration — e.g. `PT5M6S` | `min`, `max` |
| `SELECT` | One value from a predefined list | `values`, `expression`, `allowCustomValue`, `autoSelectFirst` |
| `MULTISELECT` | One or more values from a predefined list | Same as `SELECT` |
| `FILE` | Uploaded file, `nsfile:///` (namespace file), or `file:///` (local allowed path) | `allowedFileExtensions`; stored in [internal storage](../../08.architecture/data-components/index.md#internal-storage) |
| `JSON` | Valid JSON string | `jsonSchema` (JSON Schema Draft 2020-12) |
| `YAML` | Valid YAML string | — |
| `URI` | Valid URI, kept as a string | — |
| `SECRET` | Encrypted string, decrypted at runtime and masked in UI and logs | `validator` (regex); requires [encryption key](../../configuration/05.security-and-secrets/index.md) |
| `ARRAY` | JSON array or YAML list | `itemType` (required) |
| `FORM` | Groups child inputs as a multi-step wizard in the Execute modal | Cannot nest; no `defaults`/`prefill` on the FORM itself |
| `REUSABLE_INPUTS` | References a namespace-level named input group (Enterprise Edition) | See [Reusable Inputs](../22.reusable-inputs/index.md) |

:::alert{type="info"}
Due to [YAML's scalar formats](https://yaml.org/spec/1.1/current.html#id864510), `yes`/`no` may be parsed as booleans. Wrap them in quotes when using them as `SELECT` values: `"Yes"`, `"No"`.
:::

:::alert{type="info"}
`FILE` defaults use the universal file protocol: `nsfile:///` for namespace files, `file:///` for local files from an explicitly allowed path. Configure allowed paths under `kestra.local-files.allowed-paths` in your Kestra configuration.
:::

## Input properties

| Property | Description |
|---|---|
| `id` | Identifier used to reference the input — e.g. `{{ inputs.user }}`. |
| `type` | Data type, as listed above. |
| `required` | Whether the input is required. Defaults to `true`. |
| `defaults` | Default value applied when no value is provided at runtime. |
| `prefill` | Initial value shown in the UI that can be cleared to `null`. Unlike `defaults`, a cleared prefill resolves to `null`. |
| `displayName` | Label shown in the UI instead of the `id`. |
| `description` | Markdown description displayed in the UI. |
| `validator` | Regex pattern for `STRING` and `SECRET` types. |
| `expression` | Pebble expression used to populate `SELECT` and `MULTISELECT` values dynamically — e.g. `{{ kv('MY_LIST') }}`. |
| `dependsOn` | Makes this input conditional on other inputs being provided or matching a `condition`. |
| `autoSelectFirst` | Auto-selects the first value in `SELECT`/`MULTISELECT` lists as the default. |

## Input validation

### Type constraints

`INT`, `FLOAT`, and `DURATION` accept `min` and `max`. `DATE`, `TIME`, and `DATETIME` accept `after` and `before`. `STRING` and `SECRET` accept a `validator` regex.

```yaml
inputs:
  - id: age
    type: INT
    min: 18
    max: 64

  - id: username
    type: STRING
    validator: ^[a-z0-9_]{3,20}$

  - id: start_date
    type: DATE
    after: "2024-01-01"
    before: "2025-01-01"
```

### JSON Schema validation

Use the `jsonSchema` property to validate a `JSON` input against a schema at execution time. An invalid payload rejects the execution before any task runs:

```yaml
id: json_schema_validation
namespace: company.team

inputs:
  - id: payload
    type: JSON
    jsonSchema: |
      {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "required": ["name"],
        "properties": {
          "name": { "type": "string" }
        },
        "additionalProperties": false
      }

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "Hello, {{ inputs.payload.name }}!"
```

## Nested inputs

Use `.` in an input `id` to create a nested structure, accessible with the same dot notation in expressions:

```yaml
inputs:
  - id: db.host
    type: STRING
    defaults: localhost

  - id: db.port
    type: INT
    defaults: 5432

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "Connecting to {{ inputs.db.host }}:{{ inputs.db.port }}"
```

## FORM inputs

`FORM` groups related inputs under a shared label and renders a multi-step wizard in the Execute modal:

```yaml
id: provision_environment
namespace: company.team

inputs:
  - id: requester
    type: STRING
    required: true

  - id: environment
    type: FORM
    displayName: Environment setup
    description: Where the environment runs and what size it needs.
    inputs:
      - id: region
        type: SELECT
        defaults: eu-central-1
        values:
          - eu-central-1
          - eu-west-1
          - us-east-1

      - id: instance_type
        type: SELECT
        defaults: t3.medium
        values:
          - t3.medium
          - t3.large
          - t3.xlarge

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: |
      Requester: {{ inputs.requester }}
      Region: {{ inputs.environment.region }}
      Instance: {{ inputs.environment.instance_type }}
```

:::alert{type="warning"}
A FORM cannot contain another FORM. `defaults` and `prefill` belong on individual child inputs, not on the FORM itself.
:::

When triggering a flow with FORM inputs via the API, use flat dotted field names:

```bash
curl -X POST "http://localhost:8080/api/v1/main/executions/company.team/provision_environment" \
  -H "Content-Type: multipart/form-data" \
  -F "requester=platform-team" \
  -F "environment.region=eu-central-1" \
  -F "environment.instance_type=t3.large"
```

## Array inputs

`ARRAY` accepts a JSON array or YAML list. The `itemType` property is required:

```yaml
inputs:
  - id: ids
    type: ARRAY
    itemType: INT
    defaults: [1, 2, 3]
```

## Using inputs in a flow

Reference inputs with `{{ inputs.name }}` in any dynamic property. Use bracket notation for IDs containing hyphens or other special characters:

```yaml
inputs:
  - id: message
    type: STRING

  - id: my-file
    type: FILE

tasks:
  - id: use_inputs
    type: io.kestra.plugin.scripts.shell.Commands
    commands:
      - echo "{{ inputs.message }}"
    inputFiles:
      upload.tmp: "{{ inputs['my-file'] }}"
```

## Setting inputs at execution time

Provide input values from the **UI** (Kestra generates a form based on your input definitions), the **API**, the **CLI** (`kestractl`), **Python** (`kestra` pip package), or any HTTP client. See [Execute a flow](../03.execution/index.md#execute-via-api) for full examples with `curl`, Python, and kestractl.

## Inputs vs. variables

[Variables](../04.variables/index.md) are defined before execution and cannot be changed once it starts. Inputs are provided at execution time and can differ between runs. Use variables for fixed values reused across tasks; use inputs for values that change per execution.

## Dynamic inputs

`SELECT` and `MULTISELECT` inputs support an `expression` property that populates the dropdown from a Pebble expression — a KV store lookup, an HTTP API call, or a subflow result:

```yaml
inputs:
  - id: environment
    type: SELECT
    expression: "{{ kv('ENVIRONMENTS') }}"
```

See the [Dynamic inputs how-to guide](../../15.how-to-guides/dynamic-inputs/index.md) for HTTP function examples, subflow-populated dropdowns, and chaining dependent dropdowns.

## Conditional inputs

Use `dependsOn` and `condition` to show inputs only when a previous input matches a value:

```yaml
inputs:
  - id: notify
    type: BOOL
    defaults: false

  - id: slack_channel
    type: STRING
    dependsOn:
      inputs:
        - notify
      condition: "{{ inputs.notify == true }}"
```

`slack_channel` only appears in the Execute modal when `notify` is `true`. See the [Dynamic inputs how-to guide](../../15.how-to-guides/dynamic-inputs/index.md) for full conditional provisioning examples.

## Label/value pairs in SELECT and MULTISELECT

Each entry in `values` can be a plain string or a `{label, value}` object. The UI shows `label`; `{{ inputs.x }}` resolves to `value`:

```yaml
inputs:
  - id: aws_account
    type: SELECT
    displayName: AWS Account
    values:
      - label: "Production"
        value: "123456789012"
      - label: "Staging"
        value: "987654321098"

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "Account ID: {{ inputs.aws_account }}"
```

`defaults`, `autoSelectFirst`, and validation all operate on the `value` field, not the `label`.

## Custom values in SELECT and MULTISELECT

Set `allowCustomValue: true` to let users enter a value outside the predefined list:

```yaml
inputs:
  - id: cloud_provider
    type: SELECT
    allowCustomValue: true
    values:
      - AWS
      - GCP
      - Azure
```
