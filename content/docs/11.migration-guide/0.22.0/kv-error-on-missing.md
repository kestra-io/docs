---
title: KV function errors on missing key
icon: /docs/icons/migration-guide.svg
release: 0.22.0
editions: ["OSS", "EE"]
---

New default behavior of the KV function

## Overview

Before Kestra 0.22, the `kv()` function had the property `errorOnMissing` set to `false` by default. We changed it to `true` to align the behavior with the rest of the system e.g. the `secret()` function by default throws an error when the secret is missing.

If you want to keep the previous behavior of returning `null` without an error when attempting to fetch non-existing KV-pairs, use the syntax `"{{kv('NON_EXISTING_KV_PAIR', errorOnMissing=false)}}"`.

## Before Kestra 0.22

```yaml
id: myflow
namespace: company.team

tasks:
  - id: this_will_return_null
    type: io.kestra.plugin.core.log.Log
    message: Hello {{kv('NON_EXISTING_KV_PAIR')}} # Hello
```

## After Kestra 0.22

This flow will fail because the `kv()` function will throw an error when the key is missing:

```yaml
id: myflow
namespace: company.team

tasks:
  - id: this_will_fail
    type: io.kestra.plugin.core.log.Log
    message: Hello {{kv('NON_EXISTING_KV_PAIR')}} # Error
```

To keep the previous behavior, use the `errorOnMissing=false` syntax:

```yaml
id: myflow
namespace: company.team

tasks:
  - id: this_will_fail
    type: io.kestra.plugin.core.log.Log
    message: Hello {{kv('NON_EXISTING_KV_PAIR', errorOnMissing=false)}} # Hello
```
