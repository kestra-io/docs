---
title: Kestra CLI (kestractl)
sidebarTitle: Kestra CLI
icon: /src/contents/docs/icons/bash.svg
editions: ["OSS","EE"]
description: CLI for managing Kestra flows, executions, namespaces, and namespace files.
---

Use `kestractl` to interact with the Kestra host API for flows, executions, namespaces, and namespace files.

For server components, plugins, and system maintenance commands, see the [Kestra Server CLI](./index.md).

## Installation

Build from source (requires Go 1.21+):

```bash
TBD
```

## Quick Setup

### Open Source (basic auth)

```bash
kestractl config add default http://localhost:8080 main --username admin --password admin --default
```

### Enterprise (API token)

```bash
kestractl config add default https://kestra.example.com production --token YOUR_TOKEN --default
```

Your configuration is saved at `~/.kestractl/config.yaml` and the default context is used automatically.

```yaml
contexts:
  default:
    host: https://kestra.example.com
    tenant: production
    auth_method: token
    token: YOUR_TOKEN
default_context: default
```

For basic auth contexts, `auth_method` is `basicAuth` and the file stores `username` and `password` instead of a token.



## Usage

### Examples

```bash
# Deploy flows, then run one and wait for completion
kestractl flows deploy ./flows --namespace prod --override --fail-fast
kestractl executions run prod nightly-refresh --wait --output json
```

```bash
# Sync namespace files for a release
kestractl nsfiles upload prod ./assets --path resources --override --fail-fast
```

```bash
# List flows as JSON
kestractl flows list my.namespace --output json
```

### Command groups

- `config`: manage authentication contexts.
- `flows`: list, get, deploy, and validate flows.
- `executions`: run and inspect executions.
- `namespaces`: list and filter namespaces.
- `nsfiles`: list, get, upload, and delete namespace files.

Use `kestractl --help` or `kestractl <command> --help` for the full command reference.

## Configuration

### Global flags

- `--host` - Kestra host URL
- `--tenant` - Tenant name
- `--token` / `-t` - API token (Enterprise)
- `--username` - Basic auth username (Open Source)
- `--password` - Basic auth password (Open Source)
- `--output` / `-o` - Output format (`table` or `json`)
- `--config` - Custom config file path (default: `~/.kestractl/config.yaml`)
- `--verbose` / `-v` - Verbose output (warning: prints credentials in HTTP requests)

### Config file and contexts

Manage contexts with `kestractl config add`, `kestractl config show`, `kestractl config use`, and `kestractl config remove`.

### Environment variables

Environment variables override config file settings. Use either `KESTRACTL_TOKEN` or `KESTRACTL_USERNAME` and `KESTRACTL_PASSWORD`.

```bash
export KESTRACTL_HOST=http://localhost:8080
export KESTRACTL_TENANT=main
export KESTRACTL_TOKEN=YOUR_TOKEN
export KESTRACTL_USERNAME=admin
export KESTRACTL_PASSWORD=admin
export KESTRACTL_OUTPUT=json
```

### Configuration precedence

1. **Command-line flags** (`--host`, `--token`, etc.)
2. **Environment variables** (`KESTRACTL_HOST`, `KESTRACTL_TOKEN`, etc.)
3. **Config file** (`~/.kestractl/config.yaml` or custom via `--config`)
4. **Default values**

### Override per command

```bash
kestractl flows get my.namespace my-flow \
  --host https://kestra.example.com \
  --tenant production \
  --token YOUR_TOKEN
```
