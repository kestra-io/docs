---
title: Terraform for Kestra – Manage Resources as Code
h1: Provision Kestra Flows and Namespaces with the Terraform Provider
sidebarTitle: Terraform
icon: /src/contents/docs/icons/terraform.svg
description: Provision and manage Kestra resources like flows and namespaces as code using the official Kestra Terraform Provider.
---

Use Terraform to provision, manage, and automate changes to Kestra resources.

## Manage Kestra resources with Terraform

The [official Kestra Terraform Provider](https://registry.terraform.io/providers/kestra-io/kestra/latest) lets you manage Kestra resources as code.
Define flows, namespaces, and other resources declaratively, and Terraform creates, updates, and deletes them for you.

:::alert{type="info"}
For flows managed through CI/CD or infrastructure-as-code, add the [`system.readOnly`](../../../06.concepts/system-labels/index.md#systemreadonly) label set to `"true"` so the UI editor is disabled and production configurations stay immutable. This is especially recommended for critical production flows:

```yaml
labels:
  system.readOnly: true
```
:::

## Multitenancy

The Kestra Terraform provider supports **multitenancy**, allowing you to manage resources across multiple tenants from a single configuration.
When configuring the provider, include the `tenant_id` parameter to specify the tenant you want to target.

```hcl
provider "kestra" {
  tenant_id = "kestra-tech"
  url       = "http://your-kestra-url:8080"
}
```

## Example configuration

Start with a Terraform configuration file, typically named `provider.tf` or `main.tf`, that sets up the Kestra provider.

### `provider.tf`

```hcl
provider "kestra" {
  # Required: Kestra server URL
  url = "http://localhost:8080"

  # Required for multitenant environments
  tenant_id = "kestra-tech"

  # Optional: basic authentication
  username = "admin@example.com"
  password = var.kestra_password

  # Optional: API token (Enterprise Edition)
  api_token = var.kestra_api_token

  # Optional: JWT authentication (Enterprise Edition)
  jwt = "<your-jwt>"
}
```

### `version.tf`

Define the provider source and version to ensure compatibility.

```hcl
terraform {
  required_providers {
    kestra = {
      source  = "kestra-io/kestra"
      version = "~> 2.0"
    }
  }
}
```

### `flows.tf`

Create a flow resource from a YAML file that contains your flow definition. The flow's ID and namespace come from the file:

```hcl
resource "kestra_flow" "flow_example" {
  content = file("kestra/flows/my-flow.yml")
}
```

## Next steps

- Review the full [Kestra Terraform Provider documentation](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs).
- Use Terraform commands like `terraform validate`, `plan`, and `apply` to manage your Kestra infrastructure.
- Integrate Terraform into your [CI/CD pipeline](../index.md) for automated deployments.
