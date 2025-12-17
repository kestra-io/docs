---
title: Enterprise Namespace Pages
icon: /docs/icons/ui.svg
editions: ["EE", "Cloud"]
---

Manage enterprise features at the namespace level.

:::alert{type="info"}
This feature requires a [commercial license](/pricing).
:::

The Enterprise Edition introduces several additional namespace pages for enhanced governance and configuration:

- Edit  
- Namespace-wide variables  
- Namespace-wide plugin defaults  
- Secrets  
- Audit logs  

## Edit

The **Edit** page lets you manage namespace-level settings such as descriptions, [worker groups](../../07.enterprise/04.scalability/worker-group.md), and permissions.

![Edit](/docs/user-interface-guide/edit.png)

## Variables

Define variables at the namespace level for use in any flow under that namespace using the syntax `{{ namespace.variable_name }}`.

Read more about [variables](../../07.enterprise/02.governance/07.namespace-management.md#variables).

![Variables](/docs/user-interface-guide/variables.png)

## Plugin defaults

Define **plugin defaults** at the namespace level. These defaults automatically apply to all tasks of the corresponding type within flows under that namespace.

![Plugin Defaults](/docs/user-interface-guide/plugindefaults-namespaces.png)

Read more about [plugin defaults](../../07.enterprise/02.governance/07.namespace-management.md#plugin-defaults).

## Secrets

Manage **secrets** directly in the UI. Namespace-level secrets are accessible to all flows within the same namespace.

![Secrets](/docs/user-interface-guide/secrets-namespaces.png)

Read more about [secrets](../../07.enterprise/02.governance/secrets.md).

## Audit logs

**Audit logs** record every action performed in your Kestra instance by users or service accounts. This page displays all logs relevant to the selected namespace.

![Audit Logs](/docs/user-interface-guide/auditlogs-namespaces.png)

Read more about [audit logs](../../07.enterprise/02.governance/06.audit-logs.md).
