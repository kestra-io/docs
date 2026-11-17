---
title: "Reusable Inputs in Kestra Enterprise"
h1: Reusable Inputs
sidebarTitle: Reusable Inputs
description: Define a named input group once at the namespace level and reference it across multiple flows to eliminate duplicated input declarations.
icon: /src/contents/docs/icons/flow.svg
editions: ["EE", "Cloud"]
docId: reusable-inputs
---

Reusable inputs let you define a named group of typed inputs once at the namespace level and reference them in any flow.

## Define a reusable input set

A reusable input set is defined at the namespace level with an `id`, an optional description, and an `inputs` list structured the same as flow inputs.

```yaml
id: ad_credentials
namespace: company.team
description: Active Directory credentials required by provisioning flows.
inputs:
  - id: username
    type: STRING
    required: true
    displayName: AD Username

  - id: domain
    type: SELECT
    required: true
    values:
      - corp.example.com
      - eu.example.com

  - id: password
    type: SECRET
    required: true
    displayName: AD Password
```

The set's `id` must start with a letter or digit and may contain letters, digits, dots, hyphens, and underscores. All flow input types are valid inside a set, including `FORM` groups and [`TABLE`](../05.inputs/index.md#table-inputs) inputs.

Each time you save, Kestra stores a new revision.

## Edit a set in the UI

:::badge{version=">=2.1" editions="EE,Cloud"}
:::

Open a namespace and select the **Reusable Inputs** tab. The list shows each set visible from the namespace, including sets inherited from parent namespaces, with its latest revision. Click **Add reusable inputs** to create a set, or open a set's row menu and select **Edit**.

Each set opens on its own editor page, laid out like the flow editor, with **Edit** and **Revisions** tabs. On the **Edit** tab, the **Code** panel holds the set's YAML, and the **No Code** panel lists the set's inputs. Select an input to open its form in a new panel, with the same fields as for flow inputs. Changes in one panel appear in the other.

