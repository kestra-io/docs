---
order: 6
---

# Errors and Retries

## Errors

When an error occurs during a task, your flow will fail. It can be interesting to execute some actions before terminating the flow, for example, sending mail to your team.

You can handle errors at the global level or the local level. Global-level error handling could involve sending a notification for any failed task, while individual flowable Tasks manage local-level error handling. With local error handling, you can monitor only the important Tasks or clean up specific resources created during execution.

### Defining an error handling

The property `errors` is an array of tasks. In the below example, we send a Slack message to notify the team that the flow failed.
```yaml
errors:
  - id: send
    type: io.kestra.plugin.notifications.slack.SlackExecution
    url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
    channel: "channelId"
    username: Kestra
    iconEmoji: ':kestra:'
    executionId: "{{ trigger.executionId }}"
```

Discover more on the [error handling](../../developer-guide/errors-handling) documentation.

### Adding global error handling to your flow

For simplicity, we will use the `Echo` Task to replace our mail sending when errors occur. Below `tasks`, we add the `errors` property containing our `Echo` Task.

```yaml
errors:
  - id: error-handling
    type: io.kestra.core.tasks.debugs.Echo
    format: "An error occurred."
```
## Retries

When a task fails, you can retry it. It is useful when you know that a Task can fail for a specific reason, and you want to retry it a few times before the flow goes down.

### Defining a retry

You can add retry to any task with the property `retry`. The property is an object with at least an ether constant, exponential, or random type.
In this example, we will retry the Task 5 times with a constant interval of 15 minutes.
```yaml
retry:
  maxAttempt: 5
  type: constant
  interval: PT15M
```

Learn more about [retry](../../developer-guide/retries) on the dedicated documentation page.

### Adding a retry to your flow

However, we have no control over the availability of the file, so it may be necessary to add a `retry` to our Task. The retry added with retry the Task every 10 minutes for 1 hour.

```yaml
  - id: download
    type: io.kestra.plugin.fs.http.Download
    uri: "https://www.data.gouv.fr/fr/datasets/r/d33eabc9-e2fd-4787-83e5-a5fcfb5af66d"
    retry:
      type: constant
      maxDuration: PT1H
      interval: PT10M
```

::: details Click here to see the full flow
```yaml
id: kestra-tutorial
namespace: io.kestra.tutorial
labels:
  env: PRD
description: |
  # Kestra Tutorial
  As you notice, we can use markdown here.
tasks:
  - id: download
    type: io.kestra.plugin.fs.http.Download
    uri: "https://www.data.gouv.fr/fr/datasets/r/d33eabc9-e2fd-4787-83e5-a5fcfb5af66d"
    retry:
      type: constant
      maxDuration: PT1H
      interval: PT10M
  - id: parallel
    type: io.kestra.core.tasks.flows.Parallel
    tasks:
      - id: analyze-data-sum
        type: io.kestra.core.tasks.scripts.Python
        runner: DOCKER
        dockerOptions:
          dockerHost: unix:///dind/docker.sock
          image: python
        inputFiles:
          data.csv: "{{outputs.download.uri}}"
          main.py: |
            import pandas as pd
            from kestra import Kestra
            data = pd.read_csv("data.csv", sep=";")
            sumOfConsumption = data['conso'].sum()
            Kestra.outputs({'sumOfConsumption': int(sumOfConsumption)})
        requirements:
          - pandas
      - id: analyze-data-mean
        type: io.kestra.core.tasks.scripts.Python
        runner: DOCKER
        dockerOptions:
          dockerHost: unix:///dind/docker.sock
          image: python
        inputFiles:
          data.csv: "{{outputs.download.uri}}"
          main.py: |
            import pandas as pd
            from kestra import Kestra
            data = pd.read_csv("data.csv", sep=";")
            meanOfConsumption = data['conso'].mean()
            Kestra.outputs({'meanOfConsumption': int(meanOfConsumption)})
        requirements:
          - pandas
errors:
  - id: error-handling
    type: io.kestra.core.tasks.debugs.Echo
    format: "An error occurred."
```
:::

<NextStep message="To provide a more robust and flexible execution environment, Kestra can run task within custom docker." link="../dockers/"></NextStep>