---
title: Checks in Kestra – Pre-Execution Validations
description: Implement Checks in Kestra for pre-execution validation. Guard your workflows by enforcing conditions on inputs before any task begins execution.
sidebarTitle: Checks
icon: /src/contents/docs/icons/flow.svg
version: ">= 1.2.0"
---

Add pre-execution validations that can block or fail an execution before any tasks run.

## Add checks to validate inputs before execution

`checks` are flow-level assertions evaluated when validating inputs and before creating a new execution. Each check defines a boolean `condition` and a `message` shown when the condition is false. You can choose how Kestra reacts (block, fail, or still create the execution) and how the message is styled in the UI.

Checks are useful to enforce business rules on inputs (e.g., allowed values, date windows, required flags) or to nudge users with warnings before they launch a run.

## Properties

Each item in `checks` supports the following properties:

- `condition` *(required)*: Pebble expression that must evaluate to a boolean. For example, you can design checks against Inputs, Key-Value pairs, or other [expression](../../expressions/index.md) accessible workflow components.
- `message` *(required)*: Text displayed when the condition is false.
- `style` *(optional, default `INFO`)*: Visual style for the message. One of `ERROR`, `SUCCESS`, `WARNING`, `INFO`.
- `behavior` *(optional, default `BLOCK_EXECUTION`)*: How the flow should react when the condition is false. One of:
  - `BLOCK_EXECUTION`: Do not create the execution.
  - `FAIL_EXECUTION`: Create the execution immediately in a failed state.
  - `CREATE_EXECUTION`: Allow execution creation even if the check fails.

When clicking **Execute**, with an `ERROR` message display set in the flow code, the modal will display the `message` as soon as an input is set that doesn't satisfy the check like below:

![Failed Check](./checks-fail.png)

---

### Multiple checks

If several checks fail, the most restrictive behavior wins in this priority order: `BLOCK_EXECUTION` → `FAIL_EXECUTION` → `CREATE_EXECUTION`. This lets you mix hard stops with softer warnings in the same flow.

## Examples

### Simple guard

This flow blocks execution unless the `name` input is `Kestra`.

```yaml
id: simple_check
namespace: company.team

inputs:
  - id: name
    type: STRING

checks:
  - message: "Sorry, this flow can only be executed with 'Kestra'"
    condition: "{{ (inputs.name | upper) == 'KESTRA' }}"
    style: ERROR
    behavior: BLOCK_EXECUTION

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World! 🚀
```

### Advanced guarded ingest

This flow pulls sample data from DummyJSON, blocks prod runs outside a time window, and warns (but allows) when using a non-approved source URL.

```yaml
id: guarded_ingest
namespace: company.team

inputs:
  - id: environment
    type: SELECT
    values: [dev, prod]
    defaults: dev
  - id: run_date
    type: DATETIME
    defaults: "{{ now() }}"
  - id: payload_url
    type: URI
    defaults: https://dummyjson.com/products?limit=5

checks:
  # Block risky prod runs outside the allowed window
  - message: "Prod runs are only allowed between 06:00 and 22:00 UTC"
    condition: "{{ inputs.environment != 'prod' or (inputs.run_date | date('HH') | number >= 6 and inputs.run_date | date('HH') | number < 22) }}"
    style: ERROR
    behavior: BLOCK_EXECUTION

  # Warn if the payload is not the approved source
  - message: "Non-approved source detected. Use https://dummyjson.com when possible."
    condition: "{{ inputs.payload_url | startsWith('https://dummyjson.com') }}"
    style: WARNING
    behavior: CREATE_EXECUTION

tasks:
  - id: fetch
    type: io.kestra.plugin.core.http.Download
    uri: "{{ inputs.payload_url }}"

  - id: log_run
    type: io.kestra.plugin.core.log.Log
    message: "Run {{ execution.id }} in {{ inputs.environment }} with file {{ outputs.fetch.uri }}"
```

## When to use checks

- Prevent invalid or risky executions based on user inputs.
- Prevent runs when resources are exhausted (e.g., too many VMs provisioned).
- Offer guardrails with warnings while still allowing runs to proceed.
- Enforce “only one path” scenarios by failing early instead of deep in the task sequence.

Checks run before tasks start, so they are a low-cost way to validate inputs and intentions upfront.
