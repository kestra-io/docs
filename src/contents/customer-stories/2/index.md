---
title: Ntico Manage Geospatial Data Operations with Kestra
description: This is the story of how Ntico leveraged Kestra to power Locxia, a
  platform providing businesses and local authorities with deep insights into
  territories and residents through satellite imagery.
metaTitle: Ntico Transforms Geospatial Data Operations with Kestra
metaDescription: This is the story of how Ntico leveraged Kestra to power
  Locxia, a platform providing businesses and local authorities with deep
  insights into territories and residents through satellite imagery.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.aws.athena.Query
  - io.kestra.plugin.aws.s3.CreateBucket
  - io.kestra.plugin.jdbc.postgresql.Trigger
kpi1: |-
  ##### Terabytes
  Of geospatial data managed
kpi2: |-
  ##### 50%
  cost reduction of processing
kpi3: |-
  ##### +250
  datasets orchestrated
quote: Ntico is one of the first fans of Kestra! We use Kestra in our data
  projects and are not surprised by the community's interest. It’s a must-try!
quotePerson: Stephane Delos
quotePersonTitle: ""
industry: Consulting and Integrations
headquarter: Villeneuve d'Ascq, France
solution: Geospatial Data
companyName: ""
---

## About Loxcia

Locxia is a data platform focused on housing data, empowering businesses and local authorities to better understand their customers and territories. It provides access to over 250 value-added datasets sourced from satellite images and public data, all consolidated and accessible on a dedicated platform.

>“Locxia allows large retail companies and local authorities to supplement their customer databases with reliable data, improving their customer knowledge and enabling more effective public policy construction and communication.”

##Implementing Kestra for Advanced Data Ingestion and Processing

To support the high data volume and scalability requirements of Locxia, Ntico chose Kestra as the data orchestrator. Kestra coordinates data ingestion processes, handling extensive datasets from diverse sources such as APIs, open-data platforms, and raw satellite images. This data is then efficiently pushed into an AWS S3 bucket, serving as the central data repository.

“Kestra is really good because it can be used by a beginner as well as an expert!” noted an Ntico engineer.

## Managing Application Tokens

When users register and connect to Locxia, Kestra generates and rotates tokens, providing a secure and efficient authentication mechanism. This demonstrates Kestra's versatility beyond data orchestration, covering a wide range of processes such as business operations, resource management, and application integrations.

## Enhancing User Experience

Locxia’s team leveraged Kestra's user interface extensively. The platform's topology view was instrumental in managing Locxia's extensive data workflows, providing an immediate visual representation of task dependencies and facilitating effective planning and execution of necessary modifications.

A standout feature appreciated by the Ntico developers was Kestra's openness to customization. They could bring their own business logic and technical needs thanks to Docker support, creating their own pipelines and building new systems quickly. The integrated development environment minimized context-switching and ensured continuous integration and development through integration with GitHub Actions.

>“Kestra is an efficient solution for processing all types of data streams. Efficient in development with a clear UI, a comprehensive DevOps process, and an impressive number of plugins that allow it to adapt to all of our clients' technical contexts.”

## What’s Next
The collaboration between Ntico and Kestra has been instrumental in developing Locxia, a modern data platform that revolutionizes the understanding of housing data. Ntico recognized the need for a robust data orchestrator to handle the vast volumes of geospatial data involved in Locxia. By leveraging Kestra's capabilities, Ntico successfully tackled challenges associated Ntico to deliver a robust, reliable, and efficient data platform.
