---
title: JavaScript
icon: /docs/icons/nodejs.svg
---

Run JavaScript code inside of your flow.

You can execute NodeJS code inside of a flow by either writing your NodeJS inline or by executing a `.js` file. You can also get outputs and metrics from your NodeJS code too.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/nACf-2mnonk?si=OzJP7gtN-AbGrkr_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

In this example, the flow will install the required npm packages, make an API request to fetch data and use the NodeJS Kestra Library to generate outputs and metrics using this data.


## Scripts

If you want to write a short amount of NodeJS code to perform a task, you can use the `io.kestra.plugin.scripts.node.Script` type to write it directly inside of your flow. This allows you to keep everything in one place.

```yaml file=public/examples/scripts_nodejs.yml
```

You can read more about the Scripts type in the [Plugin documentation](/plugins/plugin-script-node/tasks/io.kestra.plugin.scripts.node.script)

## Commands

If you would prefer to put your NodeJS code in a `.js` file (e.g. your code is much longer or spread across multiple files), you can run the previous example using the `io.kestra.plugin.scripts.node.Commands` type:

```yaml file=public/examples/commands_nodejs.yml
```

You'll need to add your JavaScript code using the Editor or [sync it using Git](/docs/developer-guide/git) so Kestra can see it. You'll also need to set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

You can read more about the Commands type in the [Plugin documentation](/plugins/plugin-script-node/tasks/io.kestra.plugin.scripts.node.commands).

## Handling Outputs

If you want to get a variable or file from your JavaScript code, you can use an [output](/docs/workflow-components/outputs).

You'll need to install the [`@kestra-io/libs` npm package](https://npm.io/package/@kestra-io/libs) in order to pass your variables to Kestra.

```bash
npm install @kestra-io/libs
```

### Variable Output

You'll need to use the `Kestra` class to pass your variables to Kestra as outputs. Using the `outputs` method, you can pass a dictionary of variables where the `key` is the name of the output you'll reference in Kestra.

Using the same example as above, we can pass the number of downloads as an output.

```javascript file=public/examples/outputs_nodejs.js
```

Once your NodeJS file has executed, you'll be able to access the outputs in later tasks as seen below:

```yaml file=public/examples/outputs_nodejs.yml
```

_This example works for both `io.kestra.plugin.scripts.node.Script` and `io.kestra.plugin.scripts.node.Commands`._

### File Output

Inside of your JavaScript code, write a file to the system. You'll need to add `outputFiles` property to your flow and list the file you're trying to access. In this case, we want to access `downloads.txt`. More information on the formats you can use for this property can be found [here](/docs/developer-guide/scripts/output-directory).

The example below write a `.txt` file containing the number of downloads, similar the output we used earlier. We can then read the content of the file using the syntax `{{ outputs.{task_id}.outputFiles['{filename}'] }}`

```yaml file=public/examples/scripts_outputs-files_nodejs.yml
```

We can also preview our file directly in the Outputs tab as well.

![outputs](/docs/how-to-guides/nodejs/outputs.png)

_This example works for both `io.kestra.plugin.scripts.node.Script` and `io.kestra.plugin.scripts.node.Commands`._

## Handling Metrics

You can also get [metrics](/docs/developer-guide/scripts/outputs-metrics#outputs-and-metrics-in-script-and-commands-tasks) from your NodeJS code. In this example, we can use the `Date` class to time the execution time of the function and then pass this to Kestra so it can be viewed in the Metrics tab. You don't need to modify your flow in order for this to work.

```javascript file=public/examples/metrics_nodejs.js
```

Once this has executed, `duration` will be viewable under **Metrics**.
![metrics](/docs/how-to-guides/nodejs/metrics.png)
