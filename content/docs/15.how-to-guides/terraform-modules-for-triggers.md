---
title: Modularize your triggers and schedules with Terraform
icon: /docs/icons/terraform.svg
---

Scale your codebase using Terraform to template and make scheduling a breeze

## Introduction

As seen in this [terraform templating](/docs/how-to-guides/terraform-templating) guide, you can leverage Terraform to template and define flows.

Managing triggers and schedules can be a **tedious task**, especially when you have a lot of flows generating **peak hours** due to reuse of same trigger schedules.

This guide will show you how to use Terraform to define triggers and schedules for your flows with modularity.

## Code structure

```
.
└── environment/
    ├── development
    ├── production/ # Contains subfolders defining Kestra flows resources
    │   ├── airbyte/
    │   └── ...

    ├── modules/ # Terraform modules to be used in environments
    │   ├── trigger_cron/
    │   ├── trigger_cron_hourly_random/
    │   ├── trigger_flow/
    │   ├── trigger_webhook/
    │   └── ...

```

We will leverage `null_resource` or `terraform_data` to create reusable resources to DRY (Do not Repeat Yourself) your trigger definitions.

## Example of Cron schedule implementation

Below an example of implementation for a Terraform module that defines a cron schedule trigger.

`triggers.yml`
```YAML
triggers:
  - id: ${cron-name}
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "${cron-expression}"
    lateMaximumDelay: "${late-maximum-delay}"
```


`main.tf`
```hcl
resource "null_resource" "trigger_cron" {
  triggers = {
    value = templatefile("${path.module}/triggers.yml", {
      cron-name          = var.cron_name
      cron-expression    = var.cron_expression
      late-maximum-delay = var.late_maximum_delay
    })
  }
}
```

`variables.tf`
```hcl
variable "cron_expression" {
  type        = string
  description = "Cron expression or supported expression like : @hourly"
  default     = null
}

variable "cron_name" {
  type        = string
  description = "Provide a description of your Cron expression for simplicity"
  default     = null
}

variable "late_maximum_delay" {
  type        = string
  description = "Allow to disable auto-backfill : if the schedule didn't start after this delay, the execution will be skip."
}
```

`outputs.tf`
```hcl
output "trigger_content" {
  value = null_resource.trigger_cron.triggers.value
}
```

Usage of this module would look like :

```hcl
module "trigger_purge" {
  source             = "../../../../modules/trigger_cron"
  cron_expression    = "0 0 * * 0"
  cron_name          = "weekly_kestra_purge"
  late_maximum_delay = "PT1H"
}
```

