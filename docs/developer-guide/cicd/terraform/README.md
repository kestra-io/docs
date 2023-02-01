---
order: 3
---

# Terraform

## Kestra Provider

You can use the [Official Kestra Provider](https://registry.terraform.io/providers/kestra-io/kestra/latest) to manage
every available resources in Kestra.

## Examples

#### **`provider.tf`**
```hcl
provider "kestra" {
  # mandatory, the url to kestra
  url = "http://localhost:8080"

  # optional basic auth username
  username = "john"

  # optional basic auth password
  password = "my-password"

  # optional jwt token
  jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Iktlc3RyYS5pbyIsImlhdCI6MTUxNjIzOTAyMn0.hm2VKztDJP7CUsI69Th6Y5NLEQrXx7OErLXay55GD5U"
}
```

#### **`version.tf`**
```hcl
kestra = {
  source  = "kestra-io/kestra"
  version = "~> 0.1.9"
}
```

#### **`flows.tf`**
```hcl
resource "kestra_flow" "example" {
  namespace = "io.kestra"
  flow_id = "my-flow"
  content = file("my-flow.yml")
}
```

More details can be [here](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs).