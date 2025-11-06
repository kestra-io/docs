---
title: Namespace Variables vs KV Store
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Kestra Concepts
---

When to store key-value pairs as namespace-level Variables vs. KV store

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/fs86GLg-OGM?si=aKz38pdclO54Z2jh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Overview

When navigating to a namespace in the Kestra UI, you can see two tabs: Variables and KV Store. Both allow you to store key-value pairs, but there are some significant differences in how those are handled and stored, and when you should use one over the other.

## Variables: use when you need to inherit values from parent namespaces

Variables are typically intended for slowly changing values. Think of the database hostname, the bucket name in a cloud storage service, or the name of a shared queue in a message broker. These values are typically set once and then used across multiple flows and tasks.

To add those, navigate to the Variables tab in the namespace and paste your key-value pairs as shown below:

```yaml
POSTGRES_HOSTNAME: my-postgres-prod-hostname
DATALAKE_S3_BUCKET_NAME: my-datalake-s3-bucket-name
RABBITMQ_QUEUE_NAME: my-rabbitmq-queue-name
GCP_PROJECT_ID: my-gcp-project-id
GITHUB_REPO_URL: https://github.com/kestra-io/kestra
```

The additional benefit of using Variables is that they can be grouped to simplify some configurations. For example, you can group all database-related connection variables under a `postgres` prefix and access them using e.g. `{{ namespace.postgres.hostname }}` in your flows and tasks.

```yaml
postgres:
  hostname: my-postgres-prod-hostname
  port: 5432
  username: my-postgres-prod-username
dataLake:
  s3BucketName: my-datalake-s3-bucket-name
  region: us-east-1
```

You may notice that the Variables can be defined using the uppercased `SNAKE_CASE` convention, as well as `camelCase` or any other convention you prefer.

Storing those values as Variables in a namespace allows you to:
1. Set them once by a DevOps engineer or a system administrator.
2. Centrally govern them in a single place (e.g. to update a database host or port, bucket names, regions, etc.).
3. Inherit them from parent namespace (e.g. `company` namespace) to all child namespaces (e.g. `company.myteam`, `company.myteam.myproject`).
4. Group them to simplify configurations of database connections, cloud storage services, message brokers, etc.

This means that if you have a variable `POSTGRES_HOSTNAME` set in a parent namespace `company`, you can use `{{namespace.POSTGRES_HOSTNAME}}` in a child namespace `company.myteam` and `company.myteam.myproject` (and all other infinitely nested namespaces) without having to worry where in the namespace hierarchy that value is managed.

## KV Store: use when you need to store ephemeral or dynamic values

Trying to use KV Store for the above use case would also work, but you would always need to remember to include the pointer to the namespace under which that key-value pair is stored (unless using the same one as the flow). This is because KV Store is not inherited from parent to child namespaces. Example:

```yaml
{{ kv('POSTGRES_HOSTNAME', 'company') }}
```

The KV Store is more suited for storing ephemeral or dynamic values. Think of the last scraped timestamp, the offset of a Kafka consumer group, or the most recently processed file name. These values are typically set and updated by the workflow itself. Using KV Store for those use cases is better than Variables because KV pairs can be set and updated at runtime, while Variables are typically set once, centrally governed by Kestra Admins, and inherited from parent namespaces to reuse centrally governed configuration across multiple flows and tasks.

## Recap

- **Variables**: use for slowly changing configuration values that are set once, updated fairly infrequently and inherited from parent namespaces by indefinitely nested child namespaces (e.g. `company`, `company.myteam`, `company.myteam.myproject`).
- **KV Store**: use for ephemeral or dynamic values that are set and/or updated at runtime.

Here are some examples to consolidate your understanding:
- **Variables**: `POSTGRES_HOSTNAME`, `DATALAKE_S3_BUCKET_NAME`, `RABBITMQ_QUEUE_NAME`, `GCP_PROJECT_ID`, `GITHUB_REPO_URL`
- **KV Store**: `last_scraped_timestamp`, `kafka_consumer_group_offset`, `last_processed_file_name`.
