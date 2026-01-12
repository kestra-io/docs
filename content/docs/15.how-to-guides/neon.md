---
title: Connect Neon Database to Kestra
icon: /docs/icons/neon.svg
stage: Intermediate
topics:
  - Integrations
---

Connect your Neon serverless database to your workflows using the PostgreSQL plugin.

## Overview

Neon is an open-source database company whose mission is to take everything that developers love about Postgres — reliability, performance, extensibility — and deliver it as a serverless product.

To get started, make sure you have a [Neon account](https://neon.tech/home) set up and an [installation of Kestra](../02.installation/index.md) running.

## Setting up a Database in Neon

Once you've logged into Neon, you'll need to set up a project where you'll give it a name, select your desired PostgreSQL version, and select your cloud provider and region.

![neon-1](/docs/how-to-guides/neon-db/neon-1.png)

Once your project is created, you'll arrive at the Project Dashboard page. From here, you can connect to your database, import data, get sample data, view database content, and much more.

![neon-2](/docs/how-to-guides/neon-db/neon-2.png)

## Connecting Neon to Kestra

For our example, we want Kestra to supply the data, so you can select to connect to your database. We'll leave the Branch, Compute, Database, and Role as their defaults, but feel free to adjust as needed. Click on the **Connection string** dropdown list, and select Java. This is the connection string we will use in Kestra to connect to our Neon database. Make note of the password and save it for later steps.

![neon-3](/docs/how-to-guides/neon-db/neon-3.png)

Now that we have a database set up in Neon, we need to create a table for our incoming data. Click on **Tables** on the left sidebar.

![neon-4](/docs/how-to-guides/neon-db/neon-4.png)

Next, click on the '+' icon to add a table, name it, and create it. You can leave just the default `id` column or add in the columns of your data set now. We are going to use Kestra to alter the table, so we will leave the table empty for now.

![neon-5](/docs/how-to-guides/neon-db/neon-5.png)


With the setup in Neon done, we can go Kestra to set up our connection. While there's no official Neon plugin, we can connect using the [PostgreSQL plugin](/plugins/plugin-jdbc-postgres), which supports a number of tasks such as `Query`, `CopyIn`, and `CopyOut`.

To connect, we can copy the URL provided from before. To prevent exposing the password in our flow, take the password saved earlier and store it as a [secret](../06.concepts/04.secret.md). Then, in the URL, switch out the password for the secret expression: `{{ secret('NEON_PASSWORD') }}`.

By using [Plugin Defaults](../05.workflow-components/09.plugin-defaults.md), we can configure our connection to Neon once for all tasks inside of our flow rather than individually for each task.

Once configured, our connection in Kestra will look like the example below:

```yaml
pluginDefaults:
  - forced: true
    type: io.kestra.plugin.jdbc.postgresql
    values:
      url: "jdbc:postgresql://ep-gentle-tree-a25pyhxb-pooler.eu-central-1.aws.neon.tech/neondb?user=neondb_owner&password={{ secret('NEON_PASSWORD') }}&sslmode=require"

```

:::alert{type="info"}
You can also use the `username` and `password` properties rather than combining it all into the `url` property:

```yaml
pluginDefaults:
  - forced: true
    type: io.kestra.plugin.jdbc.postgresql
    values:
      url: "jdbc:postgresql://ep-gentle-tree-a25pyhxb-pooler.eu-central-1.aws.neon.tech/neondb"
      username: "neondb_owner"
      password: "{{ secret('NEON_PASSWORD') }}"
```

:::

## Copying a CSV file into Neon inside of a Flow

Using this [example CSV](https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv), we can copy the data into our table directly from Kestra. You can either set up the columns directly in Neon in the earlier steps or add a task in Kestra to add them automatically like this:

```yaml
id: neon_db_add_columns
namespace: company.team

tasks:
  - id: create_columns
    type: io.kestra.plugin.jdbc.postgresql.Queries
    sql: |
      ALTER TABLE kestra_example
      ADD COLUMN order_id int,
      ADD COLUMN customer_name text,
      ADD COLUMN customer_email text,
      ADD COLUMN product_id int,
      ADD COLUMN price double precision,
      ADD COLUMN quantity int,
      ADD COLUMN total double precision;

pluginDefaults:
  - forced: true
    type: io.kestra.plugin.jdbc.postgresql
    values:
      url: "jdbc:postgresql://ep-gentle-tree-a25pyhxb-pooler.eu-central-1.aws.neon.tech/neondb?user=neondb_owner&password={{ secret('NEON_PASSWORD') }}&sslmode=require"
```

Once your columns are configured, you can use the [CopyIn](/plugins/plugin-jdbc-postgres/io.kestra.plugin.jdbc.postgresql.copyin) task combined with the [HTTP Download](/plugins/core/http/io.kestra.plugin.core.http.download) task to download the CSV file and copy it directly into the table. As we set up the database connection with our [Plugin Defaults](#connecting-supabase-to-kestra), the CopyIn task will connect directly and copy the CSV file into the database.

```yaml
id: neon_db_copyin
namespace: company.team

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: copy_in
    type: io.kestra.plugin.jdbc.postgresql.CopyIn
    table: "kestra_example"
    from: "{{ outputs.download.uri }}"
    header: true
    columns: [order_id,customer_name,customer_email,product_id,price,quantity,total]
    delimiter: ","

pluginDefaults:
  - forced: true
    type: io.kestra.plugin.jdbc.postgresql
    values:
      url: "jdbc:postgresql://ep-gentle-tree-a25pyhxb-pooler.eu-central-1.aws.neon.tech/neondb?user=neondb_owner&password={{ secret('NEON_PASSWORD') }}&sslmode=require"
```

Once this flow completes, we can view the contents of our database in Neon:

![neon-6](/docs/how-to-guides/neon-db/neon-6.png)
