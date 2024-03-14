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

X The most popular + why is the most popular and widely adopted
X But it has shortcomings discussed in this post – Link to the dbt vs SQLMesh post

## 1) Airflow

- Before dbt, many data engineers used to template their SQL in Airflow DAG code.

Before the advent of dbt, many data engineers used to template their SQL queries in Airflow DAG code. In the end, dbt can be summarized as a framework to manage templated SQL queries. Using Jinja with Airflow dependencies management can be the great foundation of a SQL management platform.

- business logic vs orchestration logic

Still, this approach has one major flaw: it couples Airflow with your business logic. 

While it's possible to organize a repository with Airflow DAGs in one part and SQL queries in another, in-house tooling is often hard to manage in the long term. Onboarding new developers need dedicated training sessions and handling outlier cases often complicates the overall design, ending in over-engineering and shadow code routines.

Mixing business and orchestration logic is probably the last thing you want to do as a data engineer. Being conscious about it is a great skill to have and to foster within teams and projects. Also coupling your SQL queries to a specific orchestration engine can lock you in your own system. What if another team wants to automate their own SQL queries with another system?

SCREENSHOT AIRFLOW

## 2) Terraform

Cloud infrastructure management has undergone a revolution with Infrastructure as Code (IaC) becoming the go-to approach. Tools like [Terraform](https://kestra.io/blogs/2023-09-19-kestra-terraform-partnership), with its single language (HCL), dependency management, and modular design, allow seamless configuration of diverse resources. Teams can collaborate effortlessly across different resources thanks to Terraform's providers and the unified declarative syntax, streamlining workflows for various infrastructure needs.

Declaring queries with Terraform resources is often something overlooked. But if your modeling is simple enough, using only [resources like google_bigquery_table with Terraform](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/bigquery_table) to build views on top of raw data can be a very lightweight solution.

```hcl
resource "google_bigquery_table" "dwh_organizations" {
  project = data.google_project.prd.project_id
  dataset_id = google_bigquery_dataset.dwh.dataset_id
  table_id = "organizations"
  deletion_protection = false

  view {
    query = templatefile("bigquery/dwh/simple_select.sql", {
      project = google_bigquery_dataset.ods.project
      dataset = google_bigquery_dataset.ods.dataset_id
      table = "organizations"
    })
    use_legacy_sql = false
  }
}
```
While Terraform might not be ideal for scenarios requiring complex incremental strategies, diverse materialization methods, or when data analysts lack familiarity with the tool, it excels in managing simpler pipelines. 

For instance, platform or data engineers often used to Terraform can effectively orchestrate their daily FinOps analytics pipelines this way.


## 3) y42


While dbt can be seen as a point solution for the T in ELT, an analytics stack often starts with data extraction processes. Therefore, it's important to be able to orchestrate these two concepts together.

Y42 helps here with built-in ingestion capabilities allowing to orchestrate all steps together. From Airbyte, Fivetran dbt models and Python scripts, Y42 makes it possible to build a lightweight "Extract-Load" pattern with enhanced monitoring, isolated branch environments and automated deployments.

While it's not an open-source tool, Y42 can be a good alternative to dbt Cloud offering. [Check out their comparison](https://www.y42.com/compare/y42-vs-dbt-cloud) with the latter in a dedicated blog post.

Y42 can still be limiting for teams looking for a full control plane. Orchestrating custom containers or handling complex dependencies management is not the goal of Y42: it's more about streamlining a sequential extract-load process for data analytics purposes.

IMAGE: https://www.y42.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhome-page-hero-img.dfe545ec.webp&w=1920&q=75


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

Started as an open-source project, [Dataform](https://github.com/dataform-co/dataform) has been designed as a meta-language to create SQL tables and workflows in BigQuery. It has been [fully integrated by Google in late 2020](https://cloud.google.com/blog/products/data-analytics/welcoming-dataform-to-bigquery?hl=en)

One big difference with dbt is that Dataform uses JavaScript as its scripting language whilst dbt opts for Jinja.

Provides a full web interface within Google Cloud Console, perfect for quick starts within that ecosystem but less flexible for external tools.

Dataform can be used for free (costs being downstreamed on BigQuery compute) and is a nice fit for teams already tightened to Google Cloud services.

It's better to compare it with dbt Cloud offering as it's a fully managed solution. However, it didn't have the community size as dbt and support will mostly come from Google teams.


IMAGE: https://storage.googleapis.com/gweb-cloudblog-publish/images/1_dataform_diagram.max-2200x2200.jpg


## 6) Quarry

Put simply [Quary](https://www.quary.dev/) is dbt developed in Rust.

Why Rust? After all in analytics the most compute-intensive bottleneck, the data transformation, is done on the database, not by the actual SQL Framework.

Quary [answers this question](https://www.quary.dev/blog/why-rust) by taking a step back:

>There are many other steps to getting a data insight that are equally, if not more, time-consuming. Here are a few examples: deciding the initial requirements, finding the right tool, security reviews, setting up environments, reviewing the code that defines the data transformation layer, data quality spot checks, updating data catalogs, waiting for merges to build reports, internal marketing for that data asset... the list goes on.

If you have several CI/CD pipelines or unit tests taking more and more time to run due to Python engine, switching to a more optimized SQL framework base on Rust can be a nice choice to streamline and get things done faster.

Check out [Quary GitHub repository](https://github.com/quarylabs/quary) and [documentation](https://www.quary.dev/docs) for more details on the solution

## 7) lea

Crafted in-house by the data experts at [Carbonfact](https://www.carbonfact.com/), [Lea](https://github.com/carbonfact/lea)is intentionally a simple and opinionated solution prioritizing ease of use while still offering room for customization.  At Carbonfact, Lea is their go-to tool for managing their data warehouse, and it currently integrates seamlessly with [BigQuery](https://cloud.google.com/bigquery) and [DuckDB](https://duckdb.org/). 

If you're looking for a lightweight alternative to established options like dbt, SQLMesh, or Dataform, Lea is definitely worth considering.


## 8) Malloy

While Malloy isn't a traditional SQL framework, it offers functionalities that might be of interest in this context. 

Malloy made the realization that [thinking in a "rectangle"](https://lloydtabb.substack.com/p/data-is-rectangular-and-other-limiting) isn't practical when doing data analysis. We often need to compute nested fields or filtering on top of complex aggregation. It's somehow the realization that [SQL has not been designed for analytics](https://medium.pimpaudben.fr/sql-is-not-designed-for-analytics-079fc97b139c).

Malloy answers these issues with a new syntax built on top of SQL. It allows better nesting and filtering without the overhead of complex SQL queries. It also comes with [data vizualisation annotation capabilities](https://docs.malloydata.dev/blog/2024-02-29-hierarchical-viz/), making it a great choice to build "BI as code" pattern.

Check out [Malloy website](https://www.malloydata.dev/) and [documentation](https://docs.malloydata.dev/documentation/) to learn about this promising language.


## 9) sdf

X https://www.sdf.com/pricing
X not OSS

## 10) yato

A newcomer to the scene, [Yato](https://github.com/Bl3f/yato) stands out as possibly the most lightweight SQL framework available. Designed for simplicity and speed, Yato takes a folder containing your SQL queries (or even Python transformations) and automatically determines the dependency order.

This eliminates the need for complex configuration, letting you focus on writing your data manipulation logic.  Yato excels when used alongside [dlt, a data-loading tool. Together, this duo streamlines your data workflow by handling both data acquisition and transformation. It can be quite useful for simple projects and fast experimentation.


## SQL Framework + Kestra = Complete Holistic Stack

X Orchestrate dbt, SQLMesh, Malloy
X Orchestrate any CLI based tool
X Manage your business logic with Git (GitOps)


## Conclusion

X choosing tool it depends of your level of maturity/complexity
X Kestra allows to orchestrate any of these tools
X Kestra links