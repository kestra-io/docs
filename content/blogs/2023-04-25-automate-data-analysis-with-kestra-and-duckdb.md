---
title: "Automate Data Analysis With Kestra and DuckDB"
description: Use Kestra and DuckDB to extract, process, and organize tech job salary data for better insights. 
date: 2023-04-25T18:00:00
category: Solutions
author:
  name: Martin Pierre Roset
  image: "mproset"
image: /blogs/2023-04-25-automate-data-analysis-with-kestra-and-duckdb.jpg
---

[Kestra](https://github.com/kestra-io/kestra), in collaboration with [DuckDB](https://motherduck.com/), offers a highly efficient way to analyze CSV files. In this blog post, we will focus on how these two platforms can be employed to automate data analysis.

Here is a sample Kestra flow code that downloads a CSV file containing tech salary data from 2020 to 2023, uses DuckDB to analyze the data, and saves the findings in a Google Sheets CSV file:

```yaml

id:  salaries_analysis
namespace:  demo
description:  Analyse  data  salaries.
tasks:
  -  id:  download_csv
    type:  io.kestra.plugin.fs.http.Download
    description:  Data  Job  salaries  from  2020  to  2023  (source  ai-jobs.net)
    uri:  https://gist.githubusercontent.com/Ben8t/f182c57f4f71f350a54c65501d30687e/raw/940654a8ef6010560a44ad4ff1d7b24c708ebad4/salary-data.csv

  -  id:  average_salary_by_position
    type:  io.kestra.plugin.jdbc.duckdb.Query
    inputFiles:
      data.csv:  "{{  outputs.download_csv.uri  }}"
    sql:  |
      SELECT 
        job_title,
        ROUND(AVG(salary),2)  AS  avg_salary
      FROM  read_csv_auto('{{workingDir}}/data.csv',  header=True)
      GROUP  BY  job_title
      HAVING  COUNT(job_title)  >  10
      ORDER  BY  avg_salary  DESC;
    store:  true
  -  id:  export_result
    type:  io.kestra.plugin.serdes.csv.IonToCsv
    from:  "{{  outputs.average_salary_by_position.uri  }}"
```

## Kestra and DuckDB

Creating a flow in Kestra to execute this task becomes a straightforward process. You would set up an initial task to download your CSV file, followed by a DuckDB task. This task would use the DuckDB CLI to read the CSV and run a SQL query on it, processing the data directly in memory and spitting out the results. From here, you could add further tasks as needed: for example, sending the output to a Slack channel, an email, or even another system for further analysis.

## How it Works

```yaml

 -  id:  average_salary_by_position
    type:  io.kestra.plugin.jdbc.duckdb.Query
    inputFiles:
      data.csv:  "{{  outputs.download_csv.uri  }}"
    sql:  |
      SELECT 
        job_title,
        ROUND(AVG(salary),2)  AS  avg_salary
      FROM  read_csv_auto('{{workingDir}}/data.csv',  header=True)
      GROUP  BY  job_title
      HAVING  COUNT(job_title)  >  10
      ORDER  BY  avg_salary  DESC;
    store:  true
```

The task, average_salary_by_position, uses the DuckDB Query plugin. DuckDB is an embeddable SQL OLAP database management system that provides powerful analytical capabilities with minimal setup and maintenance. It excels at efficiently processing large volumes of data and is highly compatible with other tools in the data ecosystem, like Apache Arrow, Pandas, and R.

In this task, we supply the downloaded CSV file as input and run a SQL query to calculate the average salary for each job title. We only consider job titles with more than 10 records and sort the results in descending order by average salary.

```yaml
id:  export_result
    type:  io.kestra.plugin.serdes.csv.IonToCsv
    from:  "{{  outputs.average_salary_by_position.uri  }}"
```

The final task, export_result, uses Kestra's CsvWriter plugin to convert the result of the DuckDB query, which is stored as an ION file, into a CSV file. ION (short for Interchange Object Notation) is a data serialization format similar to JSON but designed to be more efficient in terms of storage and transmission, and it's strongly typed, ensuring data integrity. The use of ION allows for compact storage of query results while maintaining the flexibility to easily convert the data into other formats like CSV. In the end, you can download the CSV output directly to your computer for further analysis and sharing.

![tasks execution svg dll](/blogs/2023-04-25-automate-data-analysis-with-kestra-and-duckdb/image-2.png)

## Exploring Further with Kestra and DuckDB

For those who are interested in exploring more about the capabilities and use cases of Kestra and DuckDB, the [Blueprints](https://demo.kestra.io/ui/blueprints/community?q=duck&page=1&selectedTag=35) provides valuable resources and pre-built workflows that you can use as a starting point for your own tasks.

![duckdb blueprints](/blogs/2023-04-25-automate-data-analysis-with-kestra-and-duckdb/blueprints-DuckDB.png)

If you are particularly interested in learning more about DuckDB and its various applications, you can check out this blog post: [DuckDB vs MotherDuck](https://kestra.io/blogs/2023-07-28-duckdb-vs-motherduck). It provides a comprehensive comparison between DuckDB and its in-memory, shareable version, MotherDuck, and will give you further insights into how to use these tools effectively in your own data workflows.

If you have any questions about what we've covered in this post, reach out via [our community Slack](https://kestra.io/slack). Lastly, if you like the project, give us a [star on GitHub](https://github.com/kestra-io/kestra). 