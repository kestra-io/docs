---
title: Encryption Configuration
icon: /docs/icons/admin.svg
---

Kestra 0.15.0 and later supports encryption of sensitive data.


This allows inputs and outputs to be automatically encrypted and decrypted when they are stored in the database.

## `kestra.encryption`

To enable encryption, you need to provide a secret key in the configuration:

```yaml
kestra:
  encryption:
    secret-key: RANDOMLY_GENERATED_STRING_OF_32_CHARCTERS
```

If the above configuration is not set, you will get an error: `Illegal argument: Unable to use a SECRET input as encryption is not configured` when trying to use a `SECRET` input or output type.

Once the secret key is set, you can use an input and output type `SECRET`:

```yaml
id: my_secret_flow
namespace: dev

inputs:
  - id: secret
    type: SECRET

tasks:
  - id: mytask
    type: io.kestra.core.tasks.log.Log
    message: task that needs secret to connect to external systems

outputs:
  - id: secret_output
    type: SECRET
```

When executing this flow, you will see a masked field:

![secret1](/docs/configuration-guide/secret1.png)


In Execution Overview tab, you will see a masked value of the secret.

