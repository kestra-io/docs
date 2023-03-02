---
order: 6
---
# Data storage and processing

Kestra's primary purpose is to orchestrate data processing via tasks, so data is central to each flow execution.

Depending on the task, data can be stored inside the execution context or inside Kestra's internal storage. You can also manually store data inside Kestra's state store by using dedicated tasks.

Some tasks give you the choice of where you want to store the data, usually using a `fetchType` property or the three `fetch`/`fetchOne`/`store` properties.

For example, using the DynamoDB Query task:

```yaml
id: query
type: io.kestra.plugin.aws.dynamodb.Query
tableName: persons
keyConditionExpression: id = :id
expressionAttributeValues:
  :id: "1"
fetchType: FETCH
```

The `fetchType` property can have four values:
- `FETCH_ONE`: will fetch the first row and set it in a task output attribute (the `row` attribute for DynamoDB); the data will be stored inside the execution context.
- `FETCH`: will fetch all rows and set them in a task output attribute (the `rows` attribute for DynamoDB); the data will be stored inside the execution context.
- `STORE`: will store all rows inside Kestra's internal storage. The internal storage will return a URI usually set in the task output attribute `uri` and that can be used to retrieve the file from the internal storage.
- `NONE`: will do nothing.

The three `fetch`/`fetchOne`/`store` properties will do the same but using three different task properties instead of a single one.

## Storing data

### Storing data inside the flow execution context

Data can be stored as variables inside the flow execution context. This can be convenient for sharing data between tasks.

To do so, tasks store data as output attributes that are then available inside the flow via Pebble expressions like <code v-pre>{{outputs.taskName.attributeName}}</code>. More information about outputs can be found [here](../outputs/).

Be careful that when the size of the data is significant, this will increase the size of the flow execution context, which can lead to slow execution and increase the size of the execution storage inside Kestra's repository. 

::: warning
Depending on the Kestra internal queue and repository implementation, there can be a hard limit on the size of the flow execution context as it is stored as a single row/message. Usually, this limit is around 1MB, so this is important to avoid storing large amounts of data inside the flow execution context.
:::

### Storing data inside the internal storage

Kesta has an internal storage that can store data of any size. By default, the internal storage uses the host filesystem, but plugins exist to use other implementations like Amazon S3, Google Cloud Storage, or Microsoft Azure Blobs storage. See [internal storage configuration](../../administrator-guide/configuration/storage/).

