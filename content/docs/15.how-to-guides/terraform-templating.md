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
    ├── variables.tf
    ├── tasks.yml
    └── outputs.tf
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
      MAX_DURATION        = var.max_sync_duration
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
    %{ if length(MAX_DURATION) > 0}
    maxDuration: "${MAX_DURATION}"
    %{ endif }

%{ endfor ~}
```

## Subflows vs Terraform templating



## Example
