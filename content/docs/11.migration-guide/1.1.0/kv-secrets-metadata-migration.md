---
title: Key-value Store and Secrets Metadata Migration
icon: /docs/icons/migration-guide.svg
release: 1.1.0
editions: ["OSS", "EE"]
---

## Overview

In version **1.1.0**, we improved the backend logic that powers **Key-Value Pairs** and **Secrets** search in the Kestra UI.  
Previously, the UI fetched *all* stored pairs, which could become resource-intensive and inefficient in environments with a large number of entries.  

To enhance performance and scalability, this release introduces **metadata indexing** that allows the backend to query these resources more efficiently.

---

## Impact

Because of this change, you must run a metadata migration when upgrading to version **1.1.0** (or later).  
This ensures existing Key-Value and Secrets data are correctly indexed for the new query structure.

When upgrading, include the migration command `- /app/kestra migrate metadata` in your startup configuration.  
For example, if you’re using **Docker Compose**, update your service definition as follows:

```yaml
kestra:
    image: registry.kestra.io/docker/kestra:latest
    commands:
        - server standalone --worker-thread=128
        - /app/kestra migrate metadata
```

::alert{type="warning"}
If you upgrade to **1.1.0** without running the migration script, the **Key-Value Store** and **Secrets** pages in the UI will appear empty.  
This is only a **UI issue** — your flows and tasks will continue to run normally and access their values as expected.  

To fix the UI display, simply run the migration command above.  
It’s safe to execute this migration **retroactively** after the upgrade if needed.
::
