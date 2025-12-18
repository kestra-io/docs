---
title: Kestra CLI
icon: /docs/icons/admin.svg
editions: ["OSS","EE"]
---

How to interact with Kestra using the CLI.

This page includes CLI commands and options for both Open Source and Enterprise editions. Enterprise-only operations are marked with (EE) where relevant.

## Authentication

The Kestra CLI uses the same authentication as the [Kestra API](../api-reference/01.enterprise.md). You can pass credentials via global/API options (see below) such as `--api-token`, `--user`, or `--server`.

```bash
kestra --api-token <your-api-token> --help
```

---

## Global options

These options can be used with **any** Kestra CLI command.

- `-v, --verbose` — Increase log verbosity (use `-vv` for more).
- `-l, --log-level` — Set a specific level: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`.
- `--internal-log` — Also change the level for internal logs.
- `-c, --config` — Path to a configuration file (default: `~/.kestra/config.yml`).
- `-p, --plugins` — Path to the plugins directory.

**Examples**

```bash
kestra plugins list -vv
kestra plugins install --log-level DEBUG
```

## API options

Available for commands that talk to the server API.

- `--server` — Kestra server URL (default: `http://localhost:8080`).
- `--headers` — Add custom headers (`<name=value>`).
- `--user` — Basic auth (`user:password`).
- `--tenant` — Tenant identifier (**EE only**).
- `--api-token` — API token (**EE only**).

**Examples**

```bash
kestra flow list --server http://my-kestra:8080
kestra flow list --user admin:secret
```

---

## `kestra` (top-level)

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
  migrate    handle migrations
  backups    (EE) handle metadata backups and restore
