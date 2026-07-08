---
title: Data Storage Components in Kestra Architecture
h1: How Kestra Stores Inputs, Outputs, Logs, and Metadata
description: Dive into Kestra's Data Architecture. Learn how inputs, outputs, logs, and metadata are stored across Repositories and Internal Storage systems.
sidebarTitle: Data Storage in Kestra
icon: /src/contents/docs/icons/architecture.svg
---

Understand where different data components ([inputs](../../05.workflow-components/05.inputs/index.md), [outputs](../../05.workflow-components/06.outputs/index.md), logs, and more) are stored in Kestra’s architecture.

Kestra processes and stores a variety of data, including [flow definitions](../../05.workflow-components/01.flow/index.md), workflow inputs, outputs, logs, execution metadata, and more. Understanding how these components are stored helps optimize performance, configure persistence, and integrate with external storage systems.

Kestra data is stored in either the [repository](../01.main-components/index.md#repository), such as PostgreSQL, or in [internal storage](../data-components/index.md#internal-storage). By default, internal storage is local, but you can configure it to use cloud or S3-compatible object storage such as [AWS S3](https://aws.amazon.com/s3/), [Google Cloud Storage](https://cloud.google.com/storage), or [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/).

:::alert{type="info"}
See [Kestra architecture](../../08.architecture/03.deployment-architecture/index.md) and [internal storage](../data-components/index.md#internal-storage) for more details.
:::

## Data storage components

The table below outlines key data components, where they are stored, and their purpose.

| Data component                                                                                         | Storage location                                                                                    | Description |
|--------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------| --- |
| **Flows & definitions**                                                                                | Repository                                                                                          | Stores flows, tasks, and their configurations. |
| **Namespaces**                                                                                         | Repository                                                                                          | Organizes workflows and manages secrets, plugin defaults, and variables. |
| **Namespace files**                                                                                    | Internal storage                                                                                    | Stores code and configuration files in Kestra’s storage backend. |
| **Executions & metadata**                                                                              | Repository                                                                                          | Stores execution details including status, timestamps, and metadata. |
| **Input values** (non-FILE types)                                                                      | Repository (executions table)                                                                       | Scalar input values stored in the executions table. Non-sensitive types (STRING, INTEGER, etc.) are stored as plaintext; `SECRET` type inputs are stored encrypted. |
| **Input files** (FILE type)                                                                            | Internal storage                                                                                    | FILE-type inputs and files passed to script or CLI tasks, stored at `/{namespace}/{flow-id}/executions/{execution-id}/inputs/{input-name}/{file-name}`. |
| **Output values**                                                                                      | Repository (task_outputs table)                                                                     | Scalar task outputs stored in a dedicated task_outputs table. In Enterprise Edition, values emitted via `encryptedOutputs` are stored as encrypted strings rather than plaintext. |
| **Output files**                                                                                       | Internal storage                                                                                    | Generated files available for download and reuse in downstream tasks. |
| **Key-value pairs**                                                                                    | Internal storage & repository (metadata only)                                                       | KV store holds data in key-value format. Metadata is recorded in the repository. |
| **Logs & [audit logs](../../07.enterprise/02.governance/06.audit-logs/index.md) (Enterprise Edition)** | Repository                                                                                          | Stores logs generated by tasks. |
| **Task state & variables**                                                                             | Repository                                                                                          | Stores dynamic variables and task states during executions. |
| **Secrets**                                                                                            | Repository or external [secret manager](../../07.enterprise/02.governance/secrets-manager/index.md) | Stores secrets internally or integrates with services like AWS Secrets Manager, Vault, or Google Secret Manager. |
| **Queues**                                                                                             | Repository or Kafka                                                                                 | Handles internal communication between Kestra components. |
| **Triggers**                                                                                           | Repository                                                                                          | Stores definitions of event-based triggers. |
| **User administration**                                                                                | Repository                                                                                          | Stores RBAC, user management, and related metadata. |

## Internal storage

**Internal storage** is used for handling files during executions. It ensures efficient input and output management without burdening the database.

- **Purpose**: Handles inputs, outputs, temporary execution data, and artifacts such as [namespace files](../../06.concepts/02.namespace-files/index.md).
- **KV store**: Stores key-value pairs in internal storage, with metadata in the repository. Metadata includes the key, URI, TTL, and timestamps.
- **Backends**: By default, Kestra uses local storage, but for production you can configure cloud or S3-compatible object storage:
  - [AWS S3](https://aws.amazon.com/s3/)
  - [Google Cloud Storage](https://cloud.google.com/storage)
  - [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
  - Any S3-compatible service (Ceph, SeaweedFS, Garage, MinIO)

### Configuring internal storage

Example `docker-compose.yaml` configuration for AWS S3:

```yaml
kestra:
  storage:
    type: s3
    bucket: "kestra-internal-storage"
    region: "us-east-1"
```

For full details, see [internal storage configuration](../../configuration/02.runtime-and-storage/index.md#internal-storage).

## Additional information

### Flows and execution metadata

- Stored in **PostgreSQL**, **MySQL**, or **H2** (not recommended for distributed components).
- Includes:
  - Flow definitions
  - Execution details
  - Execution queues
  - Historical metadata
- Accessible via the [Kestra API](../../api-reference/index.mdx) and [UI](../../09.ui/index.mdx).

### Logs

- **Open source**: Logs are stored in the database.
- **Enterprise Edition**: Supports Elasticsearch as a log backend, in addition to the database.
  - Audit logs are stored in the repository.
- Logs can be accessed through the API, UI, or external logging integrations such as the [log shipper](../../07.enterprise/02.governance/logshipper/index.md).

### Queues

- **Open source**: Stored in the database.
- **Enterprise Edition**: Can use Kafka for inter-component messaging.

### Secrets management

Secrets can be stored in Kestra’s database or in external managers like [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/), [Google Secret Manager](https://cloud.google.com/secret-manager), [Azure Key Vault](https://azure.microsoft.com/products/key-vault/), or [HashiCorp Vault](https://developer.hashicorp.com/vault/docs/secrets/kv/kv-v2).

Example configuration for AWS Secret Manager:

```yaml
kestra:
  secret:
    type: aws-secret-manager
    aws-secret-manager:
      access-key-id: my-access-key
      secret-key-id: my-secret-key
      sessionToken: my-session-token
      region: us-east-1
```

See [secret managers](../../07.enterprise/02.governance/secrets-manager/index.md) for more.

### Handling sensitive data and PII

Understanding where data is persisted is critical when flows process personally identifiable information (PII) or other sensitive values.

**Stored as plaintext in the database:**
- Non-sensitive scalar inputs (STRING, INTEGER, etc.) — stored in the executions table
- Task output values emitted via `outputs` in the script output protocol — stored in the task_outputs table
- Log messages — stored in the logs table

**Stored encrypted in the database:**
- `SECRET` type inputs — stored in the executions table as an encrypted value (requires encryption to be configured); the value is also automatically masked in logs
- `encryptedOutputs` values (Enterprise Edition) — stored in the task_outputs table

**Not stored in the database:**
- FILE-type inputs and output files — these go to internal storage (your configured S3, GCS, Azure Blob, etc.).

#### Encrypting sensitive task outputs

:::alert{type="info"}
`encryptedOutputs` is an Enterprise Edition feature.
:::

In Enterprise Edition, script tasks support an `encryptedOutputs` key in the `::{}::` output protocol. Values written this way are wrapped in an `EncryptedString` and stored encrypted in the task_outputs table rather than as plaintext. They are merged into the same outputs map as regular outputs and are decrypted by Kestra at evaluation time.

```yaml
id: sensitive_data_flow
namespace: company.team

inputs:
  - id: ssn
    type: SECRET

tasks:
  - id: process_pii
    type: io.kestra.plugin.scripts.shell.Script
    script: |
      echo '::{"encryptedOutputs":{"ssn":"{{ inputs.ssn }}"}}::'
      echo '::{"outputs":{"status":"processed"}}::'
```

Both plaintext and encrypted outputs are accessible in downstream tasks via `{{ outputs.process_pii.ssn }}` — Kestra decrypts the value at expression evaluation time.

Lines matching the `::{}::` protocol are consumed by the output processor and never written to the logs table, so the plaintext value is not exposed in log storage.

#### Best practices for PII-sensitive flows

- **Use `type: SECRET` for sensitive inputs.** `SECRET` inputs are encrypted at rest in the executions table and automatically masked in log output. Requires [`kestra.encryption.secret-key`](../../configuration/05.security-and-secrets/index.md) to be configured — without it, `SECRET` inputs fail at runtime.
- **Use `encryptedOutputs` for sensitive task outputs** (Enterprise Edition). Values are stored encrypted in the task_outputs table and decrypted transparently when referenced in downstream tasks.
- **Use [Secrets](../../07.enterprise/02.governance/secrets-manager/index.md)** for credentials and configuration values that should never appear in execution records.
- **Log carefully.** Only `SECRET` inputs are automatically masked in logs. Any sensitive value logged directly — via `print`, `echo`, or a logging statement — is stored as plaintext in the logs table.

### Database maintenance

Use [purge tasks](../../10.administrator-guide/purge/index.md) to free up storage and maintain performance as databases accumulate execution and log data.

To further separate data across business units or environments, see the [governance features](../../07.enterprise/02.governance/index.mdx) in the [Enterprise Edition](../../07.enterprise/01.overview/01.enterprise-edition/index.md), including [tenants](../../07.enterprise/02.governance/tenants/index.md).
