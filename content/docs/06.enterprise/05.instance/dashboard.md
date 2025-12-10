---
title: Instance Dashboard
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.16.0"
docId: instance
---

The Instance dashboard provides an overview of your instance’s health, including the status, configuration, and metrics of all worker, executor, scheduler, indexer, and webserver components.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/pcC3OAJPQao?si=x9LWlBHG-WMuHTdW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Overview

The **Instance** feature in Kestra Enterprise Edition provides centralized control over your platform’s infrastructure. Using this dashboard, you can centrally monitor your instance’s health and quickly identify any issues that need attention without having to rely on any additional observability tools.

It allows administrators to monitor service health, manage configurations, and communicate announcements (like planned maintenance downtime) to users. Below is a breakdown of its key functionalities.

## Instance Overview

The **Overview** tab gives a high-level snapshot of your instance’s operational status. Here, you can:
- View **active services** (e.g., Scheduler, Executor, Worker).
- Check real-time metrics like uptime and service liveness.
- Access detailed configurations for each service (e.g., version, hostname, heartbeat intervals).

![Instance Overview Table](/docs/enterprise/instance-table.png)

## Monitoring Services

Kestra tracks the health of critical components, including:
- **Workers**: Execute tasks.
- **Schedulers**: Trigger workflows.
- **Executors**: Manage task execution.
- **Webservers**: Host the UI and API.

Each service displays:
- **State**: Whether the service is active (`RUNNING`) or unresponsive.
- **Host Name**: Identifier of the server/pod (e.g., `kafka-ee-preview-79fb7755f8-zhlhq`).
- **Server Type**: For example, STANDALONE.
- **Version**
- **Start Date**
- **Health Check Date**

### Server Information & Liveness

Each service instance provides technical details for debugging when clicked on:

- **Hostname**: Identifier of the server/pod (e.g., `kafka-ee-preview-79fb7755f8-zhlhq`).
- **Session Timeout**: Time before an unresponsive service is marked offline (e.g., `60 seconds`).
- **Heartbeat Interval**: The expected time between heartbeats.
- **Last Heartbeat**: Timestamp of the latest health check.
- **Termination Grace Period**: The expected time for this service to complete all its tasks before initiating a graceful shutdown.

![Services Overview](/docs/enterprise/services-overview.png)

Additional tabs include **Configuration** to display port configuration, **Metrics** such as CPU Usage and Executor Thread Count:

![Service Metrics](/docs/enterprise/service-metrics.png)

And an **Events Timeline** to give an overview of the service's lifecycle:

![Service Events](/docs/enterprise/service-events.png)

## Announcements

:::badge{version=">=0.20" editions="EE"}
:::

Notify users about planned maintenance or updates:
1. **Create Announcements**: Specify a title, message, and date range.
2. **Choose Type**: Define severity of the announcement (e.g., `info`, `warning`, `error`).

[Announcements](./announcements.md) appear in the UI during the selected period, ensuring users stay informed.

## Maintenance Mode

:::badge{version=">=0.21" editions="EE"}
:::

Temporarily pause all workflows and services for upgrades:
1. Enable [**Maintenance Mode**](../05.instance/maintenance-mode.md) from the Instance page.
2. Services enter a paused state, and new executions are blocked.
3. Combine it with the Announcements feature so users see a maintenance banner while running workflows gracefully terminate.

## Worker Groups

:::badge{version=">=0.10" editions="EE"}
:::

Create [worker groups](../04.scalability/worker-group.md) to isolate workloads or delegate tasks to specific workers:
- **Add Worker Groups**: Define groups with specific resource limits or labels.
- **Assign Tasks**: Route workflows to designated groups via worker group key within a task or trigger.

## Audit Logs

View [Audit Logs](../02.governance/06.audit-logs.md) at a glance to monitor actions on all resource types taken by users in the instance.

![Instance Audit Logs](/docs/enterprise/instance-audit-logs.png)

## Versioned Plugins

View all installed [versioned plugins](../05.instance/versioned-plugins.md) on the instance and upgrade, install, or uninstall as needed.

![Instance Versioned Plugins](/docs/enterprise/instance-versioned-plugins.png)
