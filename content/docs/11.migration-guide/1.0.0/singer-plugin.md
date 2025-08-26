---
title: Singer Tap Plugin Removal
icon: /docs/icons/migration-guide.svg
release: 1.0.0
editions: ["OSS", "EE"]
---

## Overview

Singer support is being deprecated in Kestra 0.24 and fully removed in Kestra 1.0. This guide walks you through migrating existing Singer pipelines to supported alternatives in Kestra, such as [Airbyte](/plugin/plugin-airbyte), [dlt](/plugin/plugin-dlt), and [CloudQuery](/plugin/plugin-cloudquery).

## Why is Singer support being removed?

Singer was once a promising open-source technology for building and sharing data connectors. However:

- It is no longer actively maintained.
- After Meltano shut down, there is no longer a company backing the ecosystem.
- As a result, compatibility, security, and reliability cannot be guaranteed going forward.

To ensure Kestra users have reliable, well-maintained data ingestion options, we recommend migrating to open-source alternatives such as **Airbyte**, **dlt**, and **CloudQuery**.

Kestra has first-class plugins for several data ingestion frameworks:
- Airbyte: Large connector ecosystem for databases, SaaS apps, and warehouses. Runs in both **Cloud** and **OSS** modes.
- dlt: Flexible **Python-based** ingestion framework, great for custom pipelines and lightweight ingestion.
- CloudQuery: Purpose-built for cloud asset discovery and syncing metadata to databases or warehouses.

## Migration Checklist

1. Identify your Singer taps/targets and their data sources/destinations.

2. Check Kestra’s supported plugins for Airbyte, dlt, or CloudQuery equivalents.

3. Configure connections:
    - For Airbyte, set up connections in the Airbyte UI and reference `connectionId` in Kestra.

    - For dlt, define a Python pipeline and run it as a task in Kestra.

    - For CloudQuery, configure via YAML and execute with the Kestra task.

4. Update secrets in Kestra (API tokens, database credentials).

5. Run test migrations and validate data consistency.

6. Remove old Singer flows after successful migration.

These plugins are fully integrated with Kestra, making the transition straightforward and ensuring your ingestion pipelines remain reliable.
