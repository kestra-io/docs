---
title: 🔎 Flow examples
---

The example from Kestra's guided tour is a good starting point; it is available when running Kestra for the first time and can see here: [Example guided tour](/docs/flow-examples/example-guided-tour).

Following is a list of other examples that can be downloaded:
- [Allow failure](/docs/flow-examples/allow-failure): This flow will allow a failure of a task and will continue, passing the execution as `WARNING`.
- [Disable simple](/docs/flow-examples/disable-simple): This flow will never launch the `t2` task since it is disabled.
- [Each nested](/docs/flow-examples/each-nested): Example of an each expression to iterate over a list of values.
- [Errors](/docs/flow-examples/errors): This flow will always fail, this will be handled by the `errors` branch tasks (cleaning a resource for example). All kinds of tasks can be used on the `errors` branch.
- [Multipleconditionlistener](/docs/flow-examples/multiplecondition-listener): This flow will start only if `multiplecondition-flow-a` and `multiplecondition-flow-b` are successful during the last 24h. You need the two flows [multiplecondition-flow-a](/examples/flows_multiplecondition-flow-a.yml) and [multiplecondition-flow-b](/examples/flows_multiplecondition-flow-b.yml) for it to work.
- [Parallel](/docs/flow-examples/parallel): This flow will run three parallel tasks based on the `concurrent` property and will start the `last` task at the end.
- [Pause](/docs/flow-examples/pause): This flow shows how you can pause an execution to add a manual validation step.
- [Retry](/docs/flow-examples/retry): This flow will be retried four times and will succeed at the 5th attempt.
- [Sequential](/docs/flow-examples/sequential): This flow will start the two sequential tasks in parallel and those will launch tasks one after the other.
- [Subflow](/docs/flow-examples/subflow): This flow will launch a subflow passing parameters, waiting until the end of the flow and gathering the output of a task.
- [Switch](/docs/flow-examples/switch): Depending on the value passed as the input, the will flow branch to different tasks. If there is no matching value, the `defaults` task is used.
- [Timeout](/docs/flow-examples/timeout): This flow will always fail because of a timeout.
- [Trigger flow](/docs/flow-examples/trigger-flow): Flow that is triggered based on the execution of another flow.
- [Webhook](/docs/flow-examples/webhook): Example flow for a webhook trigger.
- [Bash with files](/docs/flow-examples/bash-with-files): This flow shows how to pass files between tasks.
- [Bash docker with files](/docs/flow-examples/bash-docker-with-files): This flow will use the `alpine` Docker image, install a package and decompress a file passed as input. It will also export the file size as metrics and the `mimeType` of the file as outputs.
- [Python Pip](/docs/flow-examples/python-pip): This flow will install the pip package, and use the Python Kestra library to generate outputs and metrics.