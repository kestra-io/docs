---
title: "Databricks & Kestra Joining Force in a Technological Partnership"
description: "Discover how Kestra and Databricks unite to transform data workflows, dive into our integrated approach to managing complex data processes"
date: 2024-03-14T08:00:00
category: Company News
author:
  name: Emmanuel Darras
  image: "edarras"
image: /blogs/2024-03-14-dremio-partnership.jpg
---

**Today, we’re thrilled to announce a strategic partnership between [Kestra](https://github.com/kestra-io/kestra) and [Dremio](https://www.dremio.com/) to simplify data workflows and accelerate time-to-delivery for data teams! This collaboration will empower data professionals to leverage the combined strengths of Kestra's declarative workflow engine and Dremio's Data lakehouse capabilities.**

## About Dremio

Dremio is a data lakehouse platform that simplifies big data analytics. It allows you to directly access data from various sources, such as Postgres, S3 and Azure Data Lake Storage, without needing to copy or move the data. Its key features include a fast query engine, a semantic layer to help manage and share data, a catalog for Iceberg tables, and reflections — a market-leading query acceleration technology that delivers sub-second query response times. Designed to work with SQL and common BI tools, Dremio provides self-service analytics and data management for BI workloads with the best price performance and lowest cost.

## Kestra's Integration with Dremio

Integrating Dremio with Kestra offers a powerful solution for analytical workflows and scenarios involving complex data transformations and business-critical operations.

Kestra provides a declarative workflow engine that orchestrates Dremio's data access and management capabilities. This allows data professionals to build complex workflows without intricate coding, while easily querying data directly from various sources through Dremio's lakehouse architecture. 

Together, we reduce unnecessary coding overhead and eliminate the need for complex ETL pipelines. The intuitive interfaces focus on the user experience, and rich plugin ecosystems of both tools further amplify their synergy, accelerating development cycles and empowering data professionals to deliver insights faster and with greater ease.

![plugin](/blogs/2024-03-14-dremio-partnership/schema.png)

### Practical Applications of the Kestra-Dremio Integration

In addition to our partnership, we've recently launched the Dremio and Arrow Flight SQL plugins, demonstrating our commitment to streamline data lakehouse workflows. These innovations allow for seamless integration of Dremio with Kestra, empowering users to automate complex data processes including:

- Trigger when there is an anomaly in the Dremio database, or when certain KPIs fall outside of an expected range.
- Run SQL queries against Dremio databases to fetch data for downstream processing in Python, R, or other languages supported by Kestra.
- Query data from Dremio and process it in Polars with a Python script


## What's Next

Kestra and Dremio can help data practitioners to be more productive and efficient by simplifying data access, automating data workflows, and improving data quality.

If you want to go further with Kestra and Dremio capabilities you can read this article about [Data lakehouse orchestration with Kestra, Dremio, dbt and Python.](https://kestra.io/blogs/2023-12-07-dremio-kestra-integration)

You can also kickstart you Airbyte & Dremio Journey with our [Community Blueprints](https://kestra.io/blueprints?page=1&size=24&q=dremio)


If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
