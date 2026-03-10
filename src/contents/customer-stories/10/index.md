---
title: Reglo, Automating ETL process with a Simple Slack Command
description: This is the story of Reglo, a company that struggled with juggling
  multiple platforms to refresh and process data. During their search for an
  effective solution, they discovered Kestra
metaTitle: Reglo, Automating ETL process with a Simple Slack Command
metaDescription: This is the story of Reglo, a company that struggled with
  juggling multiple platforms to refresh and process data. During their search
  for an effective solution, they discovered Kestra
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
tasks:
  - io.kestra.plugin.airbyte.cloud.jobs.Sync
  - io.kestra.plugin.singer.taps.Shopify
  - io.kestra.plugin.googleworkspace.sheets.Read
  - io.kestra.plugin.gcp.bigquery.Load
  - io.kestra.plugin.dbt.cloud.TriggerRun
kpi1: |-
  ##### Automated
  ETL Process
kpi2: |-
  ##### 1 day
  of manual effort saved each month
kpi3: |-
  ##### Centralized
  Control Plane
quote: " Initially, we had to manually refresh data across three tools. Now, a
  single Slack command triggers a Kestra flow that automates Airbyte and dbt."
quotePerson: Engineer at Reglo
quotePersonTitle: ""
industry: Retail
headquarter: Paris, France
solution: High Quality Pets Nutrition
companyName: ""
---

## About Reglo

Reglo is a committed French brand specializing in hypoallergenic, grain-free natural kibble with insect proteins for dogs and cats. As an e-commerce company, they initially faced challenges with their data management, juggling multiple platforms to refresh and process data. It was during their search for a solution to these challenges that they discovered Kestra.

## The Journey to Kestra

Reglo's data management process was fragmented. Their team had to navigate multiple platforms, including Google Spreadsheets, Airbyte, and dbt, to refresh and process their data. This not only consumed a significant amount of time but also introduced errors and inconsistencies in their data workflows. Recognizing the need for a more streamlined and effective solution, Reglo turned to Kestra.

Kestra offered a unified control plane and simplified orchestration, integrating with Reglo’s existing technology stack. This integration allowed Reglo to consolidate their data workflows into a single, manageable platform.

## Modernizing Data Management

With Kestra, Reglo developed a custom Slack command that, when triggered, initiates a Kestra Flow automating Airbyte data ingestion and dbt transformations. This automation reduced the time and effort required to manage their data, improving both efficiency and accuracy.

>"Initially, I just had Airbyte and dbt jobs at regular intervals, but that posed a problem especially when someone from the team was updating data in a GSheet and had to go to 3 tools to refresh the data. Now, a Slack command triggers a Kestra flow that triggers Airbyte and then dbt."

## Unified Control Plane

Kestra enabled Reglo to unify their control plane, bringing all data workflow management into a single dashboard. This allowed team members to modify flows and monitor executions without switching between different platforms. By orchestrating Airbyte and dbt tasks within Kestra, Reglo eliminated the fragmented nature of their previous system, enabling a smoother data pipeline.

## Overcoming Legacy System Challenges
Before adopting Kestra, Reglo's reliance on multiple platforms led to several challenges:

- Time-Consuming Manual Processes: The need to manually refresh and process data across various platforms was inefficient.
- Error-Prone Data Handling: Fragmented workflows increased the likelihood of errors and inconsistencies.
- Lack of Unified Monitoring: The absence of a centralized system made it difficult to monitor and manage data workflows effectively.

## The Kestra Transformation

Kestra addressed these issues by providing a scalable and reliable solution that allowed Reglo to streamline their data workflows. Kestra’s platform facilitated best practices, such as code versioning and the uncoupling of orchestration from business logic, essential for their successful data management transformation.

## Streamlined Development and Deployment
By integrating Kestra into their technology stack, Reglo adopted a more efficient workflow for managing custom scripts and data pipelines. This integration allowed them to push flows from Kestra to their data warehouse, facilitating easy adjustments and deployment.

## Rapid Onboarding
In a short span, Reglo successfully onboarded their team onto Kestra, deploying instances on their existing infrastructure. This rapid setup enabled them to quickly build and manage workflows, utilizing tasks for accessing files, querying databases, and transforming data. By automating critical processes and providing robust orchestration capabilities, Kestra has enabled Reglo to maintain high standards in data management.
