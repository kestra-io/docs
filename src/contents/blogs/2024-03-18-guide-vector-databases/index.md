---
title: "Your Guide to Vector Databases "
description: "Learn how they differ from traditional SQL searches, their role in AI advancements, and their applications."
date: 2024-03-18T12:00:00
category: Solution
author:
  name: Kevin Fleming
  image: "kfleming"
image: ./main.jpg
---
In what way are vector data type searches NOT LIKE SQL data type searches? Some answers:

- SQL searches use binary operators and functions: = != <> CONTAINS (LIKE). Results are true/false. Database values either match the predicate or they don’t.
- Vector databases (VBs) use similarity functions (not a where clause), and rely on distance metrics like [cosine similarity](https://www.learndatasci.com/glossary/cosine-similarity/) to find database record vectors closest to the query vector. Results are typically double or float data type, with values between -1 meaning exactly opposite, to 1 meaning exactly the same.

It may also come as a shock to you that VDB searches can sometimes miss finding some relevant values.

If you’re a software engineer, or spreadsheet hacker, then similarity is unfamiliar territory; you’ve entered a world where answers are only *probably* correct.

And even with this lack of precision, vector databases can do amazing things that no other technology can do.

Cool, huh? Let's dive in!

---

### Vector databases are exploding

According to IDC, organizations are expected to generate over 73,000 exabytes of unstructured data in 2023. By 2024, the total volume of data created, captured, copied, and consumed worldwide is expected to cross 149 zettabytes every year.

Unstructured data, such as emails, videos, audio files, and server logs is estimated to make up 80–90% of daily data generation. This is three times faster than the growth of structured data.

**ChatGPT’s** November 2022 chatbot release woke the world to the capabilities of LLMs, but more importantly, it shone a blazing light on the surrounding neighborhood of slightly older NLP and NLU technologies that would be key to unlocking billions in potential business value. Vector databases are one of those technologies.

At last count (see below), I found nine open-source pure-play VDBs and 21 companies that support vector search or analytics. I’m sure that when I look again next week the list will have grown again.

**However, you must keep in mind that, here in the land of probability, not all VDBs are created equal.**

---

### Vectors are for everyone - not just for ML scientists

Vector database use cases tend to fall into the same categories, but that doesn’t mean they can’t be used by every middle-tier or backend software developer.

One killer use case is adding critical observability to your company’s use of foundation models. Specifically, to monitor error or drift, and send out some alerts. You may recall that around the 21st of February, ChatGPT had a bit of a meltdown and [started returning alarming nonsense](https://www.independent.co.uk/tech/chatgpt-status-reddit-down-gibberish-messages-latest-b2499816.html) responses.

Another use case for any kind of programmer is improving your help or documentation search results. You can easily replace lexical search with semantic search just by adding a VDB of your documents broken down into manageable chunks, and links to the original docs. No LLMs or massive GPUs needed.


### What is a vector?

Vectors are lists of values, usually doubles or floats. They are encoded forms of text or images, video, and audio usually, but in fact, vectors can represent any complex data that you have an encoder for.**

For the rest of the article examples, the vectors I will be referring to are created by transformers, a type of neural network architecture that transforms or changes an input sequence into an output sequence. The “T” in ChatGPT. The output sequence is called an embedding, and the embedding is encoded in a vector. Vectors have one dimension, the number of elements or size of the list. Vector dimensions are determined by the actual transformer and ML model.


---

### Search algorithms and indexes

Let’s use the previous example to help understand how search works in VDBs. Consider a corpus of help documents. One of the sections in the document explains how to enable and disable a workflow. Your customers or users, come from all over the world and will probably express their query with a set of related terms. With lexical search, the user must use “enable” or “disable”, and “workflow” to retrieve a result. If the user writes, “How do I start a workflow?” they get nothing, or they get unrelated results. That’s friction; I hate friction.

Vector databases, whether they contain embeddings for text, images, or music, use the semantic qualities of data. Semantic refers to the meaning or context of data, rather than its characteristics (like data type or range of values). Semantic analysis is the process of analyzing and interpreting the meaning of data to extract relevant information and insights.

Similar to text embeddings, visual embeddings also capture the semantic qualities of an image, but they achieve this through a different approach due to the inherent differences between text and visual data.

VDB search uses semantic similarity, and similarity is not binary, it is a matter of degree.

For example, below are two sentence pairs that have been encoded as embedding vectors and compared using the [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) function:

```
# model = SentenceTransformer("all-MiniLM-L6-v2")

How can I stop the workflow? - How can I disable the workflow?

Similarity Score: 0.8491

# mpnet_model = SentenceTransformer("all-mpnet-base-v2")

How can I start the workflow? - How can I enable the workflow?

Similarity Score: 0.6521
```
---

Here, the calculated cosine similarity values of float data type, with values between -1 meaning exactly opposite, to 1 meaning exactly the same.

Why are the first two pairs more similar (**0.8491**) than the second pair (**0.6521**)?

It is critical to understand that this depends entirely on the model used to encode the vectors.

So, back to the search problem. You have a query, “**How can I stop the workflow?**” encoded as a vector, and a database full of help document text encoded as thousands or hundreds of thousands of vectors. How do you find the document vectors that are most similar to the query vector? Table scan? Mmmm no. The naive approach rarely works in machine learning.

While most implementations of vector search use the same approach, every VDB maker is trying to outperform the competition, and so this space is evolving rapidly. Weaviate, for example, has their [explanation](https://weaviate.io/blog/why-is-vector-search-so-fast), Milvus has [theirs](https://milvus.io/blog/scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md#Vectors-and-Vector-Similarity-Search), and Pinecone [theirs](https://www.pinecone.io/learn/bert-search-speed/).

I could try to explain the intricacies of [ANN](https://en.wikipedia.org/wiki/Nearest_neighbor_search) and [HNSW](https://en.wikipedia.org/wiki/Hierarchical_Navigable_Small_World_graphs) and [inverted indexes](https://en.wikipedia.org/wiki/Inverted_index), but there are better explanations available from the database makers and experts in the field. Yes, it’s all interesting reading, but what I recommend you spend your time on instead, is creating a test bench to do benchmarking of vector dbs AND encoders, using your use cases. Because you’re an engineer and hope is not a strategy.

What really matters is how well a particular VDB handles your use cases.

---

## Comparing VDB metrics and benchmarks

This is where the rubber meets the vector database road. The solution to the search problem is what separates the leaders from the hackers.

**There are six metrics here that you should concern yourself with:**

1. **precision (remember, there is no guarantee that all matching records will be found)**
2. **response time**
3. **for a given number of records (vectors)**
4. **with a given number of elements (vector size/length)**
5. **at a given request-per-second rate**
6. **and the cost-per-million queries.**

You can learn a lot of the basics from this [vector db benchmark page](https://qdrant.tech/benchmarks/?utm_source=google&utm_medium=cpc&utm_campaign=21032858323&utm_content=164663797608&utm_term=qdrant%20benchmarks&gad_source=1&gclid=CjwKCAiAxaCvBhBaEiwAvsLmWKwKvjSr2D4m33Fubq00mrOqkoU3iqm-y0ZyoZRRPEsS2Ex-5TrWgxoClbAQAvD_BwE) by maker Qdrant. They do an excellent job explaining how and why they do things, and their [benchmarking code](https://github.com/qdrant/vector-db-benchmark) is open-source.

*N.B. Note the precision column in the results table.*

The other key considerations specifically for VDBs are:

- **Which models can be used natively/integrated easily for embeddings**
- **Client libraries or API**
- **Query language, if any**
- **Schema capabilities: how easy is it to create and change the schema? How can column/field/property integrity be defined and maintained**
- **Default values**
- **ACID transactions**
- **Clustering - Concurrency or Availability tradeoff**

As for all the other aspects of a vector database, you need to consider the same factors as you would with any production database system:

- **Reliability**
- **Operational considerations**
- **Training**
- **Ease of use**
- **Vendor lock-in**
- **Cost**
- **Backup/Restore**
- **Replication**
- **Sharding potential**
*Another useful benchmarking page is https://benchmark.vectorview.ai/vectordbs.html*

### Scaling in 4 dimensions

**Wait, four dimensions? Scale up, scale out, and …? Scale the number of records and scale vector size. Yup.**

When considering what kind of infra you’ll need to load and perf test your vector db candidates, you will need to consider how well you can scale up and out at a given db size and vector size. I can almost guarantee that within the first year of operation, some new language model will come along that makes a huge difference using vectors half the size. Or, twice the size. You get what I mean. More about this later.

---

**Pure play Vector db companies, open source or source-available:**

- **Chroma – 2019†**
- **LanceDB – 2023**
- **Marqo – 2019**
- **Milvus – 2018**
- **Pinecone – 2019**
- **Qdrant – 2020**
- **Vald – 2018**
- **Vespa.ai – 2018**
- **Weaviate – 2016**

Companies that have vector search or analytic capabilities – many added in the last year:

|           |  |
|--------------------|-----------------|
| Cassandra          | OpenSearch      |
| ClickHouse         | Pgvector        |
| Deep Lake          | PlanetScale     |
| Elasticsearch      | Redis           |
| Epsilla            | Rockset         |
| Featureform        | ScaNN           |
| GSI Technology     | SingleStore     |
| Kinetic            | Supabase        |
| Metal              | SurrealDb       |
| MongoDB            | Zilliz          |
| Nomic AI           |                 |


---

### Embeddings, encoders and models

Embeddings act as a bridge, transforming your data into a low-dimensional vector representation. This vector captures the essential characteristics and relationships within the original data in a way that's suitable for machine learning algorithms.

For the purposes of this article, embeddings are

- **Created by machine learning technology**
- **called a model**
- **where a model is a program that can recognize patterns in data or make predictions**
- **and that model uses the transformer architecture.**

Once trained on a dataset appropriate to the model’s purpose, some text, image, or music is passed to the model, and the model produces an output called an embedding, encoded in a vector.

All of the above looks like this in Python:

```python

!pip install sentence_transformers

from **sentence_transformers** import **SentenceTransformer**, **util**

model = **SentenceTransformer**("all-MiniLM-L6-v2")

embeddings_stop = model.**encode**("How can I stop the workflow?")

**print**(embeddings_stop)

**Output:**

**=======================================================================**

tensor([-6.5851e-04,  7.1014e-02,  1.3371e-02, -3.4675e-02,  3.5715e-02,

-9.1417e-02, -5.0629e-03, -9.1829e-02,  8.4365e-02, -2.5070e-02,

...

5.2123e-02,  1.8271e-02,  1.2090e-02, -5.1951e-03, -1.4240e-03,

-2.1067e-03,  2.5263e-02,  6.3986e-02,  5.3600e-02, -4.4349e-02,

-1.2972e-02,  4.2322e-02, -3.3158e-02, -4.2140e-02,  3.0803e-02,

-4.2647e-03,  5.4818e-02,  1.5457e-02,  2.6478e-02])

---
```
---

### The role of embeddings

Embeddings play a crucial role in transforming complex data into a format that algorithms can understand and process effectively. They allow algorithms to work with complex data more efficiently and effectively. They bridge the gap between raw data and machine learning models by capturing the underlying meaning and relationships within the data:

- Aim to capture the semantic meaning or underlying concepts within the data. For example, a word embedding might not just represent the letters in a word, but also its meaning and relationship to other words.
- By reducing dimensionality, make data processing and manipulation more efficient. This allows algorithms to handle large datasets and perform complex tasks faster.
- Embeddings encode data in a way that facilitates measuring similarity between different data points. Similar items will have vectors closer together in the embedding space, making it easier for algorithms to identify relationships and patterns within the data.
- Can be used as features themselves. These learned vector representations can be fed into machine learning models as input data, allowing the model to leverage the captured semantics and relationships for tasks like classification, recommendation, or anomaly detection.


**The above paragraph wrote that *reducing dimensionality makes data processing and manipulation more efficient*. What does dimensionality mean?**

Let’s use a text model to explain. In a text model’s training dataset, the size of the vocabulary might be 20 thousand words. [Harry Potter](https://news.ycombinator.com/item?id=2775838#:~:text=Thanks%20to%20the%20internet%E2%80%A0,by%20a%20factor%20of%20three.), for example, has 1,122,131 total words and 21,441 unique words. So a Harry Potter model would have a vocabulary size of 21,441. The vocabulary size is the high-dimensional space.

Embeddings reduce the size of the vector needed to encode some text from the high-dimensional space (21,441 dimensions) to a low-dimensional space of, 384 or 768 dimensions, depending on the model. This process reduces the complexity of the data while still preserving the essential information about the text's semantic content.

You may also see the terms ‘sparse’ or ‘dense’ vectors. These refer to the number of vectors where the element values are equal to zero, i.e., sparse means lots of zero values. Zero values tell us nothing so ML doesn’t like them. Dense vectors are much better.

If you’d like to read more technical details about embedding, I can highly recommend this article form VBD maker Pinecone: [Sentence Transformers: Meanings in Disguise | Pinecone](https://www.pinecone.io/learn/series/nlp/sentence-embeddings/)

In the code examples I wrote for this article, I’m using the [Sentence Transformer](https://www.sbert.net/) created by Nils Reimers, currently the director of ML at Cohere.ai.

I’ve chosen two sentence transformer models for the demo code, which are described very well [here](https://www.sbert.net/docs/pretrained_models.html)

These descriptions are critical to the proper use of the models.

Sentence transformers are very powerful and very popular. There are more than 4,800 [sentence-transformer models](https://huggingface.co/sentence-transformers) on the huggingface.co model hub that are pre-trained on a wide variety of existing models, like this [PubMed](https://huggingface.co/pritamdeka/S-PubMedBert-MS-MARCO) (life sciences literature) model. It maps sentences and paragraphs to a 768-dimensional dense vector space and can be used for tasks like clustering or semantic search. There are numerous language-specific models, like Chinese, Swedish and Vietnamese. Sorry, no Klingon.


---

## Models are everything

Remember this?

```
# model = SentenceTransformer("all-MiniLM-L6-v2")

How can I stop the workflow? - How can I disable the workflow?

Similarity Score: 0.8491

# mpnet_model = SentenceTransformer("all-mpnet-base-v2")

How can I start the workflow? - How can I enable the workflow?

Similarity Score: 0.6521
```

Think of a model as if it were a person, and the model’s training data as the person’s total life experience. Now, imagine that there’s a model of you and your life experience – what does ‘disable’ mean to you? What are all the relationships and contexts you have in your head for that word? They are definitely not the same as mine.

Now imagine that you can encode your total understanding of “disable” in a vector with 768 dimensions but I can only use a vector of 384 dimensions to encode mine. The embeddings we produce will always be different. And when we use something like the cosine similarity function or the [Euclidean distance function](https://en.wikipedia.org/wiki/Euclidean_distance) to compare similarity between our embeddings, they, too, will be different.

---

## Embedding Vectors are not interchangeable

The reason I’ve gone to great lengths to explain embeddings is that they are not interchangeable. You can’t mix embeddings that were generated by different models. It is just like comparing apples and oranges.

Why is this important? Because the model and embedding you choose for your work is a bit like a unit of measurement. Yes, nautical miles and statute miles are both miles, but they have different lengths. If you are going to use a model for some critical work then you must have complete control over the model-version that you use, otherwise, you might wind up comparing text using the wrong unit of measurement.

### Model Drift - Observability

Let’s imagine that you use OpenAI for your customer service chatbot. How are you going to implement some observability to catch the sort of trouble that happened on February 21, 2024?

It’s not that hard but, because of the probabilistic nature of GenAI, it’s not perfect. Anyway, the basics go like this:

1. Capture random samples of your customer support questions and the responses given by ChatGPT
2. Organize them by topic or product or service.
3. For each question, generate an embedding for the question and one for the response.
4. Calculate the mean similarity between your set of topic questions and responses.
5. Now, add some monitoring code that captures every customer query and ChatGPT response, calculate the embeddings, and then the similarity.
6. Does the similarity deviate significantly from the median similarity for that topic?
7. If so, add the question and response to a list to be reviewed.
8. If the similarity deviates a whole lot from the median similarity, send an alert to somebody to see if ChatGPT is going nuts.

If you do this, then from the moment this goes into production, you will need to use the same unit of measurement - the same model–version to generate all of your embeddings and the same function-version to perform all of your similarity calculations.

Since I have no control over ChatGPT’s code, testing, or releases, I do not use their embeddings. Also, there’s really no need to pay for embeddings when so many open-source models can do just about everything you need for no per-transaction fee.

---

## Vector databases in your architecture

As mentioned earlier, the vector database space is evolving at light speed. Chances are that the VDB you love today won’t be the one you love next year.

Following some basic architectural principles will serve you well as you create your systems and workflows:

- Loose Coupling

- [Postel’s Law](https://en.wikipedia.org/wiki/Robustness_principle#:~:text=It%20is%20often%20reworded%20as,an%20early%20specification%20of%20TCP.)

“Be conservative in what you send, be liberal in what you accept." It’s not really a law, it’s more of a dictum, but following this advice has saved me a lot of grief, especially when it comes to writing APIs. I already mentioned that I don’t like friction, and using someone else’s API is never free of friction, and often you have no idea why their API returns a 400 Bad Request. This is one of the reasons that I don’t like to use code that automatically converts JSON to objects. I prefer code that looks for the required fields/properties and ignores the rest. Cuts down on breaking changes.

### Abstraction

Abstraction is the art of simplifying complex systems by focusing on essential details and hiding irrelevant ones. It is the magic ingredient that keeps software development manageable, promotes code reuse, and allows teams to build complex systems without getting tangled in a web of intricate details. The core elements of abstraction are:

- Modular Design – Breaking down a large system into smaller, self-contained modules with well-defined interfaces.
- Focus on Functionality – Developers can concentrate on the "what" instead of the "how." They define the functionalities each module provides without getting bogged down in the specific implementation details.
- Flexibility and Adaptability – Abstracting core functionalities allows for easier modifications and upgrades. Changes within a module can be made without affecting the entire system as long as the public interface remains consistent. This future-proofs the architecture and facilitates adaptation to evolving needs.
- Reducing Complexity – By hiding unnecessary details, abstraction helps developers grasp the big picture and reason about the overall system behavior without getting overwhelmed by low-level complexities.

But How? The Facade Pattern. A facade is an object that serves as a front-facing interface masking more complex underlying or structural code. Put your chosen VDB behind a facade API layer, and ensure that the API is generic and not tightly coupled to your particular VDB’s implementation details.

---

## Sentence Transformer Use Cases

ChatGT is pretty awesome, but for many use cases, it is expensive or overkill. So many NLP/NLU tasks can be done locally without a massive GPU. All of the following have great Python code examples:

- [Semantic Textual Similarity](https://www.sbert.net/docs/usage/semantic_textual_similarity.html) - here’s a great explanation with code from SBERT.net

- [Retrieve & Re-Rank](https://www.sbert.net/examples/applications/retrieve_rerank/README.html) For complex search tasks, for example, for question answering retrieval, the search can significantly be improved by using Retrieve & Re-Rank.

- [Topic Modeling](https://www.sbert.net/examples/applications/clustering/README.html#topic-modeling) is a key machine-learning technique that uses statistical methods to analyze text data. It's used to create structured data from unstructured data. It’s also necessary for the observability example I used above.

- [Yes, Image Search!](https://www.sbert.net/examples/applications/image-search/README.html)

SentenceTransformers provides models that allow us to embed images and text into the same vector space to implement image search.

---

## Vector/database use cases

**Natural Language Processing (NLP):**

- Semantic Search: Finding documents or passages similar in meaning to a query, even if they don't share the exact keywords.
- Document & Recommendation Systems: Understanding the content and relationships between documents for tasks like document clustering, sentiment analysis, and personalized recommendations.

**Image & Video Processing**

- Image & Video Retrieval: Finding similar images or video segments based on their visual content, regardless of captions or tags.
- Image & Video Classification: Categorizing or classifying images and videos based on their visual features.

**Knowledge Graphs and Ontologies**

- Entity Linking: Linking entities within text to their corresponding entries in a knowledge graph based on semantic similarity.
- Relationship Prediction: Predicting relationships between entities within a knowledge graph based on their existing connections and semantic understanding.

**General-purpose similarity search**

- VDBs have capabilities beyond specific domains, highlighting their suitability for any application where finding similar data points based on their underlying meaning or representation is crucial.

## Conclusion

This article has covered a lot of ground in a short time…

Kestra is awesome at creating and managing ML/AI/NLP workflows that rely on vectors and VDBs that handle unstructured text, images, audio, and video. You can manage the integration of vector databases within your workflows, ensuring efficiency and scalability. Discover how to leverage Kestra for orchestrating your vector database by exploring our comprehensive guides and resources:

To go deeper into the integrations of Kestra with vector databases you can read our guide [How to Work with Vector Databases in Kestra](../2023-10-31-kestra-weaviate/index.md)

you can also check our article about [How to Orchestrate your Applications and Microservices built with SurrealDB using Kestra](../2023-10-09-kestra-surrealdb/index.md).

Join the Slack [community](/slack) if you have any questions or need assistance.
Follow us on [Twitter](https://x.com/kestra_io) for the latest news.
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
