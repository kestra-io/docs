---
title: Supported Programming Languages in Kestra
sidebarTitle: Programming Languages
icon: /src/contents/docs/icons/dev.svg
description: See which languages have dedicated Kestra script plugins and how to run other languages with Shell tasks and Docker.
---

Kestra lets you run code in many languages inside your workflows.

## Choose the right way to run a language

Use a dedicated script plugin when Kestra provides one for your language. Use the Shell plugin when you need to run another language or compile code inside a container.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/oZYtLimdKBo?si=w5Tq8qwZQcmjMehf" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Languages with dedicated plugins

Kestra provides dedicated script plugins for these languages:

- [Python](/plugins/plugin-script-python)
- [R](/plugins/plugin-script-r)
- [Node.js](/plugins/plugin-script-node)
- [Shell](/plugins/plugin-script-shell)
- [PowerShell](/plugins/plugin-script-powershell)
- [Julia](/plugins/plugin-script-julia)
- [Ruby](/plugins/plugin-script-ruby)
- [Go](/plugins/plugin-script-go)
- [Deno](/plugins/plugin-script-deno)
- [Lua](/plugins/plugin-script-lua)
- [Bun](/plugins/plugin-script-bun)
- [PHP](/plugins/plugin-script-php)
- [Perl](/plugins/plugin-script-perl)
- [Groovy](/plugins/plugin-script-groovy)

Each of these plugins provides two task types:

- `Script` for short inline code in your flow definition.
- `Commands` for code stored in files or split across multiple commands.

Here is a minimal example that uses the Python `Script` task:

```yaml
id: python_script_example
namespace: company.team

tasks:
  - id: run_python
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:3.12-slim
    script: |
      print("Hello from Python")
```

Use the `Commands` task when you want to run a file from `namespaceFiles` or execute multiple commands in sequence:

```yaml
id: python_commands_example
namespace: company.team

tasks:
  - id: run_python_file
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
    containerImage: python:3.12-slim
    commands:
      - python hello.py
```

## Language-specific guides

Use these guides for complete examples, outputs, metrics, and dependency management:

- [Run Python inside your flows](../../15.how-to-guides/python/index.md)
- [Run R inside your flows](../../15.how-to-guides/r/index.md)
- [Run JavaScript inside your flows](../../15.how-to-guides/javascript/index.md)
- [Run Shell scripts inside your flows](../../15.how-to-guides/shell/index.md)
- [Run PowerShell inside your flows](../../15.how-to-guides/powershell/index.md)
- [Run Julia inside your flows](../../15.how-to-guides/julia/index.md)
- [Run Go inside your flows](../../15.how-to-guides/golang/index.md)
- [Run Perl inside your flows](../../15.how-to-guides/perl/index.md)
- [Run Rust inside your flows](../../15.how-to-guides/rust/index.md)

## Run other languages with the Shell plugin

Use `io.kestra.plugin.scripts.shell.Commands` when your language does not have a dedicated plugin or when you want to compile and run code in a container.

This approach works best when:

- the language runtime is available in the container image
- your commands can be executed from a shell
- you want to use `namespaceFiles` or `inputFiles` for source code

For outputs and metrics, use the same `::{}::` syntax documented for Shell tasks. See [Shell outputs and metrics](../06.outputs-metrics/index.md#shell).

### Rust example

This example compiles and runs a Rust file stored in `namespaceFiles`:

```yaml
id: rust_example
namespace: company.team

tasks:
  - id: run_rust
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: rust:1.82
    namespaceFiles:
      enabled: true
    commands:
      - rustc hello_world.rs
      - ./hello_world
```

The `hello_world.rs` file can contain:

```rust
fn main() {
    println!("Hello, World!");
}
```

See the full [Rust guide](../../15.how-to-guides/rust/index.md) for outputs and file handling.

### Java example

If you need to run Java code without building a custom plugin, you can compile and run it from a container:

```yaml
id: java_example
namespace: company.team

tasks:
  - id: run_java
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: eclipse-temurin:21
    namespaceFiles:
      enabled: true
    commands:
      - javac HelloWorld.java
      - java HelloWorld
```

```java
class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### TypeScript example

You can run TypeScript with the Node.js plugin by compiling it to JavaScript first:

```yaml
id: typescript_example
namespace: company.team

tasks:
  - id: run_typescript
    type: io.kestra.plugin.scripts.node.Commands
    namespaceFiles:
      enabled: true
    containerImage: node:22-slim
    commands:
      - npm install --save-dev typescript
      - npx tsc example.ts
      - node example.js
```

The `example.ts` file can contain:

```typescript
type User = {
  name: string;
  age: number;
};

function isAdult(user: User): boolean {
  return user.age >= 18;
}

const justine: User = {
  name: "Justine",
  age: 23,
};

console.log(isAdult(justine));
```

For more background, see the official [Node.js with TypeScript guide](https://nodejs.org/en/learn/getting-started/nodejs-with-typescript).

## Use a custom Docker image for extra dependencies

Use a custom Docker image when you need tools or libraries that are not present in the default runtime image.

The Dockerfile below adds Go to a Kestra image:

```dockerfile
FROM kestra/kestra:latest
USER root

RUN apt-get update -y && apt-get install -y wget && \
    wget -qO- https://go.dev/dl/go1.24.3.linux-amd64.tar.gz | tar -C /usr/local -xzf - && \
    echo 'export PATH=$PATH:/usr/local/go/bin' > /etc/profile.d/golang.sh

ENV PATH="/usr/local/go/bin:${PATH}"
```

Point your `docker-compose.yml` file to that Dockerfile:

```yaml
services:
  kestra:
    build:
      context: .
      dockerfile: Dockerfile
    image: kestra-go:latest
```

After you start Kestra with `docker compose up -d`, you can run Go code with the `Process` task runner:

```yaml
id: golang_process
namespace: company.team

tasks:
  - id: go_custom_dependencies
    type: io.kestra.plugin.scripts.go.Script
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    beforeCommands:
      - go mod init go_script
      - go get github.com/go-gota/gota/dataframe
      - go mod tidy
    script: |
      package main

      import (
          "os"
          "github.com/go-gota/gota/dataframe"
          "github.com/go-gota/gota/series"
      )

      func main() {
          names := series.New([]string{"Alice", "Bob", "Charlie"}, series.String, "Name")
          ages := series.New([]int{25, 30, 35}, series.Int, "Age")
          df := dataframe.New(names, ages)
          file, _ := os.Create("output.csv")
          defer file.Close()
          df.WriteCSV(file)
      }
    outputFiles:
      - output.csv
```

## Related pages

- [Scripts overview](../index.mdx)
- [Commands vs. scripts](../01.commands-vs-scripts/index.md)
- [Task runners](../03.task-runners/index.md)
- [Installing dependencies](../05.installing-dependencies/index.md)
- [Outputs and metrics](../06.outputs-metrics/index.md)
