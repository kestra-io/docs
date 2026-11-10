---
title: "Namespace Management in Kestra Enterprise: Isolation"
h1: Configure Isolated Namespaces with Secrets and Policies
description: Secure your Kestra instance with Namespace Management. Configure isolated environments, manage secrets, and set Namespace-level Policies.
sidebarTitle: Namespace Management
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
docId: namespace.management
---

Namespaces provide an additional layer of isolation for secrets, variables, and Policies within a tenant.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/As4y2oliD_8?si=d-2AsAuqlwaBFuEX" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Namespace management — secure configuration

Kestra is a [multi-tenant](../../02.governance/tenants/index.md) platform. Each tenant can have multiple Namespaces, and each Namespace provides additional isolation and security.

Namespaces provide:
- Logical isolation of resources on top of instance- or tenant-level isolation
- Fine-grained access control for secrets, variables, and task configurations

Namespaces are particularly useful in environments with many users, teams, projects, and applications.

## Namespace-level features

The Namespace page allows you to configure secrets, Policies, and variables that can be used within any flow in that Namespace.

It allows your organization to centrally manage your secrets, variables, and task configuration while providing fine-grained access-control to those resources.

Since Kestra supports [everything as code and from the UI](https://youtu.be/dU3p6Jf5fMw?si=bqNWS1e3_if-mePS), you can manage Namespaces from the UI or programmatically (e.g., via our [Terraform provider](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs)).

### Secrets

Secrets are managed from the **Secrets** tab on the namespace page. Each secret has a key and value; action buttons on each row edit or delete it. Secrets are referenced in flows using `"{{ secret('KEY_NAME') }}"`.

For APIs that issue short-lived access tokens (e.g., OAuth2), a [Credential](../../03.auth/credentials/index.md) built on these secrets provides a token via `{{ credential('your_credential_key') }}`.

Example usage in a flow:

```yaml
id: query-mysql
namespace: company.team

tasks:
  - id: query
    type: io.kestra.plugin.jdbc.mysql.Query
    url: jdbc:mysql://localhost:3306/test
    username: root
    password: "{{ secret('MYSQL_PASSWORD') }}"
    sql: select * from employees
    fetchOne: true
```

:::alert{type="info"}
Make sure to only use the secret in flows defined in the same Namespace (or child Namespace) as your secret.
:::

When building new flows in a Namespace, Namespace secrets are accessible from the **Secrets** tab. Open the tab to view all available Namespace secret key names.

### Policies

[Policies](../policies/index.md) can be defined at the Namespace level to inject, restrict, or validate configuration for all flows in the Namespace. Policies are managed from the **Policies** tab on the namespace page.

Policies can reference secrets and variables defined in the same Namespace.

For example, a namespace-scoped Policy can inject database credentials into every MySQL task so flows don't need to declare them individually:

```yaml
id: mysql-credentials
description: "Inject MySQL credentials for all MySQL tasks in this namespace."
enforcement: ACTIVE
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: PLUGIN
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.jdbc.mysql
    values:
      url: jdbc:mysql://localhost:3306/test
      username: root
      password: "{{ secret('MYSQL_PASSWORD') }}"
```

With this Policy applied, flows in the Namespace need no credentials on the task:

```yaml
id: query-mysql
namespace: company.team

tasks:
  - id: query
    type: io.kestra.plugin.jdbc.mysql.Query
    sql: select * from employees
    fetchOne: true
```

Namespace-level Policies are inherited by child Namespaces. A Policy created in a parent Namespace applies to all flows in the parent and every child Namespace under it. See [Policies](../policies/index.md) for the full DSL reference, enforcement modes, and inheritance behavior.

### Default service account for SDK plugins

Namespaces can now provide **default authentication credentials** that [SDK-based plugins](/plugins/plugin-kestra) use to run tasks such as [List all Namespaces](/plugins/plugin-kestra/kestra-namespaces/io.kestra.plugin.kestra.namespaces.list). This allows tasks relying on the [Kestra SDK](../../../api-reference/kestra-sdk/index.mdx) to call the API without hard-coding credentials inside the flow.

On the Namespace **Edit** page, open the **Default authentication** section and choose either:
- **API token** (recommended), or
- **Basic auth** (username/password)

### Variables

Variables defined at the Namespace level can be used in any flow defined under the same Namespace using the syntax: `{{ namespace.variable_name }}`.

Variables are managed from the **Variables** tab on the namespace page.

Example flow using a namespace variable:

```yaml
id: query-mysql
namespace: company.team

tasks:
  - id: query
    type: io.kestra.plugin.jdbc.mysql.Query
    url: jdbc:mysql://localhost:3306/test
    username: "{{ namespace.mysql_user }}"
    sql: select * from employees
    fetchOne: true
```

When building new flows in a Namespace, Namespace variables are accessible from the **Variables** tab.

## Creating Namespaces

### From the UI

The video below shows how to create a namespace and add several secrets and a nested Namespace variable that references one of them. It was recorded before Kestra 2.0, so it also adds plugin defaults for the AWS and Git plugins. In Kestra 2.0, a namespace-scoped [Policy](#policies) applies those values instead.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/rHMAAADQQN8?si=V-yUnGzWJfkB-ONt" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### From Terraform

The following example reproduces those steps in Terraform.

To create a Namespace from Terraform, use the [kestra_namespace](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs) resource.

Configure your Terraform backend and add Kestra as a required provider:

```hcl
terraform {
  backend "s3" {
    bucket = "kestraio"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
  required_providers {
    kestra = {
      source  = "kestra-io/kestra"
      version = "~> 2.3"
    }
  }
}

provider "kestra" {
  url       = var.kestra_host
  username  = var.kestra_user
  password  = var.kestra_password
  tenant_id = var.kestra_tenant_id # only if you are using multi-tenancy
}
```

Add a `main.tf` file to your Terraform project:

```hcl
resource "kestra_namespace" "marketing" {
  namespace_id  = "marketing"
  description   = "Namespace for the marketing team"
}
```

The only required property is the `namespace_id`, which is the name of the Namespace. The `description` and all other properties are optional.

#### Adding variables and Policies to a Namespace with Terraform

Variables are set directly on the Namespace resource. Policies are a separate [kestra_policy](../../../13.terraform/resources/policy/index.md) resource attached to the Namespace. Both read their content from YAML files.

Create the `variables_marketing.yml` file:

```yaml
github:
  token: "{{ secret('GITHUB_TOKEN') }}"
```

Then, create a `policy_marketing.yml` file. This Policy adds AWS credentials to every AWS task and Git credentials to every Git task in the Namespace:

```yaml
id: marketing-credentials
description: "Inject AWS and Git credentials for the marketing namespace."
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: PLUGIN
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.aws
    values:
      accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
      region: us-east-1
      secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
  - type: io.kestra.plugin.ee.rules.Add
    on: PLUGIN
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.git
    values:
      password: "{{ render(namespace.github.token) }}"
      username: your-github-username
```

Finally, reference the variables file in the Namespace resource and the Policy file in a `kestra_policy` resource:

```hcl
resource "kestra_namespace" "marketing" {
  namespace_id = "marketing"
  description  = "Namespace for the marketing team"
  variables    = file("variables_marketing.yml")
}

resource "kestra_policy" "marketing_credentials" {
  scope     = "NAMESPACE"
  namespace = kestra_namespace.marketing.namespace_id
  policy_id = "marketing-credentials"
  content   = file("policy_marketing.yml")
}
```

The `policy_id` must match the `id` in the Policy file. If you are upgrading from 1.x and used `plugin_defaults` on `kestra_namespace`, see the [Terraform namespace migration guide](../../../13.terraform/guides/namespace-migration/index.md).

#### Adding secrets to a Namespace using Terraform

The [kestra_namespace_secret](../../../13.terraform/resources/namespace_secret/index.md) resource adds secrets programmatically to a namespace. Example adding multiple secrets to the `marketing` namespace:

```hcl
resource "kestra_namespace_secret" "github_token" {
  namespace    = "marketing"
  secret_key   = "GITHUB_TOKEN"
  secret_value = var.github_token
}

resource "kestra_namespace_secret" "aws_access_key_id" {
  namespace    = "marketing"
  secret_key   = "AWS_ACCESS_KEY_ID"
  secret_value = var.aws_access_key_id
}

resource "kestra_namespace_secret" "aws_secret_access_key" {
  namespace    = "marketing"
  secret_key   = "AWS_SECRET_ACCESS_KEY"
  secret_value = var.aws_secret_access_key
}
```

Variables used in Terraform are declared in `variables.tf`:

```hcl
variable "github_token" {
  type = string
  sensitive = true
}

variable "aws_access_key_id" {
  type = string
  sensitive = true
}

variable "aws_secret_access_key" {
  type = string
  sensitive = true
}

variable "kestra_user" {
  type      = string
  sensitive = true
}

variable "kestra_password" {
  type      = string
  sensitive = true
}

variable "kestra_host" {
  type      = string
  sensitive = false
  default   = "http://your_kestra_host:8080" # Change this to your Kestra host URL
}

variable "kestra_tenant_id" {
  type      = string
  sensitive = false
  default   = "kestra-tech"
}
```

And add your secrets to the `terraform.tfvars` file:

```hcl
github_token = "your-github-token"
aws_access_key_id = "your-aws-access-key-id"
aws_secret_access_key = "your-aws-secret-access-key"
kestra_user = "your-kestra-user"
kestra_password = "your-kestra-password"
```

## Allowed Namespaces

The `allowedNamespaces` setting controls which namespaces can access a namespace's flows and resources. Configure it on the **Edit** tab of any namespace.

By default, all namespaces are allowed. To restrict access, select specific namespaces — access automatically extends to each selected namespace's children.

The setting covers:

- Subflow calls
- Flow triggers
- namespace files
- KV store
- secrets
- assets

A Flow trigger in a flow whose namespace isn't allowed doesn't receive the executions of the restricted namespace. When an execution would otherwise have fired the trigger, because it matches its `states`, `dependsOn`, and `when` conditions, Kestra logs a warning on the flow that owns the trigger. The warning names the namespace whose Allowed Namespaces blocks it, which can be a parent of the execution's namespace. Nothing is logged on the restricted namespace's execution.

[System Flows](../../../06.concepts/system-flows/index.md), such as alerts, need the system flows namespace (`system` by default) in the list to react to the executions of this namespace.
