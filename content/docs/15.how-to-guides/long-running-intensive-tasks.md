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

Kestra offers various task execution solutions such as Docker, local processes, and Kubernetes. See [Task Runners](https://kestra.io/docs/enterprise/task-runners) for more details.

In this guide, we will focus on executing long-running tasks on **Kubernetes** using Kestra.

Kubernetes pods are a great fit due to the control and flexibility they provide. With Kubernetes, you can precisely define resource requirements, permissions, namespace, handle workload identity, and ensure proper networking for your tasks. Pods can also easily access other Kubernetes services hosted on the cluster such as databases, storage and applications.

As an exmample, we will use a [dbt job](https://docs.getdbt.com/docs/running-a-dbt-project/run-your-dbt-projects) to demonstrate how Kestra can help you execute complex tasks on Kubernetes with resource requirements.

## Schedule task in a Kubernetes pod using podCreate

Kestra's [podCreate](https://kestra.io/plugins/plugin-kubernetes/tasks/io.kestra.plugin.kubernetes.podcreate) task allows you to launch a Kubernetes pod directly by providing the complete Kubernetes YAML configuration as input. This gives you full control over the pod’s specifications, such as CPU, memory, image, or node selector.

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
        cp -a jaffle_shop_duckdb/. .
        cp -a {{workingDir}}/. .

        # dbt commands to run
        dbt seed
        dbt build

    # Define the pod specification
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

## Embrace Kestra versality with Kubernetes Task Runners
While podCreate provides deep control, Kestra also offers Kubernetes Task Runners, simplifying the process even further.

With Task Runners, you can integrate Kubernetes pod execution seamlessly into your workflows, without needing to manage complex YAML configurations. Kestra’s Task Runners allow you to define workflows that benefit from Kestra's plugin system, enabling you to use familiar plugins while still leveraging the flexibility of Kubernetes to secure and scale the tasks effectively.

Also it gives you the use any other runner to test your task before deploying it on Kubernetes: DinD, Process,  etc.

In essence, Kestra's Kubernetes Task Runners provide the best of both worlds: the simplicity of workflow management and the power of Kubernetes to handle demanding workloads with custom resource allocations. Whether you need granular control or simplified workflow integration, Kestra gives you the flexibility to execute your tasks efficiently on Kubernetes.


