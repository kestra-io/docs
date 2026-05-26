---
title: "The Kestra Plugin Ecosystem for AI: From LLM Providers to Vector Databases"
description: "Building AI pipelines means stitching together LLM calls, vector search, document ingestion, and data preprocessing. Kestra ships plugins for all of it. This blog post maps every plugin category that matters for AI workflows — outside of plugin-ai — so you know exactly what to reach for."
date: 2026-05-26T09:00:00
category: Solutions
author:
  name: François Delbrayelle
  linkedin: https://www.linkedin.com/in/fdelbrayelle/
  image: fdelbrayelle
  role: Lead Software Engineer
image: ./main.png
schema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  mainEntity:
    - "@type": "Question"
      name: "Which Kestra plugins support LLM providers?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Kestra ships dedicated plugins for Anthropic (Claude), OpenAI (GPT + embeddings + DALL·E), Google Gemini, Mistral AI, DeepSeek, Ollama (local LLMs), Perplexity, and HuggingFace Inference API. Each plugin exposes the provider's chat, embedding, and other endpoints as Kestra tasks."
    - "@type": "Question"
      name: "Which Kestra plugins support vector databases?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Kestra supports Weaviate (plugin-weaviate), Pinecone (plugin-pinecone), OpenSearch (plugin-opensearch), Elasticsearch (plugin-elasticsearch), Typesense (plugin-typesense), Meilisearch (plugin-meilisearch), MongoDB Atlas Vector Search (plugin-mongodb), Redis Search (plugin-redis), and Neo4j (plugin-neo4j) for knowledge graphs."
    - "@type": "Question"
      name: "How do I run custom Python or ML code in Kestra?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Use plugin-scripts for full Python scripts with pip/UV dependency management (including GPU workloads via Modal), or plugin-graalvm for lightweight in-process Python, JavaScript, and Ruby execution without container overhead."
    - "@type": "Question"
      name: "Which Kestra plugin is best for RAG document ingestion?"
      acceptedAnswer:
        "@type": "Answer"
        text: "plugin-tika parses PDFs, Office documents, images (with OCR via Tesseract), and dozens of other formats into plain text — the standard first step for RAG pipelines. For web content, plugin-apify adds web scraping via Apify actors."
---

An AI pipeline is rarely just a single LLM call. It typically involves ingesting documents, generating embeddings, indexing them into a vector store, transforming the data, and orchestrating the whole sequence reliably. Kestra covers every layer of that stack through its plugin ecosystem.

One plugin group is purpose-built for AI: [`plugin-ai`](/plugins/plugin-ai), which provides the shared abstractions that power Kestra's AI tasks. This post covers the rest of the ecosystem — from format conversion and serialization with [`plugin-serdes`](/plugins/plugin-serdes) to vector databases, document extraction, scripting, and everything else AI workflows draw on, organized by the role each group plays.

## LLM Providers

Kestra ships a dedicated plugin for every major LLM provider. Each integrates directly as a Kestra task, meaning retries, error handling, secret management, and observability come for free.

| Plugin | Key tasks | What you get |
|--------|-----------|--------------|
| [`plugin-anthropic`](/plugins/plugin-anthropic) | `Chat`, `Vision` | Claude API — text and vision |
| [`plugin-openai`](/plugins/plugin-openai) | `ChatCompletion`, `Embedding`, `ImageEdit`, `SpeechToText` | GPT models, embeddings, DALL·E, Whisper |
| [`plugin-gemini`](/plugins/plugin-gemini) | `TextPrompt`, `Vision` | Google Gemini — text and multimodal |
| [`plugin-mistral`](/plugins/plugin-mistral) | `ChatCompletion`, `Embedding` | Mistral AI — chat and embeddings |
| [`plugin-deepseek`](/plugins/plugin-deepseek) | `ChatCompletion` | DeepSeek reasoning models |
| [`plugin-ollama`](/plugins/plugin-ollama) | `ChatCompletion`, `Embedding` | Self-hosted LLMs via Ollama |
| [`plugin-perplexity`](/plugins/plugin-perplexity) | `ChatCompletion` | Perplexity — search-augmented responses |
| [`plugin-huggingface`](/plugins/plugin-huggingface) | `Inference` | 700k+ HuggingFace models via Inference API |

Because Kestra tasks are declarative, switching providers is a one-line change in the flow YAML. You can A/B test models across branches of the same flow, or fan out to multiple providers in parallel.

## Vector Databases and Search

