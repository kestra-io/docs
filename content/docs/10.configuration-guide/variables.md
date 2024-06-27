---
title: Variables
icon: /docs/icons/admin.svg
---

How to configure variables usage in Kestra.

## `kestra.variables.env-vars-prefix`

Kestra provides a way to use environment variables in your flow. By default, Kestra will only look at environment variables that start with `KESTRA_`. You can change this prefix by setting the `env-vars-prefix` configuration option:

```yaml
kestra:
  variables:
    env-vars-prefix: KESTRA_
```

These variables will be accessible in a flow with `{{ envs.your_env }}` in **lowercase without the prefix**.

For example, an environment variable with the name `KESTRA_MY_ENV` can be accessed using `{{ envs.my_env }}`.

## `kestra.variables.globals`

You can also set global variables directly in the configuration file. These variables will be accessible in all flows across the instance.

For example, the following variable will be accessible in a flow using `{{ globals.host }}`:

```yaml
kestra:
  variables:
    globals:
      host: pg.db.prod
```

Keep in mind that if a variable is in camel case, it will be transformed into hyphenated case. For example, the global variable shown below will be accessible in flows with `{{ globals['my-var'] }}` or `{{ globals['environment-name'] }}`:

```yaml
kestra:
  variables:
    globals:
      environment_name: dev
      myVar: my variable
```

## `kestra.variables.recursive-rendering`

Flag enabling the pre-0.14.0 [template recursive rendering](../11.migration-guide/recursive-rendering.md) behavior and giving administrators more time to migrate deployed flows. Defaults to `false`.

## `kestra.variables.cache-enabled`

The rendering of template variables can be CPU intensive, and by default we **enable** a cache of "templates". You can disable it, even though it's recommended keeping it enabled.

## `kestra.variables.cache-size`

The rendering of template variables cache is an LRU cache (keeps most commonly used variables) and will be cached in memory (default `1000`). You can change the size of the template cache (in number of templates) using this configuration. Keep in mind that the higher this number will be, the more memory the server will use.
