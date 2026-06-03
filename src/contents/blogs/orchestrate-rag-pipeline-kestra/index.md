---
title: "How to Orchestrate a RAG Pipeline with Kestra"
description: "Build an end-to-end RAG pipeline in declarative YAML with Kestra: ingestion, chunking, embeddings, vector storage, and grounded queries — starting from zero dependencies and scaling to Qdrant or PGVector. Clone the blueprint."
date: 2026-06-05T09:00:00
category: Solutions
author:
  name: Virgile Fanucci
  image: vfanucci
  linkedin: https://www.linkedin.com/in/virgile-fanucci/
---

A Retrieval-Augmented Generation pipeline is easy to demo in a notebook and surprisingly hard to keep running. You load some documents, create embeddings, query them, and the answers look great. Then the documents change and nobody re-indexes them. A step fails halfway and you don't notice. There's no schedule, no retries, no record of what ran when. The notebook was never the problem — the *operating* of it is.

That's an orchestration problem, and it's exactly what this tutorial solves. We'll build a complete RAG pipeline as a declarative Kestra workflow: ingestion → chunking → embeddings → vector storage → grounded query, all in YAML you can version, schedule, and re-run reliably.

If you're following the [DataTalks.Club LLM Zoomcamp](https://github.com/DataTalksClub/llm-zoomcamp/tree/main/03-orchestration), this maps directly to the RAG and vector-search material — the flows here are the same shape as the ones in the course, so you can follow along live. One distinction to set up front: **Kestra orchestrates the pipeline; the AI plugin (built on LangChain4J) does the LLM work.** They're not in competition — Kestra coordinates the steps around the model.

## What is RAG pipeline orchestration?

