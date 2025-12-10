---
title: The Query Task Now Supports Only One SQL Statement
icon: /docs/icons/migration-guide.svg
release: 1.1.0
editions: ["OSS", "EE"]
---

## Breaking change

The `Query` task in **plugin-jdbc** now supports only a **single SQL statement** per execution. Any workflows that include multiple SQL statements separated by semicolons (`;`) within a single `Query` task will now **fail**.

### What changed

Previously, the `Query` task accepted multiple SQL statements separated by semicolons. This has been removed to ensure consistent transactional behavior and compatibility across database providers.

To execute multiple statements:
* Use the **`Queries`** task for multi-statement operations.
* Or split SQL statements into individual `Query` tasks.

### Impact

Workflows containing multiple SQL statements in one `Query` task will fail with the following error:
```
Query task supports only a single SQL statement. Use the Queries task to run multiple statements.
```

### Migration

To update affected workflows:
1. Replace the `Query` task with the `Queries` task when multiple SQL statements need to be executed together.
2. Or, split the SQL statements into separate `Query` tasks.

### Example (will fail)

```yaml
id: queries
namespace: company
tasks:
  - id: query
    type: io.kestra.plugin.jdbc.sqlite.Query
    allowFailure: true
    description: "This will fail with error: Query task supports only a single SQL statement. Use the Queries task to run multiple statements."
    url: jdbc:sqlite:kestra.db
    fetchType: STORE
    sql: |
      CREATE TABLE IF NOT EXISTS features (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        release_version TEXT NOT NULL,
        edition TEXT NOT NULL
      );
      DELETE FROM features;
```

### Example (fixed using `Queries` task)

```yaml
id: queries
namespace: company
tasks:
  - id: queries
    type: io.kestra.plugin.jdbc.sqlite.Queries
    url: jdbc:sqlite:kestra.db
    fetchType: STORE
    sql: |
      CREATE TABLE IF NOT EXISTS features (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          release_version TEXT NOT NULL,
          edition TEXT NOT NULL
      );

      DELETE FROM features;

      INSERT INTO features (name, description, release_version, edition)
      VALUES
          ('Worker Groups', 'Allows targeting specific tasks or triggers to run on specific remote workers for better scalability and resource management.', '0.10', 'Enterprise'),
          ('Realtime Triggers', 'Supports triggering event-driven workflows in real-time.', '0.17', 'Open-Source'),
          ('Task Runners', 'Provides on-demand remote execution environments for running tasks.', '0.16', 'Open-Source'),
          ('KV Store', 'Adds key-value storage for persisting data across workflow executions.', '0.18', 'Open-Source'),
          ('SCIM Directory Sync', 'Allows synchronization of users and groups from Identity Providers.', '0.18', 'Enterprise');

      SELECT * FROM features
      ORDER BY release_version;
```
