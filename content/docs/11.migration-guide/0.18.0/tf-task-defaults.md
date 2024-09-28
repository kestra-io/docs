---
title: Deprecation of Terraform task_defaults in favor of plugin_defaults
icon: /docs/icons/migration-guide.svg
release: 0.18.0
---

How to migrate `task_defaults` to `plugin_defaults` for the Kestra Terraform Provider.

In the [v0.17.0 release](/blogs/2024-06-04-release-0-17.md), we renamed Task Defaults to [Plugin Defaults](../../04.workflow-components/09.plugin-defaults.md) as this better reflects their purpose. As a result, the 0.18.0 version of the [Terraform Provider](../../13.terraform/index.md) now uses the property `plugin_defaults` instead of `task_defaults` in the `kestra_namespace` resource.

In order to migrate to the new version, simply replace `task_defaults` with `plugin_defaults` in your Terraform configuration before you upgrade your Kestra Terraform provider.
