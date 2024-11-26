---
title: Local Flow Synchronization
icon: /docs/icons/admin.svg
---

Sync Flows from a local directory.

How to synchronize flows from a local directory on a local development instance.

## Configure your instance

::alert{type="warning"}
This feature is only for local development, that is why you can not connect to a distant Kestra instance.
::

When developing on a local Kestra instance, it can be more convenient to have your flows in a local directory, maybe synchronize with a GitHub repository, and have Kestra automatically load them.

Below is the minimal configuration to enable local flow synchronization:

```yaml
micronaut:
  io:
    watch:
      enabled: true
      paths:
        - /path/to/your/flows
```

Multiple paths can be provided, and nested files will also be watched.
Files have to end with `.yml` or `.yaml` to be considered as a flow. And only valid flows will be loaded, invalid flows will be ignored.
Flow created inside the UI will be created at the root of the first path supplied in the configuration.

## Details

At startup, every file in the watched directory will be loaded into the database. Then every flow not existing in the watched directory will be created in the first path supplied in the configuration.

When a file is created, updated, or deleted in the watched directory, Kestra will automatically load the flow into the database or remove it if the file is deleted.
If a flow is created, updated or deleted in the UI, the file will be created, updated or deleted in the watched directory.

In the Kestra UI, you cannot change an ID nor a namespace, but in a file you can, in this case, the previous flow will be deleted, and a new one created.
