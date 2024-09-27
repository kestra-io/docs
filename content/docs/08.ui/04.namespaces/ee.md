---
title: Enterprise Namespace Pages
icon: /docs/icons/ui.svg
editions: ["EE"]
---

Manage specific enterprise features within a namespace.

::alert{type="info"}
This feature requires a [commercial license](/pricing).
::

There's a number of extra namespace pages available in the enterprise edition:
- Edit
- Namespace-wide Variables
- Namespace-wide Plugin Defaults
- Secrets
- Audit Logs

## Edit

Manage the namespace description, [worker group](../../06.enterprise/worker-group.md) and permissions.

![Edit](/docs/user-interface-guide/edit.png)

## Variables

Variables defined at the namespace level can be used in any flow defined under the same namespace using the syntax: `{{ namespace.variable_name }}`.

Read more about Variables [here](../../06.enterprise/08.centralized-task-configuration.md#variables)

![Variables](/docs/user-interface-guide/variables.png)

## Plugin Defaults

Plugin Defaults can also be defined at the namespace level. These plugin defaults are then applied for all tasks of the corresponding type defined in the flows under the same namespace.

![Plugin Defaults](/docs/user-interface-guide/plugindefaults-namespaces.png)

Read more about Plugin Defaults [here](../../06.enterprise/08.centralized-task-configuration.md#plugin-defaults)

## Secrets

Configure Secrets directly from the UI. These secrets are available to all flows inside of the namespace.

![Secrets](/docs/user-interface-guide/secrets-namespaces.png)

Read more about Secrets [here](../../06.enterprise/secrets.md)

## Audit Logs

Audit Logs record all activities performed in your Kestra instance by users and service accounts. You can view all of the audit logs related to the selected namespace in this view.

![Audit Logs](/docs/user-interface-guide/auditlogs-namespaces.png)

Read more about Audit Logs [here](../../06.enterprise/06.audit-logs.md).