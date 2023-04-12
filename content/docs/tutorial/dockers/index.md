---
order: 7
---

# Docker

Kestra can run some Task like [Python](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Python.html), [Node](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Node.html) or [Singer](https://kestra.io/plugins/plugin-singer/) in Docker containers. It is useful when you need to run a task in a specific environment or when you need to run a task that requires specific dependencies.

::alert{type="warning"}
Having tasks running in a Docker container requires a Docker daemon running on the host.
If you follow the [Getting Started](../../getting-started) guide, you're all set!
::

## Defining a Docker runner

To run a task inside a Docker container, you must define the runner as Docker.

```yaml
runner: DOCKER
```

Then you can define the Docker options to indicate which image to use:

```yaml
dockerOptions:
  image: civisanalytics/datascience-python # Docker image with Python and Pandas already installed
```

You can customize the Docker runner a lot. You can find more information on task documentation that can run in Docker, for example, in the [Python](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Python.html#definitions) task.

## Using a task with a Docker runner in your flow

While Python is powerful, sometimes it could be more efficient to accomplish tasks with a simple bash command. We will use the library [csvkit](https://csvkit.readthedocs.io/en/latest/) to create a new CSV with less column and then print some stats.

The library csvkit required dependencies like a specific Python version. To avoid installing the dependencies on each run, we will use a Docker image that already contains the dependencies. This way, you still have a small task definition that does what you want in only three lines.

::alert{type="info"}
Note that when you want to output files from a Script Task, you must first define it in the`outputFiles` property.
::

```yaml
  - id: bash
    type: io.kestra.core.tasks.scripts.Bash
    runner: DOCKER
    dockerOptions:
      image: jdkelley/csvkit:latest
    inputFiles:
      data.csv: "{{ outputs.download.uri }}"
    outputFiles:
    - data_update
    commands:
      - "csvcut -d ';' -c annee,conso data.csv > new.csv"
      - "csvstat new.csv"
      - "cat new.csv > {{ outputFiles.data_update }}"
```

::collapse{title="Click here to see the full flow"}
```yaml
id: kestra-tutorial
namespace: io.kestra.tutorial
labels:
  env: PRD
description: |
  # Kestra Tutorial
  As you notice, we can use markdown here.
tasks:
  - id: download
    type: io.kestra.plugin.fs.http.Download
    uri: "https://www.data.gouv.fr/fr/datasets/r/d33eabc9-e2fd-4787-83e5-a5fcfb5af66d"
    retry:
      type: constant
      maxDuration: PT1H
      interval: PT10M
  - id: parallel
    type: io.kestra.core.tasks.flows.Parallel
    tasks:
      - id: analyze-data-sum
        type: io.kestra.core.tasks.scripts.Python
        runner: DOCKER
        dockerOptions:
          dockerHost: unix:///dind/docker.sock
          image: python
        inputFiles:
          data.csv: "{{outputs.download.uri}}"
          main.py: |
            import pandas as pd
            from kestra import Kestra
            data = pd.read_csv("data.csv", sep=";")
            sumOfConsumption = data['conso'].sum()
            Kestra.outputs({'sumOfConsumption': int(sumOfConsumption)})
        requirements:
          - pandas
      - id: analyze-data-mean
        type: io.kestra.core.tasks.scripts.Python
        runner: DOCKER
        dockerOptions:
          dockerHost: unix:///dind/docker.sock
          image: python
        inputFiles:
          data.csv: "{{outputs.download.uri}}"
          main.py: |
            import pandas as pd
            from kestra import Kestra
            data = pd.read_csv("data.csv", sep=";")
            meanOfConsumption = data['conso'].mean()
            Kestra.outputs({'meanOfConsumption': int(meanOfConsumption)})
        requirements:
          - pandas
      - id: bash
        type: io.kestra.core.tasks.scripts.Bash
        runner: DOCKER
        dockerOptions:
          image: jdkelley/csvkit:latest
        inputFiles:
          data.csv: "{{ outputs.download.uri }}"
        outputFiles:
        - data_update
        commands:
          - "csvcut -d ';' -c annee,conso data.csv > new.csv"
          - "csvstat new.csv"
          - "cat new.csv > {{ outputFiles.data_update }}"
errors:
  - id: error-handling
    type: io.kestra.core.tasks.log.Log
    message: "An error occurred."
```
::

Bravo :tada: ! You successfully achieve our tutorial and learn the basics of Kestra!

As the next steps, we suggest reading the following documentation in this order:
- Learn Kestra [concepts](../concepts).
- Read the [Developer Guide](../developer-guide) to understand how to build your own flow.
- Look at [Plugins](../../plugins) to perform some real tasks.
- [Deploy](../administrator-guide) your Kestra instance to real environments.
