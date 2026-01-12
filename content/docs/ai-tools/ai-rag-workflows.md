---
title: RAG Workflows
icon: /docs/icons/ai.svg
version: "1.0.0"
---

Ask questions, get data-backed answers with RAG.

Retrieval Augmented Generation (RAG) enhances LLM responses by grounding them in your own data instead of relying solely on the model’s internal knowledge. It works by retrieving relevant document embeddings and combining them with the user’s prompt to produce accurate, context-aware outputs. Chat with your data using RAG in Kestra.

## Chat with your data using RAG

This example shows how to use **Retrieval Augmented Generation (RAG)** in Kestra to ground Large Language Model (LLM) responses in your own data. The flow ingests documents, stores embeddings in the KV Store, and contrasts responses from a plain LLM prompt with RAG-enabled responses, demonstrating how RAG reduces hallucinations and improves accuracy.

## RAG flow example

```yaml
id: rag
namespace: company.ai

tasks:
  - id: ingest
    type: io.kestra.plugin.ai.rag.IngestDocument
    provider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      modelName: gemini-embedding-exp-03-07
      apiKey: "{{ secret('GEMINI_API_KEY') }}"
    embeddings:
      type: io.kestra.plugin.ai.embeddings.KestraKVStore
    drop: true
    fromExternalURLs:
      - https://raw.githubusercontent.com/kestra-io/docs/refs/heads/main/content/blogs/release-0-24.md

  - id: parallel
    type: io.kestra.plugin.core.flow.Parallel
    tasks:
      - id: chat_without_rag
        type: io.kestra.plugin.ai.completion.ChatCompletion
        provider:
          type: io.kestra.plugin.ai.provider.GoogleGemini
        messages:
          - type: USER
            content: Which features were released in Kestra 0.24?

      - id: chat_with_rag
        type: io.kestra.plugin.ai.rag.ChatCompletion
        chatProvider:
          type: io.kestra.plugin.ai.provider.GoogleGemini
        embeddingProvider:
          type: io.kestra.plugin.ai.provider.GoogleGemini
          modelName: gemini-embedding-exp-03-07
        embeddings:
          type: io.kestra.plugin.ai.embeddings.KestraKVStore
        systemMessage: You are a helpful assistant that can answer questions about Kestra.
        prompt: Which features were released in Kestra 0.24?

pluginDefaults:
  - type: io.kestra.plugin.ai.provider.GoogleGemini
    values:
      apiKey: "{{ secret('GEMINI_API_KEY') }}"
      modelName: gemini-2.5-flash
```

### How it works

This flow first ingests external documents into the Kestra KV Store by generating embeddings with a chosen LLM provider. Those embeddings act as a searchable index. When you ask a question, Kestra can either pass the raw prompt directly to the LLM (without RAG) or augment the prompt with the most relevant information retrieved from the embeddings (with RAG). By supporting the model’s response in actual data, Kestra reduces the likelihood of hallucinations and ensures answers remain accurate and contextual to your source material.

### Without RAG vs. with RAG

Without RAG, the model answers based only on its pretraining and may produce plausible but inaccurate results if the requested details are not part of its training knowledge. With RAG, the model supplements its reasoning by retrieving embeddings stored in the KV Store and using them as context, producing responses directly tied to the ingested documents.

Use RAG when you need AI responses anchored in current, domain-specific, or external data sources.

## RAG with web search example

This example shows how to combine Retrieval Augmented Generation (RAG) with a web search content retriever to answer questions using both stored knowledge and up-to-date external sources.

```yaml
id: rag_with_websearch_content_retriever
namespace: company.ai

tasks:
  - id: chat_with_rag_and_websearch_content_retriever
    type: io.kestra.plugin.ai.rag.ChatCompletion
    chatProvider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      modelName: gemini-2.5-flash
      apiKey: "{{ secret('GEMINI_API_KEY') }}"
    contentRetrievers:
      - type: io.kestra.plugin.ai.retriever.TavilyWebSearch
        apiKey: "{{ secret('TAVILY_API_KEY') }}"
    systemMessage: You are a helpful assistant that can answer questions about Kestra.
    prompt: What is the latest release of Kestra?
```

The flow uses the `TavilyWebSearch` ([Tavily](https://www.tavily.com/)) retriever to fetch the latest information from the web and provides it as context to the `ChatCompletion` task. By grounding the LLM’s response in real-time search results, Kestra can answer questions such as “What is the latest release of Kestra?” with accurate, current data.

### Comparison: Static RAG vs. Web Search RAG

- Static RAG (e.g., with document ingestion) is ideal when you want to ground responses in a fixed knowledge base, such as internal documentation or policies.

- Web Search RAG extends this by retrieving fresh, dynamic content from the internet, making it better for answering time-sensitive or evolving questions like product releases or recent events.

For more properties, examples, and implementations, refer to the [Kestra RAG documentation](/plugins/plugin-ai/rag).
