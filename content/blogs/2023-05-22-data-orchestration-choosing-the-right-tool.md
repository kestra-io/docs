---
title: "Data orchestration: Choosing the Right Tool"
description: Discover the evolution of data orchestration and key factors to consider when choosing an orchestrator. 
date: 2023-05-22T18:00:00
category: Solutions
author:
  name: Martin Pierre Roset
  image: "mproset"
image: /blogs/2023-05-22-data-orchestration-choosing-the-right-tool.jpg
---

The world of data orchestration is rich, vibrant, and dynamic. People working at Kestra have been a part of this world for many years, witnessing its evolution and feeling the currents of change flow through it.

## A Glimpse into the Early Days of Data Orchestration ##

The genesis of data orchestration was marked by simple scripts, typically written in Python or Bash. As data volume grew and use cases became more complex, these scripts also became increasingly intricate and challenging to manage. These conditions gave birth to a new era of data orchestration, with Apache Airflow pioneering the way.

### Apache Airflow the first of its Kind ###

Almost 10 years ago, Apache Airflow marked a major milestone in data orchestration. Its introduction of Directed Acyclic Graphs (DAGs) transformed the way complex workflows were managed, igniting a paradigm shift in the industry. Airflow's influence continues to resonate in the way we perceive and manage data orchestration today.
However, the exponential growth and transformation of the data landscape, alongside the advent of modern data stack tools such as Snowflake, DBT, and Fivetran, underscored the necessity for further evolution in data orchestration. We observed new challenges accompanying the adoption of these tools that called for innovative solutions to orchestrate these cloud-native technologies.

### Yet Another Data Orchestrator: Why the Surge? ###

In recent years, we've seen an influx of "yet another data orchestrator". One might wonder, is there a genuine need for another orchestrator? The answer, is: it depends, if your current orchestrator meets all your needs, there may be no reason to shift. However, if you find yourself grappling with limitations or complexities, exploring other solutions that streamline workflow creation, enhance user interfaces, and facilitate smoother integration with other tools could be worth your while.

## Making an Informed Choice: Key Considerations for an Orchestrator

Choosing the right orchestrator for your organization requires thoughtful deliberation. Here are a few essential considerations to guide your decision:

- **Adaptability:** Workflows need to be easy to modify, quick to deploy, and malleable enough to adjust to the ever-changing landscape of data. Kestra has been designed with this in mind. It’s not just about creating workflows; it’s about adapting them on the go, in response to real-time data environments.

- **Dependency Management:** As workflows grow, managing dependencies becomes a major challenge. Kestra's topology view brings clarity to complex workflows, giving you a transparent overview of task interdependencies.

- **Security:** A strong security platform is not just a luxury, but a necessity.  Kestra takes security seriously, ensuring your data is protected throughout its life cycle thanks to the Enterprise Edition features such as SSO/OIDC authentication, role-based access Control and Secret Manager Integration.

- **Monitoring:** Troubleshooting any issue occurring on your workflow is a very important step of your orchestration.  Kestra offers real-time visibility into your workflows, enabling you to identify and address issues quickly. You can track task execution, dependencies, failures, and more, which provides you with the granular detail necessary to effectively manage your data orchestration.

- **Scalability:** Cloud native solution are by definition scalable, your orchestrator must also scale to your needs and support the growth of your data. Kestra has been built with leading cloud-native technologies  and a strong architecture, enabling scaling to millions of executions without hassle.

- **User Friendly:** Complex workflows should not mean a complex user interface. Kestra's intuitive UI ensures the tool remains accessible to both data engineers and business stakeholders. It comes with an embedded code editor, auto-completion, and clear visualization of workflow dependencies.

- **Testing:** Ensuring workflows are tested before they are pushed into production can save a lot of trouble down the line. With Kestra, workflows can be thoroughly tested before they go live, providing an essential safety net for your data project.

- **Documentation:** Built-in documentation is another cornerstone of Kestra, reducing the learning curve and fostering collaboration.

- **Backfilling:** It's about ensuring no data is left unprocessed due to failures or delays. With Kestra, backfilling is built into the system, ensuring the continuity and completeness of data processing.

- **Integration capabilities:** Kestra’s plugin system enables seamless integration with others platforms and services. It can connect to various databases, APIs, cloud services…

## A Declarative Data Orchestrator: Embracing YAML for Workflow ##

A distinguishing feature of Kestra is its declarative nature, We leverage YAML (Yet Another Markup Language) to define workflows. YAML is  known for its simplicity, readability, and ease of use, making it an ideal choice for building data pipelines. With YAML, both data teams and business stakeholders can participate in the workflow creation process.

Through declarative orchestration, we aim to ensure that Kestra remains accessible and easy to use, facilitating collaboration and enabling fast iteration cycles. We're building a flexible, scalable, secure, and user-friendly tool. As we continue to evolve with the dynamic journey of data orchestration, we remain committed to evolving and adapting with it.


[Join the Slack community](https://kestra.io/slack) if you have any questions or need assistance.

Be sure to follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. And if you love what we do, give a star on [our GitHub repository](https://github.com/kestra-io/kestra).
