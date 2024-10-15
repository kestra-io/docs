---
title: "Kestra and Hugging Face: Why Add Complexity When HTTP Requests Can Do It All?"
description: If you’re looking to add some AI-powered features like natural language processing or real-time data insights, Kestra can help. The HTTP task functionality allows you to tap directly into Hugging Face’s powerful library of pre-trained models. No extra infrastructure is needed.
date: 2024-10-15T13:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  role: 
  image: mproset
image: /blogs/
---

When you hear “AI workflow,” you might assume that you’re signing up for layers of complexity, with dependencies and a time-consuming setup. But the reality is you can integrate Hugging Face models into your Kestra workflows with minimal efforts. AI doesn’t have to mean over-engineering; it can be as straightforward as a few HTTP requests. 

## Why Overcomplicate? Hugging Face and Kestra Works fine

Kestra offers an easy way to leverage Hugging Face models without adding unnecessary complexity. Need to analyze sentiment in customer reviews? Or perhaps classify large data sets? With Hugging Face’s extensive API library, you have access to hundreds of models capable of handling these tasks.

 Simply connect to Hugging Face’s API through Kestra’s HTTP tasks, and you’re good to go. Kestra will handle API authentication, HTTP requests, and even responses.

## How It Works: Connecting to Hugging Face Models

The API calls work like any other HTTP task, allowing you to integrate AI features into your workflows. Here’s how you can make the most of Hugging Face models within Kestra for different purposes:

1. **Fraud Detection**: Kestra can trigger Hugging Face models that analyze transaction data in real-time, flagging any unusual patterns
2. **Sentiment Analysis for Customer Support**: Connect Kestra to your customer service channels and route incoming messages to Hugging Face’s sentiment analysis models. Kestra can classify the message tone and urgency, escalating high-priority feedback to the right teams instantly.
3. **Language Translation**: If you need to manage multilingual customer inquiries, Kestra can automatically send incoming messages to a Hugging Face translation model, then respond in the customer’s language in seconds. It’s a quick way to offer native language support without extensive setup.

### Implementing a Real Example in Kestra

Let’s look at a practical example of using Kestra to translate text from English to Spanish. With Hugging Face’s NLP models, you can configure an HTTP task to make a simple API call. Here’s how it’s done in Kestra:

```yaml
yaml
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
yaml
id: customer_request_classification
namespace: customer.support
tasks:
  - id: classify_inquiry
    type: io.kestra.plugin.core.http.Request
    uri: https://api-inference.huggingface.co/models/facebook/bart-large-mnli
    method: POST
    contentType: application/json
    headers:
      Authorization: "Bearer your Token"
    formData:
      inputs: "Hi, I recently bought a device from your company but it is not working as advertised and I would like to get reimbursed!"
      parameters:
        candidate_labels: '["refund", "legal", "faq"]'
```

Each time a new inquiry is processed, Kestra pulls the data and sends it to the Hugging Face model for classification. The response can then be used to route the inquiry to the correct department or trigger automated responses. With this setup, you receive immediate categorization, helping your team address customer needs promptly and efficiently.

## Flexible AI-Powered Workflows for Developers

Beyond fraud detection and translation, Kestra’s flexibility allows you to integrate AI models into a wide variety of applications. Whether you’re building automated customer support or something more niche, Kestra’s orchestration capabilities make it easy to add AI to your workflows.

 Kestra platform is designed to simplify AI integration, offering features like:

- **Configurable HTTP Requests**: Use Kestra’s HTTP plugin to send data directly to Hugging Face models or any other API with ease.
- **Event-Driven Triggers**: Run workflows in response to specific events.
- **API Integration**: Connect Kestra to Hugging Face and other services without extra dependencies or infrastructure management.

With Kestra, you can keep your workflows simple while still tapping into the advanced capabilities that Hugging Face models provide. For developers, this means more time creating impactful solutions and less time worrying about setup or maintenance.

## Conclusion: Simplify AI Integration with Kestra and Hugging Face

Kestra’s real power is in how it integrates with the tools you’re already using—and how it can enhance them with AI capabilities. With features that allow you to trigger workflows in real time, automate approvals, and connect across diverse tools, Kestra makes it simple to build dynamic workflows that work for you.

For developers, Kestra’s “everything-as-code” approach means that building and scaling complex, AI-enabled workflows is accessible. Kestra combines the power of plugins with flexible automation tools, making it easy to set up continuous integration, version control, and task orchestration without getting stuck in endless configuration loops.

## Taking it Further

 With support for Docker, Kubernetes, and various cloud providers, Kestra fits into modern infrastructure .

The extensive plugin library and adaptable structure mean Kestra isn’t limited to data orchestration. You can bring in observability tools, set up notification triggers, or even configure machine learning models to monitor key performance metrics. It's built for more than just task automation, you can **simplify and improve how you leverage AI and data throughout your entire tech stack.**

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).
If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
