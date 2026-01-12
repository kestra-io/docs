---
title: Run Go inside of your Flows
icon: /docs/icons/golang.svg
stage: Getting Started
topics:
  - Scripting
---

Run Go code directly inside of your Flows and generate outputs.

<div class="video-container">
    <iframe src="https://youtube.com/embed/flGQZeP1MmA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

Go is a powerful programming language often used for cloud-native development, CLI utilities and more. As Go is complied, it's often much more performant than Python making it a great alternative for heavy compute workloads. Combining Go's and Kestra's performance, you can build incredibly fast workflows.

This guide is going to walk you through how to get Go running inside of a workflow, how to manage input and output files, and how you can pass outputs and metrics back to Kestra to use in later tasks.

## Commands Task

There is an official Go plugin with a `Commands` task and an inline `Script` task. This example executes a Namespace file using `Commands`:

```yaml
id: golang_commands
namespace: company.team

tasks:
  - id: go
    type: io.kestra.plugin.scripts.go.Commands
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

You can read more about the Go Commands type in the [Plugin documentation](/plugins/plugin-script-go/io.kestra.plugin.scripts.go.commands).

## Script

You can also add your Golang code inline using the `Script` task.

```yaml
id: golang_script
namespace: company.team

tasks:
  - id: go
    type: io.kestra.plugin.scripts.go.Script
    script: |
      package main
      import "fmt"

      func main() {
          fmt.Println("hello world")
      }
```

You can also use expressions directly inside of your Go code. In this example, inputs are embedded directly into the code:

```yaml
id: golang_script_expression
namespace: company.team

inputs:
  - id: message
    type: STRING
    defaults: "Hello, World!"

  - id: number
    type: INT
    defaults: 4

tasks:
  - id: go
    type: io.kestra.plugin.scripts.go.Script
    script: |
      package main
      import "fmt"

      func main() {
          fmt.Println("Message: {{ inputs.message }}")
          fmt.Println("Number: {{ inputs.number }}")
      }
```

You can read more about the Go Script type in the [Plugin documentation](/plugins/plugin-script-go/io.kestra.plugin.scripts.go.script).


## Handling Outputs

If you want to get a variable or file from your Golang code, you can use an [output](../05.workflow-components/06.outputs.md).

### Variable Output

You can get the JSON outputs from the Golang script using the `::{}::` pattern. Here is an example:

```yaml
id: golang_outputs
namespace: company.team

tasks:
  - id: go
    type: io.kestra.plugin.scripts.go.Script
    script: |
      package main
      import "fmt"

      func main() {
          fmt.Println("::{\"outputs\":{\"test\":\"value\",\"int\":2,\"bool\":true,\"float\":3.65}}::")
      }
```

All the output variables can be viewed in the Outputs tab of the execution.

![golang_outputs](/docs/how-to-guides/golang/outputs.png)

You can refer to the outputs in another task as shown in the example below:

```yaml
id: golang_outputs_usage
namespace: company.team

tasks:
  - id: go
    type: io.kestra.plugin.scripts.go.Script
    script: |
      package main
      import "fmt"

      func main() {
          fmt.Println("::{\"outputs\":{\"test\":\"value\",\"int\":2,\"bool\":true,\"float\":3.65}}::")
      }

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
    type: io.kestra.plugin.scripts.go.Script
    outputFiles:
      - output.txt
    script: |
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
    type: io.kestra.plugin.scripts.go.Script
    script: |
      package main
      import "fmt"

      func main() {
          fmt.Println("There are 20 products in the cart")
          fmt.Println("::{\"outputs\":{\"productCount\":20}}::")
          fmt.Println("::{\"metrics\":[{\"name\":\"productCount\",\"type\":\"counter\",\"value\":20}]}::")
          fmt.Println("::{\"metrics\":[{\"name\":\"purchaseTime\",\"type\":\"timer\",\"value\":32.44}]}::")
      }
```

Once this has executed, both the metrics can be viewed under **Metrics**.

![metrics](/docs/how-to-guides/golang/metrics.png)
