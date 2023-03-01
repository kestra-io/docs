---
order: 2
---

# Flow examples

The example from Kestra's guided tour is a good starting point; it is available when running Kestra for the first time and can be downloaded [here](/examples/example-guided-tour.yml).

Following is a list of other examples that can be downloaded:
- [allow-failure](/examples/flows_allow-failure.yml): This flow will allow a failure of a task and will continue, passing the execution as `WARNING`.
- [disable-simple](/examples/flows_disable-task.yml): This flow will never launch the `t2` task since it is disabled.
- [each-nested](/examples/flows_each.yml): Example of an each expression to iterate over a list of values.
- [errors](/examples/flows_errors.yaml): This flow will always fail, this will be handled by the `errors` branch tasks (cleaning a resource for example). All kinds of tasks can be used on the `errors` branch.
- [multiplecondition-listener](/examples/flows_multiplecondition-listeners.yml): This flow will start only if `multiplecondition-flow-a` and `multiplecondition-flow-b` are successful during the last 24h. You need the two flows [multiplecondition-flow-a](/examples/flows_multiplecondition-flow-a.yml) and [multiplecondition-flow-b](/examples/flows_multiplecondition-flow-b.yml) for it to work.
- [parallel](/examples/flows_parallel.yml): This flow will run 3 parallel tasks based on the `concurrent` property and will start the `last` task at the end.
- [pause](/examples/flows_pause.yml): This flow show how you can pause an execution in order to add a manual validation step.
- [retry](/examples/flows_retry.yml): This flow will be retry 4 times and will success at the 5th attempts.
- [sequential](/examples/flows_sequential.yml): This flow will start the 2 sequential tasks in parallel and those will launch tasks one after the other.
- [subflow](/examples/flows_subflow.yml): This flow will launch a subflow passing parameters as `inputs`, wait until the end of the flow and gather the output of a task.
- [switch](/examples/flows_switch.yml): Depending on the value passed as the input, the will flow branch to different tasks. If no matching value, the `defaults` task is used.
- [timeout](/examples/flows_timeout.yml): This flow will always fail because of a timeout.
- [trigger-flow](/examples/flows_trigger-flow.yml): Flow that is triggered based on the execution of another flow.
- [webhook](/examples/flows_webhook.yml): Example flow for a webhook trigger.
- [bash-docker-with-files](/examples/scripts_bash-docker-with-files.yml): This flow will use the `alpine` Docker image, install a package and decompress a file passed as input. It will also export the file size as metrics and the `mineType` of the file as outputs.
- [bash-with-files](/examples/scripts_bash-with-files.yml): This flow show how to pass files between tasks.
- [python-pip](/examples/scripts_python-pip.yml): This flow will install the pip package, and use the Python Kestra library to generate outputs and metrics.