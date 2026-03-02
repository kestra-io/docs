---
title: DataMesh at Scale Increased its Data Production by 900%
description: This is the story of how Leroy Merlin France leveraged Kestra to
  transform its data architecture and enhance its data operations.
metaTitle: "Leroy Merlin France & Kestra: DataMesh at Scale Increased its Data
  Production by 900%"
metaDescription: This is the story of how Leroy Merlin France leveraged Kestra
  to transform its data architecture and enhance its data operations.
heroImage: ./hero.png
featuredImage: ./hero.png
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.gcp.cli.GCloudCLI
  - io.kestra.plugin.gcp.bigquery.Trigger
  - io.kestra.plugin.gcp.gcs.UpdateBucket
  - io.kestra.plugin.git.Clone
kpi1: |-
  ##### +900%
  In Data Production
kpi2: |-
  ##### +250
  active users
kpi3: |-
  ##### +5000
  workflows Created
quote: Kestra is the unifying layer for our data and workflows. You can start
  small, but then there is no limit to the possibilities and scalability of such
  an open architecture.
quotePerson: Julien Henrion
quotePersonTitle: Head of Data Engineering
industry: Retail
headquarter: Villeneuve d'Ascq, France
solution: Global home improvement and gardening retailer
companyName: Leroy Merlin France
---

## Modernizing Data Architecture

Leroy Merlin France, a global retail market leader with over 24,000 employees, was at a crucial crossroads in its digital transformation journey. Their existing data architecture was incompatible with their evolution toward a cloud-based infrastructure. They discovered Kestra, a tool that not only fulfilled their initial requirements but also unlocked the potential for a data mesh architecture, enabling hundreds of data practitioners to collaboratively and securely produce high-quality data analytics.

>“The tool responds perfectly to the need. Very easy to use; it manages all the complexity behind to offer a saving of time and huge savings.”

## Challenges Faced

Before Kestra, Leroy Merlin's technology stack included Teradata for the database, Talend for data integration, and older tools like Dollar U and Automic Workload Automation for scheduling and operations. These tools posed challenges in scalability, flexibility, and agility. The need for rapid migration to a serverless cloud architecture, re-architecting data pipelines, and adopting CI/CD and DataOps principles were critical bottlenecks.

## Transition to Kestra

The transition revealed critical challenges with Apache Airflow for data orchestration. 

>“After suffering with Airflow to schedule different treatments, Kestra's arrival was more than saving. The ecosystem of plugins is evolving rapidly and greatly facilitates integration with different bricks, especially on GCP (BQ, GCS, Cloud SQL, etc.). A tool that deserves to be known more.” 

Kestra emerged as a robust alternative, addressing Airflow's shortcomings with its simplicity, reliability, and efficiency. Its declarative nature and event-driven architecture offered the agility and scalability needed for growing data operations.

## Implementing Kestra

Kestra facilitated the shift towards a Data Mesh Architecture, where various data products and teams could independently manage their data domains. This decentralized approach allowed for a more scalable and responsive data infrastructure, supporting the rapid growth of Leroy Merlin France's data production by 900% over two years.

>“Kestra is a tool that is very easy to use with constant improvement in functionality. It covers almost all data pipeline setup needs.”

## Achievements with Kestra

The integration with Google Cloud's serverless architecture, BigQuery for data storage, and CI/CD tools like Terraform and GitHub Actions streamlined data transfers and transformations. Automated creation of SQL pipelines enabled data analysts and scientists to focus on core business issues, significantly reducing the time previously dedicated to data preparation and wrangling.

>“Kestra is very easy to learn, with a large number of functionalities covering a large number of use cases (scheduled workflows, API calls, triggers, flow synchronization, data and file transfers, etc.). The Web interface facilitates the monitoring of flows and the consultation of logs. New features are added very regularly, often in response to needs. Kestra is evolving rapidly.”

## Use Cases Highlighting Kestra's Impact

In its transformation journey, Leroy Merlin France leveraged Kestra to address specific operational challenges. The automated creation of SQL pipelines enabled data analysts and scientists to focus on core business issues, significantly reducing the time previously dedicated to data preparation and wrangling. Integration with DevOps tools simplified deployment and management of data workflows, ensuring the data infrastructure could evolve alongside business needs.

One pivotal use case was the collection and integration of customer feedback into the data warehouse. Kestra orchestrated the process of gathering, processing, and storing customer feedback efficiently, enhancing data-driven decision-making.

“Kestra is the first tool that allowed us to develop without installation, use your browser and start to build a true business use case within a few hours. Since the learning curve is easy, you can easily onboard new teammates due to its descriptive language. And, moreover, it handles all parts of the data pipeline: the transport, load, transform, data modeling, data quality, and monitoring of all our data pipeline. Since the tool offers strong role-based access and security on the Enterprise Edition, we are safe to share it in Software as a Service to all applications allowing us to also embrace the Data Mesh pattern.”

## Conclusion

Leroy Merlin France's journey with Kestra marks a significant milestone in their data management transformation. By addressing the limitations of previous tools and embracing a Data Mesh Architecture, the company has laid a robust foundation for future growth and innovation in data analytics. Kestra has streamlined Leroy Merlin France's data processes and empowered their teams to collaborate more effectively.

>“Kestra has streamlined our data processes, reduced costs, and significantly enhanced our scalability and efficiency. It has truly been a critical asset in our digital transformation journey.”

Leroy Merlin was a great help to Kestra by supporting it in its infancy, but it was truly a win-win partnership. Kestra is a tool that allowed Leroy Merlin to successfully conduct its cloud migration and embrace the DataOps development design.
