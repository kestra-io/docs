---
title: User Interface
icon: /docs/icons/ui.svg
---

Kestra comes with a rich web user interface located by default on port 8080.

When you first navigate to the Kestra UI, you will see the **Welcome** page.

![Kestra User Interface Welcome Page](/docs/user-interface-guide/01-Welcome.png)

On this page, click on **Create my first flow** to open the Kestra __Guided Tour__, which will guide you through creating and executing your first flow step by step.

On the left menu, you will see the following UI pages:

- The **Dashboards** page contains dashboards of visualizations for flow execution data and other metrics.
- The **Flows** page shows you all of your flows, where you can create, edit, and execute them.
- The **Executions** page provides a view to inspect and manage previous executions.
- The **Logs** page gives access to all task logs from previous executions.
- The **Namespaces** page lists all available namespaces and allows specific configurations to be set at the namespace level.
- The **KV Store** page lists all key-value pairs and their associated namespace and provides a place to create new pairs.
- The **Blueprints** page provides a catalog of ready-to-use flow examples.
- The **Plugins** page provides a catalog of plugins you can use inside of your flows.
- The **Administration** page helps troubleshoot administrative issues, such as worker status and triggers. Depending on your Kestra edition, it also provides features like audit logs and user management.

The [Kestra Enterprise Edition](/enterprise) comes with additional functionalities provided by the Kestra UI:

- The **Apps** page takes you to your list of Apps and is also where you create new Apps.
- The **Secrets** page lists all secrets and their associated namespace and provides a place to create new secrets.
- The **Administration** tab has additional Enterprise sections such as:
  - **IAM** for managing Users, Groups, and Roles.
  - **Audit Logs** to access Kestra audit logs.
  - **Instance** to have an overview of Kestra server component statuses, make announcements, and enable maintenance mode.
  - **Tenants** to manage your tenants (page accessible only by users with admin permissions).
- The **Task Runs** page is available if you are running Kestra with the [Kafka / Elasticsearch backend](../07.architecture/index.md#architecture-with-kafka-and-elasticsearch-backend).

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/6o0PNVrA84k?si=QyjOSo5HMZ-wKHol" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

::ChildCard
::