Retrieval-Augmented Generation requires fast, accurate retrieval. Kestra covers the full spectrum — from purpose-built vector databases to search engines with vector extensions.

### Purpose-built vector databases

[`plugin-weaviate`](/plugins/plugin-weaviate) is the most AI-native option. It exposes `SchemaCreate` to define collection structures, `BatchCreate` for bulk vector ingestion, `Query` for GraphQL-based semantic and hybrid search, and `Delete` for cleanup. Weaviate's native support for nearText and nearVector queries maps directly to RAG retrieval patterns.

[`plugin-pinecone`](/plugins/plugin-pinecone) covers Pinecone, the fully managed serverless vector database. It handles index and namespace management, vector upsert and deletion, and similarity queries with metadata filtering — the standard operations for RAG retrieval without any infrastructure to run.

### Search engines with vector extensions

| Plugin | Notable tasks | Vector capability |
|--------|---------------|-------------------|
| [`plugin-opensearch`](/plugins/plugin-opensearch) | `Search`, `Bulk`, `Load`, `Scroll`, `Ppl` | k-NN vector search + BM25 hybrid |
| [`plugin-elasticsearch`](/plugins/plugin-elasticsearch) | `Search`, `Bulk`, `Load`, `Scroll` | Dense vector fields + BM25 hybrid |
| [`plugin-typesense`](/plugins/plugin-typesense) | `Search`, `BulkIndex`, `FacetSearch` | Fast typo-tolerant + vector search |
| [`plugin-meilisearch`](/plugins/plugin-meilisearch) | `Search`, `DocumentAdd`, `FacetSearch` | Lightweight open-source semantic search |

### Document databases with vector search

[`plugin-mongodb`](/plugins/plugin-mongodb) exposes `Find` with `$vectorSearch` support (Atlas Vector Search), plus `Aggregate` for complex pipelines, `Bulk` for large ingestion batches, and a `Trigger` task that fires on Change Streams — useful for near-real-time indexing flows.

[`plugin-redis`](/plugins/plugin-redis) covers JSON document storage (`Get`, `Set`, `Delete`) and Pub/Sub (`Publish`). With RedisSearch enabled, it becomes a high-throughput embedding cache and real-time retrieval layer.

### Graph databases

[`plugin-neo4j`](/plugins/plugin-neo4j) provides `Query` (Cypher with configurable result handling) and `Batch` for bulk operations. Knowledge graphs built in Neo4j let LLMs traverse structured relationships for reasoning chains and entity resolution — a pattern increasingly common in agentic AI architectures.

## Document Extraction and Web Ingestion

RAG starts with raw content. Before embeddings can be generated, documents need to be parsed into clean text.

[`plugin-tika`](/plugins/plugin-tika) wraps Apache Tika. Its `Parse` task extracts text, metadata, and embedded files from PDFs, Word documents, PowerPoint files, Excel spreadsheets, HTML, images (with optional OCR via Tesseract), and dozens of other formats. One task handles the full corpus of enterprise document types — the standard first step in any RAG ingestion pipeline.

[`plugin-apify`](/plugins/plugin-apify) covers web content. `Run` triggers an Apify actor with configurable inputs and run caps; `Get` and `GetLastRun` retrieve the resulting dataset; `Save` persists it to Kestra's internal storage for downstream processing. This is the practical path for feeding live web content into a training or retrieval pipeline.

## Format Conversion and Serialization

Before data moves between pipeline stages, it often needs to change shape. [`plugin-serdes`](/plugins/plugin-serdes) handles serialization and deserialization across the formats that appear throughout AI workflows: CSV, JSON, AVRO, Parquet, XML, YAML, Protobuf, and Excel, converting each to and from Kestra's internal Ion format so any two tasks can exchange data without manual parsing.

For AI workloads, three capabilities stand out.

**Markdown conversion.** The `HtmlToMarkdown` task converts HTML files into Markdown — directly useful for RAG pipelines and LLM preprocessing, where HTML is too verbose: Markdown conveys the same structure with significantly fewer tokens. `MarkdownToText` strips all formatting to produce clean plain text, the right input for embedding models that don't need structural markup. `MarkdownToHtml` rounds the set out for cases where the output needs to go back into an HTML context (email templates, rich notifications).

**TOON.** `JsonToToon` and `ToonToJson` convert between JSON and [TOON](/blogs/kestra-mcp-plugins-blueprints) (Token-Oriented Object Notation), a deterministic, indentation-based format that encodes the JSON data model with explicit structure and minimal quoting. For uniform arrays of objects, TOON uses tabular encoding that conveys the same data in significantly fewer tokens than JSON — lowering cost and latency on every inference call that passes structured data as LLM context.

