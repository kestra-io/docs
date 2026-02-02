---
title: Custom plugins
description: Custom Plugin migration for Kestra 0.20.0. Update plugins to handle the mandatory `namespace` parameter in internal storage methods.
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.20.0
---


## Custom plugins

Migrating custom plugins

The internal storage [now takes](https://github.com/kestra-io/kestra/pull/6022) a `namespace` parameter on all its methods. This is mandatory to be passed by a plugin but can be safely set as `null` in tests that directly use the internal storage. Plugins are normally not affected if they use the `runContext().storage()` method that has been updated to automatically use the execution's namespace.
