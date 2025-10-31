---
title: Default environment variable prefix changed from KESTRA_ to ENV_ for security
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS", "EE"]
---

## Overview

Kestra [previously defaulted](https://github.com/kestra-io/kestra-ee/issues/3131) to autoloading environment variables with the prefix `KESTRA_` into flows. This posed a security risk, as Micronaut allows overriding configuration using environment variables and translates non-alphanumeric characters (such as `:` in `kestra:storage:type`) into underscores, producing env vars like `KESTRA_STORAGE_TYPE`. If a sensitive value (e.g., a storage password) was provided via an environment variable starting with `KESTRA_`, it would be available in all flows, increasing the risk of secret exposure.

### 0.23 change

- The default prefix for autoloaded environment variables is now `ENV_` (instead of `KESTRA_`).
- Any variable you want to expose in flows must now start with `ENV_` by default (unless you configure a custom prefix).
- The `KESTRA_CONFIGURATION` env var still uses `KESTRA_` as the configuration key (**unchanged**).

### How to use

In your Docker Compose or environment configuration, set environment variables using the `ENV_` prefix rather than the `KESTRA_` prefix:

```yaml
kestra:
  image: kestra/kestra:latest
  environment:
    ENV_MY_VARIABLE: extra variable value
    ENV_NEW_VARIABLE: new variable value
    KESTRA_CONFIGURATION:
      kestra:
        variables:
          env-vars-prefix: "ENV_" # this is now the default as of v0.23
```

You can reference these in your flows as `{{ envs.my_variable }}` and `{{ envs.new_variable }}`.

To use a custom prefix e.g., `PROD_`:

```yaml
kestra:
  image: kestra/kestra:latest
  environment:
    PROD_MY_VARIABLE: extra variable value
    KESTRA_CONFIGURATION:
      kestra:
        variables:
          env-vars-prefix: "PROD_"
```

### Required Action

Review and update any existing environment variables that used the `KESTRA_` prefix for flow variables and make sure that you now use `ENV_` or your custom prefix. No changes are needed for configuration properties that use `KESTRA_CONFIGURATION`. For more details, check the [Environment Variables Prefix documentation](../../configuration/index.md#environment-variables-prefix).
