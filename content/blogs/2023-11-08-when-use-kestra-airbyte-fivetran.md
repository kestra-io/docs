---
title: "When to choose Airbyte, Fivetran, or Kestra for data ingestion"
description: "Learn whenever it's best to use Kestra, Airbyte or Fivetran for data ingestion, or when it's good to use a mix of them"
date: 2023-11-08T08:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: /blogs/2023-11-08-when-use-kestra-airbyte-fivetran.jpg
---

As the data stack is maturing, it’s good to ask ourselves what are the overlaps of the tools we have at hand.
At Kestra we often hear this question: “is it better to use Airbyte, Fivetran or Kestra for data source ingestion?”

It’s a very good question. Airbyte and Fivetran are designed to move data from source to destination, and Kestra also has similar features.

In this blog we will detail where each tool shines and when they can fit together.

## Airbyte & Fivetran: moving data from source to destination

Airbyte or Fivetran simplify the process of moving data from source systems to desired destinations. It comes with many connectors such as databases, APIs or file systems.

Thanks to Airbyte Cloud, Airbyte Terraform provider, or the Airbyte CLI, it's easy to use whatever stack you have. With more than 300 pre-built connectors, Airbyte's catalog is the largest in the industry and is supported by an open-source community.
It’s quite the same story with Fivetran but without self-hosted options.

## Kestra: the universal orchestrator

Kestra is a universal open-source orchestrator. It aims to empower a wide range of users, from software developers to data engineers, by simplifying their automation and orchestration needs. It’s the go-to solution for organizations seeking simple and powerful orchestration solutions for any kind of process & data automation usage.

It comes with more than 300 plugins, allowing users to connect every part of their stack to any tool.

Hence, it can be used for data ingestion from databases, APIs, file systems, cloud providers, etc.


## Is it better to use Kestra, Airbyte or Fivetran for data ingestion?

As we see, the two tools cover one central aspect of data management: ingesting data from one place to another. There are still cases where you will prefer to use one or the other.

### When it’s better to use Airbyte or Fivetran over Kestra
Airbyte and Fivetran are built to move data from source to destination - by design. At the moment of writing, they have more connectors in that sense than Kestra, especially when it comes to business-facing tools like Airtable, Notion, Amplitude, Salesforce, etc.

While you can connect to those tools with Kestra through API calls, Airbyte and Fivetran make things easier with better abstraction and unified semantics.

Airbyte and Fivetran are the technologies of choice if you have a lot of different tools and you need to gather their data out into other systems (a data warehouse for example).
Having a proper tool, designed for such a process, makes things easier to manage data ingestion in the long term and allows uncoupling systems from each other.

You can still orchestrate your Airbyte or Fivetran syncs with Kestra and so connect the downstream workflows such as running dbt, running some Python scripts or any job waiting for syncs to finish. Airbyte and Fivetran runs are automated by Kestra, which is the overall control plane dealing with dependencies of your different systems.


### When it’s better to use Kestra over Airbyte or Fivetran
In choosing between Kestra, Airbyte, and Fivetran, context is key. Running Airbyte locally requires the maintenance of multiple containers, leading to infrastructure overhead, while Airbyte Cloud and Fivetran involve recurring costs for their cloud-based services.

For scenarios with a limited number of sources to integrate, Kestra offers a streamlined and potentially more cost-effective solution. Its minimalist approach can be particularly advantageous for those seeking to simplify their stack.

As Kestra comes with many plugins you can already move data from one database to another. From one filesystem to another. You can also listen to queue systems for new messages, listen for [events on file systems such as S3 buckets of FTP servers](https://kestra.io/docs/developer-guide/triggers).

Moreover Kestra has a [Singer plugin](/plugins/plugin-singer) allowing to consolidate data integration with the famous systems of taps and targets. This way you can find an in-between between Airbyte and Kestra standalone.

## What’s Next?

When it comes to data ingestion, there are various approaches available. The choice depends on factors such as the context and the number of data sources involved. In some cases, a combination of Kestra and specialized ingestion tools may be the most effective solution.

Checkout the [Airbyte](/plugins/plugin-airbyte) and [Fivetran](/plugins/plugin-fivetran) Kestra plugins allowing to trigger sync directly from Kestra and create end-to-end pipelines.

If you want to go further with Kestra and data ingestion use cases you can read [“How to create an end-to-end data ingestion, transformation and orchestration pipeline with Airbyte, dbt and Kestra”](https://kestra.io/blogs/2023-06-26-end-to-end-data-orchestration).

You can also kickstart you Airbyte & Kestra Journey with our Community Blueprints

For any inquiries, feel free to contact us through [Kestra Community Slack](https://kestra.io/slack) or by [opening a GitHub issue](https://github.com/kestra-io/kestra).

Enjoying the project? [Give us a GitHub star](https://github.com/kestra-io/kestra) and become a valued member of our open-source community.
