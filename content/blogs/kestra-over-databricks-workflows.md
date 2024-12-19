---
title: "Simplifying Databricks Workflow Management with Kestra"
description: Databricks simplifies big data and ML workflows but brings challenges like cluster costs and debugging complexity. See how Kestra's orchestration enhances Databricks capabilities
date: 2024-12-18T13:00:00
category: Solutions
author:
  name: Emmanuel Darras
  image: edarras
  role: CEO & Co-Founder
image: /blogs/kestra-over-databricks-workflows.jpg
---

Databricks offers a robust platform for big data processing and machine learning. Yet we’ve all encountered the challenges that come with managing its workflows and clusters. These challenges aren’t about what Databricks can do, but more about the increasingly complex data ecosystems driving up costs or adding operational overhead.

Many Kestra users  are using our orchestration capabilities for Databricks. Let’s see how Kestra can overtake the misses from Databricks workflows. 

---

## The Realities of Managing Databricks

Databricks workflows are powerful, but they come with limitations that developers feel immediately when scaling beyond simple tasks:

- **Cluster Costs:** Managing Databricks clusters efficiently can be tricky. Forgetting to shut down clusters, misconfiguring autoscaling, or running oversized clusters for lightweight jobs often leads to wasted compute power and inflated bills.
- **Workflow Limitations:** Databricks’ native workflows are great for jobs running entirely within Databricks. But what happens when you need to orchestrate tasks that touch external systems, like APIs, cloud storage, or data warehouses? You’re often left writing glue code, which adds complexity and makes debugging harder.
- **Debugging Blind Spots:** Anyone who has worked with large-scale Databricks pipelines knows the frustration of tracking down failures. Logs are often scattered, and it’s hard to get a bird’s-eye view of what went wrong and where.

---

## Kestra’s Take on Databricks Orchestration

Kestra doesn’t try to replace Databricks’ capabilities—it complements them by addressing the operational gaps that come with managing large-scale workflows.

### Efficient Cluster Management

Clusters are the backbone of Databricks, but they’re also the source of much of the frustration (and cost). With Kestra, cluster lifecycle management becomes automatic. Clusters can be spun up when needed for specific tasks and shut down as soon as the job is done, eliminating idle time and runaway bills.

This means you can focus on building workflows without worrying about whether a cluster was left running over the weekend or under-resourced for a critical job.

```yaml
id: manage_clusters
namespace: company.databricks

tasks:
  - id: start_cluster
    type: io.kestra.plugin.databricks.cluster.CreateCluster
    authentication:
      token: "{{ secret('DATABRICKS_TOKEN') }}"
      host: "{{ secret('DATABRICKS_HOST') }}"
    clusterName: analysis-cluster
    nodeTypeId: Standard_DS3_v2
    numWorkers: 2
    sparkVersion: 13.0.x-scala2.12

  - id: run_job
    type: io.kestra.plugin.databricks.RunJob
    jobId: 67890

  - id: stop_cluster
    type: io.kestra.plugin.databricks.cluster.DeleteCluster
    authentication:
      token: "{{ secret('DATABRICKS_TOKEN') }}"
      host: "{{ secret('DATABRICKS_HOST') }}"
    clusterId: "{{ outputs.start_cluster.clusterId }}"
```

Kestra ensures clusters are spun up only when needed and terminated immediately after, eliminating idle time and unnecessary costs.

### Orchestrating  ETL Pipelines

Databricks workflows are great for Spark-centric operations, but  pipelines often touch multiple systems. We let you connect Databricks with cloud storage, APIs, and databases.

Here’s how Kestra simplifies ETL with Databricks:

```yaml
id: databricks_etl
namespace: company.data

tasks:
  - id: ingest_data
    type: io.kestra.plugin.databricks.RunNotebook
    notebookPath: "/Shared/IngestRawData"
    parameters:
      source: "s3://raw-data-bucket"
      target: "dbfs:/mnt/processed-data"

  - id: transform_data
    type: io.kestra.plugin.databricks.RunJob
    jobId: 12345
    clusterId: "{{ outputs.ingest_data.clusterId }}"
    parameters:
      inputPath: "dbfs:/mnt/processed-data"
      outputPath: "dbfs:/mnt/analytics-ready-data"

```

This workflow ingests raw data from an S3 bucket, processes it in Databricks, and stores the results in a structured format for analytics. No need for brittle glue code—everything is managed declaratively.

---

### File Management

Databricks File System (DBFS) is integral to Databricks workflows, but managing file uploads, downloads, and cleanup tasks often involves additional scripts. Kestra simplify this process with built-in file management tasks:

```yaml
id: file_management
namespace: company.data

tasks:
  - id: upload_file
    type: io.kestra.plugin.databricks.dbfs.Upload
    authentication:
      token: "{{ secret('DATABRICKS_TOKEN') }}"
      host: "{{ secret('DATABRICKS_HOST') }}"
    from: "/local/path/to/data.csv"
    to: "dbfs:/mnt/data/data.csv"

  - id: query_file
    type: io.kestra.plugin.databricks.sql.Query
    accessToken: "{{ secret('DATABRICKS_TOKEN') }}"
    host: "{{ secret('DATABRICKS_HOST') }}"
    httpPath: "/sql/1.0/endpoints/cluster"
    sql: "SELECT * FROM dbfs.`/mnt/data/data.csv`"

```

By using Kestra, you eliminate the need for manual file operations, ensuring data is managed efficiently.

## Why Developers Are Turning to Kestra

We all wants tools that make our lives easier without forcing us to compromise on flexibility or control. Kestra delivers on that by :

- **Cost Control:** Automatic cluster management means you’re only paying for what you use. No more accidental overages or underutilized resources.
- **Flexibility:** Build workflows that integrate Databricks with the rest of your stack, whether it’s an API call, a database query, or a cloud storage operation.
- **Visibility:** A single dashboard gives you a clear view of everything happening in your pipelines, from successes to failures.
- **Scalability:** Kestra handles both simple pipelines and complex, enterprise-grade workflows, so you don’t have to outgrow your tools as your needs evolve.

---

## A Better Way to Work with Databricks

Databricks is an incredible tool, but its operational challenges are real. Kestra is here to bridge those gaps—helping you manage clusters, orchestrate workflows across systems, and keep costs in check.

If you’re tired of wrestling with the same issues, give Kestra a try. It’s built for developers, by developers, with the tools you need to simplify your data workflows without sacrificing the power of Databricks.

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
