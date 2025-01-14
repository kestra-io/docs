---
title: "Embedded Databases and 2025 Trends: Developer's Perspective"
description: An overview of embedded databases like DuckDB, chDB, SQLite, and Limbo for 2025—highlighting performance, use cases, and key features.
date: 2025-01-14T16:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  image: mproset
image: /blogs/embedded-databases.jpg
---

Whether you're building complex ETL pipelines, conducting exploratory data analysis, or powering real-time APIs, these databases are usually in your stack. Why? They eliminate the latency of disk I/O. Tools like [**DuckDB**](https://github.com/duckdb/duckdb), [chDB](https://github.com/chdb-io/chdb), and [**SQLite**](https://github.com/sqlite/sqlite), alongside the rise of [**Limbo**](https://github.com/tursodatabase/limbo), are more relevant **than ever for 2025.**

This post breaks down **Embedded Database** tool choices in 2025.

---

### Embedded Databases: Why Developers Care in 2025

**Embedded Databases** have become indispensable because they are fast. Well, it’s a bit more complex than that; what they do best is:

- **Large dataset handling:** Processing datasets that span gigabytes or terabytes often crush disk-based systems.
- **Avoiding I/O bottlenecks:** Disk read/write operations can become a significant bottleneck, especially during complex joins and aggregations.
- **Reducing ETL over-engineering:** Instead of shuffling data between transactional and analytical stores, **Embedded Databases** bring computation directly to the data.

These advantages make them also the go-to solution for real-time data processing in machine learning, anomaly detection, and interactive dashboards.

- **Real-time performance:** Data pipelines, anomaly detection, and machine learning workflows demand sub-second response times.
- **Simplified architecture:** Combining OLAP (analytical queries) and OLTP (transactional processing) reduces complexity and maintenance.
- **Cross-paradigm support:** Modern SQL engines like DuckDB and ClickHouseDB seamlessly integrate with Python dataframes and imperative code.

**Developer Pain Points:** Managing complex joins, handling multi-gigabyte datasets, and avoiding disk bottlenecks. **Embedded Databases** help address these by bringing data as close to computation as possible.

---

### DuckDB: SQL’s Local Powerhouse for Analytics

