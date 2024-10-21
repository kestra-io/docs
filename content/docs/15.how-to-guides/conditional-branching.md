---
title: Conditional Branching
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Concepts
---

How to use the Switch task to branch the flow based on a value.


Conditional branching is a process in which the execution of a task is directed along different paths based on specific values. In a flow, it allows for decision-making, where different tasks are executed depending on the value provided.

In this guide, you'll learn how to use Kestra's `Switch` task to control your flow based on a value passed. Depending on the value passed in the `Switch` task, the flow will branch to different task `cases` to execute a specific task. If there is no matching value, Kestra will use the `defaults` branch.

## Prerequisites

Before you begin:

- Deploy [Kestra](../02.installation/index.md) in your preferred development environment.
- Ensure you have a [basic understanding of how to run Kestra flows.](../01.getting-started/03.tutorial.md)

## Example 1: Conditional Branching with Input Strings

This flow template serves as an introductory example to understand how the `Switch` task works within Kestra. The flow dynamically branches to different tasks depending on the input string. To see the flow in action, define the `switch` flow as shown below:

```yaml
id: switch
namespace: company.team

inputs:
  - id: string
    type: STRING

tasks:
  - id: parent-seq
    type: io.kestra.plugin.core.flow.Switch
    value: "{{inputs.string}}"
    cases:
      FIRST:
        - id: first
          type: io.kestra.plugin.core.debug.Return
          format: "{{task.id}} > {{taskrun.startDate}}"
      SECOND:
        - id: second1
          type: io.kestra.plugin.core.debug.Return
          format: "{{task.id}} > {{taskrun.startDate}}"
        - id: second2
          type: io.kestra.plugin.core.debug.Return
          format: "{{task.id}} > {{taskrun.startDate}}"
      THIRD:
        - id: third1
          type: io.kestra.plugin.core.flow.Sequential
          tasks:
            - id: failed
              type: io.kestra.plugin.core.execution.Fail
          errors:
            - id: error1
              type: io.kestra.plugin.core.debug.Return
              format: "Error Trigger ! {{task.id}}"
    defaults:
      - id: default
        type: io.kestra.plugin.core.debug.Return
        format: "{{task.id}} > {{taskrun.startDate}}"

outputs:
  - id: extracted
    type: STRING
    value: "{{ outputs.first ?? outputs.second1 ?? outputs.third1 ?? outputs.default }}"
```

Save and execute the `switch` flow.

You can input `FIRST`, `SECOND`, `THIRD`, or any other input string to see the flow in action. The above flow when executed checks a sequence of tasks based on the input string you provide.

Within the flow:

- `inputs`: Takes a string input to determine which case to execute.
- `tasks`: Handles the input string with the following values:
    - `id: parent-seq`: Uses the `Switch` task to evaluate the input string and execute a case that matches the input string with the following cases:
        - `FIRST`: Executes task `first`, returning its ID and start time.
        - `SECOND`: Executes two tasks (`second1` and `second2`), both returning their task ID and start time.
        - `THIRD`: Runs a sequence of tasks where the `failed` task triggers an error and executes the `error1` task, which logs an error message.
    - `defaults`: If the input doesn't match any cases, it runs the `default` task and logs the task ID and start time.
- `outputs`: Extracts and logs the output from one of the executed tasks (`first`, `second1`, `third1`, or `default`).

## Example 2: Conditional branching with Kestra’s website status

To see the `Switch` task in action without an input string, we’ll create a flow to make a decision based on the status of an HTTP request to Kestra’s website.  To follow along and implement this, define the `kestra-http-switch` flow as described below:

```yaml
id: kestra-http-switch
namespace: company.team

tasks:
  - id: check_kestra_site
    type: io.kestra.plugin.scripts.python.Script
    outputFiles:
      - site_status.txt
    script: |
      import requests
      response = requests.head("https://kestra.io")
      with open('site_status.txt', 'w') as f:
          f.write(str(response.status_code))

  - id: decide_site_status
    type: io.kestra.plugin.core.flow.Switch
    value: "{{ read(outputs.check_kestra_site.outputFiles['site_status.txt']) }}"
    cases:
      "200":
        - id: log-site-up
          type: io.kestra.plugin.core.log.Log
          message: "Kestra website is up and running. Status: 200"

      "404":
        - id: log-site-down
          type: io.kestra.plugin.core.log.Log
          message: "Kestra website not found. Status: 404"

    defaults:
      - id: unknown-status
        type: io.kestra.plugin.core.log.Log
        message: "Received unexpected status code: {{ read(outputs.check_kestra_site.outputFiles['site_status.txt']) }}"

outputs:
  - id: status-output
    type: STRING
    value: "{{ outputs.log-site-up ?? outputs.log-site-down ?? outputs.unknown-status }}"

```

Save and execute the `kestra-http-switch` flow.

The above flow when executed checks the status of Kestra’s website and logs a message depending on the response code returned.

Within the flow:

- `tasks`: Handles the status check of the Kestra website with the following tasks:
    - `id: check_kestra_site`: Executes a Python script to send a HEAD request to the Kestra website and writes the HTTP status code to a `site_status.txt` file.
    - `id: decide_site_status`: Utilizes the `Switch` task  to evaluate the HTTP status code from the `check_kestra_site` task:
        - If the status code is `"200"`, it logs a message indicating the site is up.
        - If the status code is `"404"`, it logs a message indicating the site is not found.
        - If an unexpected status code is received, it falls back to the `defaults` branch with a message indicating unknown status.
- `outputs`: Extracts and logs the output status message based on the logs generated from the `Switch` task.

## Next Steps

You have implemented conditional branching with the `Switch` task using the `switch` flow to check your input strings and `kestra-http-switch` flow to check Kestra’s website status.  The `Switch` task can further be implemented in various use cases to support your flows. Further resources about the `Switch` task:

- [Kestra’s official Switch task plugin documentation](/plugins/core/tasks/flow/io.kestra.plugin.core.flow.switch)
- [Kestra’s Blueprint Switch task use cases](/blueprints?page=1&size=24&q=switch)
