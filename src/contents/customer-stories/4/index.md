---
title: "Quadis Drives Innovation: Transforming Car Retail Operations with Kestra"
description: This is the story of how Quadis optimized their operations using
  Kestra for efficient financial reporting and improved customer communication.
metaTitle: "Quadis Drives Innovation: Transforming Car Retail Operations with Kestra"
metaDescription: This is the story of how Quadis optimized their operations
  using Kestra for efficient financial reporting and improved customer
  communication.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.azure.cli.AzCLI
  - io.kestra.plugin.docker.Build
  - io.kestra.plugin.scripts.python.Commands
kpi1: |+
  ##### ZERO
  Downtime


kpi2: |-
  ##### 50%
  cost reduction  of processing
kpi3: |-
  ##### +250
  datasets orchestrated
quote: We're convinced to have chosen the right tool. The support and
  communication are great, it's easy to adapt to any tool and for any people to
  understand
quotePerson: Rubén Boniz Martinez
quotePersonTitle: ""
industry: Automotive
headquarter: Madrid, Spain
solution: Spain’s largest car retailer, providing a diverse range of vehicles
  from prestigious manufacturers.
companyName: ""
---

## About Quadis

Quadis, the largest car retailer in Spain, has built a reputation for excellence through an extensive network of dealerships and a diverse range of vehicles from prestigious manufacturers. Founded with a vision of customer satisfaction and market agility, Quadis has continually adapted to evolving market trends, securing their position as a leader in the automotive sales industry. Their commitment to excellence and innovation has earned them a spot among the top 50 European dealership groups as ranked by the International Car Distribution Program (ICDP).

As Quadis expanded, the complexity of managing its extensive operations grew. They relied on orchestration to streamline everything from financial reporting to car delivery alerts. However, their legacy systems, which included an in-house solution coupled with Pentaho ETL tools, were struggling to keep up. The need for a more scalable, reliable, and efficient solution became apparent.

## The Journey to Kestra

When Quadis’ main system encountered downtime, it caused critical disruptions across the company. Every department, from sales to customer service, depended on seamless operations. The engineering team at Quadis recognized the urgency to enhance their orchestration's monitoring and provisioning. After evaluating various options, they decided to migrate to Kestra for its robust, scalable capabilities.

Kestra’s platform promised to streamline their complex operations, and it delivered.

## Modernizing Financial Reporting

Financial reports are the backbone of Quadis’ operational health. Leveraging Kestra, Quadis automated the generation of these reports, pulling transaction data directly from the main ERP. This process uses API calls, FTP tasks, and various Kestra plugins, ensuring easy maintenance and future updates. Every day at 9:00 AM, the financial team receives these reports automatically, keeping them informed and enabling swift troubleshooting, thanks to Kestra’s comprehensive logging and execution tracking.

## Elevating Customer Experience

To ensure timely communication about customer orders, Quadis integrated Kestra with their CRM. When a customer parts order is prepared and shipped, Kestra triggers an automatic notification via Salesforce. This seamless integration ensures customers are informed, enhancing their experience and preventing communication gaps.

>"The platform is fluid on the web, and it's easy for non-technical people to understand."

## Overcoming Legacy System Challenges

Before adopting Kestra, Quadis relied on an in-house solution coupled with Pentaho ETL tools. This setup had several limitations:

- Low Availability: The stack lacked infrastructure monitoring and support.
- GUI Limitations: The graphical user interface was inadequate for scaling and debugging, and testing pipelines was complex.
- Lack of Lineage and Observability: The legacy solution didn’t support comprehensive management across teams.

## The Kestra Transformation

Quadis chose Kestra to address these issues. Kestra provided a scalable, reliable solution that allowed Quadis to apply best software practices, such as code versioning and uncoupling orchestration from business logic. This transition to an "everything as code" approach, while maintaining UI operations, was a key factor in their successful migration.

## Streamlined Development and Deployment

Quadis adopted a classic Git workflow for managing custom scripts, integrating seamlessly with Kestra. This workflow allowed developers to push flows from Kestra to Git, facilitating easy adjustments and deployment through CI/CD pipelines with Azure DevOps.

>"It's easy to adapt to any tool thanks to the plugins."

## Docker Integration for Custom Logic Made Easy

To handle various data processes, Quadis uses Docker containers to isolate resources and dependencies. Kestra’s integration with Docker simplifies this workflow, supporting multiple programming languages like C# and Python for data transformation tasks.

## Rapid Onboarding and Scaling Success

In less than three months, Quadis onboarded over five developers into Kestra, deploying two instances (development and production) on AWS infrastructure. This rapid setup allowed them to quickly build and manage workflows, utilizing tasks for accessing files, querying databases, and transforming data.

## Future Directions and Scaling Ambitions

Quadis is set to expand its use of Kestra, with plans to onboard over 30 users in the coming months, including less technical personnel. The Kestra user interface and role-based access control will enable these users to execute flows confidently. As part of a broader modernization effort, Quadis will also leverage Kestra to support a new data lake architecture, enhancing data analytics and operational efficiency.

## Conclusion: The Road Ahead with Kestra

Kestra has become an indispensable tool for Quadis, enhancing their operational efficiency and scalability. By automating critical processes and providing robust orchestration capabilities, Kestra has enabled Quadis to maintain its market leadership and prepare for future growth. As Quadis looks to expand beyond Spain, Kestra will continue to play a vital role in their operations, supporting best practices in software and architecture.

>"Everything coming has been expected. The support is good, communication is great (fast), the platform is fluid on the web, and it's easy for non-technical people to understand. It's easy to adapt to any tool thanks to the plugins."
