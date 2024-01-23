---
title: Namespace management
---

::alert{type="info"}
This feature requires a [commercial license](https://kestra.io/pricing).
::

Kestra is a [multi-tenant](multi-tenancy.md) platform. Each tenant can have multiple namespaces, and each namespace provides additional isolation and security.

Once you create a namespace, you can manage the following on a namespace-level:
- [secrets](secret.md)
- [variables](variables.md)
- [task defaults](task-defaults.md)

## Creating a namespace

You can create a namespace from the Kestra UI or programmatically via [Terraform](../11.terraform/resources/namespace.md).

## Adding Variables to a Namespace

You can add variables to a namespace from the Kestra UI or programmatically via [Terraform](../11.terraform/resources/namespace.md).

```terraform
resource "kestra_namespace" "example" {
  namespace_id  = "data"
  description   = "Namespace for the data team"
  variables     = <<EOT
repository_name: "https://github.com/kestra-io/kestra
github:
  token: "{{ secret('GITHUB_TOKEN') }}"
EOT
}
```

## Adding Task Defaults to a Namespace

You can add task defaults to a namespace from the Kestra UI or programmatically via [Terraform](../11.terraform/resources/namespace.md).

```terraform
resource "kestra_namespace" "example" {
  namespace_id  = "data"
  description   = "Namespace for the data team"
  task_defaults = <<EOT
- type: io.kestra.plugin.aws
  values:
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    region: "{{ us-east-1 }}"
- type: io.kestra.core.tasks.log.Log
  values:
    level: DEBUG
EOT
}
```

## Adding Secrets to a Namespace

Also here, you can add secrets to a namespace from the Kestra UI or programmatically via [Terraform](../11.terraform/resources/namespace.md).

```terraform
resource "kestra_namespace_secret" "example" {
  namespace    = "data"
  secret_key   = "GITHUB_TOKEN"
  secret_value = var.github_token
}
```