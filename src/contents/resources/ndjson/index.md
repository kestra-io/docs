---
title: "NDJSON: The Newline Delimited JSON Format for Streaming Data"
description: "NDJSON is a powerful format for handling large, streaming JSON data, where each line represents a distinct JSON object. Learn how it differs from standard JSON and how Kestra orchestrates its processing for efficient data pipelines."
metaTitle: "NDJSON: Newline Delimited JSON Explained"
metaDescription: "NDJSON is the newline-delimited JSON format for streaming and large datasets. Explore its benefits, how it compares to JSON, and how Kestra processes it."
tag: data
date: 2026-07-10
slug: "ndjson"
faq:
  - question: "What is NDJSON format?"
    answer: "NDJSON, or Newline Delimited JSON, is a format where each line in a file or stream is a complete, self-contained JSON object. Unlike a single large JSON array, NDJSON allows parsers to process data line by line, making it ideal for streaming, logging, and handling very large datasets without loading everything into memory at once."
  - question: "What's the difference between JSON and NDJSON?"
    answer: "Standard JSON typically represents a single, potentially complex data structure, often an array of objects, requiring the entire file to be parsed. NDJSON, on the other hand, consists of multiple independent JSON objects, each terminated by a newline. This line-by-line structure allows for streaming and partial processing, making it more efficient for continuous data flows."
  - question: "Is NDJSON the same as JSONL?"
    answer: "Yes, NDJSON (Newline Delimited JSON) and JSONL (JSON Lines) are effectively the same format. While 'ndjson' was once associated with a more formal specification that included comments, the modern usage and practical implementations of both terms have converged to mean a file or stream where each line is a valid JSON object, separated by a newline character."
  - question: "How do I open an NDJSON file?"
    answer: "NDJSON files can be opened with any text editor, where you'll see a series of JSON objects, each on its own line. For programmatic access, most modern programming languages (Python, Node.js, Java) have libraries that can read and parse NDJSON streams efficiently, often treating each line as a separate JSON record."
  - question: "Why is NDJSON better suited for streaming data?"
    answer: "NDJSON excels in streaming scenarios because each record is self-contained and delimited. A parser can read and process one line at a time without needing to know the size or structure of the entire dataset. This prevents memory overflows when dealing with extremely large files and enables real-time processing as data arrives."
  - question: "What are common use cases for NDJSON?"
    answer: "Common use cases for NDJSON include logging, where each log entry is a JSON object; data streaming, for sending large datasets over network protocols; and big data processing, where tools like Spark or Flink can easily consume and produce NDJSON. It's also frequently used in bulk data loading into NoSQL databases."
---

> **TL;DR** — NDJSON, or Newline Delimited JSON, is a format where each line in a file or stream is a complete, self-contained JSON object. Unlike a single large JSON array, NDJSON allows parsers to process data line by line, making it ideal for streaming, logging, and handling very large datasets without loading everything into memory at once.

Dealing with massive JSON files can quickly become a memory and performance nightmare. Traditional JSON, often structured as a single large array of objects, demands that the entire file be loaded and parsed before any data can be accessed. This approach is inefficient for streaming data or datasets that grow continuously.

This is where NDJSON (Newline Delimited JSON) provides a practical alternative. By structuring each JSON object on its own line, NDJSON enables efficient, line-by-line processing, transforming how organizations handle large-scale data streams and logs. This article delves into NDJSON, its advantages, and how Kestra orchestrates its management for robust data pipelines.

## How NDJSON works: A line-delimited approach to JSON

The core principle of NDJSON is simplicity: each line is a valid, self-contained JSON object, and each line is separated by a newline character (`\n`).

Consider a standard JSON file representing a list of users:
```json
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" },
  { "id": 3, "name": "Charlie" }
]
```
To read this, a parser must load the entire file, find the opening and closing brackets, and then process the objects within the array.

Now, here is the same data in NDJSON format:
```json
{"id": 1, "name": "Alice"}
{"id": 2, "name": "Bob"}
{"id": 3, "name": "Charlie"}
```
Each user is a complete JSON object on its own line. A parser can read the first line, process it, discard it from memory, and move to the next. This structure is fundamentally streamable and makes it easy to append new records without modifying the existing file structure. You can find more details on how to [interact with JSON data in Kestra workflows](/docs/how-to-guides/json) in our documentation.

## NDJSON vs. JSON: Why streaming matters

The structural difference between JSON and NDJSON directly impacts performance and scalability, especially in data-intensive applications.

| Feature | Standard JSON (Array) | NDJSON |
| --- | --- | --- |
| **Parsing** | Monolithic: must read the entire file to be valid. | Streamable: each line can be parsed independently. |
| **Memory Usage** | High: the entire data structure must fit into memory. | Low: only one line needs to be in memory at a time. |
| **Appendability** | Complex: requires parsing the file, adding to the array, and rewriting. | Simple: append a new line with the new JSON object. |
| **Error Handling** | A single syntax error can invalidate the entire file. | An error on one line does not affect other lines. |

