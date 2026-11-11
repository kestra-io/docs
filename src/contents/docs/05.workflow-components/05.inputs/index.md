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

Flow inputs are stored in the execution context and accessed with `{{ inputs.parameter_name }}`. All inputs are validated when the execution is created; invalid or missing required inputs prevent the execution from being created and it will not appear in the executions list.

## Declaring inputs

Inputs are declared under the `inputs` key. Each input requires an `id` and a `type`. Inputs are required by default; `required: false` makes an input optional.

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
| `EMAIL` | Valid email address | `validator` (regex) |
| `INT` | Integer | `min`, `max` |
| `FLOAT` | Float | `min`, `max` |
| `BOOL` | `true` or `false` | — |
| `DATETIME` | [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) datetime in UTC, e.g. `2042-04-02T04:20:42.000Z` | `after`, `before` |
| `DATE` | ISO 8601 date without timezone, e.g. `2042-12-03` | `after`, `before` |
| `TIME` | ISO 8601 time without timezone, e.g. `10:15:30` | `after`, `before` |
| `DURATION` | ISO 8601 duration, e.g. `PT5M6S` | `min`, `max` |
| `SELECT` | One value from a predefined list | `values`, `expression`, `allowCustomValue`, `autoSelectFirst` |
| `MULTISELECT` | One or more values from a predefined list | Same as `SELECT` |
| `FILE` | Uploaded file, `nsfile:///` (namespace file), or `file:///` (local allowed path) | `allowedFileExtensions`; stored in [internal storage](../../08.architecture/data-components/index.md#internal-storage); the only type that accepts a multipart file upload via the API; all other types require a plain string value |
| `JSON` | Valid JSON string | `jsonSchema` (JSON Schema Draft 2020-12) |
| `ION` | Ion-formatted text, parsed into a structured object (Map or List) accessible with dot notation, e.g. `{{ inputs.record.name }}`; use Ion syntax for `defaults`: `'{name:"Ada",score:21}'` | — |
| `YAML` | Valid YAML string | — |
| `URI` | Valid URI, kept as a string | — |
| `SECRET` | Encrypted string, decrypted at runtime and masked in UI and logs | `validator` (regex); requires [encryption key](../../configuration/05.security-and-secrets/index.md) |
| `ARRAY` | JSON array or YAML list | `itemType` (required) |
| `FORM` | Groups child inputs as a multi-step wizard in the Execute modal | Cannot nest; no `defaults`/`prefill` on the FORM itself |
| `TABLE` | Ordered list of typed records, entered as rows in a grid (Enterprise Edition) | `columns` (required), `minRows`, `maxRows`, `filters`, `allowRowDuplication`; see [TABLE inputs](#table-inputs) |
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
| `id` | Identifier used to reference the input, e.g. `{{ inputs.user }}`. |
| `type` | Data type, as listed above. |
| `required` | Whether the input is required. Defaults to `true`. |
| `defaults` | Default value applied when no value is provided at runtime. |
| `prefill` | Initial value shown in the UI that can be cleared to `null`. Unlike `defaults`, a cleared prefill resolves to `null`. |
| `displayName` | Label shown in the UI instead of the `id`. |
| `description` | Markdown description displayed in the UI. |
| `descriptionDisplayMode` | How the `description` is displayed: `TEXT` (default) renders it between the label and the field, `TOOLTIP` renders it as a hoverable help icon next to the label. |
| `validator` | Regex pattern for `STRING` and `SECRET` types. |
| `expression` | Pebble expression used to populate `SELECT` and `MULTISELECT` values dynamically, e.g. `{{ kv('MY_LIST') }}`. |
| `dependsOn` | Makes this input conditional on other inputs being provided or matching a `condition`. |
| `autoSelectFirst` | Auto-selects the first value in `SELECT`/`MULTISELECT` lists as the default. |
| `searchable` | Stores the input value so you can find executions by it. Defaults to `false`. See [Searchable inputs](#searchable-inputs). |

### Description display mode

:::badge{version=">=2.1" editions="OSS,EE,Cloud"}
:::

Long descriptions make forms unwieldy. Set `descriptionDisplayMode: TOOLTIP` to keep the form compact and show the description only when the user hovers the help icon next to the label. This applies to the Execute modal and to [Apps](../../07.enterprise/04.scalability/apps/index.md) forms.

```yaml
inputs:
  - id: environment
    type: SELECT
    displayName: Environment
    description: The target environment for deploying VMs. Pick `prod` only after the change was approved.
    descriptionDisplayMode: TOOLTIP
    values:
      - dev
      - prod
```

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

The `jsonSchema` property validates a `JSON` input against a JSON Schema at execution time. An invalid payload rejects the execution before any task runs:

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

Kestra reports each schema error as a separate message, so a payload with several problems shows all of them at once. An error on a nested value, such as a property of the wrong type, also names its location, for example `payload.name`.

To validate JSON at any point in a flow — not just at execution start — use the [ValidateJsonSchema](../../15.how-to-guides/validate-json-schema/index.md) task from plugin-serdes.

## Nested inputs

A `.` in an input `id` creates a nested structure, accessible with the same dot notation in expressions:

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

A `FORM` also accepts [`descriptionDisplayMode: TOOLTIP`](#description-display-mode), which shows its description as a help icon next to the group title in the wizard instead of a text block, in the Execute modal and in Apps.

When triggering a flow with FORM inputs via the API, use flat dotted field names:

```bash
curl -X POST "http://localhost:8080/api/v1/main/executions/company.team/provision_environment" \
  -H "Content-Type: multipart/form-data" \
  -F "requester=platform-team" \
  -F "environment.region=eu-central-1" \
  -F "environment.instance_type=t3.large"
```

## TABLE inputs

:::badge{version=">=2.1" editions="EE,Cloud"}
:::

`TABLE` collects a list of records with the same typed fields, such as the disks to attach to a VM or a set of firewall rules. The Execute modal and [Apps](../../07.enterprise/04.scalability/apps/index.md) forms render it as a grid with one column per field, each header showing the column's type. Users add rows with **Click to add a row** and manage them from the row menu, as described in [Edit rows in the grid](#edit-rows-in-the-grid).

Declare each column under `columns` as a regular input. Its rules, such as `min`, `max`, or `validator`, apply to that column in every row. `minRows` and `maxRows` limit the number of rows:

```yaml
id: provision_vm
namespace: company.team

inputs:
  - id: disks
    type: TABLE
    displayName: Additional disks
    minRows: 1
    maxRows: 8
    columns:
      - id: size_gb
        type: INT
        min: 10
        max: 2048
      - id: mountpoint
        type: STRING
        validator: "^/[a-zA-Z0-9/_-]*$"
      - id: label
        type: STRING
        required: false

tasks:
  - id: first_disk
    type: io.kestra.plugin.core.log.Log
    message: "First disk: {{ inputs.disks[0].size_gb }} GB at {{ inputs.disks[0].mountpoint }}"

  - id: attach
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ inputs.disks }}"
    parseValues: true
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "Attaching {{ item.value.size_gb }} GB at {{ item.value.mountpoint }}"
```

![The Execute modal showing the Additional disks TABLE input as a grid with size_gb INT, mountpoint STRING, and label STRING columns, two filled rows, a third empty row with missing required value errors below its required cells, and a Click to add a row control](./table-input-execute-modal.png)

The value is a list of objects, one per row, keyed by column `id`. Reference a cell with `{{ inputs.disks[0].size_gb }}`, where the index starts at 0. To loop over the rows, pass the input to a [Loop](../01.tasks/00.flowable-tasks/index.md#loop) task with `parseValues: true` so `item.value` is the row object.

Columns are required by default, like any input. Set `required: false` on a column to let users leave its cells empty. An omitted cell resolves to `null`, and so does an empty value in a column of a non-text type such as `INT` or `DATE`.

A `TABLE` can sit inside a [FORM](#form-inputs). Reference it with the form's path, such as `{{ inputs.environment.disks }}`.

### Edit rows in the grid

Hover over a row number to show the row handle. Drag the handle to move the row, or click it to open the row menu with **Insert above**, **Insert below**, **Move up**, **Move down**, **Duplicate**, **Clear contents**, and **Delete**. **Delete** is disabled while the table has only `minRows` rows, and the insert and duplicate actions are disabled once it has `maxRows` rows. A new row starts with each column's `prefill` value.

To move rows between Kestra and a spreadsheet:

- Click **Copy the table with its headers** in the top-left corner of the grid to copy the table as tab-separated text, ready to paste into Excel.
- Copy cells in Excel and paste them into a cell of the grid. If the first copied row holds column headers that match the table's column ids or display names, each value goes to its matching column. Otherwise, values fill the grid from the cell you paste into, to the right and down. Kestra adds rows as needed, up to `maxRows`, and warns you about any cells left out.

### Column rules

Kestra checks the columns when you save the flow:

- **Types:** `STRING`, `INT`, `FLOAT`, `BOOL`, `DATE`, `DATETIME`, `TIME`, `DURATION`, `EMAIL`, `URI`, `SELECT`, and `MULTISELECT`.
- **IDs:** each column `id` must be unique within the table and cannot contain a `.`.
- **Properties:** a column cannot declare `defaults` or `dependsOn`. A column's `prefill` fills new rows. A `SELECT` or `MULTISELECT` column takes static `values` or an `expression`, which can use the inputs listed in the table's `dependsOn`.
- **Row limits:** `minRows` cannot be greater than `maxRows`.

For example, the `zone` column below offers different values depending on the `region` input, and Kestra rejects a cell that isn't one of the rendered values:

```yaml
inputs:
  - id: region
    type: SELECT
    values: [eu, us]
    defaults: eu

  - id: servers
    type: TABLE
    dependsOn:
      inputs:
        - region
    columns:
      - id: name
        type: STRING
      - id: zone
        type: SELECT
        expression: "{{ inputs.region == 'eu' ? ['eu-west-1', 'eu-central-1'] : ['us-east-1'] }}"
      - id: cpus
        type: INT
        min: 1
        prefill: 2
```

### Filter rows by other inputs

Set `filters` on a `TABLE` to show only some of the rows from its `defaults`, based on the values of other inputs. For example, a bill of materials lists every component of an application, while one execution needs only the component types picked in a `MULTISELECT`:

```yaml
inputs:
  - id: component_types
    type: MULTISELECT
    values: [linux, windows, database]
    defaults: [linux]

  - id: components
    type: TABLE
    dependsOn:
      inputs:
        - component_types
    filters:
      - column: type
        operation: IN
        value: "{{ inputs.component_types }}"
    allowRowDuplication: true
    columns:
      - id: name
        type: STRING
      - id: type
        type: SELECT
        values: [linux, windows, database]
      - id: cpus
        type: INT
        min: 1
    defaults:
      - {name: web-01, type: linux, cpus: 2}
      - {name: app-01, type: windows, cpus: 4}
      - {name: db-01, type: database, cpus: 8}
      - {name: web-02, type: linux, cpus: 2}
```

With the default `linux` selection, the execution receives the `web-01` and `web-02` rows. Selecting `linux` and `database` adds `db-01`.

Each filter has three properties:

| Property | Description |
| --- | --- |
| `column` | The `id` of a declared column. |
| `operation` | `EQUALS`, `NOT_EQUALS`, `IN`, `NOT_IN`, or `CONTAINS`. `IN` and `NOT_IN` take a list. `CONTAINS` matches a substring in a text cell, or any shared value in a `MULTISELECT` cell. |
| `value` | The value to compare each cell to. Use an expression such as `{{ inputs.component_types }}` to compare against another input listed in the table's `dependsOn`. |

A row must match every filter to be kept. Kestra renders the filters again whenever an input in `dependsOn` changes, and the grid updates as soon as another value is picked.

When filters are set:

- The grid shows only the matching rows, with a footer such as `2 of 4 rows`. Only those rows are validated, listed on the review step, included in the cURL command, and passed to the execution.
- Users can edit cells within each column's rules, but they can't add, insert, move, or delete rows. Edits made to a row are kept while another selection hides it, and appear again when the row matches again.
- With `allowRowDuplication: true`, users can duplicate a visible row from its row menu, for example to add a second Linux VM. A duplicated row can be deleted again, while a row from `defaults` can't. `allowRowDuplication` defaults to `false` and has no effect without filters.

![The Execute modal for provision_components with linux selected in component_types, the components grid showing the web-01 and web-02 rows, and the row menu of row 1 open with Duplicate, Clear contents, and a disabled Delete](./table-input-filters.png)

Kestra also checks a submitted value against the filters, so the same rules apply when you start an execution through the API. A row that doesn't match is rejected, and so are more rows than the matching `defaults` unless `allowRowDuplication` is set:

```text
Invalid value for input `components`. Cause: row 1, column `type`: it doesn't match the filter `IN [linux]`
Invalid value for input `components`. Cause: it must have at most `2` rows, the rows of `defaults` matching the filters, unless `allowRowDuplication` is set
```

When you save the flow, Kestra rejects a filter on a column the table doesn't declare, and a filter whose `value` is an empty list.

`TABLE` cannot be used as the `itemType` of an `ARRAY` or `MULTISELECT` input. In the open-source edition, saving a flow with a `TABLE` input fails with an error that names the input.

### Validation errors

Kestra validates every cell of every row and reports all errors at once, so the user can fix them in one pass. Each message names the row, counted from 1, and the column:

```text
Invalid value for input `disks`. Cause: row 3, column `size_gb`: it must be less than `2048`
Invalid value for input `disks`. Cause: row 4, column `mountpoint`: missing required value
```

A row with a key that isn't a declared column, or a row that isn't an object, is also rejected. Kestra checks `minRows` and `maxRows` once every cell is valid. In the Execute modal, each error appears below its cell.

To check values without creating an execution, send them to `POST /api/v1/{tenant}/executions/{namespace}/{id}/validate`. The response returns each cell error with a `path` field that locates the cell, such as `disks[2].size_gb`, where the row index starts at 0. An error about the input as a whole, such as the row count, has no `path`.

### Pass a TABLE input via the API

Send the rows as one JSON-encoded field, the same way as an `ARRAY` or `JSON` input:

```bash
curl -X POST "http://localhost:8080/api/v1/main/executions/company.team/provision_vm" \
  -H "Content-Type: multipart/form-data" \
  -F 'disks=[{"size_gb": 100, "mountpoint": "/data"}, {"size_gb": 50, "mountpoint": "/logs", "label": "logs"}]'
```

Invalid rows return a `422` response whose `detail` lists every error.

<!-- TODO(2.1 RC): confirm availability on Cloud. -->

## Array inputs

`ARRAY` accepts a JSON array or YAML list. The `itemType` property is required:

```yaml
inputs:
  - id: ids
    type: ARRAY
    itemType: INT
    defaults: [1, 2, 3]
```

## Searchable inputs

:::badge{version=">=2.1" editions="OSS,EE,Cloud"}
:::

Set `searchable: true` on an input to find executions by its value, such as an order ID or a customer code. Kestra stores the value when the execution is created, so you can find executions that are still running.

```yaml
id: process_orders
namespace: company.sales

inputs:
  - id: customerId
    type: STRING
    searchable: true

  - id: orderIds
    type: ARRAY
    itemType: STRING
    searchable: true

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "Processing {{ inputs.orderIds | length }} orders for {{ inputs.customerId }}"
```

Kestra stores each item of an `ARRAY` input separately, so a search for one order ID finds this execution. Use an `ARRAY` input rather than `MULTISELECT` to search on several values.

Searchable inputs follow these rules:

- **Types:** `STRING`, `EMAIL`, `SELECT`, `INT`, `FLOAT`, `BOOL`, `URI`, `DATE`, `DATETIME`, `TIME`, `DURATION`, and `ARRAY` of those scalar values. Saving a flow that marks an input of any other type as searchable, such as `SECRET`, `FILE`, or `MULTISELECT`, fails with an error that names the input.
- **When values are stored:** after all inputs pass validation. An execution rejected for invalid inputs stores no searchable values. An input left empty has no searchable value.
- **IDs:** an ID can be searchable on an input or on an output of the same flow, not both.
- **Size limits, errors, replays, and cleanup:** the same as for [searchable outputs](../06.outputs/index.md#searchable-outputs). A value that can't be stored is logged as an error, and the execution still runs.
- **Inputs inside a `FORM`:** use the dotted ID as the filter key, such as `environment.region` for a `region` input inside an `environment` form.
- **Flow triggers:** executions started by a [Flow trigger](../07.triggers/02.flow-trigger/index.md) don't store searchable inputs.

<!-- TODO(eng): Flow trigger executions don't go through FlowInputOutput.readExecutionInputs, the only path that indexes inputs. Verified live 2026-11-11. Remove the Flow triggers bullet if this is fixed. -->

To find executions by a searchable input, use the **Inputs & Outputs** filter on the **Executions** page or the `searchableData` API filter. See [Find executions by searchable value](../06.outputs/index.md#find-executions-by-searchable-value).

## Using inputs in a flow

Inputs are referenced with `{{ inputs.name }}` in any dynamic property. Bracket notation is required for IDs containing hyphens or other special characters:

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

Input values are provided at execution time via the UI Execute modal, the API, the CLI ([`kestractl`](../../kestra-cli/kestractl/index.md#installation)), or the Python SDK (`kestra` pip package). See [Execute a flow](../03.execution/index.md#execute-via-api) for full examples with `curl`, Python, and kestractl.

## Inputs vs. variables

[Variables](../04.variables/index.md) are defined before execution and cannot be changed once it starts. Inputs are provided at execution time and can differ between runs.

## Dynamic inputs

`SELECT` and `MULTISELECT` inputs support an `expression` property that populates the dropdown from a Pebble expression: a KV store lookup, an HTTP API call, or a subflow result:

```yaml
inputs:
  - id: environment
    type: SELECT
    expression: "{{ kv('ENVIRONMENTS') }}"
```

See the [Dynamic inputs how-to guide](../../15.how-to-guides/dynamic-inputs/index.md) for HTTP function examples, subflow-populated dropdowns, and chaining dependent dropdowns.

## Conditional inputs

`dependsOn` makes an input conditional on one or more other inputs. When `condition` evaluates falsy, the input is hidden in the Execute modal:

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

`allowCustomValue: true` allows users to enter a value outside the predefined list:

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

When an execution is created with a value for an input that sets `allowCustomValue: true`, Kestra doesn't render the input's `expression`. This lets a `Subflow` task or a trigger start a flow whose dropdown uses `subflow()`. See [Start the flow from a Subflow task or a trigger](../../15.how-to-guides/dynamic-inputs/index.md#start-the-flow-from-a-subflow-task-or-a-trigger).
