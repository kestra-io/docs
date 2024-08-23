---
title: Terraform
icon: /docs/icons/terraform.svg
---

How to use Terraform to provision and manage changes to Kestra resources.

## Kestra Provider

You can use the [Official Kestra Provider](https://registry.terraform.io/providers/kestra-io/kestra/latest) to provision and manage changes to Kestra resources.

## Multitenancy

The Kestra Terraform provider supports multitenancy, allowing you to manage resources across multiple tenants.

When configuring the provider, make sure to specify the `tenant_id` parameter with the tenant ID you want to interact with.

```hcl
provider "kestra" {
  tenant_id = "kestra-tech"
  url = "https://us.kestra.cloud"
}
```


## Example configuration

::alert{type="warning"}
Flows should always be deployed before [Templates](../../11.migration-guide/0.11.0/templates.md), to avoid flows running before their templates are created.
::

First, you need to create a `provider.tf` or `main.tf` file with the following content to configure the provider:

#### **`provider.tf`**

```hcl
provider "kestra" {
  # mandatory, the URL for kestra
  url = "http://localhost:8080"

  # mandatory when using multitenancy, the ID of your tenant
  tenant_id = "kestra-tech"

  # optional basic auth username
  username = "john"

  # optional basic auth password
  password = "my-password"

  # optional API token, can be used instead of basic auth in the Enterprise Edition
  api_token = "my-api-token"

  # optional jwt token
  jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Iktlc3RyYS5pbyIsImlhdCI6MTUxNjIzOTAyMn0.hm2VKztDJP7CUsI69Th6Y5NLEQrXx7OErLXay55GD5U"
}
```

Then, you define the source and the version of the provider:

#### **`version.tf`**
```hcl
kestra = {
  source  = "kestra-io/kestra"
  version = "~> 0.18.1"
}
```

Finally, you can create your resources:

#### **`flows.tf`**
```hcl
resource "kestra_flow" "flow-example" {
  namespace = "company.team"
  flow_id = "myflow"
  content = file("kestra/flows/my-flow.yml")
}
```

#### **`templates.tf`**
```hcl
resource "kestra_template" "template-example" {
  namespace = "company.team"
  template_id = "my-template"
  content = file("kestra/templates/my-template.yml")
  depends_on = [kestra_flow.flow-example] # Here we ensure that the flow is deployed before the template
}
```

More details can be found [in the Terraform registry](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs).