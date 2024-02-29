---
title: Using Inputs
icon: /docs/icons/tutorial.svg
---

This page provides a deep dive into how you can use inputs in various use cases.

## What are inputs

Inputs allow you to dynamically pass data to your execution at runtime. For a detailed overview of inputs, see the [Inputs](../06.workflow-components/06.inputs.md) documentation page.

## Passing inputs via an API call

Let's assume the following flow:

```yaml
id: inputs_demo
namespace: dev

inputs:
  - id: user
    type: STRING
    defaults: Rick Astley

tasks:
  - id: hello
    type: io.kestra.core.tasks.log.Log
    message: Hey there, {{ inputs.user }}
```

To trigger that flow with a different input via an API call, you can use the form data:

```yaml
id: api_call
namespace: dev
tasks:
  - id: basic_auth_api
    type: io.kestra.plugin.fs.http.Request
    uri: http://host.docker.internal:8080/api/v1/executions/dev/inputs_demo
    method: POST
    contentType: multipart/form-data
    formData:
      user: John Doe
```

The above example assumes you run Kestra locally in Docker. If you run Kestra in a different environment, replace `http://host.docker.internal:8080` with the correct URL.

If you configured basic authentication for your Kestra instance, you can add the `basicAuthUser` and `basicAuthPassword` options to the `Request` task:

```yaml
id: api_call
namespace: dev
tasks:
  - id: basic_auth_api
    type: io.kestra.plugin.fs.http.Request
    uri: http://host.docker.internal:8080/api/v1/executions/dev/inputs_demo
    options:
      basicAuthUser: admin
      basicAuthPassword: admin
    method: POST
    contentType: multipart/form-data
    formData:
      user: John Doe
```

## Input validation with Enum data type

Let's now look at how to use the `ENUM` input type and the `Switch` task to validate user input and conditionally branch the flow based on the input value.

```yaml
id: orchestrate_everything
namespace: blueprints

inputs:
  - id: use_case
    description: What do you want to orchestrate?
    type: ENUM
    defaults: Data pipelines
    values:
      - Data pipelines
      - Microservices
      - Business processes
      - Marketing automation

tasks:
  - id: conditional_branching
    type: io.kestra.core.tasks.flows.Switch
    value: "{{ inputs.use_case }}"
    cases:
      Data pipelines:
        - id: data_pipelines
          type: io.kestra.core.tasks.log.Log
          message: Managing important data products

      Microservices:
        - id: microservices
          type: io.kestra.core.tasks.log.Log
          message: Orchestrating critical applications

      Business processes:
        - id: business_processes
          type: io.kestra.core.tasks.log.Log
          message: Orchestrating critical applications

      Marketing automation:
        - id: marketing_automation
          type: io.kestra.core.tasks.log.Log
          message: Orchestrating critical applications
```

You can add an arbitrary number of cases to the `Switch` task, and each case can contain one or more tasks.

By using the `defaults` attribute, you can specify a default input value that will be prefilled in the dropdown menu in the UI when executing the flow.

::alert{type="info"}
Note that it's not possible to launch a workflow execution without selecting a value from the dropdown menu. The requirement for selecting a value guarantees that the flow is only executed with valid input `values` defined by the `ENUM` type.
::

