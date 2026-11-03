---
title: "RAG Workflows in Kestra: Ground LLM Answers in Your Data"
h1: Build RAG Workflows to Ground LLM Responses in Your Own Data
sidebarTitle: RAG Workflows
icon: /src/contents/docs/icons/ai.svg
version: ">= 1.0.0"
description: Build Retrieval-Augmented Generation (RAG) workflows in Kestra to ground LLM responses in your own data or web search results.
---

Ground LLM answers in your own documents or in live web search results.

This page is for flow authors whose model calls need facts the model wasn't trained on, such as internal documentation, recent releases, or policies. For model calls that don't need extra context, see [LLM tasks and AI agents](../01.ai-agents/index.md).

## How retrieval-augmented generation works

Retrieval-augmented generation (RAG) adds relevant source text to the prompt before the model answers. An ingestion task embeds your documents and stores the vectors in an embedding store. At question time, Kestra embeds the question, retrieves the most similar text segments, and passes them to the model with the prompt. The model answers from that text instead of relying only on its training data, which reduces hallucinations.

## Chat with your documents

This flow ingests the Kestra 2.0 release post into the KV Store embedding store, then asks the same question with and without RAG so you can compare the answers.

```yaml
id: rag
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
    fromExternalURLs:
      - https://raw.githubusercontent.com/kestra-io/docs/refs/heads/main/src/contents/blogs/release-2-0/index.md

  - id: parallel
    type: io.kestra.plugin.core.flow.Parallel
    tasks:
      - id: chat_without_rag
        type: io.kestra.plugin.ai.completion.ChatCompletion
        provider:
          type: io.kestra.plugin.ai.provider.GoogleGemini
          apiKey: "{{ secret('GEMINI_API_KEY') }}"
          modelName: gemini-3.5-flash-lite
        messages:
          - type: USER
            content: Which features were released in Kestra 2.0?

      - id: chat_with_rag
        type: io.kestra.plugin.ai.rag.ChatCompletion
        chatProvider:
          type: io.kestra.plugin.ai.provider.GoogleGemini
          apiKey: "{{ secret('GEMINI_API_KEY') }}"
          modelName: gemini-3.5-flash-lite
        embeddingProvider:
          type: io.kestra.plugin.ai.provider.GoogleGemini
          apiKey: "{{ secret('GEMINI_API_KEY') }}"
          modelName: gemini-embedding-001
        embeddings:
          type: io.kestra.plugin.ai.embeddings.KestraKVStore
        systemMessage: You are a helpful assistant that can answer questions about Kestra.
        prompt: Which features were released in Kestra 2.0?
```

The `ingest` task embeds the document with `gemini-embedding-001` and stores the vectors in the KV Store. `drop: true` clears the store first, so each execution starts from the same content. Without a `documentSplitter`, the whole post is stored as one segment; set one to split long documents into smaller segments that retrieve more precisely. The two chat tasks then run in parallel:

- `chat_without_rag` answers from the model's training data only. If the release came after the model's training cutoff, expect a vague or wrong answer.
- `chat_with_rag` embeds the question with the same embedding model, retrieves the closest segments, and answers from them.

Compare the `textOutput` of both tasks in the **Outputs** tab. The `sources` output of `chat_with_rag` lists the segments that grounded its answer.

:::alert{type="warning"}
The KV Store embedding store loads every vector into memory and is meant for prototyping. For production, use a vector database such as [PGVector, Elasticsearch, or Qdrant](/plugins/plugin-ai/rag).
:::

## Ground answers in web search results

Instead of an embedding store, a content retriever can fetch context at question time. This flow uses the [Tavily](https://www.tavily.com/) web search retriever, so the model answers from current search results.

```yaml
id: rag_with_websearch_content_retriever
namespace: company.ai

tasks:
  - id: chat_with_rag_and_websearch_content_retriever
    type: io.kestra.plugin.ai.rag.ChatCompletion
    chatProvider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      modelName: gemini-3.5-flash-lite
      apiKey: "{{ secret('GEMINI_API_KEY') }}"
    contentRetrievers:
      - type: io.kestra.plugin.ai.retriever.TavilyWebSearch
        apiKey: "{{ secret('TAVILY_API_KEY') }}"
    systemMessage: You are a helpful assistant that can answer questions about Kestra.
    prompt: What is the latest release of Kestra?
```

Content retrievers always run, so every question triggers a search. To let the model decide when to search, add `TavilyWebSearch` under `tools` instead.

## Choose a context source

| Source | Use it when | Example |
|---|---|---|
| Embedding store | Answers must come from a fixed set of documents you control | Internal documentation, policies, runbooks |
| Web search retriever | Answers depend on information that changes often | Product releases, news, current prices |

You can combine both: set `embeddings` and `contentRetrievers` on the same task.

For all RAG tasks, embedding stores, and retrievers, see the [AI plugin RAG reference](/plugins/plugin-ai/rag).
