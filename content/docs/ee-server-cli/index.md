---
title: Kestra EE CLI
icon: /docs/icons/admin.svg
editions: ["EE"]
---

How to interact with Kestra Enterprise Edition using the CLI.

## Authentication

The Kestra CLI uses the same authentication as the [Kestra API](../06.enterprise/api.md). You can use the `--api-token` option to authenticate with the API.

```shell
kestra --api-token <your-api-token> --help
```

## kestra

```bash
Usage: kestra [-hV] [COMMAND]

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

## kestra auths

```bash
Usage: kestra auths [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
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

Here is the list of available commands withing `kestra auths`:

- `kestra auths users`

```bash
Usage: kestra auths users [-hVv] [--internal-log] [-c=<config>]
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

- `kestra auths users sync-access`

```bash
Usage: kestra auths users sync-access [-hVv] [--internal-log] [-c=<config>]
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

- `kestra auths users refresh`

```bash
Usage: kestra auths users refresh [-hVv] [--internal-log] [-c=<config>]
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

- `kestra auths users set-type`

```bash
Usage: kestra auths users set-type [-hVv] [--internal-log] [-c=<config>]
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


- `kestra auths users create`

```bash
Usage: kestra auths users create [-hVv] [--admin] [--internal-log]
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
kestra auths users create --superadmin \
  --tenant=default admin admin_password123
```

Example command to create an Admin user:

```shell
kestra auths users create --admin \
  --tenant=default admin admin_password123
```

Example command to create a regular user:

```shell
kestra auths users create --tenant=default user user_password123
```


---

## kestra flow

```bash
Usage: kestra flow [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
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

- `kestra flow namespace`

```bash
Usage: kestra flow namespace [-hVv] [--internal-log] [-c=<config>]
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

- `kestra flow namespace update`

```bash
Usage: kestra flow namespace update [-hVv] [--[no-]delete] [--internal-log]
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


- `kestra flow test`

```bash
Usage: kestra flow test [-hVv] [--internal-log] [-c=<config>]
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

- `kestra flow dot`

```bash
Usage: kestra flow dot [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
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

- `kestra flow export`

```bash
Usage: kestra flow export [-hVv] [--internal-log] [-c=<config>]
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


- `kestra flow validate`

```bash
Usage: kestra flow validate [-hVv] [--internal-log] [--local] [-c=<config>]
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

## kestra tenants

```bash
Usage: kestra tenants [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
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


- `kestra tenants create`

```bash
Usage: kestra tenants create [-hVv] [--internal-log]
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

## kestra plugins

```bash
Usage: kestra plugins [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
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

- `kestra plugins install`

```bash
Usage: kestra plugins install [-hVv] [--internal-log] [-c=<config>]
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

- `kestra plugins list`

```bash
Usage: kestra plugins list [-hVv] [--core] [--internal-log] [-c=<config>]
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

- `kestra plugins doc`

```bash
Usage: kestra plugins doc [-hVv] [--core] [--icons] [--internal-log]
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

## kestra server

```bash
Usage: kestra server [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
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

### kestra server executor

```bash
Usage: kestra server executor [-hVv] [--internal-log] [-c=<config>]
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

### kestra server indexer

```bash
Usage: kestra server indexer [-hVv] [--internal-log] [-c=<config>]
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

### kestra server scheduler

```bash
Usage: kestra server scheduler [-hVv] [--internal-log] [-c=<config>]
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

### kestra server standalone

```bash
Usage: kestra server standalone [-hVv] [--internal-log] [-c=<config>]
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

### kestra server webserver

```bash
Usage: kestra server webserver [-hVv] [--internal-log] [-c=<config>]
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

### kestra server worker

```bash
Usage: kestra server worker [-hVv] [--internal-log] [-c=<config>]
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

### kestra server local

```bash
Usage: kestra server local [-hVv] [--internal-log] [-c=<config>]
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

## kestra sys

```bash
Usage: kestra sys [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
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

### kestra sys reindex

```bash
Usage: kestra sys reindex [-hVv] [--internal-log] [-c=<config>]
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

### kestra sys database

```bash
Usage: kestra sys database [-hVv] [--internal-log] [-c=<config>]
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

### kestra sys submit-queued-execution

```bash
Usage: kestra sys submit-queued-execution [-hVv] [--internal-log]
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

## kestra configs

```bash
Usage: kestra configs [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
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

- `kestra configs properties`:

```bash
Usage: kestra configs properties [-hVv] [--internal-log] [-c=<config>]
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

## kestra sys-ee

```bash
Usage: kestra sys-ee [-hVv] [--internal-log] [-c=<config>] [-l=<logLevel>]
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

### kestra sys-ee restore-flow-listeners (relevant only for older versions of kestra before 0.12)

Legacy command for [Listeners](../11.migration-guide/0.12.0/listeners.md).

```bash
Usage: kestra sys-ee restore-flow-listeners [-hVv] [--internal-log]
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

### kestra sys-ee restore-queue

```bash
Usage: kestra sys-ee restore-queue [-hVv] [--internal-log] [--no-flows]
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

### kestra sys-ee reset-concurrency-limit

```bash
Usage: kestra sys-ee reset-concurrency-limit [-hVv] [--internal-log]
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

