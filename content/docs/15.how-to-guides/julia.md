---
title: Run Julia inside of your Flows
icon: /docs/icons/julia.svg
stage: Getting Started 
topics:
  - Scripting 
---

Run Julia code directly inside of your Flows and generate outputs.

Julia is renowned for high-performance numerical analysis and computational science. Leverage Kestra to orchestrate your Julia scripts, enhancing their capabilities in large-scale analytics and machine learning applications. From data ingestion to complex numerical simulations, Kestra streamlines your Julia workflows, accelerating development and deployment.

This guide is going to walk you through how to get Julia running inside of a workflow, how to manage input and output files, and how you can pass outputs and metrics back to Kestra to use in later tasks.

## Executing Julia inside Kestra

Kestra has an official plugin for Julia allowing you to execute Julia code inside of a flow by either writing your Julia inline or by executing a `.jl` file. You can get outputs and metrics from your Julia code too.

### Scripts

If you want to write a short amount of Julia code to perform a task, you can use the `io.kestra.plugin.scripts.julia.Script` type to write it directly inside of your flow. This allows you to keep everything in one place.

```yaml file=public/examples/scripts_julia.yml
```

You can read more about the Scripts type in the [Plugin documentation](/plugins/plugin-script-julia/tasks/io.kestra.plugin.scripts.julia.script)

### Commands

If you would prefer to put your Julia code in a `.jl` file (e.g. your code is much longer or spread across multiple files), you can run the previous example using the `io.kestra.plugin.scripts.julia.Commands` type:

```yaml file=public/examples/commands_julia.yml
```

You'll need to add your Julia code using the Editor or [sync it using Git](../08.developer-guide/04.git.md) so Kestra can see it. You'll also need to set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

You can also have the Julia code written inline.

```yaml file=public/examples/commands_julia_inline.yml
```

You can read more about the Commands type in the [Plugin documentation](/plugins/plugin-script-julia/tasks/io.kestra.plugin.scripts.julia.commands).

## Handling Outputs

If you want to get a variable or file from your Julia script, you can use an [output](../04.workflow-components/06.outputs.md).

### Variable Output

You can get the JSON outputs from the Julia commands / script using the `::{}::` pattern. Here is an example:

```yaml file=public/examples/outputs_julia.yml
```

All the output variables can be viewed in the Outputs tab of the execution.

![julia_outputs](/docs/how-to-guides/julia/outputs.png)

You can refer to the outputs in another task as shown in the example below:

```yaml file=public/examples/outputs_julia_usage.yml
```

_This example works for both `io.kestra.plugin.scripts.julia.Script` and `io.kestra.plugin.scripts.julia.Commands`._

### File Output

Inside of your Julia script, write a file to the system. You'll need to add the `outputFiles` property to your flow and list the files you're trying to put out. In this case, we want to output `output.txt`. More information on the formats you can use for this property can be found [here](../04.workflow-components/01.tasks/02.scripts/07.outputs-metrics.md).

The example below writes a `output.txt` file containing the "Hello World" text. We can then refer the file using the syntax `{{ outputs.{task_id}.outputFiles['<filename>'] }}`, and read the contents of the file using the `read()` function.

```yaml file=public/examples/scripts_output-files-julia.yml
```

_This example works for both `io.kestra.plugin.scripts.julia.Script` and `io.kestra.plugin.scripts.julia.Commands`._

## Handling Metrics

You can also get [metrics](../04.workflow-components/01.tasks/02.scripts/06.outputs-metrics.md#outputs-and-metrics-in-script-and-commands-tasks) from your Julia script. We use the same pattern for defining metrics as we had used for outputs `::{}::`. In this example, we will demonstrate both the counter and timer metrics.

```yaml file=public/examples/metrics_julia.yml
```

Once this has executed, both the metrics can be viewed under **Metrics**.

![metrics](/docs/how-to-guides/julia/metrics.png)
