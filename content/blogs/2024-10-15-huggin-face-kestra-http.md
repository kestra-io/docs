---
title: "Kestra and Hugging Face: Why Add Complexity When an API Call Will Do?"
description: Integrating HuggingFace with Kestra will supercharge your workflows with AI-powered features. The HTTP task functionality allows you to tap directly into a powerful library of pre-trained models.
date: 2024-10-16T18:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  role: 
  image: mproset
image: /blogs/2024-10-15-huggin-face-kestra-http.jpg
---

AI integration doesn’t have to be complicated. Kestra lets you connect to Hugging Face models quickly with just a few HTTP requests. Need to analyze the sentiment of customer reviews? Or perhaps classify large datasets? With Hugging Face’s extensive API library, you have access to hundreds of models capable of handling these tasks. 

In this post, we'll connect to Hugging Face’s API through Kestra’s HTTP tasks. HuggingFace will provide AI capability via an API and Kestra will handle authentication, timeout, retries and ensuring the response is correctly captured.

## Use Cases for Hugging Face and Kestra

You can leverage Hugging Face models within Kestra for a variety of purposes:

1. **Analytics**: Kestra can trigger Hugging Face models that analyze data in real-time, and give you insights into the incoming data. It allows you to answer business questions such as: "Is it a good day for your sales?" or "What are our top sellers?". You can even push further with some alerting to send a Slack or Discord message showing daily trends.
2. **Sentiment Analysis for Customer Support**: Connect Kestra to your customer service channels and route incoming messages to Hugging Face’s sentiment analysis models. Kestra can classify the message tone and urgency, escalating high-priority feedback to the right teams.
3. **Language Translation**: If you need to manage multilingual customer inquiries, Kestra can automatically send incoming messages to a Hugging Face translation model, then respond in the customer’s language. It’s a quick way to offer native language support.

### Example Workflow in Kestra

Let’s look at a practical example of using Kestra to translate text from English to Spanish. With Hugging Face’s NLP models, you can configure an HTTP task to make a simple API call. Here’s how it’s done in Kestra:

```yaml
id: hugging_face_translation
namespace: company.team
tasks:
  - id: translate_text
    type: io.kestra.plugin.core.http.Request
    uri: https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-es
    method: POST
    contentType: application/json
    headers:
      Authorization: "Bearer your token"
    formData:
      inputs: "Hello from Paris"
```

In this workflow, Kestra makes a POST request to the Hugging Face model. This task sends text to the translation API, which then returns the translated message. It’s a lightweight integration, avoiding any extra steps for setup or maintenance. You can embed this task within a larger workflow, using the output as needed.

### Taking It a Step Further

Because Kestra is event-driven, you can trigger Hugging Face models whenever a specific event occurs. For example, let’s look at how Kestra can help streamline customer support by classifying requests in real-time. Each time a customer inquiry comes in, Kestra can automatically call a Hugging Face model to categorize the inquiry based on topics like "refund," "legal," or "FAQ." With Kestra’s HTTP capabilities, you can make these calls and get instant feedback within a single, orchestrated workflow.

Here’s how to set up a real-time classification workflow with Kestra and Hugging Face:

```yaml
id: hugging_face
namespace: company.team
tasks:
  - id: hugging_face_categorize
    type: io.kestra.plugin.core.http.Request
    uri: https://api-inference.huggingface.co/models/facebook/bart-large-mnli
    method: POST
    contentType: application/json
    headers:
      Authorization:  "Bearer <YOUR_TOKEN>"
    formData: 
      inputs: "{{ trigger.value | jq('.request') | first }}!"
      parameters:
        candidate_labels: '["refund", "legal", "faq"]'

  - id: insert_into_mongodb
    type: io.kestra.plugin.mongodb.InsertOne
    connection:
      uri: "mongodb://mongoadmin:secret@localhost:27017/?authSource=admin"
    database: "kestra"
    collection: "customer_request"
    document: |
      {
        "request_id": "{{ trigger.value | jq('.request_id') | first }}",
        "request_value": "{{ trigger.value | jq('.request') | first }}",
        "category": "{{ json(outputs.categorize.body).labels }}",,
        "category_scores": "{{ json(outputs.categorize.body).scores }}",
      }

triggers:
  - id: realtime
    type: io.kestra.plugin.kafka.RealtimeTrigger
    topic: customer_request
    properties:
      bootstrap.servers: localhost:9092
    serdeProperties:
      valueDeserializer: JSON
    groupId: kestraConsumer

Each time a new inquiry is processed, Kestra pulls the data and sends it to the Hugging Face model for classification. The response can then be ingested into a downstream database or trigger automated responses. With this setup, you receive immediate categorization, helping your team address customer needs promptly and efficiently.

## Flexible AI-Powered Workflows for Developers

Beyond fraud detection and translation, Kestra’s flexibility allows you to integrate AI models into a wide variety of applications. Whether you’re building automated customer support or something more niche, Kestra’s orchestration capabilities make it easy to add AI to your workflows.

 Kestra platform is designed to simplify AI integration, offering features like:

- **Configurable HTTP Requests**: Use Kestra’s HTTP plugin to send data directly to Hugging Face models or any other API with ease.
- **Event-Driven Triggers**: Run workflows in response to specific events.
- **API Integration**: Connect Kestra to Hugging Face and other services without extra dependencies or infrastructure management.

With Kestra, you can keep your workflows simple while still tapping into the advanced capabilities that Hugging Face models provide. For developers, this means more time creating impactful solutions and less time worrying about setup or maintenance.

## Conclusion: Simplify AI Integration with Kestra and Hugging Face

Kestra’s real power is in how it integrates with the tools you’re already using—and how it can enhance them with AI capabilities. With features that allow you to trigger workflows in [real time](https://kestra.io/docs/workflow-components/triggers/realtime-trigger), automate approvals, and connect across diverse tools, Kestra makes it simple to build dynamic workflows that work for you.

For developers, Kestra’s “everything-as-code” approach means that building and scaling complex, AI-enabled workflows is accessible. Kestra combines the power of plugins with flexible automation tools, making it easy to set up continuous integration, version control, and task orchestration without getting stuck in endless configuration loops.

## Next Steps

 With support for Docker, Kubernetes, and various cloud providers, Kestra fits into modern infrastructure .

The extensive plugin library and adaptable structure mean Kestra isn’t limited to data orchestration. You can bring in observability tools, set up notification triggers, or even configure machine learning models to monitor key performance metrics. It's built for more than just task automation, you can **simplify and improve how you leverage AI and data throughout your entire tech stack.**

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).
If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
