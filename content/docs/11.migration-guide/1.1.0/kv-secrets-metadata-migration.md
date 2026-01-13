---
title: Key-value Store and Secrets Metadata Migration
icon: /docs/icons/migration-guide.svg
release: 1.1.0
editions: ["OSS", "EE"]
---

## Overview

In version **1.1.0**, we improved the backend logic that powers **Key-Value Pairs** and **Secrets** (Enterprise Edition) search in the Kestra UI.  
Previously, the UI fetched *all* stored pairs, which could become resource-intensive and inefficient in environments with a large number of entries.  

To enhance performance and scalability, this release introduces **metadata indexing** that allows the backend to query these resources more efficiently.

---

## Impact

Because of this change, you must run a metadata migration when upgrading to version **1.1.0** (or later).  
This ensures existing Key-Value and Secrets (EE) data are correctly indexed for the new query structure.

When upgrading, include the migration command `- /app/kestra migrate metadata` in your startup configuration.
For example, if you’re using **Docker Compose**, start your container with the newest version image and add the migration script in `command` as follows:


```yaml
kestra:
  image: registry.kestra.io/docker/kestra:latest
  command:  migrate metadata kv
```

and then do the same with

```yaml
kestra:
  image: registry.kestra.io/docker/kestra:latest
  command:  migrate metadata secrets
```

:::alert{type="info"}
Secrets metadata migration is only necessary for Enterprise users. Open-source users will see an exception error: `❌ Secrets Metadata migration failed: Secret migration is not needed in the OSS version`.
:::

Once the migration is complete, the container will stop automatically. You can then move back to the usual command to run the server:

```yaml
kestra:
    image: registry.kestra.io/docker/kestra:latest
    command:
        - server standalone --worker-thread=128
```

Similarly, for Kubernetes installations, run a pod with the migration script (`- /app/kestra migrate metadata kv && /app/kestra migrate metadata secrets`), so the KV Store and Secrets databases are updated. Then, restart your normal pod for Kestra server components without the script.

:::alert{type="warning"}
If you upgrade to **1.1.0** without running the migration script, the **Key-Value Store** and **Secrets** pages in the UI will appear empty.  
This is only a **UI issue** — your flows and tasks will continue to run normally and access their values as expected.  

To fix the UI display, simply run the migration command above.  
It’s safe to execute this migration **retroactively** after the upgrade if needed.
:::
