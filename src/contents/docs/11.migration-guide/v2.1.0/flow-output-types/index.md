---
title: Flow Outputs No Longer Accept Input-Only Types
h1: Change Flow Outputs That Use an Input-Only Type
sidebarTitle: Flow Output Types
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["OSS", "EE", "Cloud"]
description: In 2.1.0, flow outputs have their own list of types. SELECT, MULTISELECT, EMAIL, FORM, and REUSABLE_INPUTS are input-only types, and saving a flow that uses one as an output type fails.
---

Kestra 2.1.0 gives [flow outputs](../../../05.workflow-components/06.outputs/index.md#flow-outputs) their own list of types, separate from input types.

## What changed

`SELECT`, `MULTISELECT`, `EMAIL`, `FORM`, and `REUSABLE_INPUTS` are input types. In 2.0, a flow output accepted them too. In 2.1.0, they're no longer output types:

- **Existing flows** load and run. Kestra treats the output's type as unknown and keeps its value as rendered, without type conversion.
- **Saving the flow** fails with `The output '<id>' has an unknown type, it must be one of ...`, followed by the supported output types.

## Who is affected

Flows that declare an output with one of these types. Flows migrated from 1.x with the [flow migration tool](../../v2.0.0/00.migration-tutorial/index.mdx) can have `SELECT` outputs where the 1.x flow had an `ENUM` output.

## Migrate

Change the output type to `STRING`, or to `ARRAY` for a `MULTISELECT` output:

```yaml
outputs:
  - id: region
    type: STRING  # was SELECT
    value: "{{ inputs.region }}"

  - id: regions
    type: ARRAY  # was MULTISELECT
    value: "{{ inputs.regions }}"
```

The output values stay the same. Outputs marked `searchable: true` keep being searchable, because `STRING` and `ARRAY` are searchable types.

## Related

- [Flow outputs](../../../05.workflow-components/06.outputs/index.md#flow-outputs)
