---
title: Kestra EE CLI
icon: /docs/icons/admin.svg
---

How to interact with Kestra Enterprise Edition using the CLI.

::alert{type="info"}
This feature requires a [commercial license](/pricing).
::

## Authentication

The Kestra CLI uses the same authentication as the [Kestra API](/docs/enterprise/api). You can use the `--api-token` option to authenticate with the API.

```shell
kestra-ee --api-token <your-api-token> --help
```

## kestra-ee

```bash
Usage: kestra-ee [-hV] [COMMAND]

Options:
  -h, --help      Show this help message and exit.
  -V, --version   Print version information and exit.

Commands:
  plugins    handle plugins
  server     handle servers
  flow       handle flows
  template   handle templates
  sys        handle systems maintenance
  configs    handle configs
  namespace  handle namespaces
  auths      handle auths
  sys-ee     handle kestra ee systems maintenance
  tenants    handle tenants
```

## kestra-ee auths

```bash
Usage: kestra-ee auths [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
                       [-p=<pluginsPath>] [COMMAND]
handle auths
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
Commands:
  users  handle users
```

Here is the list of available commands withing `kestra-ee auths`:

- `kestra-ee auths users`

```bash
Usage: kestra-ee auths users [-hVv] [--internal-log] [-c=<config>]
                             [-l=<logLevel>] [-p=<pluginsPath>] [COMMAND]
handle users
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
Commands:
  create       Create a new users
  sync-access  Sync users access with the default Tenant.
               This command is designed to be used when enabling multi-tenancy
                 on an existing Kestra instance, in this case the existing user
                 will need to have their access synchronized if they need
                 access to the default tenants (groups and roles will be
                 synchronized)
  refresh      Refresh users to update their properties
  set-type     Set type of a user between STANDARD and SUPER_ADMIN.
```

- `kestra-ee auths users sync-access`

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

- `kestra-ee auths users refresh`

```bash
Usage: kestra-ee auths users refresh [-hVv] [--internal-log] [-c=<config>]
                                     [-l=<logLevel>] [-p=<pluginsPath>]
Refresh users to update their properties
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

- `kestra-ee auths users set-type`

```bash
Usage: kestra-ee auths users set-type [-hVv] [--internal-log] [-c=<config>]
                                      [-l=<logLevel>] [-p=<pluginsPath>] <user>
                                      <type>
Set type of a user between STANDARD and SUPER_ADMIN.
      <user>              User username
      <type>              User type between STANDARD and SUPER_ADMIN
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


- `kestra-ee auths users create`

```bash
Usage: kestra-ee auths users create [-hVv] [--admin] [--internal-log]
                          [--superadmin] [-c=<config>]
                          [-l=<logLevel>] [-p=<pluginsPath>]
                          [--tenant=<tenantId>] [--groups=<group>]...
                          <user> [<password>]
Create a new users
      <user>             User username
      [<password>]       User password
      --admin            Create the admin role if not exists and add it to
                         provided users; cannot be use at the same time as
                            --superadmin

-c, --config=<config>     Path to a configuration file
                            Default: /home/kestra/.kestra/config.yml
    --groups=<group>      User groups
-h, --help                Show this help message and exit.
    --internal-log        Change also log level for internal log
-l, --log-level=<logLevel>
                          Change log level (values: TRACE, DEBUG, INFO, WARN,
                            ERROR)
                            Default: INFO
-p, --plugins=<pluginsPath>
                          Path to plugins directory
                            Default: /app/plugins
    --superadmin          Create the superadmin role if not exists and add it
                            to provided users, cannot be use at the same time
                            as --admin
    --tenant=<tenantId>   tenant identifier
-v, --verbose             Change log level. Multiple -v options increase the
                            verbosity.
-V, --version             Print version information and exit.
```

Example command to create a Super Admin user:

```shell
kestra-ee auths users create --superadmin \
  --tenant=default admin admin_password123
```

Example command to create an Admin user:

```shell
kestra-ee auths users create --admin \
  --tenant=default admin admin_password123
```

