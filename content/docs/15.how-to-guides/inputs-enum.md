---
title: Validate Inputs with Enum Data Type
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Kestra Workflow Components
---

Input validation with the Enum data type

## What are Inputs

Inputs allow you to dynamically pass data to your execution at runtime. For a detailed overview of inputs, see the [Inputs](../04.workflow-components/05.inputs.md) documentation page.

## Input validation with Enum data type

Let's now look at how to use the `ENUM` input type and the `Switch` task to validate user input and conditionally branch the flow based on the input value.

```yaml
id: orchestrate_everything
namespace: company.team

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
    type: io.kestra.plugin.core.flow.Switch
    value: "{{ inputs.use_case }}"
    cases:
      Data pipelines:
        - id: data_pipelines
          type: io.kestra.plugin.core.log.Log
          message: Managing important data products

      Microservices:
        - id: microservices
          type: io.kestra.plugin.core.log.Log
          message: Orchestrating critical applications

      Business processes:
        - id: business_processes
          type: io.kestra.plugin.core.log.Log
          message: Orchestrating critical applications

      Marketing automation:
        - id: marketing_automation
          type: io.kestra.plugin.core.log.Log
          message: Orchestrating critical applications
```

You can add an arbitrary number of cases to the `Switch` task, and each case can contain one or more tasks.

By using the `defaults` attribute, you can specify a default input value that will be prefilled in the dropdown menu in the UI when executing the flow.

::alert{type="info"}
Note that it's not possible to launch a workflow execution without selecting a value from the dropdown menu. The requirement for selecting a value guarantees that the flow is only executed with valid input `values` defined by the `ENUM` type.
::

