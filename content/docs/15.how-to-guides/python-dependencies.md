---
title: Manage Python Dependencies
icon: /docs/icons/python.svg
stage: Getting Started
topics:
  - Scripting
---

Manage your Python dependencies inside of Kestra.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/iZeDizdrpMI?si=af1byHzZcxvUL-DQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Managing Python Dependencies can be frustrating. There's several ways you can manage your dependencies in Kestra.

## Install with pip using `beforeCommands`

Before your `Script` and `Commands` tasks, you can add a list of commands under the `beforeCommands` property. This works well for installing packages with `pip` or setting up a virtual environment:

```yaml
id: beforecommands
namespace: company.team

tasks:
  - id: code
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    beforeCommands:
      - python3 -m venv .venv
      - . .venv/bin/activate
      - pip install pandas kestra
    script: |
      import pandas as pd
      from kestra import Kestra

      df = pd.read_csv('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv')
      total_revenue = df['total'].sum()
      Kestra.outputs({"total": total_revenue})
```

By using a [Process Task Runner](../task-runners/04.types/01.process-task-runner.md), we can speed up the execution time so that our task isn't pulling a container image to run the task inside of a container.

## Cache dependencies

:::badge{version=">=0.23" editions="OSS,EE"}
:::

Since Kestra 0.23, you can also use the `dependencies` property allowing you to cache Python dependencies across multiple executions.

<div class="video-container">
  <iframe src="https://youtube.com/embed/g9Jt5zt9wI4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

With this feature, Python dependencies are cached and reused across executions of different flows. The [uv package manager](python-uv.md) installs the dependencies on the [worker](../08.architecture/02.server-components.md#worker) under the hood. These cached dependencies will be available for subsequent executions, leading to performance improvements. This method is recommended for smaller tasks that require only a few dependencies, which you don't want to add each time. For more complex workflows, you can continue to use `beforeCommands`.

The added properties are `dependencies`, which lists the dependencies (e.g., pandas), and `dependencyCacheEnabled`, which, when set to true, enables caching of dependencies across tasks. An example flow is as follows: the first execution installs the dependencies, but each subsequent execution of this flow, or any other flow relying on these packages, will show improved performance.

```yaml
id: python_dependencies
namespace: company-team
tasks:
  - id: python
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:3.13-slim
    dependencies:
      - pandas
      - kestra
    script: |
      from kestra import Kestra
      import pandas as pd
      data = {
        'Name': ['Alice', 'Bob', 'Charlie'],
        'Age': [25, 30, 35]
      }
      df = pd.DataFrame(data)
      print(df)
      print("Average age:", df['Age'].mean())
      Kestra.outputs({"average_age": df['Age'].mean()})
```

## Set Container Image with Docker Task Runner

If we would prefer to run our task inside of a container, we can set our Task Runner to Docker and specify a container image with the appropriate dependencies bundled in. Our previous example used `pandas` which is bundled into the `ghcr.io/kestra-io/pydata:latest` available as one of the ready to go images on our [GitHub](https://github.com/orgs/kestra-io/packages?repo_name=examples).

```yaml
id: container_image
namespace: company.team

tasks:
  - id: code
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: ghcr.io/kestra-io/pydata:latest
    script: |
      import pandas as pd
      from kestra import Kestra

      df = pd.read_csv('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv')
      total_revenue = df['total'].sum()
      Kestra.outputs({"total": total_revenue})
```

## Build Docker Image and set it with Docker Task Runner

If we can't find an image with the dependencies we need readily available, we can build our own using the `docker.Build` task.
We can specify a Dockerfile that uses a `python:3.10` image as the base, and then install our specific dependencies on top of that.

In the example below, we are using `pip install` to install both `kestra` and `pandas`. Once our image has been built, we can reference it in an expression in our Python task:

```yaml
id: container_image_build
namespace: company.team

tasks:
  - id: build
    type: io.kestra.plugin.docker.Build
    dockerfile: |
      FROM python:3.10
      RUN pip install --upgrade pip
      RUN pip install --no-cache-dir kestra pandas
    tags:
      - python_image

  - id: code
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
      pullPolicy: NEVER
    containerImage: "{{ outputs.build.imageId }}"
    script: |
      import pandas as pd
      from kestra import Kestra

      df = pd.read_csv('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv')
      total_revenue = df['total'].sum()
      Kestra.outputs({"total": total_revenue})
```

## Build Custom Packages

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/mLcoLK0y1m0?si=0H4XW_s-aayEJDi8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

You can also build packages directly inside of Kestra and then use that package between different flows in the same namespace. This works for zip files and wheels.

Here's an example that generates a `.tar.gz` package:

```yaml
id: build_tar_gz
namespace: company

tasks:
  - id: sync_code_to_kestra
    type: io.kestra.plugin.git.SyncNamespaceFiles
    disabled: true # already synced files
    namespace: "{{ flow.namespace }}"
    gitDirectory: .
    url: https://github.com/anna-geller/python-in-kestra
    branch: main
    username: anna-geller
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"

  - id: build
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
    beforeCommands:
      - pip install build
    commands:
      - python -m build
    outputFiles:
      - "**/*.tar.gz"

  - id: upload
    type: io.kestra.plugin.core.namespace.UploadFiles
    namespace: company.sales
    filesMap:
      "etl-0.1.0.tar.gz": "{{ outputs.build.outputFiles['dist/etl-0.1.0.tar.gz']}}"
```

The package can be used in a separate workflow:
```yaml
id: install_from_zip
namespace: company.sales

inputs:
  - id: date
    type: STRING
    defaults: 12/24/2024
    displayName: Delivery Date

tasks:
  - id: python
    type: io.kestra.plugin.scripts.python.Script
    namespaceFiles:
      enabled: true
    beforeCommands:
      - pip install etl-0.1.0.tar.gz
    script: |
      import etl.utils as etl

      out = etl.standardize_date_format("{{ inputs.date }}")
      print(out)
```
