---
title: "Kestra & Snowflake Partnership: How our users orchestate their Data Warehouse"
description: "Following our partnership announcement with Snowflake, an increasing number of Kestra users are effectively orchestrating their Snowflake environments"
date: 2024-03-21T08:00:00
category: Company News
author:
  name: Emmanuel Darras
  image: "edarras"
image: /blogs/2024-03-21-orchestrate-snowflake-with-kestra.jpg
---

Following the announcement of our [partnership with Snowflake](https://kestra.io/blogs/2023-09-25-kestra-snowflake-partnership), we've witnessed a surge in the usage of our plugin. An increasing number of companies are now leveraging Kestra to orchestrate their Snowflake data lakehouses, transforming how they manage their data at scale. This collaboration has significantly improved how data is managed at scale, offering Kestra users advanced capabilities for orchestration within Snowflake's ecosystem.

### Inside Snowflake's Cloud-Native Capabilities

Snowflake provides a unified cloud platform that eliminates data silos, facilitating secure collaboration and sharing across data pipelines. Its architecture features robust cloud storage, a sophisticated query processing engine, and a comprehensive suite of cloud services, all designed to work seamlessly with a wide range of third-party integrations. Additionally, Snowflake's multi-cloud, multi-cluster warehouse capabilities include dynamic auto-scaling to efficiently manage virtual warehouses, optimizing both resource usage and costs.

## How our Users are Leveraging the Snowflake Plugin

The Kestra Snowflake plugin is specifically designed to serve both as a direct target and as a data repository within larger workflows, addressing the needs of downstream applications.

### Querying Snowflake Tables

With the Kestra Snowflake plugin, our users gain the ability to execute various operations on Snowflake servers, including data insertions, updates, and deletions. This is facilitated through features like auto-commitment of SQL statements, diverse fetching operations, role specification for access control, and result storage. The plugin's capacity to handle multi-SQL statements within a single transaction streamlines complex queries, making the output readily usable in subsequent tasks across different tools.

Here's a sample task for fetching table data into Kestra's internal storage that's commonly used:

```yaml
id: select
type: io.kestra.plugin.jdbc.snowflake.Query
url: jdbc:snowflake://<account_identifier>.snowflakecomputing.com
username: snowflake
password: snowflake_passwd
sql: select * from source
fetch: true

```

### Simplifying Data Movement

- **Downloading from Snowflake**: The plugin makes it easier to transfer data from Snowflake to an internal Kestra stage, incorporating advanced features for data compression and role-based access control to enhance the downloading process.
    
    Here is the snippet for downloading data:
    
    ```yaml
    id: "download"
    type: "io.kestra.plugin.jdbc.snowflake.Download"
    stageName: MYSTAGE
    fileName: prefix/destFile.csv
    
    ```
    
- **Uploading to Snowflake**: Similar to downloading, this functionality simplifies uploading data to Snowflake stages, with options for data compression and transformation that streamline the ETL process.
    
    Here is the snippet for uploading data:
    
    ```yaml
    yamlCopy code
    id: "upload"
    type: "io.kestra.plugin.jdbc.snowflake.Upload"
    stageName: MYSTAGE
    prefix: testUploadStream
    fileName: destFile.csv
    
    ```
    

### Implementing Git Workflow for dbt with Snowflake

The plugin also facilitates the orchestration of Git workflows for dbt projects targeting Snowflake, enhancing data transformation and management processes. This integration allows for the automation of dbt workflows, utilizing Git for version control and collaborative project management directly within the Snowflake environment.

Here's how you can implement a Git workflow for dbt with Snowflake:

```yaml
yamlCopy code
id: dbt_snowflake
namespace: blueprint

tasks:
  - id: git
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/dbt-example
        branch: main

      - id: dbt
        type: io.kestra.plugin.dbt.cli.DbtCLI
        docker:
          image: ghcr.io/kestra-io/dbt-snowflake:latest
        profiles: |
          my_dbt_project:
            outputs:
              dev:
                type: snowflake
                account: "{{ secret('SNOWFLAKE_ACCOUNT') }}"
                user: "{{ secret('SNOWFLAKE_USER') }}"
                password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
                role: "{{ secret('SNOWFLAKE_ROLE') }}"
                database: "{{ secret('SNOWFLAKE_DATABASE') }}"
                warehouse: COMPUTE_WH
                schema: public
                threads: 4
                query_tag: dbt
                client_session_keep_alive: False
                connect_timeout: 10
            target: dev
        commands:
          - dbt deps
          - dbt build

```


## More to Come

The synergy between Kestra and Snowflake through this plugin has opened new avenues for efficient data orchestration and management. This partnership not only simplifies complex data processes but also empowers users to leverage their data assets more effectively.

As we continue to enhance this integration, Kestra users can expect even more features designed to maximize the value of their data within Snowflake's platform.

Join the Slack [community](https://kestra.io/slack) if you have any questions or need assistance.
Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news.
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
