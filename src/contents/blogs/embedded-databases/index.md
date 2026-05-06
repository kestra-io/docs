---
title: "Embedded Databases in 2026: DuckDB, SQLite, Polars, and chDB"
description: "A developer's guide to embedded databases in 2026. Compare DuckDB, Polars, SQLite, and chDB for analytics, ETL pipelines, and real-time data processing."
date: 2026-05-04T16:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  linkedin: https://www.linkedin.com/in/martin-pierre-roset/
  image: mproset
image: ./main.jpg
---

The round-trip to disk is one of the most persistent bottlenecks in data work. Embedded databases eliminate it. Tools like [**DuckDB**](https://github.com/duckdb/duckdb), [**Polars**](https://github.com/pola-rs/polars), and [**SQLite**](https://github.com/sqlite/sqlite) handle the majority of embedded workloads in 2026, with [**chDB**](https://github.com/chdb-io/chdb) filling a specific niche for ClickHouse users.

This post breaks down the embedded database landscape in 2026: what's worth using now, what's overhyped, and what to watch.

---

### Embedded databases: why developers care in 2026

**Embedded Databases** have become indispensable because they are fast. Well, it’s a bit more complex than that; what they do best is:

- **Large dataset handling:** Processing datasets that span gigabytes or terabytes often crush disk-based systems.
- **Avoiding I/O bottlenecks:** Disk read/write operations can become a significant bottleneck, especially during complex joins and aggregations.
- **Reducing ETL over-engineering:** Instead of shuffling data between transactional and analytical stores, **Embedded Databases** bring computation directly to the data.

Those efficiency gains translate into a few concrete benefits:

- **Real-time performance:** Data pipelines, anomaly detection, and machine learning workflows demand sub-second response times.
- **Simplified architecture:** Combining OLAP (analytical queries) and OLTP (transactional processing) reduces complexity and maintenance.
- **Cross-paradigm support:** Modern SQL engines like DuckDB and Polars seamlessly integrate with Python dataframes and imperative code.

**Developer Pain Points:** Managing complex joins, handling multi-gigabyte datasets, and avoiding disk bottlenecks. **Embedded Databases** help address these by bringing data as close to computation as possible.

---

### DuckDB: SQL’s Local Powerhouse for Analytics

[**DuckDB**](https://github.com/duckdb/duckdb) is often called the SQLite of OLAP due to its simplicity and performance. With it, you can run complex SQL queries on local data without spinning up clusters or servers.

**Why DuckDB still dominates in 2026:**

- **In-process execution:** Runs directly in your Python, R, or JavaScript environment.
- **Low setup requirement:** No external dependencies or configurations are required.
- **Dataframe compatibility:** Works natively with pandas, Polars, and Apache Arrow tables.

DuckDB executes SQL directly inside Jupyter notebooks, which means data scientists can query Parquet files or run ad-hoc joins during exploratory analysis without switching tools.

Under the hood, DuckDB’s vectorized execution engine processes data in batches using SIMD (Single Instruction, Multiple Data). It supports lazy loading, so large Parquet or CSV files can be queried without pulling the full dataset into memory.

**Code Example:**

```python
import duckdb
conn = duckdb.connect()
df = conn.sql("SELECT product_name, SUM(total) AS total FROM 'data/sales.parquet' GROUP BY product_name ORDER BY total DESC LIMIT 10")
df.to_df().to_json("top_products.json", orient="records")

```

**Use case:** Fast prototyping of data transformations and interactive analysis on datasets stored locally, all within a single-node environment.

---

## chDB: embedded ClickHouse for Python

[**chDB**](https://github.com/chdb-io/chdb) embeds the ClickHouse SQL engine in-process, letting you run ClickHouse-grade OLAP queries without a server. v4 landed in March 2026.

It’s narrower than DuckDB or Polars: Python-only (3.9+), macOS and Linux only. But for teams already running ClickHouse in production, chDB eliminates the server entirely for local development and testing.

```python
import chdb

data = chdb.query("""
SELECT sum(total) as total, avg(quantity) as avg_quantity
FROM url('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv');
""", 'PrettyCompact')
print(data)
```

**Use case:** Python developers in ClickHouse-native environments who need the same SQL dialect locally without spinning up a server instance.

---

### SQLite: still essential in 2026

Thanks to a lightweight, self-contained database for embedded systems and applications requiring local storage, [**SQLite**](https://github.com/sqlite/sqlite) is still essential to a modern stack.

**Why Developers Still Choose SQLite:**

- **Serverless architecture:** Runs directly within applications without a separate server.
- **Cross-platform compatibility:** Used in mobile apps, browsers, and IoT devices.
- **In-memory mode:** Supports temporary tables and data manipulation entirely in RAM.

**Performance Insight:** SQLite’s B-tree indexing ensures fast read/write access, though it’s single-threaded by default. For high-concurrency use cases, developers can enable write-ahead logging (WAL) mode to improve parallel read performance.

**Limitations:** While great for single-user scenarios, SQLite may not be suitable for highly concurrent write operations due to the lack of native parallel write support.

**Use Case:** Offline-first mobile applications, local testing environments, and lightweight caching for microservices.

---

## Polars: the DataFrame engine that outpaces pandas

[**Polars**](https://github.com/pola-rs/polars) graduated from “pandas replacement” to serious analytics contender. Its $21M Series A in September 2025 was a signal: Polars isn’t a hobby project anymore.

The core advantage is its streaming engine. Where pandas loads entire datasets into memory, Polars processes datasets larger than RAM by streaming chunks through an optimized query plan. In practice it consistently outpaces pandas on aggregation-heavy work, often by a significant margin, and holds its own against DuckDB on DataFrame-heavy workloads.

**What makes Polars different:**

- **Lazy evaluation:** `scan_parquet()` builds a query plan without reading data. `.collect()` executes it once, fully optimized.
- **Streaming mode:** Handles datasets larger than available RAM without any configuration.
- **SQL interface:** Run SQL directly against DataFrames alongside the native expression API.
- **DuckDB interop:** Pass Polars DataFrames directly to DuckDB queries and vice versa — the two tools complement each other well.

**Code example:**

```python
import polars as pl

# Lazy scan — nothing executes yet
df = pl.scan_parquet("data/sales.parquet")

result = (
    df.filter(pl.col("region") == "EU")
    .group_by("product_name")
    .agg(pl.col("total").sum().alias("total_revenue"))
    .sort("total_revenue", descending=True)
    .limit(10)
    .collect()  # execute the full plan here
)
print(result)
```

The `scan_parquet` + `collect()` pattern means Polars sees the full query before executing any of it. For large Parquet files with selective filters, this eliminates unnecessary reads entirely.

**Use case:** Data transformation pipelines where you mix Python-native DataFrame operations with SQL aggregations. Polars handles the reshaping; DuckDB handles the heavy SQL joins.

---

**Limbo: one to watch.** Turso’s Rust-based SQLite reimplementation brings async I/O (`io_uring` on Linux), WASM-first design, and a modern testing approach via Deterministic Simulation Testing. Still in beta as of May 2026 and not production-ready, but it’s worth bookmarking if you want to see where SQLite-compatible databases are heading.

---

## Orchestrating **Embedded Databases** Workflows with Kestra

[**Kestra**](https://github.com/kestra-io/kestra) is an event-driven orchestration platform that coordinates these databases as steps in a larger pipeline.

**Why Kestra is Essential:**

- **Declarative YAML configurations:** Define multi-step pipelines without glue code.
- **Integration with popular databases:** Supports DuckDB, SQLite, chDB, and external sources like object stores and APIs.
- **Event-driven execution:** Trigger workflows in response to events (e.g., new data uploads or API calls).

**Extended Example Kestra Workflow:**

```yaml
id: embedded_databases
namespace: company.team

tasks:
  - id: chDB
    type: io.kestra.plugin.scripts.python.Script
    allowWarning: true
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    beforeCommands:
      - pip install chdb
    script: |
      import chdb

      data = chdb.query("""
      SELECT sum(total) as total, avg(quantity) as avg_quantity
      FROM url('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv');
      """, 'PrettyCompact')
      print(data)

  - id: duckDB
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      INSTALL httpfs;
      LOAD httpfs;

      SELECT sum(total) as total, avg(quantity) as avg_quantity
      FROM read_csv_auto('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv',
      header=True);
    fetchType: FETCH
```

**Advanced Configuration:** Kestra also supports retries, error handling, and parallel task execution, making it easy to build robust data pipelines.

**Use Case:** Building a real-time recommendation system pipeline that processes raw sales data, aggregates insights, and exports outputs for downstream APIs.

---

### Why Developers Pair Embedded Databases with Kestra

- **[DuckDB](/plugins/plugin-jdbc-duckdb) + Kestra:** Ideal for local ETL pipelines and interactive SQL workflows.
- **Polars + Kestra:** Run Polars transformations inside Python script tasks, then pass outputs downstream.
- **SQLite + Kestra:** Reliable for offline storage and embedded workflows.

Kestra’s ability to mix batch and event-driven tasks in one pipeline means developers can easily adapt to complex data processing needs.

---

### 2026 takeaways for developers

1. **DuckDB** continues to lead for local, high-performance SQL queries — v1.5.2 is production-ready and the ecosystem around it is growing fast.
2. **Polars** has matured into a serious analytics engine with a streaming mode that handles larger-than-RAM datasets. Best paired with DuckDB for mixed DataFrame/SQL workflows.
3. **SQLite** remains essential for embedded and offline use cases, even as analytics workloads migrate to DuckDB.
4. **chDB** fills a specific niche for Python developers in ClickHouse-native environments.
5. **Kestra** orchestrates these technologies into cohesive, event-driven workflows.

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
