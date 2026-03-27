---
title: Migrate from Open Source to Enterprise Edition
description: How to migrate your flows and data from Kestra Open Source to Enterprise Edition.
sidebarTitle: Migrate from Open Source
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
---

How to migrate your flows and data from Kestra Open Source to Enterprise Edition.

## Migrate from Open Source to Enterprise Edition

When you start **Kestra Enterprise Edition**, you can bring your existing flows from the open-source version. This guide covers how to export and import flows, and what to keep in mind for other resources.

## Export and import flows

Kestra provides a built-in export/import mechanism for flows:

1. In the **Open Source** UI, go to **Settings**.
2. Click **Export All Flows** to download a single `.zip` file containing all your flows.
3. In the **Enterprise Edition** UI, go to **Flows**.
4. Click **Import** and select the `.zip` file you downloaded.

This will import all flows into your Enterprise Edition instance.

## Namespace files, KV store, and other resources

**Namespace Files** and the **Key-Value Store** data are not included in the flow export. If you rely on these, you will need to migrate them manually.

For **Namespace Files**, re-upload the files through the Enterprise Edition UI or use the [API](../../../api-reference/index.mdx). For the **KV Store**, recreate the entries in your new instance.

## What's next

Once your flows are imported, you can start using enterprise features such as [RBAC](../../03.auth/rbac/index.md), [Secrets Management](../../02.governance/secrets/index.md), [Worker Groups](../../04.scalability/worker-group/index.md), and more.