```

---

## Configuration commands

### `kestra configs properties`

Display the effective configuration properties.

```bash
kestra configs properties
```

---

## Flow commands

### `kestra flow validate`

Validate a flow file.

**Input**: `file` (path)

```bash
kestra flow validate /path/to/my-flow.yml
```

### `kestra flow test`

Run a flow locally with specific inputs, helping you test its logic without deploying it to the server.

**Inputs**: `file` (path), `inputs` (key value pairs; absolute path for file inputs)

```bash
kestra flow test /path/to/my-flow.yml myInput1 value1
```

### `kestra flow dot`

Generate a DOT graph from a flow file, which you can use with a visualization tool to create a visual diagram of your flow's structure.

```bash
kestra flow dot /path/to/my-flow.yml
```

### `kestra flow export`

Export flows to a ZIP file.

**Inputs**: `--namespace` (optional), `directory` (path to export into)

```bash
kestra flow export --namespace my-namespace /path/to/export-directory
```

### `kestra flow update`

Update a single flow on the server from a local file. You must specify the flow's namespace and its unique ID.

**Inputs**: `flowFile` (path), `namespace` (string), `id` (string)

```bash
kestra flow update /path/to/my-updated-flow.yml my-namespace my-flow-id
```

### `kestra flow updates`

Bulk update flows from a directory. Point the command to a directory, and Kestra will create or update all the flows it finds. The `--delete` flag removes any flows on the server that are no longer in the specified directory.

**Inputs**: `directory` (path), `--delete` (optional), `--namespace` (optional)

```bash
kestra flow updates /path/to/my-flows --delete --namespace my-namespace
```

### `kestra flow namespace update`

Update **all** flows within a namespace from a directory.

**Option**: `--override-namespaces` (optional)

```bash
kestra flow namespace update --override-namespaces /path/to/flows
```

### `kestra flow create`

Create a new flow from a YAML file.

```bash
kestra flow create /path/to/new-flow.yml
```

### `kestra flow delete`

Delete a flow.

**Inputs**: `namespace`, `id`

```bash
kestra flow delete my-namespace my-flow-id
```

---

## Migration commands

### `kestra migrate default-tenant`

Migrate all resources without tenant to a new tenant (multi-tenant setups).

**Options**: `--tenant-id`, `--tenant-name`, `--dry-run`

```bash
kestra migrate default-tenant --tenant-id my-tenant --tenant-name "My Tenant" --dry-run
```

---

## Namespace commands

### `kestra namespace files update`

Sync namespace files from a local directory.

**Inputs**: `namespace`, `from` (local path), `to` (remote path, default `/`), `--delete` (optional)

```bash
kestra namespace files update my-namespace /path/to/local/files / --delete
```

### `kestra namespace kv update`

Set/update a key in the namespace KV store. Set an expiration time, specify the data type, and even read the value from a file.

**Inputs**: `namespace`, `key`, `value`
**Options**: `-e, --expiration`, `-t, --type`, `-f, --file-value`

```bash
kestra namespace kv update my-ns my-key "my-value" -e 1d
```

---

## Plugin commands

### `kestra plugins install`

Install one or more plugins by Maven coordinates.

**Options**: `--locally` (default true), `--all`, `--repositories`

```bash
kestra plugins install io.kestra.plugin.jdbc:mysql:1.2.3
```

### `kestra plugins uninstall`

Uninstall one or more plugins.

```bash
kestra plugins uninstall io.kestra.plugin.jdbc:mysql:1.2.3
```

### `kestra plugins list`

List installed plugins.

**Option**: `--core` to include core task plugins

```bash
kestra plugins list --core
```

### `kestra plugins doc`

Generate documentation for installed plugins.

**Inputs**: `output` (default: `./docs`)
**Options**: `--core`, `--icons`, `--schema`

```bash
kestra plugins doc ./docs --core
```

### `kestra plugins search`

Search for available plugins.

```bash
kestra plugins search jdbc
```

---

## Server commands

### `kestra server executor`

Start the executor.

**Options**: `--skip-executions` (list)

```bash
kestra server executor
```

### `kestra server indexer`

Start the indexer.

```bash
kestra server indexer
```

### `kestra server scheduler`

Start the scheduler.

```bash
kestra server scheduler
```

### `kestra server standalone`

Start a standalone server (all core services).

```bash
kestra server standalone
```

### `kestra server webserver`

Start the webserver.

**Option**: `--no-tutorials` to disable auto-loading tutorials

```bash
kestra server webserver --no-tutorials
```

### `kestra server worker`

Start a worker.

**Options**: `-t, --thread` (max threads), `-g, --worker-group` (EE only)

```bash
kestra server worker --thread 16
```

### `kestra server local`

Start a local dev server.

```bash
kestra server local
```

## Kestra with server components in different services

Server components can run independently from each other. Each of them communicate through the database.

Below is an example Docker Compose configuration file running Kestra services with replicas on the PostgreSQL database backend.

:::collapse{title="Docker Compose Example"}
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
            driver-class-name: org.postgresql.Driver
            username: kestra
            password: k3str4
        kestra:
          server:
            basic-auth:
              enabled: false
              username: "admin@kestra.io"
              password: kestra
          repository:
            type: postgres
          storage:
            type: local
            local:
              base-path: "/app/storage"
          queue:
            type: postgres
          tasks:
            tmp-dir:
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
:::

In production you might run a similar pattern either by:

1. Running Kestra services on dedicated machines. For examples, running the webserver, the scheduler, and the executor on one VM and running one or more workers on other instances.
2. Using Kubernetes and Helm charts. Read more about how to set these up [in the Kubernetes installation documentation](../02.installation/03.kubernetes.md).

---

## System commands

### `kestra sys reindex`

Reindex records (currently only `flow`).

**Option**: `--type`

```bash
kestra sys reindex --type flow
```

### `kestra sys submit-queued-execution`

Submit all queued executions to the executor.

```bash
kestra sys submit-queued-execution
```

### `kestra sys database migrate`

Force database schema migration (Flyway).

```bash
kestra sys database migrate
```

### `kestra sys state-store migrate`

Migrate old state store files to the Key-Value (KV) Store.

```bash
kestra sys state-store migrate
```

---

## Auths (EE)

### `kestra auths users create`

Create a user.

**Inputs**: `username` (required), `password` (optional)
**Options**: `--groups`, `--tenant`, `--admin`, `--superadmin`, `--if-not-exists`

```bash
kestra auths users create --superadmin --tenant=default admin Admin_password@123
```

### `kestra auths users create-basic-auth`

Create or replace a basic auth password for a user.

```bash
kestra auths users create-basic-auth alice
```

### `kestra auths users refresh`

Refresh users to update their properties.

```bash
kestra auths users refresh
```

### `kestra auths users set-superadmin`

Set or remove Superadmin status.

**Inputs**: `user`, `isSuperAdmin` (true|false)

```bash
kestra auths users set-superadmin alice true
```

### `kestra auths users email-replace-username`

Set the username as the email for every user.

```bash
kestra auths users email-replace-username
```

### `kestra auths users sync-access`

Sync users' access with the fallback tenant (for enabling multi-tenancy).

```bash
kestra auths users sync-access
```

---

## Backups (EE)

### `kestra backups create`

Create a metadata backup.

**Inputs**: `type` (`FULL` | `TENANT`)
**Options**: `--tenant`, `--encryption-key`, `--no-encryption`, `--include-data`

```bash
kestra backups create FULL --no-encryption
```

### `kestra backups restore`

Restore a metadata backup.

**Input**: `uri` (Kestra internal storage URI)
**Options**: `--encryption-key`, `--to-tenant`

```bash
kestra backups restore kestra:///backups/full/backup-20240917163312.kestra
```

---

## Systems (EE)

### kestra sys-ee restore-flow-listeners

Restores the state-store for FlowListeners. Useful after restoring a flow queue.

**Inputs**
- `--timeout` (option): Timeout in seconds before quitting (default: 60).

**Example Usage**
```bash
kestra-ee sys-ee restore-flow-listeners --timeout 120
```

---

### kestra sys-ee restore-queue

Sends all data from a repository to Kafka. Useful for restoring all resources after a backup.

**Inputs**
- `--no-recreate` (option): Don't drop and recreate the Kafka topic.
- `--no-flows` (option): Don't send flows.
- `--no-templates` (option): Don't send templates.

**Example Usage**
```bash
kestra-ee sys-ee restore-queue --no-flows
```

---

### kestra sys-ee reset-concurrency-limit

Resets the concurrency limit stored on the Kafka runner.

**Inputs**
None

**Example Usage**
```bash
kestra-ee sys-ee reset-concurrency-limit
```

## Tenants (EE)

### `kestra tenants create`

Create a tenant and assign admin roles to an existing admin user.

**Inputs**: `tenantId`, `tenantName`
**Option**: `--admin-username`

```bash
kestra tenants create tenantA "Tenant A" --admin-username alice
```
