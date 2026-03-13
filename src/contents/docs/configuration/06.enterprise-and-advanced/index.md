---
title: Kestra Enterprise and Advanced Configuration
description: Configure Enterprise-only and advanced Kestra settings including licenses, Elasticsearch, Kafka, indexer behavior, UI custom links, AI Copilot, and air-gapped deployments.
sidebarTitle: Enterprise and Advanced
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

Use this page for configuration areas that are either Enterprise-specific or advanced platform concerns.

## Enterprise platform settings

This area includes:

- Enterprise license configuration
- Enterprise Java security
- UI sidebar customization
- historical multi-tenancy and default tenant settings
- custom links in the UI

## Elasticsearch, Kafka, and indexing

These settings cover the advanced repository and queue stack used in Enterprise deployments:

- Elasticsearch repository settings
- Kafka client and topic settings
- Kafka message protection
- indexer behavior

Use this section when you are running the Kafka plus Elasticsearch architecture instead of a JDBC-only deployment.

## AI and isolated environments

The full reference also includes:

- AI Copilot provider configuration
- air-gapped instance settings

## When to use this page

- Need secure runtime or secret backend settings: [Security and Secrets](../05.security-and-secrets/index.md)
- Need full Elasticsearch or Kafka property examples: [Full Reference](../99.full-reference/index.md#elasticsearch)
