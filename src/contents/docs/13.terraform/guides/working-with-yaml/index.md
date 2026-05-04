---
title: Working with YAML in Kestra Terraform Provider
h1: Handle YAML Multiline Strings and External Files in Terraform
description: Learn how to handle YAML content in Terraform for Kestra resources, including multiline strings and external files.
---


## Working with YAML

Most Kestra resources must be described as YAML, such as [kestra_flow](../../resources/flow/index.md) and [kestra_template](../../resources/template/index.md).

Kestra uses full YAML in the Terraform definition because the resource structure is recursive and dynamic, so it cannot be described using Terraform's internal schema.

There are 2 ways to handle YAML for a flow:

* `keep_original_source = true` (default): the raw YAML is sent and saved in Kestra as-is.
* `keep_original_source = false`: the YAML is encoded as JSON before being sent to the server, so comments and indentation are handled by the server.

**These properties must be set at the provider level.**

:::alert{type="danger"}
With `keep_original_source = false`, the Terraform provider has no awareness of tasks or plugins and cannot know their default values. Most conversion logic runs on the Kestra server. If you see a diff that **is always present** (even just after apply), your Terraform flow definition likely has a minor difference from what the server returns. In that case, **copy the source from the Kestra UI** into your Terraform files to eliminate the diff.
:::

Terraform provides many functions for working with YAML content:

## Simple multiline string example

Use a [Heredoc String](https://www.terraform.io/docs/language/expressions/strings.html#heredoc-strings) for a simple multiline string:

```hcl
resource "kestra_flow" "example" {
  namespace = "company.team"
  flow_id = "my-flow"
  content = <<EOT
id: my-flow
namespace: company.team
inputs:
  - name: my-value
    type: STRING
    required: true

tasks:
  - id: t2
    type: io.kestra.core.tasks.log.Log
    message: first {{task.id}}
    level: TRACE
EOT
}
```

## External files

A better approach is to use the [file function](https://www.terraform.io/docs/language/functions/file.html). Create a `.yml` file alongside your `.tf` file and reference it in your resource:

```yaml
id: my-flow
namespace: company.team
inputs:
  - name: my-value
    type: STRING
    required: true

tasks:
  - id: t2
    type: io.kestra.core.tasks.log.Log
    message: first {{task.id}}
    level: TRACE
EOT
```

```hcl
resource "kestra_flow" "example" {
  namespace = "company.team"
  flow_id = "my-flow"
  content = file("my-flow.yml")
}
```

## External files with template

For the most readable approach, use the [templatefile function](https://www.terraform.io/docs/language/functions/templatefile.html), which allows complex flows to include external files — which can themselves include other files.

:::alert{type="danger"}
The indent must match your actual flow's indentation. Terraform treats YAML as a plain string and has no awareness of its structure, so manage indentation yourself using the [indent function](https://www.terraform.io/docs/language/functions/indent.html).
:::

### Dealing with included YAML strings

For a flow that queries an external database, embedding the full query can produce a very long flow definition. Use `templatefile` to include an external file from the YAML instead.

Create a SQL file:

```sql
SELECT *
FROM ....
```

Create the YAML file for the flow:

```yaml
tasks:
  - id: query
    type: io.kestra.plugin.jdbc.mysql.Query
    url: jdbc:postgresql://127.0.0.1:56982/
    username: postgres
    password: pg_passwd
    sql: |
      ${indent(6, file("my-query.sql"))}
    fetchOne: true
```

And finally create the resource invoking the `templatefile`:

```hcl
resource "kestra_flow" "example" {
  namespace = "company.team"
  flow_id = "my-flow"
  content = templatefile("my-flow.yaml", {})
}
```

The `.tf` files reference the `.yaml` files, which reference the `.sql` files. The resulting flow will be:

```yaml
tasks:
  - id: query
    type: io.kestra.plugin.jdbc.mysql.Query
    url: jdbc:postgresql://127.0.0.1:56982/
    username: postgres
    password: pg_passwd
    sql: |
      SELECT *
      FROM ....
    fetchOne: true
```

### Include full YAML parts

You can also include a full YAML spec inside another one.

Create 2 YAML files:

```yaml
id: t1
type: io.kestra.core.tasks.log.Log
message: first {{task.id}}
level: TRACE
```

```yaml
id: t2
type: io.kestra.core.tasks.log.Log
message: second {{task.id}}
level: TRACE
```

Create the YAML file for the flow:

```yaml
tasks:
  - ${indent(4, file("t1.yml"))}
  - ${indent(4, file("t2.yml"))}
```
