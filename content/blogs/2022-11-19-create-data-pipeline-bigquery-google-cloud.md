---
title: "How to create robust data pipeline for BigQuery and Google Cloud?"
description: Kestra has an entire range of plugins for Google Cloud. More specifically there are plugins for BigQuery used to create the ETL/ELT pipeline to any other services that are readily available in Kestra
date: 2022-11-19T10:00:00
layout: BlogsPost
author:
  name: Ludovic Dehon
  image: "ldehon"
  twitter: "@tchiotludo"
image: /blogs/2022-11-19-create-data-pipeline-bigquery-google-cloud.png
---

The Google Cloud Platform (GCP) is a widely used cloud platform to build an end-to-end solution for data pipeline starting from collecting the data in the Data warehouse to building and hosting scalable applications.

BigQuery is generally used to store and analyse structured Big data in GCP and also as a main tool for the below use-cases in GCP:

*   BigQuery is often used as a **Data Warehouse** with serverless query operations for data analysis.
*   It offers **data transfer services** to transfer the data tables to/from BigQuery to another cloud platform.
*   There are **SDKs** in multiple language-specific and **gcloud CLI** available to interact with BigQuery
*   It has features for ML model **training** and **prediction** on regular intervals using scheduled BigQuery ML queries

Though GCP provides tools like the gcloud CLI and Scheduled Query for simple data processing, these can’t be used to connect multiple data sources and destinations, to create data modelization along with creating the dependency structure, and visualization of each task. For such complex data pipelines, we would need an orchestration tool like Kestra.

### What is Kestra?

