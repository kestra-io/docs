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
| `ASSET` | One asset ID, or a list of IDs, picked from the assets the user can view (Enterprise Edition) | `assetType`, `assetId`, `namespace`, `status`, `metadata`, `multiple`; see [ASSET inputs](#asset-inputs) |

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

- Click **Copy the table with its headers** in the top-left corner of the grid to copy the table as tab-separated text, ready to paste into Excel. Numbers use your browser language's decimal separator, so Excel in that language reads them as numbers.
- Copy cells in Excel and paste them into a cell of the grid. If the first copied row holds column headers that match the table's column ids or display names, each value goes to its matching column, in any order. If only some of the headers match, Kestra refuses the paste and names the columns it doesn't know. Without headers, values fill the grid from the cell you paste into, to the right and down. Kestra adds rows as needed, up to `maxRows`, and warns you about any cells left out.

Kestra reads each pasted value as its column's type, in the formats Excel copies in your browser's language:

- Numbers with a decimal comma or point and grouped thousands, such as `0,75` or `1 234,5`.
- Dates such as `09/11/2026` or `9.11.26`, with day and month in your browser's order unless one of them is above 12. `DATETIME` values are read in your browser's time zone.
- Times such as `14:30` or `2:30 PM`.
- Booleans in several languages, such as `VRAI`/`FAUX`, `oui`/`non`, or `1`/`0`.
- Durations such as `2h30`, `1d 4h`, `90min`, or `2:30:00`.
- `SELECT` and `MULTISELECT` values that match an option's value or label in any case.

A date, time, duration, or select value that Kestra can't read without guessing, such as a date with a month name, stays in the cell as text and shows as an error.

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
- Pasting from Excel fills only the shown rows, never adds rows, and leaves the columns used in `filters` unchanged.
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

## ASSET inputs

:::badge{version=">=2.1" editions="EE,Cloud"}
:::

<!-- TODO(runtime test): kestra-ee#11295 live-verified 2026-11-19 on EE develop 3d69e8a: filters, dependsOn, multiple with Loop, defaults warning, rejection error text, API call, ASSET output (subflow and Flow trigger), asset() and assets(id=[...]) errors, assets() child-namespace match, and the SELECT output save error. Still from source only: the executions-list inputs tooltip, the webhook skip of the user check, the public app warning, and an existing flow with a SELECT output still running. -->

`ASSET` lets the user pick one or more [assets](../../07.enterprise/02.governance/01.assets/index.md) when running the flow, such as the virtual machine to restart or the tables to refresh. The Execute modal and [Apps](../../07.enterprise/04.scalability/apps/index.md) forms show a searchable list of the assets the user can view. The search matches the asset ID, display name, and metadata values, and shows 20 results at a time.

```yaml
id: restart_vm
namespace: infra.compute

inputs:
  - id: vm
    type: ASSET
    displayName: Virtual machine
    assetType: io.kestra.plugin.ee.assets.VM
    namespace: infra.compute
    status: active

tasks:
  - id: restart
    type: io.kestra.plugin.core.log.Log
    message: "Restarting {{ asset(inputs.vm).displayName }} in {{ asset(inputs.vm).metadata.region }}"
```

The Execute modal lists each matching asset with its display name, ID, type, namespace, and status:

![Execute modal with the Virtual machine asset picker open, listing Web server 01 in infra.compute and Web server 02 in infra.compute.eu](./asset-input-picker.png)

These properties narrow the assets the list offers. All of them are optional:

| Property | Offers only assets that |
|---|---|
| `assetType` | Have this type, such as `io.kestra.plugin.ee.assets.VM` or a custom type name |
| `assetId` | Have an ID matching this regular expression anywhere, such as `^web-` for `web-01` and `web-02` |
| `namespace` | Are in this namespace or one of its child namespaces |
| `status` | Have this status, such as `active`. An asset with no status counts as `active`. |
| `metadata` | Have each key-value pair of this map in their metadata |

Properties can be expressions. This flow first asks for a deployment, then only offers the VMs whose `deployment` metadata matches it. The `vm` input lists `deployment` in [`dependsOn`](#conditional-inputs), so its list refreshes when the user picks a deployment:

```yaml
inputs:
  - id: deployment
    type: ASSET
    displayName: Deployment
    assetType: io.kestra.plugin.ee.assets.Deployment
    status: active

  - id: vm
    type: ASSET
    displayName: Virtual machine
    assetType: io.kestra.plugin.ee.assets.VM
    metadata:
      deployment: "{{ inputs.deployment }}"
    dependsOn:
      inputs:
        - deployment
```

Set `multiple: true` to let the user pick several assets. This flow stops each picked VM in a [Loop](../01.tasks/00.flowable-tasks/index.md#loop):

```yaml
id: stop_vms
namespace: infra.compute

inputs:
  - id: vms
    type: ASSET
    displayName: Machines to stop
    multiple: true
    assetType: io.kestra.plugin.ee.assets.VM
    status: active

tasks:
  - id: stop
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ inputs.vms }}"
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "Stopping {{ item.value }} in {{ asset(item.value).metadata.region }}"
```

### Read the picked asset

The input's value is the asset ID, or a list of IDs with `multiple: true`. Tasks, subflows, and the API receive only the IDs. Read an asset, with its current metadata, using the [`asset()` function](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#asset-pebble-function), such as `{{ asset(inputs.vm).metadata.region }}`. For a list, use `{{ assets(id=inputs.vms) }}`, which returns the assets in the order picked.

On the execution's **Input/Output** tab, select the input to see each asset's status, name, type, and namespace, with a link to the asset. The inputs tooltip of the executions list shows the same details. If the viewer can't view assets, or the asset was deleted, the ID shows instead.

![Input/Output tab with the vm input selected, showing the active asset Web server 01 of type VM in the infra.compute namespace](./asset-input-output-tab.png)

### Validation and defaults

Kestra checks each submitted ID against the input's properties, and against the [allowed namespaces](../../07.enterprise/02.governance/07.namespace-management/index.md#allowed-namespaces) of the asset's namespace. A mismatch rejects the execution:

```text
Asset 'web-07' does not exist, does not match the filters of input 'vm', or is not allowed from the namespace 'infra.compute'.
```

An execution created without a logged-in user, such as from a webhook, skips the user permission check. The namespace check still applies.

Set `defaults` to an asset ID, or a list of IDs with `multiple: true`. When you save the flow, the editor warns if a default doesn't exist, doesn't match the input's properties, or can't be reached from the flow's namespace. The save still succeeds, because the asset may be created later. The editor also completes `status` values and the IDs of matching assets for `defaults`.

To pass the input through the API, send the ID, or a JSON list of IDs:

```bash
curl -X POST "http://localhost:8080/api/v1/main/executions/infra.compute/restart_vm" \
  -H "Content-Type: multipart/form-data" \
  -F 'vm=web-01'
```

An app with public access can't use an `ASSET` input: its visitors can't view any asset, so the list stays empty and Kestra refuses the execution. The App builder shows a warning. In the open-source edition, an `ASSET` input fails with `The ASSET type requires Kestra Enterprise Edition.`

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
- **Flow triggers:** a [Flow trigger](../07.triggers/02.flow-trigger/index.md) stores the searchable inputs it sets in its `inputs` property. A Flow trigger without `inputs` starts executions that use the input defaults but store no searchable values.

<!-- Live-verified on OSS develop fec96bba (2026-11-18): Flow trigger inputs, the no-`inputs` case, replay-with-inputs, and the stored forms in the outputs page table. -->

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