[**DuckDB**](https://github.com/duckdb/duckdb) is often called the SQLite of OLAP due to its simplicity and performance. With it, you can run complex SQL queries on local data without spinning up clusters or servers.

**Why DuckDB still dominates in 2025:**

- **In-process execution:** Runs directly in your Python, R, or JavaScript environment.
- **Low setup requirement:** No external dependencies or configurations are required.
- **Dataframe compatibility:** Works natively with pandas, Polars, and Apache Arrow tables.

**Jupyter Notebook and Embedded Analytics:** DuckDB’s ability to execute SQL directly within Jupyter notebooks makes it an attractive option for data scientists working with Parquet files or performing ad-hoc joins during exploratory analysis. It allows interactive workflows where developers can visualize results without moving between different systems.

**Deep Dive:** DuckDB’s vectorized execution engine processes data in batches, leveraging SIMD (Single Instruction, Multiple Data) to maximize CPU efficiency. It supports lazy loading, meaning large files like Parquet or CSV can be queried without loading the full dataset into memory.

**Code Example:**

```python
import duckdb
conn = duckdb.connect()
df = conn.sql("SELECT product_name, SUM(total) AS total FROM 'data/sales.parquet' GROUP BY product_name ORDER BY total DESC LIMIT 10")
df.to_df().to_json("top_products.json", orient="records")

```

This example showcases how DuckDB simplifies querying local Parquet files, avoiding the need for preprocessing or external storage.

**Use Case:** Fast prototyping of data transformations and interactive analysis on datasets stored locally, all within a single-node environment.

---

## chDB: Embedded OLAP for In-Process SQL

[**chDB**](https://github.com/chdb-io/chdb) is an in-process SQL OLAP engine built on top of **ClickHouse**. It allows developers to run high-performance analytical queries directly within their applications without needing an external database server. By embedding the ClickHouse SQL engine, chDB enables fast, local data processing while minimizing the complexity of traditional OLAP deployments.

---

### Core Functionality

chDB is designed for in-process queries, making it well-suited for analytical workloads. It can process structured data from formats such as Parquet, Arrow, CSV, and JSON. The queries operate directly on data files without requiring a full database instance.

Key technical features:

- **In-process Execution:** SQL queries run inside the same process as the application, avoiding round-trips to external servers.
- **Multi-format Support:** Handles Parquet, CSV, JSON, and Arrow files natively.
- **Columnar Storage:** Optimized for analytical queries, enabling efficient aggregations and scans.

---

### Practical Example

Below is an example of how to use chDB to query a Parquet file:

```python
import chdb
conn = chdb.connect()
result = conn.sql("SELECT AVG(sales) FROM 'data.parquet' WHERE region = 'North'")
print(result.to_dataframe())

```

This snippet demonstrates how chDB performs SQL queries directly on a file, providing immediate access to results without requiring an external service.

---

### Performance Considerations

chDB leverages vectorized query execution to process data in batches, making full use of CPU parallelism. Unlike traditional databases that may read entire rows of data, chDB’s columnar format ensures that only the necessary columns are accessed during query execution. This reduces memory consumption and improves speed, especially for large datasets.

By scanning data directly without loading full tables into memory, chDB offers a significant performance advantage for ad-hoc queries and local processing tasks.

---

### Where chDB Fits Best

- **Local Data Exploration:** Useful for rapid testing, prototyping, and data analysis directly from local files.
- **Embedded Dashboards:** Powers data-driven applications where SQL queries are embedded.
- **Notebook Workflows:** Suitable for Jupyter notebooks, allowing data scientists to run SQL queries on structured data files during exploratory analysis.

---

### Why chDB is Relevant in 2025

As demand grows for tools that simplify in-process analytics without requiring additional infrastructure, chDB stands out for its simplicity and power. By embedding an OLAP engine within applications, it bridges the gap between full database deployments and lightweight data exploration tools.

For developers building machine learning pipelines, internal dashboards, or analytical workflows, chDB provides a way to execute high-speed queries with minimal setup. Its design makes it a valuable option for local-first processing and in-process SQL analytics in modern development workflows.

---

### SQLite: Embedded Database, Still Essential in 2025

Thanks to a lightweight, self-contained database for embedded systems and applications requiring local storage, [**SQLite**](https://github.com/sqlite/sqlite) is still essential to a modern stack.

**Why Developers Still Choose SQLite:**

- **Serverless architecture:** Runs directly within applications without a separate server.
- **Cross-platform compatibility:** Used in mobile apps, browsers, and IoT devices.
- **In-memory mode:** Supports temporary tables and data manipulation entirely in RAM.

**Performance Insight:** SQLite’s B-tree indexing ensures fast read/write access, though it’s single-threaded by default. For high-concurrency use cases, developers can enable write-ahead logging (WAL) mode to improve parallel read performance.

**Limitations:** While great for single-user scenarios, SQLite may not be suitable for highly concurrent write operations due to the lack of native parallel write support.

**Use Case:** Offline-first mobile applications, local testing environments, and lightweight caching for microservices.

---

## Limbo: The Rising Contender for 2025

If you’re a developer looking for something fresh in embedded databases, [**Limbo**](https://github.com/tursodatabase/limbo) is worth your attention. It’s a reimagining of SQLite, built from scratch in **Rust** for modern workloads. Limbo isn’t trying to replace SQLite’s simplicity; it amplifies it with memory safety, asynchronous operations, and performance built for cloud-native and serverless environments.

---

### A Database Built for Asynchronous Needs

Traditional SQLite queries run synchronously, making them fast but limited when facing slow storage or network requests. Limbo rewrites the rules by embracing asynchronous I/O from the start. Instead of waiting for large reads or remote requests to finish, Limbo hands back control, letting your app stay responsive.

On Linux, it leverages **io_uring**, a high-performance API for asynchronous system calls, making it ideal for distributed apps where latency matters.

Limbo also prioritizes browser-friendly workflows with **WASM** support. This means you can run a full database in the browser or in a serverless function—without hacks or wrappers. Tools like **Drizzle ORM** already work seamlessly, making in-browser queries a first-class experience.

---

### Reliability You Can Trust

Instead of inheriting SQLite’s C-based testing suite, Limbo leans on **Deterministic Simulation Testing (DST)**. DST simulates years of database operations within minutes, throwing thousands of edge cases at the system in controlled, repeatable environments. When bugs appear, they can be reproduced exactly—no more "works on my machine.”

The partnership with **Antithesis** takes this further by simulating system-level failures—like partial writes and disk interruptions—to ensure Limbo
behaves predictably under real-world stress. This approach lets Limbo aim for the same ironclad reliability SQLite is known for, with the benefits of modern testing techniques.

---

### A Faster, Simpler Experience

It’s faster where it matters. In benchmarks, it has shown **20% faster read performance** compared to SQLite. A simple `SELECT * FROM users LIMIT 1` runs in **506 nanoseconds** on an M2 MacBook Air, compared to **620 nanoseconds** for SQLite.

Unlike SQLite, which often needs configuration tweaks (WAL mode, advisory locks) for optimal performance, Limbo delivers speed out of the box. By removing outdated or non-essential features, it stays lightweight while offering a more intuitive developer experience.

---

### Why Limbo Fits Modern Development

Whether you’re deploying cloud-native apps, serverless functions, or building browser-based tools, it aligns with the demands of distributed systems:

- It handles concurrent I/O natively, making it perfect for databases accessed over APIs or networked storage.
- WASM compatibility makes rich in-browser querying simple.
- Full compatibility with SQLite’s SQL syntax and file format means you don’t need to rewrite your existing queries or migrate data formats.

---

## Orchestrating **Embedded Databases** Workflows with Kestra

[**Kestra**](https://github.com/kestra-io/kestra) empowers developers with an event-driven, declarative platform.

**Why Kestra is Essential:**

- **Declarative YAML configurations:** Define multi-step pipelines without glue code.
- **Integration with popular databases:** Supports DuckDB, ClickHouseDB, SQLite, and external sources like object stores and APIs.
- **Event-driven execution:** Trigger workflows in response to events (e.g., new data uploads or API calls).

**Extended Example Kestra Workflow:**

```yaml
tasks:

  - id: query_with_duckdb
    type: io.kestra.plugin.sql.duckdb.Query
    inputFiles:
       data: "path/to/sales/*.csv"
    properties:
      query: |
        SELECT product_name, SUM(total) AS total FROM "{{ workingDir }}/data" GROUP BY product_name ORDER BY total DESC LIMIT 10;

  - id: transform_with_clickhouse
    type: io.kestra.plugin.sql.clickhouse.Query
    properties:
      query: |
        SELECT category, AVG(price) AS avg_price FROM "sales_aggregated" GROUP BY category;
    fetchType: STORE

```

**Advanced Configuration:** Kestra also supports retries, error handling, and parallel task execution, making it easy to build robust data pipelines.

**Use Case:** Building a real-time recommendation system pipeline that processes raw sales data, aggregates insights, and exports outputs for downstream APIs.

---

### Why Developers Pair Embedded Databases with Kestra

- **DuckDB + Kestra:** Ideal for local ETL pipelines and interactive SQL workflows.
- **SQLite + Kestra:** Reliable for offline storage and embedded workflows.

Kestra’s ability to mix batch and event-driven tasks in one pipeline means developers can easily adapt to complex data processing needs.

---

### 2025 Takeaways for Developers

1. **DuckDB** continues to lead as a go-to solution for local, high-performance SQL queries.
2. **chDB** provides a powerful in-process SQL OLAP engine for embedded analytics with minimal overhead.
3. **SQLite** remains vital for embedded and offline use cases.
4. **Limbo:** redefines what’s possible with in-process OLTP.
5. **Kestra** orchestrates these technologies into cohesive, event-driven workflows.

**Future Trends:** Expect continued convergence of OLAP and OLTP, improved support for multi-cloud, advancements in distributed computing, and open-source OLAP engines gaining even more traction. The rise of data mesh architectures may also influence how developers design workflows, emphasizing decentralized data ownership and interoperability.

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
