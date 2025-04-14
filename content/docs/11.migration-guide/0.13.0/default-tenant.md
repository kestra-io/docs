---
title: Sync Users Access to a Default Tenant
icon: /docs/icons/migration-guide.svg
release: 0.13.0
editions: ["EE", "Cloud"]
---

Adjusting users' access to the default tenant.

## Overview

In the [v0.13.0 release](/blogs/2023-11-16-release-0-13.md), we introduced multitenancy. As a result, user's access is now managed at the tenant level.

## Migration

After upgrading to v0.13.0, you will need to adjust your users' access to make it consistent with the new multitenancy model. To make this process easier, there is a new `kestra-ee auths users sync-access` command available in the Kestra CLI that allows you to automatically sync users' access to a default tenant.

Run the following command:

```bash
kestra-ee auths users sync-access
```

Here is a detailed command usage for reference:

```bash
Usage: kestra-ee auths users sync-access [-hVv] [--internal-log] [-c=<config>]
       [-l=<logLevel>] [-p=<pluginsPath>]
Sync users access with the default Tenant.
This command is designed to be used when enabling multi-tenancy on an existing
Kestra instance, in this case the existing user will need to have their access
synchronized if they need access to the default tenants (groups and roles will
be synchronized)
  -c, --config=<config>   Path to a configuration file
                            Default: /home/kestra/.kestra/config.yml
  -h, --help              Show this help message and exit.
      --internal-log      Change also log level for internal log
  -l, --log-level=<logLevel>
                          Change log level (values: TRACE, DEBUG, INFO, WARN,
                            ERROR)
                            Default: INFO
  -p, --plugins=<pluginsPath>
                          Path to plugins directory
                            Default: /app/plugins
  -v, --verbose           Change log level. Multiple -v options increase the
                            verbosity.
  -V, --version           Print version information and exit.
```

## Summary

Running the `kestra-ee auths users sync-access` command will perform the necessary migration to make your users' access consistent with the new multitenancy model.
