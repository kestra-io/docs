---
title: Validate JSON Data Against a JSON Schema in Kestra
h1: Validate JSON Data Against a JSON Schema
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Concepts
description: Use the ValidateJsonSchema task to check JSON payloads against a schema inline, from a namespace file, or from a Confluent-compatible Schema Registry.
---

The `io.kestra.plugin.serdes.json.ValidateJsonSchema` task validates a JSON payload against a JSON Schema at any point in a flow. Use it to check API responses, downloaded files, or task outputs before they reach downstream tasks.

For validating flow inputs at execution time, see [JSON input validation](../../05.workflow-components/05.inputs/index.md#json-schema-validation).

## Prerequisites

- [plugin-serdes](https://kestra.io/plugins/plugin-serdes) installed on your Kestra instance.

## Provide the JSON payload

The `from` property accepts:
- A JSON string
- A `kestra://` internal storage URI pointing to a JSON file
- A map, list, or scalar value, which is serialized to JSON before validation

## Provide the schema

Set exactly one of:
- `schema`: inline JSON Schema text. Use `{{ read('path/to/schema.json') }}` to load a namespace file.
- `registry`: connection details for a Confluent-compatible Schema Registry (see [Validate against a Schema Registry](#validate-against-a-schema-registry)).

## Inline schema

This flow validates a JSON input against an inline schema and fails the task if the payload does not match.

```yaml
id: validate_json_inline
namespace: company.team

inputs:
  - id: payload
    type: JSON
    defaults: '{"id": 1, "email": "ada@example.com"}'

tasks:
  - id: validate
    type: io.kestra.plugin.serdes.json.ValidateJsonSchema
    from: "{{ inputs.payload }}"
    schema: |
      {
        "type": "object",
        "required": ["id", "email"],
        "properties": {
          "id": {"type": "integer"},
          "email": {"type": "string", "format": "email"}
        }
      }
```

When validation fails, the task throws an exception listing the first ten errors. The `errors` output list is capped at 100 entries; use the `errors` counter metric for the full count.

## Namespace file schema

Store the schema as a namespace file and reference it with `{{ read() }}`. Set `defaultDialect: DRAFT_4` if your schema targets draft-04 and has no `$schema` keyword. Draft-04 checks `format` values such as `email` and `uri` by default; `DRAFT_2020_12` (the default) treats them as annotations only.

```yaml
id: validate_json_namespace_file
namespace: company.team

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: https://example.com/data/orders.json

  - id: validate
    type: io.kestra.plugin.serdes.json.ValidateJsonSchema
    from: "{{ outputs.download.uri }}"
    schema: "{{ read('schemas/order.json') }}"
    defaultDialect: DRAFT_4
```

## Branch on validation result

Set `failOnInvalid: false` to capture the result and route the flow instead of stopping it. The task outputs `valid` (boolean) and `errors` (list of objects with `instanceLocation`, `keyword`, `message`, and `schemaLocation`).

```yaml
id: validate_and_branch
namespace: company.team

tasks:
  - id: fetch_order
    type: io.kestra.plugin.core.http.Request
    uri: https://example.com/api/orders/42

  - id: validate
    type: io.kestra.plugin.serdes.json.ValidateJsonSchema
    from: "{{ outputs.fetch_order.body }}"
    failOnInvalid: false
    schema: |
      {
        "type": "object",
        "required": ["orderId", "amount"],
        "properties": {
          "orderId": {"type": "string"},
          "amount": {"type": "number", "minimum": 0}
        }
      }

  - id: if_invalid
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.validate.valid == false }}"
    then:
      - id: report
        type: io.kestra.plugin.core.log.Log
        message: "Validation failed: {{ outputs.validate.errors }}"
    else:
      - id: process
        type: io.kestra.plugin.core.log.Log
        message: "Order is valid, proceeding."
```

## Validate against a Schema Registry

The `registry` property connects to a Confluent-compatible Schema Registry such as Karapace or Aiven. Look up schemas by subject and version, or by global schema ID.

```yaml
id: validate_json_registry
namespace: company.team

tasks:
  - id: fetch_order
    type: io.kestra.plugin.core.http.Request
    uri: https://example.com/api/orders/42

  - id: validate
    type: io.kestra.plugin.serdes.json.ValidateJsonSchema
    from: "{{ outputs.fetch_order.body }}"
    failOnInvalid: false
    registry:
      url: https://my-karapace.example.com:12345
      subject: orders-value
      subjectVersion: "1"
      options:
        auth:
          type: BASIC
          username: "{{ secret('REGISTRY_USERNAME') }}"
          password: "{{ secret('REGISTRY_PASSWORD') }}"
    defaultDialect: DRAFT_4

  - id: if_invalid
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.validate.valid == false }}"
    then:
      - id: report
        type: io.kestra.plugin.core.log.Log
        message: "Invalid order: {{ outputs.validate.errors }}"
```

The `options` property accepts basic or bearer auth, SSL configuration, proxy settings, and timeouts through the standard `HttpConfiguration` interface.

When the schema comes from a registry, the outputs also include `schemaId` and `schemaVersion`.

Pin `subjectVersion` to a specific version number in production flows. Using `"latest"` means the schema fetched can change between executions as the registry evolves, causing payloads that passed before to fail with no change to the flow.

:::alert{type="info"}
Schema `references` (cross-subject references) and remote `$ref` URLs are not supported. A schema with `references` fails with a clear error. Remote `$ref` URLs are never fetched. The `$ref` keyword is silently ignored, so a schema that relies on remote references will not enforce those rules and no error is raised.
:::

For all properties and outputs, see the [ValidateJsonSchema plugin reference](/plugins/plugin-serdes/json/io.kestra.plugin.serdes.json.validatejsonschema).
