---
title: Migrate from Shipyard
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Best Practices
---

Migrate from Shipyard to Kestra.

This is a guide for users who are considering migration of their workflows from [Shipyard](https://www.shipyardapp.com/) to [Kestra](https://kestra.io/).

[Kestra](https://kestra.io/) is a language-agnostic orchestration platform allowing users to build workflows as code and from the UI. Similarly to Shipyard, Kestra leverages YAML for the definition of workflow logic and the extensive plugin ecosystem in Kestra makes the migration straightforward.

## Technical Glossary

| Shipyard Concept | Equivalent Concept in Kestra                               | Description                                                                                                                                                                                                                                                |
|------------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Fleet](https://www.shipyardapp.com/docs/reference/fleets/fleets-overview/)            | [Flow](../04.workflow-components/01.flow.md)               | a container for tasks, their inputs, outputs, handling of errors and overall orchestration logic                                                                                                                                                           |
| [Vessel](https://www.shipyardapp.com/docs/reference/vessels/)           | [Task](../04.workflow-components/01.tasks/index.md)        | a discrete action within a flow, capable of taking inputs and variables from the flow, and producing outputs for downstream consumption by end users and other tasks                                                                                       |
| [Project](https://www.shipyardapp.com/docs/reference/projects/)          | [Namespace](../04.workflow-components/02.namespace.md)     | a logical grouping of flows, used to organize workflows and manage access to secrets, plugin defaults and variables                                                                                                                                       |
| [Triggers](https://www.shipyardapp.com/docs/reference/triggers/triggers-overview/)         | [Triggers](../04.workflow-components/07.triggers/index.md) | a mechanism that automates the execution of a flow; triggers can be scheduled or event-based                                                                                                                                                              |
| [Blueprints](https://www.shipyardapp.com/docs/blueprint-library/)         | [Blueprints](/blueprints)                                  | a collection of premade templates ready to be used in your workflows; Blueprints work very similarly between both platforms — the main difference is that Shipyard's blueprints are like plugins in kestra since they are used to run a task (vessel). Kestra's blueprints are more comprehensive, they often contain multiple tasks composed together to accomplish some use case end-to-end.                                                                                                    |
| [Inputs](https://www.shipyardapp.com/docs/reference/inputs/)         | [Inputs](../04.workflow-components/05.inputs.md)           | a list of dynamic values passed to the flow at runtime; the main difference between both is that Shipyard's inputs are provided to the task (i.e. vessel), while Kestra's inputs are defined at a flow (i.e. fleet) level                                                                                                    |
| UI               | [UI](../01.getting-started/15.ui.md)                       | Shipyard's UI allows building workflows via drag-and-drop and autogenerates a YAML configuration; in Kestra, users typically write the YAML configuration first and then they can optionally modify the workflow or add new tasks from low-code UI forms.  |

## Getting Started with Kestra

To get started, follow the [Quickstart Guide](../01.getting-started/01.quickstart.md) to install Kestra and start building your first workflows.

## How to Migrate

Every fleet in Shipyard generates a YAML configuration. You can retrieve it from the UI as shown below, or get it from the version control system like Git in case you maintained one for Shipyard.

![shiypard_yaml_configuration](/docs/how-to-guides/shipyard-migration/shipyard_yaml_configuration.png)

For every vessel in the fleet, try to find a matching [Kestra Plugin](/plugins). For example, the equivalent of **Amazon S3 - Delete Files** vessel in Shipyard will be [io.kestra.plugin.aws.s3.Delete](/plugins/plugin-aws/tasks/s3/io.kestra.plugin.aws.s3.delete) and [io.kestra.plugin.aws.s3.DeleteList](/plugins/plugin-aws/tasks/s3/io.kestra.plugin.aws.s3.deletelist).

In the same fashion as you would configure a vessel, you can configure a task in Kestra. Use the built-it task documentation in the Kestra UI to help you configure all task properties (the **Source and documentation** view). You can easily find plugins directly within the built-in UI editor by using the auto-complete feature. Each task documentation comes with an example and a detailed description of each task property.

![documentation_view](docs/how-to-guides/shipyard-migration/documentation_view.png)

There is no concept of **connections** in Kestra. By default, all tasks are executed sequentially. To adjust the execution logic e.g. to run some tasks in parallel, wrap your tasks in [flowable tasks](../04.workflow-components/01.tasks/00.flowable-tasks.md). As always, the combination of our [core documentation](../index.md), [Plugin documentation](/plugins) and [Blueprints](/blueprints) will help you figure out how to do that.

Once you have the fleet equivalent (i.e. a flow) ready in Kestra, you can use the **Source and topology view** to validate whether your Kestra flow matches the connections in your Shipyard fleet.

![topology_view](docs/how-to-guides/shipyard-migration/topology_view.png)

You can now Save and Execute your flow. Then, check the Logs, Gantt and Outputs tab of your Execution to validate that your workflow behaves as expected.

## Need Help?

Check out our extensive [plugin catalog](/plugins) for descriptions and examples of each task and trigger.

Use our [blueprints](/blueprints) for guidance on creating various flows.

For assistance, join our free [Slack community](/slack) and ask your questions in the `#help` channel. We respond to every message!