[**Kestra**](https://github.com/kestra-io/kestra) is an **open-source** and **cloud-native** tool that can **scale infinitely** and serves as a **low code** data orchestrator and dependency generator to create and schedule the data flow from multiple sources and destinations. It provides an elegant visualization of the entire DAG including all the tasks and plugins used in it. There are multiple [plugins](https://kestra.io/plugins/) available for many cloud platforms like GCP, AWS, and Azure to implement complex pipelines.

For Google Cloud, Kestra has an entire range of plugins for various services like GCS, BigQuery, VertexAI, etc. More specifically there are plugins for BigQuery used to create the ETL/ELT pipeline to any other services that are readily available in Kestra.

We can create a flow to execute these operations using YAML language which would require minimum user inputs like the task name, type, and inputs configuration. This blog also has a simple tutorial that covers the most basic BigQuery operations using Kestra.

### Kestra integrates widely with BigQuery

Kestra cover all the standard operations in BigQuery like creating and deleting the dataset and table, running the query, copying and loading the table, and importing/exporting the table to/from BigQuery to GCS. All these can be done using the BigQuery plugins.

### Data Modelization

The Data Modelization refers to creating a visual representation of data flow between data points and structures. This can be achieved by applying a sequence of transformation or aggregation queries to the raw dataset and using the final data used for visualization, analysis or machine learning. For example, To apply complex aggregation on daily sales report data and use those data points in subsequent phases of transformations for gathering the daily sales trends.

The [**Query**](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.Query.html) plugin for BigQuery in Kestra is commonly used to achieve Data modelization by running the query on the table stored in BigQuery and applying any further transformation or aggregation using the SQL query. To implement data modelization in a data pipeline, the query result needed to be stored in the BigQuery table. Using the [**Query**](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.Query.html) plugin and by providing the `destinationTable` in schema input, the result will be stored and can be used in the next phases.

```yaml
id: query
type: io.kestra.plugin.gcp.bigquery.Query
destinationTable: kestra-dev.ETL_demo.analysis_data
writeDisposition: WRITE_APPEND
sql: |
  SELECT Sex, Age, COUNT(Survived) Survived_users, "{{ execution.id }}" as lineage_cols
  FROM `kestra-dev.ETL_demo.raw_data`
  GROUP BY 1,2
  ORDER BY 3 DESC
```

To generate the daily sales report on a day to day basis, the frequency of flow should be set to one day. To eliminate the manual triggering, Kestra offers scheduling a flow where the cron setting is specified in the YAML or else in the schedule UI. The automated flow will ensure all the data modelization pipeline runs smoothly and generates insights every day.

Here is a sample trigger for scheduling the flow:

```yaml
triggers:
 - id: schedule
   type: io.kestra.core.models.triggers.types.Schedule
   cron: "0 0 * * *"
```

The [Query](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.Query.html) plugin also allows the fetch parameters in order to use the output of a SQL query to be used on the next tasks. A common usage can be to fetch the max date currently on a table and to use it on a later query.

```yaml
tasks:
- id: query
  type: io.kestra.plugin.gcp.bigquery.Query
  fetchOne: true
  sql: |
    SELECT MAX(added_date) AS date
    FROM `kestra-dev.ETL_demo.raw_data`
- id: query
  type: io.kestra.plugin.gcp.bigquery.Query
  fetchOne: true
  destinationTable: kestra-dev.ETL_demo.destination
  writeDisposition: WRITE_APPEND
  sql: |
    SELECT *
    FROM `kestra-dev.ETL_demo.source`
    WHERE added_date > date('{{ outputs.query.row.date }}')
```

### Data Lineage


The Flow (DAG) executions can be analysed using the Execution section of Kestra. This section contains the list of all executions with details on how the flow is triggered (Manually or using the above approach) and an **Execution Id** is also assigned to every run. Each execution contains the various Data Lineage views like Gantt chart, Logs, Topology, and Outputs.

In the **Gantt chart**, we can see relevant information about the time taken for the data processing of each task in the Flow.

<p style="text-align:center">
<img src="2022-11-19-create-data-pipeline-bigquery-google-cloud/1.png" class="rounded img-thumbnail mt-4 mb-4" alt="Data execution in Kestra">
</p>

In **Topology**, a sequence of tasks along with the dependencies present in the Flow can be visualised by the user to debug the tasks.

<p style="text-align:center">
<img src="2022-11-19-create-data-pipeline-bigquery-google-cloud/2.png" class="rounded img-thumbnail mt-4 mb-4" alt="Data lineage in Kestra">
</p>

All the necessary information about the flow can be accessed using the execution id. Resulting in providing Data Lineage on the flow. Also, while creating the Flow `executionId` can be accessible by <code v-pre>{{ execution.id }}</code> variable by which the user can add any execution identifier in the flow to separate out other executions. We can also inject an <code v-pre>{{ execution.id }}</code> variable in the SQL query that allows us to track the execution from where the data came from.

```sql
SELECT Sex, Age, COUNT(Survived) Survived_users, "{{ execution.id }}" as lineage_cols
FROM `kestra-dev.ETL_demo.raw_data`
GROUP BY 1,2
ORDER BY 3 DESC
```

### Interact with Google Cloud Storage

The [**LoadFromGcs**](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.LoadFromGcs.html) plugin is used to import the data from GCS and store it in the BigQuery table directly. This can be especially helpful to analyse and generate insights from the static data files stored in GCS. This plugin can take the input data files for **various file formats** like Avro, JSON, PARQUET, ORC, and CSV.

A sample flow to load the data from GCS and store it in a BigQuery table with specified inputs.

```yaml
- id: load_from_gcs
  type: io.kestra.plugin.gcp.bigquery.LoadFromGcs
  destinationTable: ETL_demo.raw_data
  ignoreUnknownValues: true
  schema:
    fields:
      - name: Survived
        type: STRING
      - name: Sex
        type: STRING
      - name: Age
        type: STRING
  format: CSV
  csvOptions:
    allowJaggedRows: true
    encoding: UTF-8
    fieldDelimiter: ","
  from:
  - gs://sandbox-kestra-dev/sandbox/titanic.csv
```

On the other side, [**ExportToGCS**](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.ExtractToGcs.html) plugin is used to extract the table from BigQuery and store the table as per the specified path to the GCS bucket. This would be useful in the use-cases where a BigQuery table needs to be utilized in other services/platforms as part of the entire solution. Example: We may need to have a backup of the table in GCS to save the storage cost in BigQuery or even create a dataset file to train ML models.

Below is an example of a simple flow to upload the data back to GCS as a specific destination path.

```yaml
id: export_to_gcs
type: io.kestra.plugin.gcp.bigquery.ExtractToGcs
destinationUris:
  - gs://sandbox-kestra-dev/sandbox/{{ inputs.destinationFile }}.csv
sourceTable: kestra-dev.ETL_demo.analysis_data
format: CSV
fieldDelimiter: ;
printHeader: true
```

While executing the Flow in Kestra, the inputs can be provided in UI or Curl. For instance, to execute the flow, below are the inputs required.

```yaml
inputs:
  - name: destinationFile
    type: STRING
    required: true
```

The CURL command (complete [API](https://kestra.io/docs/api-guide/)) can also be used to trigger the flow if you need to automatize the execution from another application. Here is a sample CURL for such a use case.

```bash
curl -v "<http://localhost:8080/api/v1/executions/trigger/io.kestra.gcp/extract-to-gcs>"
    -H "Transfer-Encoding:chunked"
    -H "Content-Type:multipart/form-data"
    -F destinationFile="analysis_data_18"
```

### Storage Write

All these operations can be done if the data is stored in GCP platform services. But what if the data is stored in external servers like Database, NoSQL, Queue or any other plugins providing Kestra’s internal server files. Kestra offers a service to import data from other servers into BigQuery using the [StorageWrite](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.StorageWrite.html) plugin that will use the [Storage Write API](https://cloud.google.com/bigquery/docs/write-api) from BigQuery. Another advantage of using this plugin is to avoid quotas limitation to ingest the data while data streaming in real-time or in batch job writing.

Refer below for an example flow that will stream from a Kafka topic to a BigQuery table using StorageWrite api, really useful to achieve near real time without hitting BigQuery limits.

```yaml
tasks:
  - id: consume
    type: io.kestra.plugin.kafka.Consume
    topic: TRANSACTIONS-LOG-V1
    properties:
      bootstrap.servers: "<CONFLUENT-URI>.gcp.confluent.cloud:9092"
      security.protocol: SASL_SSL
      sasl.mechanism: PLAIN
      sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="<USERNAME>" password="<PASSWORD>";
    serdeProperties:
      schema.registry.url: https://<CONFLUENT-URI>.aws.confluent.cloud
      basic.auth.credentials.source: USER_INFO
      basic.auth.user.info: <USERNAME:PASSWORD>
    keyDeserializer: STRING
    valueDeserializer: AVRO
  - id: "storage_write"
    type: "io.kestra.plugin.gcp.bigquery.StorageWrite"
    bufferSize: 100
    from: "{{ outputs.transform.uri }}"
    destinationTable: "kestra-dev.ETL_demo.transactions_logs"
```

### React to event

Using the above scheduling features in data modelization, we can trigger the flow in a predefined time. Kestra has a lot of advanced features like triggering the flow when a file is uploaded in GCS or in a BigQuery table. There would be a scenario where the data pipeline needs to be started whenever a new table is ingested in BigQuery or archive the file in a different folder of GCS when any file is uploaded.

Kestra has two trigger plugins for both BigQuery and GCS:

*   BigQuery Trigger
*   GCS Trigger

The BigQuery [**Trigger**](https://kestra.io/plugins/plugin-gcp/triggers/bigquery/io.kestra.plugin.gcp.bigquery.Trigger.html) will check for the data arriving in the BigQuery table based on a Query and will invoke a flow with loop ([EachSequential](https://kestra.io/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachSequential.html) task) for each row. The below YAML can be used to create such a Flow in Kestra.

```yaml
id: Trigger_flow
namespace: com.kestra.sandbox
revision: 1
tasks:
  - id: each
    type: io.kestra.core.tasks.flows.EachSequential
    tasks:
      - id: return
        type: io.kestra.core.tasks.debugs.Return
        format: "{{taskrun.value}}"
    value: "{{ trigger.rows }}"
triggers:
  - id: watch
    type: io.kestra.plugin.gcp.bigquery.Trigger
    interval: PT30S
    sql: SELECT * FROM `kestra-dev.ETL_demo.raw_data`
```

We can also create a Flow that will trigger when a new file is uploaded to a specified folder of GCS and as an action, it will move the file to the archive folder.

```yaml
id: gcs-listen
namespace: io.kestra.sandbox
tasks:
  - id: each
    type: io.kestra.core.tasks.flows.EachSequential
    tasks:
      - id: return
        type: io.kestra.core.tasks.debugs.Return
        format: "{{taskrun.value}}"
    value: "{{ trigger.blobs | jq '[].uri' }}"
triggers:
  - id: watch
    type: io.kestra.plugin.gcp.gcs.Trigger
    interval: "PT5M"
    from: gs://my-bucket/kestra/listen/
    action: MOVE
    moveDirectory: gs://my-bucket/kestra/archive/
```

Here the **interval** in both flows means a time gap between subsequent calls to check for the data in order to avoid reaching Google Cloud limits.

### Complete ETL pipeline

For the use cases where multiple tasks need to be run in parallel and we would need to create an internal dependency between those tasks. For this, we can use the Kestra features and plugins to maintain the pipeline orchestration, data modelization and data lineage.

For instance, we want to build a pipeline where we want to find out daily available stock based on the previous day’s sales and stock data. We can create the pipeline using the above basic Kestra operations and plugin features and this pipeline could consist of the following tasks:

1.  [Setup a trigger](https://kestra.io/plugins/plugin-gcp/triggers/gcs/io.kestra.plugin.gcp.gcs.Trigger.html) which will invoke the pipeline when daily sales and stock data are dumped in the GCS bucket.
2.  [Creating a dataset](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.CreateDataset.html) in BigQuery specifically to store all the intermediate tables.
3.  [Loading the data from the Google Cloud Storage](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.LoadFromGcs.html) and storing it in the destination tables.
4.  Run [parallel](https://kestra.io/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Parallel.html) tasks to aggregate the product level stock and sales data and store both tables in BigQuery.
5.  Run a [query](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.Query.html) to calculate the remaining stock at the product level by subtracting from stock to sales only after storing the above tables.
6.  [Export in Google Cloud Storage](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.ExtractToGcs.html) the updated stock data.
7.  [Clean up all the intermediate tables](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.DeleteTable.html) and [datasets in BigQuery](https://kestra.io/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.DeleteDataset.html).

To trigger the flow, we can set the [**GCS**](https://kestra.io/plugins/plugin-gcp/triggers/gcs/io.kestra.plugin.gcp.gcs.Trigger.html) **Trigger** plugin where we can provide the condition to trigger the flow only if the file should be present in the listening folder of the GCS bucket.

For creating a sequential execution of tasks that has the dependency on the previous task, we need to provide all the sub-tasks in the parent task of the [**Sequential**](https://kestra.io/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Sequential.html) type. This sequential flow will be used to calculate the remaining stock at the product level using a Query plugin.

While to run the tasks in parallel where the output of the task is not dependent, we need to specify all these tasks in type as [**Parallel**](https://kestra.io/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Parallel.html). In the above example, aggregating sales and stock data at the product level are two independent tasks which can be run in parallel using this plugin type.

Here we can also provide the output of one task to the input to another task using the <code v-pre>{{outputs.task_id.output_parameter}}</code>`.

### Conclusion

We saw that [Kestra](https://www.kestra.io/) offers a variety of plugins **for creating a complete ETL/ELT pipeline using the GCP BigQuery** service along with features for monitoring the pipeline executions. It can be also used to schedule the Flow, provide easy debugging, and maintain the external dependencies. This blog post tries to showcase a few uses-case of how Kestra can be used along with the sample snippets for using the Kestra hands-on for you to start exploring the [Kestra](https://github.com/kestra-io/kestra) as it can cover endless use-cases.

