---
title: Encryption Configuration
icon: /docs/icons/admin.svg
---

Kestra 0.15.0 and later supports encryption of sensitive data.


This allows inputs and outputs to be automatically encrypted and decrypted when they are stored in the database.

## `kestra.encryption`

To enable encryption, you need to provide a base64-encoded secret key in the configuration:

```yaml
kestra:
  encryption:
    secret-key: BASE64_ENCODED_STRING_OF_32_CHARCTERS
```

To generate a 32-character string and then base64 encode it, you can use the defacto standard for cryptography, OpenSSL:

```bash
openssl rand -base64 32
```

If you don't have OpenSSL installed, you can use the following Bash commands to generate a base64-encoded 32-character encryption key:

```bash
random_string=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32)
echo "$random_string" | base64
```

If you run Kestra with Docker-Compose, here is how you can add that key in the `KESTRA_CONFIGURATION` environment variable in your `docker-compose.yml` file:

```yaml
  kestra:
    image: kestra/kestra:latest-full
    environment:
      KESTRA_CONFIGURATION: |
        kestra:
          encryption:
            secret-key: NWRhUDc5TERWY2QyMDhSSHhfeWYzbjJpNE5vb3M5NnY=
```


Once the secret key is set, you can use an `input` and `output` of type `SECRET`:

```yaml
id: my_secret_flow
namespace: dev

inputs:
  - id: secret
    type: SECRET

tasks:
  - id: mytask
    type: io.kestra.plugin.core.log.Log
    message: task that needs the secret to connect to an external system

outputs:
  - id: secret_output
    type: SECRET
    value: "{{ inputs.secret }}"
```

When executing this flow, you will see a masked field:

![secret1](/docs/configuration-guide/secret1.png)


In the Execution Overview tab, you will see a masked value of the secret.

::alert{type="warning"}
If the `secret-key` is not set in the `kestra.encryption` configuration, you will get an error: `Illegal argument: Unable to use a SECRET input as encryption is not configured` when trying to use a `SECRET` input or output type.
::