**Schema inference.** `InferAvroSchemaFromIon` scans an Ion file and emits a compatible `.avsc` schema, eliminating the manual schema-writing step before converting to Avro or Parquet.

## Data Transformation and Preprocessing

AI models are sensitive to input quality. Kestra provides several transformation layers, from lightweight expression-based transforms to full SQL modeling.

[`plugin-transform`](/plugins/plugin-transform) operates on Kestra's internal record streams. The `Records` module offers `Filter` (boolean expressions), `Map` (field projection), `Select` (field renaming), `Aggregate` (grouping with sum/count/avg), `Unnest` (flattening nested arrays), and `Zip` (merging streams by index). The `Grok` module parses unstructured text using named patterns. The `JSONata` module applies JSONata expressions to transform JSON — useful for reshaping LLM outputs before downstream processing.

[`plugin-datagen`](/plugins/plugin-datagen) generates synthetic data using Faker-based generators. `Generate` produces configurable batches in JSON, CSV, or SQL format. A `RealtimeTrigger` enables continuous data generation for streaming pipelines. The primary AI use case is creating reproducible training and evaluation datasets without touching production data.

[`plugin-dbt`](/plugins/plugin-dbt) brings SQL-based feature engineering into the flow. Run dbt models, execute tests, and install dependencies as discrete Kestra tasks — making feature pipelines version-controlled, testable, and observable alongside the rest of the workflow.

## Scripting and Custom Code

When the task doesn't fit a pre-built plugin, Kestra supports arbitrary code execution across 18 language runtimes.

[`plugin-scripts`](/plugins/plugin-scripts) runs `Script` and `Commands` tasks for Python, Node.js, R, Julia, Go, Ruby, Shell, Perl, PHP, Lua, Deno, Bun, JBang, Groovy, Jython, Nashorn, and more. The Python task supports pip and UV for dependency management, making it straightforward to install `transformers`, `torch`, or any other ML library inline. This is the escape hatch for custom inference logic, fine-tuning jobs, or integrations not covered by a dedicated plugin.

[`plugin-graalvm`](/plugins/plugin-graalvm) provides in-process execution for Python, JavaScript, and Ruby via GraalVM — no container startup overhead. `Eval` runs inline scripts; `FileTransform` applies a script to transform a file. The tradeoff is that GraalVM's Python compatibility is narrower than CPython, so it's best suited for lightweight transforms and preprocessing rather than heavy ML workloads.

## GPU Compute and Containers

Heavy inference and fine-tuning workloads need compute backends beyond a standard Kestra worker.

[`plugin-modal`](/plugins/plugin-modal) wraps the Modal CLI. `ModalCLI` runs Modal functions on serverless GPU infrastructure — useful for fine-tuning jobs, batch inference, or any compute-intensive task that would otherwise require managing GPU instances.

[`plugin-docker`](/plugins/plugin-docker) and [`plugin-kubernetes`](/plugins/plugin-kubernetes) cover container-based execution. Docker tasks run ML containers locally or on a Docker host; Kubernetes tasks (`Deploy`, `Job`) schedule GPU workloads on a Kubernetes cluster. Combined with Kestra's [task runners](/docs/task-runners), they enable fully declarative GPU job submission.

[`plugin-databricks`](/plugins/plugin-databricks) connects Kestra to Databricks for notebook execution, job submission, and MLflow integration — the standard path for teams already on the Databricks ML platform.

## Data Quality and Lineage

Reliable AI pipelines require validated inputs. Garbage in, garbage out applies especially to training and evaluation datasets.

[`plugin-soda`](/plugins/plugin-soda) runs Soda scans against any data source. Define checks for null rates, value distributions, schema drift, and referential integrity; Kestra surfaces the results as task outputs and can gate downstream tasks on scan outcomes.

[`plugin-datahub`](/plugins/plugin-datahub) integrates with DataHub for metadata ingestion and lineage tracking. Emit lineage events from Kestra flows to make model inputs, intermediate datasets, and outputs traceable in the catalog.

## Cloud Platform Plugins

The major cloud providers each have an AI-relevant surface area covered by their respective Kestra plugins.

| Plugin | AI-relevant services |
|--------|---------------------|
| [`plugin-aws`](/plugins/plugin-aws) | S3 (data lake), Bedrock (managed LLMs), SageMaker (training/inference), Textract (OCR), Comprehend (NLP) |
| [`plugin-gcp`](/plugins/plugin-gcp) | Vertex AI (training/serving), BigQuery ML, Cloud Storage, Document AI |
| [`plugin-azure`](/plugins/plugin-azure) | Azure OpenAI, Cognitive Services, Blob Storage, Azure ML |

