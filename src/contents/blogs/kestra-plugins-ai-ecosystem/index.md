---
title: "The Kestra Plugin Ecosystem for AI: From LLM Providers to Vector Databases"
description: "Building AI pipelines means stitching together LLM calls, vector search, document ingestion, and data preprocessing. Kestra ships plugins for all of it. This post maps every plugin category that matters for AI workflows (outside of plugin-ai) so you know exactly what to reach for."
date: 2026-06-08T18:00:00
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
        text: "plugin-tika parses PDFs, Office documents, images (with OCR via Tesseract), and dozens of other formats into plain text, the standard first step for RAG pipelines. For web content, plugin-apify adds web scraping via Apify actors."
---

The LLM call is the easy part. By the time a model returns something useful, other tasks have already parsed the source documents, cleaned and chunked the text, generated embeddings, indexed them into a vector store, and pulled back the right context, all of it on a schedule or a trigger, surviving the rate limits and flaky responses that come with hitting model APIs at volume. That surrounding machinery is where an AI pipeline actually lives, and where an orchestrator earns its place.

Kestra covers every layer of it. One group, [`plugin-ai`](/plugins/plugin-ai), is purpose-built for the job, with the shared abstractions behind Kestra's native AI tasks. I'll map the rest (the plugins you reach for *around* the model), organized by the role each plays: retrieval, ingestion, serialization, transformation, custom code, GPU compute, data quality, and the cloud and connector plumbing in between.