![The vm_components editor with the Code panel showing the set's YAML, the No Code panel listing the environment and components inputs, and the components input form open in a third panel with its columns and a defaults grid of four rows](./reusable-inputs-editor.png)

The editor validates the set while you edit it and shows each error in the validation status of the editor bar. **Undo** and **Redo** in the editor bar cover every change made in either panel until you save. `Ctrl+Z` and `Ctrl+Shift+Z` also work outside a text field.

The `id` and `namespace` of a set can't be changed once it's created. To save a set under another `id` or in another namespace, [duplicate it](#duplicate-or-delete-a-set).

### Edit TABLE defaults in a grid

In the **No Code** panel, a `TABLE` input's `columns` are edited as a list of inputs, and its `defaults` are edited in a grid. The grid works the same way as in the Execute modal, including the row menu and copying and pasting rows from Excel. See [Edit rows in the grid](../05.inputs/index.md#edit-rows-in-the-grid).

The editor grid adds a few behaviors:

- Click a column header to open that column's form.
- Renaming a column renames it in every row, and a new column is added to every row with an empty value.
- An empty cell is stored as `null`, which is different from `0` or `""`.
- When the input has [filters](../05.inputs/index.md#filter-rows-by-other-inputs), the grid still shows every row, with a note below it explaining that only the matching rows are shown at execution.

## Save a set as a draft

:::badge{version=">=2.1" editions="EE,Cloud"}
:::

Save a draft to keep unfinished work without affecting flows. **Save** is the default action in the editor bar, and **Save as draft** is in its dropdown.

- **Save** is refused while the set has validation errors, and the message names the first error.
- **Save as draft** stores the set even when it's invalid.

Executions use the latest revision of a set that isn't a draft. When the latest revision is a draft, the editor shows a banner naming the revision that flows use instead, and the Reusable Inputs list marks the set with a **Draft** tag.

A set whose revisions are all drafts can't be used yet. Saving a flow that references it fails with:

```text
Reusable inputs 'servers' in namespace 'company.team' only have draft revisions, so save a revision that isn't a draft to use them.
```

Kestra doesn't fall back to a set with the same `id` in a parent namespace in this case, since the flow would run with different inputs.

## Review and restore revisions

:::badge{version=">=2.1" editions="EE,Cloud"}
:::

The **Revisions** tab lists every revision of the set, with who saved it, when, and whether it's a draft. Compare two revisions side by side, or restore an earlier one. A restored revision is saved as a new revision, so the history is kept.

If someone else saves the set while you're editing it, the validation status warns that your revision is outdated, and a banner above the editor bar names the newer revision, who saved it, and when. Your unsaved changes are kept until you choose one of the banner's actions:

- **Compare** opens both revisions in the **Revisions** tab.
- **Discard my changes and reload** loads the newer revision.

If you save instead, Kestra asks you to confirm before overwriting the newer revision.

## Duplicate or delete a set

:::badge{version=">=2.1" editions="EE,Cloud"}
:::

Open a set's row menu in the Reusable Inputs list:

- **Duplicate** asks for an `id` and a target namespace, then copies the set's latest revision as revision 1 of a new set. You can duplicate sets inherited from a parent namespace.
- **Delete** removes the set. It's disabled for an inherited set, which can only be deleted in its own namespace.

## Reference a set in a flow

The `REUSABLE_INPUTS` input type accepts a `ref` property naming the set to include. Kestra expands the set's inputs inline before execution starts, prefixing each child input id with the reference id (`<refId>.<childId>`).

```yaml
id: provision_ad_account
namespace: company.team

inputs:
  - id: environment
    type: SELECT
    values: [staging, production]

  - id: ad
    type: REUSABLE_INPUTS
    ref: ad_credentials

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: |
      User: {{ inputs.ad.username }}
      Domain: {{ inputs.ad.domain }}
```

The set expands into three inputs (`ad.username`, `ad.domain`, and `ad.password`) available alongside `environment` in the execution form.

### Access input values

Reference each child input as `{{ inputs.<refId>.<childId> }}`, where `refId` is the `id` of the `REUSABLE_INPUTS` input in the flow and `childId` is the `id` from the set definition.

```
{{ inputs.ad.username }}
{{ inputs.ad.domain }}
{{ inputs.ad.password }}
```

## Set properties

| Property | Required | Description |
| --- | --- | --- |
| `ref` | Yes | The `id` of the reusable input set to include. |
| `namespace` | No | Namespace where the set is defined. Defaults to the flow's own namespace. Resolution walks the hierarchy; a set in a parent namespace is available to child namespaces. |
| `revision` | No | Integer revision to pin. Omit to use the latest revision that isn't a draft at execution time. |

### Pin a specific revision

The `revision` property pins the set to a specific saved version. When omitted, the latest revision that isn't a draft is used at execution time. A pinned revision is used even if it's a draft, unless the draft has no inputs, in which case execution creation fails.

```yaml
inputs:
  - id: ad
    type: REUSABLE_INPUTS
    ref: ad_credentials
    revision: 3
```


### Use a set from a parent namespace

A set defined in `company` is available to any flow in `company`, `company.team`, `company.team.infra`, and any other descendant namespace. If a child namespace defines a set with the same `id`, the child's definition takes precedence over the parent's. To use a set from a different branch of the hierarchy, set `namespace` explicitly:

```yaml
inputs:
  - id: ad
    type: REUSABLE_INPUTS
    ref: ad_credentials
    namespace: company
```

## RBAC

The `REUSABLE_INPUTS` resource controls who can manage reusable input sets. Flows that reference a set require only normal flow-execution permissions; the expansion happens server-side before the execution form is rendered.

| Role | Permissions |
| --- | --- |
| Viewer | View, list |
| Launcher | View, list |
| Editor | View, list, create, update, delete |
| Admin | All actions |

## Audit logs

Kestra records an audit log entry for every create, update, and delete operation on a reusable input set. Each entry includes the set `id`, `namespace`, and revision. Filter by resource type `REUSABLE_INPUTS` in the **Audit Logs** page to see who changed a set and when.

## Manage sets with the API

The [Kestra API](../../api-reference/index.mdx) manages sets under `/api/v1/{tenant}/namespaces/{namespace}/reusable-inputs`. Send the set's YAML to `PUT .../reusable-inputs/{id}` to create or update it. Add `?draft=true` to save the revision as a draft, which is stored even when it's invalid. Without it, an invalid set returns `422` with the first error.

`GET .../reusable-inputs/{id}` and the list endpoint return the revision an execution would use, the latest that isn't a draft. Add `?allowDraft=true` to include drafts. To check a set without saving it, send its YAML to `POST .../reusable-inputs/{id}/validate`.

You can also manage sets with [`kestractl reusable-inputs`](../../kestra-cli/kestractl/index.md#reusable-inputs-enterprise-edition).

## Manage sets from a flow

:::badge{version=">=2.1" editions="EE,Cloud"}
:::

<!-- TODO(runtime test): the Set, List, and Delete tasks are documented from source only (plugin-kestra#215, merged to next/v2.1, not yet in a plugin-kestra release). Once the plugin-kestra release for 2.1 is out, run the three examples below against EE 2.1, including a CSV upload with a semicolon separator, a draft save, and the error on an unknown `defaults` key. -->

The `io.kestra.plugin.kestra.ee.reusableinputs` tasks create, update, list, and delete sets from a flow, for example to refresh the defaults of a set from a nightly inventory export. They call the Kestra API, so they need credentials: set them on the task with `auth`, or let the task use the default credentials configured for the instance, or for the namespace or tenant with a [default service account](../../07.enterprise/02.governance/07.namespace-management/index.md#default-service-account-for-sdk-plugins). Each task defaults to the flow's namespace, and accepts `namespace` to target another one.

### Create or update a set

The `Set` task saves a new revision of a set, or creates the set. Pass `inputs` to replace every input of the set, as in a flow:

```yaml
id: reusable_inputs_set
namespace: company.team

tasks:
  - id: set_bom
    type: io.kestra.plugin.kestra.ee.reusableinputs.Set
    reusableInputsId: bom
    reusableInputsDescription: Bill of materials of the application
    inputs:
      - id: environment
        type: SELECT
        values: [dev, prod]
        defaults: dev
      - id: cpus
        type: INT
        min: 1
        defaults: 2
```

Kestra saves the declarations as written, so an expression in them, such as a `SELECT` `expression`, is evaluated by the executions that use the set, not by the task.

To change only the default values of an existing set, pass `defaults` instead, keyed by input ID. Use `form.child` for an input inside a `FORM`. Every other part of the set is kept, and the task fails on an ID the set doesn't have:

```yaml
- id: update_defaults
  type: io.kestra.plugin.kestra.ee.reusableinputs.Set
  reusableInputsId: bom
  defaults:
    environment: prod
    cpus: 4
```

The task evaluates `defaults` values, so they can come from inputs or outputs. To save an expression as a default instead, wrap it in `{% raw %}`. Don't build a default from text an untrusted user can enter, such as a `STRING` input: every execution that uses the set would evaluate an expression hidden in it.

The default of a `TABLE` input can be its rows, or the URI of a CSV or ION file that holds them, such as a `FILE` input. A file with a `.csv` extension is read as CSV, and any other file as ION. Kestra reads a CSV by its header, whose names are column IDs, and detects a comma, semicolon, or tab separator. `INT`, `FLOAT`, `BOOL`, and `MULTISELECT` cells are converted to their column's type, and an empty cell becomes `null`. The task fails on a header or key that isn't a column, and on a cell that holds an expression:

```yaml
id: reusable_inputs_import_csv
namespace: company.team

inputs:
  - id: servers
    type: FILE

tasks:
  - id: set_servers
    type: io.kestra.plugin.kestra.ee.reusableinputs.Set
    reusableInputsId: bom
    defaults:
      servers: "{{ inputs.servers }}"
```

The task validates the set the same way as **Save** in the editor, and fails with the same message on an invalid set. Set `draft: true` to save a [draft](#save-a-set-as-a-draft) instead, which may be invalid and which executions skip.

Keep in mind:

- The task writes the set from its content, so comments in the set's YAML aren't kept.
- The new revision appears in **Revisions** and in the [audit logs](#audit-logs) under the user or service account the task authenticates with.
- The task doesn't check whether someone else saved a revision since it read the set, so the last save wins.
- Only a set defined in the target namespace is edited, never one inherited from a parent namespace. Creating a set requires `inputs`, so a task with only `defaults` fails when the target namespace has no set with that ID.

The task outputs the set's `namespace`, `id`, the saved `revision`, and whether it's a `draft`.

### List sets

The `List` task lists the sets visible from a namespace, including those inherited from parent namespaces, with their ID, namespace, description, revision, and whether that revision is a draft:

```yaml
- id: list_reusable_inputs
  type: io.kestra.plugin.kestra.ee.reusableinputs.List
  fetchType: FETCH
```

Each set is listed with its latest revision, drafts included. Set `allowDraft: false` to list the revision executions use instead, which leaves out sets that only have drafts. The task fetches every page unless `page` is set. With the default `fetchType: STORE`, the list is written to an ION file in internal storage, and `FETCH` returns it in the task's `reusableInputs` output.

### Delete a set

The `Delete` task deletes a set from a namespace. A set inherited from a parent namespace can only be deleted in its own namespace:

```yaml
- id: delete_bom
  type: io.kestra.plugin.kestra.ee.reusableinputs.Delete
  reusableInputsId: bom
```

## Validation

Kestra checks a referenced set when you save a flow. Saving fails with a `422` if the set doesn't exist in the flow's namespace or any of its parent namespaces, or if all of its revisions are drafts:

```text
Invalid Flow: Input 'ad': reusable inputs 'ad_credentials' were not found in namespace 'company.team' (nor in any of its parent namespaces).
```

If the set is deleted after the flow is saved, execution creation fails with an error naming the missing set.

A reusable input set's inputs are expanded in a single pass. If a set's inputs list contains a `REUSABLE_INPUTS` entry, that nested reference is not recursively expanded and the execution form will fail to render it correctly. Keep set definitions flat.
