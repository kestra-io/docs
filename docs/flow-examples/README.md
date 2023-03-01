---
order: 2
---

# Flow examples

The example from Kestra's guided tour is a good starting point; it is available when running Kestra for the first time and can be downloaded [here](example-guided-tour.yml).

Following is a list of other examples that can be downloaded:
- [allow-failure](flows_allow-failure.yml): This flow will allow a failure of a task and will continue, passing the execution as `WARNING`.
- [disable-simple](flows_disable-task.yml): This flow will never launch the `t2` task since it is disabled.
- [each-nested](flows_each.yml): Example of an each expression to iterate over a list of values.
- [errors](flows_errors.yaml): This flow will always fail, this will be handled by the `errors` branch tasks (cleaning a resource for example). All kinds of tasks can be used on the `errors` branch.
- [multiplecondition-listener](flows_multiplecondition-listeners.yml): This flow will start only if `multiplecondition-flow-a` and `multiplecondition-flow-b` are successful during the last 24h. You need the two flows [multiplecondition-flow-a](flows_multiplecondition-flow-a.yml) and [multiplecondition-flow-b](flows_multiplecondition-flow-b.yml) for it to work.
- [parallel](flows_parallel.yml): This flow will run 3 parallel tasks based on the `concurrent` property and will start the `last` task at the end.
- [pause](flows_pause.yml): This flow show how you can pause an execution in order to add a manual validation step.
- [retry](flows_retry.yml): This flow will be retry 4 times and will success at the 5th attempts.
- [sequential](flows_sequential.yml): This flow will start the 2 sequential tasks in parallel and those will launch tasks one after the other.
- [subflow](flows_subflow.yml): This flow will launch a subflow passing parameters as `inputs`, wait until the end of the flow and gather the output of a task.
- [switch](flows_switch.yml): Depending on the value passed as the input, the will flow branch to different tasks. If no matching value, the `defaults` task is used.
- [timeout](flows_timeout.yml): This flow will always fail because of a timeout.
- [trigger-flow](flows_trigger-flow.yml): Flow that is triggered based on the execution of another flow.
- [webhook](flows_webhook.yml): Example flow for a webhook trigger.
- [bash-docker-with-files](scripts_bash-docker-with-files.yml): This flow will use the `alpine` Docker image, install a package and decompress a file passed as input. It will also export the file size as metrics and the `mineType` of the file as outputs.
- [bash-with-files](scripts_bash-with-files.yml): This flow show how to pass files between tasks.
- [python-pip](scripts_python-pip.yml): This flow will install the pip package, and use the Python Kestra library to generate outputs and metrics.