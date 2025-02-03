---
title: Server CLI
icon: /docs/icons/admin.svg
---

Reference for server commands available in Kestra.

Kestra leverages five different server components. The `kestra server` command allows to start them individually, or run an all-inclusive standalone server.

## Separate server components

### Executor

`./kestra server executor`

**Options:**

* `--skip-executions`: the list of execution identifiers to skip. Use it only for troubleshooting e.g. when an execution cannot be processed by Kestra.

### Indexer

`./kestra server indexer`

### Scheduler

`./kestra server scheduler`

### Worker

`./kestra server worker`

**Options:**

* `-t` or `--thread`: the number of threads that can handle tasks at the same time. By default, the worker will start 2 threads per CPU core available.
* `-g` or `--worker-group`: the key of the worker group if using [Worker Group (EE)](../06.enterprise/worker-group.md).

### Webserver

`./kestra server webserver`

## Kestra standalone, all server components in one process

`./kestra server standalone`

This server is a special server, since it will contain all the server components in one JVM. This works well for development or small-sized environments.

**Options:**

* `-f` or `--flow-path`: the path to a directory with YAML flow files. These files will be loaded to the repository at startup.
* `--worker-thread`: the number of worker threads. By default, the embedded worker will start 3 threads or a single thread per CPU core when more than 3 CPU cores are available.
* `--skip-executions`: the list of execution identifiers to skip. Use it only for troubleshooting e.g. when an execution cannot be processed by Kestra.

## Kestra local, development server with no dependencies

`./kestra server local`

This server is a local development server. It will contain all server components in one JVM, and use a local database (H2), and a local storage - perfect to start a development server. Data will be saved in the `data` directory within the current working directory.


**Options:**

* `-f` or `--flow-path`: the path to a directory with YAML flow files. These files will be loaded to the repository at startup.
* `--worker-thread`: the number of worker threads. By default, the embedded worker will start 3 threads or a single thread per CPU core when more than 3 CPU cores are available.


## Kestra with server components in different services

Server components can run independently from each other. Each of them communicate through the database.

Here is a example Docker Compose configuration file running Kestra services with replicas on the Postgre database backend.

::collapse{title="Docker Compose Example"}
```yaml
volumes:
  postgres-data:
    driver: local
  kestra-data:
    driver: local

services:
  postgres:
    image: postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: kestra
      POSTGRES_USER: kestra
      POSTGRES_PASSWORD: k3str4
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 10

  kestra-scheduler:
    image: kestra/kestra:latest
    deploy:
      replicas: 2
    pull_policy: if_not_present
    user: "root"
    command: server scheduler
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
    environment:
      KESTRA_CONFIGURATION: &common_configuration |
        datasources:
          postgres:
            url: jdbc:postgresql://postgres:5432/kestra
            driverClassName: org.postgresql.Driver
            username: kestra
            password: k3str4
        kestra:
          server:
            basicAuth:
              enabled: false
              username: "admin@kestra.io"
              password: kestra
          repository:
            type: postgres
          storage:
            type: local
            local:
              basePath: "/app/storage"
          queue:
            type: postgres
          tasks:
            tmpDir:
              path: /tmp/kestra-wd/tmp
    ports:
      - "8082-8083:8081"
    depends_on:
      postgres:
        condition: service_started

  kestra-worker:
    image: kestra/kestra:latest
    deploy:
      replicas: 2
    pull_policy: if_not_present
    user: "root"
    command: server worker
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
    environment:
      KESTRA_CONFIGURATION: *common_configuration
    ports:
      - "8084-8085:8081"
    depends_on:
      postgres:
        condition: service_started
  kestra-executor:
    image: kestra/kestra:latest
    deploy:
      replicas: 2
    pull_policy: if_not_present
    user: "root"
    command: server executor
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
    environment:
      KESTRA_CONFIGURATION: *common_configuration
    ports:
      - "8086-8087:8081"
    depends_on:
      postgres:
        condition: service_started
  kestra-webserver:
    image: kestra/kestra:latest
    deploy:
      replicas: 1
    pull_policy: if_not_present
    user: "root"
    command: server webserver
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
    environment:
      KESTRA_CONFIGURATION: *common_configuration
      KESTRA_URL: http://localhost:8080/
    ports:
      - "8080:8080"
      - "8081:8081"
    depends_on:
      postgres:
        condition: service_started
```
::

In production you might run a similar pattern either by:

1. Runing Kestra services on dedicated machines. For examples, running the webserver, the scheduler and the executor on one VM and running one or more workers on other instances.
2. Using Kubernetes and Helm charts. Read more about how to set these up [in the documentation](../02.installation/03.kubernetes.md).


## Options for all server commands

### Log Level

Log level can be changed with two options:

* `-l` or `--log-level`: possible values: `[TRACE, DEBUG, INFO, WARN, ERROR]`, default: `INFO`
* `-v` or `--verbose`: for `DEBUG`, `-vv` for `TRACE`

These options affect global log levels for all flows only.

### Internal Log

`--internal-log`: Kestra hides internal logs by default. Use this option to enable these logs.

::alert{type="warning"}
This option enables logs of very high verbosity.
::

### Configuration Files

`-c` or `--config`: You can change the location of Kestra [configuration](../configuration/index.md) files, the default is `~/.kestra/config.yml`.

### Plugins directory

`-p` or `--plugins`: Path to the plugins directory. The default is the `plugins` directory located in the same directory as the Kestra executable.

### Server port

`--port`: The server port, the default is `8080`.
