---
title: Instance Dashboard
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.16.0"
docId: instance
---

The Instance dashboard provides an overview of your instance health, including the status, configuration and metrics of all worker, executor, scheduler, indexer, and webserver components.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/pcC3OAJPQao?si=x9LWlBHG-WMuHTdW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Overview

The **Instance** feature in Kestra Enterprise Edition provides centralized control over your platform’s infrastructure. Using this dashboard, you can centrally monitor your instance health and quickly identify any issues that need attention without having to rely on any additional observability tools.

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
- **Liveness Status**: Whether the service is active (`RUNNING`) or unresponsive.
- **Configuration**: Version, hostname, and heartbeat intervals (e.g., `3 seconds`).
- **Metrics**: Uptime, resource usage, and error rates.

## Announcements

::badge{version=">=0.20" editions="EE"}
::

Notify users about planned maintenance or updates:
1. **Create Announcements**: Specify a title, message, and date range.
2. **Choose Type**: Define severity of the announcement e.g. `info`, `warning`, `error`.

[Announcements](./announcements.md) appear in the UI during the selected period, ensuring users stay informed.

## Maintenance Mode

::badge{version=">=0.21" editions="EE"}
::

Temporarily pause all workflows and services for upgrades:
1. Enable **Maintenance Mode** from the Instance page.
2. Services enter a paused state, and new executions are blocked.
3. Combining it with Announcements feature, users can see a maintenance banner, and running workflows gracefully terminate.

## Worker Groups

::badge{version=">=0.10" editions="EE"}
::

Create [worker groups](../04.scalability/worker-group.md) to isolate workloads or delegate tasks to given workers:
- **Add Worker Groups**: Define groups with specific resource limits or labels.
- **Assign Tasks**: Route workflows to designated groups via worker group key within a task or trigger.


## Server Information & Liveness

Each service instance provides technical details for debugging:
- **Hostname**: Identifier of the server/pod (e.g., `kafka-ee-preview-79fb7755f8-zhlhq`).
- **Session Timeout**: Time before an unresponsive service is marked offline (e.g., `60 seconds`).
- **Last Heartbeat**: Timestamp of the latest health check.
