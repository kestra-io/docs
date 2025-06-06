---
title: The autocommit property removed from JDBC Query and Queries tasks
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS", "EE"]
---

## Overview

The `autocommit` property [has been removed](https://github.com/kestra-io/plugin-jdbc/issues/550) from both the Query and Queries tasks in the [JDBC plugin](https://github.com/kestra-io/plugin-jdbc).

### **Reason for change**

The `Query` task executes a single statement and does not support multi-step transactions; autocommit is not relevant. The `Queries task` processes all contained queries within a single transaction by default; autocommit has no effect.

### **Impact**

The `autocommit` property is no longer configurable in either task. You must remove any usage of the `autocommit` property in your existing flows, as using it will raise an error.


