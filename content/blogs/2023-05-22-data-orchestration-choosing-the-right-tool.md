---
title: "What you Need to Know to Choose the Right Data Orchestrator"
description: Discover the evolution of data orchestration and key factors to consider when choosing an orchestrator. 
date: 2023-05-22T18:00:00
category: Solutions
author:
  name: Martin Pierre Roset
  image: "mproset"
image: /blogs/2023-05-22-data-orchestration-choosing-the-right-tool.jpg
---

The world of data engineering is constantly evolving, especially in the face of the progress introduced by AI. Following Marc Lamberti[https://www.linkedin.com/in/marclamberti/] (Head of customer Education at Astronomer) evaluation criteria post[https://www.linkedin.com/feed/update/urn:li:activity:7065329373981089792/] we created this article to utline how Kestra addresses the requirements of organizations in search of a proficient data orchestrator.

## Making an Informed Choice: Key Considerations for an Orchestrator

Choosing the right orchestrator for your organization requires thoughtful deliberation. Here are a few essential considerations to guide your decision:

### Adaptability ###
Kestra's strength lies in its adaptability. We ensures that workflows are not just created, but they can be quickly modified, deployed, and adjusted as per the evolving data stack of the user. Its declarative approach with YAML allows for more straightforward workflow modification and adaptation, making it a suitable choice for a fast iteration cycle on the workflow management.

### Dependency Management ### 
Managing dependencies can be a challenge as workflows grow in complexity. Kestra's topology view brings clarity to complex workflows, offering a transparent overview of task interdependencies. It enables you to visualize the complete workflow with its intuitive interface, thereby simplifying the management of interdependent tasks.

### Security ###
Kestra takes data security seriously, with our Enterprise Edition[https://kestra.io/enterprise] we provide robust security measures to ensure your data is safeguarded throughout its life cycle. With features such as SSO/OIDC authentication, role-based access Control, and Secret Manager Integration, Kestra ensures a secure platform for data orchestration.

### Monitoring ###
![monitoring](\blogs\2023-05-22-data-orchestration-choosing-the-right-tool/monitoring.png)

Troubleshooting any issue occurring on your workflow is a very important step of your orchestration.  Kestra offers real-time visibility into your workflows, enabling you to identify and address issues quickly. You can track task execution, dependencies, failures, and more, which provides you with the granular detail necessary to effectively manage your data orchestration.

### Scalability ### 
Kestra has been designed with scalability at its core. Developed using leading cloud-native technologies and a robust architecture such as Apache Kafka or Elastic Search, Kestra is capable of scaling to millions of executions without any hassle. As data volumes grow and tasks become complex, Kestra can accommodate this growth without compromising performance, proving its value as a scalable data orchestrator.

### User Friendly ### 

Kestra's intuitive and user-friendly interface makes the tool accessible to both data engineers and business stakeholders. Despite dealing with complex workflows, Kestra ensures the user interface remains simple and comprehensible. With an embedded code editor, auto-completion, and clear visualization of workflow dependencies, Kestra simplifies data orchestration management.

### Testing ### 
Ensuring workflows are tested before they are pushed into production can save a lot of trouble down the line. With Kestra, workflows can be thoroughly tested before they go live, providing an essential safety net for your data project.

### Documentation: ### 
![documentation](\blogs\2023-05-22-data-orchestration-choosing-the-right-tool/doc-in-editor.png)

Good documentation supports a smoother learning process and encourages team collaboration. We have a strong focus on our integrated documentation, reducing the learning curve and making it easier for teams to work together effectively.

**Backfilling:** It's about ensuring no data is left unprocessed due to failures or delays. With Kestra, backfilling is built into the system, ensuring the continuity and completeness of data processing.

### Integration capabilities: ###
![plugins](\blogs\2023-05-22-data-orchestration-choosing-the-right-tool/plugins.png)

 Kestra's flexibility and versatility, underlined by its extensive [range of plugins](../plugins/index.md), makes it an ideal tool for creating complex workflows with deep integrations with multiple systems. For systems without existing plugins, Kestra's compatibility with containers such as **Docker** and **Kubernetes** makes integration straightforward.


## A Declarative Data Orchestrator: Embracing YAML for Workflow ##

A distinguishing feature of Kestra is its declarative nature, We leverage YAML (Yet Another Markup Language) to define workflows. YAML is  known for its simplicity, readability, and ease of use, making it an ideal choice for building data pipelines. With YAML, both data teams and business stakeholders can participate in the workflow creation process.

Through declarative orchestration, we aim to ensure that Kestra remains accessible and easy to use, facilitating collaboration and enabling fast iteration cycles. We're building a flexible, scalable, secure, and user-friendly tool. As we continue to evolve with the dynamic journey of data orchestration, we remain committed to evolving and adapting with it. you can learn more about declarative orchestration here[https://kestra.io/features/declarative-data-orchestration]. 


Join the Slack [community](https://kestra.io/slack) if you have any questions or need assistance.
Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. 
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
