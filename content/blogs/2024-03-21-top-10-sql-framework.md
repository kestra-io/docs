---
title: "Top 10 Alternative to dbt"
description: ""
date: 2024-03-21T17:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: /blogs/2024-03-21-top-10-sql-framework.png
---

When discussing how to process data using SQL transformation happening in the data warehouse, we directly think of dbt as the primary tool to use. 

For several years, dbt has established itself as a leader in the field, offering a user-friendly and efficient way to build data pipelines. However the data engineering landscape is constantly evolving, and new options are emerging to meet the ever-growing needs of modern data teams.

This post delves into 10 alternatives to dbt, each catering to specific requirements and workflows. Whether you're an experimented data engineer or just starting your journey, exploring these options can equip you with the right tools to transform your data efficiently. We'll explore the unique strengths of each alternative, along with considerations to help you connect them with other tools and dependencies.

## dbt core

[dbt](https://www.getdbt.com/) is the most popular SQL framework in the data industry.  Its reach extends across companies of all sizes, fostering a thriving community around it. 

Pioneering the concept of a full-fledged SQL framework, dbt empowers users to construct intricate model dependencies and efficiently test their SQL queries using a straightforward YAML declaration syntax. This combination of functionality and ease of use has cemented dbt's position as a leader in data transformation.

While dbt excels in many areas, there's room for improvement when handling large-scale projects.  The current approach of using "refs" to define model dependencies can be limiting, and backfilling capabilities could benefit from further refinement.
Also, recent developments including discussions around dbt Cloud and its pricing structure, have prompted some users to re-evaluate their commitment to dbt.


## 1) Airflow

Before the advent of dbt, many data engineers used to template their SQL queries in Airflow DAG code. 
In the end, dbt can be summarized as a framework to manage templated SQL queries, and using Jinja with Airflow dependencies management can be the great foundation of a SQL management platform.

Still, this approach has one major flaw: it couples Airflow with your business logic. 

While it's possible to organize a repository with Airflow DAGs in one part and SQL queries in another, in-house tooling is often hard to manage in the long term. Onboarding new developers need dedicated training sessions and handling outlier cases often complicates the overall design, ending in over-engineering and shadow routines.

Mixing business and orchestration logic is probably the last thing you want to do as a data engineer. Being conscious about it is a great skill to have and to foster within teams and projects. Also coupling your SQL queries to a specific orchestration engine can lock you in your own system. What if another team wants to automate their own SQL queries with another system?

## 2) SQLMesh

[SQLMesh](https://sqlmesh.com/) is a recent project aiming to emphasize better operations management. It shifts from dbt in that sense by bringing several improvements:

- Semantic Understanding: SQLMesh goes beyond simple syntax checking. It understands the meaning of your SQL code, allowing for early detection of errors like incorrect column references.

- Column-Level Lineage: Track how data flows through your models at a granular level. This helps you understand how changes in one model impact downstream models.

- Automatic Data Contracts: SQLMesh automatically validates changes to your models and identifies their impact on downstream data consumers. It can even handle backfilling data when necessary.

- Transpilation: Write SQL in your preferred dialect and let SQLMesh translate it to the target database system's dialect. This removes dialect-specific limitations and ensures code compatibility.

- Virtual Data Environments: Work on models in isolated environments without affecting collaborators. SQLMesh tracks all versions and simplifies merging changes to production.

- Easy Rollbacks: Version control allows you to easily revert to previous versions of your models if needed. This saves time and avoids production issues.

These features empower data teams to build accurate and efficient data pipelines. SQLMesh offers these functionalities out-of-the-box, eliminating the need for complex setup or additional costs as your team scales.


If you're looking to learn more about SQLmesh and the differences with dbt, check out our recent [deep-dive comparison between dbt and SQLMesh](https://kestra.io/blogs/2024-02-28-dbt-or-sqlmesh).

::div
<iframe width="700" height="400" src="https://www.youtube.com/embed/wTLoDq-SW-g?si=6gbmbLJV8j1L9LT0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
::


## 3) y42

While dbt can be seen as a point solution for the T in ELT, an analytics stack often starts with data extraction processes. Therefore, it's important to be able to orchestrate these two concepts together.

[Y42](https://www.y42.com/) helps here with built-in ingestion capabilities allowing to orchestrate all steps together. From Airbyte, Fivetran dbt models and Python scripts, Y42 makes it possible to build a lightweight "Extract-Load" pattern with enhanced monitoring, isolated branch environments and automated deployments.

While it's not an open-source tool, Y42 can be a good alternative to dbt Cloud offering. [Check out their comparison](https://www.y42.com/compare/y42-vs-dbt-cloud) with the latter in a dedicated blog post.

Y42 can still be limiting for teams looking for a full control plane. Orchestrating custom containers or handling complex dependencies management is not the goal of Y42: it's more about streamlining a sequential extract-load process for data analytics purposes.

IMAGE: https://www.y42.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhome-page-hero-img.dfe545ec.webp&w=1920&q=75


## 4) Dataform

Started as an open-source project, [Dataform](https://github.com/dataform-co/dataform) has been designed as a meta-language to create SQL tables and workflows in BigQuery. It has been [fully integrated by Google in late 2020](https://cloud.google.com/blog/products/data-analytics/welcoming-dataform-to-bigquery?hl=en)

One big difference with dbt is that Dataform uses JavaScript as its scripting language while dbt opts for Jinja.

It provides a full web interface within Google Cloud Console, perfect for quick starts within that ecosystem but less flexible for external tools. Dataform can be used for free (costs being downstreamed on BigQuery compute) and is a nice fit for teams already tightened to Google Cloud services.

It's better to compare it with dbt Cloud offering as it's a fully managed solution. However, it didn't have the community size as dbt and support will mostly come from Google teams.


IMAGE: https://storage.googleapis.com/gweb-cloudblog-publish/images/1_dataform_diagram.max-2200x2200.jpg


## 5) Quary

Put simply [Quary](https://www.quary.dev/) is dbt developed in Rust.

Why Rust? After all in analytics the most compute-intensive bottleneck, the data transformation, is done on the database, not by the actual SQL Framework.

Quary [answers this question](https://www.quary.dev/blog/why-rust) by taking a step back:

>There are many other steps to getting a data insight that are equally, if not more, time-consuming. Here are a few examples: deciding the initial requirements, finding the right tool, security reviews, setting up environments, reviewing the code that defines the data transformation layer, data quality spot checks, updating data catalogs, waiting for merges to build reports, internal marketing for that data asset... the list goes on.

If you have several CI/CD pipelines or unit tests taking more and more time to run due to the Python engine, switching to a more optimized SQL framework based on Rust can be a nice choice to streamline and get things done faster.

Check out [Quary GitHub repository](https://github.com/quarylabs/quary) and [documentation](https://www.quary.dev/docs) for more details on the solution

## 6) lea

Crafted in-house by the data experts at [Carbonfact](https://www.carbonfact.com/), [Lea](https://github.com/carbonfact/lea)is intentionally a simple and opinionated solution prioritizing ease of use while still offering room for customization.  At Carbonfact, Lea is their go-to tool for managing their data warehouse, and it currently integrates seamlessly with [BigQuery](https://cloud.google.com/bigquery) and [DuckDB](https://duckdb.org/). 

If you're looking for a lightweight alternative to established options like dbt, SQLMesh, or Dataform, Lea is definitely worth considering.


## 7) Malloy

While Malloy isn't a traditional SQL framework, it offers functionalities that might be of interest in this context. 

Malloy made the realization that [thinking in a "rectangle"](https://lloydtabb.substack.com/p/data-is-rectangular-and-other-limiting) isn't practical when doing data analysis. We often need to compute nested fields or filtering on top of complex aggregation. It's somehow the realization that [SQL has not been designed for analytics](https://medium.pimpaudben.fr/sql-is-not-designed-for-analytics-079fc97b139c).

Malloy answers these issues with a new syntax built on top of SQL. It allows better nesting and filtering without the overhead of complex SQL queries. It also comes with [data vizualisation annotation capabilities](https://docs.malloydata.dev/blog/2024-02-29-hierarchical-viz/), making it a great choice to build "BI as code" pattern.

Check out [Malloy website](https://www.malloydata.dev/) and [documentation](https://docs.malloydata.dev/documentation/) to learn about this promising language.


## 8) SDF

In essence, [SDF](https://www.sdf.com/) acts as a translator and organizer for your SQL code. It uses in-depth analysis to understand your code and creates a detailed map of how different parts of your data interact. This map makes it easier to identify potential issues and areas for improvement.

One of SDF's strengths is the ability to add labels (metadata) to your SQL sources. These labels can be anything from basic data types and privacy classifications to information on who can access specific tables and the privacy rules that apply to them.

SDF is not an open-source project and can be used over [cloud or enterprised offerings](https://www.sdf.com/pricing)


## 9) yato

A newcomer to the scene, [Yato](https://github.com/Bl3f/yato) stands out as possibly the most lightweight SQL framework available. Designed for simplicity and speed, Yato takes a folder containing your SQL queries (or even Python transformations) and automatically determines the dependency order.

This eliminates the need for complex configuration, letting you focus on writing your data manipulation logic.  Yato excels when used alongside [dlt](https://dlthub.com/), a data-loading tool. Together, this duo streamlines your data workflow by handling both data acquisition and transformation. 

It can be quite useful for simple projects and fast experimentation.


## 10) Terraform

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

For instance, platform or data engineers already used to Terraform can effectively orchestrate their daily FinOps analytics pipelines this way.


## SQL Framework + Kestra = Complete Holistic Stack

While SQL frameworks excel at expressing complex data logic, running and automating these scripts requires a dedicated orchestration tool for data practitioners.

At Kestra, we observe many users orchestrating their dbt workflows alongside various elements – data ingestion, alerting, machine learning training, and more. While SQL plays a crucial role, organizations need a solution to automate the entire pipeline. This is where Kestra's orchestration engine steps in.

Here is an example using Kestra declarative syntax to run data ingestion pipelines with Airbyte and then run a dbt project from a GitHub repository

```yaml
id: airbyteSyncParallelWithDbt
namespace: blueprint

tasks:
  - id: data-ingestion
    type: io.kestra.core.tasks.flows.Parallel
    tasks:
      - id: salesforce
        type: io.kestra.plugin.airbyte.connections.Sync
        connectionId: e3b1ce92-547c-436f-b1e8-23b6936c12ab

      - id: google-analytics
        type: io.kestra.plugin.airbyte.connections.Sync
        connectionId: e3b1ce92-547c-436f-b1e8-23b6936c12cd

      - id: facebook-ads
        type: io.kestra.plugin.airbyte.connections.Sync
        connectionId: e3b1ce92-547c-436f-b1e8-23b6936c12ef

  - id: dbt
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
    - id: cloneRepository
      type: io.kestra.plugin.git.Clone
      url: https://github.com/kestra-io/dbt-demo
      branch: main
    
    - id: dbt-run
      type: io.kestra.plugin.dbt.cli.Run
      runner: DOCKER
      dbtPath: /usr/local/bin/dbt
      dockerOptions:
        image: ghcr.io/kestra-io/dbt-bigquery:latest
      inputFiles:
        .profile/profiles.yml: |
          jaffle_shop:
            outputs:
              dev:
                type: bigquery
                dataset: your_big_query_dataset_name
                project: your_big_query_project
                fixed_retries: 1
                keyfile: sa.json
                location: EU
                method: service-account
                priority: interactive
                threads: 8
                timeout_seconds: 300
            target: dev
        sa.json: "{{ secret('GCP_CREDS') }}"

taskDefaults:
  - type: io.kestra.plugin.airbyte.connections.Sync
    values:
      url: http://host.docker.internal:8000/
      username: "{{ secret('AIRBYTE_USERNAME') }}"
      password: "{{ secret('AIRBYTE_PASSWORD') }}"
```

SCREENSHOT BLUEPRINT

Having the business logic managed by a SQL framework and the orchestration logic in Kestra makes things way simpler to automate. Analytics engineers and data analysts can focus on the actual code that extracts business value from the data while data engineers can manage the orchestration layer and other projects altogether thanks to Kestra.

By using a declarative language syntax, everyone can readily understand data pipelines. This simplifies collaboration, promotes knowledge sharing, and ultimately makes everyone more productive and confident in utilizing data within the company.

Check out the many [blueprints](https://kestra.io/blueprints) to explore how Kestra can easily connect your projects and tools together.

## Conclusion

This blog post focused on the alternatives to dbt. Ultimately, choosing an SQL framework is about the level of complexity in your project and the skills of your team. Sometimes a lightweight framework will perfectly do the work while you might need something more focused on operation to scale your business logic handling.

Having a control plane like Kestra here is key: uncoupling business from orchestration logic makes things way simpler to manage and allows you to connect the bits between all the teams and projects in your company.

What SQL framework are you using? Are you using others we didn't mention in this piece? At Kestra, we would love to hear from you. You can [join the Slack community](https://kestra.io/slack), where we'll be happy to help you develop your data pipelines.

Check out dbt and SQLMesh tasks on the [plugin page](https://kestra.io/plugins?page=1&size=40&category=All+Categories&q=dbt) and check the code [in our GitHub repository](https://github.com/kestra-io) and make sure to give us a star if you like the project.
