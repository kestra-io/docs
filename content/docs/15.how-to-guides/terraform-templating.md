---
title: Leverage Terraform for flow modularity
icon: /docs/icons/terraform.svg
---

Scale your codebase using Terraform to template and define flows

## Introduction

This article will show you how to leverage terraform in your Kestra codebase and its powerful templating features brought by HCL (Hashicorp Configuration Language).

In order to make your codebase easy to use for users unfamiliar with Kestra syntax, you may want to encapsulate most of the logic and DSL (Domain-specific programming language) into [Terraform modules](https://developer.hashicorp.com/terraform/language/modules).

This quick tutorial, will show you how templating capbilities brought by Terraform can help you :

- DRY (Do Not Repeat Yourself) your codebase
- Facilitate onboarding on Kestra
- Incorporate extra modularity
- Implement complex pipelines while keeping syntax clear

## Code structure

```
.
└── environment/
    ├── development
    ├── production/ # Contains subfolders defining Kestra flows resources
    │   ├── airbyte/
    │   ├── dbt/
    │   ├── triggers/
    │   ├── main.tf # Instanciate each folder (airbyte, dbt ...)
    │   └── ...
    ├── modules/ # Terraform modules to be used in environments
    │   ├── airbyte_sync/
    │   ├── trigger_cron/
    │   └── ...
    └── subflows/ # Kestra subflows
        ├── main.tf
        ├── sub_cloud_sql_airbyte_query.yml
        └── ...
```

Modules are folders under `modules` folder and can be instantiated either in `development` or `production` environments.

They only expose variables that are meant to be changed for usage purpose.

Inside a module, you can define a `main.tf` file that will define the resources to be created.

## Creating a module, example with Airbyte

Let's create a module that will define a Kestra flow that will sync data from Airbyte.

# tree structure of a terraform module :

```
.
└── airbyte_sync/
    ├── main.tf
    ├── tasks.yml
    └── variables.tf
```

### `main.tf`

```hcl
resource "kestra_flow" "airbyte_sync" {
  keep_original_source = true
  flow_id              = var.flow_id
  namespace            = var.namespace
  content = join("", [
    yamlencode({
      id          = var.flow_id
      namespace   = var.namespace
      labels      = var.priority != null ? merge(var.labels, { priority = var.priority }) : var.labels
      description = var.description
    }),
    templatefile("${path.module}/tasks.yml", {
      description         = var.description
      airbyte-url         = var.airbyte_url
      airbyte-connections = var.airbyte_connections
      max-duration        = var.max_sync_duration
      late-maximum-delay  = var.late_maximum_delay
      cron-expression     = var.cron_expression
    }),
    var.trigger,
  ])
}
```

## `variables.tf`

```hcl
variable "airbyte_connections" {
  description = "List of Airbyte connections to trigger : id (can be found in URL), name is whatever makes sense"
  type = list(object({
    name = string
    id   = string
  }))

  validation {
    condition = length(var.airbyte_connections) > 0 && length([
      for o in var.airbyte_connections : true
      if length(regexall("^[A-Za-z_]+$", o.name)) > 0
    ]) == length(var.airbyte_connections)
    error_message = "At least one connection should be provided, and connection names should not contain hyphens."
  }
}

variable "flow_id" {
  type = string
}

variable "description" {
  type = string
}

variable "namespace" {
  type    = string
  default = "blueprint"
}

variable "airbyte_url" {
  type = string
}

variable "trigger" {
  type        = string
  description = "String containing triggers sections of the flow"
  default     = ""
}

variable "max_sync_duration" {
  type        = string
  description = "Tell Kestra to wait logs for this max duration"
  default     = ""
}

variable "labels" {
  type        = map(string)
  default     = null
  description = "Labels to apply to the flow"
}

variable "priority" {
  type        = string
  default     = null
  description = "Priority tag to apply to the flow"
}

variable "cron_expression" {
  type        = string
  description = "Cron expression or supported expression like : @hourly"
  default     = null
}

variable "late_maximum_delay" {
  type        = string
  description = "Allow to disable auto-backfill : if the schedule didn't start after this delay, the execution will be skip."
}
```


## `tasks.yml`

```yaml
tasks:
%{ for connection in airbyte-connections ~}

  - id: "trigger_${connection.name}"
    type: io.kestra.plugin.airbyte.connections.Sync
    connectionId: ${connection.id}
    url: "${airbyte-url}"
    httpTimeout: "PT1M"
    wait: false

  - id: "check_${connection.name}"
    type: io.kestra.plugin.airbyte.connections.CheckStatus
    url: "${airbyte-url}"
    jobId: "{{ outputs.trigger_${connection.name}.jobId }}"
    pollFrequency: "PT1M"
    httpTimeout: "PT1M"
    retry:
      type: constant
      interval: PT1M
      maxAttempt: 5
    %{ if length(max-duration) > 0}
    maxDuration: "${max-duration}"
    %{ endif }
%{ endfor ~}

triggers:
  - id: cron_trigger
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "${cron-expression}"
    lateMaximumDelay: "${late-maximum-delay}"
```

## Using the module

Using the module will look like this :

```hcl
module "stripe_events_incremental" {
  source      = "../../../modules/airbyte_sync"
  flow_id     = "stripe_events"
  priority    = "high"
  namespace   = local.namespace
  description = "Stripe Events"
  airbyte_connections = [
    {
      name = "stripe_events_incremental"
      id   = module.airbyte_connection_stripe_offical.connection_id
    }
  ]
  max_sync_duration   = "PT30M"
  airbyte_url         = var.airbyte_url
  cron_expression     = "@hourly"
  late_maximum_delay  = "PT1H"
}
```

It is now easy to instantiate the module in your `main.tf` file, and to expose only the variables that are meant to be changed:
- `flow_id`: the flow id
- `namespace`: the namespace to save the flow in
- `description`: the description
- `airbyte_connections`: the list of Airbyte connections to trigger in a linear order
- `max_sync_duration`: the maximum duration to wait for logs
- `airbyte_url`: the Airbyte URL of the instance
- `cron_expression`: the cron expression to trigger the flow
- `late_maximum_delay`: the maximum delay to wait for the flow to start, in case of missed schedul

## Sublfow example: easily query and display results for a give Postgres database

Subflows are a way to encapsulate logic and make it reusable across your codebase.

Here is an example of a subflow that will query a Cloud SQL instance:

```yaml
id: query_my_postgres_database
namespace: prod.subflows
description: "Query Postgres database and display results in logs"

inputs:
- id: sqlQuery
  type: STRING
  defaults: "SELECT * FROM public.jobs ORDER BY created_at desc limit 1" # SQL query example

tasks:
- id: query_data
  type: io.kestra.plugin.jdbc.postgresql.Query
  url: jdbc:postgresql://MY_HOST/MY_DATABASE
  username: MY_USER
  password: "{{ secrets.get('my-postgres-password') }}"
  sql: "{{ inputs.sqlQuery }}"
  fetch: true

- id: show-result
  type: io.kestra.core.tasks.log.Log
  message: |
    {% for row in outputs.query_data.rows %}
      {%- for key in row.keySet() -%}
        {{key}} : {{row.get(key)}} |
      {%- endfor -%}
      \n
    {% endfor %}"
```

You can either execute this sublow as is, or use it in another flow to avoid repeating the same logic.

Executing the subflow will prompt you to enter the SQL query you want to execute :

![Subflow execution](content/docs/15.how-to-guides/assets/execute_sublow_query_my_postgres.png)

## Using the subflow in a flow

```yaml
  - id: query_last_job
    type: io.kestra.core.tasks.flows.Flow
    namespace: prod.subflows
    flowId: query_my_postgres_database
    inputs:
      sqlQuery: "SELECT * FROM public.jobs ORDER BY created_at desc limit 1"
    wait: true
    transmitFailed: true
```

1. Connection details are stored in the subflow, and only the SQL query is exposed to the user.
1. Subflow natively displays results in logs for easy debugging.

> Note: `wait: true` will wait for the subflow to finish before continuing the flow execution. `transmitFailed: true` will transmit the failed status of the subflow to the parent flow.

## Subflows vs Terraform templating

Subflows are a way to encapsulate logic and make it reusable across your codebase. However, they are not meant to be used for templating purposes.

Terraform templating is a way to define flows in a more modular way, and to expose only the variables that are meant to be changed.

## Conclusion

Terraform templating is a powerful way to define flows in a modular way, and to expose only the variables that are meant to be changed.

It is a great way to make your codebase more maintainable and to facilitate onboarding for users unfamiliar with Kestra syntax.
