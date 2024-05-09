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

There are two versions of this tutorial:
- Terraform: provision all necessary resources using a simple ``terraform apply`` command.
- Google Cloud Console: create the necessary resources step by step from the Google Cloud Console.

## Terraform setup

Follow the instructions specified in the [aws-batch/README.md](https://github.com/kestra-io/terraform-deployments/tree/main/aws-batch) within the [terraform-deployments](https://github.com/kestra-io/terraform-deployments) repository to provision all necessary resources using Terraform.

TBC

## Google Cloud Console Setup

### Create the Service Account

- Make sure to enable Batch API
- Make credentials with a service account
  - Application data
  - Roles
- Download service account JSON and paste into a TaskDefault



```yaml
id: gcp_batch_runner
namespace: dev
tasks:
  - id: parallel
    type: io.kestra.core.tasks.flows.Parallel
    tasks:
      - id: scrape_environment_info
        type: io.kestra.plugin.scripts.python.Commands
        allowFailure: true
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

      - id: scrape_wildcard
        type: io.kestra.plugin.scripts.python.Commands
        allowFailure: true
        commands:
          - python {{workingDir}}/main.py
        namespaceFiles:
          enabled: true
        outputFiles:
          - "*.json"
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
            
      - id: scrape_script
        type: io.kestra.plugin.scripts.python.Script
        allowFailure: true
        namespaceFiles:
          enabled: true
        outputFiles:
          - "*.json"
        script: |
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

taskDefaults:
  - type: io.kestra.plugin.scripts.python
    values:
      containerImage: ghcr.io/kestra-io/kestrapy:latest
      taskRunner:
        type: io.kestra.plugin.gcp.runner.GcpBatchTaskRunner
        projectId: PROJECT_ID
        region: REGION
        bucket: BUCKET_ID
        serviceAccount: |
          {
            "SERVICE ACCOUNT JSON"
          }

                    