---
title: PowerShell
icon: /docs/icons/powershell.svg
stage: Getting Started 
topics:
  - DevOps
  - Python
---

Run PowerShell code inside of your flow.

Powershell is commonly used for automating the management of systems and resources. With Kestra, you can effortlessly automate builds and tests for production systems, as well as manage cloud configurations and resources. Kestra's robust orchestration capabilities ensure that your Powershell scripts run smoothly and efficiently, streamlining your infrastructure.

This guide is going to walk you through how to get Powershell running inside of a workflow, how to manage input and output files, and how you can pass outputs and metrics back to Kestra to use in later tasks.

## Executing Powershell inside Kestra

You can execute PowerShell code inside of a flow by either writing your PowerShell code inline or by executing a `.ps1` file. You can get outputs and metrics from your PowerShell code too.

### Scripts

If you want to write a short amount of PowerShell code to perform a task, you can use the `io.kestra.plugin.scripts.powershell.Script` type to write it directly inside of your flow. This allows you to keep everything in one place.

```yaml file=public/examples/scripts_powershell.yml
```

You can read more about the Scripts type in the [Plugin documentation](/plugins/plugin-script-powershell/tasks/io.kestra.plugin.scripts.powershell.script)

### Commands

If you would prefer to put your PowerShell code in a `.ps1` file (e.g. your code is much longer or spread across multiple files), you can run the previous example using the `io.kestra.plugin.scripts.powershell.Commands` type:

```yaml file=public/examples/commands_powershell.yml
```

The contents of the `main.ps1` file can be:

```r
Write-Output "Hello World"
```

You'll need to add your PowerShell code using the Editor or [sync it using Git](../08.developer-guide/04.git.md) so Kestra can see it. You'll also need to set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

You can also have the PowerShell code written inline.

```yaml file=public/examples/commands_powershell_inline.yml
```

You can read more about the Commands type in the [Plugin documentation](/plugins/plugin-script-powershell/tasks/io.kestra.plugin.scripts.powershell.commands).

## Handling Outputs

If you want to get a variable or file from your PowerShell script, you can use an [output](../04.workflow-components/06.outputs.md).

### Variable Output

You can put out the JSON outputs from the PowerShell commands / script using the `::{}::` pattern. Here is an example:

```yaml file=public/examples/outputs_powershell.yml
```

All the output variables can be viewed in the Outputs tab of the execution.

![powershell_outputs](/docs/how-to-guides/powershell/outputs.png)

You can refer to the outputs in another task as shown in the example below:

```yaml file=public/examples/outputs_powershell_usage.yml
```

_This example works for both `io.kestra.plugin.scripts.powershell.Script` and `io.kestra.plugin.scripts.powershell.Commands`._

### File Output

Inside of your PowerShell script, write a file to the system. You'll need to add the `outputFiles` property to your flow and list the files you're trying to put out. In this case, we want to output `output.txt`. More information on the formats you can use for this property can be found [here](../08.developer-guide/07.scripts/07.outputs-metrics.md).

The example below writes a `output.txt` file containing the "Hello World" text. We can then refer the file using the syntax `{{ outputs.{task_id}.outputFiles['<filename>'] }}`, and read the contents of the file using the `read()` function.

```yaml file=public/examples/scripts_output-files-powershell.yml
```

_This example works for both `io.kestra.plugin.scripts.powershell.Script` and `io.kestra.plugin.scripts.powershell.Commands`._

## Handling Metrics

You can also get [metrics](../08.developer-guide/07.scripts/06.outputs-metrics.md#outputs-and-metrics-in-script-and-commands-tasks) from your PowerShell script. We use the same pattern for defining metrics as we had used for outputs `::{}::`. In this example, we will demonstrate both the counter and timer metrics.

```yaml file=public/examples/metrics_powershell.yml
```

Once this has executed, both the metrics can be viewed under **Metrics**.

![powershell_metrics](/docs/how-to-guides/powershell/metrics.png)
