---
title: "Automate Data Analysis With Kestra and DuckDB"
description: Use Kestra and DuckDB to extract, process, and organize tech job salary data for better insights. 
date: 2023-04-25T18:00:00
category: Solutions
author:
  name: Martin Pierre Roset
  image: "martinroset"
image: /blogs/2023-04-25-automate-data-analysis-with-kestra-and-duckdb.jpg
---

What if you could unlock the secrets of tech salaries with a few lines of code? Get ready to dive into a world of data possibilities with Kestra and DuckDB!

If you've ever found yourself itching to discover the ins and outs of tech salaries, you're in for a treat! In today's data-driven world, staying informed about the job market can be quite a challenge. But fear not, we're about to embark on an exciting adventure with Kestra and DuckDB, two powerful tools that can help you uncover some hidden gems.

### About Kestra

Kestra is our fantastic declarative data orchestration platform that makes managing complex data workflows a breeze.

### About DuckDB

On the other hand, DuckDB is a super cool open-source, embedded analytical database that's lightweight, super-fast, and perfect for on-the-fly data analysis. Imagine having a portable data warehouse in your pocket, ready to crunch numbers at a moment's notice!

## The Ultimate Duo: Kestra and DuckDB

Now that we know our heroes, let's see what they can do together. By combining Kestra's data orchestration prowess with DuckDB's analytical capabilities, we can easily access, process, and analyze data on tech salaries.

But enough chit-chat, let's dive into some code! We've got a Kestra flow that will download a CSV file containing tech salary data from 2020 to 2023, then use DuckDB to crunch the numbers and reveal some intriguing insights. To top it off, we'll save our findings in a Google Sheets CSV file for easy sharing and analysis.

Sounds exciting, right? Trust us, it's a thrilling ride! Check out the Kestra flow code snippet below:

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

    type:  io.kestra.plugin.serdes.csv.CsvWriter

    from:  "{{  outputs.average_salary_by_position.uri  }}"
```

## Breaking Down the Code: Step by Step

![salaries analyses flow](/blogs/2023-04-25-automate-data-analysis-with-kestra-and-duckdb/image-1.png)

Let's dive into the Kestra code we presented earlier and understand how it works step by step, while also discussing more about DuckDB and its real-world applications.

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

The next task, average_salary_by_position, uses the DuckDB Query plugin. DuckDB is an embeddable SQL OLAP database management system that provides powerful analytical capabilities with minimal setup and maintenance. It excels at efficiently processing large volumes of data and is highly compatible with other tools in the data ecosystem, like Apache Arrow, Pandas, and R.

In this task, we supply the downloaded CSV file as input and run a SQL query to calculate the average salary for each job title. We only consider job titles with more than 10 records and sort the results in descending order by average salary.

### DuckDB's advantages include:

-   Fast query execution: DuckDB's columnar storage and vectorized query execution make it blazing fast at processing analytical queries.

-   Low resource consumption: DuckDB's lightweight and embeddable nature allows it to run efficiently even on resource-constrained devices.

-   Seamless integration: DuckDB supports various data formats and integrates smoothly with data science tools like Python, R, and Julia.

### Real-world applications of DuckDB include:

-   Analyzing large-scale scientific datasets for research purposes.

-   Processing log data for debugging or monitoring purposes in software development.

-   Exploring customer data for insights in sales and marketing departments.


```yaml
id:  export_result

    type:  io.kestra.plugin.serdes.csv.CsvWriter

    from:  "{{  outputs.average_salary_by_position.uri  }}"
```

The final task, export_result, uses Kestra's CsvWriter plugin to convert the result of the DuckDB query, which is stored as an ION file, into a CSV file. ION (short for Interchange Object Notation) is a data serialization format similar to JSON but designed to be more efficient in terms of storage and transmission, and it's strongly typed, ensuring data integrity. The use of ION allows for compact storage of query results while maintaining the flexibility to easily convert the data into other formats like CSV. In the end, you can download the CSV output directly to your computer for further analysis and sharing.

![tasks execution svg dll](/blogs/2023-04-25-automate-data-analysis-with-kestra-and-duckdb/image-2.png)

## Exploring Further: New Horizons with Kestra and DuckDB

So, we've already dived into the wonders of analyzing tech salaries with Kestra and DuckDB, but what else can this dynamic duo do? The possibilities are virtually endless! Let's explore some other use cases that can be tackled by leveraging the power of Kestra and DuckDB.

### Real Estate Market Analysis

Want to stay informed about the ever-changing real estate market? Use Kestra and DuckDB to download, process, and analyze housing data from various sources. Identify trends, calculate average prices, or discover the hottest neighborhoods for investment -- all with a few lines of code!

### Social Media Sentiment Analysis

Curious about how people feel about a particular topic or brand? You can use Kestra to scrape social media data and then employ DuckDB to analyze the sentiment behind those tweets, posts, or comments. Make data-driven decisions to improve your marketing strategy or track the impact of a recent product launch.

### Customer Segmentation and Personalization

E-commerce businesses can benefit immensely from Kestra and DuckDB. Gather customer data from various touchpoints, like web analytics and purchase history, and then process and analyze this data to identify valuable customer segments. Create personalized marketing campaigns or product recommendations to boost customer engagement and increase revenue.

### The Adventure Awaits: Exploring Beyond

With this nifty Kestra flow and DuckDB combo, you can start exploring tech salaries like a pro. But don't stop there! The possibilities are endless  think about all the data sets you can explore and the insights you can uncover!

Be sure to follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. Please reach out to us on [Slack](https://kestra.io/slack) if you have any questions or want to share feedback. And if you love what we do, give a star on [our GitHub repository](https://github.com/kestra-io/kestra).
