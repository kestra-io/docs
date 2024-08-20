---
title: Shell Script
icon: /docs/icons/bash.svg
---

Run shell script inside of your flow.

You can execute bash script inside of a flow by either writing your Shell commands inline or by executing a `.sh` file. You can get outputs and metrics from your Shell script too.

## Scripts

If you want to write a series of commands together to form a small script, and run that script as a task in the flow, you can use the `io.kestra.plugin.scripts.shell.Script`.

```yaml file=public/examples/scripts_shell.yml
```

You can read more about the Scripts type in the [Plugin documentation](/plugins/plugin-script-shell/tasks/io.kestra.plugin.scripts.shell.script)

## Commands

You could also choose to provide the series of Shell commands in the task, and get the same result. Here is an example of how you can run the previous example using the `io.kestra.plugin.scripts.shell.Commands` type:

```yaml file=public/examples/commands_shell.yml
```

You can also put a Shell script in a separate `.sh` file, and invoke the script as a command. For example, we have a script file called `hello.sh` that contains:

```bash
echo "Hi there! This is an example of executing a Shell script file."
sleep 2
echo "I am back from sleep"
```

You can now invoke this script as one of the commands in the `io.kestra.plugin.scripts.shell.Commands` task. Note that we have set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

```yaml file=public/examples/invoke_file_shell.yml
```

You can read more about the Commands type in the [Plugin documentation](/plugins/plugin-script-shell/tasks/io.kestra.plugin.scripts.shell.commands).

## Handling Outputs

If you want to get a variable or file from your Shell script, you can use an [output](../04.workflow-components/06.outputs.md).

### Variable Output

You can get the JSON outputs from the Shell commands / script using the `::{}::` pattern. Here is an example:

```yaml file=public/examples/outputs_shell.yml
```

All the output variables can be viewed in the Outputs tab of the execution.

![shell_outputs](/docs/how-to-guides/shell/outputs.png)

You can refer to the outputs in another task as shown in the example below:

```yaml file=public/examples/outputs_shell_usage.yml
```

_This example works for both `io.kestra.plugin.scripts.shell.Script` and `io.kestra.plugin.scripts.shell.Commands`._

### File Output

Inside of your Shell script, write a file to the system. You'll need to add the `outputFiles` property to your flow and list the files you're trying to put out. In this case, we want to output `output.txt`. More information on the formats you can use for this property can be found [here](../08.developer-guide/07.scripts/07.outputs-metrics.md).

The example below writes a `output.txt` file containing the "Hello world" text, similar the output we used earlier. We can then refer the file using the syntax `{{ outputs.{task_id}.outputFiles['<filename>'] }}`, and read the contents of the file using the `read()` function.

```yaml file=public/examples/scripts_output-files-shell.yml
```

_This example works for both `io.kestra.plugin.scripts.shell.Script` and `io.kestra.plugin.scripts.shell.Commands`._

## Handling Metrics

You can also get [metrics](../08.developer-guide/07.scripts/06.outputs-metrics.md#outputs-and-metrics-in-script-and-commands-tasks) from your Shell script. We use the same pattern for defining metrics as we had used for outputs `::{}::`. In this example, we will demonstrate both the counter and timer metrics.

```yaml file=public/examples/metrics_shell.yml
```

Once this has executed, both the metrics can be viewed under **Metrics**.

![metrics](/docs/how-to-guides/shell/metrics.png)
