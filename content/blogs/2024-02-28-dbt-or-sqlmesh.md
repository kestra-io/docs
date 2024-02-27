---
title: "Is It Time For You To Move From dbt to SQLMesh?"
description: "Where are we with SQL transformation in the data warehouse in the Analytics Stack?"
date: 2024-02-27T10:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: /blogs/2024-02-27-dbt-or-sqlmesh.png
---

Conversations around the [Analytics Stack](https://twitter.com/mattturck/status/1761436014122332187) often revolve around the assumption that everyone is using the Extract, Load, Transform (ELT) approach, with the transformation (T) happening within a data warehouse using SQL. These discussions quickly shift towards the use of dbt as the go-to tool for this process.

However, it's important to acknowledge that many teams are utilizing different data stacks and tools beyond the common ELT and dbt combination.

In this blog post, we'll delve into the current landscape of SQL transformations and explore how various discussions and debates in this space are often all about different maturity and project scales.

## The old debate with dbt

[dbt](https://www.getdbt.com/) is the go-to solution for anything regarding transformation and data modeling with SQL nowadays. It’s used by top-notch companies, [can scale quite well](https://www.getdbt.com/blog/new-dbt-cloud-features-announced-at-coalesce-2023), and has a great community of users.

Still, it has some flaws:
- [Users are wondering why they should references to build proper dependencies between models](https://www.reddit.com/r/dataengineering/comments/zamewl/whats_wrong_with_dbt/) while other solutions often parse the SQL queries to infer the DAG.
- You still need to orchestrate it: at Kestra we have seen many users moving away from dbt Cloud because of pricing changes and use Kestra with dbt Core to model their data and manage dependencies.

Talking about dependencies: we often have more complex pipelines than what we see in Modern Data Stack schemas where it’s often about connecting an ingesting tool ([Airbyte](https://airbyte.com/), [Fivetran](https://www.fivetran.com), [dlt](https://dlthub.com/)), transforming tool (dbt), and a reverse ETL tool ([Hightouch](https://hightouch.com/), [Census](https://www.getcensus.com/reverse-etl)) or a dashboarding tool ([Tableau](https://www.tableau.com), [PowerBI](https://www.microsoft.com/en-en/power-platform/products/power-bi), [Metabase](https://www.metabase.com/), [Superset](https://superset.apache.org/)). Data teams also need notification services, custom API calls, monitoring, very specific transformations, etc.

Connecting all those tools needs a control plane - [an orchestrator](https://github.com/kestra-io/kestra).

## Is it time to say goodbye to dbt and move to SQLMesh?

At the end of 2022, ex-engineers from Airbnb, Apple, Google, and Netflix started a project called [SQLMesh](https://sqlmesh.com/). Built on top the the SQLGlot library allowing parsing and transpiling SQL SQLMesh is, like dbt, a framework to run data pipelines written in SQL. The major shift from dbt is that SQLMesh has an emphasis on operations.

Major differences with dbt are:
- SQLMesh can infer query dependencies
- It can create new environments without duplicating data. Allowing to create dynamic representations of the data while ensuring tables are never built more than once. Unit tests, Audits, and Data Diff provide validation throughout the development workflow.
- It comes with different user interfaces: a web UI and a CLI. Both are in the open-source version.

You can find all the differences explained by the SQLMesh team [in this documentation](https://sqlmesh.readthedocs.io/en/stable/comparisons/#feature-comparisons).

![sqlmesh-ui](/blogs/2024-02-27-dbt-or-sqlmesh/sqlmesh-ui.png)

![sqlmesh-kestra](/blogs/2024-02-27-dbt-or-sqlmesh/sqlmesh-kestra.png)

## Alternatives

Transforming data with SQL is in growing need, and several other actors have to be considered in that space:

- [Y42](https://www.y42.com/blog/virtual-data-builds-one-data-warehouse-environment-for-every-git-commit), [GCP Dataform](https://cloud.google.com/dataform), or [SDF](https://www.sdf.com/):  they are dbt Cloud alternatives (no open-source versions) with their advantages and limitations.

![y42](/blogs/2024-02-27-dbt-or-sqlmesh/y42.png)

- [lea](https://github.com/carbonfact/lea): a lightweight alternative to dbt or SQLMesh. Fully open-source and maintained by the team using it for their data warehouse ([CarbonFact](https://www.carbonfact.com/)).

- [Quary](https://www.quary.dev/): an open-source alternative of dbt Core, made in Rust.

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

![malloy-nested-query](/blogs/2024-02-27-dbt-or-sqlmesh/malloy.png)

## Different frameworks for different needs

Highlighted by the growing number of actors in the field, the focus on how software practices could be applied to analytics is taking real depth.

But once you have chosen your SQL transformation frameworks, the real flaws are still here:

- Duplicating the structural frameworks from transactional databases upstream entails the need for the upstream team to synchronize modifications, leading to potential oversights and unexpected disruptions for the warehouse team. A more effective approach would involve the transactional team publishing domain objects as an interface and validating through a data contract.

- Just like an inexperienced software engineer tends to write complex code with all the wrong abstractions, the same can happen in any project involving a SQL framework. 

In conclusion, the emphasis on clean data operations resonates strongly with the growing adoption of tools like Kestra. After all, well-defined operations are fundamental to unlocking the true value of data, and managing complex data models and their value chains can be a significant challenge.

Just as Airflow pioneered a new generation of data orchestration tools, dbt was the first to champion the application of software development best practices to data analytics. However, the landscape is constantly evolving, with new players emerging and introducing innovative solutions and fresh perspectives.

So, when is the right time to consider switching from dbt to SQLMesh? The answer ultimately depends on the specific maturity level of your team and organization.

dbt boasts a large and active community, along with extensive documentation and readily available tutorials. This makes it an excellent choice, especially for those seeking a well-established and user-tested solution. On the other hand, if your primary concern lies in robust operational capabilities and comprehensive environment management, then SQLMesh might be a more suitable option to explore.


Are you already using dbt? Do you plan to use SQLMesh? At Kestra we would love to hear from you. You can [join the Slack community](https://kestra.io/slack) we're we'll be happy to help you in your development.
Checkout [dbt and SQLMesh tasks on the plugin page](https://kestra.io/plugins?page=1&size=40&category=All+Categories&q=dbt) and [check the code in our GitHub repository](https://github.com/kestra-io) and give us a star if you like the project. Follow us on Twitter for the latest news.  
