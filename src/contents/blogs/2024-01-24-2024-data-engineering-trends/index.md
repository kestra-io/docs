---
title: "2024 Data Engineering Trends"
description: "Data engineering trends we see in 2024 and the impact of AI on data tooling and data job market"
date: 2024-01-24T16:00:00
category: Solutions
author:
  name: Anna Geller
  image: "ageller"
image: ./main.png
---

This blog post highlights the key trends we see in data engineering in 2024 and how those trends affect data teams.

## Doing More with Less

The tech industry in 2024 is under pressure to optimize resources. Technology and data leaders are asked to integrate more data to support new AI-driven features while simultaneously being forced to reduce costs and headcount. Judging by the recent layoffs at a.o. Google, Amazon, Meta, Twitch, Spotify, and Discord, even the largest tech companies are not immune to this trend toward increased efficiency.

### The Impact of AI on Layoffs vs. Economic Factors

The growing capabilities of LLMs are reshaping the job market, and the data space is no exception. While it’s difficult to estimate to what extent AI progress has contributed to the growing waves of tech layoffs, many companies are cutting costs in their established lines of business and reallocating that budget toward AI development. Dropbox reduced its headcount by 16% last year and reallocated those resources toward hiring AI specialists in order to [“stay competitive”](https://blog.dropbox.com/topics/company/a-message-from-drew).

Economic factors such as a slowdown in VC funding and some (late) post-pandemic adjustments also play a role in the headcount decisions.

### Implications for Data Engineering

As organizations seek to do more with less, there’s a growing demand for generalists proficient in cloud-native technologies, data, AI, and platform engineering. This shift is steering the field away from highly specialized roles, such as ETL or BI engineers, in favor of a broader range of engineering skills. Data engineering teams in 2024 start resembling software engineering teams. This happens partially thanks to the growing maturity of data engineering as a discipline and partially out of necessity: data teams are expected to deliver more with less, and this requires building data products faster, often in smaller teams than before.

On the other hand, software engineers working on AI-driven features or data products start taking over many data engineering tasks, such as data cleaning, validation, and governance, because the quality of AI-based products depends on the quality of the underlying data. Tuning an LLM on bad data won’t lead to good outcomes for the business, regardless of how many GPUs we throw at it. You may notice that the boundaries between what software and data teams do are getting blurry in 2024.

:::alert{type="info"}
It’s worth noting that even though there is a growing trend towards smaller data teams and more versatile skill sets, larger organizations will continue to look for specialists in data modeling, engineering, analytics, ML, and AI. Both generalists and specialists have their place, even in the AI era.
:::

## Data Teams as Profit Centers

Seeing the previous section may give you a feeling that things are just getting worse for data engineers. The upside is that LLMs are creating new opportunities for data teams to graduate from cost centers to profit centers. Companies are actively using data and AI to expand their product offerings and create new revenue streams. Many data teams that used to be seen as cost centers are now becoming profit centers by operationalizing RAG pipelines and building revenue-generating products.

## Job Titles Will Become Even More Confusing

Job titles in the data field will remain confusing. As mentioned before, *software* *engineers* are increasingly involved in building AI-enhanced products, and *data* *engineers* are moving closer in the direction of *software* and *platform engineering*.

There’s also a growing number of *product engineer* positions, which are *software engineers* responsible for managing the entire *product* lifecycle, from managing backlog to development and maintenance. A similar trend can be observed in *marketing* roles in tech, where many companies require familiarity with Python and SQL from candidates. Such hybrid roles combining product/marketing and engineering will likely continue to grow in popularity as coding tasks become more accessible to less technical users with tools such as ChatGPt, GitHub Copilot, and [Kestra](/). If you like fancy terms, you can call that trend a *democratization* of data, analytics, and engineering practices as a self-service.

Another hybrid role growing in popularity is *AI engineer*, which bridges the gap between AI and software. As companies are looking for professionals who can build AI-driven products and platforms, we anticipate more hybrid roles and titles in 2024.

## AI-Augmented Development

GitHub Copilot has become an everyday companion for data engineers following its earlier adoption by software engineers. A lot of Python code, unit tests, Terraform configurations, and SQL queries are now auto-generated or cowritten by Copilot, and this trend will continue to grow in 2024 and beyond.

## AI in BI

The majority of BI tools in 2024 are (*or soon will be*) capable of generating fully functioning SQL queries based on user input in plain English. The same BI tools can generate documentation for data models, suggest fixes to syntax issues, and even generate charts and dashboards based on a prompt.

Some speculate that traditional BI dashboards will be fully replaced by AI-generated dashboards. While this is *technically* feasible, for now, we see a more gradual shift towards AI-augmented BI. AI can help answer many business questions and generate useful dashboards, but the results of those need to be validated and adjusted by humans, who will continue to be responsible for ensuring that the presented numbers are correct. In the end, if humans can’t agree on how certain KPIs should be calculated, how can we expect AI to do it correctly for us? This is why the semantic layer remains a growing trend in 2024 and beyond.

## Platform Engineering and DevOps in Data

The term ‘DataOps’ has been diluted by vendors (*we’re guilty of that, too*), but its essence remains: data engineers are transitioning into platform engineers. Proficiency in Docker, Kubernetes, Git, Terraform, Cloud infrastructure, and the ability to build cost-effective queries and microservices are becoming more sought-after than expertise in distributed batch ETL jobs. This shift results from the need to move fast in AI and cloud environments, leading to the rise of new, LLM-friendlier data stacks.

## Increased Demand for Data Lakehouses

Budget constraints are making data lakehouses attractive compared to cloud data warehouses. Lakehouse architectures provide a simple and affordable data storage solution. The new [S3 Express One Zone Storage Class](https://aws.amazon.com/s3/storage-classes/express-one-zone/), the [flexibility of DuckDB](../2023-07-28-duckdb-vs-motherduck/index.md), the ability to [lazily process dataframes in Polars](../2023-08-11-dataframes), the growing adoption of [Apache Iceberg](../2023-08-05-iceberg-for-aws-users/index.md), and the significantly simplified event-driven orchestration capabilities enabled by tools such as [Kestra](https://github.com/kestra-io/kestra/index.md) enable high-throughput data processing over data stored in the lakehouse.

## Commercial vs. Open Source Battles among LLMs and Data Tools

While open-source LLMs continue to improve and gain popularity, more mature AI applications are being built on top of platforms such as OpenAI, largely for compliance reasons. Both open-source and commercial LLMs are estimated to continue to grow in demand in 2024. Open-source LLMs are improving at a rapid pace, and commercial LLMs are becoming more affordable — partially as a result of the increased competition from open-source alternatives.

Data tools face similar challenges of balancing open-source and commercial offerings. Tools like [Snowplow](https://snowplow.io/blog/introducing-snowplow-limited-use-license/) and [Terraform](https://www.hashicorp.com/blog/hashicorp-adopts-business-source-license) adjusted their licenses and operating models to focus on serving enterprise clients and generating revenue.

In short, the highly competitive landscape in 2024 is forcing many commercial open-source companies to change their licenses, [pivot](https://meltano.com/blog/were-bringing-powerful-data-engineering-capabilities-to-software-teams-with-arch/) or [rebrand](https://about.gitlab.com/) towards AI, [get acquired](https://ponder.io/), or [shut down](https://github.com/orchest/orchest).

## Event-Driven Systems Become the Norm in Data Engineering in 2024

Real-time data processing has been rising for the past couple of years. AI progress further accelerates this trend, as AI applications need to take action in real-time. When you are using a SaaS product powered by LLM (even a chatbot), you would expect to get an accurate response in (near) real-time. Imagine booking a hotel via a cool new AI gadget such as [Rabbit R1](https://www.rabbit.tech/) only to find out that this hotel was booked out before your order was placed. User-facing products require fast and accurate data processing. This is leading to a shift towards API-first event-driven architectures such as [Kestra](https://github.com/kestra-io/kestra), where every system or application can be both a data producer and consumer.

## More Data Teams Will Adopt GitOps

As data, software, and platform engineering are converging, GitOps is becoming more popular in data engineering in 2024. Data teams are expected to ship faster and with fewer resources. The improved Git integrations (such as [Kestra’s Git sync](../../docs/version-control-cicd/04.git/index.md)) make it easier to track changes in data pipelines and their underlying cloud infrastructure, and to collaborate more effectively through pull requests and code reviews.

## What’s Next

In summary, the most important data engineering trends in 2024 are an accelerated integration of AI into data products, a shift toward platform engineering, and an increased focus on efficiency. As a result, we see the growing importance of diversified skills, data lakehouses, open table formats, event-driven systems, AI-augmented development, and the need to better balance open-source with commercial incentives to stay competitive.

Do you agree with these trends? What do you think are the most important data engineering trends in 2024? Let us know via [Slack](/slack). If you want to learn more about Kestra, check out our [documentation](/docs) or [request a demo](/demo), and if you like the project, become our next star on [GitHub](https://github.com/kestra-io/kestra).