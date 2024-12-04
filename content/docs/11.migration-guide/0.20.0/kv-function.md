---
title: Retrieving KV pairs from other namespaces
icon: /docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---

Migrating usage of KV functions

## Overview

The `kv()` Pebble function was missing a check for allowed namespace in case a namespace is passed to the function e.g. `{{ kv('MY_KEY', 'differentNamespace') }}`. This check has been added in 0.20 release. If you use the `kv()` function to get a KV from a different namespace in the Enterprise Edition, make sure to allow access to this namespace (this happens by default unless explicitly restricted).
