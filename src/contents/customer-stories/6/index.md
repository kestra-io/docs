---
title: Clever Cloud, Offloading Terabytes of Data with Kestra Every Month
description: This is the story of how Clever Cloud integrated Kestra to automate
  data offloading, significantly improving their system efficiency and data
  handling capacity.
metaTitle: Clever Cloud Enhances Data Management with Kestr
metaDescription: This is the story of how Clever Cloud integrated Kestra to
  automate data offloading, significantly improving their system efficiency and
  data handling capacity.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.core.http.Request
  - io.kestra.plugin.core.flow.Subflow
  - io.kestra.plugin.core.flow.EachParallel
  - io.kestra.plugin.core.flow.EachSequential
kpi1: |-
  ##### 20TB
  of Data Managed Weekly
kpi2: |-
  ##### 80% 
  Reduction in Manual Data Offloading Tasks
kpi3: |-
  ##### 50%
   Increase in Data Processing Speed
quote: Kestra’s automation capabilities significantly improved our data
  management processes. By automating key tasks, we optimized our workflow
  execution and made complex data processing more manageable.
quotePerson: Alexandre Burgoni
quotePersonTitle: ""
industry: Cloud Provider
headquarter: Nantes, France
solution: Clever Cloud is an IT Automation platform to manage all the ops work
  while you focus on your business value
companyName: ""
---

## About Clever Cloud

Since its inception in 2011, Clever Cloud has focused on providing a robust Platform as a Service (PaaS) solution. Based in Europe, Clever Cloud exists to help people and companies deliver software and services faster. Their promise is to ensure that once an app is deployed, it stays up, no matter what—be it high traffic, security updates, DDoS attacks, application failures, or hardware issues. The PaaS helps development teams put digital applications and services into production on a reliable infrastructure, offering automatic scalability and transparent pricing.

With monitoring data reaching 20TB weekly, Clever Cloud needed a robust solution to manage this influx without compromising system performance or storage efficiency.

## Tackling Data Volume with Kestra

To address their data volume challenge, Clever Cloud integrated Kestra into their workflow, automating the process of data offloading to enhance system efficiency and data handling capacity. Kestra facilitated the automation of Clever Cloud's data management, from initiating data transfers to optimizing storage through efficient data compression, making the entire process more manageable and reliable.

## The Role of Kestra
Clever Cloud employed Warp10 HFiles for data compression and FoundationDB for data management. Kestra orchestrated the automation of the data offloading process. This integration allowed Clever Cloud to handle large volumes of data efficiently, ensuring rapid data processing and reliable storage.

>"Kestra’s automation capabilities significantly improved our data management processes." 

explained Alexandre Burgoni, Engineering Lead at Clever Cloud. 

>"By automating key tasks such as initiating data transfers and managing sub-workflows, we optimized our workflow execution and made complex data offloading more manageable."

Kestra played a pivotal role in Clever Cloud’s data management by automating tasks like initiating HTTP requests, executing sub-workflows, and managing operations in parallel or sequentially. Clever Cloud's use of the Request task for HTTP requests was crucial for interacting with external data sources, while Subflow allowed for modular workflow design. The EachParallel and EachSequential tasks helped optimize workflow execution based on task dependencies.

## Workflow Design and Execution

Clever Cloud designed a main workflow with a monthly trigger to orchestrate the data offloading process. This principal workflow sequentially called other workflows tailored to specific business needs, such as differentiating between infrastructure metrics and client metrics. Variables and parameters were used to customize and differentiate the execution context, allowing for efficient parallelization of the main "archive" workflow launches.

>"The flexibility of Kestra's workflows allowed us to manage different data sets and offloading tasks efficiently, in case of a failure, the system automatically triggered an 'archive_failure' workflow, which notified our team on Slack, ensuring prompt response to any issues."

In the event of a failure within the "archive" workflow, an "archive_failure" workflow was triggered. This auxiliary workflow notified the team on Slack about the failure, ensuring prompt awareness and response to any issues encountered during the data offloading process.

## Outcomes

The integration of Kestra led to significant improvements in handling data volume, maintaining system performance, and optimizing storage use. Automated workflows allowed Clever Cloud to offload billions of data points each month efficiently. This success has encouraged further exploration of automating other areas within Clever Cloud's infrastructure with Kestra.

## Conclusion

Kestra has become an integral part of Clever Cloud’s data management strategy, enabling the automation of complex data workflows and enhancing overall system efficiency. By leveraging Kestra’s powerful features, Clever Cloud has achieved significant improvements in data handling capacity.

