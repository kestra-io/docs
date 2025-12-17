---
title: Namespace Files Metadata Migration
icon: /docs/icons/migration-guide.svg
release: 1.2.0
---

## Overview

If you are upgrading to 1.2.0 from an earlier version, you must run the Namespace Files metadata migration. This migration is required for **both runtime execution and UI visualization** — without it, Namespace Files may not be accessible:

- In flows/tasks that use Namespace Files (e.g., `namespaceFiles` or `read()`).
- In the Kestra UI (files missing, not browsable, or not selectable where expected).

## Required command

:::alert{type="warning"}
Before running the migration command, stop the main Kestra application to avoid inconsistent reads/writes during the metadata update.
:::

Run the following command once:

```shell
kestra migrate metadata nsfiles
```

After it completes, restart Kestra and verify:

- A task using `namespaceFiles` can `read()` the expected files.
- Namespace Files are visible and accessible in the UI.
