---
title: "How Leroy Merlin handle all this cloud data pipeline with Kestra"
description: Discover how Leroy Merlin move all their data pipeline to the Google Cloud with Kestra
date: 2022-01-10
layout: BlogsPost
author:
  name: Ludovic Dehon
  image: "ldehon"
  twitter: "@tchiotludo"
---

[Adeo](https://www.adeo.com) is the leading French player in the international DIY market and No. 3 worldwide, Adeo is going from strength to strength.
[Leroy Merlin](https://www.leroymerlin.fr/) is the leading biggest brand of Adeo Group, that  help inhabitants around the world with all their home improvement projects, from renovations and extensions to decoration and repairs. With more than 450 stores in the world and 140 in France, Leroy Merlin France have a strong data values and need to deliver KPI to their 80 000+ employees to drive their expansion.

In this article, we will browse the past, present and futur of their dataplatform with thousands of datasource, KPIS, dashboard, ...


## Before the cloud, the on premise choice
Leroy Merlin, historically use the following stack in order to handle all their data pipeline :
- Teradata for the data warehouse
- VectorWise as database for api
- Stambia as ELT
- Dollar U & Automic Workload Automation as orchestrator and scheduler.
- Custom development for transfer of the data

Since this one as done the job for many years, nowadays, the choice seems to be outdated. They have seen this gap during the last year that seems to be larger with the cloud adoption:
- Vectorwise & Teradata is not serverless and need to be scaled manually
- Stambia don't have a lot native connectors for the cloud, and it's design, only runtime execution that must be launch by an orchestrator, can be completed as we need another tools to trigger the job
- Dollar U & AWA is lead by Adeo (the group), people need to go to internal ticket service in order to have an orchestration job, wait for other people to handle it, this can take few days or more to have the things done. Moreover, the monitoring of a pipeline is divided with different tools that don't talk to each other making the oversea really complicated.

Some issues are due to organization separation between the Business Unit & the group (Adeo), but most of them are due to cloud: All of these tools are not ready for the cloud.


## Going to the cloud
In 2019, Leroy Merlin and Adeo decided to move all on premise server to cloud as the data stack to the cloud. They need a solution in order to handle all the previous use case and find a new way to handle all with an ambitious objective, being full cloud in 2022!

They decided to create a new team, with a goal, took an empty page and built a full solution for this migration. They needed to define each component of the future data platform (from storage, pipeline, source code, ...), built this platform and taught how to use it for all data engineer (approximately 50 peoples).

Adeo & Leroy Merlin have a strong partnership so the storage will be Google BigQuery. Really soon, Leroy Merlin have decided to go to the DataOps lifecycle, no go live must be a manual task and a pain. Second decision: every thing need to be hosted on GitHub and have a strong CI/CD in order to go to production. Terraform will be the evident choice here also due to large ecosystem and native integration with BigQuery and others GCP resource.

Now, they need to find how to transfer the data, load it in BigQuery, transform & aggregate the data. For the transport layer & load, no evident choice are visible, so they decided to build a custom solution (based on GCP service) and for the orchestration, a lot of people is using Airflow, so why not try and even more there is a managed service on GCP: Cloud composer.

## On the cloud, after few months
Leroy Merlin decided to start every new project on the cloud directly before starting a migration on exiting project. The first projects are coming, the build is done, some projects are on production, now they can start make some conclusion on past work

### Transfer of data
The custom home tools have proven some major assumption :
- The transfer layer must be over https, every system can send a https request in order to send the data, even the legacy one with old systems.
- The data must be validated, we can't let irrelevant data on the data warehouse. The format is an avro schema that will validate before loading in order to parse primitive data type, and some additional check can be done optionally.

**One major fail:** The custom tools was made in Python and need to installed on the system that will send the data. Since python have a complicated lifecycle, they reach system that just can't install python 3 leading one only choice: develop multiple version of the tools to target all systems, that would just be unmaintainable.


### Orchestration
The choice of Airflow seems to be a good choice, the ability to handle a lot of complex workflow with simple python code. So the custom transfer tools will trigger Airflow dag after the load on BigQuery. Airflow will handle all the other case: transform / aggregate / reverse ETL and so on.

But **it failed at Leroy Merlin**. First, the implementation by Google : Google Cloud Composer seen a lot of limitation and was rejected quickly. So Leroy Merlin decide to install their own Airflow on Kubernetes Clusters. That seems to be better at first, more control, more stability. Moreover, we still have a lot of issues :

- After a simple benchmark of thousand of task with only sleep 1, we seen failed tasks. Sleep 1 tasks should never have failed and let us a lack of confidence on the product, how to monitor our dags if we have failed tasks only due to orchestrator.
- The workflow as python code was clearly not a good choice, one dag produce by team member introduce some code out code evaluated by airflow worker, this led to code executed every x sec by every airflow component and slow down the cluster: we see with that example that we can't let users build dag by themselves without strong code review since 1 dag can crash the whole cluster.
- The CPU usage of an airflow cluster was really high, even if the task done are only called API (BigQuery API in our case). Only waiting task eat CPU, how to handle CPU intensive tasks will be handled?
- The airflow API at this time was experimental, and we need to trigger flow externally. This API has no control on passed parameter.
- Sensors are mechanism on Airflow in order to wait for something (wait for a file, wait for a dag, ...) Every sensor will eat 1 worker slot, and we plan to have a lots, so we need to add even more worker to handle the load.
- Airflow don't allow us to pass large data between tasks, XCOM are here, but only for small amount of data. This is a major bad design, that led to have to multiply for one source the destinations (ex: `BigQueryToGCSOperator`, `BigQueryToMySqlOperator`, `BigQueryToBigQueryOperator`, ...). It will not scale to develop some many operators.
- RBAC on Airflow is very limited and only allow to have user that own a dag and no notion of groups. In a team, we need to have multiple people on the same resources.
- ...

Even if we really try to use it, the performance was not here, Airflow failed quickly on the first project: The **duration of the flow is 20 times longer** than the same flow with Stambia and the analysis are showing that this duration will increase over the times and will not scale to due to number of dags and number of executions wanted.



::: warning Decision
At this time the conclusion was acted: terraform & BigQuery was confirmed as they show their capability, Airflow & custom transfer & load tools was rejected.
Leroy Merlin need to find another way to handle this, and have no solution at this moment.
:::

## Kestra at the rescue
In a meantime, Ludovic has started working on Kestra and decided to show his work to Leroy Merlin, which shown a lot of interest and decided to test the solution for few month. Since some features are missing at this time, they also decided to contribute on the open source project and some plugins.

### Custom plugin to simplify the adoption

They also develop quickly a Kestra plugins in order to simplify the ingestion process called `DataPlatformIngest`, removing all the burden in loading data, the plugins do :
- cold archive the incoming data to Google Cloud Storage Bucket
- validate the data technically with an Avro schema: they don't want bad incoming data and be sure at least the data is typed (integer, date, ...)
- versioning the data (if the schema is breaking change)
- append technical column (loaded data, execution id) in order to have a full lineage on the data warehouse
- load the data in a temporary table
- apply some quality with rejection on records based on business rules (upper/lower bound, validate key with referential, deduplication, ...)
- load the data in ODS (Operational Data Store) that is the image of the data from incoming system

The transfer of the data is in https directly to Kestra Api in order to free any dependencies, the operational system used most often a simple `curl` [command](https://kestra.io/docs/developer-guide/inputs/#send-inputs-programmatically) in order to trigger ingestion or develop a simple http client reaching Kestra api.

This single task that handle all the complexity for loading data, this one will create 10 to 20 tasks :
```yaml
id: lock
namespace: fr.leroymerlin.services.product.orchestrator

inputs:
  - type: FILE
    name: shedlock
tasks:
  - id: 01_ingest_ods_shedlock
    type: com.leroymerlin.dataplatform.dcp.tasks.DataPlatformIngest
    avroOptions:
      dateFormat: yyyy-MM-dd
      datetimeFormat: yyyy-MM-dd' 'HH:mm:ss
      nullValues:
        - \N
        - "1900-01-00 00:00:00"
      schema: |-
        {
            "type": "record",
            "name": "shedlock",
            "namespace": "org.kestra",
            "fields": [
                { "name": "name", "type": "string" },
                { "name": "lock_until", "type": [ "null", { "type": "long", "logicalType": "timestamp-millis"} ] },
                { "name": "locked_at", "type": [ "null", { "type": "long", "logicalType": "timestamp-millis"} ] },
                { "name": "locked_by", "type": [ "null", "string" ] }
            ]
        }
    csvOptions:
      fieldSeparator: "|"
    dataset: instala
    fileType: CSV
    from: "{{ inputs.shedlock }}"
    table: shedlock
    version: 1
```

### Adoption by the team
At Leroy Merlin, there is 80+ data engineers, data scientist. They will need to learn how to use Kestra, but since it was based on simple declarative language (based on yaml), this was quick and people used it in few hours.

Also, since there is a rich ui, the deployment process was really easy at the beginning, just save on the ui, it's ready.

After, since Leroy Merlin is using terraform in order to deploy every cloud resource, they also deploy Kestra resources using [terraform providers](/docs/terraform/). They reach a full dataops lifecycle, all deployment is atomic with a git push & a strong CI/CD applying resource from terraform.

::: success Reach a fast time to market
Before this dataops lifecycle, all deployment involve many team: transfer team that moving the file between systems, orchestration team that will trigger the job after the transfer, data team that will develop the load of data, plus a manual operation in order to create resource on the data wharehouse. All these operations need to synchronize with internal ticket on service now.

Thanks to Kestra, they move **a full autonomy** and **reduce the time to market** from **few days to few hours**
:::

### Go production
After few month, **Kestra was confirmed** and was deployed to production environnement on May 2020. They also decided to move to Enterprise Edition of Kestra in August 2020 since they need to have fined grained security, role based access control and single sign on.

The usage grow exponentially over the month and the kind of usage is more and more various : start flow based on [file detection from buckets](/plugins/plugin-gcp/triggers/gcs/io.kestra.plugin.gcp.gcs.Trigger), sync data warehouse directly from operation [postgres database](/plugins/plugin-jdbc-postgres/tasks/l/io.kestra.plugin.jdbc.postgresql.CopyOut), develop simple python program to [fetch api from a partner](/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Python), start long-running data science process [over Kubernetes](/plugins/plugin-kubernetes/tasks/io.kestra.plugin.kubernetes.PodCreate), [fetch data from Google Drive](/plugins/plugin-googleworkspace/tasks/sheets/io.kestra.plugin.googleworkspace.sheets.Read) and write result back to [Google Sheets](/plugins/plugin-googleworkspace/tasks/drive/io.kestra.plugin.googleworkspace.drive.Create.html), ...

Here is some numbers that show the current usage at January 2022 only for production environment:
- **4 clusters** for every environment
- **200+ users / developers** using it
- **2000+ flows** in production
- **350,000 executions** every month
- **3,000,000 tasks** every month
- **1,500 days of executions** every month (yeah, 50 days of executions every single day)

<img src="./2022-01-10-leroy-merlin-usage-kestra/executions.svg" class="rounded img-thumbnail float-left mr-4 mb-4" alt="Initial commit" style="max-width: 370px">
<img src="./2022-01-10-leroy-merlin-usage-kestra/taskruns.svg" class="rounded img-thumbnail float-left mr-4 mb-4" alt="Initial commit" style="max-width: 370px">
<img src="./2022-01-10-leroy-merlin-usage-kestra/execution-duration.svg" class="rounded img-thumbnail float-left mr-4 mb-4" alt="Initial commit" style="max-width: 370px">

<div class="clearfix" />

### Some testimonials
Leroy Merlin have supported the development of Kestra, so as every software, it's young age can be frustrated for users. They need to handle some missing features, report some bugs, suffer some time from instability. But what was astounding, the **pain is less than the gain**, and we have a lots of good report on Software internal notation tool, it's a solution that users really love and upfold. Here is some testimonials:

> Tool responds perfectly to the need, very easy to use, it manages all the complexity behind to offer a saving of time and enormous cost.

> Kestra is a very easy to use tool with constant improvement in functionality.
> It covers almost all data pipeline setup needs.

> Kestra is very easy to learn, with a large number of functionalities covering a large number of use cases (scheduled workflows, API calls, triggers, flow synchronization, data and file transfers, etc.).
> The Web interface facilitates the monitoring of flows and the consultation of logs.
> New features are added very regularly, often in response to needs. Kestra is evolving rapidly.

> After suffering with Airflow to schedule different treatments, Kestra's arrival was more than saving.
> The ecosystem of plugins is evolving rapidly and greatly facilitates integration with different bricks, especially on GCP (BQ, GCS, Cloud SQL, etc.)
> A tool that deserves to be known more.

## Conclusion

Leroy Merlin help a lot Kestra to grow by supporting his early age, but we really think it was a win-win partnership. Kestra is a tool that allow Leroy Merlin to successes in his cloud migration and to embrace Data Ops development design.

From Leroy Merlin manager, the true revolution is :
> Kestra is the first tool that allow us to develop without installation, used your browser and start build a true business use case in few hours. Since the learning curve is easy, you can easily onboard new teammate due to its descriptive language. And moreover, it handles all the part of the data pipeline, the transport, load, transform, data modelization, data quality and monitoring of all our data pipeline. Since the tool offer strong role based access & security on the Entreprise Edition, we are safe to share ir in Software as Service to all applications allowing also to embrace the Data Mesh pattern.
