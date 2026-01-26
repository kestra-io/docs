---
title: Maintenance Mode in Kestra Enterprise – Pause for Upgrades
description: Safely upgrade with Kestra Maintenance Mode. Pause new executions while allowing running tasks to complete for seamless system updates.
sidebarTitle: Maintenance Mode
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: "0.21.0"
---

Prepare your Kestra instance for maintenance or migration.

Maintenance Mode is an enterprise feature designed to transition your Kestra instance into a paused state to conduct maintenance operations such as platform updates.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/CyGBCgEEcB0?si=LMS7gbv9uq_5Eb7p" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Maintenance mode – pause for upgrades

Maintenance Mode addresses a common challenge faced by organizations running numerous workflows: finding the right moment to perform platform updates without disrupting ongoing operations. When activated, Maintenance Mode introduces a controlled state where:

- The [executor](../../../08.architecture/02.server-components/index.md#executor) stops processing new executions and automatically queues new flow executions.
- Existing executions are allowed to be completed gracefully ([workers](../../../08.architecture/02.server-components/index.md#worker) complete their current tasks without picking up new ones).
- The platform continues to accept and schedule new executions, storing them for later processing ([web server](../../../08.architecture/02.server-components/index.md#webserver) and [scheduler](../../../08.architecture/02.server-components/index.md#scheduler) components remain active, ensuring no requests are lost).
- New executions are queued for processing after maintenance concludes

## Access maintenance mode

Maintenance Mode is accessible via the **Instance** menu section of the Kestra UI. You can switch to maintenance mode in the **Services** tab by clicking the **enter maintenance mode** button. This triggers a confirmation prompt and displays information regarding the transition into maintenance mode.

![Enter Maintenance Mode](./maintenance-mode.png)

After completing all maintenance operations, you can exit maintenance mode with the same button and confirm that you want to switch back to a live state of your Kestra instance.
