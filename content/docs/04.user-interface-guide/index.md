---
title: 🖥️ User Interface Guide
---

Kestra comes with a rich web user interface located by default on port 8080. 
If you launch Kestra from our Docker Compose file, as explained in the [Getting Started](../01.getting-started.md) guide, it will be available on http://localhost:8080.

When you first navigate to the Kestra UI, you will see the **Welcome** page.

![Kestra User Interface Welcome Page](/docs/user-interface-guide/01-Welcome.png)

On this page, you can click on **Create my first flow** to open the Kestra __Guided Tour__ which will guide you step by step into creating and executing your first flow.

![Kestra User Interface Guided Tour](/docs/user-interface-guide/02-Guided-Tour.png)

On the left menu, you will have access to all the functionalities provided by the Kestra UI:

- [Home](./01-home.md): The **Home** page contains a dashboard of flow executions.
- [Flows](./02-flows.md): The **Flows** page allows flow management and execution.
- [Templates](./03-templates.md): The **Templates** page allows flow template management.
- [Executions](./04-executions.md): The **Executions** page allows flow execution management.
- [Logs](./05-logs.md): The **Logs** page allows access to all task logs.
- [Blueprints](./blueprints.md): The **Blueprints** page provides a catalog of ready-to-use flow examples.
- [Documentations](./06-documentations.md): The **Documentations** page allows access to various documentation pages.
- [Settings](./07-settings.md): The **Settings** page allows configuring the Kestra UI.

The [Kestra Enterprise Edition](/enterprise) comes with additional functionalities provided by the Kestra UI:

- [Task Runs](./08-task-runs.md): The **Task Runs** page contains a dashboard of flow task runs. 
- [Namespaces](./09-namespaces.md): The **Namespace** page allows setting specific configurations at the namespace level and enforcing authentication and role-based access control per namespace.
- [Users](./10-users.md): The **Users** page allows the management of Kestra users.
- [Groups](./11-groups.md): The **Groups** page allows the management of Kestra user groups.
- [Roles](./12-roles.md): The **Roles** page allows the management of Kestra user roles.
- [Audit Logs](./13-audit-logs.md): The **Audit Logs** page allows access to Kestra audit logs.
- [Organization Blueprints](./blueprints.md): The **Organization Blueprints** page allows you to add custom workflow examples to reuse code and share best practices in your team.
