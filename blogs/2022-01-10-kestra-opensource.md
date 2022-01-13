---
title: "Introducing Kestra first public release :tada:"
description: Today, our team is proud to announce a first public release of Kestra, an open-source platform to orchestrate & schedule any kinds of workflow at scale.
date: 2022-01-10
layout: BlogsPost
author:
  name: Ludovic Dehon
  image: "ldehon"
  twitter: "@tchiotludo"
---

Today, our team is proud to announce a first public release of Kestra, an open-source platform to orchestrate & schedule any kinds of workflow at scale.


## What is Kestra?
Kestra is :
- **an orchestrator**: Build complex pipeline in couple of minutes.
- **a scheduler**: Launch your flows whatever is your need!
- **a rich ui**: create, run & monitors all your flows with a realtime user interface.
- **a data orchestrator**: With his many plugins, build your data orchestration directly.
- **cloud native & scalable**: Scale to millions of executions without the pain.
- **an all-in-one platform**: No need to use many tools to deliver a complete pipeline.
- **a pluggable platform**: with a lots of plugins or build your own.

As you understand, Kestra will handle **all yours pipelines** !

## The history of Kestra!
Kestra started in 2019 with this [initial commit](https://github.com/kestra-io/kestra/commit/d57e30c0c0d450590a1eaac5df0e82e1ea94e562). At this time, Kestra was a proof of concept only.

<img src="./2022-01-10-kestra-opensource/initial-commit.jpg" class="rounded img-thumbnail float-left mr-4 mb-4" alt="Initial commit" style="max-width: 450px">


In order to have a little background, I worked for Leroy Merlin as consultant. We needed to find to build a new dataplatform from scratch and cloud based (destination: Google Cloud Platform mostly). We tried a [lot of things](/blogs/2022-01-10-leroy-merlin-usage-kestra) and failed with some. The **biggest failed was the orchestration** software that we tried to deliver with Apache Airflow: a lot of instability (tasks that failed only due to airflow scheduler), performance issue (unable to handle a light workload), and a lot of lack of features (scaling, data processing, ...). After many tests (Google Composer, Open source Airflow on Kubernetes, ...), the decision was acted : **Airflow was rejected by Leroy Merlin**.

<div class="clearfix" />

I do some research on the orchestrator ecosystem, most are **proprietary & license based** (far from my mindset), some are open source (at this time, only Apache Airflow to be exact seems to be active and is rejected). Really surprised of this discovery and some challenge from a co-worker :
> If you think Airflow is bad, do better!

It was decided, I'll do a proof of concept. It took a lot of time to build this kind of software, and the task seems to be never-ending, but I continue to work on it during months :
- Choosing [Kafka as database & queue](https://github.com/kestra-io/kestra/commit/b4d026574c2fb141a3c7dd5b7f1481a31063acb2)
- Implement a [storage](https://github.com/kestra-io/kestra/commit/bcc5798d7fdcbe3afe95c019c41ddc546b24f62d) for task processing
- Choosing [ElasticSearch as repository for UI](https://github.com/kestra-io/kestra/commit/2ede1e692be50999bc16f011f6a4796ffbbb9e1a)
- Add some dynamic templating with [HandleBar](https://github.com/kestra-io/kestra/commit/05f1e20a3cb1e9a623024f5674144b3934cd5874) and changing it later to Peeble
- Start some [Google Cloud](https://github.com/kestra-io/kestra/commit/14e3384be2144a2bf6698439b5ae22106ac83914) plugins
- Introduce [the UI](https://github.com/kestra-io/kestra/commit/1fef7509bb2d04b24bf66fce19b35dd01411a1db) build with [Vue.js](https://vuejs.org/)

And so on !

During the last 30 months, I built a lot of features, a lot of plugins, lots of bug fix, mostly the night (still working as full time consultant for Leroy Merlin). It took a lot of efforts, investments and a lot of time that I could have spent with my family.

But now, We are really proud of the work done!

## Kestra is Open Source!
I'm a true guys of open source. As an architect, I almost choose Open Source solution for my last 20 years in IT. I started as a consumer of open source (using without any contributions like most of the users). It's time now to give by myself with a permissive [Apache License](https://github.com/kestra-io/kestra/blob/develop/LICENSE).

I also started more than 3 years ago also another Open source project [AKHQ](https://github.com/tchiotludo/akhq) with the same license. Dealing with this project that have a lot of success and adoption help me to learn how to build a community around a project. I've also learnt that open source don't pay yours bills. Even if AKHQ ask me a lot of invest, Kestra ask me lot's more and will need more in the future! Based on this conclusion, you need to find a proper way to be able to continue the work on this project, so we decided to create a company around Kestra in order to fund and support the open source software.

The Open Source license is not limited and allow you to install and run it as you want on your server on premise or your cloud. And we have also built on **Enterprise Edition** that will fill the gap for the company brings security and productivity around your Kestra clusters. We also plan to deliver Kestra as Software as Service in a near future. Want more information, don't hesitate to [contact us](/company/contact)


## Kestra plugins are also Open Source!
As we know, the real challenge are also the connectors (what we call plugins) in order to have a deep integrations with all the tools/database you are using. Most orchestrators (even proprietary and licensed based) only talk bash or cmd. You have to deal all your need with simple command often leading to use another tools to have access to underlying resource (like talend, ...). With Kestra, we want to have a deep integration with your tools and let [bash](/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Bash) task only the edge case a plugin can't cover.

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

Kestra avoid all the burden (installing the software on the system, handle dependencies and conflict, python version, ...) and just install a plugin (a simple jar) and speak directly with your database.

We already have [lots of plugins](/plugins/) and you can [easily develop yours](/docs/plugin-developer-guide/). We also hope that a community will help us to maintain new plugins / connectors. [contact us](/company/contact) if you need some help;.

## First public release but Production Ready!
First public release don't mean that Kestra is not production ready. In fact, it was **used in production since August 2020 at Leroy Merlin**, take a deeper look at the [case study](/blogs/2022-01-10-leroy-merlin-usage-kestra) if you want, but if you prefer few numbers :
- **4 clusters** for every environment
- **200+ users / developers** using it
- **2000+ flows** in production
- **350,000 executions** every month
- **3,000,000 tasks** every month
- **1,500 days of executions** every month (yeah, 50 days of executions every single day)

So your next question is : **why are you waiting so long for the first public release ?**

The answer is simple, we want to deliver the first impression as best as possible and this lead to a lot of works: missing features, missing plugins, new ui design, polish of documentation and website ... And now we are proud enough to show the world our work.

The road is not finish, we have still a lot to do, stay tuned for the roadmap !


