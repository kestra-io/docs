---
title: Audit Log's permissions are renamed to resources
icon: /src/contents/docs/icons/migration-guide.svg
release: 1.0.0
editions: ["EE"]
description: Renaming of the permissions property to resources in the PurgeAuditLogs task for consistency.
---


## Audit Log's permissions are renamed to resources

The `permissions` property used by the [PurgeAuditLogs](/plugins/core/log-ee/io.kestra.plugin.ee.core.log.purgeauditlogs) task is now called `resources`, aligning with the [AuditLogShipper](/plugins/core/log-ee/io.kestra.plugin.ee.core.log.auditlogshipper) task. The functionality remains the same, but you will need to change the property name in any flows using the task.

Additionally, the API, `/api/v1{/tenant}/auditlog/search`: filter on `permissions` is replaced by `resources`. This change is also reflected in the UI filter on the **Audit Logs** page.
