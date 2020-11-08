---
order: 2
---
# Kestra servers 
Kestra have 5 different servers in order to have a fully working Kestra 

## Production environment servers


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

* `-thread`: the number of thread that can handle task at the same time

### [Kestra Webserver](../../architecture#webserver)

`./kestra server Webserver`

**Options:**

No special options for this servers

## Kestra standalone, Development environment servers

`./kestra server standalone`

This server is a special server only intended for Development environment, since it will contains all the server in one jvm. 
But this work well on development environment.
By default, the worker embedded will start 1 thread per cpu core available. 

**Options:**

* `-f` or `--flow-path`: the path to a directory will flow file as yaml, these files will loaded on the repository at the startup. 

## Options for all server command 

### Log Level 
Log level can be changed with 2 options : 

- `--log-level`: possible value: `[TRACE, DEBUG, INFO, WARN, ERROR]`, default: `INFO`
-  `--verbose` or `-v` for `DEBUG`, `-vv` for `TRACE` 

This option affects global log level for all flow only 

### Internal Log
`--internal-log`: Kestra hide internal log by default, use this option to enable it (High verbosity !)

### Configuration Files

`-c` or `--config`: change the location of kestra [configuration](../configuration) files, default is `~/.kestra/config.yml` 

### Plugins directory

`-p` or `--plugins`: Path to plugins directory, default is `plugins` directory near your kestra executable 