## Connectors and Infrastructure

Beyond compute and storage, AI pipelines need reliable data transport and versioning.

[`plugin-kafka`](/plugins/plugin-kafka) enables event-driven AI architectures. Use it to consume a stream of user interactions for real-time RAG, or to publish inference results downstream. Kestra's Kafka trigger fires a flow on every message or batch, making it straightforward to build continuously-updating vector indexes.

[`plugin-git`](/plugins/plugin-git) and [`plugin-github`](/plugins/plugin-github) bring prompt and configuration versioning into the flow. Store prompts, system instructions, and model configuration as code; pull them at runtime so flows always run against a pinned, auditable version.

[`plugin-fs`](/plugins/plugin-fs) provides filesystem and object storage tasks for S3, GCS, SFTP, FTP, and local paths — the plumbing for moving model inputs and outputs between pipeline stages.

## Putting It Together

A typical RAG pipeline in Kestra draws on four to six of these plugin groups in sequence:

1. **Ingest**: `plugin-tika` parses source documents; `plugin-apify` scrapes web content
2. **Transform**: `plugin-transform` cleans and chunks text; `plugin-serdes` converts formats
3. **Embed**: `plugin-openai` or `plugin-huggingface` generates embedding vectors
4. **Index**: `plugin-weaviate` or `plugin-opensearch` stores and indexes the vectors
5. **Retrieve and generate**: `plugin-anthropic` or `plugin-gemini` answers queries using retrieved context
6. **Validate**: `plugin-soda` checks data quality at each stage; `plugin-datahub` records lineage

Each step is a Kestra task with retries, timeouts, secret injection, and observability built in. The flow YAML is the single source of truth for the entire pipeline — portable, version-controlled, and executable anywhere Kestra runs.

---

## Frequently asked questions

### Which Kestra plugins support LLM providers?
Kestra ships dedicated plugins for [Anthropic](/plugins/plugin-anthropic), [OpenAI](/plugins/plugin-openai), [Gemini](/plugins/plugin-gemini), [Mistral](/plugins/plugin-mistral), [DeepSeek](/plugins/plugin-deepseek), [Ollama](/plugins/plugin-ollama), [Perplexity](/plugins/plugin-perplexity), and [HuggingFace](/plugins/plugin-huggingface). Each wraps the provider's API as declarative Kestra tasks with native retry, secret, and observability support.

### Which Kestra plugins support vector databases?
[`plugin-weaviate`](/plugins/plugin-weaviate) and [`plugin-pinecone`](/plugins/plugin-pinecone) are purpose-built for vector storage and retrieval. [`plugin-opensearch`](/plugins/plugin-opensearch) and [`plugin-elasticsearch`](/plugins/plugin-elasticsearch) provide hybrid BM25 + k-NN search. [`plugin-typesense`](/plugins/plugin-typesense) and [`plugin-meilisearch`](/plugins/plugin-meilisearch) offer lightweight alternatives. [`plugin-mongodb`](/plugins/plugin-mongodb) supports Atlas Vector Search. [`plugin-redis`](/plugins/plugin-redis) covers embedding caching. [`plugin-neo4j`](/plugins/plugin-neo4j) handles knowledge graph retrieval.

### How do I run custom Python or ML code in Kestra?
[`plugin-scripts`](/plugins/plugin-scripts) runs Python `Script` and `Commands` tasks with pip or UV dependency management — install any ML library inline. For lightweight transforms without container overhead, [`plugin-graalvm`](/plugins/plugin-graalvm) runs Python, JavaScript, and Ruby in-process via GraalVM.

### Which Kestra plugin is best for RAG document ingestion?
[`plugin-tika`](/plugins/plugin-tika) (`Parse` task) handles PDFs, Office formats, HTML, images (with OCR), and dozens more — one task covers the full enterprise document corpus. For web content, [`plugin-apify`](/plugins/plugin-apify) adds web scraping via Apify actors.

### Can I run GPU workloads from Kestra?
Yes. [`plugin-modal`](/plugins/plugin-modal) submits serverless GPU jobs to Modal. [`plugin-kubernetes`](/plugins/plugin-kubernetes) schedules GPU workloads on Kubernetes. [`plugin-docker`](/plugins/plugin-docker) runs GPU-enabled containers locally or on a Docker host.
