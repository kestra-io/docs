---
title: 0.23.0
icon: /docs/icons/migration-guide.svg
release: 0.23.0
---

Deprecated features and migration guides for 0.23.0 and onwards.


:::alert{type="warning"}
Make sure to export all your flows before starting the upgrade process to have a backup in case the upgrade doesn't go as planned. To do that, go to your Profile → Settings → scroll down to the bottom and click on "Export All Flows". This will download a ZIP file containing all your flows.

Tenant is now required; `defaultTenant` (null tenant) is no longer supported. Kestra now always requires a tenant context in both OSS and Enterprise editions. A migration is required to upgrade to 0.23:
- [Open Source](./tenant-migration-oss.md)
- [Enteprise](./tenant-migration-ee.md)
:::

:::ChildCard
:::
