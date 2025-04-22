---
title: Run Ruby inside of your Flow
icon: /docs/icons/ruby.svg
stage: Getting Started
topics:
  - Scripting
---

Run Ruby code directly inside of your Flows and generate outputs.

Ruby is well known for web development but has many other powerful use cases too, such as automation, web scraping, data processing and command-line tools. With Kestra, you can effortlessly automate data ingestion, as well as manage complex automations. Kestra's robust orchestration capabilities ensure that your Ruby scripts run smoothly and efficiently, streamlining your data-driven projects.

This guide is going to walk you through how to get Ruby running inside of a workflow, how to manage input and output files, and how you can pass outputs and metrics back to Kestra to use in later tasks.

## Executing Rudy inside Kestra

Kestra has an official plugin for Ruby allowing you to execute R code inside of a flow by either writing your Ruby code inline or by executing an `.rb` file. You can get outputs and metrics from your Ruby code too.


### Scripts

If you want to write a short amount of Ruby code to perform a task, you can use the `io.kestra.plugin.scripts.ruby.Script` type to write it directly inside of your flow. This allows you to keep everything in one place.

```yaml
id: ruby_output_file
namespace: company.team
description: This flow runs the Ruby script to output a file.

tasks:
  - id: ruby_outputs_task
    type: io.kestra.plugin.scripts.ruby.Script
    outputFiles:
      - output.txt
    script: |
      File.open("output.txt", "w") do |file|
        file.write("Hello World")
      end

  - id: log_output
    type: io.kestra.plugin.core.log.Log
    message: "{{ read(outputs.ruby_outputs_task.outputFiles['output.txt']) }}"
```

You can read more about the Scripts type in the [Plugin documentation](/plugins/plugin-script-ruby/io.kestra.plugin.scripts.ruby.script)

### Commands

If you would prefer to put your Ruby code in a `.rb` file (e.g. your code is much longer or spread across multiple files), you can run the previous example using the `io.kestra.plugin.scripts.ruby.Commands` type:

```yaml
id: ruby_commands
namespace: company.team
tasks:
  - id: run_ruby
    type: io.kestra.plugin.scripts.ruby.Commands
    namespaceFiles:
      enabled: true
    commands:
      - ruby main.rb
```

The contents of the `main.rb` file can be:

```ruby
puts "Hello World"
```

You'll need to add your Ruby code using the Editor or [sync it using Git](../version-control-cicd/04.git.md) so Kestra can see it. You'll also need to set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

You can also have the Ruby code written inline.

```yaml
id: ruby_commands
namespace: company.team
tasks:
  - id: http_download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: run_ruby
    type: io.kestra.plugin.scripts.ruby.Commands
    inputFiles:
      orders.csv: "{{ read(outputs.http_download.uri) }}"
      main.rb: |
        puts "The current execution is {{ execution.id }}"

        # Read the file downloaded in `http_download` task
        lines = File.readlines("orders.csv")
        puts lines
    commands:
      - ruby main.rb
```

You can read more about the Commands type in the [Plugin documentation](/plugins/plugin-script-ruby/io.kestra.plugin.scripts.ruby.commands).

## Handling Outputs

If you want to get a variable or file from your Ruby script, you can use an [output](../04.workflow-components/06.outputs.md).

### Variable Output

You can get the JSON outputs from the Ruby commands / script using the `::{}::` pattern. Here is an example:

```yaml
id: ruby_outputs
namespace: company.team
description: This flow runs the Ruby script, and outputs the variable.

tasks:
  - id: ruby_outputs_task
    type: io.kestra.plugin.scripts.ruby.Script
    script: |
      puts '::{"outputs":{"test":"value","int":2,"bool":true,"float":3.65}}::'
```

All the output variables can be viewed in the Outputs tab of the execution.

![ruby_outputs](/docs/how-to-guides/ruby/outputs.png)

You can refer to the outputs in another task as shown in the example below:

```yaml
id: ruby_outputs
namespace: company.team
description: This flow runs the Ruby script, and outputs the variable.

tasks:
  - id: ruby_outputs_task
    type: io.kestra.plugin.scripts.ruby.Script
    script: |
      puts '::{"outputs":{"test":"value","int":2,"bool":true,"float":3.65}}::'

  - id: return
    type: io.kestra.plugin.core.debug.Return
    format: '{{ outputs.ruby_outputs_task.vars.test }}'
```

_This example works for both `io.kestra.plugin.scripts.ruby.Script` and `io.kestra.plugin.scripts.ruby.Commands`._

### File Output

Inside of your Ruby script, write a file to the system. You'll need to add the `outputFiles` property to your flow and list the files you're trying to put out. In this case, we want to output `output.txt`. More information on the formats you can use for this property can be found in [Script Output Metrics](../16.scripts/06.outputs-metrics.md).

The example below writes a `output.txt` file containing the "Hello World" text. We can then refer the file using the syntax `{{ outputs.{task_id}.outputFiles['<filename>'] }}`, and read the contents of the file using the `read()` function.

```yaml
id: ruby_output_file
namespace: company.team
description: This flow runs the Ruby script to output a file.

tasks:
  - id: ruby_outputs_task
    type: io.kestra.plugin.scripts.ruby.Script
    outputFiles:
      - output.txt
    script: |
      File.open("output.txt", "w") do |file|
        file.write("Hello World")
      end

  - id: log_output
    type: io.kestra.plugin.core.log.Log
    message: "{{ read(outputs.ruby_outputs_task.outputFiles['output.txt']) }}"
```

_This example works for both `io.kestra.plugin.scripts.ruby.Script` and `io.kestra.plugin.scripts.ruby.Commands`._

## Handling Metrics

You can also get [metrics](../16.scripts/06.outputs-metrics.md#outputs-and-metrics-in-script-and-commands-tasks) from your Ruby script. We use the same pattern for defining metrics as we had used for outputs `::{}::`. In this example, we will demonstrate both the counter and timer metrics.

```yaml
id: ruby_metrics
namespace: company.team
description: This flow runs the Ruby script, and puts out the metrics.

tasks:
  - id: ruby_metrics_task
    type: io.kestra.plugin.scripts.ruby.Script
    script: |
      puts 'There are 20 products in the cart'
      puts '::{"outputs":{"productCount":20}}::'
      puts '::{"metrics":[{"name":"productCount","type":"counter","value":20}]}::'
      puts '::{"metrics":[{"name":"purchaseTime","type":"timer","value":32.44}]}::'
```

Once this has executed, both the metrics can be viewed under **Metrics**.

![metrics](/docs/how-to-guides/ruby/metrics.png)
