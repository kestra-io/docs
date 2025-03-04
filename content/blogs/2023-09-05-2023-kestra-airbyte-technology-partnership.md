---
title: "Announcing Kestra Technology Partnership with Airbyte"
description: "Kestra and Airbyte share a common vision for the future of the Modern Data Stack. This technical partnership ensures seamless data transfer, task execution, and process automation between Kestra and Airbyte."
date: 2023-09-05T12:00:00
category: Company News
author:
  name: Martin-Pierre Roset
  image: "mproset"
image: /blogs/2023-09-05-2023-kestra-airbyte-technology-partnership.jpg
---

We are pleased to announce a technology partnership with [Airbyte](https://airbyte.com/). [Kestra](https://github.com/kestra-io/kestra) and Airbyte share a common vision for the future of the Modern Data Stack. This technical partnership ensures seamless data transfer, task execution, and process automation between Kestra and Airbyte.

>“Airbyte and Kestra share a common vision: to simplify data pipeline creation. This partnership brings together the strengths of two leading data management companies, so our customers can get the most out of their data and achieve their business goals.”

*Chris Tata Head of Partnerships @ Airbyte*

With technology partners like Airbyte, we're able to cover more use cases in our existing framework. By integrating with Airbyte, Kestra can provide an open technology stack that can integrate, transform, process, and move data at any scale.

>“Kestra excels at orchestrating data pipelines, and often the most challenging part of this is the initial data integration, a stage where Airbyte shines. The collaboration between Kestra and Airbyte, both open-source platforms, is a natural fit as we share a common mission: to simplify and optimize data solutions for business users.”

*Ludovic Dehon CTO @ Kestra*

---

### Kestra's Airbyte Plugin ###
Kestra's [plugin for Airbyte](/plugins/plugin-airbyte) enables users to trigger Airbyte syncs and optionally, wait for their completion. Whether you use the open-source Airbyte Server or Airbyte Cloud, Kestra can integrate your data ingestion process into an end-to-end data workflow.

### Embracing Everything as Code with Kestra and Airbyte ###
Our collaboration highlights an innovative approach to data management—treating everything as code. The partnership strengthens the ability to automate data operations and infrastructure deployment, which means you can now manage, modify, and scale your data pipelines more efficiently.

- **Everything-as-Code Approach**: Manage data operations like code, fostering collaboration, and efficient scaling. More insights can be found in this detailed blog post on everything-as-code for data infrastructure.

- **Terraform Providers Integration**: Both platforms offer strong Terraform support, enabling you to manage and provision resources using declarative configuration files.

---

## End-to-End Data Orchestration with Airbyte and Kestra ##

The collaborative efforts offer a unified platform for end-to-end data orchestration, allowing users to build data workflows with ease:

- **Dynamic Data Workflows**: You can use Kestra's Airbyte plugin to trigger various operations, such as parallel syncs, scheduled ingestion, and complex data processing jobs.

![parallel](/blogs/2023-09-05-2023-kestra-airbyte-technology-partnership/parallel.png)

- **Robust Orchestration Capabilities**: From triggering multiple Airbyte Cloud syncs to running complex dbt jobs, Kestra's flexibility empowers users to control and automate their data processes.

![dbt-airbyte-jobs](/blogs/2023-09-05-2023-kestra-airbyte-technology-partnership/dbt-job-airbyte.png)

- **Efficient Data Management**: Learn how this collaboration supports an end-to-end data orchestration approach in [this blog post](https://kestra.io/blogs/2023-06-26-end-to-end-data-orchestration).

### What You Can Achieve ###
With the Kestra-Airbyte collaboration, users can perform a wide range of tasks:

- **Trigger Multiple Airbyte Cloud Syncs in Parallel**: Facilitating efficient data synchronization.
- **Scheduled Syncing**: Planning single or multiple Airbyte syncs.
- **Complex Data Operations**: Execute intricate tasks, such as triggering multiple Airbyte syncs and then running dbt jobs.

---

### What’s Next ##

This partnership provides a versatile toolkit for data professionals, extending the possibilities of data handling. The potential applications are large, aligning with various organizational needs and ensuring data-driven success. Discover more about this integration through our [documentation](/plugins/plugin-airbyte).

If you want to go further with Kestra and Airbyte capabilities you can read this article about [Everything as Code for Data Infrastructure with Airbyte and Kestra Terraform Providers](https://airbyte.com/blog/everything-as-code-for-data-infrastructure-with-airbyte-and-kestra-terraform-providers) or [how to create an End-to-End Data Ingestion, Transformation and Orchestration pipeline with Airbyte, dbt and Kestra](https://kestra.io/blogs/2023-06-26-end-to-end-data-orchestration)

You can also kickstart you Airbyte & Kestra Journey with our [Community Blueprints](https://demo.kestra.io/ui/blueprints/community?q=airbyte&page=1)

If you have any questions, reach out via [Kestra Community Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the open-source community](https://kestra.io/slack).
