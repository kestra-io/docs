---
title: "Top 10 SQL Framework Alternative to dbt"
description: ""
date: 2024-03-15T18:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: /blogs/2024-03-15-top-10-sql-framework.png
---

Many discussions in data analytics assume everyone uses the ELT approach, with SQL transformations happening in the data warehouse. These discussions often favor dbt as the primary tool.

But, the reality is that many teams use different data stacks and tools. This blog post unpacks the various SQL frameworks, highlighting the trade-offs each method presents for different project requirements.

## dbt core
The most popular + why is the most popular and widely adopted
But it has shortcomings discussed in this post – Link to the dbt vs SQLMesh post

## 1) Airflow

- Before dbt, many data engineers used to template their SQL in Airflow DAG code.

Before the advent of dbt, many data engineers used to template their SQL queries in Airflow DAG code. In the end, dbt can be summarized as a framework to manage templated SQL queries. Using Jinja with Airflow dependencies management can be the great foundation of a SQL management platform.

- business logic vs orchestration logic

Still, this approach has one major flaw: it couples Airflow with your business logic. 

While it's possible to organize a repository with Airflow DAGs in one part and SQL queries in another, in-house tooling is often hard to manage in the long term. Onboarding new developers need dedicated training sessions and handling outlier cases often complicates the overall design, ending in over-engineering and shadow code routines.

Mixing business and orchestration logic is probably the last thing you want to do as a data engineer. Being conscious about it is a great skill to have and to foster within teams and projects. Also coupling your SQL queries to a specific orchestration engine can lock you in your own system. What if another team wants to automate their own SQL queries with another system?

SCREENSHOT AIRFLOW

## 2) Terraform

- IaC prominence
- screenshot example big query view


## 3) y42

- modern data stack (= analytics stack) orchestrator
- not OSS

## 4) SQLMesh

SQLMesh is a recent project aiming to emphasize better operations management. It shifts from dbt in that sense by bringing several improvements:
- Environment management
- Different user interfaces: a web UI and a CLI. Both are included in the open-source version.
- Native support for multiple repositories
- SQLMesh supports Jinja templating, it also lets the user extend the SQL language itself with native support for metaprogramming constructs that enable direct invocation of functions implemented in Python.

If you're looking to learn more about SQLmesh and the differences with dbt, check out our recent [deep-dive comparison between dbt and SQLMesh](https://kestra.io/blogs/2024-02-28-dbt-or-sqlmesh).

::div
<iframe width="700" height="400" src="https://www.youtube.com/embed/wTLoDq-SW-g?si=6gbmbLJV8j1L9LT0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
::


## 5) Dataform

- Mention OSS + GCP BQ version

## 6) Quarry

- build in Rust, but it's not where it shines (the bottleneck is ultimately on the warehouse)

## 7) lea

- most mature in-house

## 8) Malloy

- SQL has not been designed for analytics
- rectangular data
- BI as code

## 9) sdf

- https://www.sdf.com/pricing
- not OSS

## 10) yato

- lightweight / get things done
- embeddable
