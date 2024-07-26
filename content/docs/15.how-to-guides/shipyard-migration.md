---
title: Migrate from Shipyard
icon: /docs/icons/tutorial.svg
---

Migrate from Shipyard to Kestra.

This is a guide for users who are considering migration of their pipelines from [Shipyard](https://www.shipyardapp.com/) to [Kestra](https://kestra.io/).

[Kestra](https://kestra.io/) is a language-agnostic orchestration platform allowing users to build workflows as code and from the UI. Similarly to Shipyard, Kestra leverages YAML for the definition of workflow logic and the extensive plugin ecosystem in Kestra makes the migration straightforward. 

## Technical Glossary

| Shipyard Concept | Equivalent Concept in Kestra | Description                                                                                                                                                                                                                                                |
|------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Fleet](https://www.shipyardapp.com/docs/reference/fleets/fleets-overview/)            | [Flow](/docs/workflow-components/flow)        | a container for tasks, their inputs, outputs, handling of errors and overall orchestration logic                                                                                                                                                           |
| [Vessel](https://www.shipyardapp.com/docs/reference/vessels/)           | [Task](/docs/workflow-components/tasks)       | a discrete action within a flow, capable of taking inputs and variables from the flow, and producing outputs for downstream consumption by end users and other tasks                                                                                       |
| [Project](https://www.shipyardapp.com/docs/reference/projects/)          | [Namespace](/docs/workflow-components/namespace)  | a logical grouping of flows, used to organize workflows and manage access to secrets, plugin defaults and variables                                                                                                                                       |
| [Triggers](https://www.shipyardapp.com/docs/reference/triggers/triggers-overview/)         |  [Triggers](/docs/workflow-components/triggers)                   | a mechanism that automates the execution of a flow. Triggers can be scheduled or event-based                                                                                                                                                              |
| [Blueprints](https://www.shipyardapp.com/docs/blueprint-library/)         |  [Blueprints](/blueprints/)                   | a collection of premade templates ready to be used in your workflows; Blueprints work very similarly between both platforms. The main difference is that Shipyard's blueprints are like plugins in kestra — they are used to run a task (vessel). Kestra's blueprints are more comprehensive, they often contain multiple tasks composed together to accomplish some use case end-to-end                                                                                                    |
| [Inputs](https://www.shipyardapp.com/docs/reference/inputs/)         |  [Inputs](https://kestra.io/docs/workflow-components/inputs)                   | a list of dynamic values passed to the flow at runtime. The main difference between both is that Shipyard's inputs are provided to the task (i.e. vessel), while Kestra's inputs are defined at a flow (i.e. fleet) level                                                                                                    |
| UI               | [UI](/content/docs/getting-started/ui)         | Shipyard's UI allows building workflows via drag-and-drop and autogenerates a YAML configuration; in Kestra, users typically write the YAML configuration first and then they can optionally modify the workflow or add new tasks from low-code UI forms.  |

## Getting Started with Kestra

You can start the Kestra journey by following the [Quickstart Guide](/docs/getting-started/quickstart) to install Kestra and start building your first workflows.

## How to Migrate

In Shipyard, for every fleet that you have created, also has a YAML equivalent configuration. You can get it from the UI as shown below, or also from the code versioninig system like Gitgub in case you maintained one.

![shiypard_yaml_configuration](/docs/how-to-guides/shipyard-migration/shipyard_yaml_configuration.png)

For every vessel that you have in the fleet, try to find a matching [Kestra Plugin](https://kestra.io/plugins). For example, the equivalent of **Amazon S3 - Delete Files** vessel in Shipyard will be [io.kestra.plugin.aws.s3.Delete](https://kestra.io/plugins/plugin-aws/tasks/s3/io.kestra.plugin.aws.s3.delete) and [io.kestra.plugin.aws.s3.DeleteList](https://kestra.io/plugins/plugin-aws/tasks/s3/io.kestra.plugin.aws.s3.deletelist).

In the same fashion as you would configure a vessel, you can configure a task in Kestra. Use the built-it task documentation in the Kestra UI to help you configure all task properties (the **Source and documentation** view). You can easily find plugins directly within the built-in UI editor by using the auto-complete feature. Each task documentation comes with an example and a detailed description of every task property.

![documentation_view](docs/how-to-guides/shipyard-migration/documentation_view.png)

There are no **connections** specified in Kestra. By default, all tasks are executed sequentially. To control the execution logic e.g. to run some tasks in parallel, wrap your tasks in [flowable tasks](https://kestra.io/plugins/core#flow). As always, the combination of our [core documentation](/docs/), [Plugin documentation](/plugins/) and [Blueprints](/blueprints/) will help you figure out how to do that.

Once you have the fleet equivalent (i.e. a flow) ready in Kestra, you can use the **Source and topology view** to check if the flow has the connections as the vessels in your fleet.

![topology_view](docs/how-to-guides/shipyard-migration/topology_view.png)

You can now save and run your flow to ensure you get the same results as expected.

## Need Help?

Explore the comprehensive Kestra [docs](https://kestra.io/docs) for detailed explanations of Kestra concepts.

Check out our extensive [plugin library](https://kestra.io/plugins) for descriptions and examples of each plugin task.

Use our [blueprints](https://kestra.io/blueprints) for guidance on creating various flows.

For assistance, join our free [Slack community](https://kestra.io/slack) and ask your questions in the `#help` channel. We'll respond promptly.

