---
title: "⚡️ Kestra v0.20 is here! ⚡️"
link: "Learn More"
href: "https://go.kestra.io/release-020-newsfeed"
image: ./image.png
publicationDate: 2024-12-03T17:00:00
addedDate: 2024-06-05T07:28:23.662
---

This release adds new flow and task properties, such as `sla` and `runIf`, and new Flow trigger `preconditions`, allowing you to orchestrate complex dependencies across flows.

Enterprise Edition users can now benefit from more team-level isolation, a new invite process, and custom UIs to interact with Kestra from the outside world using Apps.

**What’s new in the Open-Source Edition:**

- **Flow-level SLAs (Beta):** Use the new `sla` flow property to set custom SLA conditions for each workflow.
- **Enhanced flow triggers:** Coordinate complex dependencies across workflows with time-based or multi-flow `preconditions`.
- **`runIf` task property:** Conditionally skip any task based on custom logic, ideal for microservice orchestration.
- **Transactional Queries:** Execute multiple SQL Queries as an atomic database transaction in a single task.
- **Improved sidebar and bookmarks:** Bookmark filtered UI pages for quick access.
- **Improved filtering**: Adjust filters on any UI page simply by typing your filter criteria.
- **New `errorLogs()` function:** Add context about why workflow has failed in alert notifications.
- **New Azure ADLS Gen2 plugin, improved dbt plugin and OAuth tasks:** Process data from Azure data lake, add statefulness to dbt and dynamically fetch OAuth tokens for Kubernetes jobs.
- **Pause running executions:** Manually pause execution to prevent downstream tasks from running until manually resumed.
- **System Labels**: Prevent edits from the UI with `system.readOnly` label and track cross-execution dependencies with `system.correlationId` label.

**For Enterprise Edition users, this release brings additionally:**

- **Apps:** Build custom UIs for interacting with workflows through data-entry forms, approval panels, custom buttons, redirects, and more.
- **Team-level storage and secret isolation:** Ensure stricter data governance with physically isolated resources for each tenant or namespace.
- **Invitations:** Add new users to your tenant or instance by using the invitation process with email invites and pre-configured RBAC permissions.
- **Announcements:** Communicate planned maintenance or incidents with in-app banners.
