---
title: Bouygues Immobilier Platform, Orchestrate its Marketing Data with Kestra
description: " This is the story of Valorissimo's partnership with Hanalytics to
  modernize their data infrastructure with Kestra, enhancing their marketing and
  sales efficiency in the real estate investment sector."
metaTitle: Bouygues Immobilier Platform, Orchestrate its Marketing Data with Kestra
metaDescription: This is the story of Valorissimo's partnership with Hanalytics
  to modernize their data infrastructure with Kestra, enhancing their marketing
  and sales efficiency in the real estate investment sector.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.gcp.bigquery.Load
  - io.kestra.plugin.hightouch.Sync
  - io.kestra.plugin.notifications.slack.SlackIncomingWebhook
  - io.kestra.plugin.aws.cli.AwsCLI
  - io.kestra.plugin.dbt.cli.Build
kpi1: |-
  ##### Plug&Play
  Integrations 
kpi2: |-
  ##### 2x
  Increased Conversion Rates
kpi3: |-
  ##### Automated
  Marketing Campaigns
quote: When we discovered Kestra, it was instant love at first sight! It's the
  perfect solution to streamline all our projects, and it's now become our go-to
  orchestration platform
quotePerson: Hamis Badarou
quotePersonTitle: ""
industry: Investment and Banking
headquarter: Paris, France
solution: "Solution for real-esrate investment "
companyName: ""
---

## About Valorissimo

Bouygues Immobilier’s platform, Valorissimo, stands as a historic entity in the real estate sector, with over two decades of expertise. Their innovative methodology assists real estate professionals in selling their programs by leveraging a comprehensive understanding of the market. Valorissimo’s digital platform is tailored to meet the specific needs of sales processes in real estate investment, facilitating connections between developers and investors.

## Introduction

To enhance marketing agility and sales efficiency, Valorissimo partnered with Hanalytics to develop a modern data stack. This collaboration not only personalized their marketing automation campaigns but also significantly boosted their conversion rates. The implementation of this modern data stack, built with specialized tools, marks a substantial evolution in their operational capabilities, ensuring Valorissimo remains a leader in the real estate investment sector.

## Understanding Valorissimo’s Data Ecosystem

Valorissimo's data strategy is a multi-faceted approach that leverages several key technologies to ensure efficient and effective data management. At the core of their system is Airbyte, which captures essential data from Azure and Google Analytics, funneling it into BigQuery, their central data warehouse. This data is then transformed and structured by dbt Core for detailed analysis. To maintain the quality and integrity of the data, Elementary Data is employed, ensuring that decision-making is based on reliable information.

The process is further refined by Hightouch, which syncs the processed data back into business applications like HubSpot and Looker Studio. These applications play a crucial role in visualizing the data, aiding in strategic planning and performance monitoring. Throughout this workflow, Slack provides real-time alerts and notifications, keeping the team informed at every step.

## Building an Efficient Web Platform

Valorissimo's mission is to transition their data to a collaborative web platform, making it accessible and efficiently managed. This goal necessitates the integration of diverse technologies to handle data uploads, storage, and API connections, allowing for seamless processing and visualization of data. Kestra plays a crucial role in Valorissimo’s data ecosystem by managing the sequence and dependencies of various processes. By ensuring each step is executed only after the successful completion of the previous one, Kestra maintains a smooth and efficient data flow, avoiding bottlenecks and ensuring timely, reliable insights.

## Streamlining Operations with Kestra
The adoption of Kestra has been critical in enhancing Valorissimo's service offering. The data workflow begins with data collection from GA4 and Azure, funneled into BigQuery via Airbyte for centralized storage. dbt Core transforms the data, while Elementary Data performs quality checks to ensure reliability. Hightouch syncs the refined data back into business applications like HubSpot and Looker Studio, enabling automated marketing processes. This end-to-end orchestration by Kestra ensures an efficient and effective data pipeline.

## Advanced Workflow Automation with Kestra
Kestra orchestrates the ingestion of data using Airbyte, automating the process of importing data from Azure and Google Analytics. This ensures efficient and consistent data flow into BigQuery, used as Valorissimo's Data Lake. Through Kestra, dbt Core is triggered for data transformation. Concurrently, Elementary integrates into this workflow for data quality checks. Hightouch further manages the workflow, ensuring that the processed data is pushed back into visualization tools and CRM systems.

## Going Further with Hanalytics
Hanalytics' expertise in building a modern data stack, complemented by Kestra's advanced workflow automation, has been pivotal for Valorissimo. This integration of technologies like Airbyte, dbt Core, and Hightouch, managed by Kestra, ensures that Bouygues Immobilier remains a leader in a competitive market, driven by innovation and a deep understanding of the real estate ecosystem.

>"We love Kestra -> full pipeline Airbyte, to BigQuery, then dbt, Elementary Data (obs), GCS... all created together with Kestra" 
