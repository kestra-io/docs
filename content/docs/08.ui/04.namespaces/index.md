---
title: Namespaces
icon: /docs/icons/ui.svg
---

Manage resources associated with a namespace in one place.

Starting in 0.18.0, Kestra has introduced the Namespaces tab in the Kestra UI for OSS. In this tab, you can see all the namespaces associated with the different flows in Kestra.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/MbG9BHJIMzU?si=9gVEROGc5hXcIJR2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Overview

This is the default landing page of the Namespace. This page contains the dashboards and summary about the executions of different flows in this namespace.

![Overview](/docs/user-interface-guide/overview-namespaces.png)

## Editor

The built-in editor is where you can add/edit namespace files. This acess makes it easier to edit just your namespace files without needing to select a flow inside of the namespace.

![Editor](/docs/user-interface-guide/editor-namespaces.png)

## Flows

The Flows tab shows all the flows in the namespace. It gives a summary about each of the flows including the flow ID, labels, last execution date and last execution status, and the execution statistics. By selecting the details button on the right of the flow, you can navigate to that flow's page.

![Flows](/docs/user-interface-guide/flows-namespaces.png)

## Dependencies

The Dependencies tab shows all the flows and which ones are dependent on each other (e.g., through Subflows or Flow Triggers).

This is similar to the Dependencies page in the Flow Editor, but this page shows you how all flows within a namespace relate even if some of them don't depend on any others.

![Dependencies](/docs/user-interface-guide/dependencies-namespaces.png)

## KV Store

From the KV Store tab, manage the key-values pairs associated with a namespace. More details, check out the [KV Store concept guide](../../05.concepts/05.kv-store.md).

![KV Store](/docs/user-interface-guide/kvstore-namespaces.png)

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/CNv_z-tnwnQ?si=llG-CMXRBG9PG3nF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Additional Enterprise pages

In the Enterprise Edition, there's a number of additional pages that give you richer insight and control over your namespaces. To read more about them, check out the page below:

::ChildCard
::