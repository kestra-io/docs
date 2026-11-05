---
title: Bulk Import Existing Kestra Resources
---

## Bulk Import Existing Kestra Resources

Terraform 1.14 introduced bulk import with the `list` block and `terraform query`. The Kestra provider exposes list resources for flows and namespaces so existing resources can be discovered before generating Terraform configuration.

## Requirements

Use Terraform 1.14 or newer and configure the Kestra provider against the Kestra instance that contains the unmanaged resources.

```hcl
terraform {
  required_version = ">= 1.14.0"

  required_providers {
    kestra = {
      source  = "kestra-io/kestra"
      version = "~> 2.0"
    }
  }
}
```

Configure the provider with the old Kestra instance:

```hcl
provider "kestra" {
  url      = var.kestra_url
  username = var.kestra_username
  password = var.kestra_password
}
```

## Query flows

The flow list resource can return flow identities only:

```hcl
list "kestra_flow" "all_flows" {
  provider = kestra
  limit    = 10000
}
```

Set `include_resource = true` when the query should also retrieve the resource state needed by Terraform's generated import configuration:

```hcl
list "kestra_flow" "all_flows" {
  provider         = kestra
  limit            = 10000
  include_resource = true
}
```

The provider paginates the Kestra API internally. A `limit` larger than the Kestra API page size is handled across multiple API pages.

## Query namespaces

The namespace list resource follows the same pattern:

```hcl
list "kestra_namespace" "all_namespaces" {
  provider         = kestra
  limit            = 1000
  include_resource = true
}
```

Only namespaces that exist in Kestra are listed. A namespace that is only implied, because it holds flows or prefixes another namespace without having been created itself, is left out.

## Generate configuration

Run the Terraform query with the variables used for the source Kestra instance:

```bash
terraform query \
  -var-file=tfvars \
  -generate-config-out=generated_kestra_imports.tf
```

Review the generated configuration before applying it to the target Terraform state.

## Limiting the discovery

Use `limit` to cap the number of list results returned by Terraform:

```hcl
list "kestra_flow" "sample" {
  provider = kestra
  limit    = 100
}
```

The `limit` value is a maximum result count for the query. It does not change the underlying Kestra resource data.

## Resource contents

With `include_resource = true`, the provider performs the additional read required to populate the managed resource representation:

- `kestra_flow` retrieves the full flow including source content.
- `kestra_namespace` retrieves the full namespace representation.

Without `include_resource`, the query only needs the identity information and avoids those additional resource reads.
