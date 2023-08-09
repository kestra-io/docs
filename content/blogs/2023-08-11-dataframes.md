---
title: "Polars, DuckDB, Pandas, Modin, Ponder, Fugue, Daft — dataframes or SQL?"
description: "Which table abstraction is best for you?"
date: 2023-08-11T10:00:00
category: Solutions
author:
  name: Anna Geller
  image: "ageller"
image: /blogs/2023-08-11-dataframes.jpg
---

Tabular format with rows and columns, popularized by relational databases and Microsoft Excel, is an intuitive way of organizing and manipulating data for analytics.

There are two main ways of transforming and analyzing tabular data — **SQL** and **dataframes** (_sorry, Excel!_).

**SQL** is a declarative language for querying datasets of any size. It's versatile, mature, time-tested, and widely adopted across various professions and tools.

However, some data transformations are more easily expressed using dataframes defined in an imperative language such as Python. This includes pivoting and melting (_reverse process to pivoting_), dealing with missing values or time series, visualizing and iteratively exploring data, or applying custom functions and machine learning algorithms. For such use cases, **dataframes** offer a great addition to SQL-based processes allowing in-memory computation and integrating well with data science workflows.

---

## SQL vs. dataframes or SQL _and_ dataframes?

In the past, SQL and dataframes were two separate worlds. SQL was used by data engineers for querying data lakes and data warehouses, while dataframes were used by ML engineers for in-memory computation and data science. Nowadays, this is changing. The lines between SQL and dataframes are becoming increasingly blurry.

🐼 While **[pandas](https://pandas.pydata.org/docs/index.html)** is the most popular (_"default"?_) dataframe interface in Python, it can also [execute SQL queries](https://pandas.pydata.org/docs/reference/api/pandas.read_sql.html) and [write to SQL databases](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_sql.html) as long as you configure a SQLAlchemy engine or connection.

🐻‍ **Polars** is a [lightning fast DataFrame library](https://github.com/pola-rs/polars) and in-memory query engine that allows you to query tabular data as dataframes in Python, Rust, Node.js, but it also provides a [SQL context](https://pola-rs.github.io/polars/py-polars/html/reference/sql.html) to run transformations in plain SQL.

🦆 **DuckDB** is an in-process OLAP database management system. While SQL is the "mother tongue" of MotherDuck and DuckDB, the tool seamlessly integrates with dataframe libraries such as [pandas](https://duckdb.org/docs/guides/python/import_pandas), [Polars](https://duckdb.org/docs/guides/python/polars), [Vaex](https://duckdb.org/docs/guides/python/vaex), [Ibis](https://duckdb.org/docs/guides/python/ibis) and [Fugue](https://duckdb.org/docs/guides/python/fugue), and provides an imperative [Python client API](https://duckdb.org/docs/api/python/reference/) on top of pandas DataFrames, Polars DataFrames and Arrow tables.

🎶 **Fugue** is a [Python interface](https://github.com/fugue-project/fugue) for distributed transformations over dataframes but it also can execute Fugue-SQL on top of local (pandas, Polars) or distributed (Spark, Dask, or Ray) dataframes.

💦 **Modin** provides a [drop-in replacement for pandas](https://ponder.io/) using [Modin](https://github.com/modin-project/modin), and their commercial offering, Ponder, can translate your pandas code to SQL under the hood and run it on a cloud data warehouse such as BigQuery or Snowflake.

✨ While DataFrame is the core API in **Spark**, [Spark SQL](https://spark.apache.org/docs/latest/sql-programming-guide.html) is a module that brings a SQL interface, again making the lines between SQL and dataframes blurry.

❄️ **Snowpark** is Snowflake's framework for building [distributed dataframes](https://docs.snowflake.com/en/developer-guide/snowpark/python/working-with-dataframes#constructing-a-dataframe). It allows writing custom imperative code in Python, Java, or Scala and pushes down computation to Snowflake as if you would write and execute SQL.

🔸 **[dbt](https://github.com/dbt-labs/dbt-core)** is primarily a SQL-based data transformation tool but it also has a [Python model abstraction](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/python-models) to support... you guessed it, dataframes!


By now, you should be convinced that both SQL and dataframes can be used in tandem across a variety of data tools. But which one should you use? And when?

Let's look at some of the tools mentioned above and explore the strengths of their table abstractions. To show the syntax of each framework, we'll demonstrate how each of these tools can be used to find best-selling products. To do that, we need to follow these steps:
1. **Read multiple CSV files** containing sales data
2. **Concatenate** those into one table
3. **Join** that table with products stored in a separate CSV file
4. Find 10 best-selling products (in terms of order volume) by **aggregating** data
5. **Export** the result in a JSON format so that it can be sent via an API call to operational systems (_e.g., product recommender system_).

You can download a zip file with data used in this article from the [kestra-io/datasets](https://github.com/kestra-io/datasets/raw/main/zipped/dataframes.zip) repository.

Let's get started with the most popular dataframe library in Python — **pandas**.

---

## Pandas

The concept of DataFrames has been initially established in the R programming language. Pandas, released in 2008, has brought dataframes to Python. Due to growing Python's popularity, pandas has, over time, become the default choice for many data science and analytics tasks.

Despite the wide adoption, pandas has several drawbacks, which inspired many new open-source and commercial products. The creator of pandas alone, Wes McKinney, famously wrote ["10 Things I Hate About pandas"](https://wesmckinney.com/blog/apache-arrow-pandas-internals/) on his blog, including aspects such as poor memory management, inefficient data types, and lack of query planning and multicore execution.

The example code below shows one of pandas' drawbacks — the index.

```python
import pandas as pd
import glob

csv_files = glob.glob("dataframes/2023*.csv")

dfs = [pd.read_csv(f) for f in csv_files]
orders = pd.concat(dfs, axis=0, ignore_index=True)
products = pd.read_csv("dataframes/products.csv")
df = orders.merge(products, on="product_id", how="left")

top = (
    df.groupby("product_name", as_index=False)["total"]
    .sum()
    .sort_values("total", ascending=False)
    .head(10)
)

top.to_json("bestsellers_pandas.json", orient="records")
```

When writing pandas code, you need to be aware of the index. For instance, without adding ``as_index=False``, the result in this example would be a pandas Series rather than a DataFrame object, and saving the result to JSON would result in a list of values without matching product IDs.

**What about SQL?** Pandas can execute SQL queries to load data from external databases using a SQLAlchemy connection. However, pandas doesn't provide a SQL interface to define data transformations — SQL is only limited to fetching data into a dataframe.

---

## Polars

Polars is a blazingly fast DataFrame library written in Rust. Ritchie Vink, the creator of Polars, has improved upon pandas' design choices and built a vectorized OLAP query engine that has excellent performance and memory usage.

The key drivers behind Polar's performance (_and popularity_) are:
1. The **query optimizer** that allows lazy evaluation so that users don't need to worry about optimizations — Polars figures out the optimal path to run a query. According to Polars, without a query optimizer, other dataframe implementations ignore several decades of database research.
2. **Parallelism** - Polars leverages **lazy evaluation** to parallelize query execution across all cores of your machine.
3. Memory- and cache-efficient [columnar format](https://arrow.apache.org/docs/format/Columnar.html) — pandas' approach of storing arrays, strings, and structs as Python objects results in a single-threaded execution. In contrast, Polars uses data types based on **Apache Arrow** and can "put your machine to work". By leveraging the [streaming API](https://pola-rs.github.io/polars-book/user-guide/concepts/streaming/), Polars can even work with larger-than-memory datasets.


Here is the representation of our use case in Polars:

```python
import polars as pl
import glob

csv_files = glob.glob("dataframes/2023*.csv")

df = (
    (
        pl.concat([pl.scan_csv(f) for f in csv_files]).join(
            pl.scan_csv("dataframes/products.csv"), on="product_id", how="left"
        )
    )
    .groupby("product_name")
    .agg(pl.col("total").sum().alias("total"))
    .sort("total", descending=True)
    .limit(10)
).collect()

df.write_json("bestsellers_polars.json", row_oriented=True)
```

Personally, I love how composable Polars API is and that I didn't have to worry about the index (_which doesn't exist in Polars!_). Writing Polars code feels as intuitive as the ``dplyr`` package in R. Polars even has a ``glimpse()`` function, extremely useful for wide data with many columns.

The Polars code ran twice as fast as the one from pandas. This doesn't matter as much in this toy example, but when dealing with large datasets, the difference becomes quite significant.

**What about SQL?** Polars provides SQL context supporting many SQL operations. Here is the same example as before but using a combination of Python and SQL:

```python
import polars as pl
import glob

csv_files = glob.glob("dataframes/2023*.csv")

ctx = pl.SQLContext(
    orders=pl.concat([pl.scan_csv(f) for f in csv_files]),
    products=pl.scan_csv("dataframes/products.csv"),
    eager_execution=True,
)

query = """
SELECT product_name, sum(total) as total
FROM orders
LEFT JOIN products USING (product_id)
GROUP BY product_name
ORDER BY total DESC
LIMIT 10
"""

df = ctx.execute(query)
df.write_json("bestsellers_polars.json", row_oriented=True)
```

This example seamlessly combines Python and SQL code. You can see here that the lines between dataframes and SQL tables are becoming increasingly blurry. You can use both of them in combination — it's no longer `SQL` OR `dataframes`, it's now `SQL` AND `dataframes`.


**What about distributed compute?** Currently, the query engine can run only on a single machine. However, Polars has recently [announced that they started a company](https://www.pola.rs/posts/company-announcement/). This means that, in the future, you can expect a distributed version of Polars that will be able to run in a managed environment.

---

## DuckDB

DuckDB is an in-process OLAP DBMS designed to be embedded into applications. It is written in C++ and has client libraries for Python, SQL, Java, Swift (enabling DuckDB in mobile applications).

DuckDB SQL dialect supports complex types (arrays, structs), window functions, nested correlated subqueries, and many (many!) more.

Here is the same example using DuckDB in plain SQL:

```sql
COPY (SELECT product_name, sum(total) as total
			FROM '2023*.csv'
			LEFT JOIN 'products.csv'
			USING (product_id)
			GROUP BY product_name
			ORDER BY total DESC
			LIMIT 10)
TO 'bestsellers_duckdb.json' (FORMAT JSON, ARRAY TRUE);
```

This SQL code wins in terms of simplicity, readability, and conciseness. If you prefer Python over SQL, though, DuckDB [supports that too](https://duckdb.org/docs/api/python/reference/):

```python
import duckdb

products = duckdb.read_csv("dataframes/products.csv")
conn = duckdb.connect()
orders = duckdb.sql("SELECT * FROM 'dataframes/2023*.csv'")

df = (
    orders.join(products, condition="product_id", how="left")
    .aggregate("SUM(total) AS total, product_name", "product_name")
    .order("total DESC")
    .limit(10)
).pl()
df.write_json("bestsellers_duckdb_py.json", row_oriented=True)
```

Writing this "more Pythonic" DuckDB code didn't feel intuitive to me. This code resembles SQL more than Python. The aggregate function _literally_ expects a SQL aggregate expression. I also had to convert the query result to a Polars (or pandas) DataFrame to export it as a JSON file.

Overall, DuckDB SQL is fantastic. It's incredibly rich and fast. But if you prefer to write Python over SQL, Polars might be a better fit for you. At the time of writing, it seems fair to compare the two as follows:
- for super-fast single-node data transformations in SQL, use DuckDB
- for super-fast single-node data transformations in Python, use Polars.


As mentioned in the introduction, I believe the lines here will continue to become increasingly blurry. I can imagine that DuckDB will likely continue improving Python's ergonomics, and Polars will extend its SQL support.

It's also worth mentioning that DuckDB integrates well with Polars - just add ``.pl()`` to convert your DuckDB table to a Polars DataFrame.

**What about distributed compute?** DuckDB is an in-process single-node database. However, MotherDuck offers a distributed DuckDB offering. Check our [DuckDB vs. MotherDuck](https://kestra.io/blogs/2023-07-28-duckdb-vs-motherduck) guide and [our DuckDB blueprints](https://demo.kestra.io/ui/blueprints/community?selectedTag=35) to learn more about various DuckDB use cases for scheduled ETL and event-driven workflows.

Speaking of scaling your dataframes to distributed compute, let's cover Modin, Ponder, and Fugue next.

---

## Modin

Modin is a drop-in replacement for pandas that scales to multiple cores and distributed clusters. It is built on top of Ray and Dask. It is a great way to scale pandas without having to rewrite your code.

Here is the same example as shown before with pandas but using Modin:

```python
import modin.pandas as pd
import glob

csv_files = glob.glob("dataframes/2023*.csv")

dfs = [pd.read_csv(f) for f in csv_files]
orders = pd.concat(dfs, axis=0, ignore_index=True)
products = pd.read_csv("dataframes/products.csv")
df = orders.merge(products, on="product_id", how="left")

top = (
    df.groupby("product_id", as_index=False)["total"]
    .sum()
    .sort_values("total", ascending=False)
    .head(10)
)

top.to_json("bestsellers_modin.json", orient="records")
```

We only had to change the import statement from ``import pandas as pd`` to ``import modin.pandas as pd`` to benefit from parallel compute on a locally initialized Ray cluster.

In this particular example, the Modin code was actually slower than pandas because the overhead of launching a Ray cluster was higher than the time it took to execute the query. However, if you work with large datasets and you already have a running cluster, Modin can deliver significant speedups to common pandas operations without having to rewrite any pandas code other than changing the import.

Let's now look at Ponder, which is a commercial product built on top of Modin.

---

## Ponder

The promise of [Ponder](https://ponder.io/) is that you can execute your Modin code (_which is a drop-in replacement for pandas_) directly in your cloud data warehouse, such as BigQuery or Snowflake.

I was trying to use [Ponder with BigQuery](https://docs.ponder.io/resources/bigquery_setup.html). To do that, I needed to [sign up](https://app.ponder.io/signup), authenticate my terminal with Ponder's API token and install a bunch of Python libraries:

```bash
pip install ponder
pip install google-cloud-bigquery
pip install google-cloud-bigquery-storage
pip install db_dtypes
```

Then, the following code configures the BigQuery connection:

```python
import ponder

ponder.init()

from google.cloud import bigquery
from google.cloud.bigquery import dbapi
from google.oauth2 import service_account
import json

db_con = dbapi.Connection(
    bigquery.Client(
        credentials=service_account.Credentials.from_service_account_info(
            json.loads(open("/Users/anna/dev/gcp/credentials.json").read()),
            scopes=["https://www.googleapis.com/auth/bigquery"],
        )
    )
)

ponder.configure(default_connection=db_con, bigquery_dataset="dataframes")
```

Finally, I was able to run the code for our use case — exactly the same Modin code as shown in the last section:

```python
import modin.pandas as pd
import glob

csv_files = glob.glob("dataframes/2023*.csv")

dfs = [pd.read_csv(f) for f in csv_files]
orders = pd.concat(dfs, axis=0, ignore_index=True)
products = pd.read_csv("dataframes/products.csv")
df = orders.merge(products, on="product_id", how="left")

top = (
    df.groupby("product_id", as_index=False)["total"]
    .sum()
    .sort_values("total", ascending=False)
    .head(10)
)

top.to_json("bestsellers_ponder.json", orient="records")
```

While the setup guide was helpful, I couldn't solve our use case with Ponder.

Ponder created 14 intermediate tables in my BigQuery dataset (yes, 14!) to perform that simple task, and it didn't even succeed in generating a JSON file as output. See the screenshot below for reference:

![ponder](/blogs/2023-08-11-dataframes/ponder.png)


My overall impression is that Ponder seems like an interesting product for big data as it executes everything on BigQuery. It seems quite early (_I got a bunch of errors even when following their getting started guide_).

Let's look at **Fugue**, which is a little bit similar to Modin, as it also provides a distributed dataframe abstraction that can run on top of Ray, Dask, Spark, and more.

---

## Fugue

Fugue is described as a unified interface for distributed computing. You can execute Python, pandas, and SQL code on Spark, Dask, and Ray with minimal rewrites.

Similarly to Modin, Fugue can help you scale pandas code across distributed compute clusters. In contrast to Modin, though, Fugue is not a drop-in replacement for pandas. Fugue's core contributors believe that [pandas-like interfaces are sub-optimal](https://towardsdatascience.com/why-pandas-like-interfaces-are-sub-optimal-for-distributed-computing-322dacbce43) for distributed computing.

This means that you can continue writing pandas code, but Fugue will translate it at runtime to Spark, Dask, or Ray syntax in order to distribute the underlying computations.

Fugue also encourages a mix of Python and SQL code by providing Fugue SQL on top of the core dataframe abstraction.

When demonstrating Modin, we've used Ray and BigQuery. Let's now use Dask as compute engine for Fugue. You can install Fugue as follows:

```bash
pip install fugue
pip install "fugue[dask]"
```

Let's now try to solve our use case with Fugue on Dask:


```python
import fugue.api as fa
import glob

csv_files = glob.glob("dataframes/2023*.csv")


def run(engine=None):
    with fa.engine_context(engine):
        orders = fa.load(csv_files, header=True)
        products = fa.load("dataframes/products.csv", header=True)
        df = fa.join(orders, products, how="left_outer", on=["product_id"])
        res = fa.raw_sql(
            "SELECT product_name, SUM(total) as total FROM", df, "GROUP BY product_name"
        )
        res.sort_values("total", ascending=False).head(10).to_json(
            "bestsellers_fugue.json", orient="records"
        )


run(engine="dask")  # runs on Dask
run(engine="spark")  # runs on Spark
run()  # runs on pandas
```

It's nice that switching between pandas, Spark and Dask is quite straightforward. Many users may also appreciate the ability to mix and match SQL and Python objects.

---

## Daft

[Daft](https://github.com/Eventual-Inc/Daft) is another recently started open-source DataFrame project. At first glance, Daft seems to be as powerful and expressive as Polars while also being able to support distributed computation as Spark, Dask, and Ray do it.

To get started, you can install it using:

```bash
pip install getdaft
```

Simiar to Ponder, the project seems to be quite early. I was getting `exit code 132` even when running a simple script only reading a tiny CSV file. Still, the project seems to be heading in an interesting direction. The table below shows how [Daft positions itself](https://www.getdaft.io/projects/docs/en/latest/dataframe_comparison.html) among other dataframe libraries:

| Dataframe | Query Optimizer | Complex Types | Distributed | Arrow Backed | Vectorized Execution Engine | Out-of-core |
| --- | --- | --- | --- | --- | --- | --- |
| Daft | Yes | Yes | Yes | Yes | Yes | Yes |
| [`Pandas`](https://github.com/pandas-dev/pandas) | No | Python object | No | optional >= 2.0 | Some(Numpy) | No |
| [`Polars`](https://github.com/pola-rs/polars) | Yes | Python object | No | Yes | Yes | Yes |
| [`Modin`](https://github.com/modin-project/modin) | Eagar | Python object | Yes | No | Some(Pandas) | Yes |
| [`Pyspark`](https://github.com/apache/spark) | Yes | No | Yes | Pandas UDF/IO | Pandas UDF | Yes |
| [`Dask DF`](https://github.com/dask/dask) | No | Python object | Yes | No | Some(Pandas) | Yes |

Note that this table is what they say — I haven't verified it myself.

---

## Honorable mentions

We've covered a lot already. Here are some additional tools that support Dataframe and SQL workflows:
- [Vaex](https://github.com/vaexio/vaex) - Out-of-Core hybrid Apache Arrow/NumPy DataFrame for Python, ML, visualization and exploration of big tabular data at a billion rows per second
- [Spark SQL](https://spark.apache.org/sql/) - a SQL interface to Spark dataframes. This is the most mature interface when it comes to seamlessly combining SQL with imperative code written in Python, Scala and Java.
- [Dask](https://www.dask.org/) and [Ray](https://www.ray.io/) — distributed framework to parallelize Python and ML applications. The [dask-sql](https://dask-sql.readthedocs.io/en/latest/) project provides a distributed query engine in Python, allowing a mixture of SQL operations and Python code.
- [R's data.table](https://github.com/Rdatatable/data.table) — provides a high-performance version of [base R](https://www.r-project.org/about.html)'s data.frame
- [Rapids](https://rapids.ai/) - GPU accelerated dataframes.

---

## Summary

This post covered several open-source projects that support dataframes and SQL workflows. Which table abstraction is your favorite? Let us know in the [community Slack](https://kestra.io/slack). Check out [Kestra's blueprints](2023-07-12-your-private-app-store-for-data-pipelines.md) to discover how to orchestrate both SQL and dataframe workflows. If you like Kestra and our blog, give us a [star on GitHub](https://github.com/kestra-io/kestra).

