---
title: Main Components of Kestra Architecture
h1: Explore Kestra's Repository, Queue, Storage, and Plugin System
description: Understand Kestra's core architecture. Dive into main components like the Repository, Queue, Internal Storage, and Plugin system.
sidebarTitle: Main components
icon: /src/contents/docs/icons/architecture.svg
---

Kestra relies on the following internal components:

- **Internal storage**: stores flow data such as task outputs and flow inputs.
- **Queue**: enables internal communication between Kestra server components.
- **Repository**: persists flows, executions, logs, and all other internal objects.
- **Plugins**: extend Kestra’s core with additional task and trigger types, storage implementations, and data transformations.

Each component has multiple implementations depending on deployment architecture. Some require additional plugins.

## Internal storage

The **internal storage** is a dedicated system that handles files of any size during flow executions. It manages both inputs and outputs, enabling scalable file sharing between tasks.

### Purpose

Internal storage is used to:
- Save files generated during a [flow’s execution](../../05.workflow-components/03.execution/index.md) and pass them between tasks via [outputs](../../05.workflow-components/06.outputs/index.md).
- Automatically persist [flow inputs](../../05.workflow-components/05.inputs/index.md) of type `FILE`.
- Provide download links for stored files in the **Outputs** tab of an execution.

Files can be retrieved in the execution context using `{{ outputs.task_id.output_attribute }}` (often the `uri` property). Kestra fetches the file automatically when referenced.

Execution metadata — including storage file paths — is recorded in the **repository**.

### Storage types

By default, Kestra uses **local storage**, which stores files on the host filesystem. Local storage is not recommended for production distributed deployments — use cloud object storage or a self-hosted alternative instead.

:::alert{type="warning"}
Local storage behavior differs between standalone and distributed deployments:
- ✅ **Standalone**: Local storage with persistent volumes is OK
- ❌ **Distributed with ReadWriteOnce**: NOT recommended for distributed services
- ✅ **Distributed with ReadWriteMany**: OK for distributed services (rarely available)
- ❌ **Host storage sharing**: NOT recommended — difficult to achieve reliably

When `ReadWriteMany` is unavailable, use cloud storage (S3, GCS, Azure) or distributed object storage (MinIO, Ceph, SeaweedFS, Garage).
:::

Scalable alternatives are available as plugins:

- [Storage MinIO](https://github.com/kestra-io/storage-minio) — supports [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/), and other S3-compatible systems.
- [Storage GCS](https://github.com/kestra-io/storage-gcs) — for [Google Cloud Storage](https://cloud.google.com/storage).
- [Storage Azure](https://github.com/kestra-io/storage-azure) — for [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/).

For details, see [Runtime and Storage](../../configuration/02.runtime-and-storage/index.md).

## Queue

The **queue** is the internal communication channel between Kestra’s server components. Server roles emit typed messages onto named queues and subscribe to the queues they consume — no role calls another directly. The full queue surface is defined once as an abstract contract, satisfied by one chosen backend:

- **Database queue** (default) — backed by PostgreSQL or MySQL. Available in all editions.
- **In-memory queue** — for testing and ephemeral use only.
- **Kafka queue** — Enterprise Edition. Higher throughput; pairs with the Elasticsearch repository.
- **Redis queue** — Enterprise Edition.
- **AMQP queue** — Enterprise Edition.
- **GCP Pub/Sub queue** — Enterprise Edition.

## Repository

The **repository** persists all domain entities, including flows, executions, logs, and triggers. The backend is chosen alongside the queue:

- **Database repository** (default) — backed by PostgreSQL, MySQL, or H2. Available in all editions.
- **In-memory repository** — for testing only.
- **Elasticsearch repository** — Enterprise Edition. Backs the high-volume search and read model; requires the Kafka queue and the Indexer server role to keep it in sync.

## Plugins

Kestra’s core only provides basic functionality. A [plugin ecosystem](/plugins) extends the platform with:

- New task and trigger types.
- Alternative implementations of core components (e.g., storage backends).
- Integrations with external systems and data transformation utilities.

A wide range of plugins is already available, and the ecosystem continues to expand.
