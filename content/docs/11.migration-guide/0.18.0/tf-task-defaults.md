---
title: Deprecation of Terraform `task_defaults` in favor of `plugin_defaults`
icon: /docs/icons/migration-guide.svg
release: 0.18.0
---

How to migrate `task_defaults` to `plugin_defaults` for the Kestra Terraform Provider.

In a previous release, we renamed Task Defaults to Plugin Defaults as this better suited its purpose. As a result of this, the `task_defaults` prop in our Terraform Provider is now depreciated in favor of `plugin_defaults`.

In order to migrate your existing Terraform configuration, you will need to rename instances of `task_defaults` to `plugin_defaults`. Once this is done, everything should work as expected.
