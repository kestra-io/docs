---
title: "File Access in Kestra: Local and Namespace Files"
h1: Access Local and Namespace Files with Universal Protocol
description: Access local and namespace files in Kestra using the universal file protocol. Learn how to read, write, and share files between tasks and namespaces.
sidebarTitle: File Access in Kestra
icon: /src/contents/docs/icons/concepts.svg
version: ">= 0.24.0"
---

Kestra supports a universal file protocol for referencing local and [namespace files](../02.namespace-files/index.md) in your flows using consistent URI schemes.

You can reference files inline in YAML, or use `nsfile:///` and `file:///` URIs to point to namespace files or files on the host machine. The flow below demonstrates all three approaches:

```yaml
id: protocol
namespace: company.team
tasks:
  - id: inline_file
    type: io.kestra.plugin.scripts.python.Commands
    inputFiles:
      hello.py: |
        x = "Hello world!"
        print(x)
  - id: local_file
    type: io.kestra.plugin.scripts.python.Commands
    inputFiles:
      hello.py: file:///scripts/hello.py
  - id: namespace_file_from_the_same_namespace
    type: io.kestra.plugin.scripts.python.Commands
    inputFiles:
      hello.py: nsfile:///scripts/hello.py
  - id: namespace_file_from_other_namespace
    type: io.kestra.plugin.scripts.python.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - python hello.py
    inputFiles:
      hello.py: nsfile://company/scripts/hello.py
```

## Allowed paths

To use the `file:///` scheme, bind-mount the host directory into the Kestra container and set the `kestra.local-files.allowed-paths` configuration property. For example, to allow access to a `scripts` folder:

```yaml
  kestra:
    image: kestra/kestra:latest
    volumes:
      - /Users/yourdir/scripts:/scripts # Bind-mount the host directory
    ...
    environment: # Allow access to the /scripts directory in Kestra container
      KESTRA_CONFIGURATION: |
        kestra:
          local-files:
            allowed-paths:
              - /scripts
```

If you see the following error:

```plaintext
java.lang.SecurityException: The path /scripts/hello.py is not authorized. Only files inside the working directory are allowed by default, other paths must be allowed either globally inside the Kestra configuration using the `kestra.local-files.allowed-paths` property, or by plugin using the `allowed-paths` plugin configuration.`.
```

This means the allowed paths are not configured correctly. Confirm that the host directory is bind-mounted into the container and that `kestra.local-files.allowed-paths` includes that path.

## Protocol reference

| Scheme | Purpose |
|--------|---------|
| `file:///path/to/file.txt` | Local file on the host machine from an explicitly allowed path |
| `nsfile:///path/to/file.txt` | File in the current namespace (three slashes; no namespace inheritance) |
| `nsfile://other.namespace/path/to/file.txt` | File in another namespace (two slashes + namespace name); requires that namespace to be allowed |
| `kestra:///path/to/file.txt` | File in Kestra's internal storage |

`nsfile:///` does not inherit from parent namespaces. If `nsfile:///scripts/hello.py` is not found in `company.team`, Kestra will not fall back to `company`. To reference a parent namespace explicitly, use `nsfile://company/scripts/hello.py`.

## Usage with `read()`

Use `read()` in tasks that expect file content rather than a path — for example, to load a SQL query from a namespace file:

```yaml
id: query
namespace: demo

tasks:
  - id: duckdb
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: "{{ read('nsfile:///query.sql') }}"
```
For local files on the host:

```yaml
id: query
namespace: demo
tasks:
  - id: duckdb
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: "{{ read('file:///query.sql') }}"
```

## Namespace files as default FILE-type inputs

You can reference a namespace file as the default value for a `FILE`-type input. This flow reads `hello.txt` from the `demo` namespace and logs its content:

```yaml
id: file_input
namespace: demo
inputs:
  - id: myfile
    type: FILE
    defaults: nsfile:///hello.txt
tasks:
  - id: print_file_content
    type: io.kestra.plugin.core.log.Log
    message: "{{ read(inputs.myfile) }}"
```
