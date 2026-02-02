---
title: Restore Kafka queue
description: Kafka Queue Restore for Kestra 0.20.0 (Enterprise). Instructions to run the `sys-ee restore-queue` command to sync flow source code for plugin defaults.
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---


## Restore Kafka queue

Migration guide for Kafka backend users

Due to a change in how we handle plugin defaults, the flow source needs to be available to the Kestra Executor. This change will sync the flow's source code with our queue allowing the executor to more efficiently apply `pluginDefaults` defined in the flow YAML configuration.

For users with a Kafka backend, this migration can be performed by running the following CLI command:
```bash
./kestra sys-ee restore-queue --no-recreate --no-templates --no-triggers --no-namespaces --no-tenants
```

If you are using a Kestra version with the JDBC backend, this change doesn't apply to you, and you don't need to run the above command.
