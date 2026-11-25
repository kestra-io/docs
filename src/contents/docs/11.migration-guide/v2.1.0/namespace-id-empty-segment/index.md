---
title: Namespace IDs With an Empty Segment Are Rejected
h1: Move Namespaces Whose ID Ends With a Dot or Contains Two Dots
sidebarTitle: Namespace IDs
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["OSS", "EE", "Cloud"]
description: In 2.1.0, a namespace ID can't end with a dot or contain two dots in a row. Flows in such a namespace are rejected on their next save, and its namespace files, KV store, state, and cache stop working.
---

Kestra 2.1.0 rejects [namespace](../../../05.workflow-components/02.namespace/index.md) IDs with an empty segment, such as `team.` or `team..data`.

## What changed

Each dot in a namespace ID separates two segments, and each segment becomes a folder in internal storage. An ID that ends with a dot or contains two dots in a row has an empty segment, so its storage path collided with another namespace: `team.` shared its files with `team`.

In 2.1.0, every segment must be non-empty:

- **Saving** a flow, namespace, asset, or test suite whose namespace ID has an empty segment fails. Existing ones still load.
- **Namespace files, the KV store, state, and cache** of such a namespace stop working until you move its flows to a valid namespace.
- **Executions** that already exist in such a namespace keep running, and you can still delete or purge them.
- **Role bindings** (Enterprise Edition) on such a namespace are rejected, whether you create them through the API, an invitation, or a new user. A pending invitation that holds one is skipped with a warning when the user accepts it.

Kestra 2.0.12 and 1.3.49 include the same check with a lighter guard: saving is rejected and writes and deletes to the namespace files, KV store, and cache are refused, but reads still work.

## Who is affected

Instances with a namespace ID that ends with a dot or contains two dots in a row. For example, a flow whose `namespace` property ends with a dot creates such a namespace.

## What to do

Before you upgrade to 2.1.0:

1. Look for namespace IDs that end with a dot or contain `..` in the **Namespaces** list of each tenant.
2. Move the flows of each such namespace to a valid namespace, for example from `team.` to `team`, by changing their `namespace` property.
3. Copy the namespace files and KV pairs the flows use to the new namespace. On 2.0.12 or later, you can still read them from the old namespace.
4. In the Enterprise Edition, replace role bindings on the old namespace with bindings on the new one.