Example command to create a regular user:

```shell
kestra-ee auths users create --tenant=default user user_password123
```


---

## kestra-ee flow

```bash
Usage: kestra-ee flow [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
                      [-p=<pluginsPath>] [COMMAND]
handle flows
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
Commands:
  validate   validate a flow
  test       test a flow
  namespace  handle namespace flows
  dot        generate a dot graph from a file
  export     export flows to a zip file
```

- `kestra-ee flow namespace`

```bash
Usage: kestra-ee flow namespace [-hVv] [--internal-log] [-c=<config>]
                                [-l=<logLevel>] [-p=<pluginsPath>] [COMMAND]
handle namespace flows
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
Commands:
  update  handle namespace flows
```

- `kestra-ee flow namespace update`

```bash
Usage: kestra-ee flow namespace update [-hVv] [--[no-]delete] [--internal-log]
                                       [-c=<config>] [-l=<logLevel>]
                                       [-p=<pluginsPath>] [--server=<server>]
                                       [--tenant=<tenantId>] [--user=<user:
                                       password>] [--headers=<name=value>]...
                                       <namespace> <directory>
handle namespace flows
      <namespace>           the namespace to update
      <directory>           the directory containing files for current namespace
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
      --[no-]delete         if missing should be deleted
  -h, --help                Show this help message and exit.
      --headers=<name=value>
                            Headers to add to the request
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --server=<server>     Kestra server url
                              Default: http://localhost:8080
      --tenant=<tenantId>   Tenant identifier (EE only, when multi-tenancy is
                              enabled)
      --user=<user:password>
                            Server user and password
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
```


- `kestra-ee flow test`

