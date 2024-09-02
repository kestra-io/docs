---
title: Namespaces
icon: /docs/icons/ui.svg
---

Manage resources associated with a namespace in one place.

Starting 0.18.0, Kestra has introduced the Namespaces tab in the Kestra UI for OSS. In this tab, you can see all the namespaces associated with the different flows in Kestra.

## Overview

This is the default landing page of the Namespace. This page contains the dashboards and summary about the executions of different flows in this namespace.

![Overview](/docs/user-interface-guide/overview-namespaces.png)

## Editor

The in-built editor where you can add/edit the namespaceFiles. This makes it easier to edit just your namespace files without needing to select a flow inside of the namespace.

![Editor](/docs/user-interface-guide/editor-namespaces.png)

## Flows

Shows all the flows in the namespace. It gives a brief about each of the flows including the flow ID, labels, last execution date and last execution status, and the execution statistics. By selecting the details button on the right of the flow, you can navigate to that flow's page.

![Flows](/docs/user-interface-guide/flows-namespaces.png)

## Dependencies

Shows all the flows and which ones are dependent on each other (for example through Subflows or Flow Triggers).

This is similar to the Dependencies page in the Flow Editor, but this shows you how all flows within a namespace even if some of them don't depend on any others. 

![Dependencies](/docs/user-interface-guide/dependencies-namespaces.png)

## KV Store

Manage the key-values pairs associated with this namespace. More details on KV Store can be found [here](../05.concepts/05.kv-store.md).

![KV Store](/docs/user-interface-guide/kvstore-namespaces.png)

## Edit (EE)

::alert{type="info"}
This feature requires a [commercial license](/pricing).
::

Manage the namespace description, [worker group](../06.enterprise/worker-group.md) and permissions.

![Edit](/docs/user-interface-guide/edit.png)

## Variables (EE)

::alert{type="info"}
This feature requires a [commercial license](/pricing).
::

Variables defined at the namespace level can be used in any flow defined under the same namespace using the syntax: `{{ namespace.variable_name }}`.

Read more about Variables [here](../06.enterprise/08.centralized-task-configuration.md#variables)

![Variables](/docs/user-interface-guide/variables.png)

## Plugin Defaults (EE)

::alert{type="info"}
This feature requires a [commercial license](/pricing).
::

Plugin Defaults can also be defined at the namespace level. These plugin defaults are then applied for all tasks of the corresponding type defined in the flows under the same namespace.

![Plugin Defaults](/docs/user-interface-guide/plugindefaults-namespaces.png)

Read more about Plugin Defaults [here](../06.enterprise/08.centralized-task-configuration.md#plugin-defaults)

## Secrets (EE)

::alert{type="info"}
This feature requires a [commercial license](/pricing).
::

Configure Secrets directly from the UI. These secrets are available to all flows inside of the namespace.

![Secrets](/docs/user-interface-guide/secrets-namespaces.png)

Read more about Secrets [here](../06.enterprise/secrets.md)

## Audit Logs (EE)

::alert{type="info"}
This feature requires a [commercial license](/pricing).
::

Audit Logs record all activities performed in your Kestra instance by users and service accounts. You can view all of the audit logs related to the selected namespace in this view.

![Audit Logs](/docs/user-interface-guide/auditlogs-namespaces.png)

Read more about Audit Logs [here](../06.enterprise/06.audit-logs.md).