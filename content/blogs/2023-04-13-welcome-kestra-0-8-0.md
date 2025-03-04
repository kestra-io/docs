---
title: "Welcome Kestra 0.8.0 ✨"
description: Kestra is back with version 0.8.0, and this time, we're putting the spotlight on enhancing the flow creation experience. We've introduced powerful new features and developer tools that make Kestra the go-to data orchestration platform for data engineers like you.
date: 2023-04-13T17:00:00
category: News & Products Updates
author:
  name: Loïc Mathieu
  image: "lmathieu"
  twitter: "@loicmathieu"
image: /blogs/2023-04-13-welcome-kestra-0-8-0.png
---

[Kestra](https://github.com/kestra-io/kestra) is back with version 0.8.0, and this time, we're putting the spotlight on enhancing the flow creation experience. We've introduced powerful new features and developer tools that make Kestra the go-to data orchestration platform for data engineers like you.

## Improved developer experience

### First iteration of the low-code editor

This new release feature the first iteration of our low-code editor. The previous **Source** tab of the **Flow** page has been replaced with a new **Editor** page that allows editing the flow YAML, modifying the flow structure using drag-and-drop, and editing a task easily thanks to a form. This should greatly facilitate flow creation and modification. We’ll appreciate any feedback on it as we plan to improve it in the next release.

![Task metrics](/blogs/2023-04-13-welcome-kestra-0-8-0/lowcode-releasepost.gif)

### Task documentation in the editor

Each task has exhaustive documentation in the [plugin documentation](/plugins/) section of our website, but when you create a flow from the UI, switching from the editor to the plugin documentation site is not very convenient.

To limit context switching, we added a contextual panel in the flow editor displaying the current task documentation. So now you can keep your flow at hand while developing and still be close to the documentation.

![Task metrics](/blogs/2023-04-13-welcome-kestra-0-8-0/doc-in-editor.png)

### Improved EachSequential and EachParallel value definition

[EachSequential](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.EachSequential.html) and [EachParallel](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.EachParallel.html) are powerful tasks that allow to process a set of tasks multiple times based on some variables. Previously, the variable can only be defined as a string: now, it can be an array of strings or an array of objects.

## Task metrics

Tasks can emit metrics, those metrics are accessible as Micrometer metrics along with Kestra’s internal metrics and system metrics, and are also accessible from the UI … if you found them! It took me six weeks to figure out that task metrics can be accessible from the task attempt menu …

We now moved the storage of task metrics in a dedicated place out of the task attempt and added a new **Metrics** tab on the **Execution** page to access all the metrics of a flow execution.

![Task metrics](/blogs/2023-04-13-welcome-kestra-0-8-0/flow-metrics.png)

## New core tasks

### Log a message and fetch logs

Logging messages is one of the most common things developers do. In a Kestra flow, logging was previously done with the [Echo](/plugins/core/tasks/debugs/io.kestra.plugin.core.debug.Echo.html) task that was on a `debugs` group of plugins. The naming and semantics of the Echo task were not very good and with the new auto-completion feature, we think people may have difficulty finding it.
That’s why we created a new [Log](/plugins/core/tasks/log/io.kestra.plugin.core.log.Log.html) task to replace the old Echo task that is now deprecated (don’t panic, we will keep it around for a long time). This new task allows logging one or more messages at once.

We also added a new [Fetch](/plugins/core/tasks/log/io.kestra.plugin.core.log.Fetch.html) task to retrieve logs so now a flow can access its own log, for example, to send error logs from a notification task in case of failure.

### Fail task

We added a [Fail](/plugins/core/tasks/executions/io.kestra.plugin.core.execution.Fail.html) task that can fail an execution unconditionally or with a condition. It allows, for example, to fail based on some switch value or on some condition on a flow input.

### If task

We added an [If](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.If.html) task that can be used to process a set of tasks conditionally.

## Documentation

We worked a lot on our flow developer documentation lately to facilitate discovering all the wonderful things you can do with Kestra.

We wrote a new page about [data storage and processing](https://kestra.io/docs/developer-guide/storage/), we strongly advise everyone to read it as you can discover some previously hidden Kestra functionalities.

We wrote a new page about flow [tasks](https://kestra.io/docs/developer-guide/tasks/).

We created a [tutorial](https://kestra.io/docs/tutorial/) to discover the most important features one needs to know to write efficient data pipelines with Kestra.

And we also improved the quality of the [plugin documentation](/plugins/), we hope to find some time to improve it more in the upcoming weeks as we know that plugin documentation is sometimes sparse.


## Plugins

Kestra 0.8.0 introduces new plugins like the  [Google Cloud Dataproc serverless](/plugins/plugin-gcp/#dataproc) plugin to launch Dataproc batches (Spark) from Kestra, the [Microsoft Teams notification](/plugins/plugin-notifications/#teams) plugin to send notification messages to Microsoft Teams and the [SSH Command](/plugins/plugin-fs/ssh/io.kestra.plugin.fs.ssh.Command.html) task so send shell commands to a remote server with the SSH protocol.

## Enterprise Edition

We made changes to the way triggers of type [Flow](https://kestra.io/docs/developer-guide/triggers/flow.html) are processed when using the Kafka runner which should improve greatly the overall performance on the Kafka side when a lot of those triggers are used.


## Some other goodies

The [Pause](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.Pause.html) task has a new `timeout` property that can be used instead of a delay. At timeout, the Pause task will fail whereas at delay expiration it ends in success.
Flow executions have a new variable `originalId`, this identifier will not change between replays so can be used to uniquely identify a flow execution.
Flows can now be executed at a revision, this allows the execution of an old version of a flow.
If you use [helper functions](https://kestra.io/docs/developer-guide/cicd/helpers/) in your CI/CD, there is a new flow expand command that allows expanding the definition of a flow by including the external files from the helpers.
We also made a lot of small enhancements, fixes, and updates. See the [list of all the changes since 0.7.0](https://github.com/kestra-io/kestra/compare/v0.7.0...0.8.0).

We wanted to thank all the contributors who helped us make this release.


## What’s next?

We will continue to work on our low-code editor, please test it and provide feedback! We also plan to add some metrics dashboard on the flow page later, if this is of interest to you don’t hesitate to get in touch with us on this subject. And of course, we will add new tasks to integrate Kestra with more and more systems easily.

Be sure to follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. Please reach out to us on [Slack](https://kestra.io/slack) if you have any questions or want to share feedback. And if you love what we do, give a star on [our GitHub repository](https://github.com/kestra-io/kestra).
