---
title: "CI/CD And Control Plane Accelerated Deployments, Better Data Process "
description: "This is the story of how Gorgias, a leading company in enhancing
  user experiences for online merchants and shoppers, integrated Kestra into
  their data infrastructure "
metaTitle: Gorgias, Using Declarative Data Engineering Orchestration With Kestra
metaDescription: "This is the story of how Gorgias, a leading company in
  enhancing user experiences for online merchants and shoppers, integrated
  Kestra into their data infrastructure "
heroImage: ./hero.png
featuredImage: ./hero.png
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.airbyte.connections.Sync
  - io.kestra.plugin.dbt.cloud.TriggerRun
  - io.kestra.plugin.hightouch.Sync
kpi1: |-
  ##### Centralized
  Control Plane
kpi2: |-
  ##### 20 000+
  Executions per month
kpi3: |-
  ##### 70+
  Workflows in production
quote: Declarative Data Engineering is rising as Data teams embrace software
  practices and Kestra got this point right allowing data practitioners to
  collaborate around a common tool.
quotePerson: Antoine Balliet
quotePersonTitle: Senior Data Engineer
industry: SaaS
headquarter: Paris, France
solution: Gorgias is the leading AI customer experience platform for ecommerce
  stores. Trusted by over 15000 merchants worldwide.
companyName: Gorgias
---

## About Gorgias

Gorgias is dedicated to enhancing the user experiences of online merchants and shoppers by leveraging technology. As a company committed to delivering seamless service, Gorgias has built a reputation for innovation and customer satisfaction. To manage and scale its complex data operations, Gorgias turned to Infrastructure as Code (IaC), utilizing modern tools such as Kestra, Airbyte, dbt, and Hightouch.

## Addressing Orchestrations Needs

Before integrating Kestra, Gorgias faced significant challenges due to complex orchestration needs, insufficient logging, and rudimentary scheduling capabilities. The limitations of their existing tools, particularly in handling retries, event triggering, and managing dependencies, led to inefficient workflows and required time-consuming manual interventions.

## The Rationale Behind Choosing Kestra

Kestra was identified as the optimal solution for several reasons. Its extensive integrations with critical tools in Gorgias’ technology stack made managing data workflows easy. The platform's user-friendly interface facilitated the management of tasks and flows, while its YAML-based configuration aligned perfectly with Gorgias' IaC approach, enhancing deployment speed and reliability. Kestra's scalability was also crucial, as it could handle the company's growing number of data workflows.

>"Kestra has been a keystone to design complex execution flows while enhancing our Infrastructure as Code best practices. It now empowers our ingestion with Airbyte, transformation with dbt, and our HighTouch reverse-ETL jobs seamlessly!"

## Benefits of Kestra

Integrating Kestra enabled Gorgias to efficiently orchestrate data syncs and transformations, automate retries, and smooth out the scheduling of tasks. This automation and enhanced control led to a significant reduction in manual workload and a substantial increase in automation for their data processes.


## Declarative Data Orchestration with Kestra

Kestra transformed data pipeline management by using a declarative approach, making it easier to apply Infrastructure as Code best practices to data engineering workflows. This interface fit seamlessly into Gorgias' existing toolkit, which includes Airbyte, BigQuery, PostgreSQL, dbt, GitHub, Slack, Hightouch, and others. Creating and overseeing tasks became more intuitive thanks to Kestra’s comprehensive UI.

For Gorgias, streamlining processes like initiating Airbyte synchronization followed by dbt transformations and setting up efficient retry policies for dbt jobs was particularly valuable, as they shifted to BigQuery's capacity-based pricing. Kestra also enabled the Gorgias team to schedule Hightouch synchronization after dbt jobs to ensure data remained current, trigger ETL Python scripts with easy monitoring, centralize their log management, and use an integrated UI. This UI allows for the quick creation of flows with a user-friendly workflow editor and offers a wide range of blueprints for various needs.

## Modularity with Kestra and Terraform

To provide a modular development experience, the Gorgias team leverages Terraform modules and the subflow pattern in Kestra. Modules are used as an abstraction layer for regular users to write flows without worrying about Kestra syntax, authentication, or connection details. Subflows are used for generic tasks, containing direct YAML and clearly defining Inputs and Outputs.

## Applying Configuration Using Kestra as a CI/CD Tool

Gorgias also uses Kestra as a CI/CD engine. Applying configuration changes on a self-hosted instance is easier by running Terraform directly on their Kubernetes cluster. With the dedicated Kestra Terraform plugin, they can apply changes to a local Kubernetes service endpoint using kube-DNS resolution, managing their entire data infrastructure using Kestra.

## Conclusion
By integrating Kestra into its IaC framework, Gorgias has streamlined its data management practice. Declarative interfaces are gaining popularity as data teams embrace Infrastructure as Code best practices. 

> "Declarative Data Engineering is rising as Data teams embrace software practices and Kestra got this point right allowing data practitioners to collaborate around a common tool."
