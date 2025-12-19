---
title: Namespaces
icon: /docs/icons/ui.svg
---

Manage all resources associated with a namespace in one place.

Starting in **v0.18.0**, Kestra introduces the **Namespaces** tab in the UI for Open Source users. This view displays all namespaces associated with different flows in your Kestra instance.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/MbG9BHJIMzU?si=9gVEROGc5hXcIJR2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Interactive demo

Explore the Namespace UI through this interactive demo (Kestra v0.23):

<div style="position: relative; padding-bottom: calc(48.95833333333333% + 41px); height: 0; width: 100%;"><iframe src="https://demo.arcade.software/5CbeQf4naMpPJvz8mNbk?embed&embed_mobile=inline&embed_desktop=inline&show_copy_link=true" title="Namespaces | Kestra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

## Overview

The **Overview** tab is the default landing page of a namespace. It displays dashboards and summaries of flow executions within that namespace.

![Overview](/docs/user-interface-guide/overview-namespaces.png)

## Editor

The **Editor** tab allows you to add or edit namespace files directly. This provides convenient access to manage namespace files without navigating to a specific flow.

![Editor](/docs/user-interface-guide/editor-namespaces.png)

## Flows

The **Flows** tab lists all flows within the namespace. It displays key information such as the flow ID, labels, last execution date and status, and execution statistics. Selecting the **details** button on a flow opens its detailed page.

![Flows](/docs/user-interface-guide/flows-namespaces.png)

## Dependencies

The **Dependencies** tab visualizes relationships between flows, showing which flows depend on one another (for example, through subflows or flow triggers).

This view is similar to the **Dependencies** page in the Flow Editor but focuses on inter-flow relationships within a single namespace — even if some flows are independent.

![Dependencies](/docs/user-interface-guide/dependencies-namespaces.png)

## KV store

The **KV Store** tab lets you manage key-value pairs associated with a namespace.  
For more information, see the [KV Store concept guide](../../06.concepts/05.kv-store.md).

![KV Store](/docs/user-interface-guide/kvstore-namespaces.png)

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/CNv_z-tnwnQ?si=llG-CMXRBG9PG3nF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Files

The **Files** tab lets you create, edit, and manage Namespace Files used in your flows — from custom Python scripts to images. Keep all your resources organized in one place. Learn more in [Namespace Files](../../06.concepts/02.namespace-files.md).

![Namespace Files](/docs/user-interface-guide/namespace-files-tab.png)

## Additional enterprise pages

In the [Enterprise Edition](../../07.enterprise/01.overview/01.enterprise-edition.md), additional namespace pages provide deeper insights and management capabilities.  
Learn more on the [Enterprise namespace pages](./ee.md) page.
