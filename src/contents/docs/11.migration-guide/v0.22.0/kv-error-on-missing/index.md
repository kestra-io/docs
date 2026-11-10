---
title: KV Function Now Errors on Missing Keys in 0.22.0
h1: "Breaking Change: kv() Throws an Error When a Key Is Missing"
sidebarTitle: "kv() Missing Key Error"
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.22.0
editions: ["OSS", "EE"]
description: Change in default behavior of the kv() function to throw an error when a key is missing in Kestra 0.22.0.
---


## KV function errors on missing key

New default behavior of the KV function

Before Kestra 0.22, the `kv()` function had the property `errorOnMissing` set to `false` by default. It was changed to `true` to align with the rest of the system — for example, the `secret()` function throws an error when the secret is missing.

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
