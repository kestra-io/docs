---
title: Displayce Optimized Workflow Orchestration and Enhanced Data Management
description: Faced with the challenge of expanding their data operations and
  lacking a unified system for monitoring and orchestration, Displayce sought a
  robust solution to streamline their processes, leading them to Kestra.
metaTitle: Displayce Optimized Workflow Orchestration and Enhanced Data Management
metaDescription: Faced with the challenge of expanding their data operations and
  lacking a unified system for monitoring and orchestration, Displayce sought a
  robust solution to streamline their processes, leading them to Kestra.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.dbt.cloud.TriggerRun
  - io.kestra.plugin.aws.s3.CreateBucket
  - io.kestra.plugin.aws.athena.Query
  - io.kestra.plugin.jdbc.clickhouse.Trigger
  - io.kestra.plugin.jdbc.postgresql.Trigger
kpi1: |-
  ##### 40%
  Reduction of processing time
kpi2: |+
  ##### 50%
  Increase in workflow efficiency


kpi3: |-
  ##### 30%
  improvement in data quality and accuracy
quote: Kestra has enabled us to achieve scalability and establish a centralized
  platform for nuanced monitoring and orchestration
quotePerson: Engineer at Displayce
quotePersonTitle: ""
industry: Advertising
headquarter: Bordeaux, France
solution: Displayce optimises the purchase, impact and quality of digital
  out-of-home campaigns on over 1 million digital screens worldwide.
companyName: ""
---

## About Displayce

Displayce, a subsidiary of JCDecaux, serves as a pivotal intermediary between JCDecaux, agencies, and advertisers. Specializing in advising clients on optimal assets and marketing campaigns, Displayce is crucial in the advertising ecosystem. As Displayce’s operations expanded, they encountered significant hurdles with their data management systems, which were initially reliant on CLI-based tools for data ingestion. The absence of a centralized orchestration and monitoring system further complicated their processes, prompting a search for a more robust and scalable solution. This journey led them to Kestra.

## The Journey to Kestra

The rapid growth of Displayce’s operations exposed the limitations of their existing tools. Displayce needed a solution that could handle their complex data workflows and provide centralized orchestration and monitoring capabilities. After evaluating various options, they selected Kestra for its comprehensive plugin ecosystem and seamless integration capabilities. Kestra's ability to integrate effortlessly with Displayce’s existing tools, including dbt and Clickhouse, made it the ideal choice for transforming their data operations.

## About their Stack

Displayce employs a multifaceted technology stack, each component serving a distinct purpose, yet all integrated to function as a cohesive unit. They utilize AWS S3 as the primary data lake for storing raw and processed data, while AWS Athena handles ad-hoc querying and analysis, pulling insights directly from their S3 data lake. For analytics, Clickhouse serves as their columnar database, optimized for running complex queries quickly and efficiently. PostgreSQL manages transactional data and relational data structures, supporting application-level requirements. dbt is employed as their transformation engine to clean, enrich, and prepare data for analytics, feeding into Clickhouse. Kestra ensures seamless data flow between these components, managing workflow dependencies, error handling, and scheduling to provide the robust backbone needed for their operations.

## Overcoming Growth-related Challenges

Displayce’s reliance on CLI-based tools for data ingestion was unsustainable as their data volume grew. The complexity of migrating from DigDag and Nomad systems added to their challenges. Kestra addressed these issues by offering a centralized platform that simplified data flows and enabled efficient data transformation pipelines.

## Why Kestra Became the Chosen Solution

Kestra was chosen for its robust capabilities and integration potential. Its comprehensive plugin ecosystem allowed Displayce to integrate their existing tools effortlessly. This enabled Displayce to create a reliable data transformation pipeline with dbt, ensuring data was primed for analytics in Clickhouse. Kestra's intuitive interface and YAML-based configuration made it easy for Displayce to manage and scale their workflows.

## The Impact of Integrating Kestra

With Kestra, Displayce achieved scalability and established a centralized platform for nuanced monitoring and orchestration. This facilitated a smooth transition from legacy systems, enhancing operational efficiency and elevating the quality of service provided to their clients.

>"Kestra's comprehensive plugin ecosystem allowed us to effortlessly integrate our existing tools, simplifying data flows significantly." 



## Moving Forward with Optimized Data Management

Kestra's integration into Displayce's technological framework has fundamentally transformed their approach to data management. By centralizing workflow orchestration and simplifying data flows, Displayce has achieved significant improvements for their internal processes and also enhanced their capability to deliver high-quality, scalable data pipelines.

>"Kestra’s integration has streamlined our internal processes and amplified our capability to deliver scalable data pipelines."


As Displayce continues to grow and adapt to the needs of the advertising industry, Kestra will play a crucial role in maintaining and optimizing their data operations. The successful implementation of Kestra has set a solid foundation for future innovations and improvements, ensuring Displayce remains at the forefront of advising clients on optimal assets and marketing campaigns.


