---
title: Run Perl inside of your Flows
icon: /docs/icons/perl.svg
stage: Getting Started 
topics:
  - Scripting
---

Run Perl code directly inside of your Flows and generate outputs.

There isn't an official Perl plugin but we can use the `Shell` `Commands` task to execute arbitrary commands inside of a Docker container. We can also specify a container image that contains the necessary libraries to run the specific programming language.

In this example, we're using the Docker Task Runner with the `perl:latest` image so that Perl can be executed.

```yaml file=public/examples/commands_perl.yml
```

The contents of the `main.pl` file contains a simple print statement:

```perl
#!/usr/bin/perl

print "Hello World";
```

You'll need to add your Perl code using the Editor or [sync it using Git](../08.developer-guide/04.git.md) so Kestra can see it. You'll also need to set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

You can also have the Perl code written inline using the `inputFiles` property.

```yaml file=public/examples/commands_perl_inline.yml
```

You can read more about the Shell Commands type in the [Plugin documentation](/plugins/plugin-script-shell/tasks/io.kestra.plugin.scripts.shell.commands).

## Handling Outputs

If you want to get a variable or file from your Perl code, you can use an [output](../04.workflow-components/06.outputs.md).

### Variable Output

You can get the JSON outputs from the Perl script using the `::{}::` pattern. Here is an example:

```yaml file=public/examples/outputs_perl.yml
```

All the output variables can be viewed in the Outputs tab of the execution.

![perl_outputs](/docs/how-to-guides/perl/outputs.png)

You can refer to the outputs in another task as shown in the example below:

```yaml file=public/examples/outputs_perl_usage.yml
```

### File Output

Inside of your Perl code, write a file to the system. You'll need to add the `outputFiles` property to your flow and list the files you're trying to put out. In this case, we want to output `output.txt`. More information on the formats you can use for this property can be found [here](../08.developer-guide/07.scripts/07.outputs-metrics.md).

The example below writes a `output.txt` file containing the "Hello World" text. We can then refer the file using the syntax `{{ outputs.{task_id}.outputFiles['<filename>'] }}`, and read the contents of the file using the `read()` function.

```yaml file=public/examples/scripts_output-files-perl.yml
```

## Handling Metrics

You can also get [metrics](../08.developer-guide/07.scripts/06.outputs-metrics.md#outputs-and-metrics-in-script-and-commands-tasks) from your Perl code. We use the same pattern for defining metrics as we had used for outputs `::{}::`. In this example, we will demonstrate both the counter and timer metrics.

```yaml file=public/examples/metrics_perl.yml
```

Once this has executed, both the metrics can be viewed under **Metrics**.

![metrics](/docs/how-to-guides/perl/metrics.png)