:::alert{type="info"}
All AI-related plugins are tagged with the **AI** category on the [Plugins page](https://kestra.io/plugins?category=AI). Use the category filter to browse them at a glance without scrolling through the full catalog.
:::

## LLM providers

Start with the model, since it's the part everyone pictures first. Kestra ships a dedicated plugin for every major provider, each exposing that provider's API as a declarative task.

| Plugin | Key tasks | What you get |
|--------|-----------|--------------|
| [`plugin-anthropic`](/plugins/plugin-anthropic) | `Chat`, `Vision` | Claude API (text and vision) |
| [`plugin-openai`](/plugins/plugin-openai) | `ChatCompletion`, `Embedding`, `ImageEdit`, `SpeechToText` | GPT models, embeddings, DALL·E, Whisper |
| [`plugin-gemini`](/plugins/plugin-gemini) | `TextPrompt`, `Vision` | Google Gemini (text and multimodal) |
| [`plugin-mistral`](/plugins/plugin-mistral) | `ChatCompletion`, `Embedding` | Mistral AI (chat and embeddings) |
| [`plugin-deepseek`](/plugins/plugin-deepseek) | `ChatCompletion` | DeepSeek reasoning models |
| [`plugin-ollama`](/plugins/plugin-ollama) | `ChatCompletion`, `Embedding` | Self-hosted LLMs via Ollama |
| [`plugin-perplexity`](/plugins/plugin-perplexity) | `ChatCompletion` | Perplexity (search-augmented responses) |
| [`plugin-huggingface`](/plugins/plugin-huggingface) | `Inference` | 700k+ HuggingFace models via Inference API |

The wrapper is the least interesting part; the orchestration around the call is what matters. LLM and embedding endpoints rate-limit hard and fail intermittently, so a [`retry`](/docs/workflow-components/retries) with exponential backoff turns a 429 into a non-event rather than a broken run. Credentials resolve from `{{ secret('OPENAI_API_KEY') }}` at runtime instead of living in the flow source (see [Secrets in Kestra](/docs/concepts/secret)). And because the provider is a single `type:` line, swapping GPT for Claude (or fanning out to several models in parallel) is a config change, not a rewrite.

## Vector databases and search

A model is only as good as the context you retrieve for it, which puts the vector store at the center of most RAG systems. Kestra spans the full spectrum of them, from purpose-built vector databases to search engines that have grown vector extensions.

### Purpose-built vector databases

[`plugin-weaviate`](/plugins/plugin-weaviate) is the most AI-native of the set: `SchemaCreate` defines collection structure, `BatchCreate` handles bulk vector ingestion, `Query` runs GraphQL-based semantic and hybrid search, and `Delete` cleans up. Its `nearText` and `nearVector` operators map directly onto RAG retrieval, so the task config reads the way you reason about the query.

[`plugin-pinecone`](/plugins/plugin-pinecone) covers Pinecone's fully managed serverless store: index and namespace management, vector upsert and delete, and similarity queries with metadata filtering. No infrastructure to run.

### Search engines with vector extensions

If you already run a search cluster, you may not need a separate vector database. These add vector search alongside the keyword search you already have, which is why hybrid BM25 + k-NN retrieval is so often the pragmatic default.

| Plugin | Notable tasks | Vector capability |
|--------|---------------|-------------------|
| [`plugin-opensearch`](/plugins/plugin-opensearch) | `Search`, `Bulk`, `Load`, `Scroll`, `Ppl` | k-NN vector search + BM25 hybrid |
| [`plugin-elasticsearch`](/plugins/plugin-elasticsearch) | `Search`, `Bulk`, `Load`, `Scroll` | Dense vector fields + BM25 hybrid |
| [`plugin-typesense`](/plugins/plugin-typesense) | `Search`, `BulkIndex`, `FacetSearch` | Fast typo-tolerant + vector search |
| [`plugin-meilisearch`](/plugins/plugin-meilisearch) | `Search`, `DocumentAdd`, `FacetSearch` | Lightweight open-source semantic search |

### Document databases with vector search

[`plugin-mongodb`](/plugins/plugin-mongodb) exposes `Find` with `$vectorSearch` (Atlas Vector Search), `Aggregate` for multi-stage pipelines, and `Bulk` for large ingestion batches. Its `Trigger` fires on Change Streams, so a new or updated document can kick off re-indexing in near real time instead of waiting for the next batch run.

[`plugin-redis`](/plugins/plugin-redis) handles JSON document storage (`Get`, `Set`, `Delete`) and Pub/Sub (`Publish`). With RedisSearch enabled it doubles as a high-throughput embedding cache and real-time retrieval layer.

### Graph databases

[`plugin-neo4j`](/plugins/plugin-neo4j) provides `Query` (Cypher, with configurable result handling) and `Batch` for bulk operations. Knowledge graphs let an LLM traverse explicit relationships for reasoning chains and entity resolution, a pattern that shows up more and more in agentic architectures.

## Document extraction and web ingestion

RAG starts with raw content, and embeddings can't be generated until that content is clean text.

[`plugin-tika`](/plugins/plugin-tika) wraps Apache Tika. Its `Parse` task pulls text, metadata, and embedded files out of PDFs, Word documents, PowerPoint files, Excel spreadsheets, HTML, images (with optional OCR via Tesseract), and dozens of other formats. One task handles the full range of enterprise document types, the standard first step in an ingestion flow and an obvious place to fan out across workers at volume.

[`plugin-apify`](/plugins/plugin-apify) covers the web. `Run` launches an Apify actor with configurable inputs and run caps, `Get` and `GetLastRun` retrieve the resulting dataset, and `Save` persists it to Kestra's internal storage for downstream tasks. It's the practical path for feeding live web content into a retrieval or training pipeline.

## Format conversion and serialization

Data rarely arrives in the shape the next task wants. [`plugin-serdes`](/plugins/plugin-serdes) converts the formats that show up throughout AI workflows (CSV, JSON, AVRO, Parquet, XML, YAML, Protobuf, Excel) to and from Kestra's internal Ion format, so any two tasks can exchange data without bespoke parsing.

Three of its capabilities matter especially for AI work.

**Markdown conversion.** `HtmlToMarkdown` turns verbose HTML into Markdown that carries the same structure in far fewer tokens, directly useful for RAG and LLM preprocessing. `MarkdownToText` strips formatting to clean plain text for embedding models that don't need markup; `MarkdownToHtml` covers the return trip for email templates or rich notifications.

**TOON.** `JsonToToon` and `ToonToJson` convert between JSON and [TOON](/blogs/2026-04-30-kestra-mcp-plugins-blueprints) (Token-Oriented Object Notation), a deterministic, indentation-based format with explicit structure and minimal quoting. For uniform arrays of objects it uses a tabular encoding that conveys the same data in far fewer tokens than JSON, lowering cost and latency on every inference call that passes structured context.

**Schema inference.** `InferAvroSchemaFromIon` scans an Ion file and emits a matching `.avsc` schema, removing the hand-written schema step before a conversion to Avro or Parquet.

## Data transformation and preprocessing

Models are sensitive to input quality, and most of what determines that quality happens before the embedding call. Kestra offers transformation layers from lightweight expression-based transforms up to full SQL modeling.

[`plugin-transform`](/plugins/plugin-transform) operates on Kestra's internal record streams. The `Records` module covers `Filter` (boolean expressions), `Map` (field projection, and the natural place to chunk text before embedding), `Select` (renaming), `Aggregate` (grouping with sum/count/avg), `Unnest` (flattening nested arrays), and `Zip` (merging streams by index). The `Grok` module parses unstructured text with named patterns, and the `JSONata` module reshapes JSON, handy for normalizing an LLM's output before anything downstream consumes it.

[`plugin-datagen`](/plugins/plugin-datagen) generates synthetic data with Faker-based generators. `Generate` produces configurable batches as JSON, CSV, or SQL, and a `RealtimeTrigger` drives continuous generation for streaming pipelines. The main AI use is reproducible training and evaluation datasets that never touch production data.

[`plugin-dbt`](/plugins/plugin-dbt) brings SQL feature engineering into the flow. Run dbt models, execute tests, and install dependencies as discrete tasks, so feature pipelines stay version-controlled, testable, and observable alongside everything else.

## Scripting and custom code

When nothing pre-built fits, Kestra runs arbitrary code across 18 language runtimes.

[`plugin-scripts`](/plugins/plugin-scripts) runs `Script` and `Commands` tasks for Python, Node.js, R, Julia, Go, Ruby, Shell, Perl, PHP, Lua, Deno, Bun, JBang, Groovy, Jython, Nashorn, and more. The Python task supports pip and UV, so installing `transformers`, `torch`, or any other library is a line of config and the environment is reproducible. This is the escape hatch for custom inference logic, fine-tuning jobs, or integrations no dedicated plugin covers.

[`plugin-graalvm`](/plugins/plugin-graalvm) runs Python, JavaScript, and Ruby in-process via GraalVM, with no container to start. `Eval` runs inline scripts and `FileTransform` applies a script to a file. The tradeoff is that GraalVM's Python compatibility is narrower than CPython's, so it suits lightweight transforms and preprocessing rather than heavy ML workloads.

## GPU compute and containers

Heavy inference and fine-tuning need a compute backend beyond a standard Kestra worker.

[`plugin-modal`](/plugins/plugin-modal) wraps the Modal CLI: `ModalCLI` runs Modal functions on serverless GPU infrastructure, which fits fine-tuning, batch inference, or any compute-heavy job you'd rather not provision GPU instances for.

[`plugin-docker`](/plugins/plugin-docker) and [`plugin-kubernetes`](/plugins/plugin-kubernetes) handle container execution. Docker tasks run ML containers locally or on a Docker host; Kubernetes tasks (`Deploy`, `Job`) schedule GPU workloads on a cluster. Paired with Kestra's [task runners](/docs/task-runners), they make GPU job submission fully declarative.

[`plugin-databricks`](/plugins/plugin-databricks) connects Kestra to Databricks for notebook execution, job submission, and MLflow integration, the standard path for teams already on that platform.

## Data quality and lineage

Garbage in, garbage out is unforgiving for training and evaluation data, so reliable pipelines validate before they trust.

[`plugin-soda`](/plugins/plugin-soda) runs Soda scans against any source: null rates, value distributions, schema drift, referential integrity. Kestra surfaces the results as task outputs, which means you can gate downstream tasks on a scan and stop a bad dataset before it ever reaches a model.

[`plugin-datahub`](/plugins/plugin-datahub) emits lineage events to DataHub, making model inputs, intermediate datasets, and outputs traceable in the catalog.

## Cloud platform plugins

Each major cloud exposes an AI-relevant surface area through its Kestra plugin.

| Plugin | AI-relevant services |
|--------|---------------------|
| [`plugin-aws`](/plugins/plugin-aws) | S3 (data lake), Bedrock (managed LLMs), SageMaker (training/inference), Textract (OCR), Comprehend (NLP) |
| [`plugin-gcp`](/plugins/plugin-gcp) | Vertex AI (training/serving), BigQuery ML, Cloud Storage, Document AI |
| [`plugin-azure`](/plugins/plugin-azure) | Azure OpenAI, Cognitive Services, Blob Storage, Azure ML |

## Connectors and infrastructure

Beyond compute and storage, pipelines need reliable transport and versioning.

[`plugin-kafka`](/plugins/plugin-kafka) drives event-based architectures: consume a stream of user interactions for real-time RAG, or publish inference results downstream. A Kafka trigger fires a flow on each message or batch, which is the standard pattern for keeping a vector index continuously up to date.

[`plugin-git`](/plugins/plugin-git) and [`plugin-github`](/plugins/plugin-github) bring prompts and configuration under version control. Store prompts, system instructions, and model settings as code, then pull them at runtime so every run executes against a pinned, auditable version.

[`plugin-fs`](/plugins/plugin-fs) provides filesystem and object-storage tasks for S3, GCS, SFTP, FTP, and local paths, moving model inputs and outputs between stages.

## Putting it together

A typical RAG pipeline draws on four to six of these groups in sequence:

1. **Ingest**: [`plugin-tika`](/plugins/plugin-tika) parses source documents; [`plugin-apify`](/plugins/plugin-apify) scrapes web content
2. **Transform**: [`plugin-transform`](/plugins/plugin-transform) cleans and chunks the text; [`plugin-serdes`](/plugins/plugin-serdes) converts formats
3. **Embed**: [`plugin-openai`](/plugins/plugin-openai) or [`plugin-huggingface`](/plugins/plugin-huggingface) generates the vectors
4. **Index**: [`plugin-weaviate`](/plugins/plugin-weaviate), [`plugin-pinecone`](/plugins/plugin-pinecone), or [`plugin-opensearch`](/plugins/plugin-opensearch) stores them
5. **Retrieve and generate**: [`plugin-anthropic`](/plugins/plugin-anthropic) or [`plugin-gemini`](/plugins/plugin-gemini) answers using the retrieved context
6. **Validate**: [`plugin-soda`](/plugins/plugin-soda) checks quality at each stage; [`plugin-datahub`](/plugins/plugin-datahub) records lineage

Every step is a task, and data moves between them through [Kestra's internal storage](/docs/concepts/storage), so each stage hands off cleanly to the next. The flow YAML is the single source of truth: version-controlled, observable end to end, and portable anywhere Kestra runs. Re-indexing the corpus from scratch is a [backfill](/docs/concepts/backfill); keeping it current is a trigger. The model was never the hard part. Making everything around it dependable is, and that's the part Kestra owns.

For a deeper look at how these pieces fit together in production, see [RAG workflows in Kestra](/docs/ai-tools/ai-rag-workflows).

---

## Frequently asked questions

### Which Kestra plugins support LLM providers?
Kestra ships dedicated plugins for [Anthropic](/plugins/plugin-anthropic), [OpenAI](/plugins/plugin-openai), [Gemini](/plugins/plugin-gemini), [Mistral](/plugins/plugin-mistral), [DeepSeek](/plugins/plugin-deepseek), [Ollama](/plugins/plugin-ollama), [Perplexity](/plugins/plugin-perplexity), and [HuggingFace](/plugins/plugin-huggingface). Each wraps the provider's API as declarative Kestra tasks with native retry, secret, and observability support.

### Which Kestra plugins support vector databases?
[`plugin-weaviate`](/plugins/plugin-weaviate) and [`plugin-pinecone`](/plugins/plugin-pinecone) are purpose-built for vector storage and retrieval. [`plugin-opensearch`](/plugins/plugin-opensearch) and [`plugin-elasticsearch`](/plugins/plugin-elasticsearch) provide hybrid BM25 + k-NN search. [`plugin-typesense`](/plugins/plugin-typesense) and [`plugin-meilisearch`](/plugins/plugin-meilisearch) offer lightweight alternatives. [`plugin-mongodb`](/plugins/plugin-mongodb) supports Atlas Vector Search. [`plugin-redis`](/plugins/plugin-redis) covers embedding caching. [`plugin-neo4j`](/plugins/plugin-neo4j) handles knowledge graph retrieval.

### How do I run custom Python or ML code in Kestra?
[`plugin-scripts`](/plugins/plugin-scripts) runs Python `Script` and `Commands` tasks with pip or UV dependency management; install any ML library inline. For lightweight transforms without container overhead, [`plugin-graalvm`](/plugins/plugin-graalvm) runs Python, JavaScript, and Ruby in-process via GraalVM.

### Which Kestra plugin is best for RAG document ingestion?
[`plugin-tika`](/plugins/plugin-tika) (`Parse` task) handles PDFs, Office formats, HTML, images (with OCR), and dozens more: one task covers the full enterprise document corpus. For web content, [`plugin-apify`](/plugins/plugin-apify) adds web scraping via Apify actors.

### Can I run GPU workloads from Kestra?
Yes. [`plugin-modal`](/plugins/plugin-modal) submits serverless GPU jobs to Modal. [`plugin-kubernetes`](/plugins/plugin-kubernetes) schedules GPU workloads on Kubernetes. [`plugin-docker`](/plugins/plugin-docker) runs GPU-enabled containers locally or on a Docker host.

---

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](/slack).
