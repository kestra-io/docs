---
title: "Clever Cloud Offloading 20TB of Infrastructure Data Every Month with Kestra"
description: "Discover how Clever Cloud, a leading PaaS solution have automated their archiving process using Kestra."
date: 2024-04-18T08:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  image: "mproset"
image: /blogs/2024-18-04-clever-cloud-use-case.jpg
---

Clever Cloud provides a Platform as a Service solution, based in Europe. Clever Cloud exists for one purpose: helping people and companies to deliver software and services faster. Their promise is to ensure that once an app is deployed, it stays up, no matter what (high traffic, security updates, DDoS , application failure, hardware issues etc..). The PaaS helps development teams to put digital applications and services into production on a reliable infrastructure, with automatic scalability and transparent pricing. With monitoring data reaching 20TB monthly, Clever Cloud needed a robust solution to manage this influx without compromising system performance or storage efficiency.

## Managing Metrics and Data Volume at Scale

Clever Cloud use metrics to dynamically allocate resources within their infrastructure, ensuring that applications perform optimally. These metrics, critical for both customer-facing and internal applications, are stored into a time series database growing at a pace of 20TB per month. The database, which use **Warp10** on top of **FoundationDB**, efficiently handles hundreds of thousands of data points per second, meeting Clever Cloud's performance requirements. This setup supports the ingestion spikes of over 500,000 data points per second and processing reads exceeding 5,000,000 data points per second.

## Challenges in Data Management

Initially, Clever Cloud faced stability issues due to the rapid growth of their database. To mitigate these, additional SSD nodes were integrated into the **FoundationDB** cluster, addressing immediate storage concerns. However, as the data volume continued to grow, further solutions were needed to balance computing resources and enhance storage capabilities without data loss.

## **Kestra's Role in Automating Data Offloading**

Kestra has been chosen for automating Clever Cloud’s data offloading. Kestra is used to automate data handling tasks, significantly reducing the manual effort required each month

- **HTTP Request Handling**: Using **`io.kestra.plugin.core.http.Request`** for initiating interactions with external data sources.
- **Workflow Modularity**: Employing **`io.kestra.plugin.core.flow.Subflow`** to manage sub-workflows within the main archival process.
- **Parallel and Sequential Task Management**: Utilizing **`io.kestra.plugin.core.flow.EachParallel`** and **`io.kestra.plugin.core.flow.EachSequential`** to optimize task execution based on dependencies.

## Advanced Data Offloading Techniques

Clever Cloud has adopted Warp10 with HFiles for efficient data compression and management. The HFiles extension is particularly advantageous for generating compact, data-efficient files with encryption capabilities. This approach allows Clever Cloud to compress terabytes of data into just a few gigabytes, addressing the challenge posed by the finite number of values in metrics like CPU usage percentages.

## **In-Depth Workflow Design and Execution at Clever Cloud with Kestra**

Clever Cloud's main workflow, is triggered to manage the vast volumes of data generated. The workflow is structured to handle multiple stages of data processing, ensuring efficiency and robustness from start to finish.

### Workflow Overview

The workflow begins with the data fetching and compression stage. Here, the HFiles extension of Warp10 selects batches of data from the time series database based on predefined criteria like specific time ranges. This data is then compressed on-the-fly, significantly reducing the volume and making it more manageable for subsequent processing.

Once the data is prepared, the workflow transitions into parallel processing. This stage sees multiple instances of the data compression task running concurrently, with each instance handling a different data segment. This parallelization, orchestrated by Kestra's **`io.kestra.plugin.core.flow.EachParallel`**, is reducing the time taken to process large datasets by distributing the workload efficiently across resources.

Throughout the workflow, a error handling mechanism is engaged. Should any data compression task encounter issues, **`io.kestra.plugin.core.flow.EachSequential`** is used to manage retries effectively. This ensures that temporary issues are rectified quickly without manual intervention. For persistent failures, an auxiliary workflow is triggered to alert the operations team via Slack, ensuring that they are informed and can take necessary action.

Following the compression and validation of the data, the workflow proceeds to the data offloading stage. The compressed data is transferred to Clever Cloud’s **Cellar object storage** for long-term preservation. Post-transfer, data originally stored in hot storage is deleted to free up space and maintain system performance.

Lastly, the workflow includes monitoring and logging capabilities. Every operation within the workflow is logged, and performance metrics are monitored. This allows tracking of the workflow’s execution, helping to identify and rectify any deviations or anomalies.

![Clever cloud](/blogs/2024-18-04-clever-cloud-use-case/workflow.png)

## What's Next

If you want to learn more about Clever Cloud’s solution to offload billions of datapoints each month you can check [their blogpost](https://www.clever-cloud.com/blog/engineering/2024/04/04/metrics-offloading-billions-of-datapoints-each-month/)

We are very proud of the usage of Kestra at Clever Cloud, this integration led to significant improvements in handling data volume, maintaining system performance, and optimizing storage use. The success of this project has encouraged further exploration of automating other areas within Clever Cloud's infrastructure with Kestra. From our side we are working on an integration of Kestra into their platform.

Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance.
Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news.
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
