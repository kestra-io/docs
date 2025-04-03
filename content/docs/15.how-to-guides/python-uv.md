---
title: Manage Python Dependencies with uv
icon: /docs/icons/python.svg
stage: Intermediate
topics:
  - Scripting
---

Manage your Python Dependecies inside of Kestra using `uv`.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/tyEbyhg6jmY?si=v_vQVfBUvKJD7-rn" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Overview

`uv` is a new Python package and project manager designed to be extremely fast. Written in rust, it aims to fix some of the pitfalls of pip while also combining multiple python dependency management tools like `virtualenv`, `poetry`, and more into one unified tool.

`uv` can be used inside of Kestra to install dependencies as well as manage virtual environments in combination with the [Process Task Runner](../task-runners/04.types/01.process-task-runner.md).

## Install Dependencies

By default, Kestra has `uv` installed to our default Python image `kestrapy`, so anytime you use a Python `Commands` or `Script` task with the [Docker Task Runner](../task-runners/04.types/02.docker-task-runner.md), it will be preinstalled.

If you're using a different image or you'd prefer to use the [Process Task Runner](../task-runners/04.types/01.process-task-runner.md), you can also install `uv` using `beforeCommands` with `pip install uv`.

```yaml
id: python_example
namespace: company.team

tasks:
  - id: code_process
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    beforeCommands:
      - pip install uv 2> /dev/null
    script: |
      print("Hello, World!")
```

By default, `uv` will look for a virtual environment to install dependencies into, but this is not required when using the [Docker Task Runner](../task-runners/04.types/02.docker-task-runner.md) as that provides the isolation we would get from a virtual environment. To override this, we can add the `--system` flag to our install command.

```yaml
id: python_example
namespace: company.team

tasks:
  - id: code
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    beforeCommands:
      - uv pip install pandas --system 2> /dev/null
    script: |
      import pandas as pd
      from kestra import Kestra

      df = pd.read_csv('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv')
      total_revenue = df['total'].sum()
      Kestra.outputs({"total": total_revenue})
```

If you're using the [Process Task Runner](../task-runners/04.types/01.process-task-runner.md), you can use `uv` to create a virtual environment with `uv venv`. Once this has completed, you can run `uv pip install`, and it will automatically install these dependencies to this virtual environment without needing to activate the virtual environment.

```yaml
id: python_example
namespace: company.team

tasks:
  - id: code_process
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    beforeCommands:
      - pip install uv 2> /dev/null
      - uv venv 2> /dev/null
      - uv pip install pandas kestra 2> /dev/null
      - . .venv/bin/activate
    script: |
      import pandas as pd
      from kestra import Kestra

      df = pd.read_csv('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv')
      total_revenue = df['total'].sum()
      Kestra.outputs({"total": total_revenue})
```

## Install with a custom Docker image

If you have multiple workflows using `uv`, you can install it on the Kestra server by creating a custom Docker image for Kestra. Here's an example of a Dockerfile which is based off the Kestra image but installs `uv` on top of it.

```dockerfile
FROM kestra/kestra:latest
USER root
RUN pip install uv
CMD ["server", "standalone"]
```

Learn more about configuring a custom Docker image for Kestra [here](../14.best-practices/4.managing-pip-dependencies.md#install-pip-package-dependencies-at-server-startup).
