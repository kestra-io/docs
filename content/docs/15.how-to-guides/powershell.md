---
title: Run Powershell inside of your Flows
icon: /docs/icons/powershell.svg
stage: Getting Started
topics:
  - Scripting
---

Run PowerShell code inside of your flow.

Powershell is commonly used for automating the management of systems and resources. With Kestra, you can effortlessly automate builds and tests for production systems, as well as manage cloud configurations and resources. Kestra's robust orchestration capabilities ensure that your Powershell scripts run smoothly and efficiently, streamlining your infrastructure.

This guide is going to walk you through how to get Powershell running inside of a workflow, how to manage input and output files, and how you can pass outputs and metrics back to Kestra to use in later tasks.

## Executing Powershell inside Kestra

You can execute PowerShell code inside of a flow by either writing your PowerShell code inline or by executing a `.ps1` file. You can get outputs and metrics from your PowerShell code too.

### Scripts

If you want to write a short amount of PowerShell code to perform a task, you can use the `io.kestra.plugin.scripts.powershell.Script` type to write it directly inside of your flow. This allows you to keep everything in one place.

```yaml
id: powershell_script
namespace: company.team
description: This flow runs the PowerShell script.

tasks:
  - id: http_download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: powershell_script_task
    type: io.kestra.plugin.scripts.powershell.Script
    script: |
      Write-Output "The current execution is {{ execution.id }}"

      # Read the file downloaded in `http_download` task
      $content = Get-Content "{{ outputs.http_download.uri }}"
      $content
```

You can read more about the Scripts type in the [Plugin documentation](/plugins/plugin-script-powershell/io.kestra.plugin.scripts.powershell.script)

### Commands

If you would prefer to put your PowerShell code in a `.ps1` file (e.g. your code is much longer or spread across multiple files), you can run the previous example using the `io.kestra.plugin.scripts.powershell.Commands` type:

```yaml
id: powershell_commands
namespace: company.team
tasks:
  - id: run_powershell
    type: io.kestra.plugin.scripts.powershell.Commands
    namespaceFiles:
      enabled: true
    commands:
      - ./main.ps1
```

The contents of the `main.ps1` file can be:

```powershell
Write-Output "Hello World"
```

You'll need to add your PowerShell code using the Editor or [sync it using Git](../version-control-cicd/04.git.md) so Kestra can see it. You'll also need to set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

You can also have the PowerShell code written inline.

```yaml
id: powershell_commands
namespace: company.team
tasks:
  - id: http_download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: run_powershell
    type: io.kestra.plugin.scripts.powershell.Commands
    inputFiles:
      orders.csv: "{{ read(outputs.http_download.uri) }}"
      main.ps1: |
        Write-Output "The current execution is {{ execution.id }}"

        # Read the file
        $content = Get-Content "orders.csv"
        $content
    commands:
      - ./main.ps1
```

You can read more about the Commands type in the [Plugin documentation](/plugins/plugin-script-powershell/io.kestra.plugin.scripts.powershell.commands).

## Handling Outputs

If you want to get a variable or file from your PowerShell script, you can use an [output](../04.workflow-components/06.outputs.md).

### Variable Output

You can put out the JSON outputs from the PowerShell commands / script using the `::{}::` pattern. Here is an example:

```yaml
id: powershell_outputs
namespace: company.team
description: This flow runs the PowerShell script, and outputs the variable.

tasks:
  - id: powershell_outputs_task
    type: io.kestra.plugin.scripts.powershell.Script
    script: |
      Write-Output '::{"outputs":{"test":"value","int":2,"bool":true,"float":3.65}}::'
```

All the output variables can be viewed in the Outputs tab of the execution.

![powershell_outputs](/docs/how-to-guides/powershell/outputs.png)

You can refer to the outputs in another task as shown in the example below:

```yaml
id: powershell_outputs
namespace: company.team
description: This flow runs the PowerShell script, and outputs the variable.

tasks:
  - id: powershell_outputs_task
    type: io.kestra.plugin.scripts.powershell.Script
    script: |
      Write-Output '::{"outputs":{"test":"value","int":2,"bool":true,"float":3.65}}::'

  - id: return
    type: io.kestra.plugin.core.debug.Return
    format: '{{ outputs.powershell_outputs_task.vars.test }}'
```

_This example works for both `io.kestra.plugin.scripts.powershell.Script` and `io.kestra.plugin.scripts.powershell.Commands`._

### File Output

Inside of your PowerShell script, write a file to the system. You'll need to add the `outputFiles` property to your flow and list the files you're trying to put out. In this case, we want to output `output.txt`. More information on the formats you can use for this property can be found in [Script Ouput Metrics](../16.scripts/06.outputs-metrics.md).

The example below writes a `output.txt` file containing the "Hello World" text. We can then refer the file using the syntax `{{ outputs.{task_id}.outputFiles['<filename>'] }}`, and read the contents of the file using the `read()` function.

```yaml
id: powershell_output_file
namespace: company.team
description: This flow runs the PowerShell script to output a file.

tasks:
  - id: powershell_outputs_task
    type: io.kestra.plugin.scripts.powershell.Script
    outputFiles:
      - output.txt
    script: |
      Set-Content -Path "output.txt" -Value "Hello World"

  - id: log_output
    type: io.kestra.plugin.core.log.Log
    message: "{{ read(outputs.powershell_outputs_task.outputFiles['output.txt']) }}"
```

_This example works for both `io.kestra.plugin.scripts.powershell.Script` and `io.kestra.plugin.scripts.powershell.Commands`._

## Handling Metrics

You can also get [metrics](../16.scripts/06.outputs-metrics.md#outputs-and-metrics-in-script-and-commands-tasks) from your PowerShell script. We use the same pattern for defining metrics as we had used for outputs `::{}::`. In this example, we will demonstrate both the counter and timer metrics.

```yaml
id: powershell_metrics
namespace: company.team
description: This flow runs the PowerShell script, and puts out the metrics.

tasks:
  - id: powershell_metrics_task
    type: io.kestra.plugin.scripts.powershell.Script
    script: |
      Write-Output 'There are 20 products in the cart'
      Write-Output '::{"outputs":{"productCount":20}}::'
      Write-Output '::{"metrics":[{"name":"productCount","type":"counter","value":20}]}::'
      Write-Output '::{"metrics":[{"name":"purchaseTime","type":"timer","value":32.44}]}::'
```

Once this has executed, both the metrics can be viewed under **Metrics**.

![powershell_metrics](/docs/how-to-guides/powershell/metrics.png)
