---
title: "Welcome Kestra 0.9.0 ✨"
description: This latest update brings a range of user experience improvements to make data orchestration a more enjoyable experience.
date: 2023-05-25T09:00:00
category: News & Products Updates
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
  twitter: "@Ben8t"
image: /blogs/2023-05-25-welcome-kestra-0-9-0.jpg
---

We're excited to announce the release of Kestra 0.9. This latest update brings a range of user experience improvements to make data orchestration a more enjoyable experience. Let's dive into the key features and enhancements.

## Flow Metrics Dashboard

In previous versions, [Kestra](https://github.com/kestra-io/kestra) provided metrics for flow execution. However, there was no user-friendly interface to explore and visualize these metrics.

With Kestra 0.9.0, we've introduced a new Metrics tab at the flow-execution level. You can now easily track specific metrics, such as the number of rows processed, fine-grained processing times of specific steps within your task and more.
There are two types of metrics that you can track: counter and timer. [This documentation page](https://kestra.io/docs/plugin-developer-guide/outputs#use-cases-for-metrics) includes an example showing how you can leverage these two metric types to track how many rows get processed in each partition and how long this process took.


![metric dashboard screenshot](/blogs/2023-05-25-welcome-kestra-0-9-0/metric_dashboard_screenshot.png)

![metric dashboard demo](/blogs/2023-05-25-welcome-kestra-0-9-0/metric_dashboard_demo.gif)


## Save Flows as Drafts

We've introduced the ability to save flows as drafts even if there are errors in the flow declaration.
This User Experience improvement allows you to save and return to your work at any time without losing progress on your flow creation.

## User Experience Enhancements

We've focused on enhancing the user experience with the following improvements:
* **Manage editor window size**: You can now resize the editor to simultaneously display the source and topology or source and documentation using a convenient slider.
* **Re-execute Flows with last inputs**: You can now easily re-execute a Flow with the previously used inputs, saving you time on re-entering boilerplate configuration.
* **Input validation**: You can [configure inputs with validation rules](https://kestra.io/docs/developer-guide/inputs#input-validation) that will be enforced at execution time. For example bounding an integer to a certain range of values or add a validation regex on strings.
* **Task-required properties listed first**: In documentation pages, required properties of any task are now prioritized and listed first, making it clearer which properties are required and which are optional.
* **Additional improvements and fixes**: We've implemented several enhancements and fixes, including improved flow and inputs validation, enhanced page redirects, fixed Gantt display issues, improved error messaging, resolved theme discrepancies, and more. These refinements ensure a smoother user experience and enhance the overall stability of Kestra.

![editor window with slider](/blogs/2023-05-25-welcome-kestra-0-9-0/window_slider.gif)

## Introducing New Plugins
With Kestra 0.9.0, we're thrilled to introduce new plugins that extend the capabilities of the platform:

* **Git Plugin**: this plugin allows you to pull code from any Git repository at runtime, making it easier to execute custom scripts in Python, SQL, or other languages. You can set a custom branch name and configure authentication to private repositories. See the example below and [learn more about the Git plugin.](/plugins/plugin-git)
* **Couchbase Plugin**: this plugin helps integrate Couchbase NoSQL database into your Kestra workflows. There is a task to query a database and fetch the data, or trigger a flow as a result of a specific query, allowing you to run a specific flow based on specific conditions in data (such as anomalies). [Learn more in the Couchbase plugin documentation](/plugins/plugin-couchbase).
* **NATS Plugin**: this plugin allows you to trigger flows based on new messages in the [nats.io](https://nats.io/) distributed system. There’s also a task to consume or produce new messages. See the [NATS plugin documentation](/plugins/plugin-nats) for more details.

```yaml
id: gitPython
namespace: company.team

tasks:
  - id: GitHub
    type: io.kestra.core.tasks.flows.Worker
    tasks:

    - id: cloneRepository
      type: io.kestra.plugin.git.Clone
      description: password is only required for private repositories
      url: https://github.com/anna-geller/kestra-flows
      branch: main
      username: anna-geller
      password: "{{envs.github_access_token}}"

    - id: pythonScript
      type: io.kestra.core.tasks.scripts.Python
      commands:
        - ./bin/python flows/etl_script.py
      requirements:
        - requests
        - pandas
```

## Comprehensive Documentation and Enterprise Enhancements

We've also improved the documentation and addressed some enterprise-specific needs.

The documentation provides a new [User Interface guide](https://kestra.io/docs/user-interface-guide) to help you navigate and leverage Kestra’s UI.

For Kestra Enterprise Edition (EE) users, we've implemented the following enhancements:

* **New License System**: We've introduced a new licensing system to streamline the license management experience.
* **Inherited Variables Accessibility**: Users now have access to inherited variables, even if they don't have explicit access to the namespace. This improvement simplifies variables and secrets management across teams.
* **Namespace Dashboard**: Namespaces now have a dedicated dashboard, providing a centralized place to view, configure and modify namespace-level settings.

Finally, we also move update Java from version 11 to 17. If you have custom plugins you will have to update your Java to version 17.


## Give it a try

To take the new features for a spin, you can start Kestra using Docker Compose.

![git it a try](/blogs/2023-05-25-welcome-kestra-0-9-0/give_it_try.png)

Kestra is continuously improving. While the [Git plugin](/plugins/plugin-git) simplifies working with custom scripts, we are working on further improving the user experience in orchestrating custom business logic built in Python. Follow us on [Twitter](https://twitter.com/kestra_io) or [LinkedIn](https://fr.linkedin.com/company/kestra) to stay up to date with the new releases and updates.

Your feedback is invaluable to us. Join [our Slack community](https://kestra.io/slack), and share your thoughts and suggestions. If you encounter any issues, you can also [open a GitHub issue](https://github.com/kestra-io/kestra/issues/new/choose). Your input helps us prioritize future enhancements.

To see the code and contribute, check our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.