---
title: Terraform task_defaults to plugin_defaults in 0.18.0
h1: "Update Terraform Configs: Migrate task_defaults to plugin_defaults"
sidebarTitle: task_defaults → plugin_defaults
description: Migrate from Terraform task_defaults to plugin_defaults in Kestra 0.18.0. Update your Terraform configurations to use the new plugin_defaults property.
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.18.0
---


## Deprecation of Terraform task_defaults in favor of plugin_defaults

How to migrate `task_defaults` to `plugin_defaults` for the Kestra Terraform Provider.

In the [v0.17.0 release](../../../../blogs/2024-06-04-release-0-17/index.md), Task Defaults was renamed to [Plugin Defaults](../../../05.workflow-components/09.plugin-defaults/index.md) to better reflect its purpose. As a result, the 0.18.0 version of the [Terraform Provider](../../../13.terraform/index.mdx) now uses the property `plugin_defaults` instead of `task_defaults` in the `kestra_namespace` resource.

To migrate, replace `task_defaults` with `plugin_defaults` in your Terraform configuration before upgrading your Kestra Terraform provider.
