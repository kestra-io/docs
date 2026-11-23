---
title: Install Dependencies at Runtime for Script Tasks
h1: Install Dependencies for Script Tasks
sidebarTitle: Installing Dependencies
icon: /src/contents/docs/icons/dev.svg
description: Install packages for Kestra script tasks with the Python `dependencies` property, `beforeCommands`, prebuilt or custom Docker images, or packages preinstalled on the worker.
---

Install the packages your script tasks need, and choose an approach that keeps executions fast.

## Choose an approach

| Approach | Use it when |
| --- | --- |
| [Python `dependencies` property](#declare-python-dependencies) | You run Python and want Kestra to install and cache packages for you. This is the default choice for Python. |
| [`beforeCommands`](#install-packages-with-beforecommands) | You need a few packages in any language, or full control over the install commands. Packages are installed on every run. |
| [A container image with packages preinstalled](#use-a-container-image-with-dependencies-preinstalled) | Installs are slow or the dependency set is large, or you want pinned versions in production. |
| [Packages preinstalled on the Kestra server](#preinstall-packages-on-the-kestra-server) | You use the Process task runner and want packages available to every task without installing them at runtime. |

## Declare Python dependencies

Python `Script` and `Commands` tasks accept a `dependencies` property: a list of pip-compatible package specifiers such as `pandas` or `requests>=2.28`. Kestra installs them before the script runs, so you don't need `beforeCommands`.

```yaml
id: python_dependencies
namespace: company.team

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

      df = pd.DataFrame({"name": ["Alice", "Bob", "Charlie"], "age": [25, 30, 35]})
      print(df)
      Kestra.outputs({"average_age": df["age"].mean()})
```

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/g9Jt5zt9wI4" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

### How caching works

`dependencyCacheEnabled` defaults to `true`. After the first run resolves the packages, Kestra stores them in [internal storage](../../08.architecture/data-components/index.md#internal-storage). Later runs restore them from there instead of installing again. Each flow has its own cache, keyed by the task type, the Python version, and the dependency list. Changing one dependency creates a new cache entry, and the first run after the change installs the packages again.

Set `dependencyCacheEnabled: false` to install the packages on every run.

### Python version and package manager

Kestra resolves packages for the Python version of the task's interpreter. With the Docker task runner, it reads the version from the `containerImage` tag when the tag matches `python:<version>`, such as `python:3.12` or the default `python:3.13-slim`. For other images, such as `ghcr.io/kestra-io/pydata:latest`, it can't read the version, so it uses the worker's local Python version, or Python 3.13 if none is found. Set `pythonVersion` explicitly so resolved packages match the interpreter in the image.

Packages are installed with [uv](https://docs.astral.sh/uv/) by default. Set `packageManager: PIP` to use pip instead. If uv isn't installed on the worker, Kestra downloads a pinned, checksum-verified uv installer. On workers without internet access, set `uvAutoInstallEnabled: false` and preinstall uv on the worker, or point the `UV_PATH` environment variable to it.

## Install packages with `beforeCommands`

`beforeCommands` runs shell commands before the script, in the same container or process. Use it for languages without a `dependencies` property, or when you need full control over the install. Packages are installed on every run, which adds time to each execution.

### Install packages with pip

This example installs `requests` and `kestra` before the script starts:

```yaml
id: pip
namespace: company.team

tasks:
  - id: before_commands
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:3.13-slim
    beforeCommands:
      - pip install requests kestra > /dev/null
    script: |
      import requests
      import kestra

      print(f"Requests version: {requests.__version__}")
```

### Install from a `requirements.txt` file

Add the file with `inputFiles`, then install it in `beforeCommands`:

```yaml
id: python_requirements_file
namespace: company.team

tasks:
  - id: list_installed_packages
    type: io.kestra.plugin.scripts.python.Commands
    containerImage: python:3.13-slim
    env:
      PIP_ROOT_USER_ACTION: ignore
    inputFiles:
      requirements.txt: |
        polars
        requests
    beforeCommands:
      - pip install -r requirements.txt > /dev/null
    commands:
      - pip list
```

If `requirements.txt` lives in a Git repository, clone it with the [git.Clone](/plugins/plugin-git/io.kestra.plugin.git.clone) task inside a [WorkingDirectory](/plugins/core/flow/io.kestra.plugin.core.flow.workingdirectory) task so the script task can read the cloned files. In most other cases, `inputFiles` or [namespace files](../../06.concepts/02.namespace-files/index.md) are simpler.

### Use a virtual environment with the Process task runner

The [Process task runner](../../task-runners/04.types/01.process-task-runner/index.md) runs scripts directly on the worker, so packages installed with `beforeCommands` land in the worker's Python environment. Create a virtual environment to keep each task's packages separate. The Kestra image includes [uv](https://docs.astral.sh/uv/) but not the `venv` module, so create the environment with `uv venv`:

```yaml
id: python_venv
namespace: company.team

tasks:
  - id: code
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    beforeCommands:
      - uv venv --quiet
      - . .venv/bin/activate
      - uv pip install --quiet pandas kestra
    script: |
      import pandas as pd
      from kestra import Kestra

      df = pd.read_csv("https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv")
      Kestra.outputs({"total": df["total"].sum()})
```

The virtual environment lives in the task's working directory and is deleted when the task ends.

### Run other languages with the Process task runner

To run a language that isn't installed on the worker, install its toolchain in `beforeCommands`. This example installs Go and a Go module, then writes a CSV file:

```yaml
id: go_process
namespace: company.team

tasks:
  - id: script
    type: io.kestra.plugin.scripts.go.Script
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    beforeCommands:
    - wget -qO- https://go.dev/dl/go1.24.3.linux-amd64.tar.gz | tar -C /usr/local -xzf - && echo 'export PATH=$PATH:/usr/local/go/bin' > /etc/profile.d/golang.sh && export PATH=$PATH:/usr/local/go/bin
    - go mod init go_script
    - go get github.com/go-gota/gota/dataframe
    - go mod tidy
    script: |
        package main
        import (
            "os"
            "github.com/go-gota/gota/dataframe"
            "github.com/go-gota/gota/series"
        )
        func main() {
            names := series.New([]string{"Alice", "Bob", "Charlie"}, series.String, "Name")
            ages := series.New([]int{25, 30, 35}, series.Int, "Age")
            df := dataframe.New(names, ages)
            file, _ := os.Create("output.csv")
            df.WriteCSV(file)
            defer file.Close()
        }
    outputFiles:
      - output.csv
```

### Cache installed packages with `WorkingDirectory`

For packages you install with `beforeCommands`, wrap the task in a `WorkingDirectory` task and [cache](../../06.concepts/12.caching/index.md) the install folder. This works with the Process task runner only. The example installs `pandas` into a local `deps` folder and keeps it for 24 hours:

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
        beforeCommands:
          - pip install --target=./deps pandas
        env:
          PYTHONPATH: "./deps"
        script: |
          import pandas as pd
          print(pd.__version__)
    cache:
      patterns:
        - deps/**
      ttl: PT24H
```

For Python, the `dependencies` property gives you caching without this setup.

## Use a container image with dependencies preinstalled

When packages are built into the image, nothing is downloaded at runtime and every execution starts with the same versions.

### Kestra's prebuilt images

Kestra publishes public images for common use cases in the [kestra-io/examples](https://github.com/orgs/kestra-io/packages?repo_name=examples) repository, hosted on GitHub Container Registry as `ghcr.io/kestra-io/<name>:latest`. For example, `ghcr.io/kestra-io/pydata:latest` includes `pandas`, and `ghcr.io/kestra-io/rdata:latest` includes common R packages such as `dplyr` and `arrow`. Many [Blueprints](/blueprints) use these images.

```yaml
id: container_image
namespace: company.team

tasks:
  - id: code
    type: io.kestra.plugin.scripts.python.Script
    containerImage: ghcr.io/kestra-io/pydata:latest
    script: |
      import pandas as pd

      df = pd.read_csv("https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv")
      print(df["total"].sum())
```

Prebuilt images matter most for languages with slow installs. Installing R packages such as `dplyr` and `arrow` with `beforeCommands` can take up to 30 minutes, while the `rdata` image has them ready:

```yaml
id: r_cars
namespace: company.team

tasks:
  - id: r
    type: io.kestra.plugin.scripts.r.Script
    containerImage: ghcr.io/kestra-io/rdata:latest
    outputFiles:
      - "*.csv"
    script: |
      library(dplyr)
      data(mtcars)
      final <- mtcars %>% summarise(avg_mpg = mean(mpg), avg_hp = mean(hp))
      print(final)
      write.csv(final, "final.csv")
```

Prebuilt images use the `latest` tag and change over time. Before moving to production, build your own image with the exact package versions you need.

### Build your own image

Use the [Docker Build](/plugins/plugin-docker/io.kestra.plugin.docker.cli.build) task to build an image in the flow, then pass its `imageId` output to the script task. Set `pullPolicy: NEVER` so the Docker task runner uses the local image instead of pulling from a registry:

```yaml
id: container_image_build
namespace: company.team

tasks:
  - id: build
    type: io.kestra.plugin.docker.cli.Build
    dockerfile: |
      FROM python:3.13-slim
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

      df = pd.read_csv("https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv")
      Kestra.outputs({"total": df["total"].sum()})
```

To share the image across flows and workers, push it to a registry with `push: true` and `credentials`, and reference its tag in `containerImage`. See [Custom Docker image](../04.custom-docker-image/index.md).

## Preinstall packages on the Kestra server

With the Process task runner, scripts run in the Kestra server's own environment, so you can install packages there once instead of at runtime.

For a standalone server, install the packages before starting Kestra:

```bash
pip install requests pandas polars && ./kestra server standalone --worker-thread=16
```

With Docker, extend the Kestra image. Switch to `root` to install the packages, then back to the `kestra` user:

```dockerfile
FROM kestra/kestra:latest

USER root
RUN pip install requests pandas polars
USER kestra

CMD ["server", "standalone"]
```

In your Docker Compose file, replace the Kestra service's `image` with `build: .` to use this Dockerfile, and remove its `command`, since the Dockerfile's `CMD` sets it:

```yaml
services:
  kestra:
    build: .
```

Tasks that use these packages must set the Process task runner. To check that the packages are available, run `pip list`:

```yaml
id: list_dependencies
namespace: company.team

tasks:
  - id: check
    type: io.kestra.plugin.scripts.python.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - pip list
```

## Install a Python package built in Kestra

You can build your own Python package in one flow and install it in others. Store the package source as [namespace files](../../06.concepts/02.namespace-files/index.md), build it with `python -m build`, and upload the result back to namespace storage:

```yaml
id: build_package
namespace: company

tasks:
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
      "etl-0.1.0.tar.gz": "{{ outputs.build.outputFiles['dist/etl-0.1.0.tar.gz'] }}"
```

A flow in `company.sales` can then install the package from its namespace files:

```yaml
id: install_package
namespace: company.sales

tasks:
  - id: python
    type: io.kestra.plugin.scripts.python.Script
    namespaceFiles:
      enabled: true
    beforeCommands:
      - pip install etl-0.1.0.tar.gz
    script: |
      import etl.utils as etl

      print(etl.standardize_date_format("12/24/2024"))
```
