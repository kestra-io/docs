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

Managing Python Dependencies can be frustrating. There's 3 ways you can manage your dependencies in Kestra.

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
