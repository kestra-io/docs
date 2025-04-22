---
title: Run JavaScript inside of your Flows
icon: /docs/icons/nodejs.svg
stage: Getting Started
topics:
  - Scripting
---

Run Node.js code directly inside of your Flows and generate outputs.

You can execute NodeJS code inside of a flow by either writing your NodeJS inline or by executing a `.js` file. You can also get outputs and metrics from your NodeJS code too.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/nACf-2mnonk?si=OzJP7gtN-AbGrkr_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

In this example, the flow will install the required npm packages, make an API request to fetch data and use the NodeJS Kestra Library to generate outputs and metrics using this data.


## Scripts

If you want to write a short amount of NodeJS code to perform a task, you can use the `io.kestra.plugin.scripts.node.Script` type to write it directly inside of your flow. This allows you to keep everything in one place.

```yaml
id: js_scripts
namespace: company.team

description: This flow will install the npm package in a Docker container, and use kestra's NodeJS Script task to run the script.

tasks:
  - id: run_nodejs_script
    type: io.kestra.plugin.scripts.node.Script
    beforeCommands:
      - npm install requestify
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: node:slim
    warningOnStdErr: false
    script: |
      const requestify = require('requestify');

      function GetDockerImageDownloads(imageName){
        // Queries the Docker Hub API to get the number of downloads for a specific Docker image.
        var url = `https://hub.docker.com/v2/repositories/${imageName}/`
        console.log(url)
        requestify.get(url)
          .then(function(response) {
            result = JSON.parse(response.body);
            console.log(result['pull_count']);
            return result['pull_count'];
          })
          .catch(function(error) {
            console.log(error);
          })
      }

      GetDockerImageDownloads("kestra/kestra")
```

You can read more about the Scripts type in the [Plugin documentation](/plugins/plugin-script-node/io.kestra.plugin.scripts.node.script)

## Commands

If you would prefer to put your NodeJS code in a `.js` file (e.g. your code is much longer or spread across multiple files), you can run the previous example using the `io.kestra.plugin.scripts.node.Commands` type:

```yaml
id: js_commands
namespace: company.team

description: This flow will install the npm package in a Docker container, and use kestra's NodeJS Commands task to run the script.

tasks:
  - id: run_nodejs_commands
    type: io.kestra.plugin.scripts.node.Commands
    namespaceFiles:
      enabled: true
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: node:slim
    warningOnStdErr: false
    beforeCommands:
      - npm install requestify
    commands:
      - node docker_image_downloads.js
```

You'll need to add your JavaScript code using the Editor or [sync it using Git](../version-control-cicd/04.git.md) so Kestra can see it. You'll also need to set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

You can read more about the Commands type in the [Plugin documentation](/plugins/plugin-script-node/io.kestra.plugin.scripts.node.commands).

## Handling Outputs

If you want to get a variable or file from your JavaScript code, you can use an [output](../04.workflow-components/06.outputs.md).

You'll need to install the [`@kestra-io/libs` npm package](https://npm.io/package/@kestra-io/libs) in order to pass your variables to Kestra.

```bash
npm install @kestra-io/libs
```

### Variable Output

You'll need to use the `Kestra` class to pass your variables to Kestra as outputs. Using the `outputs` method, you can pass a dictionary of variables where the `key` is the name of the output you'll reference in Kestra.

Using the same example as above, we can pass the number of downloads as an output.

```javascript
const requestify = require('requestify');
const Kestra = require('@kestra-io/libs');

function GetDockerImageDownloads(imageName){
  // Queries the Docker Hub API to get the number of downloads for a specific Docker image.
  var url = `https://hub.docker.com/v2/repositories/${imageName}/`
  console.log(url)
  requestify.get(url)
    .then(function(response) {
      result = JSON.parse(response.body);
      Kestra.outputs({"pull_count": result['pull_count']})
      return result['pull_count'];
    })
    .catch(function(error) {
      console.log(error);
    })
}