When using the internal storage, data is, by default, stored using [Amazon Ion](https://amazon-ion.github.io/ion-docs/) format.

Tasks that can store data inside the internal storage usually have an output attribute named `uri` that can be used to access this file in following tasks.

The following example uses the [DynamoDB Query](https://kestra.io/plugins/plugin-aws/tasks/dynamodb/io.kestra.plugin.aws.dynamodb.Query.html) task to query a table and the [HTTP Upload](https://kestra.io/plugins/plugin-fs/tasks/ftp/io.kestra.plugin.fs.ftp.Upload.html) task to send the retrieved rows to an external HTTP server.

```yaml
tasks:
- id: query
  type: io.kestra.plugin.aws.dynamodb.Query
  tableName: persons
  keyConditionExpression: id = :id
  expressionAttributeValues:
    :id: "1"
  fetchType: STORE
- id: upload
  type: io.kestra.plugin.fs.ftp.Upload
  host: localhost
  port: 80
  from: "{{ outputs.query.uri }}"
  to: "/upload/file.ion"
```

Dedicated tasks allow managing the files stored inside the internal storage:
- [Concat](https://kestra.io/plugins/core/tasks/storages/io.kestra.core.tasks.storages.Concat.html): concat multiple files.
- [Delete](https://kestra.io/plugins/core/tasks/storages/io.kestra.core.tasks.storages.Delete.html): delete a file.
- [Size](https://kestra.io/plugins/core/tasks/storages/io.kestra.core.tasks.storages.Size.html): get the size of a file.
- [Split](https://kestra.io/plugins/core/tasks/storages/io.kestra.core.tasks.storages.Split.html): split a file into multiple files depending on the size of the file or the number of rows.

### Storing data inside the state store

Dedicated tasks can store data inside Kestra's sate store. The state store transparently uses Kestra's internal storage as its backend store.

The state store allows storing data that will be shared by all executions of the same flow. You can think of it as a key/value store dedicated to a flow (or a namespace if setting the property `namespace: true`).

The following tasks are available:
- [Set](https://kestra.io/plugins/core/tasks/states/io.kestra.core.tasks.states.Set.html): set a state key/value pair.
- [Get](https://kestra.io/plugins/core/tasks/states/io.kestra.core.tasks.states.Get.html): get a state key/value pair.
- [Delete](https://kestra.io/plugins/core/tasks/states/io.kestra.core.tasks.states.Delete.html): delete a state key/value pair.

Example:

```yaml
tasks:
- id: setState
  type: io.kestra.core.tasks.states.Set
  name: myState
  data:
    name: John Doe
- id: getState
  type: io.kestra.core.tasks.states.Get
  name: myState
```

## Processing data

You can make basic data processing thanks to variables processing offered by the Pebble templating engine, see [variables basic usage](../variables/basic-usage.md). 

But these are limited, and you may need more powerful data processing tools; for this, Kestra offers various data processing tasks like file transformations or scripts.

### Converting files

Files from the internal storage can be converted from/to the Ion format to/from another format using the [Serdes](https://kestra.io/plugins/plugin-serdes/) plugin.

The following formats are currently available: Avro, JSON, XML, and Parquet.

Each format offers a **reader** to read an Ion serialized data file and write it in the target format and a **writer** to read a file in a specific format and write it as an Ion serialized data file.

For example, to convert an Ion file to CSV, then back to Ion:

```yaml
tasks:
- id: query
  type: io.kestra.plugin.aws.dynamodb.Query
  tableName: persons
  keyConditionExpression: id = :id
  expressionAttributeValues:
    :id: "1"
  fetchType: STORE
- id: convertToCsv
  type: io.kestra.plugin.serdes.csv.CsvWriter
  from: "{{outputs.query.uri}}"
- id: convertBackToIon
  type: io.kestra.plugin.serdes.csv.CsvReader
  from: "{{outputs.convertToCsv.uri}}""
```

### Processing data using scripts

Kestra has powerful tasks that can launch scripts written in Bash, Node.js, and Python. Depending on your Kestra installation, they can run directly on the host or inside Docker containers.

They are available inside Kestra core, so no plugins must be installed to use them.
- The [Bash](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Bash.html) task will run a bash script, a single command, or a set of commands.
- The [Node](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Node.html) task will run a Node.js script.
- The [Python](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Python.html) task will run a Node.js script.

The following example will query the BigQuery public dataset for Wikipedia pages, convert it to CSV, and use the file inside a Python task. The Python task will install the Pandas library and process the CSV file.

```yaml
id: wikipedia-top-ten-python-panda
namespace: io.kestra.tests
description: A flow that loads wikipedia top 10 EN pages
tasks:
  - id: query-top-ten
    type: io.kestra.plugin.gcp.bigquery.Query
    sql: |
      SELECT DATETIME(datehour) as date, title, views FROM `bigquery-public-data.wikipedia.pageviews_2023` 
      WHERE DATE(datehour) = current_date() and wiki = 'en'
      ORDER BY datehour desc, views desc
      LIMIT 10
    store: true
  - id: write-csv
    type: io.kestra.plugin.serdes.csv.CsvWriter
    from: "{{outputs['query-top-ten'].uri}}"
  - id: "python"
    type: "io.kestra.core.tasks.scripts.Python"
    inputFiles:
      data.csv: "{{outputs['write-csv'].uri}}"
      main.py: |
        import pandas as pd
        from kestra import Kestra
        data = pd.read_csv("data.csv")
        data.info()
        sumOfViews = data['views'].sum()
        Kestra.outputs({'sumOfViews': int(sumOfViews)})
    requirements:
      - pandas
```

Kestra has other plugins that can process data; you can look at all the available plugins [here](https://kestra.io/plugins/).

### Processing data using file transform

Kestra can process data **row by row** using file transform tasks. The transformation will be done with a small script written in Python, JavaScript, or Groovy.

- The [Jython FileTransform](https://kestra.io/plugins/plugin-script-jython/tasks/io.kestra.plugin.scripts.jython.FileTransform.html) task allows transforming rows with Python.
- The [Nashorn FileTransform](https://kestra.io/plugins/plugin-script-nashorn/tasks/io.kestra.plugin.scripts.nashorn.FileTransform.html) task allows transforming rows with JavaScript.
- The [Groovy FileTransform](https://kestra.io/plugins/plugin-script-groovy/tasks/io.kestra.plugin.scripts.groovy.FileTransform.html) task allows transforming rows with Groovy.

The following example will query the BigQuery public dataset for Wikipedia pages, convert it row by row with the Nashorn FileTransform, and write it in a CSV file.

```yaml
id: wikipedia-top-ten-file-transform
namespace: io.kestra.tests
description: A flow that loads wikipedia top 10 EN pages
tasks:
  - id: query-top-ten
    type: io.kestra.plugin.gcp.bigquery.Query
    sql: |
      SELECT DATETIME(datehour) as date, title, views FROM `bigquery-public-data.wikipedia.pageviews_2023` 
      WHERE DATE(datehour) = current_date() and wiki = 'en'
      ORDER BY datehour desc, views desc
      LIMIT 10
    store: true
  - id: file-transform
    type: io.kestra.plugin.scripts.nashorn.FileTransform
    from: "{{outputs['query-top-ten'].uri}}"
    script: |
      logger.info('row: {}', row)

      if (row['title'] === 'Main_Page' || row['title'] === 'Special:Search' || row['title'] === '-') {
        // remove un-needed row
        row = null
      } else {
        // add a 'time' column
        row['time'] = String(row['date']).substring(11)
        // modify the 'date' column to only keep the date part
        row['date'] = String(row['date']).substring(0, 10)
      }
  - id: write-csv
    type: io.kestra.plugin.serdes.csv.CsvWriter
    from: "{{outputs['file-transform'].uri}}"
```

::: tip
The script can access a logger to log messages. Each row is available in a `row` variable where each column is accessible using the dictionary notation `row['columnName']`.
:::

## Purging data

The [PurgeExecution](https://kestra.io/plugins/core/tasks/storages/io.kestra.core.tasks.storages.PurgeExecution.html) task can purge all the files stored inside the internal context by a flow execution.

It can be used at the end of a flow to purge all its generated files.

```yaml
tasks:
  - id: "purge-execution"
    type: "io.kestra.core.tasks.storages.PurgeExecution"
```

The execution context itself will not be available after the end of the execution and will be automatically deleted from Kestra's repository after a retention period (by default, seven days) that can be changed; see [configurations](../../administrator-guide/configuration/).
