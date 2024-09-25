---
title: Run R inside of your Flows
icon: /docs/icons/r.svg
stage: Getting Started 
topics:
  - Scripting
---

Run R code directly inside of your Flows and generate outputs.

R is essential for statistical analysis, visualization, and data manipulation. With Kestra, you can effortlessly automate data ingestion, conduct complex statistical analysis, and handle real-time data processing. Kestra's robust orchestration capabilities ensure that your R scripts run smoothly and efficiently, streamlining your data-driven projects.

This guide is going to walk you through how to get R running inside of a workflow, how to manage input and output files, and how you can pass outputs and metrics back to Kestra to use in later tasks.

## Executing R inside Kestra

Kestra has an official plugin for R allowing you to execute R code inside of a flow by either writing your R code inline or by executing an `.R` file. You can get outputs and metrics from your R code too.

### Scripts

If you want to write a short amount of R code to perform a task, you can use the `io.kestra.plugin.scripts.r.Script` type to write it directly inside of your flow. This allows you to keep everything in one place.

```yaml file=public/examples/scripts_r.yml
```

You can read more about the Scripts type in the [Plugin documentation](/plugins/plugin-script-r/tasks/io.kestra.plugin.scripts.r.script)

### Commands

If you would prefer to put your R code in an `.R` file (e.g. your code is much longer or spread across multiple files), you can run the previous example using the `io.kestra.plugin.scripts.r.Commands` type:

```yaml file=public/examples/commands_r.yml
```

The contents of the `main.R` file can be:

```r
print("Hello World")
```

You'll need to add your R code using the Editor or [sync it using Git](../version-control-cicd/04.git.md) so Kestra can see it. You'll also need to set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

You can also have the R code written inline.

```yaml file=public/examples/commands_r_inline.yml
```

You can read more about the Commands type in the [Plugin documentation](/plugins/plugin-script-r/tasks/io.kestra.plugin.scripts.r.commands).

## Handling Outputs

If you want to get a variable or file from your R script, you can use an [output](../04.workflow-components/06.outputs.md).

### Variable Output

You can get the JSON outputs from the R commands / script using the `::{}::` pattern. Here is an example:

```yaml file=public/examples/outputs_r.yml
```

All the output variables can be viewed in the Outputs tab of the execution.

![r_outputs](/docs/how-to-guides/r/outputs.png)

You can refer to the outputs in another task as shown in the example below:

```yaml file=public/examples/outputs_r_usage.yml
```

_This example works for both `io.kestra.plugin.scripts.r.Script` and `io.kestra.plugin.scripts.r.Commands`._

### File Output

Inside of your R script, write a file to the system. You'll need to add the `outputFiles` property to your flow and list the files you're trying to put out. In this case, we want to output `output.txt`. More information on the formats you can use for this property can be found [here](../04.workflow-components/01.tasks/02.scripts/07.outputs-metrics.md).

The example below writes a `output.txt` file containing the "Hello World" text. We can then refer the file using the syntax `{{ outputs.{task_id}.outputFiles['<filename>'] }}`, and read the contents of the file using the `read()` function.

```yaml file=public/examples/scripts_output-files-r.yml
```

_This example works for both `io.kestra.plugin.scripts.r.Script` and `io.kestra.plugin.scripts.r.Commands`._

## Handling Metrics

You can also get [metrics](../04.workflow-components/01.tasks/02.scripts/06.outputs-metrics.md#outputs-and-metrics-in-script-and-commands-tasks) from your R script. We use the same pattern for defining metrics as we had used for outputs `::{}::`. In this example, we will demonstrate both the counter and timer metrics.

```yaml file=public/examples/metrics_r.yml
```

Once this has executed, both the metrics can be viewed under **Metrics**.

![metrics](/docs/how-to-guides/r/metrics.png)
