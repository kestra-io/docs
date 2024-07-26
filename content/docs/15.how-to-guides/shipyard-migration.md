---
title: Migrate from Shipyard
icon: /docs/icons/tutorial.svg
---

Migrate from Shipyard to Kestra.

This is a guide for users who are considering migration of their pipelines from [Shipyard](https://www.shipyardapp.com/) to [Kestra](https://kestra.io/).

[Kestra](https://kestra.io/) is a Unified Orchestration Platform built with the perspective from data engineers, making it easier to automate and schedule the workflows. Kestra is language agnostic, and uses the YAML based apprach to configure data pipelines. Kestra being based on YAML based configuration makes it one of the go-to choices for Shipyard migration which also uses YAML configuration for their pipelines.

## Technical Glossary

- **Fleet** in Shipyard is same as [Flow](/docs/workflow-components/flow) in Kestra.
- **Vessel** in Shipyard is same as [Task](/docs/workflow-components/tasks) in Kestra.
- **Project** in Shipyard is same as [Namespace](/docs/workflow-components/namespace) in Kestra.
- **Triggers** in Shipyard and Kestra mean the same, and can be refered [here](/docs/workflow-components/triggers).
- Shipyard has a UI for building the pipelines. Kestra also has the [UI](/content/docs/getting-started/ui) for the same. However, while Shipyard has a drop-down capability for Vessels which generate the YAML configuration; in Kestra, users write teh YAML configuration which generates the diagramatic view of the pipeline which can be viewed in the **Topology** view of the UI.

## Getting Started with Kestra

You can start the Kestra journey by following the [Quickstart Guide](/docs/getting-started/quickstart) to install Kestra and start building your first workflows.

## How to Migrate

- In Shipyard, for every fleet that you have created, also has a YAML equivalent configuration. You can get it from the UI as shown below, or also from the code versioninig system like Gitgub in case you maintained one.

![shiypard_yaml_configuration](/docs/how-to-guides/shipyard-migration/shipyard_yaml_configuration)

- For every vessel that you have in the fleet, figure out the Kestra plugin associated with that vessel from our rich set of [Plugins](https://kestra.io/plugins), and on the correspinding plugin's page find out the equivalent plugin task corresponding to that vessel. For example, the equivalent of **Amazon S3 - Delete Files** vessel in Shipyard will be [io.kestra.plugin.aws.s3.Delete](https://kestra.io/plugins/plugin-aws/tasks/s3/io.kestra.plugin.aws.s3.delete) and [io.kestra.plugin.aws.s3.DeleteList](https://kestra.io/plugins/plugin-aws/tasks/s3/io.kestra.plugin.aws.s3.deletelist) tasks as per yout requirement.

- In the Kestra task, you can specify the attribute values for the task in the same fashion as mentioned in the vessel's configuration. Refer the corresponding task's documentation for finding the equivalent attribute name in Kestra. The task can be found very easily using the auto-complete feature of the UI, and the corresponding task documentation can be found easily from the UI's **Source and documentation** view. Each task document comes with an example and a detailed description about every task attribute.

![documentation_view](docs/how-to-guides/shipyard-migration/documentation_view)

- There are no **connections** specified in Kestra. By default, all the tasks are executed sequentially. However, you can control the task execution by using our flow-based tasks listed [here](https://kestra.io/plugins/core#flow).

- Once you have the fleet equivalent flow in Kestra, you can use the **Source and topology view** to check if the flow has the connections as the vessels in your fleet.

![topology_view](docs/how-to-guides/shipyard-migration/topology_view)

- You can now save and run your flow to ensure you get the same results as expected.

## Need help

We have a rich set of documentation. You can go through the Kestra [docs](https://kestra.io/docs) for getting detailed explanation about Kestra concepts.

We have a rich library of plugins, and each of the plugin task comes with a detailed description and an example. You can explore those at our [plugins](https://kestra.io/plugins) tab.

There are multiple [blueprints](https://kestra.io/blueprints) that covers the different flows and can be used as a go-to place for guidance while creating similar flows.

In case you are stuck and want any help from us or the community, we have free community support via our [Slack community](https://kestra.io/slack). You can put out your question in the #help channel, and we will get back to you at the earliest.

