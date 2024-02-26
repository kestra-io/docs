---
title: "Is it time to say goodbye to dbt and move to SQLMesh?"
description: "Where are we with SQL transformation in the data warehouse in the Analytics Stack?"
date: 2024-02-28T10:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: /blogs/2024-02-28-dbt-or-sqlmesh.png
---

Discussions around the Analytics Stack often assume everyone is doing ELT whereas the T is happening in some data warehouse using SQL. And so quickly with dbt.
But a lot of teams are using other stacks and other tools. 

In this blog post, we won’t dive into the debate of SQL versus a tool like Spark. We will focus on where we are now regarding SQL transformation and how all those debates are somehow converging toward a natural solution.

## The old debate with dbt

[dbt](https://www.getdbt.com/) is the go-to solution for anything regarding transformation and data modeling with SQL nowadays. It’s used by top-notch companies, [can scale quite well](https://www.getdbt.com/blog/new-dbt-cloud-features-announced-at-coalesce-2023), and has a great community of users.

Still, it has some flaws:
- [Users are wondering why they should references to build proper dependencies between models](https://www.reddit.com/r/dataengineering/comments/zamewl/whats_wrong_with_dbt/) while other solutions often parse the SQL queries to infer the DAG.
- You still need to orchestrate it: at Kestra we have seen many users moving away from dbt Cloud because of pricing changes and use Kestra with dbt Core to model their data and manage dependencies.

Talking about dependencies: we often have more complex pipelines than what we see in Modern Data Stack schemas where it’s often about connecting an ingesting tool ([Airbyte](https://airbyte.com/), [Fivetran](https://www.fivetran.com), [dlt](https://dlthub.com/)), transforming tool (dbt), and a reverse ETL tool ([Hightouch](https://hightouch.com/), [Census](https://www.getcensus.com/reverse-etl)) or a dashboarding tool ([Tableau](https://www.tableau.com), [PowerBI](https://www.microsoft.com/en-en/power-platform/products/power-bi), [Metabase](https://www.metabase.com/), [Superset](https://superset.apache.org/)). Data teams also need notification services, custom API calls, monitoring, very specific transformations, etc.

Connecting all those tools needs a control plane - [an orchestrator](https://github.com/kestra-io/kestra).

## The main challenger: SQLMesh

At the end of 2022, ex-engineers from Airbnb, Apple, Google, and Netflix started a project called [SQLMesh](https://sqlmesh.com/). Built on top the the SQLGlot library allowing parsing and transpiling SQL SQLMesh is, like dbt, a framework to run data pipelines written in SQL. The major shift from dbt is that SQLMesh has an emphasis on operations.

Major differences with dbt are:
- SQLMesh can infer query dependencies
- It can create new environments without duplicating data. Allowing to create dynamic representations of the data while ensuring tables are never built more than once. Unit tests, Audits, and Data Diff provide validation throughout the development workflow.
- It comes with different user interfaces: a web UI and a CLI. Both are in the open-source version.

You can find all the differences explained by the SQLMesh team [in this documentation](https://sqlmesh.readthedocs.io/en/stable/comparisons/#feature-comparisons).

![sqlmesh-ui](/blogs/2024-02-28-dbt-or-sqlmesh/sqlmesh-ui.png)

![sqlmesh-kestra](/blogs/2024-02-28-dbt-or-sqlmesh/sqlmesh-kestra.png)

## Alternatives

Transforming data with SQL is in growing need, and several other actors have to be considered in that space:

- [Y42](https://www.y42.com/blog/virtual-data-builds-one-data-warehouse-environment-for-every-git-commit), [GCP Dataform](https://cloud.google.com/dataform), or [SDF](https://www.sdf.com/):  they are dbt Cloud alternatives (no open-source versions) with their advantages and limitations.

![y42](/blogs/2024-02-28-dbt-or-sqlmesh/y42.png)

- [lea](https://github.com/carbonfact/lea): a lightweight alternative to dbt or SQLMesh. Fully open-source and maintained by the team using it for their data warehouse ([CarbonFact](https://www.carbonfact.com/)).

- Building your own “in-house dbt” is definitely something to consider if you have the skill and the need for a custom solution. dbt is basically SQL plus templating, so why not build your own?

- Declaring queries with Terraform resources: this is something often overlooked, but if your modeling is simple enough, using only [resources like google_bigquery_table with Terraform](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/bigquery_table) to build views on top of raw data can be a very lightweight solution.

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

- [Malloy](https://kestra.io/blogs/2023-09-15-football-malloy-kestra): though more for ad-hoc analytics now, the Google team behind Malloy has emphasized something real: [SQL has not been designed for analytics](https://medium.pimpaudben.fr/sql-is-not-designed-for-analytics-079fc97b139c), it simply wasn't made for building whole systems with it. With BI as code in the backset, Malloy could be the next semantic to build models that often need to [think beyond rectangular data](https://docs.malloydata.dev/blog/2023-01-18-data-is-rectangular/index#dimensionality-granularity).

![malloy-nested-query](/blogs/2024-02-28-dbt-or-sqlmesh/malloy.png)

## What are we optimizing for?

Highlighted by the growing number of actors in the field, the focus on how software practices could be applied to analytics is taking real depth.

But once you have chosen your SQL transformation frameworks, the real flaws are still here:

- Duplicating the structural frameworks from transactional databases upstream entails the need for the upstream team to synchronize modifications, leading to potential oversights and unexpected disruptions for the warehouse team. A more effective approach would involve the transactional team publishing domain objects as an interface and validating through a data contract.

- Just like an inexperienced software engineer tends to write complex code with all the wrong abstractions, the same can happen in any project involving a SQL framework. 

Globally speaking it resonates a lot with what we heard here with Kestra users. Clean operations are the keystone to driving value out of data and navigating models and the chain value is hard.

Like Airflow was the first of a new generation of orchestrators, dbt was the first to emphasize software practice applied to data analytics. New actors are coming into the game, bringing new improvements and new visions along the way.

To somehow answer the question raised in the head title: the time to switch depends on your team's and your company's maturity. 
dbt has the biggest community and tons of documentation and tutorials. It’s probably the best tool to start with if you want something battle-tested by a lot of users. If you need more solutions regarding proper operation and environment management, then using SQLMesh could be something to think of.

-- TODO: add why Kestra + footer social networks/slack
