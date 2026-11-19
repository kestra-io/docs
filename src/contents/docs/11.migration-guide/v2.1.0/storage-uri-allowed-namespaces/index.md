---
title: Allowed Namespaces Apply to Internal Storage URIs
h1: Allowed Namespaces Now Apply to Files Read by URI
sidebarTitle: Internal Storage URIs
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE", "Cloud"]
description: In 2.1.0, a task that reads, writes, lists, or deletes another namespace's file by its kestra:// URI fails when that namespace restricts Allowed Namespaces and doesn't list the flow's namespace.
---

Kestra 2.1.0 applies [Allowed Namespaces](../../../07.enterprise/02.governance/07.namespace-management/index.md#allowed-namespaces) to files in internal storage that a task reaches by their `kestra://` URI.

Before 2.1.0, Allowed Namespaces covered subflows, Flow triggers, namespace files, the KV store, secrets, and assets, but not files reached by URI.

## What changed

A task that reads, writes, lists, or deletes a file by its `kestra://` URI now fails when the file's namespace, or one of its parents, restricts Allowed Namespaces and doesn't list the flow's namespace.

A flow can still always reach:

- the execution outputs, cache, and state files of its own flow;
- its namespace's files and state, and the files of other flows in its namespace or a parent namespace;
- the files of the execution that started it through a Flow trigger or a `Subflow` task.

By default, a namespace doesn't restrict Allowed Namespaces, so its files stay reachable from every namespace.

<!-- TODO(live-test kestra-ee#10551): add the error message and task state once confirmed on an EE image built after 2026-11-19 10:53Z. -->

## Who is affected

The change affects flows that pass another namespace's file URI to a task when that namespace restricts Allowed Namespaces, for example:

- a flow that reads another flow's outputs from a URI written in its source or stored in the KV store;
- a flow that receives a file passed down more than one subflow level, or relayed through a third flow, since the file is checked against the namespace that produced it.

## What to do

Find the namespace that owns each file and add the reading flow's namespace to its Allowed Namespaces, on the namespace's **Edit** tab or with the `allowed_namespaces` block of the [`kestra_namespace`](../../../13.terraform/resources/namespace/index.md) Terraform resource. Access to a namespace extends to its child namespaces.

## Related

- [Namespace management](../../../07.enterprise/02.governance/07.namespace-management/index.md)
