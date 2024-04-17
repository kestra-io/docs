---
title: Managing pip package dependencies
icon: /docs/icons/best-practices.svg
---

When you have python commands or python scripts to execute in the task, you need to install pip dependencies required to execute your python code. If you use python docker image, and install pip package dependencies as part of your `beforeCommands`, these packages will be downloaded and installed each time you run your task. This can be pretty time consuming and will lead to increased duration for your executions. This page describes some of the best ways to manage pip package dependencies for your flows.

## Using custom docker image

Instead of using the python docker image, and installing pip package dependencies using `beforeCommands`, you can create a customer docker image with python and the required pip package dependencies. As all the pip packages would be part of this custom docker image, you need not download and install the pip package dependencies during each execution. This would prevent the load on the execution, and the execution time will be dedicated to only the processing of the python code.

## Install pip package dependencies at server startup

This is another way of preventing the overload of downloading and installing pip package dependencies in each execution. You can install all the pip package dependencies, and then start the Kestra server. For Kestra standalone server, you can achieve this by running the command in the following fashion:

```bash
pip install requests pandas polars && ./kestra server standalone --worker-thread=16
```

In case you want to run Kestra using docker, you can make the changes in the docker-compose.yml file to install the pip package dependencies, and then start the Kestra server.

In either of these Kestra server installations, you will need to run the Python tasks using the `RUNNER` process so that the python code has access to the pip package dependencies installed in the Kestra server process.

## Using cache files

In a WorkingDirectory task, you can have the virtual environment setup, install all the pip package dependencies, and cache the `venv` folder. The pip package dependencies will then be cached as part of the virtual environment folder, and you need not install it on every execution of the flow. This is explained in detail in the [caching](https://kestra.io/docs/developer-guide/caching) page.

Here is a sample flow demonstrating how the `venv` folder can be cached:

```yaml
id: python_cached_dependencies
namespace: dev

tasks:
  - id: working_dir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: python_script
        type: io.kestra.plugin.scripts.python.Script
        runner: PROCESS
        warningOnStdErr: false
        beforeCommands:
          - python -m venv venv
          - source venv/bin/activate
          - pip install pandas
        script: |
          import pandas as pd
          print(pd.__version__)
    cache:
      patterns:
        - venv/**
      ttl: PT24H
```

Thus, using one of the above techniques, you can prevent the installation of the pip package dependencies with every execution, and reduce your execution time.
