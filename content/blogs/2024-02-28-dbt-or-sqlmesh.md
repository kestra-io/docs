---
title: "Is It Time To Move From dbt to SQLMesh?"
description: "Are dbt shortcomings painful enough to migrate to a new SQL transformation framework such as SQLMesh? Here's my take."
date: 2024-02-28T18:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: /blogs/2024-02-28-dbt-or-sqlmesh.png
---

Conversations around the [Analytics Stack](https://twitter.com/mattturck/status/1761436014122332187) often revolve around the assumption that everyone is using the Extract, Load, Transform (ELT) approach, with the transformation (T) happening within a data warehouse using SQL. These discussions quickly shift towards the use of dbt as the go-to tool for this process.

Tools such as dbt and SQLMesh allow for such transformations to happen directly within a cloud data warehouse.

Before dbt, most data engineers maintained hand-made SQL templating engines to operate queries on their data warehouse. dbt has emerged as a standard to help avoid reinventing the wheel and has built a wonderful community around it.

With usage growing, some users started to complain about dbt shortcomings. New tools like SQLMesh started to emerge to address these challenges.

In this blog post, we'll delve into dbt and SQLMesh frameworks and how they need an orchestration engine to really shine.


## The shortcomings of dbt core: why many practitioners consider alternatives

[dbt](https://www.getdbt.com/) is the go-to solution for anything regarding transformation and data modeling with SQL nowadays. Some of the largest companies rely on dbt, and dbt [can scale quite well](https://www.getdbt.com/blog/new-dbt-cloud-features-announced-at-coalesce-2023), and has a great community.

Still, here are some common complaints raised by the dbt community:

- [Users are wondering](https://www.reddit.com/r/dataengineering/comments/zamewl/whats_wrong_with_dbt/) why they need to explicitly use refs to declare dependencies between models. Other solutions often parse the SQL queries to infer the DAG of dependencies directly.


- Some users are not fond of using YAML to define the model's schema as it leads to an additional user burden without tackling the root cause of data quality issues. Columns or types often change on purpose, and a failed build due to an outdated YAML schema can lead to frustration.


- While incremental models in dbt efficiently process new or updated data, backfilling only specific time range intervals can become challenging when using the "most recent records" approach.


- Thousands of lines of SQL paired with Jinja macros can easily become difficult to maintain especially with complex business logic. 


- Scaling across multiple projects is difficult: having too many dbt projects in a single repository is often hard to manage. You often need to split your hundreds (if not thousands) of models built by different teams and projects. However, cross-project references are not possible in dbt Core. It has been discussed in previous [roadmap discussions](https://github.com/dbt-labs/dbt-core/blob/main/docs/roadmap/2022-08-back-for-more.md), but the final decisions have been to move it into [dbt Mesh](https://www.getdbt.com/product/dbt-mesh), which is part of the commercial dbt Cloud offering.


The main interface to interact with dbt is the CLI, optionally generating a static documentation website. Web UI is only available through the dbt Cloud offering.


Adding to these main shortcomings, it's worth mentioning the analogy often made: "dbt is the Terraform for data transformation". In my opinion, [dbt is more similar to jQuery than Terraform](https://www.aranke.org/dbt-jquery/). The biggest reason jQuery isn’t the de facto web framework today is that it was hard to scale to large teams.

The same flexibility that allowed small teams to deliver value quickly left behind messes of spaghetti code for large teams to maintain.

The introduction of React in 2013 by Facebook teams promised to address these pain points by rethinking best practices, and it has been the de facto web framework ever since.

The rapid adoption of dbt has led to the swift addition of features, which, at times, has introduced increased complexity. This raises the question of whether dbt can maintain its position as the de facto SQL framework in the long term.


## How SQLMesh aims to address the dbt shortcomings

At the end of 2022, ex-engineers from Airbnb, Apple, Google, and Netflix started a project called [SQLMesh](https://sqlmesh.com/). Built on top of the SQLGlot library, allowing parsing and transpiling SQL SQLMesh is, like dbt, a framework to run data pipelines written in SQL. The major shift from dbt is that SQLMesh emphasizes [GitOps](https://kestra.io/blogs/2024-02-06-gitops).

SQLMesh introduces key improvements for managing SQL queries:

- SQLMesh can infer query dependencies


- SQLMesh facilitates the identification of all downstream consumers of a specific model, along with the impact of changes (breaking or non-breaking) on each consumer, enabling a smooth migration process.


- SQLMesh leverages an "intervals approach" for incremental by-time models. This approach meticulously tracks which time intervals have been successfully processed identifies those pending execution and differentiates between completed and incomplete intervals.


- While SQLMesh supports Jinja templating, it also lets the user extend the SQL language itself with native support for metaprogramming constructs that enable direct invocation of functions implemented in Python (or other programming language). This approach encourages reasoning about the code without requiring deep dives into individual macro implementations. The clear separation of Python and SQL source files contributes to a clean codebase, while Python's inherent modularity further promotes well-organized implementation.


- SQLMesh allows the creation of new environments without duplicating data. Allowing the creation of dynamic representations of the data while ensuring tables are never built more than once. Unit tests, Audits, and Data Diff provide validation throughout the development workflow.


- SQLMesh provides native support for multiple repos and makes it easy to maintain data consistency and correctness even with multiple repos.


- SQLMesh has different user interfaces: a web UI and a CLI. Both are included in the open-source version. 


Comparing SQLMesh's exposed commands, like `sqlmesh plan`, and the way it interacts with the data warehouse, it evokes a strong resemblance to Terraform's approach. Adding UI on top is the realization that different user interfaces (Terraform being one) are important to support any user experiences.

::div
<iframe width="700" height="400" src="https://www.youtube.com/embed/wTLoDq-SW-g?si=6gbmbLJV8j1L9LT0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
::

Here is a general feature comparison between dbt and SQLMesh:

**Feature Comparison: dbt vs. SQLMesh**

| Feature | dbt | SQLMesh |
| --- | --- | --- |
| **Modeling** | | |
| SQL models | Yes | Yes |
| Python models | Yes | Yes |
| Jinja support | Yes | Yes |
| Jinja macros | Yes | Yes |
| Python macros | No | Yes |
| **Validation** | | |
| SQL semantic validation | No | Yes |
| Unit tests | No | Yes |
| Table diff | No | Yes |
| Data audits | Yes | Yes |
| Schema contracts | Yes | Yes |
| Data contracts | No | Yes |
| **Deployment** | | | 
| Virtual Data Environments | No | Yes |
| Open-source CI/CD bot | No | Yes |
| Data consistency enforcement | No | Yes |
| Native Airflow integration | No | Yes |
| **Interfaces** | | |
| CLI | Yes | Yes |
| UI | Yes (Cloud) | Yes (OSS) |
| Native Notebook Support | No | Yes |
| Visualization | No | Yes |
| Documentation generation | Yes | Yes |
| Column-level lineage | Yes (Cloud) | Yes (OSS) |
| **Miscellaneous** | | | 
| Package manager | Yes | No |
| Multi-repository support | No | Yes |
| SQL transpilation | No | Yes |

> **Note:** This table is for informational purposes only and may not reflect the latest features or capabilities of each tool. Please consult the official documentation for the most up-to-date information.



## dbt Cloud vs. SQL Mesh commercial product

dbt Core remains the foundation of the dbt open-source project. However, recent development efforts have primarily focused on the Cloud offering. This has coincided with both [pricing adjustments](https://www.getdbt.com/blog/consumption-based-pricing-and-the-future-of-dbt-cloud) and a perceived slowdown in core feature development. It's worth mentioning that dbt Cloud recently introduced column-level lineage (so only in their commercial product) built on top of SQLMesh's open-source technology [SQLGlot](https://github.com/tobymao/sqlglot).

At Kestra, we have seen many users moving away from dbt Cloud because of those pricing changes and using Kestra with dbt Core to model their data and manage dependencies.

On the other side, the commercial product associated with SQLMesh is still [under development](https://sqlmesh.readthedocs.io/en/stable/faq/faq/#company) and is expected to include features such as:

- Model execution observability and monitoring tools
- An enterprise-focused GitHub Actions CI/CD application
- An advanced version of the open-source CI/CD bot
- Hands-on support for companies using SQLMesh


## The need for orchestration

Even though both frameworks are extraordinary for building data transformations in ELT style, they don’t cover the full orchestration spectrum required by companies nowadays.

Data engineers often have more complex pipelines than what we see in Modern Data Stack schemas where it’s often about connecting an ingesting tool ([Airbyte](https://airbyte.com/), [Fivetran](https://www.fivetran.com), [dlt](https://dlthub.com/)), transforming tool (dbt), and a reverse ETL tool ([Hightouch](https://hightouch.com/), [Census](https://www.getcensus.com/reverse-etl)) or a dashboarding tool ([Tableau](https://www.tableau.com), [PowerBI](https://www.microsoft.com/en-en/power-platform/products/power-bi), [Metabase](https://www.metabase.com/), [Superset](https://superset.apache.org/)). Data teams also need notification services, custom API calls, monitoring, very specific transformations, etc.

Connecting all those tools needs a central orchestrator such as [Kestra](https://github.com/kestra-io/kestra). 

The following sections will demonstrate how you can easily orchestrate dbt and SQL Mesh transformations in just a few lines of YAML code in Kestra.

### Orchestrating SQL Mesh with Kestra

Using SQLMesh in Kestra is straightforward. The following example shows how you can clone a [SQLMesh project from a Git repository](https://github.com/TobikoData/sqlmesh-examples), run it with the dedicated [SQLMeshCLI task](https://kestra.io/plugins/tasks/cli/io.kestra.plugin.sqlmesh.cli.sqlmeshcli) and query the results with [DuckDB](https://duckdb.org/).

```yaml
id: sqlmesh
namespace: company.team
description: Clone SQLMesh project and run the project, and query with DuckDB

tasks:
  - id: working_dir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
    
      - id: git_clone
        type: io.kestra.plugin.git.Clone
        url: https://github.com/TobikoData/sqlmesh-examples.git
        branch: main

      - id: sqlmesh
        type: io.kestra.plugin.sqlmesh.cli.SQLMeshCLI
        beforeCommands:
          - cd 001_sushi/1_simple
        commands:
          - sqlmesh plan --auto-apply
        outputFiles:
          - '001_sushi/1_simple/db/sushi-example.db'

  - id: query
    type: io.kestra.plugin.jdbc.duckdb.Query
    inputFiles:
      data.db: "{{ outputs.sqlmesh.outputFiles['001_sushi/1_simple/db/sushi-example.db'] }}"
    sql: |
      ATTACH '{{workingDir }}/data.db';
      SELECT * FROM sushisimple.top_waiters;
    store: true

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "30 6 * * *"
```

![sqlmesh-kestra](/blogs/2024-02-28-dbt-or-sqlmesh/sqlmesh-kestra.png)

### Orchestrating dbt with Kestra

In a similar fashion, orchestrating a dbt project with Kestra can be done in few lines of YAML:

```yaml
id: dbt_duckdb
namespace: company.team

tasks:
  - id: dbt
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
    - id: cloneRepository
      type: io.kestra.plugin.git.Clone
      url: https://github.com/kestra-io/dbt-example
      branch: main

    - id: dbt-build
      type: io.kestra.plugin.dbt.cli.DbtCLI
      runner: DOCKER
      docker:
        image: ghcr.io/kestra-io/dbt-duckdb:latest
      commands:
        - dbt deps
        - dbt build
      profiles: |
        my_dbt_project:
          outputs:
            dev:
              type: duckdb
              path: ":memory:"
              fixed_retries: 1
              threads: 16
              timeout_seconds: 300
          target: dev
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "30 6 * * *"
```

You can find several examples of flows involving dbt and other technologies in our [blueprints library](https://kestra.io/blueprints?page=1&size=24&tags=36).

## Conclusion

Highlighted by the growing number of actors in the field, there is a growing popularity in applying software practices to analytics.

When is the right time to consider switching from dbt to SQLMesh? The answer ultimately depends on the specific needs of your team and organization.

dbt has a large and active community, along with extensive documentation and readily available tutorials. This makes it an excellent choice, especially for those seeking a well-established and user-tested solution. On the other hand, if your primary concern lies in robust operational capabilities and comprehensive environment management, then SQLMesh might be a more suitable option to explore.

Are you already using dbt? Do you plan to use SQLMesh? At Kestra, we would love to hear from you. You can [join the Slack community](https://kestra.io/slack), where we'll be happy to help you develop your data pipelines.

Checkout dbt and SQLMesh tasks on the [plugin page](https://kestra.io/plugins?page=1&size=40&category=All+Categories&q=dbt) and check the code  [in our GitHub repository](https://github.com/kestra-io) and make sure to give us a star if you like the project.
