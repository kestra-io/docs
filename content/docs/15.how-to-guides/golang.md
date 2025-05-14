---
title: Run Go inside of your Flows
icon: /docs/icons/golang.svg
stage: Getting Started
topics:
  - Scripting
---

Run Go code directly inside of your Flows and generate outputs.

Go is a powerful programming language often used for cloud-native development, CLI utilities and more. As Go is complied, it's often much more performant than Python making it a great alternative for heavy compute workloads. Combining Go's and Kestra's performance, you can build incredibly fast workflows.

This guide is going to walk you through how to get Go running inside of a workflow, how to manage input and output files, and how you can pass outputs and metrics back to Kestra to use in later tasks.

## Executing Go inside Kestra

There isn't an official Go plugin but we can use the `Shell` `Commands` task to execute arbitrary commands inside of a Docker container. We can also specify a container image that contains the necessary libraries to run the specific programming language.

In this example, we're using the Docker Task Runner with the `golang:latest` image so that Go can be executed.

```yaml
id: golang_commands
namespace: company.team

tasks:
  - id: go
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: golang:latest
    namespaceFiles:
      enabled: true
    commands:
      - go run main.go
```

The contents of the `main.go` file contains a simple print statement:

```go
package main
import "fmt"
func main() {
    fmt.Println("hello world")
}
```

You'll need to add your Golang code using the built-in Editor or [sync it using Git](../version-control-cicd/04.git.md) so Kestra can see it. You'll also need to set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

You can also add your Golang code inline using the `inputFiles` property.

```yaml
id: golang_commands
namespace: company.team

tasks:
  - id: go
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: golang:latest
    inputFiles:
      main.go: |
        package main
        import "fmt"
        func main() {
            fmt.Println("hello world")
        }
    commands:
      - go run main.go
```

You can read more about the Shell Commands type in the [Plugin documentation](/plugins/plugin-script-shell/io.kestra.plugin.scripts.shell.commands).

## Handling Outputs

If you want to get a variable or file from your Golang code, you can use an [output](../04.workflow-components/06.outputs.md).

### Variable Output

You can get the JSON outputs from the Golang script using the `::{}::` pattern. Here is an example:

```yaml
id: golang_outputs
namespace: company.team

tasks:
  - id: go
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: golang:latest
    inputFiles:
      main.go: |
        package main
        import "fmt"
        func main() {
            fmt.Println("::{\"outputs\":{\"test\":\"value\",\"int\":2,\"bool\":true,\"float\":3.65}}::")
        }
    commands:
      - go run main.go
```

All the output variables can be viewed in the Outputs tab of the execution.

![golang_outputs](/docs/how-to-guides/golang/outputs.png)

You can refer to the outputs in another task as shown in the example below:

```yaml
id: golang_outputs_usage
namespace: company.team

tasks:
  - id: go
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: golang:latest
    inputFiles:
      main.go: |
        package main
        import "fmt"
        func main() {
            fmt.Println("::{\"outputs\":{\"test\":\"value\",\"int\":2,\"bool\":true,\"float\":3.65}}::")
        }
    commands:
      - go run main.go

  - id: return
    type: io.kestra.plugin.core.debug.Return
    format: '{{ outputs.go.vars.test }}'
```

### File Output

Inside of your Golang code, write a file to the system. You'll need to add the `outputFiles` property to your flow and list the files you're trying to put out. In this case, we want to output `output.txt`. More information on the formats you can use for this property can be found in [Script Output Metrics](../16.scripts/06.outputs-metrics.md).

The example below writes a `output.txt` file containing the "Hello World" text. We can then refer the file using the syntax `{{ outputs.{task_id}.outputFiles['<filename>'] }}`, and read the contents of the file using the `read()` function.

```yaml
id: golang_script
namespace: company.team

tasks:
  - id: go
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: golang:latest
    inputFiles:
      main.go: |
        package main

        import (
            "os"
        )

        func check(e error) {
            if e != nil {
                panic(e)
            }
        }

        func main() {
            d1 := []byte("hello go")
            err := os.WriteFile("output.txt", d1, 0644)
            check(err)
        }
    outputFiles:
      - output.txt
    commands:
      - go run main.go

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ read(outputs.go.outputFiles['output.txt']) }}"
```

## Handling Metrics

You can also get [metrics](../16.scripts/06.outputs-metrics.md#outputs-and-metrics-in-script-and-commands-tasks) from your Golang code. We use the same pattern for defining metrics as we had used for outputs `::{}::`. In this example, we will demonstrate both the counter and timer metrics.

```yaml
id: golang
namespace: company.team

tasks:
  - id: go
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: golang:latest
    inputFiles:
      main.go: |
        package main
        import "fmt"
        func main() {
            fmt.Println("There are 20 products in the cart")
            fmt.Println("::{\"outputs\":{\"productCount\":20}}::")
            fmt.Println("::{\"metrics\":[{\"name\":\"productCount\",\"type\":\"counter\",\"value\":20}]}::")
            fmt.Println("::{\"metrics\":[{\"name\":\"purchaseTime\",\"type\":\"timer\",\"value\":32.44}]}::")
        }
    commands:
      - go run main.go
```

Once this has executed, both the metrics can be viewed under **Metrics**.

![metrics](/docs/how-to-guides/golang/metrics.png)
