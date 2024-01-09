---
title: secret
---

The `secret()` function is used to retrieve a secret from a secret backend based on the key provided as input to that function.

Here is an example flow that retrieves the Personal Access Token secret stored using the secret key `GITHUB_ACCESS_TOKEN`:


```yaml
id: secret
namespace: dev

tasks:
  - id: githubPAT
    type: io.kestra.core.tasks.log.Log
    message: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
```

The `secret('key')` function will lookup up the configured secret manager backend for a secret value using the key `GITHUB_ACCESS_TOKEN`. If the key is missing, an exception will be raised. The example flow shown above will look up the secret value by key and will log the output with the secret value.

::alert{type="warning"}
The purpose of this example is to show how to use secrets in your flows. In practice, **you should avoid logging sensitive information**.
::

There are some differences between the secret management backend in the Open-Source and Enterprise editions. By default, Kestra provides a secret management backend based on environment variables. Each environment variable starting with `SECRET_` will be available as a secret, and its value must be base64-encoded.

The above example will:
1. retrieve the secret `GITHUB_ACCESS_TOKEN` from an environment variable `SECRET_GITHUB_ACCESS_TOKEN`
2. base64-decode it at runtime.

See the [Secrets section](../../secret.md) in the Developer Guide for more details.

