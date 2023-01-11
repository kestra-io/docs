---
order: 2
---
# Kestra servers

Kestra leverages five different servers in order to provide a fully working Kestra implementation.

## Separate servers

### [Kestra Executor](../../architecture#executor)

`./kestra server executor`

**Options:**

No special options for this server.

### [Kestra Indexer](../../architecture#indexer)

`./kestra server indexer`

**Options:**

No special options for this server.

### [Kestra Scheduler](../../architecture#scheduler)

`./kestra server scheduler`

**Options:**

No special options for this server.

### [Kestra Worker](../../architecture#worker)

`./kestra server worker`

**Options:**

* `-t` or `--thread`: the number of threads that can handle tasks at the same time. By default, the worker will start 2 threads per CPU core available.

### [Kestra Webserver](../../architecture#webserver)

`./kestra server webserver`

**Options:**

No special options for this server

## Kestra standalone, all servers in one process

`./kestra server standalone`

This server is a special server, since it will contain all the servers in one jvm.
But this works well for development or medium-sized environments.

**Options:**

* `-f` or `--flow-path`: the path to a directory will flow file as YAML, these files will be loaded on the repository at the startup.
* `--worker-thread`: the number of worker threads. By default, the embedded worker will start 3 threads or a single thread per CPU core when more than 3 CPU cores are available.

## Kestra local, development servers and no dependencies

`./kestra server local`

This server is a local development server, it will contain all the servers in one jvm, and use a local database (h2), and local storage, perfect to start a development server. All the data will be saved in a `data` directory on the current working directory.

**Options:**

* `-f` or `--flow-path`: the path to a directory will flow file as YAML, these files will be loaded on the repository at the startup.
* `--worker-thread`: the number of worker threads. By default, the embedded worker will start 3 threads or a single thread per CPU core when more than 3 CPU cores are available.

## Options for all server command

### Log Level

Log level can be changed with two options:

* `-l` or `--log-level`: possible value: `[TRACE, DEBUG, INFO, WARN, ERROR]`, default: `INFO`
* `-v` or `--verbose` for `DEBUG`, `-vv` for `TRACE`

This option affects global log levels for all flows only

### Internal Log

`--internal-log`: Kestra hides internal logs by default, use this option to enable these logs (high verbosity!)

### Configuration Files

`-c` or `--config`: you can change the location of kestra [configuration](../configuration) files, the default is `~/.kestra/config.yml`

### Plugins directory

`-p` or `--plugins`: Path to plugins directory, default is `plugins` directory near your kestra executable.

### Server port

`--port`: The server port, default is `8080`.
