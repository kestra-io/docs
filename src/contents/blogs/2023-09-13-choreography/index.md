---
title: "Building the Layer for Data Choreography"
description: "Going beyond classic data orchestration: the user experience"
date: 2023-09-13T15:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: "bpimpaud"
image: ./main.jpg
---

Most of the best practices we apply in the data ecosystem are coming from software culture. CI/CD, tests, versioning, atomic code or package management all have been introduced because of their success in transforming software development practices.

Over the years, the data ecosystem has incorporated numerous frameworks and methodologies—ranging from data mesh architectures to data vault modeling—for scalable data operations. However, bottlenecks such as resource allocation, pipeline latency, and flawed developer experiences persist.


## Data is not Software

Software engineering teams aim for architectural agility, speed in feature delivery, and separation of concerns. These imperatives are driven by the need to rapidly enhance customer experiences through specific microservices.

Data teams aim to facilitate informed decision-making through accurate data provisioning. The data can serve operational goals, like feeding machine learning models, or analytical goals, such as business intelligence.

With the data mesh framework we successfully integrate the notion of microservice in the data landscape. Here, data is treated as a product, and domain teams manage data the way software teams manage microservices. This framework allows for scalable human workload and federated data governance but isn't sufficient on its own for a unified data landscape.


To create a single source of truth and minimize complexity, an additional layer of control is essential. Data orchestrators serve this role by enhancing data observability and modularity across workflows and pipelines.

## Orchestration is the core layer underneath data
The modern data stack promises efficiency and modularity but falls short in harmonizing those fragmented components. Multiple tools with varied interfaces and requirements complicate execution, hindering especially smaller, non-technical companies from generating value.

The linear perception of data flow—ingestion, transformation, and presentation—doesn't fit today's reality. Data now is multi-sourced, diverse, and volatile.

Small changes in upstream data models and products can lead to different outcomes making it hard to keep data up to date everywhere. Small errors or changes at stage in the process can generate completely inaccurate or exaggerated output.

Viewing data management as a linear workflow is overly simplistic. Data is a complex, evolving landscape, necessitating tools that can adapt in real-time. In this context, data orchestrators emerge as the layer that governs how data moves and resides within systems.

Orchestrating data is an ongoing, non-zero sum game. It's not just about moving data from Point A to Point B; it's about adapting to evolving business goals and data models. Thus, a comprehensive data orchestrator needs multiple capabilities:

* **Linear Scheduling**: For routine data tasks, the ability to schedule via cron jobs is essential.

* **Event-Driven Flows**: An effective orchestrator must react to real-time events, triggering appropriate data flows.

* **Manual Overrides**: Situations may require human intervention; hence, a pause or manual control feature is vital.

* **Universal Integration**: The orchestrator should be able to integrate across various platforms via webhooks and APIs.


The orchestrator should be flexible, not locked down. It should be easy to work with for both planned projects and unexpected issues. A good data orchestrator is more than just a simple tool for moving data; it's a smart system that adapts to the changing needs of data management.

## Focus on the Developer Experience

What new data technologies such as DuckDB, Iceberg table format, SQLmesh or Malloy bring is not only a new way to process and model data.

What’s new is the developer experience.

Back then we were dealing with hardly maintainable Python code, very long SQL queries, and complex infrastructure management. New tools try to carry off the burden of complexity by providing better abstractions, interfaces and onboarding. Long story short: they provide a better experience.

Our ultimate goal is to model reality thanks to data; and take action on it.

A good product is a good user experience. A good user experience is what makes us achieve what we want to do as we planned. To do so our data experience should enable a choreography of different assets and requirements:


* **Role Focus**: we should design an experience where everyone can do their job rather than asking them to be a data-engineer, devops wizard and an analyst at the same time.
While acknowledging that data teams are melting pots of talents and skill sets, everyone should find its space for work. Not to learn another language or abstraction everytime there is a new need. You don't ask the violinist to play the trumpet.

* **Data Trust**: we should have trust in our data: this comes from good observability and explicit status. Does my data land correctly this morning? Is my dashboard up to date? Where can I find the logs for this specific task?
These are typical questions that shouldn't demand hours of searching for answers. That should be as smooth as possible, like checking the weather on your phone.

* **Logic Separation**: the experience of writing business logic should be decoupled from orchestration logic. While it’s mostly a human policy matter, our tools should make this as clear as possible and give us good guidelines.

* **Speed**: we should not wait hours for data to reach our eyes. Same for debugging. The experience should happen as quickly as possible. If possible, in milliseconds. Supporting scalable infrastructure represents an important keystone here.

Choreography here isn't a buzz-word. It's about having an ecosystem where tools work in harmony but are also individually effective. Orchestration is about workflow automation; choreography extends to include user experience with each tool.

---

Reaching real data choreography will be a long journey and it wouldn't be only about tools.
Still we can foresee a future where the data stack lands in a space where experience and simplicity make working with data something pleasant and seamlessly integrated within business and product processes.

We think Kestra helps to achieve this vision.

[Kestra](https://github.com/kestra-io/kestra) is a declarative orchestration tool. Bringing declarative to the party isn’t just a trend: it's the realization that consistency and efficiency can't be done without a proper domain system language.

That’s why we created a rich user interface. In Kestra, every click, every drag, is translated to code at some point. It allows speed and great user experience.

Still it sometimes fails in automation and consistency. That’s why we integrate with CI/CD solutions and provide space for developers who like to craft their own way. Kestra is an API by design.
Our goal is not to create another tool to replace old ones. It’s to create a product that suits different needs of data practitioners and that can blend everywhere.

Data is not software and the data experience needs evolution. We always have this consideration in mind when designing new features and improving Kestra. How will users put their flow in production? How will they build them locally? How will they test them? etc.

We think this vision is the good starting point for reaching a real data experience. For achieving real data choreography.


Feel free to share your vision of the perfect data experience! Reach out via [Kestra Community Slack](/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the open-source community](/slack).

