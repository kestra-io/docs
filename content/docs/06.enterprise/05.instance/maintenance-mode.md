---
title: Maintenance Mode
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: "0.21.0"
---

Prepare your Kestra instance for maintenance or migration.

Maintenance Mode is an enterprise feature designed to transition your Kestra instance into a paused state to conduct maintenance operations such as platform updates.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/CyGBCgEEcB0?si=LMS7gbv9uq_5Eb7p" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Maintenance Mode

Maintenance Mode addresses a common challenge faced by organizations running numerous workflows: finding the right moment to perform platform updates without disrupting ongoing operations. When activated, Maintenance Mode introduces a controlled state where:

- The [executor](../../07.architecture/04.executor.md) stops processing new executions and automatically queues new flow executions.
- Existing executions are allowed to be completed gracefully ([workers](../../07.architecture/05.worker.md) complete their current tasks without picking up new ones).
- The platform continues to accept and schedule new executions, storing them for later processing ([web server](../../07.architecture/08.webserver.md) and [scheduler](../../07.architecture/06.scheduler.md) components remain active, ensuring no requests are lost).
- New executions are queued for processing after maintenance concludes

## Access Maintenance Mode

Maintenance Mode is accessible via the **Instance** tab of the **Administration** section of the Kestra UI. You can switch to maintenance mode in the **Overview** tab by clicking the **enter maintenance mode** button. This triggers a confirmation prompt and displays information regarding the transition into maintenance mode.

![Enter Maintenance Mode](/docs/enterprise/maintenance-mode.png)

After completing all maintenance operations, you can exit maintenance mode with the same button and confirm that you want to switch back to a live state of your Kestra instance.
