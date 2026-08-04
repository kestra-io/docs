---
title: "Flow Revisions in Kestra: Versioning and Rollbacks"
h1: Version and Roll Back Your Flows with Revisions
description: Track and manage flow versions in Kestra with built-in revision history. Roll back to any previous version to undo changes and maintain reliability.
sidebarTitle: Revision
icon: /src/contents/docs/icons/concepts.svg
---

Manage versions of flows.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/lpHl52Rlvr0?si=RyPvvhGNkTmskLKP" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

Flows are versioned by default. Whenever you make any changes to your flows, a new revision is created. This allows you to rollback to a previous version of your flow if needed.

The **Revisions** tab of a flow lists all its revisions. Compare two revisions side-by-side or line-by-line, and roll back to a previous revision if needed.

![revisions](./revisions.png)

## Draft revisions

When you click **Save as draft** in the flow editor, Kestra saves your changes as a draft revision rather than publishing them immediately.

:::alert{type="warning"}
Executions do not run against a draft revision. If the latest revision of a flow is a draft, any execution — whether triggered manually, by a schedule, or by an event — will run against the last published revision instead. A warning banner in the run panel makes this explicit.
:::

To make your latest changes active, click **Execute** on the flow — the run panel displays a draft warning banner with a **Publish** button that promotes the draft to a published revision.

Use **Save as draft** when you want to stage changes without affecting running executions — for example, while iterating on a flow that is already in production.
