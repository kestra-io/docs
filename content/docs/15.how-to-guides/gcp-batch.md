---
title: How to Run Tasks on Google Cloud Batch
icon: /docs/icons/tutorial.svg
version: ">= 0.16.0"
---

How to use `Gcp​Batch​Task​Runner` to run your tasks on Google Cloud Batch.

## Before you begin

Before you start, you need to have the following:
1. An Google Cloud account.
2. A running Kestra instance in a version 0.16.0 or later with Google credentials stored as [secrets](https://kestra.io/docs/concepts/secret) or environment variables within the Kestra instance.

## Google Cloud Console Setup

### Enable Batch API

Inside of the Cloud Console, you'll need to go to APIs and search for Batch API. Once you've got to it, you'll need to enable it so that Kestra can create Batch Jobs.

![batchapi](/docs/how-to-guides/gcp-batch/batchapi.png)

After you've enabled it, you'll be prompted to make some credentials for it so you can integrate it with your application.

### Create the Service Account

Now that the Batch API is enabled, we can proceed with creating credentials so we can access GCP directly inside of Kestra. Following the prompt after enabling the Batch API, we will be asked to select the type of data we will be using. In this case, it's `Application data` which will create a Service Account for us to use.

![api-credientials-1](/docs/how-to-guides/gcp-batch/api-credientials-1.png)

After you've selected this, you'll need to give a name to your service account. Name it something memorable, as we'll need to type this into Kestra later.

![sa-1](/docs/how-to-guides/gcp-batch/sa-1.png)

Once you've given it a name, make sure to select the following roles:
- Batch Job Editor
- Logs Viewer
- Storage Object Creator

![roles](/docs/how-to-guides/gcp-batch/roles.png)

Afterwards, we will need to make credentials for our service account so we can add these into Kestra. To do so, head over 

Make sure to select JSON as the Key type so we can paste this JSON into our Kestra flow.

![create-key](/docs/how-to-guides/gcp-batch/create-key.png)

### Create Bucket

Head to the search bar and type "Bucket" to find GCS Bucket. Now create a new bucket! You'll be prompted to set a name, region and various other permissions. For now, we can leave these all to default.

![bucket](/docs/how-to-guides/gcp-batch/bucket.png)

### Creating our Flow

Below is an example flow that will run a Python file called `main.py` on a GCP Batch Task Runner. At the top of the `io.kestra.plugin.scripts.python.Commands` task, there are the properties for defining our Task Runner:

```yaml
containerImage: ghcr.io/kestra-io/kestrapy:latest
taskRunner:
  type: io.kestra.plugin.gcp.runner.GcpBatchTaskRunner
  projectId: {{ secrets.projectId }}
  region: europe-west2
  bucket: {{ secrets.bucket }}
  serviceAccount: |
    {
      "SERVICE ACCOUNT JSON"
    }
```

This is where we can enter the details for GCP such as the `projectId`, `region`, `bucket`, as well as the Service Account JSON.

```yaml
id: gcp_batch_runner
namespace: dev

tasks:
  - id: scrape_environment_info
    type: io.kestra.plugin.scripts.python.Commands
    containerImage: ghcr.io/kestra-io/kestrapy:latest
    taskRunner:
      type: io.kestra.plugin.gcp.runner.GcpBatchTaskRunner
      projectId: {{ secrets.projectId }}
      region: europe-west2
      bucket: {{ secrets.bucket }}
      serviceAccount: |
        {
          "SERVICE ACCOUNT JSON"
        }
    commands:
      - python {{workingDir}}/main.py
    namespaceFiles:
      enabled: true
    outputFiles:
      - "environment_info.json"
    inputFiles:
      main.py: |
        import platform
        import socket
        import sys
        import json
        from kestra import Kestra

        print("Hello from GCP Batch and kestra!")

        def print_environment_info():
            print(f"Host's network name: {platform.node()}")
            print(f"Python version: {platform.python_version()}")
            print(f"Platform information (instance type): {platform.platform()}")
            print(f"OS/Arch: {sys.platform}/{platform.machine()}")

            env_info = {
                "host": platform.node(),
                "platform": platform.platform(),
                "OS": sys.platform,
                "python_version": platform.python_version(),
            }
            Kestra.outputs(env_info)

            filename = '{{workingDir}}/environment_info.json'
            with open(filename, 'w') as json_file:
                json.dump(env_info, json_file, indent=4)

        print_environment_info()
```

When we press execute, we can see that our task runner is created in the Logs.