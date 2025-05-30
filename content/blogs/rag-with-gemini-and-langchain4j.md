---
title: "Retrieval Augmented Generation (RAG) with Google Gemini AI and Langchain4J"
description: Create a Retrieval Augmented Generation pipeline with Google Gemini AI and the Langchain4J plugin.
date: 2025-06-10T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: /blogs/TODO.png
---

Generative AI are great tools, but their generation can sometimes be too generic or outdated.
Entering **Retrieval Augmented Generation** or RAG, which is the process of AI generation, augmented by contextual and up-to-date information retrieved from an embedding store.

In version 0.23, Kestra introduces the [Langchain4J plugin](https://kestra.io/plugins/plugin-langchain4j) that allows creating complex Generative AI workflows in an AI provider-agnostic way. This plugin also provides all the tasks needed to create a RAG pipeline. Let's see it in action.

This plugin is based on the awesome [Langchain4J](https://docs.langchain4j.dev) framework!

TODO high level explanation of the workflows we will create

## Embedding creation via document ingestion

The first step is to create embeddings based on our own document. These embeddings will be stored to be retrieved later at generation time.

But first, what is an embedding?

To ingest a document, you will split it in segments, then call an embedding AI model for each segment that embeds this segment into a vector that will then be stored into an embedding store: usually a vector database. So an embedding is a vector representation of a segment of a document.

The `io.kestra.plugin.langchain4j.rag.IngestDocument` task will do this for you!

```yaml
id: ingest-documents
namespace: company.team

tasks:
  - id: ingest
    type: io.kestra.plugin.langchain4j.rag.IngestDocument
    provider: #1
      type: io.kestra.plugin.langchain4j.provider.GoogleGemini
      modelName: gemini-embedding-exp-03-07
      apiKey: "{{secret('GEMINI_API_KEY')}}"
    embeddings: #2
      type: io.kestra.plugin.langchain4j.embeddings.KestraKVStore
    fromExternalURLs: #3
      - https://raw.githubusercontent.com/kestra-io/docs/refs/heads/main/content/blogs/release-0-22.md
      - https://raw.githubusercontent.com/kestra-io/docs/refs/heads/main/content/blogs/release-0-21.md
      - https://raw.githubusercontent.com/kestra-io/docs/refs/heads/main/content/blogs/release-0-20.md
      - https://raw.githubusercontent.com/kestra-io/docs/refs/heads/main/content/blogs/release-0-19.md
    drop: true #4
```

1. We use the `io.kestra.plugin.langchain4j.provider.GoogleGemini` model provider to use the embedding model from Google Gemini. We must use the same model at generation time. Kestra supports a large variety of large language models (LLM) and more will be supported soon.
2. We use the `io.kestra.plugin.langchain4j.embeddings.KestraKVStore` embedding store. This is a convenient store that will store embeddings inside a [KeyValue store](https://kestra.io/doc/concepts/kv-store) and load them all in memory at generation time. For a large number of documents, you would typically use a vector database instead like PGVector or Elasticsearch.
3. We use `fromExternalURLs` to defines a list of documents to ingest from external URLs, here the blog posts for Kestra release 0.19 to 0.22. We will go into details for other ways to define documents to ingest later.
4. We use `drop: true` so that the embedding store is recreated each time the flow is executed.

After executing the flow, you will be able to see a new KV store entry with the serialized form of the computed embeddings.

![Embedding Store KV Entry](/blogs/rag-with-gemini-and-langchain4j/embedding-store-kv.png)

### Defines document from multiple sources

You can define documents from multiple sources:
- `fromPath`: from a working directory path, usually used withing a [WorkingDirectory](https://kestra.io/plugins/core/flow/io.kestra.plugin.core.flow.workingdirectory) task, each file in the directory will create a document.
- `fromInternalURIs`: from a list of internal storage URIs.
- `fromExternalURLs`: from a list of external URLs.
- `fromDocuments`: from a list of documents defined inside the task itself.

Document metadata allows defining additional information to the large language model, some metadata is automatically added to documents at ingestion time. For example, the URL of the document if using `fromExternalURLs` or the name of the file if using `fromPath`.
You can set additional metadata via the `metadata` property.

### Advanced document splitting

Documents are split in segments to feed the large language model. Document splitting is an important step as each segment will create an embedding vector, so the embedding retrieval performance and accuracy will depend on how documents are split.

By default, we split documents using a `RECURSIVE` splitter that tries to split documents into paragraphs first and fits as many paragraphs into a single text segment as possible. If some paragraphs are too long, they are recursively split into lines, then sentences, then words, and then characters until they fit into a segment. This is usually a good strategy, but you can use specifically a `PARAGRAPH`, `LINE`, `SENTENCE` or `WORD` splitter if needed.

When splitting, you can define the maximum size of the segments using the `maxSegmentSizeInChars` property and the maximum size of the overlap to feed full sentence into a segment even if it overlaps the maximum segment size using the `maxOverlapSizeInChars` property.

Here is an example to split documents by paragraph only and with a maximum size of 4KB.

```yaml
id: ingest-documents
namespace: company.team

tasks:
  - id: ingest
    type: io.kestra.plugin.langchain4j.rag.IngestDocument
    # [...]
    documentSplitter:
      splitter: PARAGRAPH
      maxSegmentSizeInChars: 4096
```

## Retrieval augmented generation

This second flow will use the embedding store created by the first flow to retrieve documents based on the prompt passed into the flow inputs and use these documents to augment the large language model contextual information.

```yaml
id: rag-completion
namespace: company.team

inputs:
  - id: prompt
    type: STRING
    defaults: What's new in Kestra 0.22?

tasks:
  - id: completion
    type: io.kestra.plugin.langchain4j.rag.Chat
    embeddings: #1
      type: io.kestra.plugin.langchain4j.embeddings.KestraKVStore
      kvName: ingest-documents-embedding-store
    chatProvider: #2
      type: io.kestra.plugin.langchain4j.provider.GoogleGemini
      modelName: gemini-2.5-flash-preview-05-20
      apiKey: "{{secret('GEMINI_API_KEY')}}"
    embeddingProvider: #3
      type: io.kestra.plugin.langchain4j.provider.GoogleGemini
      modelName: gemini-embedding-exp-03-07
      apiKey: "{{secret('GEMINI_API_KEY')}}"
    contentRetrieverConfiguration: #4
      maxResults: 3
      minScore: 0.5
    prompt: "{{ inputs.prompt }}" #5
```

1. We're using here the same embedding store as the one used in the `ingest-documents` flow. We must set the name of the KV entry as we are not in the same flow and the name of the KV entry is by default the name of the flow suffixed by `embedding-store`.
2. We're using here the `io.kestra.plugin.langchain4j.provider.GoogleGemini` large language model provider configured to use the Google Gemini Flash 2.5 model.
3. We're using here the `io.kestra.plugin.langchain4j.provider.GoogleGemini` large language model provider for embeddings, this must be the same as the one used to ingest documents into the embedding store.
4. We configure the content retriever to return 3 results and filter results with a minimal score of 0.5 to avoid having non-accurate results returned by the embedding store.
5. The prompt sent to the large language model for completion.

We use here the Google Gemini 2.5 Flash model, this model is convenient for such use cases as it has a large context window of one million tokens, this is important for retrieval augmented generation as retrieved documents will be added to the context window.
This model is also cost-effective and quick to answer, making it a good fit for automated workflows.

If you execute this flow with the default prompt, it will answer something like that:

```markdown
Kestra 0.22 introduces several powerful new features and enhancements focused on enterprise-grade management, developer experience, and new plugin capabilities.

Here's what's new in Kestra 0.22:

[...].
```

With a long list of features taken from the 0.22 blog post.

But more interestingly, we can ask it for information cross-documents, and to include its sources!

For example, try the following prompt: `What's the most interesting new features in Kestra. Include your sources with links.`

It should answer something like that, with the source of each new feature!

```markdown
Kestra has introduced several interesting new features across its recent releases (0.20, 0.21, and 0.22), focusing on enhancing enterprise-grade management, developer experience, and operational capabilities.

Here are some of the most interesting new features:

1.  **Apps: Custom UIs for Your Flows (Kestra 0.20)**
    This feature allows users to build custom interfaces for interacting with Kestra workflows. It democratizes access to workflows by providing simple forms, output displays, and approval buttons, enabling non-technical business users to trigger, pause, or submit data to automated processes without needing to understand the underlying code. Flows act as the backend, while Apps serve as the frontend.
    *   **Source:** [Kestra 0.20 adds SLAs, Invites, User-Facing Apps, Isolated Storage and Secrets per Team, and Transactional Queries](https://kestra.io/blogs/2024-12-03-release-0-20#apps)

[...]
```

### How it works

The prompt is first used to create an embedding vector. This vector will be used to search for the most relevant segments into the embedding store. Here we ask to retrieve three documents with a minimal score of 0.5.

Then, these documents are sent into the context window of the LLM with the prompt for generation.

At ingestion time, each document will be indexed with metadata, including the URL of the document as they have been retrieved via external URLs. The LLM is then capable of including these URLs as the source of the information used for the generation.

## Conclusion

TODO