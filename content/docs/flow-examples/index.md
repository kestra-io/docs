---
title: Flow examples
---

The example from Kestra's guided tour is a good starting point; it is available when running Kestra for the first time and can see here: [Example guided tour](./example-guided-tour.md).

Following is a list of other examples that can be downloaded:
- [Allow failure](./allow-failure.md): This flow will allow a failure of a task and will continue, passing the execution as `WARNING`.
- [Disable simple](./disable-simple.md): This flow will never launch the `t2` task since it is disabled.
- [Each nested](./each-nested.md): Example of an each expression to iterate over a list of values.
- [Errors](./errors.md): This flow will always fail, this will be handled by the `errors` branch tasks (cleaning a resource for example). All kinds of tasks can be used on the `errors` branch.
- [Multipleconditionlistener](./multiplecondition-listener.md): This flow will start only if `multiplecondition-flow-a` and `multiplecondition-flow-b` are successful during the last 24h. You need the two flows [multiplecondition-flow-a](/examples/flows_multiplecondition-flow-a.yml) and [multiplecondition-flow-b](/examples/flows_multiplecondition-flow-b.yml) for it to work.
- [Parallel](./parallel.md): This flow will run three parallel tasks based on the `concurrent` property and will start the `last` task at the end.
- [Pause](./pause.md): This flow shows how you can pause an execution to add a manual validation step.
- [Retry](./retry.md): This flow will be retried four times and will succeed at the 5th attempt.
- [Sequential](./sequential.md): This flow will start the two sequential tasks in parallel and those will launch tasks one after the other.
- [Subflow](./subflow.md): This flow will launch a subflow passing parameters, waiting until the end of the flow and gathering the output of a task.
- [Switch](./switch.md): Depending on the value passed as the input, the will flow branch to different tasks. If there is no matching value, the `defaults` task is used.
- [Timeout](./timeout.md): This flow will always fail because of a timeout.
- [Trigger flow](./trigger-flow.md): Flow that is triggered based on the execution of another flow.
- [Webhook](./webhook.md): Example flow for a webhook trigger.
- [Bash with files](./bash-with-files.md): This flow shows how to pass files between tasks.
- [Python Pip](./python-pip.md): This flow will install the pip package, and use the Python Kestra library to generate outputs and metrics.