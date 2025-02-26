---
title: "Why data integration will never be fully solved, and what Fivetran, Airbyte, Singer, dlt and CloudQuery do about it"
description: "Let's look at the challenges with data ingestion and discuss how Fivetran, Airbyte, Singer, dltHub and CloudQuery approached those challenges. Which of these tools is best for your use case? Find out in this post."
date: 2023-10-11T11:30:00
category: Solutions
author:
  name: Anna Geller
  image: "ageller"
image: /blogs/2023-10-11-why-ingestion-will-never-be-solved.png
---

If you ask a data engineer what is the most frustrating and error-prone part of their job, chances are they'll say _data ingestion_. Moving data from A to B is one of the most mundane and time-consuming tasks of any platform team.

This post covers how [Fivetran](https://www.fivetran.com/), [Airbyte](https://airbyte.com/), [Singer](https://www.singer.io/), [dltHub](https://dlthub.com/), and [CloudQuery](https://www.cloudquery.io/) approached data integration. Even though we'd argue that this problem will never be fully solved by an integration vendor, there is a lot we can do to make the ingestion process more reliable, maintainable, and cost-effective. We'll link to relevant [blueprint](../docs/04.user-interface-guide/blueprints.md) examples showing how you can orchestrate the ingestion process with [kestra](https://github.com/kestra-io/kestra) — an event-driven open-source orchestrator. First, let's start by defining the problem.

---

## Challenges with data ingestion

Building reliable data integrations is time-consuming and often tedious. The teams responsible for building and maintaining custom connectors have to deal with many challenges, including the following pain points:
- Backend APIs change and are prone to errors and rate limits
- Schemas evolve, often resulting in incompatible data formats
- The source systems experience outages
- The data volume grows and shrinks unexpectedly
- The cloud infrastructure hosting the underlying APIs and connectors has its own reliability and scaling issues.

When those issues happen, data engineers are on the hook to fix broken pipelines manually, e.g. using [backfills](https://demo.kestra.io/ui/blueprints/community/1), and they often perform that hard work without much recognition.
- When everything works, people ask "what do we even pay data engineers for?".
- When something breaks, people ask "what do we even pay data engineers for?".

The maintenance requirements are high and never-ending. Due to the proliferation of SaaS applications and the growing number of integration use cases, the problem only exacerbates.

---

## The rise of ELT

In the past, data engineers had to manage the entire process themselves. They were building their own connectors and coordinated the ingestion process using orchestration tools such as Airflow (or [kestra](https://github.com/kestra-io/kestra)). However, writing custom connectors for every source system is expensive from the development and maintenance perspective. At the same time, syncing data from A to B is a **commodity task**. It's not a competitive advantage for most companies, as almost everyone expects the same outcome: move data from A to B in a reliable, scalable and cost-effective way.

---

## How vendors approached data ingestion

Given that data integration is, to a large degree, a commodity task, it's reasonable to outsource it to a third party that can keep the connectors up-to-date. Many ingestion tools are trying to fill that gap, including [Fivetran](https://fivetran.com/), [Airbyte](https://airbyte.com/), [Singer](https://www.singer.io/), [dltHub](https://dlthub.com/) and [CloudQuery](https://www.cloudquery.io/).

### No-code SaaS tools

When outsourcing data ingestion, many companies prefer to let the software provider manage the entire process without requiring in-house engineering resources. As a result, most commercial data integration tools have been designed to be primarily operated from the UI by anyone, be it domain experts, data analysts, or engineers. Products that fall into the category include:
- [Zapier](https://zapier.com/) for business users
- [Mulesoft](https://www.mulesoft.com/) (_acquired by Salesforce in 2018_) for Enterprise IT
- [Fivetran](https://fivetran.com/) for BI-centric data ingestion.


All of these tools work in a similar way:
1. You log into a GUI to configure your **source systems** and **destination(s)** either in a drag-and-drop fashion or via UI forms.
2. Then, you create **connections** to sync data between them.
3. Finally, you can directly add a schedule or trigger from the same UI so that the process runs on a regular basis.

::alert{type="info"}
To see how you can orchestrate Fivetran connectors with [kestra](https://github.com/kestra-io/kestra), check our [Fivetran blueprints](https://demo.kestra.io/ui/blueprints/community?page=1&q=fivetran) and the [plugin documentation](/plugins/plugin-fivetran).
::

### Why no-code is often not enough

Being optimized for business users, no-code connectors are opinionated and they typically don't allow much customization. If you want to implement a new connector or change the behavior of an existing one (_e.g. add support for new API endpoints_), your options are limited to the support the vendor can offer. There are some exceptions, though. For instance, [Fivetran](https://www.fivetran.com/) allows you to build [custom connectors](https://interworks.com/blog/2023/02/06/fivetrans-custom-connector-in-aws-lambda/) using serverless functions such as AWS Lambda. Still, writing custom code is not the primary use case for this class of tools. Even though Fivetran offers an official Terraform provider, many authentication mechanisms are quite clunky to configure via code because the platform was optimized for connecting to other systems from the UI.

If you're an engineer trying to version-control your data integration configuration alongside your code, the no-code approach might not be the best fit for you.

This is the niche that open-source tools such as [Singer](https://www.singer.io/), [Airbyte](https://airbyte.com/), [CloudQuery](https://www.cloudquery.io/) and [dltHub](https://dlthub.com/) are trying to fill.

---

## Open standards vs. open-source plugins

When commercial no-code tools don't cut it, you'll likely "just" write a script. However, arbitrary ingestion scripts that don't adhere to any framework often lead to a lack of standardization and maintenance burden. There are two main approaches to solving this problem: open standards and open-source plugins.

### Open standard: Singer

[Stitch](https://www.stitchdata.com/) tried to solve that problem by building a universal data ingestion **standard** called [Singer spec](https://hub.meltano.com/singer/spec/). That spec aimed to improve standardization and community collaboration to avoid reinventing the wheel across companies.

::alert{type="info"}
To see how you can orchestrate Singer with [kestra](https://github.com/kestra-io/kestra), check the following [blueprint example](https://demo.kestra.io/ui/blueprints/community/70) and the [Singer plugin documentation](/plugins/plugin-singer).
::

A typical [Singer](https://www.singer.io/) project consists of **taps**, **targets**, and a **JSON-based communication format** between them. Many connectors have been written using that specification. However, they were often developed by consulting firms in one-off projects, shifting the responsibility for long-term maintenance and continuous development to the end user. As a result, the quality of those connectors varies greatly, and many claim that some Singer connectors are not production-ready.

Especially after Stitch was [acquired](https://www.talend.com/about-us/press-releases/talend-acquires-stitch-a-leader-in-self-service-cloud-data-integration/) by Talend, there was no central entity governing the quality of connectors, leading to eroding trust in the data community.

### Open-source connector ecosystems

[Airbyte](https://airbyte.com/), [CloudQuery](https://www.cloudquery.io/), and [dltHub]([dltHub](https://dlthub.com/)) learned from [Singer](https://www.singer.io/) and took a different approach. Instead of building a standard, all of them implemented their own **framework** and **platform** for building connectors using a pluggable system. This means that the open-source community can contribute to the connectors, and the platform vendor can ensure that those contributions are maintained and kept up-to-date.

The pluggable architecture is a great way to maintain a **community of contributors**, but it also comes with many tradeoffs:
- Are all plugins maintained in a monorepo or in separate repositories?
- How do you ensure that the plugins are kept up-to-date?
- How are plugins versioned?
- How does each plugin handle authentication and schema evolution?
- How can connectors be executed — only from a central platform or from anywhere?
- What programming languages are supported for writing plugins?
- How are plugins packaged and distributed? Are those built as binaries, `pip` packages, or as Docker images?

---

## The differences between open-source data ingestion tools

There are several significant differences between [Airbyte](https://airbyte.com/), [CloudQuery](https://www.cloudquery.io/) and [dltHub](https://dlthub.com/) based on how each tool approached those questions.

### Airbyte

[Airbyte](https://airbyte.com/) users can build [custom connectors](https://docs.airbyte.com/integrations/custom-connectors/) in many ways:
1. With an [SDK for your preferred programming language](https://docs.airbyte.com/connector-development/cdk-python/) that autogenerates up to 75% of connector code, based on provided API endpoints
2. With a [low-code connector builder UI](https://docs.airbyte.com/connector-development/config-based/low-code-cdk-overview)
3. Building a custom Docker image with connector code written in any language and adding the connector metadata from [the Airbyte UI](https://docs.airbyte.com/integrations/custom-connectors/#adding-your-connectors-in-the-ui).

Airbyte's connectors are packaged as Docker images and executed as Docker containers. Airbyte itself is versioned using [semantic versioning](https://semver.org/), and connectors are versioned based on the Docker image tag.
The connectors are maintained in a [monorepo](https://github.com/airbytehq/airbyte), and the Airbyte team is responsible for validating and merging all Pull Requests. However, note that you can build private custom connectors that don't have to be merged into the main platform. Contributing connectors to the community is encouraged but not required.

Airbyte's monorepo allows it to centrally govern the connectors and ensure that they follow standards and are kept up-to-date. One downside of this approach is that the connectors are tied to the platform — it's not possible to run Airbyte connectors independently. Also, installing Airbyte requires cloning a fairly large repository. You can't pick and choose only the plugins that you need (as [kestra](https://github.com/kestra-io/kestra) allows that) — in Airbyte, you install the product with all connectors baked in, which has its pros and cons.

**How does Airbyte monetize?** [Airbyte Cloud](https://airbyte.com/solutions/airbyte-cloud) is a managed ELT platform in the Cloud. Apart from that, Airbyte offers a self-managed Enterprise plan as well as [Powered by Airbyte](https://airbyte.com/solutions/powered-by-airbyte) solution.

::alert{type="info"}
To see how you can orchestrate Airbyte connectors with [kestra](https://github.com/kestra-io/kestra), check our [Airbyte blueprints](https://demo.kestra.io/ui/blueprints/community?page=1&q=airbyte) and [the following Airbyte documentation page](https://docs.airbyte.com/operator-guides/using-kestra-plugin/).
::

<video autoplay muted loop>
  <source src="/blogs/2023-10-11-why-ingestion-will-never-be-solved/airbyte_kestra.mp4" type="video/mp4">
</video>


Another distinction compared to [Singer](https://www.singer.io/) is that Airbyte is primarily designed to be used from the UI, not via code. One solution is using the [Terraform provider](https://airbyte.com/blog/everything-as-code-for-data-infrastructure-with-airbyte-and-kestra-terraform-providers).

This brings us to [CloudQuery](https://www.cloudquery.io/) and [dltHub](https://dlthub.com/) which are code-centric and intended to be used by developers.

### CloudQuery

[CloudQuery](https://github.com/cloudquery/cloudquery) is an open-source ELT framework for developers. Data ingestion syncs can be executed from the terminal independently of the platform. You can maintain source and destination configuration in individual YAML files, and run those connectors locally, on a remote server, Kubernetes, serverless function, or from [kestra](https://demo.kestra.io/ui/blueprints/community?q=cloudquery&page=1).

We'll discuss CloudQuery in more detail in another blog post. For now, make sure to check out our [CloudQuery plugin](https://github.com/kestra-io/plugin-cloudquery) and [blueprints](https://demo.kestra.io/ui/blueprints/community?q=cloudquery&page=1).

**How does CloudQuery monetize?** CloudQuery offers [premium connectors](https://www.cloudquery.io/integrations) for more advanced integrations, and there's also a plan for a [managed service](https://www.cloudquery.io/register-for-cloud) for running CloudQuery connectors in the cloud.


### dltHub

[dltHub](https://github.com/dlt-hub/dlt) is a fairly new open-source data integration library. Note that it's not a platform but a library that you can use to build your own platform. This offers an unmatched level of flexibility, but it also requires a little more work to figure out the right deployment patterns. As a Python library, you can use dlt anywhere you can use Python. You can run dlt integration jobs from your laptop, remote server, cloud function, or from [kestra](https://demo.kestra.io/ui/blueprints/community?q=dlt&page=1). dltHub connectors are distributed as extensions to the main dlt library.

One of the main selling points of dlt is that it's a lightweight Python-based framework, allowing you to create new connectors with automatic schema inference and schema evolution. You can transform your data along the way e.g. add a pseudomization step before loading data to the target destination. And there are custom decorators to configure incremental and merge loads in Python.

**How does dltHub monetize?** dlt plans to offer an [integration hub](https://dlthub.com/) that might resemble a connector marketplace and a managed service for data integration. The monetization model looks similar to the one of CloudQuery, but it's too early to tell how the two products will compare commercially.

::alert{type="info"}
To see end-to-end examples of orchestrating dlt data ingestion with Kestra, check our [dltHub blueprints](https://demo.kestra.io/ui/blueprints/community?q=dlt&page=1).
::

---

## Why data ingestion will never be fully solved and what you can do about it

As discussed before, data ingestion is a challenging and multifaceted problem. Even though the existing and emerging tools can save a lot of time, none of them alone will solve the problem at its core as it's driven by competing commercial interests between SaaS vendors and system integrators. SaaS vendors who publish their APIs are [not incentivized](https://matt-rickard.com/the-m-n-api-problem) to make this process easy for system integrators, as they would rather offer their own services to extract, analyze or integrate data for their customers. And when there's a need to introduce a breaking change to some APIs to gain a competitive edge, they'll likely do it without asking data integration vendors for permission.

It's possible that emerging AI-powered integration tools will provide a more scalable solution in the near future, at least for building the connectors. Until then, we shouldn't complain either. Integrating data and systems is not as difficult as it once was. We have more options than ever for nearly every use case and target audience. Kestra [partners with many of the tools](https://kestra.io/partners) mentioned in this post to streamline the orchestration of data ingestion pipelines for our users. It's encouraging to see how open-source communities continue to work together to solve that problem to the greatest extent possible by contributing and helping each other out. You, too, can join our [community](https://kestra.io/slack) and star us on [GitHub](https://github.com/kestra-io/kestra) to support the project.
