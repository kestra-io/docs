---
title: Execution Data in Internal Storage Removed
sidebarTitle: Execution Data in Internal Storage Removed
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["EE"]
description: The EE configuration option that stored task run outputs in Kestra internal storage has been removed in 2.0.0. Remove these keys from your configuration.
---

The EE configuration option `kestra.ee.execution-data.internal-storage` has been removed in 2.0.0. Task run outputs are now always held in memory. Remove these keys from your configuration file.

## What to remove

If your configuration includes either of these keys, delete them:

```yaml
kestra:
  ee:
    execution-data:
      internal-storage:
        enabled: true       # remove
        force-globally: true  # remove
```

Kestra 2.0.0 ignores these keys if present, but removing them keeps your configuration clean and avoids confusion during future upgrades.

## Alternative for large outputs

The `execution-data.internal-storage` option existed to handle task outputs that were too large to store comfortably in the database. To handle large data, write it to Kestra internal storage as a file and return the URI as the task output:

```yaml
- id: generate_report
  type: io.kestra.plugin.core.http.Download
  uri: "{{ inputs.source_url }}"
  # outputs.generate_report.uri is a kestra:// URI — small, safe to pass downstream
```

Output URIs are lightweight string values. The file content lives in internal storage and is referenced by URI, not embedded in the execution record.
