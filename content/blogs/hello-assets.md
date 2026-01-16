---
title: "Hello, Assets: Unifies Orchestration, Catalogs, and Lineage"
description: "Kestra Assets bring data and infrastructure governance into your workflows. Track tables, files, and cloud resources as first-class assets with built-in lineage, audit logs, dependency graphs, and team-wide discoverability."
date: 2026-01-20T17:00:00
category: Solutions
authors:
  - name: "Martin-Pierre Roset"
    image: mproset
image: /todo
---

**Assets is** a powerful new capability inside Kestra (Enterprise Edition) that brings stateful resources into the orchestration layer. With Assets, you can declare **analytics datasets, tables, files, cloud resources,** and more as first-class objects in your workflows. This transforms traditional pipelines into **fully governed workflows,** complete with automatic **data lineage, dependency graphs, and asset catalogs** visible across teams.

> This approach is **technology-agnostic**. Whether your workflow is running a **SQL query**, a **Python script**, a **dbt transformation**, an **API call**, or a **CLI command**, you can attach asset declarations to any task. **Unlike solutions that only work via code** (for instance, Python decorators in some frameworks), Kestra’s assets are **declarative** and universal. No matter what tool or language the task uses under the hood, you can capture its inputs/outputs as named assets. In short, *if your workflow touches it, you can track it!*
> 

This means no more guessing which workflow updated a table, or hunting through logs to see where a file came from. With Kestra Assets, every data or infrastructure artifact becomes a **first-class citizen**: **discoverable**, **traceable**, and **reusable** across teams. The result is safer, more transparent pipelines and easier collaboration between data engineers, platform teams, and business stakeholders.

In this post, we’ll explore what Kestra Assets are, how they work (in a **language-agnostic** way that goes beyond just Python code), and why they matter for building modern, governed platforms.

*(Spoiler: Assets unify the best of orchestration and data cataloging. You get automatic **data lineage graphs**, clear ownership of resources, impact analysis on changes, and much more, all **without any manual documentation**.)*

## What Are Kestra Assets?

At its core, a **Kestra Asset** represents a **resource** that your workflow interacts with. This could be a table in a database, a file in cloud storage, a VM instance, a dataset, or any resource type you define. Each Asset has:

- **An ID** (unique name within its namespace)
- **A Type** (e.g. `Table`, `File`, `VM`, or a custom string for your own category)
- **Optional Metadata** (key-value attributes to describe the asset, like `owner`, `system`, `environment`, `model_layer`, etc.)

**How are assets defined?** You declare them **directly in your workflow’s tasks**. Kestra extends the YAML syntax to allow each task to list which assets it **consumes** and which assets it **produces**. We use an `assets:` block with two sections:

- **`inputs`** – Assets that the task reads or depends on (but does not modify).
- **`outputs`** – Assets that the task creates or writes to.

For example, if a task creates a new database table, you’d list that table as an output asset. If another task reads from an existing table, you’d list that table as an input asset. Kestra then automatically **registers** those assets in a global inventory and links them to the task (and flow) that used them.

## Lineage, Governance, and Reuse

We elevate your workflows from just running tasks to also **managing knowledge about data and infrastructure**. Here are some key benefits:

- **Complete Data Lineage & Impact Analysis:** Kestra automatically builds a **dependency graph** of all assets. You can visualize upstream and downstream relationships at a glance. For example, if an external dataset feeds a staging table which feeds several aggregate tables, you’ll see the entire chain in the UI. If an upstream dataset changes or a schema updates, you immediately know which downstream assets and workflows are affected. It’s like having a built-in data catalog that’s always up to date.
- **Audit Trails & Governance:** Every time an asset is created or modified, Kestra records which **workflow** (and even which specific task run) touched it, along with timestamps. Each asset’s detail page shows a history of all executions that produced or used it. This provides an automatic audit log for data and infrastructure changes. Need to know *who last updated this table and when*? Or *which flow created this S3 bucket*? Just click the asset view, no more tribal knowledge or digging through code.
- **Discoverability & Reuse:** Assets are indexed in Kestra’s **Asset Catalog**, where you can search and filter by name, type, namespace, or metadata. Teams can easily discover what data or resources already exist. For instance, an analyst can find that a curated `customer_orders` table is available as a `Table` asset instead of reinventing it. Downstream workflows can **reference assets by ID** to ensure they’re using the correct, governed data.
- **Enforcing Best Practices:** Assets encourage modeling techniques like **staging and mart layers** in analytics engineering, or clear ownership of infrastructure by team. By tagging assets with metadata (e.g., `model_layer: staging` vs `mart`, or an `owner: finance` on a bucket), you can enforce standards and **organize your data landscape**. It’s easy to filter the catalog to just staging tables or just finance-owned resources, etc. This layered approach increases clarity and maintainability of your data platform.
- **Collaboration Between Roles:** Kestra Assets provide a common language for different teams. Data engineers see how pipelines produce datasets, while DevOps/cloud engineers see how infrastructure is being used by workflows. A platform team can provision resources and hand them off as assets for others to use (with proper lineage linking them). This creates clear **contracts and ownership** between those who **produce** assets and those who **consume** them. In other words, assets break down silos by making dependencies explicit and visible to all stakeholders.