This makes NDJSON the superior choice for use cases like application logging, real-time event streams, and exporting large datasets from databases where the total size might be unknown or exceedingly large.

### NDJSON and JSONL: The converging standards

You might also encounter the term "JSON Lines" or `JSONL`. For all practical purposes, NDJSON and JSONL refer to the same format. While there were minor historical differences in their specifications, the community has converged on the same implementation: one valid JSON value per line, separated by newlines. Today, the terms are used interchangeably.

## Why streaming NDJSON needs robust orchestration

While NDJSON simplifies data streaming, managing it in a production environment introduces operational challenges. A reliable data pipeline needs more than just the ability to read lines from a file. Key considerations include:

*   **Error Handling and Retries:** What happens if a downstream system is temporarily unavailable during a bulk load? The process must be able to retry failed batches without losing data.
*   **Data Validation and Transformation:** How do you ensure each JSON object conforms to a required schema before loading it? Data often needs to be cleaned, enriched, or restructured in-flight.
*   **Scalability and Concurrency:** How do you process multiple NDJSON streams in parallel or handle backpressure when a consumer is slow?
*   **Observability:** You need visibility into the entire process, including which records were processed, which failed, and why.
*   **Idempotency:** Re-running a workflow for the same data should not result in duplicate records in the target system.

Addressing these concerns with custom scripts is complex and brittle. A modern orchestration platform provides the necessary framework to build, monitor, and maintain these data flows reliably. Check out our [Data Engineering Resources](/resources/data) for more insights.

## Orchestrate NDJSON with Kestra: Generating and bulk loading data

Kestra provides a declarative way to manage NDJSON workflows. The following example demonstrates a common pattern: generating NDJSON data with a Python script, storing it temporarily in Kestra's internal storage, and then using a dedicated plugin to bulk load it into a [MongoDB](/plugins/plugin-mongodb) collection.

```yaml
id: generateAndLoadNdjson
namespace: dev.examples

tasks:
  - id: generate-records
    type: io.kestra.plugin.scripts.python.Script
    description: "Generates sample user data as an NDJSON file."
    script: |
      import json
      
      users = [
          {"_id": 1, "name": "Alice", "status": "active"},
          {"_id": 2, "name": "Bob", "status": "inactive"},
          {"_id": 3, "name": "Charlie", "status": "active"}
      ]
      
      with open("{{ outputFiles.users }}", "w") as f:
          for user in users:
              f.write(json.dumps(user) + '\n')
    outputFiles:
      - users.ndjson

  - id: bulk-load-to-mongo
    type: io.kestra.plugin.mongodb.bulk
    description: "Reads the NDJSON file and bulk loads it into MongoDB."
    connection:
      uri: "{{ secret('MONGO_URI') }}"
    database: "production"
    collection: "users"
    from: "{{ outputs['generate-records'].outputFiles.users }}"
```

Here's what's worth noticing in this workflow:

*   **Declarative Pipeline:** The entire process is defined in a simple, version-controllable YAML file. There's no hidden "glue code."
*   **Internal Storage:** Kestra seamlessly handles the intermediate storage. The Python script writes to an output file, and the MongoDB task reads from it using a simple expression `{{ outputs['generate-records'].outputFiles.users }}`.
*   **Specialized Plugins:** Instead of writing custom loading logic, the workflow uses the `io.kestra.plugin.mongodb.bulk` task, which is optimized for high-performance bulk operations using NDJSON. A similar plugin exists for Elasticsearch bulk loading, `io.kestra.plugin.elasticsearch.bulk`, providing a consistent pattern for different destinations.
*   **Secrets Management:** Database credentials are not hardcoded. They are securely accessed via `{{ secret('MONGO_URI') }}`, ensuring proper security hygiene.

## Where NDJSON pays off: Practical use cases

The streamable nature of NDJSON makes it a valuable format in various data-driven scenarios:

*   **Real-Time Logging:** Aggregating logs from multiple services where each log event is a structured JSON object.
*   **Large Data Ingestion:** Efficiently loading massive datasets from cloud storage (like S3 or GCS) into data warehouses or databases.
*   **Big Data Processing:** Using tools like Spark or DuckDB to process terabytes of data, where NDJSON serves as a convenient and performant serialization format.
*   **API Data Exchange:** Streaming large result sets from an API endpoint without having to buffer the entire response in memory. This is crucial for building a scalable [data pipeline](/resources/data/data-pipeline).

## Related concepts

*   [Data Orchestration](/resources/data/data-orchestration)
*   [ETL Workflow](/resources/data/etl-workflow)
*   [Parsing and Transforming JSON](/docs/how-to-guides/json)
*   [Converting CSV to ION format](/plugins/plugin-serdes/csv/io.kestra.plugin.serdes.csv.csvtoion)

Ready to simplify your data streaming workflows? Explore Kestra's capabilities for [declarative data orchestration](/data) and more.
