---
title: "Introducing Kestra first public release :tada:"
description: Today, our team is proud to announce a first public release of Kestra — an open-source platform to orchestrate and schedule any kind of workflow at scale.
date: 2022-02-01T10:00:00
category: News & Products Updates
author:
  name: Ludovic Dehon
  image: "ldehon"
  twitter: "@tchiotludo"
image: /blogs/2022-02-01-kestra-opensource.jpg
---

Today, our team is proud to announce a first public release of Kestra, an open-source platform to orchestrate & schedule any kinds of workflow at scale.


## What is Kestra?
Kestra is:
- **an orchestrator**: Build a complex pipeline in couple of minutes.
- **a scheduler**: Launch your flows whatever your need!
- **a rich ui**: Create, run, and monitor all your flows with a real-time user interface.
- **a data orchestrator**: With its many plugins, build your data orchestration directly.
- **cloud native & scalable**: Scale to millions of executions without stress or hassle.
- **an all-in-one platform**: No need to use multiple tools to deliver a complete pipeline.
- **a pluggable platform** with the option to choose from several plugins or to build your own.

As you can see, Kestra will handle **all your pipelines** !

## The History of Kestra!
Kestra started in 2019 with this [initial commit](https://github.com/kestra-io/kestra/commit/d57e30c0c0d450590a1eaac5df0e82e1ea94e562). At this time, Kestra was at the proof-of-concept stage.

![Initial commit](/blogs/2022-02-01-kestra-opensource/initial-commit.jpg)


To provide a bit of a background: I was working for Leroy Merlin as a consultant. We needed to build a new cloud-based data platform from scratch (destination: mostly Google Cloud Platform). We tried a [lot of things](../blogs/2022-02-22-leroy-merlin-usage-kestra) and failed with some of our attempts. The **biggest setback was the orchestration** software that we tried to deliver with Apache Airflow: a lot of instability (tasks that failed simply due to the Airflow scheduler), performance issues (unable to handle a light workload), and a lack of features (scaling, data processing). After many tests (Google Composer, Open source Airflow on Kubernetes), the decision was final: **Airflow was rejected by Leroy Merlin**.

I did some research on the orchestrator ecosystem; most are **proprietary and license based** (far from my mindset), some are open source (at this time, only Apache Airflow seemed to be active — and it was rejected). I was really surprised by this discovery and faced this challenge from a co-worker:
> If you think Airflow is bad, do better!

It was decided: I set myself the task of producing a proof of concept for our own open-source workflow management system. It took a lot of time to build this software, and the task seemed to be never ending; but I continued to work on it for several months by:
- Choosing [Kafka as database and queue](https://github.com/kestra-io/kestra/commit/b4d026574c2fb141a3c7dd5b7f1481a31063acb2)
- Implementing [storage](https://github.com/kestra-io/kestra/commit/bcc5798d7fdcbe3afe95c019c41ddc546b24f62d) for task processing
- Choosing [ElasticSearch as a repository for UI](https://github.com/kestra-io/kestra/commit/2ede1e692be50999bc16f011f6a4796ffbbb9e1a)
- Adding some dynamic templating with [HandleBar](https://github.com/kestra-io/kestra/commit/05f1e20a3cb1e9a623024f5674144b3934cd5874) and changing it later to Peeble
- Starting some [Google Cloud](https://github.com/kestra-io/kestra/commit/14e3384be2144a2bf6698439b5ae22106ac83914) plugins
- Introducing [the UI](https://github.com/kestra-io/kestra/commit/1fef7509bb2d04b24bf66fce19b35dd01411a1db) — built with [Vue.js](https://vuejs.org/)

And so on !

During a thirty-month period I built a variety of features, numerous plugins, and countless bug fixes — mostly during the night as I was still working as a full-time consultant for Leroy Merlin. It took a lot of effort, investment, and time that I could have spent with my family.

But now we are really proud of what we’ve achieved!

## Kestra is Open Source!
I'm a real open-source enthusiast. As an architect, I’ve been interested in open source solutions in IT for twenty years. I started as an open source consumer (using it without adding contributions, as is the case with most users). I then decided that the time was right to start out with the permissive [Apache License](https://github.com/kestra-io/kestra/blob/develop/LICENSE).

Three years ago, I started another open source project, [AKHQ](https://github.com/tchiotludo/akhq), with the same license. Working with a successful project was an invaluable experience for me as I was able to learn how to build a community around a project. I've also learnt that an open source system won't pay the bills on its own. AKHQ required a lot of personal investment; Kestra has required a lot more and will continue to do so in the future! This means you will have to ensure that you have the financial resources in place to enable your project to be viable and sustainable — we decided to create a company alongside Kestra in order to raise the required funds to support the development of the open source software.

The open source license is not limited and allows you to install and run it as you want on your server on premise or your cloud. We have also built our **Enterprise Edition**, bringing added security and high availability to your Kestra clusters. In addition, we plan to deliver Kestra in the form of software as a service in the near future (don't hesitate to [contact us](/contact-us) for more information).


## Kestra Plugins are also Open Source!
When implementing the deep integration of the tools and databases you are using, the connectors (what we call “plugins”) can present the biggest challenge. Most orchestrators (even proprietary and licensed based) only talk bash or cmd. You have to manage all of your needs with simple commands, often requiring you to use another tool in order to have access to the underlying resource (such as Talend). With Kestra, we want to have a deep integration with your tools and let [bash](../plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Bash.md) deal solely with edge cases a plugin can't cover.

An example for a query to Google BigQuery:

> with Bash
```shell
DATE=$(date --iso-8601=seconds)
bq --format=json query 'SELECT name FROM \`project.dataset.table\` WHERE shippedDate=${DATE} AND shippedCountry = \'FR\'' > /tmp/query.json
jq -r '.name' /tmp/query.json
```

> with Kestra
```yaml
- id: query
  type: io.kestra.plugin.gcp.bigquery.Query
  fetchOne: true
  sql: |
    SELECT name
    FROM `kestra-prd.demo.salesOrder` AS s
    WHERE shippedDate = '{{ now() }}'
    AND shippedCountry = 'FR'
- id: "return"
  type: "io.kestra.core.tasks.debugs.Return"
  format: "{{ outputs.query.row.name }}"
```

Kestra avoids the rigmarole of installing the software on the system, handling dependencies and conflicts, dealing with Python, etc. — just install a plugin (a simple jar) and speak directly with your database.

We have a [number of plugins](../plugins/index.md) and the process of [developing your own](../docs/10.plugin-developer-guide/index.md) is very simple. We also hope that a community will help us to maintain new plugins/connectors ([contact us](/contact-us) if you require help or support).

## First Public Release *and* Production Ready!
First public release doesn't mean that Kestra is not production ready. In fact, it has been **used in production since August 2020 at Leroy Merlin** — take a deeper look at the [case study](../blogs/2022-02-22-leroy-merlin-usage-kestra.md) if you want more detail. Here are some figures to give a picture of Kestra’s credentials:
- **4 clusters** one for every environment
- **200+ users/developers**
- **2000+ flows** in production
- **350,000 executions** every month
- **3,000,000 tasks** every month
- **Equivalent of 1,500 days of task processing time** every month (yeah, that’s the equivalent of fifty days of task processing every single day)

So, your next question is: **why are you waiting so long for the first public release?**

The answer is simple: we want to deliver the first impression as best as possible and this led to a lot of work: missing features, missing plugins, new UI design, polish of documentation and website. Now we are proud and confident enough in our product to display the result of our labor.

The road is not finished; we still have a lot to do. Stay tuned for the journey.