In summary, Assets bring much-needed **governance** to orchestration. Instead of treating outputs as ephemeral, they are **persisted as durable records**. This aligns closely with data cataloging and DevOps best practices, but without requiring a separate tool, t**he context lives right inside your Kestra orchestration platform.**

Check the video below for a quick overview of the feature

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/XhICXP_GXic?si=SqweJSXueK7uAmST" title="Kestra 1.2 Overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Working with Assets in Kestra

Kestra’s UI and features make it easy to leverage the Assets system:

- **Asset Catalog:** A new **Assets** section in the Kestra UI lists all assets across your tenant (with RBAC enforcement). You can search by ID or filter by type, namespace, or metadata tags.

![assets catalogs](/blogs/hello-assets/catalogs.png)


- **Dependency Graph Visualization:** On any asset’s detail page, Kestra displays an interactive **lineage graph** showing that asset’s **upstream and downstream** links. This graph updates automatically as flows run. It’s invaluable for quickly understanding the context of an asset. This visual map helps both developers and stakeholders grasp data flows without reading code.

![assets dependencies](/blogs/hello-assets/dependencies.png)

- **Execution History & Details:** Each asset page also lists attributes (ID, type, full namespace, timestamps) and a log of **which flow executions touched it**. You can click through to the exact flow run for more details. This effectively provides an **audit log per asset**. If something looks off in a dataset, you can see if maybe an unusual flow run that affected it. For external assets that Kestra references (like an imported dataset), you’ll at least see which Kestra flows have been reading it recently.

![assets executions](/blogs/hello-assets/executions.png)

- **Dynamic Asset Queries:** Kestra provides a built-in function `assets()` for your workflow scripts, so you can query the asset inventory dynamically. For instance, you can populate a dropdown input with all asset IDs of a certain type. This makes your workflows extremely flexible and **self-driving based on the current catalog**.

```yaml
id: list_aws_bucket
namespace: kestra.company
inputs:
  - id: assets
    type: MULTISELECT
    expression: "{{ assets(type='AWS_BUCKET') | jq('.[].id') }}"
tasks:
  - id: for_each
    type: io.kestra.plugin.core.flow.ForEach
    values: '{{inputs.assets}}'
    tasks:
      - id: list_buckets
        type: io.kestra.plugin.core.log.Log
        message: "{{ taskrun.value }}"
```

- **Metadata and Tagging:** Because assets support custom metadata, you can enforce conventions. For example, tag assets with `environment: prod` vs `dev`, or `owner: team_name`, or any classification your organization needs. These tags make search and filtering powerful. More importantly, they provide context to each asset, anyone looking at it knows what it represents. In future releases, we plan to allow **programmatic updates to asset metadata** via dedicated tasks, which will further integrate assets into automated governance workflows (e.g., auto-tag new tables with a retention policy or sensitivity level).

![assets details](/blogs/hello-assets/executions.png)

## **Extensible & Future-Proof**

Kestra’s vision is to make this even more global. We’re working on plugin enhancements to enable certain plugins to automatically **emit asset information**. For example, a database connector plugin might automatically register a Table asset when a query creates a table, without you specifying it. We’re also exploring triggers and alerts based on assets (imagine a trigger that fires when a particular asset hasn’t been updated in X days, indicating stale data). The Asset system is designed to be a game changer for **data quality, monitoring, and even external catalog integrations** (indeed, we have an `AssetShipper` that can export asset metadata to formats like OpenLineage or other catalogs). 

## Conclusion

Kestra Assets represent a significant leap forward in orchestrating with confidence. By treating datasets, files, and infrastructure as first-class citizens, you gain **unprecedented visibility** into your workflows’ footprint. **No other orchestration solution ties the pieces together quite like this,** connecting the dots from raw inputs to final outputs across all your pipelines, **all in one place**. Whether you’re a data engineer ensuring proper analytics data lineage or a platform engineer governing cloud resources, Assets provide the transparency and control needed to operate at an enterprise scale with trust.

**Hello, Assets, and welcome to a new era of governed orchestration!** If you’re as excited as we are about this feature, let’s talk about making it a part of your stack. **This is an Enterprise Edition feature, so [talk to us](https://kestra.io/demo) to implement it in your Kestra platform.**