GetDockerImageDownloads("kestra/kestra")
```

Once your NodeJS file has executed, you'll be able to access the outputs in later tasks as seen below:

```yaml
id: outputs_nodejs
namespace: company.team

description: This flow will install the npm package in a Docker container, and use kestra's NodeJS Commands task to run the script.

tasks:
  - id: run_nodejs_commands
    type: io.kestra.plugin.scripts.node.Commands
    namespaceFiles:
      enabled: true
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: node:slim
    warningOnStdErr: false
    beforeCommands:
      - npm install requestify
      - npm install @kestra-io/libs
    commands:
      - node outputs_nodejs.js

  - id: log_downloads
    type: io.kestra.plugin.core.log.Log
    message: "Number of downloads: {{ outputs.run_nodejs_commands.vars.pull_count }}"
```

_This example works for both `io.kestra.plugin.scripts.node.Script` and `io.kestra.plugin.scripts.node.Commands`._

### File Output

Inside of your JavaScript code, write a file to the system. You'll need to add `outputFiles` property to your flow and list the file you're trying to access. In this case, we want to access `downloads.txt`. More information on the formats you can use for this property can be found in [Script Output Metrics](../16.scripts/06.outputs-metrics.md).

The example below write a `.txt` file containing the number of downloads, similar the output we used earlier. We can then read the content of the file using the syntax `{{ outputs.{task_id}.outputFiles['{filename}'] }}`

```yaml
id: js_outputs_files_scripts
namespace: company.team

description: This flow will install the npm package in a Docker container, and use kestra's NodeJS library to generate outputs (number of downloads of the Kestra Docker image).

tasks:
  - id: nodejs_outputs
    type: io.kestra.plugin.scripts.node.Script
    beforeCommands:
      - npm install requestify
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: node:slim
    warningOnStdErr: false
    outputFiles:
      - downloads.txt
    script: |
      const requestify = require('requestify');
      const fs = require('fs');

      function GetDockerImageDownloads(imageName){
        // Queries the Docker Hub API to get the number of downloads for a specific Docker image.
        var url = `https://hub.docker.com/v2/repositories/${imageName}/`
        console.log(url)
        requestify.get(url)
          .then(function(response) {
            result = JSON.parse(response.body);
            fs.writeFile("downloads.txt", result['pull_count'].toString(), (err) => {
              if (err) throw err;
            })
            return result['pull_count'];
          })
          .catch(function(error) {
            console.log(error);
          })
      }

      GetDockerImageDownloads("kestra/kestra");
```

We can also preview our file directly in the Outputs tab as well.

![outputs](/docs/how-to-guides/nodejs/outputs.png)

_This example works for both `io.kestra.plugin.scripts.node.Script` and `io.kestra.plugin.scripts.node.Commands`._

## Handling Metrics

You can also get [metrics](../16.scripts/06.outputs-metrics.md#outputs-and-metrics-in-script-and-commands-tasks) from your NodeJS code. In this example, we can use the `Date` class to time the execution time of the function and then pass this to Kestra so it can be viewed in the Metrics tab. You don't need to modify your flow in order for this to work.

```javascript
const Kestra = require('@kestra-io/libs');
const requestify = require('requestify');

function GetDockerImageDownloads(imageName){
  // Queries the Docker Hub API to get the number of downloads for a specific Docker image.
  var url = `https://hub.docker.com/v2/repositories/${imageName}/`
  console.log(url)
  requestify.get(url)
    .then(function(response) {
      result = JSON.parse(response.body);
      Kestra.outputs({"pull_count": result['pull_count']})
      return result['pull_count'];
    })
    .catch(function(error) {
      console.log(error);
    })
}

start = new Date().getTime();
GetDockerImageDownloads("kestra/kestra")
end = new Date().getTime();
duration = (end - start) / 1000
Kestra.timer('duration', end - start);
```

Once this has executed, `duration` will be viewable under **Metrics**.
![metrics](/docs/how-to-guides/nodejs/metrics.png)
