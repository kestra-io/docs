---
title: Restore Kafka Queue in Kestra 0.20.0 Enterprise
h1: How to Run sys-ee restore-queue for Kafka in Kestra 0.20.0
sidebarTitle: Restore Kafka Queue
description: Kafka Queue Restore for Kestra 0.20.0 (Enterprise). Instructions to run the `sys-ee restore-queue` command to sync flow source code for plugin defaults.
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---


## Restore Kafka queue

Migration guide for Kafka backend users

Due to a change in how Kestra handles plugin defaults, the flow source needs to be available to the Kestra Executor. This change syncs the flow source code with the queue, allowing the executor to apply `pluginDefaults` defined in the flow YAML configuration more efficiently.

For users with a Kafka backend, this migration can be performed by running the following CLI command:
```bash
./kestra sys-ee restore-queue --no-recreate --no-templates --no-triggers --no-namespaces --no-tenants
```

If you are using a Kestra version with the JDBC backend, this change doesn't apply to you, and you don't need to run the above command.
