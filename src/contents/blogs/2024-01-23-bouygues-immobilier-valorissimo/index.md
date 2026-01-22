---
title: "Bouygues Immobilier Platform, Valorissimo Constructing a Modern Data Stack with Hanalytics and Kestra"
description: "Discover how Hanalytics, developped a modern data stack orchestrated with Kestra for Bouygues Immobilier platform, Valorissimo "
date: 2024-01-23T09:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  image: "mproset"
image: ./main.jpg
---

Bouygues Immobilier platform, Valorissimo, with over two decades of experience in the real estate sector, stands out as a historic company in the industry. They have developed a unique methodology over the years to assist real estate professionals in selling their programs. This expertise encompasses a broad understanding of the market, which has been instrumental in their success.

One of the key innovations at Valorissimo is the digital platform they have created, tailored to meet specific needs in the sales processes of the real estate investment sector. Their marketplace facilitates connections between real estate developers and investors.

In a strategic move to further enhance the marketing agility and sales efficiency, Valorissimo partnered with Hanalytics to develop a modern data stack. This collaboration not only led to the personalization of their marketing automation campaigns but also remarkably doubled their conversion rates. The introduction of this modern data stack, built with a suite of specialized tools, is a huge evolution in their operational capabilities, ensuring Valorissimo stays at the forefront of the real estate investment sector.

In managing Valorissimo's modern data infrastructure, [Kestra](https://github.com/kestra-io/kestra) plays a key role. Chosen by [Hanalytics](https://www.data-hanalytics.io/) for its efficiency and reliability, Kestra orchestrates all the tasks across those platforms. Kestra’s function is essential in automating processes and ensuring data consistency, which is critical for the effectiveness of Valorissimo's data-driven marketing and sales strategies.

## Understanding Valorissimo’s Data Ecosystem

[Valorissimo](https://partenaires.valorissimo.com/)’s data strategy is a multi-faceted approach involving several key technologies, each serving a specific purpose in the overall data lifecycle:

1. **Airbyte**: For ingesting data from Azure and Google Analytics, it captures essential information from business units and platform users.
2. **BigQuery**: Serves as the central data warehouse, organizing and storing large volumes of data for subsequent processing and analysis.
3. **dbt Core**: Transforms and structures data within BigQuery, preparing it for detailed analysis.
4. **Elementary Data**: Ensures data quality and integrity, critical for effective decision-making based on reliable data.
5. **Hightouch**: As a reverse ETL tool, it integrates processed data back into visualization tools and CRM systems.
6. **Looker Studio**: Converts processed data into interactive reports and dashboards, aiding in strategic planning and performance monitoring.
7. **Google Sheets**: Used for dynamic reporting.
8. **HubSpot**: Integrates with the data stack to enhance marketing automation and lead management.
9. **Slack**: Provides real-time alerts, and notification at flow execution or updated dashboards.

<br>

## Workflow Integration: From Collection to Application

Valorissimo’s data workflow is a carefully orchestrated process. It starts with data collection from GA4 and Azure, funneled into BigQuery via Airbyte for centralized storage. The transformation by dbt Core and the quality checks by Elementary Data ensure that the data is both refined and reliable. Hightouch further enhances this process by syncing the refined data back into business applications; Looker Studio, which visualizes the data to inform strategic decisions. The data pushed from for Hightouch to Hubspot allow automated marketing processes, thereby closing the loop from data collection to marketing initiatives.

<br>

### Advanced Workflow Automation with Kestra

The entire workflow is orchestrated by Kestra, which manages the sequence and dependencies of these processes. By ensuring that each step is executed only after the successful completion of the previous one, Kestra maintains a smooth and efficient flow of data. This orchestration is critical in avoiding bottlenecks and ensuring the timeliness and reliability of data-driven insights.

Here is a breakdown of each of the workflow Hanalytics have created with Kestra to manage the data stack of Valorissimo:

**Airbyte Ingestion Workflow**
Kestra orchestrates the ingestion of data using Airbyte, automating the process of importing data from Azure and Google Analytics. This ensures efficient and consistent data flow into BigQuery, used as Valorissimo's Data Lake.

<br>

**Data Transformation and Quality Workflow**
Through Kestra, dbt Core is triggered for data transformation. Concurrently, Elementary integrates into this workflow for  data quality checks. For this task, Hanalytics is using a custom Python Script, that launch Elementary directly from the Kestra workflow, all by a CI/CD process.

<br>

**Hightouch Reverse ETL Workflow**
Kestra further manages the Hightouch workflow, once the data quality is passed and the transformation done,  the  processed data is pushed to Hightouch, wich ensure that all the data is pushed back into visualization tools and CRM systems.

<br>

**Dependency Management**
A critical aspect of Kestra’s functionality within Valorissimo’s data ecosystem is its ability to manage dependencies between these diverse workflows. This ensures that each step is precisely timed and executed, maintaining a reliable and effective data processing pipeline.

<br>

## Going Further with Hanalytics

Hanalytics' expertise in building a modern data stack, complemented by Kestra's advanced workflow automation has been pivotal for Valorissimo.
This integration of technologies like Airbyte, dbt Core, and Hightouch, managed by Kestra, ensures that Bouygues Immobilier remains a leader in a competitive market, driven by innovation and a deep understanding of the real estate ecosystem.

We are proud to have such partners has [Hanalytics](https://www.data-hanalytics.io/) and we are looking forward to further enhance our collaboration with their amazing team!

---

Join the [Slack community](/slack) if you have any questions or need assistance. Follow us on [Twitter](https://x.com/kestra_io) for the latest news. Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.