RAG grounds an LLM's answers in your own data instead of letting it guess from training memory. For a full conceptual treatment, see Kestra's guide to [RAG pipeline orchestration](https://kestra.io/resources/ai/rag-pipeline); here we'll stay focused on building one.

### The two pipelines: indexing vs. retrieval

Every RAG system is really two pipelines. The **indexing** pipeline collects documents, splits them into chunks, turns each chunk into an embedding, and stores those vectors. The **retrieval** pipeline takes a user question, finds the most relevant chunks by similarity, and feeds them to the LLM as context for a grounded answer. Orchestration is what connects and schedules both.

### Why notebooks don't survive production

A notebook runs once, when you run it. Production needs the indexing pipeline to run on a schedule (or when source data changes), to retry transient failures, to log what happened, and to re-index without manual babysitting. Those are orchestration concerns — scheduling, retries, observability, re-indexing — and they're the whole reason to put RAG inside a workflow engine.

## The RAG pipeline we'll build

Here's the shape of the pipeline. We start with the simplest possible vector store so there's nothing to install, then swap in a production-grade store later without changing the rest of the flow.

```mermaid
flowchart LR
    SRC[Source docs\nURLs / files] --> ING[IngestDocument\nsplit + embed]
    ING --> VS[(Vector store)]
    Q[User question] --> RAG[ChatCompletion\nretrieve + generate]
    VS --> RAG
    RAG --> ANS[Grounded answer]
```

<!-- SCREENSHOT: the same flow shown as the topology view in the Kestra UI, so readers can match the diagram to what they'll see after importing the flow. -->

## Step 1: Ingestion, chunking, and embeddings

The indexing pipeline is a single task: `IngestDocument`. It fetches your documents, splits them into chunks, generates embeddings with the provider you choose, and writes them to a vector store.

```yaml
id: rag_pipeline
namespace: company.ai

tasks:
  - id: ingest
    type: io.kestra.plugin.ai.rag.IngestDocument
    provider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      modelName: gemini-embedding-001
      apiKey: "{{ secret('GEMINI_API_KEY') }}"
    embeddings:
      type: io.kestra.plugin.ai.embeddings.KestraKVStore
    drop: true
    documentSplitter:
      splitter: PARAGRAPH
      maxSegmentSizeInChars: 4096
    fromExternalURLs:
      - https://raw.githubusercontent.com/kestra-io/docs/refs/heads/main/src/contents/blogs/release-1-1/index.md
```

Two choices matter here. **Chunking**, controlled by `documentSplitter` and `maxSegmentSizeInChars`: chunks that are too large dilute relevance, too small lose context — paragraphs at a few thousand characters is a sensible default. And the **embedding model**, set by `modelName` — it must be an embedding model (here `gemini-embedding-001`), and the *same* model has to be used for retrieval, or your query vectors won't match your stored ones.

The `drop: true` flag clears the store before ingesting, which keeps re-runs clean while you're learning. In production you'd manage updates more deliberately.

## Step 2: Choosing your vector store

This is the one line you'll change as you move from learning to production.

### Start with zero dependencies: KestraKVStore

`io.kestra.plugin.ai.embeddings.KestraKVStore` uses Kestra's built-in key-value store as the vector store. There's nothing to install, nothing to connect — it's exactly what the LLM Zoomcamp uses, and it's the fastest way to get a working RAG pipeline end to end. Perfect for development and for following the course.

### Scale up: Qdrant or PGVector

When you outgrow the KV store — larger corpora, faster similarity search, persistence you control — you swap the `embeddings` block for a dedicated vector database. The rest of the flow stays identical.

```yaml
    # Qdrant
    embeddings:
      type: io.kestra.plugin.ai.embeddings.Qdrant
      # host, port, collection ...

    # or PGVector (Postgres extension)
    embeddings:
      type: io.kestra.plugin.ai.embeddings.PGVector
      # url, table ...
```

| Store | Setup | Best for |
| --- | --- | --- |
| KestraKVStore | None — built in | Learning, prototyping, the Zoomcamp |
| Qdrant | External service | Larger corpora, fast vector search |
| PGVector | Postgres extension | Teams already running Postgres |

<!-- SCREENSHOT: optional — a populated Qdrant collection or PGVector table, to make the "production store" step concrete for readers who scale up. -->

## Step 3: Retrieval and grounded generation

Retrieval and generation are also one task: `ChatCompletion` with an embeddings store attached. It embeds the question with the *same* embedding model, retrieves the closest chunks, and asks the chat model to answer using them as context.

```yaml
  - id: chat_with_rag
    type: io.kestra.plugin.ai.rag.ChatCompletion
    chatProvider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      modelName: gemini-2.5-flash
      apiKey: "{{ secret('GEMINI_API_KEY') }}"
    embeddingProvider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      modelName: gemini-embedding-001
      apiKey: "{{ secret('GEMINI_API_KEY') }}"
    embeddings:
      type: io.kestra.plugin.ai.embeddings.KestraKVStore
    systemMessage: |
      You are a helpful assistant. Use the provided documentation to give
      accurate, specific answers. If the context doesn't contain the answer, say so.
    prompt: "{{ inputs.question }}"
```

The most instructive thing you can do is run the *same* question with and without RAG, side by side. Without retrieval, the model guesses from training data and often invents specifics. With retrieval, it answers from your documents and can admit when the context doesn't cover the question. That contrast is the entire point of RAG, and it's worth showing your stakeholders directly.

## Step 4: Scheduling and production hardening

So far this runs when you trigger it. To make it a real pipeline, add a schedule and some resilience.

```yaml
triggers:
  - id: reindex_daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 3 * * *"

tasks:
  - id: ingest
    type: io.kestra.plugin.ai.rag.IngestDocument
    timeout: PT10M
    retry:
      type: constant
      interval: PT1M
      maxAttempt: 3
    # ... provider, embeddings, documentSplitter, sources as above
```

A `Schedule` trigger re-indexes your sources automatically — nightly here — so answers stay fresh as documents change. `retry` absorbs transient failures (a rate limit, a flaky download) without manual reruns, and `timeout` stops a stuck ingestion from hanging. Because every run is a Kestra execution, you also get logs and full history in the UI for free — which is the on-ramp to evaluating and monitoring quality over time, the subject of a [later article in this series](https://kestra.io/blogs/evaluate-monitor-llm-apps-kestra).

## Run it yourself

Clone the blueprint, set your `GEMINI_API_KEY` secret, and run it. Start on `KestraKVStore` so there's nothing to install; switch the `embeddings` block to Qdrant or PGVector when you're ready to scale.

<!-- BLUEPRINT_URL: end-to-end RAG pipeline — KestraKVStore, with Qdrant/PGVector variants -->
- Docs: [RAG workflows in Kestra](https://kestra.io/docs/ai-tools/ai-rag-workflows)
- Reference: [the RAG plugin](https://kestra.io/plugins/plugin-ai/rag) · [vector databases explained](https://kestra.io/resources/ai/vector-database)

If you're working through the LLM Zoomcamp orchestration module, this is the same pipeline shape you'll build in the RAG lessons — clone it, then make it yours.

## Conclusion

A RAG pipeline isn't hard to write; it's hard to *operate*. Putting ingestion, embeddings, storage, and retrieval inside a declarative Kestra workflow turns a fragile notebook into something you can schedule, retry, observe, and re-run with confidence — and switching from a zero-dependency store to a production vector database is a one-line change.

Once your app is grounded in data, the next step is to make it *act*: see [building production-ready AI agents](https://kestra.io/blogs/orchestrate-ai-agents-kestra) for orchestrating agentic workflows with the same principles.
