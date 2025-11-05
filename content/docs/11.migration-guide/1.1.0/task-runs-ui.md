---
title: Task Runs UI Page Removed
icon: /docs/icons/migration-guide.svg
release: 1.1.0
editions: ["EE"]
---

## Overview

The **Task Runs** page has been removed from the Enterprise Edition UI.

**Reason for removal:**
* The page presented confusing granularity (task-level runs displayed on execution-level detail pages)
* Filters were incomplete, and performance degraded when handling large datasets
* The feature was only available on the Kafka & Elasticsearch backend, causing confusion among other customers
* Customer interviews confirmed the page was not being actively used.

**Impact:**
* No replacement is required, as all relevant execution and task run details remain accessible through the Execution detail view.
* If you previously accessed Task Runs, use the **Executions** page and drill down into individual task runs through Gantt and Logs views for task-level information.
