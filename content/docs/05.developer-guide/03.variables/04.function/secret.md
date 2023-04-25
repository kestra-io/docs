---
title: secret (EE)
---

::alert{type="warning"}
Secret management is an [Enterprise Edition](https://kestra.io/enterprise) feature.
::

The `secret` function is used to retrieve a secret from a secret management back-end based on the secret key.

Look at the following flow:


```yaml
id: secret
namespace: io.kestra.tests

tasks:
  - id: myTask
    type: io.kestra.core.tasks.debugs.Return
    format: "{{secret('my-key')}}"
```

The `secret('key')` function will lookup up the configured secret manager back-end for a secret with the key `my-key` and output it in the property. If the key is missing, an exception will be raised.
