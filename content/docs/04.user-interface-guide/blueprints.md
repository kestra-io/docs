---
title: Blueprints
---

Blueprints is a curated, organized, and searchable catalog of ready-to-use examples designed to help you kickstart your workflow. Each Blueprint combines code and documentation and can be assigned several tags for organization and discoverability.

All Blueprints are validated and documented. You can easily customize and integrate them into your new or existing flows with a single click on the "Use" button.

![Blueprint](/docs/user-interface-guide/blueprints.png)

## Community Blueprints

We refer to all Blueprints available in the open-source product as Community Blueprints, as they are guided by the community feedback and represent common usage patterns we see among open-source users and contributors.

Community Blueprints are particularly helpful when you're getting started with a new use case, integration, or with Kestra in general because they reflect fairly standardized workflow patterns. All Blueprints are verified by the Kestra team, but everyone is welcome to contribute new Blueprints or suggest improvements to the existing ones using [the following GitHub issue template](https://github.com/kestra-io/kestra/issues/new?assignees=&labels=blueprint&projects=&template=blueprint.yml).

### Where to find Blueprints

Blueprints are accessible from two places in the UI:

1. The left navigation sidebar
2. A dedicated tab in the code editor named "Source and blueprints", showing your source code and Blueprints side by side.

![Blueprint UI](/docs/user-interface-guide/blueprints2.png)


### How to find the right Blueprint

Once you are on the Blueprints page, you can:

- **Search** Blueprints for a specific use case or integration, e.g., Snowflake, BigQuery, DuckDB, Slack, ETL, ELT, Pandas, GPU, Git, Python, Docker, Redis, MongoDB, dbt, Airbyte, Fivetran, etc.
- **Filter** by a tag, e.g., filter for Docker, to see various ways to run containers in your flow. Or filter for Notifications to see several options for configuring alerts on success or failure.


## Custom Blueprints

::alert{type="info"}
This feature requires a [commercial license](https://kestra.io/pricing).
::

Apart from Community Blueprints, you can also create custom Blueprints available only to your organization. You can use them to share, centralize, and document commonly used workflows in your team.

You can think of Custom Blueprints as your team's internal App Store, offering a wide range of integrations and validated workflow patterns tailored to your needs.

### How to create a new Custom Blueprint

From the left navigation menu, go to **Blueprints**. Then, select the **Custom Blueprints** tab. Click on "Create".

![Custom Blueprints](/docs/user-interface-guide/custom-blueprints.png)

Add a title, description, and the contents of the flow. You can add as many tags as you want. Then click on the "Create" button.

![New Custom Blueprint](/docs/user-interface-guide/blueprint-org-2.png)

You can edit the Blueprint anytime, for example, to add new tasks or expand the documentation.

This feature significantly helps code reusability and facilitates collaboration within a team because sharing your code and documentation is finally painless.

Once you reach a certain scale with many internal Blueprints, the search and filtering by tags will ensure that your Blueprints remain easy to find.
