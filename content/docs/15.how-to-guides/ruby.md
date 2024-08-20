---
title: Ruby
icon: /docs/icons/ruby.svg
---

Run Ruby code inside of your flow.

You can execute Ruby code inside of a flow by either writing your Ruby code inline or by executing a `.rb` file. You can get outputs and metrics from your Ruby code too.


## Scripts

If you want to write a short amount of Ruby code to perform a task, you can use the `io.kestra.plugin.scripts.ruby.Script` type to write it directly inside of your flow. This allows you to keep everything in one place.

```yaml file=public/examples/scripts_ruby.yml
```

You can read more about the Scripts type in the [Plugin documentation](/plugins/plugin-script-ruby/tasks/io.kestra.plugin.scripts.ruby.script)

## Commands

If you would prefer to put your Ruby code in a `.rb` file (e.g. your code is much longer or spread across multiple files), you can run the previous example using the `io.kestra.plugin.scripts.ruby.Commands` type:

```yaml file=public/examples/commands_ruby.yml
```

The contents of the `main.rb` file can be:

```ruby
puts "Hello World"
```

You'll need to add your Ruby code using the Editor or [sync it using Git](../08.developer-guide/04.git.md) so Kestra can see it. You'll also need to set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

You can also have the Ruby code written inline.

```yaml file=public/examples/commands_ruby_inline.yml
```

You can read more about the Commands type in the [Plugin documentation](/plugins/plugin-script-ruby/tasks/io.kestra.plugin.scripts.ruby.commands).

## Handling Outputs

If you want to get a variable or file from your Ruby script, you can use an [output](../04.workflow-components/06.outputs.md).

### Variable Output

You can get the JSON outputs from the Ruby commands / script using the `::{}::` pattern. Here is an example:

```yaml file=public/examples/outputs_ruby.yml
```

All the output variables can be viewed in the Outputs tab of the execution.

![ruby_outputs](/docs/how-to-guides/ruby/outputs.png)

You can refer to the outputs in another task as shown in the example below:

```yaml file=public/examples/outputs_ruby_usage.yml
```

_This example works for both `io.kestra.plugin.scripts.ruby.Script` and `io.kestra.plugin.scripts.ruby.Commands`._

### File Output

Inside of your Ruby script, write a file to the system. You'll need to add the `outputFiles` property to your flow and list the files you're trying to put out. In this case, we want to output `output.txt`. More information on the formats you can use for this property can be found [here](../08.developer-guide/07.scripts/07.outputs-metrics.md).

The example below writes a `output.txt` file containing the "Hello World" text. We can then refer the file using the syntax `{{ outputs.{task_id}.outputFiles['<filename>'] }}`, and read the contents of the file using the `read()` function.

```yaml file=public/examples/scripts_output-files-ruby.yml
```

_This example works for both `io.kestra.plugin.scripts.ruby.Script` and `io.kestra.plugin.scripts.ruby.Commands`._

## Handling Metrics

You can also get [metrics](../08.developer-guide/07.scripts/06.outputs-metrics.md#outputs-and-metrics-in-script-and-commands-tasks) from your Ruby script. We use the same pattern for defining metrics as we had used for outputs `::{}::`. In this example, we will demonstrate both the counter and timer metrics.

```yaml file=public/examples/metrics_ruby.yml
```

Once this has executed, both the metrics can be viewed under **Metrics**.

![metrics](/docs/how-to-guides/ruby/metrics.png)
