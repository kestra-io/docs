---
title: "DuckDB vs. MotherDuck — should you switch to the cloud version?"
description: "Why and when to use MotherDuck over local DuckDB"
date: 2023-07-28T14:00:00
category: Solutions
author:
  name: Anna Geller
  image: "ageller"
image: /blogs/2023-07-28-duckdb-vs-motherduck.png
---


MotherDuck has [recently launched](https://motherduck.com/blog/announcing-motherduck-duckdb-in-the-cloud/) the managed DuckDB product, which is currently in Beta. This post shares how to get started with both DuckDB and MotherDuck, what are key differences between them, and when to choose each of these options. Before diving into details, let’s clarify what DuckDB and MotherDuck are.

## DuckDB

[DuckDB](https://duckdb.org/) is considered SQLite for Analytics. It’s an open-source embedded OLAP database that can run in-process rather than relying on the traditional client-server architecture. As with [SQLite](https://www.sqlite.org/index.html), there’s no need to install a database server to get started. Installing DuckDB instantly turns your laptop into an OLAP engine capable of aggregating large volumes of data at an impressive speed using just CLI and SQL. It’s especially useful for reading data from local files or objects stored in cloud storage buckets (e.g., parquet files on S3).

In short, this lightweight embedded database allows fast queries in virtually any environment with almost no setup. However, it doesn’t offer [high concurrency](https://duckdb.org/faq.html#how-does-duckdb-handle-concurrency) or user management, and it doesn’t scale horizontally. That’s where MotherDuck can help.

## MotherDuck

[MotherDuck](https://motherduck.com/) is a serverless DuckDB in the cloud with managed storage, data sharing, interactive SQL IDE, and a growing number of features. It’s described as a collaborative analytics platform allowing hybrid execution between data stored in the cloud (*incl. data stored in MotherDuck databases and data stored in remote cloud storage buckets*) and data available locally (*incl. local files and your local DuckDB instances*). MotherDuck intelligently decides what’s the best place to run a given query. You can execute JOINs between tables in your MotherDuck database and data stored locally on your laptop.

## Other organizations supporting DuckDB

The [DuckDB Foundation](https://duckdb.org/foundation/) is a non-profit organization receiving donations that fund DuckDB development, ensuring a stable MIT-licensed open-source project.

[DuckDB Labs](https://duckdblabs.com/) is a research/consulting company working on the open-source DuckDB project and helping other companies adopt DuckDB, integrate it with external systems, and build custom extensions. DuckDB Labs is not competitive with [MotherDuck](https://motherduck.com/) (*the company behind the [MotherDuck product](https://app.motherduck.com/)*). They have been, in fact, partnering to help integrate MotherDuck’s SaaS into the core DuckDB, and DuckDB Labs owns a [portion of MotherDuck](https://duckdblabs.com/news/2022/11/15/motherduck-partnership.html).

---

## What can you do with MotherDuck that you can’t do with a locally running DuckDB

MotherDuck adds several features, including the following:

- [Convenient persistent storage](https://motherduck.com/docs/key-tasks/loading-data-into-motherduck) for your tables and files
- [Hybrid execution](https://motherduck.com/docs/architecture-and-capabilities#hybrid-execution) between datasets on your computer and datasets on MotherDuck
- [Secrets management](https://motherduck.com/docs/authenticating-to-s3#setting-s3-credentials-by-creating-a-secret-object) to store, e.g., your AWS S3 credentials
- Additional [notebook-like SQL IDE](https://motherduck.com/docs/getting-started/motherduck-quick-tour) built into the [UI](https://motherduck.com/docs/getting-started/motherduck-quick-tour) for interactive queries, analysis, and data management (*to load and organize your data*)
- [Sharing databases with your teammates](https://motherduck.com/docs/key-tasks/managing-shared-motherduck-database) and additional collaboration features.

---

## When to switch from DuckDB to MotherDuck

First off, MotherDuck is still in Beta at the time of writing. You can already play with it and invite up to five colleagues, but I’d rather wait until GA (*General Availability*) before running production workloads.

You can start by running DuckDB just on your laptop, and when you hit the limits of what you can query on a **single machine**, the managed version in the cloud might be worth considering, especially to take advantage of the hybrid execution.

Similarly, **sharing data** is already possible when persisting query results, e.g., to S3. However, MotherDuck offers a convenient way of organizing data into databases and tables accessible from anywhere, which is another advantage of MotherDuck over DuckDB.

Speaking of convenience, MotherDuck ships with a clean UI that offers a built-in **collaborative SQL IDE**, a dataset browser/loader, and extra features to sort and pivot query results for more productive analysis.

However, note that there are [some DuckDB features](https://motherduck.com/docs/architecture-and-capabilities#considerations-and-limitations) that MotherDuck doesn’t support yet at the time of writing, such as UDFs, stored procedures, checkpointing, or custom extensions.

In short, MotherDuck adds collaboration, scale, (meta)data management, and convenience to DuckDB.

---

## Getting started with DuckDB

You can install DuckDB using Homebrew (check the [install guide](https://duckdb.org/docs/installation/) for your operating system):

```
brew install duckdb
```

Then, start DuckDB from the CLI and run your first queries:

```sql
$ duckdb orders.db
-- to load data from HTTP URL, install the httpfs extension
INSTALL httpfs;
LOAD httpfs;

-- create table from a remote CSV file
CREATE TABLE orders AS
SELECT * FROM read_csv_auto('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv');

-- create another table
CREATE TABLE bestsellers as
SELECT product_id, round(sum(total),2) as total
FROM orders
GROUP BY 1
ORDER BY 2 DESC;

-- query the result
FROM bestsellers;
```

You should see the following output:

```sql
FROM bestsellers;
┌────────────┬─────────┐
│ product_id │  total  │
│   int64    │ double  │
├────────────┼─────────┤
│          1 │  5314.9 │
│         14 │ 4983.64 │
│          9 │ 4673.32 │
│          3 │ 4462.98 │
│          2 │ 4066.66 │
│          6 │ 3831.39 │
│         19 │ 3383.04 │
│         12 │ 3273.13 │
│         17 │ 3058.31 │
│         11 │  2778.4 │
│         10 │ 2709.66 │
│         20 │ 2382.38 │
│         16 │ 2127.31 │
│          4 │ 1953.19 │
│          7 │ 1697.64 │
│          5 │ 1525.07 │
│          8 │  1503.9 │
│         15 │ 1383.97 │
│         18 │ 1141.83 │
│         13 │  505.65 │
├────────────┴─────────┤
│ 20 rows    2 columns │
└──────────────────────┘
```

To share that `bestsellers` table with others in your team, you can export it as a CSV file:

```sql
COPY bestsellers TO 'bestsellers.csv' (HEADER, DELIMITER ',');
```

You can also export it to S3 using the `httpfs` extension (*just make sure to add the S3 credentials*):

```sql
SET s3_region='us-east-1';
SET s3_secret_access_key='supersecret';
SET s3_access_key_id='xxx';
COPY bestsellers TO 's3://yourbucket/bestsellers.parquet';
```

---

## Getting started with MotherDuck

So far, we’ve created just two tables: orders and bestsellers. Let’s say you kept creating more tables within the local `orders.db` database, and now you want to share them with a colleague. Exporting every table to a file or to S3 one by one can be tedious. MotherDuck makes data sharing and ingestion straightforward:

1. [Authenticate](https://motherduck.com/docs/authenticating-to-motherduck) your terminal using a MotherDuck service token
2. [Ingest the entire local database](https://motherduck.com/docs/getting-started/connect-query-from-python/loading-data-into-md#copying-an-entire-local-duckdb-database-to-motherduck) to the cloud in a single SQL statement
3. [Create a share](https://motherduck.com/docs/key-tasks/managing-shared-motherduck-database) that your colleagues can attach within their duckdb session.

Let’s explain that in more detail.

### 1) Authenticate your terminal to MotherDuck

First, sign up (or sign in) to [app.motherduck.com](https://app.motherduck.com/). Then, copy the [service token](https://motherduck.com/docs/authenticating-to-motherduck) from the UI, and save it somewhere safe, e.g., as an environment variable:

```
export MOTHERDUCK_TOKEN=your_token
```

Within your `duckdb` terminal session, run the command `.open md:my_db?motherduck_token=xxx`, where:

- `md` stands for MotherDuck
- `xxx` is a placeholder for your MotherDuck service token.

To verify successful authentication, you can show available databases:

```sql
$ duckdb orders.db
D show databases; -- local DB is named orders; no other DBs are attached
┌───────────────┐
│ database_name │
│    varchar    │
├───────────────┤
│ orders        │
└───────────────┘
D .open md: -- connect to MotherDuck
D show databases; -- orders DB is not displayed as it's not in MotherDuck yet
┌───────────────┐
│ database_name │
│    varchar    │
├───────────────┤
│ my_db         │
│ sample_data   │
└───────────────┘
```

### 2) Ingest local database to the cloud

The SQL statement `CREATE DATABASE dbname FROM 'orders.db’;` will upload the entire local `orders.db` to the cloud, including all tables we’ve created so far:

```sql
D CREATE DATABASE orders FROM 'orders.db';
D show databases; -- verify that orders database got ingested
┌───────────────┐
│ database_name │
│    varchar    │
├───────────────┤
│ my_db         │
│ orders        │
│ sample_data   │
└───────────────┘
```

The local `orders` database is now in the cloud, and you can run queries from a friendly, lightweight notebook interface.

![blueprintKestra2](/blogs/2023-07-28-duckdb-vs-motherduck/md.png)


Our local orders database is now in the cloud — image by the author

### 3) Create a share URL

Here is the SQL statement to create a share URL:

```sql
D CREATE SHARE orders_share FROM orders;
┌───────────────────────────────────────────────────────┐
│                       share_url                       │
│                        varchar                        │
├───────────────────────────────────────────────────────┤
│ md:_share/orders/6714ca1e-2e1e-46ef-b098-1e306fcf01e6 │
└───────────────────────────────────────────────────────┘
```

Another person with a MotherDuck account can now access that dataset using the command:

```sql
ATTACH 'md:_share/orders/6714ca1e-2e1e-46ef-b098-1e306fcf01e6' AS orders_db;
USE orders_db;
FROM bestsellers;
```

---

## Using MotherDuck and DuckDB in ETL pipelines

So far, we’ve executed standalone queries. Let’s now cover some end-to-end use cases that will leverage MotherDuck for reporting and ETL data pipelines. The examples shown below use [Kestra](https://github.com/kestra-io/kestra) — an open-source orchestration tool. However, note that MotherDuck also integrates with other orchestrators, such as [Apache Airflow](https://www.astronomer.io/blog/three-ways-to-use-airflow-with-motherduck-and-duckdb/).

To get started with Kestra, you can download the [Docker Compose file](https://github.com/kestra-io/kestra/blob/develop/docker-compose.yml), run `docker compose up -d` and launch the UI from http://localhost:8080. From here, you can find several built-in DuckDB examples available in the UI as [Blueprints](https://kestra.io/docs/user-interface-guide/blueprints).

![blueprintKestra](/blogs/2023-07-28-duckdb-vs-motherduck/md2.png)

I found the blueprint “[Extract data, mask sensitive columns using DuckDB and load it to BigQuery](https://demo.kestra.io/ui/blueprints/community/108)” particularly useful. Source systems often contain sensitive data that requires pseudonymization before you are allowed to load that data to a data warehouse and use it for analytics. DuckDB provides utility functions such as `hash()` and `md5()` that can mask sensitive columns between the extract and load steps in a data pipeline. The example shown in the image below illustrates  how DuckDB helps solve fairly complex problems in a simple SQL query.

![blueprintKestra2](/blogs/2023-07-28-duckdb-vs-motherduck/md3.png)

Here is a brief summary of other data pipeline blueprints using DuckDB:

- **[Git workflow for dbt with DuckDB](https://demo.kestra.io/ui/blueprints/community/50)** and **[MotherDuck](https://demo.kestra.io/ui/blueprints/community/111)** — this flow uses DuckDB for data transformations in SQL, but this time combines it with [dbt](https://www.getdbt.com/) models and tests.
- **[Email Report](https://demo.kestra.io/ui/blueprints/community/109)—** every first day of the month, this flow sends current sales numbers to business stakeholders via email. To do that, the workflow reads raw data from S3 and aggregates it using a DuckDB query. The final result is then stored as a CSV file and sent as an email attachment.
- **[Send KPIs via Slack](https://demo.kestra.io/ui/blueprints/community/38):** if a certain KPI is outside of a valid threshold, the flow sends a Slack message to a given channel every Monday at 9 AM. To check whether KPI is valid or not, the flow uses a DuckDB query.
- **[Event-driven anomaly detection](https://demo.kestra.io/ui/blueprints/community/110):** any time a new file arrives in S3, a DuckDB query checks for anomalies in the data and sends an alert if outliers are detected.

---

## Next steps

This post covered what is DuckDB and MotherDuck, and when you should move from a local DuckDB to the cloud. We looked at various ways to use MotherDuck and how you can integrate it into your data pipelines.

This post didn’t cover all MotherDuck’s features, such as [using AI to query data](https://motherduck.com/docs/key-tasks/using-ml-to-query). Check the documentation for full coverage of what you can do with that managed DuckDB service.