```bash
Usage: kestra-ee flow test [-hVv] [--internal-log] [-c=<config>]
                           [-l=<logLevel>] [-p=<pluginsPath>] <file>
                           [<inputs>...]
test a flow
      <file>              the flow file to test
      [<inputs>...]       the inputs to pass as key pair value separated by
                            space, for input type file, you need to pass an
                            absolute path.
                            Default: []
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

- `kestra-ee flow dot`

```bash
Usage: kestra-ee flow dot [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
                          [-p=<pluginsPath>] <file>
generate a dot graph from a file
      <file>              the flow file to display
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

- `kestra-ee flow export`

```bash
Usage: kestra-ee flow export [-hVv] [--internal-log] [-c=<config>]
                             [-l=<logLevel>] [--namespace=<namespace>]
                             [-p=<pluginsPath>] [--server=<server>]
                             [--tenant=<tenantId>] [--user=<user:password>]
                             [--headers=<name=value>]... <directory>
export flows to a zip file
      <directory>           the directory to export the file to
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
  -h, --help                Show this help message and exit.
      --headers=<name=value>
                            Headers to add to the request
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
      --namespace=<namespace>
                            the namespace of flows to export
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --server=<server>     Kestra server url
                              Default: http://localhost:8080
      --tenant=<tenantId>   Tenant identifier (EE only, when multi-tenancy is
                              enabled)
      --user=<user:password>
                            Server user and password
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
```


- `kestra-ee flow validate`

```bash
Usage: kestra-ee flow validate [-hVv] [--internal-log] [--local] [-c=<config>]
                               [-l=<logLevel>] [-p=<pluginsPath>]
                               [--server=<server>] [--tenant=<tenantId>]
                               [--user=<user:password>]
                               [--headers=<name=value>]... <directory>
validate a flow
      <directory>           the directory containing files to check
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
  -h, --help                Show this help message and exit.
      --headers=<name=value>
                            Headers to add to the request
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
      --local               If validation should be done locally or using a
                              remote server
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --server=<server>     Kestra server url
                              Default: http://localhost:8080
      --tenant=<tenantId>   Tenant identifier (EE only, when multi-tenancy is
                              enabled)
      --user=<user:password>
                            Server user and password
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
```

---

## kestra-ee tenants

```bash
Usage: kestra-ee tenants [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
                         [-p=<pluginsPath>] [COMMAND]
handle tenants
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
Commands:
  create  create a tenant and assign admin roles to an existing admin user
```


- `kestra-ee tenants create`

```bash
Usage: kestra-ee tenants create [-hVv] [--internal-log]
                                [--admin-username=<adminUser>] [-c=<config>]
                                [-l=<logLevel>] [-p=<pluginsPath>] <tenantId>
                                <tenantName>
create a tenant and assign admin roles to an existing admin user
      <tenantId>          tenant identifier
      <tenantName>        tenant description
      --admin-username=<adminUser>
                          Username of an existing admin user that will be admin
                            of this tenant
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

---

## kestra-ee plugins

```bash
Usage: kestra-ee plugins [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
                         [-p=<pluginsPath>] [COMMAND]
handle plugins
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
Commands:
  install  install a plugin
  list     list all plugins already installed
  doc      write documentation for all plugins currently installed
```

- `kestra-ee plugins install`

```bash
Usage: kestra-ee plugins install [-hVv] [--internal-log] [-c=<config>]
                                 [-l=<logLevel>] [-p=<pluginsPath>]
                                 [--repositories=<repositories>]...
                                 [<dependencies>...]
install a plugin
      [<dependencies>...]   the plugins to install
                              Default: []
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
  -h, --help                Show this help message and exit.
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --repositories=<repositories>
                            url to additional maven repositories
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
```

- `kestra-ee plugins list`

```bash
Usage: kestra-ee plugins list [-hVv] [--core] [--internal-log] [-c=<config>]
                              [-l=<logLevel>] [-p=<pluginsPath>]
list all plugins already installed
  -c, --config=<config>   Path to a configuration file
                            Default: /home/kestra/.kestra/config.yml
      --core              Also write core tasks plugins
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

- `kestra-ee plugins doc`

```bash
Usage: kestra-ee plugins doc [-hVv] [--core] [--icons] [--internal-log]
                             [-c=<config>] [-l=<logLevel>] [-p=<pluginsPath>]
                             <output>
write documentation for all plugins currently installed
      <output>            Path to write documentations files
                            Default: /tmp/6VA8fpHM6Jipu7caPPRpAY/docs
  -c, --config=<config>   Path to a configuration file
                            Default: /home/kestra/.kestra/config.yml
      --core              Also write core tasks docs files
  -h, --help              Show this help message and exit.
      --icons             Also write icon for each task
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

---

## kestra-ee server

```bash
Usage: kestra-ee server [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
                        [-p=<pluginsPath>] [COMMAND]
handle servers
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
Commands:
  executor    start an executor
  indexer     start an indexer
  scheduler   start an scheduler
  standalone  start a standalone server
  webserver   start the webserver
  worker      start a worker
  local       start a local server
```

### kestra-ee server executor

```bash
Usage: kestra-ee server executor [-hVv] [--internal-log] [-c=<config>]
                                 [-l=<logLevel>] [-p=<pluginsPath>]
                                 [--port=<serverPort>]
                                 [--skip-executions=<skipExecutions>[,
                                 <skipExecutions>...]]...
start an executor
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
  -h, --help                Show this help message and exit.
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --port=<serverPort>   the port to bind
      --skip-executions=<skipExecutions>[,<skipExecutions>...]
                            a list of execution identifiers to skip, separated
                              by a coma; for troubleshooting purpose only
                              Default: []
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
```

### kestra-ee server indexer

```bash
Usage: kestra-ee server indexer [-hVv] [--internal-log] [-c=<config>]
                                [-l=<logLevel>] [-p=<pluginsPath>]
                                [--port=<serverPort>]
start an indexer
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
  -h, --help                Show this help message and exit.
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --port=<serverPort>   the port to bind
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
```

### kestra-ee server scheduler

```bash
Usage: kestra-ee server scheduler [-hVv] [--internal-log] [-c=<config>]
                                  [-l=<logLevel>] [-p=<pluginsPath>]
                                  [--port=<serverPort>]
start an scheduler
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
  -h, --help                Show this help message and exit.
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --port=<serverPort>   the port to bind
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
```

### kestra-ee server standalone

```bash
Usage: kestra-ee server standalone [-hVv] [--internal-log] [-c=<config>]
                                   [-f=<flowPath>] [-l=<logLevel>]
                                   [-p=<pluginsPath>] [--port=<serverPort>]
                                   [--worker-thread=<workerThread>]
                                   [--skip-executions=<skipExecutions>[,
                                   <skipExecutions>...]]...
start a standalone server
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
  -f, --flow-path=<flowPath>
                            the flow path containing flow to inject at startup
                              (when running with a memory flow repository)
  -h, --help                Show this help message and exit.
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --port=<serverPort>   the port to bind
      --skip-executions=<skipExecutions>[,<skipExecutions>...]
                            a list of execution identifiers to skip, separated
                              by a coma; for troubleshooting purpose only
                              Default: []
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
      --worker-thread=<workerThread>
                            the number of worker thread
```

### kestra-ee server webserver

```bash
Usage: kestra-ee server webserver [-hVv] [--internal-log] [-c=<config>]
                                  [-l=<logLevel>] [-p=<pluginsPath>]
                                  [--port=<serverPort>]
start the webserver
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
  -h, --help                Show this help message and exit.
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --port=<serverPort>   the port to bind
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
```

### kestra-ee server worker

```bash
Usage: kestra-ee server worker [-hVv] [--internal-log] [-c=<config>]
                               [-g=<workerGroupKey>] [-l=<logLevel>]
                               [-p=<pluginsPath>] [--port=<serverPort>]
                               [-t=<thread>]
start a worker
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
  -g, --worker-group=<workerGroupKey>
                            the worker group key, must match the regex
                              [a-zA-Z0-9_-]+ (EE only)
  -h, --help                Show this help message and exit.
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --port=<serverPort>   the port to bind
  -t, --thread=<thread>     the max number of concurrent threads to launch
                              Default: 4
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
```

### kestra-ee server local

```bash
Usage: kestra-ee server local [-hVv] [--internal-log] [-c=<config>]
                              [-f=<flowPath>] [-l=<logLevel>]
                              [-p=<pluginsPath>] [--port=<serverPort>]
                              [--worker-thread=<workerThread>]
                              [--skip-executions=<skipExecutions>[,
                              <skipExecutions>...]]...
start a local server
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
  -f, --flow-path=<flowPath>
                            the flow path containing flow to inject at startup
                              (when running with a memory flow repository)
  -h, --help                Show this help message and exit.
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --port=<serverPort>   the port to bind
      --skip-executions=<skipExecutions>[,<skipExecutions>...]
                            a list of execution identifiers to skip, separated
                              by a coma; for troubleshooting purpose only
                              Default: []
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
      --worker-thread=<workerThread>
                            the number of worker thread
```


---

## kestra-ee sys

```bash
Usage: kestra-ee sys [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
                     [-p=<pluginsPath>] [COMMAND]
handle systems maintenance
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
Commands:
  reindex                  reindex all records of a type: read them from the
                             database then update them
  database                 manage Kestra database
  submit-queued-execution  Submit all queued execution to the executor
```

### kestra-ee sys reindex

```bash
Usage: kestra-ee sys reindex [-hVv] [--internal-log] [-c=<config>]
                             [-l=<logLevel>] [-p=<pluginsPath>] [-t=<type>]
reindex all records of a type: read them from the database then update them
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
  -t, --type=<type>       The type of the records to reindex, only 'flow' is
                            supported for now.
  -v, --verbose           Change log level. Multiple -v options increase the
                            verbosity.
  -V, --version           Print version information and exit.
```

### kestra-ee sys database

```bash
Usage: kestra-ee sys database [-hVv] [--internal-log] [-c=<config>]
                              [-l=<logLevel>] [-p=<pluginsPath>] [COMMAND]
manage Kestra database
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
Commands:
  migrate  Force database schema migration.
           Kestra uses Flyway to manage database schema evolution, this command
             will run Flyway then exit.
```

### kestra-ee sys submit-queued-execution

```bash
Usage: kestra-ee sys submit-queued-execution [-hVv] [--internal-log]
       [-c=<config>] [-l=<logLevel>] [-p=<pluginsPath>]
Submit all queued execution to the executor
All queued execution will be submitted to the executor. Warning, if there is
still running executions and concurrency limit configured, the executions may
be queued again.
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

---

## kestra-ee configs

```bash
Usage: kestra-ee configs [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
                         [-p=<pluginsPath>] [COMMAND]
handle configs
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
Commands:
  properties  Display actual configurations properties.
```

- `kestra-ee configs properties`:

```bash
Usage: kestra-ee configs properties [-hVv] [--internal-log] [-c=<config>]
                                    [-l=<logLevel>] [-p=<pluginsPath>]
Display actual configurations properties.
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


---

## kestra-ee sys-ee

```bash
Usage: kestra-ee sys-ee [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
                        [-p=<pluginsPath>] [COMMAND]
handle kestra ee systems maintenance
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
Commands:
  restore-flow-listeners   restore state-store for FlowListeners
  restore-queue            send all data from a repository to kafka.
  reset-concurrency-limit  Reset the concurrency limit stored on the Kafka
                             runner.
```

### kestra-ee sys-ee restore-flow-listeners

```bash
Usage: kestra-ee sys-ee restore-flow-listeners [-hVv] [--internal-log]
       [-c=<config>] [-l=<logLevel>] [-p=<pluginsPath>] [--timeout=<timeout>]
restore state-store for FlowListeners
Mostly usefull in case of restore of flow queue, the state store need to be
init to avoid sending old revisions.
  -c, --config=<config>     Path to a configuration file
                              Default: /home/kestra/.kestra/config.yml
  -h, --help                Show this help message and exit.
      --internal-log        Change also log level for internal log
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR)
                              Default: INFO
  -p, --plugins=<pluginsPath>
                            Path to plugins directory
                              Default: /app/plugins
      --timeout=<timeout>   Timeout before quit, considering we complete the
                              restore
                              Default: PT1M
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
```

### kestra-ee sys-ee restore-queue

```bash
Usage: kestra-ee sys-ee restore-queue [-hVv] [--internal-log] [--no-flows]
                                      [--no-namespaces] [--no-recreate]
                                      [--no-templates] [--no-triggers]
                                      [--no-triggers-execution-id]
                                      [-c=<config>] [-l=<logLevel>]
                                      [-p=<pluginsPath>]
send all data from a repository to kafka.
Mostly useful to send all flows, templates, triggers & namespaces from
repository to kafka in case of restore.
  -c, --config=<config>   Path to a configuration file
                            Default: /home/kestra/.kestra/config.yml
  -h, --help              Show this help message and exit.
      --internal-log      Change also log level for internal log
  -l, --log-level=<logLevel>
                          Change log level (values: TRACE, DEBUG, INFO, WARN,
                            ERROR)
                            Default: INFO
      --no-flows          Don't send flows
      --no-namespaces     Don't send namespaces
      --no-recreate       Don't drop the topic and recreate it
      --no-templates      Don't send templates
      --no-triggers       Don't send triggers
      --no-triggers-execution-id
                          Remove executionId from trigger
  -p, --plugins=<pluginsPath>
                          Path to plugins directory
                            Default: /app/plugins
  -v, --verbose           Change log level. Multiple -v options increase the
                            verbosity.
  -V, --version           Print version information and exit.
```

### kestra-ee sys-ee reset-concurrency-limit

```bash
Usage: kestra-ee sys-ee reset-concurrency-limit [-hVv] [--internal-log]
       [-c=<config>] [-l=<logLevel>] [-p=<pluginsPath>]
Reset the concurrency limit stored on the Kafka runner.
Use it only if some flow that has a concurrency limit hasn't started due to
concurrency limit, even though there is no execution running.
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

