---
title: Managing pip package dependencies
icon: /docs/icons/best-practices.svg
---

Learn how to manage pip package dependencies in your flows.

## Motivation

Your Python code may require some `pip` package dependencies. The way you manage these dependencies can have an impact on the execution time of your flows.

If you install `pip` packages within `beforeCommands`, these packages will be downloaded and installed each time you run your task. This can lead to increased duration of your workflow executions. The following sections describe several ways to manage pip package dependencies in your flows.

## Using a custom Docker image

Instead of using the Python Docker image, and installing pip package dependencies using `beforeCommands`, you can create a customer Docker image with Python and the required pip package dependencies. As all the pip packages would be part of this custom Docker image, you need not download and install the pip package dependencies during each execution. This would prevent the load on the execution, and the execution time will be dedicated to only the processing of the Python code.

## Install pip package dependencies at server startup

This is another way of preventing the overload of downloading and installing pip package dependencies in each execution. You can install all the pip package dependencies, and then start the Kestra server. For Kestra standalone server, you can achieve this by running the command in the following fashion:

```bash
pip install requests pandas polars && ./kestra server standalone --worker-thread=16
```

In case you want to run Kestra using Docker, you can make the changes in the `docker-compose.yml` file to install the pip package dependencies, and then start the Kestra server.

In either of these Kestra server installations, you will need to run the Python tasks using the `RUNNER` process so that the Python code has access to the pip package dependencies installed in the Kestra server process.

## Using cache files

In a WorkingDirectory task, you can have the virtual environment setup, install all the pip package dependencies, and cache the `venv` folder. The pip package dependencies will then be cached as part of the virtual environment folder, and you need not install it on every execution of the flow. This is explained in detail in the [caching](../05.concepts/12.caching.md) page.

Here is a sample flow demonstrating how the `venv` folder can be cached:

```yaml
id: python_cached_dependencies
namespace: company.team

tasks:
  - id: working_dir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: python_script
        type: io.kestra.plugin.scripts.python.Script
        taskRunner:
          type: io.kestra.plugin.core.runner.Process
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
