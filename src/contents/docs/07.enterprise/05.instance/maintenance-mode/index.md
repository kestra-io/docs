---
title: "Maintenance Mode in Kestra Enterprise: Safe Upgrades"
h1: Pause New Executions Safely During System Upgrades
description: Safely upgrade with Kestra Maintenance Mode. Pause new executions while allowing running tasks to complete for seamless system updates.
sidebarTitle: Maintenance Mode
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: "0.21.0"
---

Prepare your Kestra instance for maintenance or migration.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/CyGBCgEEcB0?si=LMS7gbv9uq_5Eb7p" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## How maintenance mode works

When activated:

- The [executor](../../../08.architecture/02.server-components/index.md#executor) stops processing new executions and queues them automatically.
- [Workers](../../../08.architecture/02.server-components/index.md#worker) finish their current tasks without picking up new ones.
- The [web server](../../../08.architecture/02.server-components/index.md#webserver) and [scheduler](../../../08.architecture/02.server-components/index.md#scheduler) remain active — no requests are lost.

## Enter maintenance mode

Go to **Settings → Super Admin → Instance → Services** and click **Enter maintenance mode** in the top-right corner. A confirmation prompt explains what will happen before the transition begins. To exit, click the same button and confirm you want to return to a live state.
