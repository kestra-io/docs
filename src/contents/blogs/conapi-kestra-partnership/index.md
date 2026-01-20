---
title: "Kestra and Conapi Partner to Bridge Workflow Orchestration with API Management"
description: "This partnership delivers practical integration patterns that teams can implement today"
date: 2025-11-18T13:00:00
category: News & Product Updates
author:
  name: Martin-Pierre Roset
  image: mproset
image: ./main.jpg
---

We’re pleased to announce a new partnership between Kestra and [Conapi](https://conapi.at/), an integration-focused consultancy and Gravitee partner. Together, we’re introducing two complementary capabilities that make it easier to expose Kestra workflows through APIs and integrate them into existing enterprise environments.

**About Conapi:**

[Conapi GmbH](https://conapi.at/) brings 20+ years of integration expertise, specializing in pragmatic system integration from API management to workflow automation. They help organizations connect what they have with what they need without unnecessary complexity. Their focus on making enterprise integration actually work in production, not just in PowerPoints, shaped both contributions to the Kestra ecosystem.

## **A New JMS Integration Plugin for Kestra**

As part of this collaboration, Conapi has contributed a new [**JMS integration plugin**](https://conapi.at/kestra-jms-integration-trigger-send-receive/) to the Kestra open-source ecosystem. This plugin brings native support for Java Message Service into Kestra and includes three components:

- **JMS Trigger**: starts a flow when a message arrives on a queue or topic
- **JMS Producer Task**: sends messages to a JMS destination
- **JMS Consumer Task**: receives messages from a JMS destination during a workflow

This setup allows teams to connect Kestra workflows to messaging systems, ESBs, and event-driven architectures without custom tooling. Conapi tested the plugin with multiple JMS brokers and provided examples and automated tests to support its adoption. The JMS integration is available with Kestra 1.1.

## **Integrating Gravitee APIs with Kestra Workflows**

Conapi developed a [Gravitee plugin](https://conapi.at/gravitee-kestra-integration-apis-workflows/) that brings workflow orchestration directly into API processing. The plugin enables real-time enrichment of API requests and responses with Kestra workflow data, with built-in caching for performance optimization. This opens powerful integration scenarios, from dynamic pricing calculations to real-time data transformations.

The integration works through two complementary approaches:

Direct workflow integration: The Gravitee plugin calls Kestra workflows inline during API processing, perfect for synchronous data enrichment and transformations.

JMS-based integration: For long-running processes, Gravitee can trigger workflows via JMS queues with correlation IDs, enabling synchronous and asynchronous patterns while maintaining API responsiveness. Teams can choose immediate acknowledgment, polling, or wait-for-completion patterns based on their needs.

This dual approach gives teams flexibility to expose workflow-driven processes as APIs without architectural compromises. Conapi demonstrated both integrations at a Gravitee User Group and an ERP conference, showcasing real-world scenarios like order processing and inventory management.

*“Our enterprise clients have working JMS systems they've invested in for years. They need to connect these to modern API management and workflow automation without throwing everything away. This integration bridges both worlds, it protects their existing messaging infrastructure while letting them enrich APIs with Kestra workflow data. That's the kind of practical bridge our clients actually need, not another rip-and-replace project." - Stefan Fritz, conapi CEO*

## **About this Partnership with Conapi**

This partnership delivers practical integration patterns that teams can implement today. The combined solution enables organizations to:

- Enrich API responses with real-time workflow data (inventory levels, pricing calculations, approval statuses)
- Trigger Kestra workflows from existing JMS infrastructure without rewrites
- Handle long-running workflows without API timeouts using durable message queuing
- Keep their ESB investments while adding modern API management capabilities
- Bridge synchronous API calls with asynchronous backend processes seamlessly

Whether you're exposing manufacturing workflows, multi-step approvals, or complex order processing, this integration provides the plumbing without the pain. Teams get working examples, tested patterns, and a clear migration path from legacy to modern architectures.

---

## **What’s Next**

Kestra and Conapi will co-host a webinar in **early January**, with a live demonstration of the Gravitee Kestra integration, practical examples, and guidance on when to use each interaction pattern. We’ll share the registration link shortly.

We're grateful to the Conapi team for their work and contribution, and we look forward to expanding this collaboration.

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
