---
title: Long running and intensive processes on Kubernetes
icon: /docs/icons/kubernetes.svg
stage: Advanced
topics:
  - DevOps
  - Kestra Workflow Components
---

Schedule long running and intensive processes with Kestra on Kubernetes.

## Introduction

Long running tasks hold strong importance in the world of automation.
They can range from data processing, machine learning, and data analytics to batch processing, ETL, and more.

While these tasks are essential for business operations, they can be resource-intensive and time-consuming while requiring specific hardware. To execute these tasks efficiently, you need a robust and scalable infrastructure that can handle the workload effectively.

Kestra offers various task execution solutions such as Docker, local processes, and Kubernetes. See [Task Runners](../06.enterprise/task-runners.md) for more details.

In this guide, we will focus on executing long-running tasks on **Kubernetes** using Kestra.

Kubernetes pods are a great fit due to the control and flexibility they provide. With Kubernetes, you can precisely define resource requirements, permissions, namespace, handle workload identity, and ensure proper networking for your tasks. Pods can also easily access other Kubernetes services hosted on the cluster such as databases, storage and applications.

As an exmample, we will use a [dbt job](https://docs.getdbt.com/docs/running-a-dbt-project/run-your-dbt-projects) to demonstrate how Kestra can help you execute complex tasks on Kubernetes with resource requirements.

## Schedule task in a Kubernetes pod using podCreate

Kestra's [podCreate](/plugins/plugin-kubernetes/tasks/io.kestra.plugin.kubernetes.podcreate) task allows you to launch a Kubernetes pod directly by providing the complete Kubernetes YAML configuration as an input. This gives you full control over the pod’s specifications, such as CPU, memory, image, or node selector.

Here is an example of a dbt job that runs on Kubernetes using Kestra:

```yaml
id: my-dbt-job
namespace: dev

tasks:
  - id: dbt-command
    type: io.kestra.plugin.kubernetes.PodCreate

    # Retry the task if it fails
    retry:
      behavior: RETRY_FAILED_TASK
      maxAttempt: 2
      type: constant
      interval: PT5M
      warningOnRetry: true
    namespace: kestra

    # Define the commands to run
    inputFiles:
      dbt-commands.sh: |
        #!/bin/bash

        # Exit on error
        set -eo pipefail

        # Clone the dbt example repository
        git clone --depth 1 https://github.com/dbt-labs/jaffle_shop_duckdb.git --branch duckdb --single-branch

        # Copy the dbt example repository to the working directory
        cp -a jaffle_shop_duckdb/. .

        # dbt commands to run
        dbt deps
        dbt build

    # Define the pod specification using the Kubernetes YAML syntax
    spec:
      restartPolicy: Never
      containers:
        - name: dbt-duckdb
          image: ghcr.io/kestra-io/dbt-duckdb:latest

          # Specify resource requirements
          resources:
            request:
              cpu: "300m"
              memory: "500Mi"

          # Run the script in the container
          command:
            - "/bin/bash"
            - "{{workingDir}}/dbt-commands.sh"

      # Node selector to run the pod on a specific node
      nodeSelector: {}
```

This flow will:
- create a Kubernetes pod in the `kestra` namespace with the specified resource requirements: 300m CPU and 500Mi memory
- clone the dbt example repository inside the pod
- run the dbt seed and build commands

![dbt-pod-create](/docs/how-to-guides/kubernetes/pod_create_dbt.png)

At the end of the execution, the pod is deleted, and the logs remain available in the Kestra UI.

![dbt-pod-deleted-after-success](/docs/how-to-guides/kubernetes/pod_create_delete.png)

## Embrace Kestra versality with Kubernetes Task Runners

While podCreate provides deep control, it takes aways all the benefits of Kestra's rich plugins ecosystem, [dbt plugin](https://kestra.io/plugins/plugin-dbt/tasks/cli/io.kestra.plugin.dbt.cli.dbtcli) in this case. Also it can be cumbersome to manage complex Kubernetes pod YAML specification for each task, especially when you have multiple commands to run.

To leverage the best of both worlds, Kestra’s Task Runners allow you to define workflows that benefit from Kestra's plugin system, enabling you to use familiar plugins while still leveraging the flexibility of Kubernetes to secure and scale the tasks effectively.

Also it gives you the flexibility to test your task easily before deploying it on Kubernetes using Task Runner types like Docker or Process.

The same example would look like this using a Task Runner:

```yaml
id: dbt-task-runner
namespace: dev

tasks:
  - id: dbt_build
    type: io.kestra.plugin.dbt.cli.DbtCLI
    taskRunner:
      type: io.kestra.plugin.ee.kubernetes.runner.Kubernetes
      namespace: kestra
      resources:
        request:
          cpu: "300m"
          memory: "500Mi"
    containerImage: ghcr.io/kestra-io/dbt-duckdb:latest
    commands:
      - git clone --depth 1 https://github.com/dbt-labs/jaffle_shop_duckdb.git --branch duckdb --single-branch
      - cp -a jaffle_shop_duckdb/. .
      - dbt deps
      - dbt build
```

![dbt-task-runner](/docs/how-to-guides/kubernetes/task_runner_dbt.png)


In case we want to easily test this flow on a local Kestra instance, we would just have to change the `taskRunner` type to `io.kestra.plugin.scripts.runner.docker.Docker`:

```yaml
id: dbt-task-runner
namespace: dev

tasks:
  - id: dbt_build
    type: io.kestra.plugin.dbt.cli.DbtCLI
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: ghcr.io/kestra-io/dbt-duckdb:latest
    commands:
      - git clone --depth 1 https://github.com/dbt-labs/jaffle_shop_duckdb.git --branch duckdb --single-branch
      - cp -a jaffle_shop_duckdb/. .
      - dbt deps
      - dbt build
```

This flexibility allows you to test your tasks locally before deploying them on Kubernetes.


## Conclusion

Kestra provides a powerful and flexible way to execute long running and intensive tasks on Kubernetes. By leveraging Kestra’s Task Runners, you can easily define workflows that benefit from Kestra's plugin system while still leveraging the flexibility of Kubernetes to secure and scale the tasks effectively.

If needed, you can also use the `podCreate` task to launch a Kubernetes pod directly by providing the complete Kubernetes YAML configuration as input.