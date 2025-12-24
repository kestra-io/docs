---
title: File Access in Kestra
icon: /docs/icons/concepts.svg
version: ">= 0.24.0"
---

Access local and namespace files in Kestra with universal file protocol.

## Overview

Starting from 0.24, Kestra supports a universal file protocol that simplifies how to reference files in your flows. This protocol provides more consistent and flexible handling of local and [namespace files](02.namespace-files.md) in your flows.

You can still reference files inline by defining the file name and its content directly in YAML, but you can now also use `nsfile:///` and `file:///` URIs to reference files stored as namespace files or on the host machine. The example flow below shows a task demonstrating the various file access methods:
 
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
    inputFiles:
      hello.py: nsfile://company/scripts/hello.py
pluginDefaults:
  - type: io.kestra.plugin.scripts.python.Commands
    values:
      taskRunner:
        type: io.kestra.plugin.core.runner.Process
      commands:
        - python hello.py
```

### Allowed paths

Note that to use the `file:///` scheme, you will need to bind-mount the host directory containing the files into the Docker container running Kestra, as well as set the `kestra.local-files.allowed-paths` configuration property to allow access to that directory. For example, if you want to read files from the `scripts` folder on your host machine, you can add the following to your `kestra.yml` configuration:

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

Keep in mind that if you see the following error:

```
java.lang.SecurityException: The path /scripts/hello.py is not authorized. Only files inside the working directory are allowed by default, other paths must be allowed either globally inside the Kestra configuration using the `kestra.local-files.allowed-paths` property, or by plugin using the `allowed-paths` plugin configuration.`.
```

It means that you have not configured the allowed paths correctly. Ensure that the host directory is bind-mounted into the container and that the `kestra.local-files.allowed-paths` configuration property includes the path to that directory.

### Protocol reference

Here is a reference of the new file protocol:
1. Use `file:///path/to/file.txt` to reference local files on the host machine from explicitly allowed paths.
2. Use `nsfile:///path/to/file.txt` to reference files stored in the current namespace. Note that this protocol uses three slashes after `nsfile://` to indicate that you are referencing a file in the current namespace. The namespace inheritance doesn't apply here, i.e., if you specify `nsfile:///path/to/file.txt` in a flow from `company.team` namespace and Kestra can't find it there, Kestra won't look for that file in the parent namespace, i.e., the `company` namespace, unless you explicitly specify the parent namespace in the path, e.g., `nsfile://company/path/to/file.txt`.
3. Use `nsfile://your.infinitely.nested.namespace/path/to/file.txt` to reference files stored in another namespace, provided that the current namespace has permission to access it. Note how this protocol uses two slashes after `nsfile://`, followed by the namespace name, to indicate that you are referencing a file in a different namespace. Under the hood, Kestra EE uses the Allowed Namespaces concept to check permissions to read that file.
4. Kestra also uses the `kestra:///` scheme for internal storage files. If you need to reference files stored in the internal storage, you can use the `kestra:///path/to/file.txt` protocol.

### Usage with `read()` function

You can also use the `read()` function to read namespace files or local files in tasks that expect content rather than a path to a script or SQL query. For example, if you want to read a SQL query from a namespace file, you can use the `read()` function as follows:

```yaml
id: query
namespace: demo

tasks:
  - id: duckdb
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: "{{ read('nsfile:///query.sql') }}"
```
For local files on the host, you can use the `file:///` scheme:

```yaml
id: query
namespace: demo
tasks:
  - id: duckdb
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: "{{ read('file:///query.sql') }}"
```

### Namespace files as default FILE-type inputs

One of the benefits of this protocol is that you can reference Namespace Files as default FILE-type inputs in your flows. See the example below, which reads a local file, `hello.txt,` from the `demo` namespace and logs its content.

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
