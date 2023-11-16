---
title: "Overriding a Kestra Plugin for Custom Requirements: Why & How?"
description: "Building reusable components with Kestra"
date: 2023-11-21T08:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: /blogs/2023-11-21-custom-plugin.jpg
---

Kestra is powerful in many ways: you can get started in a few minutes, build robust workflows, and manage everything as code and from the UI.

But what if you need a dedicated plugin with your custom logic arising from business needs?

[Kestra](https://github.com/kestra-io/kestra) provides an extensible plugin architecture to help with that.

Every Kestra task is part of some plugin.

This post will dive into one of our customer's dedicated plugins. They combined [Soda tests](https://www.soda.io/) with their homegrown data quality platform into a dedicated plugin.

## Plugin combining Soda, Kafka and HTTP requests

The company has a homegrown data quality platform in place that effectively centralizes all data metrics at the broader corporation level.

Meanwhile, some teams have opted to use Soda for conducting analytics tests on Big Query tables. This decision however requires the aggregation of these test metrics into the internal data quality platform, which serves as the hub for all consolidated data. 

In order to seamlessly integrate Soda tests into this data quality platform, the team decided to build a custom plugin. Even though Kestra already provides a Soda plugin to run tests through the Soda Python library, they needed support for consuming and producing Kafka messages, which their data quality platform relies on to communicate with external services. On top of that, their custom plugin covers functionality to interact with their internal APIs via HTTP.


Creating such a meta-plugin proves to be highly advantageous, especially when dealing with specific try-catch patterns, establishing communication with APIs, and constructing a comprehensive abstraction layer on top of it.


## From YAML to Java

The development team chose a stepwise approach to create this integrated plugin. Since Kestra already includes the necessary components, they initially developed a Kestra Flow. This Flow enabled them to execute Soda tests and send the resulting metrics to Kafka topics. The outcome was a Kestra flow composed of various tasks, with each task addressing a specific functionality.

![example flow kafka soda](/blogs/2023-11-21-custom-plugin/soda_kafka.jpg)

This initial version proved that YAML's simplicity accelerates development and shortens the feedback loop.

Faced with a decision, the team considered two options: they could either template the Flow by incorporating inputs and outputs to create a subflow (a flow callable by another flow), or they could convert each command into Java methods.

They opted for the latter. The rationale was that handling custom logic, numerous API calls, and managing messages and topics in queue systems is complex. Implementing try-catch patterns, business rules, or fallback methods in a programming language like Java is often more sustainable in the long run. It enhances the maintainability and extensibility of the integration.

Once the Flow was designed in YAML, converting it to Java was straightforward, as you can see in the image below.

![java to yaml](/blogs/2023-11-21-custom-plugin/java_to_yaml.png)

## Build components depending of the context

They are two interesting things here happening:

1. You can start by building a component directly from YAML. Creating a subflow that can be called whenever you want with specific parameters (inputs)
2. You can write a plugin in Java, letting the end-user work with a proper YAML semantic.

Depending on the context and the developer background, we can see that creating components in Kestra - reusable pieces of software - is very easy.

We could also imagine a team only using Python and building subflows calling custom scripts with specific parameters. By creating a Subflow, the team can abstract the whole logic and expose only a few YAML parameters to run the underlying script.

![flow subflow](/blogs/2023-11-21-custom-plugin/flow_subflow.jpg)

## Conclusion
 
Creating reusable components is key in any software development. Thanks to Kestra design, users can create their own building blocks and abstract custom logics easily.

Whether a team is fluent in Java or only wants to work with Python or any language, Kestra offers ways to create templates (subflow) and let the end-user work with YAML syntax.

Checkout [this documentation](https://kestra.io/docs/plugin-developer-guide) if you want to start creating your own plugin. We would love to hear from you and learn about your use case, so don’t hesitate to share your ideas on the [Slack community](http://kestra.io/slack).

Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. Check the code in our [GitHub repository and give us a star](https://github.com/kestra-io/kestra) if you like the project.