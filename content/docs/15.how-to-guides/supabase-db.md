---
title: Connect Supabase Database to Kestra
icon: /docs/icons/supabase.svg
stage: Intermediate
topics:
  - Integrations
---

Connect your Supabase Database to your workflows using the PostgreSQL plugin.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/DZcOlumKrtc?si=48PCtEOZwSgehiZ6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

:::alert{type="info"}
As of Kestra 1.0, there is a dedicated [Supabase plugin](/plugins/plugin-supabase) to replace these steps.
:::

## Overview

Supabase is an open-source Backend-as-a-service (BaaS) platform that helps developers build applications faster and more efficiently. They provide a number of services, including hosted PostgreSQL databases, which can be used within Flows in Kestra.

To get started, make sure you have a [Supabase account](https://supabase.com/) set up and an [installation of Kestra](../02.installation/index.md) running.

## Setting up a Database in Supabase

Once you've logged into Supabase, you'll need to set up an organization where you will create projects to access resources such as a database.

![supabase-1](/docs/how-to-guides/supabase-db/supabase-1.png)

Once your organization is created, you'll be prompted to create a new project. You will need to set a password for this project which we will use later to authenticate with the database inside of Kestra.

![supabase-2](/docs/how-to-guides/supabase-db/supabase-2.png)

Once your project is created, you will now be able to access resources inside of Supabase. Head to the menu on the left side and select **Database**. You will be prompted to create a new table inside of your database, as well as configure any columns you want to use. We can leave the columns blank for now and modify these later once we know what data we want to copy into our database.

![supabase-3](/docs/how-to-guides/supabase-db/supabase-3.png)

## Connecting Supabase to Kestra

Now that we have a database set up in Supabase, we can move into Kestra to set up our connection. While there's no official Supabase plugin, we can connect using the [PostgreSQL plugin](/plugins/plugin-jdbc-postgres), which supports a number of tasks such as `Query`, `CopyIn`, and `CopyOut`.

Inside of Supabase, select the **Connect** button at the top to get information about our databases connection. Select **Type** and change this JDBC. This will give us 3 ways of connecting with a Connection String. As we're only connecting to the database when our workflow runs, the Transaction pooler is a good option to use.

![supabase-4](/docs/how-to-guides/supabase-db/supabase-4.png)

To connect, we can copy the URL provided for the Transaction pooler and replace `[YOUR-PASSWORD]` with the password set earlier. To prevent exposing the password in our flow, store it as a [secret](../06.concepts/04.secret.md).

By using [Plugin Defaults](../05.workflow-components/09.plugin-defaults.md), we can configure our connection to Supabase once for all tasks inside of our flow rather than individually for each task.

Once configured, our connection in Kestra will look like the example below:

```yaml
pluginDefaults:
  - forced: true
    type: io.kestra.plugin.jdbc.postgresql
    values:
      url: "jdbc:postgresql://aws-0-eu-west-2.pooler.supabase.com:6543/postgres?user=postgres.nqxaafovehwkjapsqqlk&password={{ secret('SUPABASE_PASSWORD') }}"

```

:::alert{type="info"}
You can also use the `username` and `password` properties rather than combining it all into the `url` property:

```yaml
pluginDefaults:
  - forced: true
    type: io.kestra.plugin.jdbc.postgresql
    values:
      url: "jdbc:postgresql://aws-0-eu-west-2.pooler.supabase.com:6543/postgres"
      username: "postgres.nqxaafovehwkjapsqqlk"
      password: "{{ secret('SUPABASE_PASSWORD') }}"
```

:::

## Copying a CSV file into Supabase DB inside of a Flow

Using this [example CSV](https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv), we can copy the data into our table directly from Kestra. You can either set up the columns directly in Supabase or add a task in Kestra to add them automatically like this:

```yaml
id: supabase_db_add_columns
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
      url: "jdbc:postgresql://aws-0-eu-west-2.pooler.supabase.com:6543/postgres?user=postgres.nqxaafovehwkjapsqqlk&password={{ secret('SUPABASE_PASSWORD') }}"
```

Once your columns are configured, you can use the [CopyIn](/plugins/plugin-jdbc-postgres/io.kestra.plugin.jdbc.postgresql.copyin) task combined with the [HTTP Download](/plugins/core/http/io.kestra.plugin.core.http.download) task to download the CSV file and copy it directly into our database. As we set up the database connection with our [Plugin Defaults](#connecting-supabase-to-kestra), the CopyIn task will connect directly and copy the CSV file into the database.

```yaml
id: supabase_db_copyin
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
      url: "jdbc:postgresql://aws-0-eu-west-2.pooler.supabase.com:6543/postgres?user=postgres.nqxaafovehwkjapsqqlk&password={{ secret('SUPABASE_PASSWORD') }}"
```

Once this flow completes, we can view the contents of our database in Supabase:

![supabase-5](/docs/how-to-guides/supabase-db/supabase-5.png)
