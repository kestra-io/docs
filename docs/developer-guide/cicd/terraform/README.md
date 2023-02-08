---
order: 3
---

# Terraform

## Kestra Provider

You can use the [Official Kestra Provider](https://registry.terraform.io/providers/kestra-io/kestra/latest) to manage
every available resource in Kestra.

## Examples

::: warning
Flows should always be deployed before Templates, to avoid flows running before their templates are created.
:::

First, you need to create a `provider.tf` or `main.tf` file with the following content to configure the provider:

#### **`provider.tf`**
```hcl
provider "kestra" {
  # mandatory, the URL for kestra
  url = "http://localhost:8080"

  # optional basic auth username
  username = "john"

  # optional basic auth password
  password = "my-password"

  # optional jwt token
  jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Iktlc3RyYS5pbyIsImlhdCI6MTUxNjIzOTAyMn0.hm2VKztDJP7CUsI69Th6Y5NLEQrXx7OErLXay55GD5U"
}
```

Then, you define the source and the version of the provider:

#### **`version.tf`**
```hcl
kestra = {
  source  = "kestra-io/kestra"
  version = "~> 0.1.9"
}
```

Finally, you can create your resources:

#### **`flows.tf`**
```hcl
resource "kestra_flow" "flow-example" {
  namespace = "io.kestra"
  flow_id = "my-flow"
  content = file("kestra/flows/my-flow.yml")
}
```

#### **`templates.tf`**
```hcl
resource "kestra_template" "template-example" {
  namespace = "io.kestra"
  template_id = "my-template"
  content = file("kestra/templates/my-template.yml")
  depends_on = [kestra_flow.flow-example] # Here we ensure that the flow is deployed before the template
}
```

More details can be found [here](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs).