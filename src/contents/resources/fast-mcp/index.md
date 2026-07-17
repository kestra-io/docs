---
title: "FastMCP: Declarative Framework for LLM Tooling & Agents"
description: "Explore FastMCP, the Pythonic framework for building Model Context Protocol (MCP) servers. Learn how it simplifies LLM tool integration and how Kestra orchestrates these advanced AI workflows."
metaTitle: "FastMCP: Build LLM Tools with Declarative Workflows"
metaDescription: "FastMCP simplifies LLM tooling and agent development. This declarative framework streamlines building and deploying Model Context Protocol (MCP) servers."
tag: "ai"
date: 2026-07-07
slug: "fast-mcp"
faq:
  - question: "What is FastMCP?"
    answer: "FastMCP is an open-source Python framework designed to streamline the creation and deployment of Model Context Protocol (MCP) servers. It provides high-level abstractions, allowing developers to quickly build robust interfaces for Large Language Models (LLMs) to interact with external tools and data sources."
  - question: "What is FastMCP code?"
    answer: "FastMCP code refers to Python-based implementations that define MCP servers. Developers use FastMCP's declarative syntax to specify resources, tools, and prompts, which LLMs can then discover and invoke via the Model Context Protocol. This code handles the underlying protocol complexities, allowing developers to focus on tool logic."
  - question: "What is the difference between FastMCP and FastAPI?"
    answer: "FastAPI is a general-purpose web framework for building APIs, while FastMCP is specifically designed for building Model Context Protocol (MCP) servers. While both are Pythonic and performant, FastMCP offers specialized abstractions and features tailored to the MCP standard, simplifying the integration of LLMs with external capabilities."
  - question: "Who is behind FastMCP?"
    answer: "The FastMCP project is an open-source initiative that builds upon the Model Context Protocol (MCP). It was developed to provide ergonomic abstractions for Python developers to build and deploy MCP servers. Jeremiah Lowin, founder and CEO of Prefect, and Adam Azzam, VP of Product at Prefect, are publicly associated with the project's development and promotion."
  - question: "How do you use FastMCP?"
    answer: "To use FastMCP, developers define their tools, data sources, and prompts in Python using FastMCP's declarative syntax. This creates an MCP server that LLMs can query. Kestra can then orchestrate the deployment and management of these FastMCP servers, and use them as callable tools within broader AI workflows."
  - question: "What does MCP stand for?"
    answer: "MCP stands for Model Context Protocol. It is an open standard introduced by Anthropic in November 2024. MCP provides a secure and standardized communication 'language' for Large Language Models (LLMs) to interact with external data, applications, and services, enabling them to use tools and access real-time information reliably."
---

The rise of Large Language Models (LLMs) has ushered in a new era of automation, but connecting these powerful models to real-world data and tools remains a significant challenge. Developers often grapple with complex protocols, security considerations, and the overhead of building reliable interfaces. This friction slows down the development of sophisticated AI agents and intelligent applications.

FastMCP emerges as a critical solution, offering a fast, Pythonic framework to abstract away these complexities. It empowers engineers to rapidly build and deploy Model Context Protocol (MCP) servers, enabling LLMs to securely and effectively interact with the external world. This article explores how FastMCP works and how Kestra provides the orchestration layer to govern these advanced AI systems.

## Understanding the Model Context Protocol (MCP)

Before diving into FastMCP, it's essential to understand the protocol it implements: the Model Context Protocol (MCP). Introduced by Anthropic in November 2024, MCP is an open standard designed to solve a fundamental problem in AI development: how can LLMs safely and reliably interact with external systems?

LLMs, by their nature, are stateless and disconnected from the real world. They operate on a fixed set of training data and have no inherent ability to check a database, call an API, or access a file system. To perform useful tasks, they need to be connected to tools. MCP provides the standardized communication layer for this interaction.

It acts as a secure "language" that an LLM client (like an AI agent) can use to discover and invoke tools exposed by an MCP server. This protocol addresses several key challenges:
- **Standardization**: It creates a common interface, so any MCP-compliant agent can talk to any MCP-compliant server, regardless of the underlying programming language or tools.
- **Security**: It defines a clear boundary, allowing server administrators to control which tools are exposed and how they can be used.
- **Discoverability**: It allows an agent to ask a server, "What can you do?" and receive a structured, machine-readable list of available tools and their parameters.
- **Reduced Hallucination**: By providing a reliable way to fetch real-time data, it grounds the LLM's responses in factual information, reducing the likelihood of making things up.

[MCP orchestration is the catalyst](/resources/ai/mcp-orchestration) for building more powerful and sophisticated agentic AI systems, bridging the gap between the reasoning capabilities of LLMs and the practical execution capabilities of external tools.

## Why FastMCP Simplifies LLM Tooling

While MCP provides the standard, developers still need to implement it. This is where FastMCP comes in. FastMCP is an open-source Python framework that provides high-level, ergonomic abstractions for building MCP servers. Its primary goal is to abstract away the protocol's complexities, allowing developers to focus on what matters: the logic of their tools.

### Declarative Development for MCP Servers

FastMCP adopts a declarative, Pythonic approach. Instead of manually handling HTTP requests, parsing JSON, and implementing the full MCP specification, developers simply define their tools and resources using Python decorators and classes. This significantly reduces boilerplate code and accelerates development time. The framework handles the underlying mechanics of serving the tools over the MCP protocol, making the process intuitive for Python developers.

### Bridging LLMs with External Data and Services

The core function of a FastMCP server is to act as a bridge. On one side, it speaks the MCP language to LLMs. On the other, it executes standard Python code that can interact with anything a Python script can: databases, REST APIs, internal services, file systems, or even other scripts. This makes it a powerful component for creating versatile [AI tools that can be integrated into larger workflows](/docs/ai-tools). FastMCP simplifies the creation of this bridge, turning complex integration tasks into manageable Python functions.

## FastMCP Architecture and Key Features

FastMCP is designed to be both simple to start with and powerful enough for complex applications. Its architecture revolves around a few core concepts that map directly to the MCP specification.

### Defining Static and Dynamic Resources

In FastMCP, everything an LLM can interact with is a "resource." These can be static, like a fixed piece of text or a configuration file, or dynamic, like the output of a function call. Developers can define tools that operate on these resources. For example, you might define a static resource containing a list of product IDs and a dynamic tool that fetches the current inventory for a given ID from a database. This clear separation makes it easy to structure the capabilities you want to expose to an LLM.

### Core Components for LLM Interaction

FastMCP provides clear components for building your server:
- **Tools**: Plain Python functions decorated to be exposed via MCP. FastMCP handles input validation (using Pydantic models), execution, and formatting the output for the LLM.
- **Resources**: Data or prompts that can be made available to the LLM.
- **MCP Server**: The main application object that gathers all defined tools and resources and exposes them through a compliant web server.

This component-based model allows developers to build a [live catalog of plugins and blueprints](/blogs/2026-04-30-kestra-mcp-plugins-blueprints) that AI coding agents can consume directly, enhancing their ability to perform complex tasks.

### FastMCP 3.0: Notable Improvements and Capabilities

Like any active open-source project, FastMCP is continuously evolving. Recent major releases, such as version 3.0, have introduced significant architectural improvements and new features. These updates often focus on enhancing performance, improving the developer experience, and expanding compatibility with the latest advancements in the MCP standard. Key areas of improvement typically include better asynchronous support, more flexible resource definition, and streamlined deployment options, ensuring the framework remains a top choice for building modern MCP applications.

## Building and Deploying FastMCP Servers

Creating and deploying a FastMCP server is a straightforward process, designed to get developers from concept to production quickly.

### A Quickstart for Your First FastMCP Server

Getting started typically involves a few simple steps:
1.  **Installation**: Install the `fastmcp` package using pip.
2.  **Define a Tool**: Write a simple Python function and add a `@tool` decorator. Use type hints for parameters to enable automatic validation.
3.  **Create the Server**: Instantiate an `MCP` application object and register your tool with it.
4.  **Run the Server**: Use an ASGI server like Uvicorn to run your application locally.

With just a few lines of code, you can have a functional MCP server running on your machine, ready to be queried by an LLM client. This rapid feedback loop is one of the framework's key strengths. Once tools are defined, they can be managed as part of a broader library of [plugins and integrations within an orchestration platform](/docs/workflow-components/plugins).

### Deployment Considerations and Options

When moving from local development to production, you have several options. A FastMCP application is a standard ASGI application, so it can be deployed anywhere you can run Python, including:
- Virtual machines
- Container platforms like Docker and Kubernetes
- Serverless platforms
- Platform-as-a-Service (PaaS) offerings

Some platforms, like Prefect Horizon, offer specialized support for deploying FastMCP servers. However, for true enterprise-grade management, you need an orchestration platform that can handle not just the deployment but the entire lifecycle of your AI applications. This is where a universal control plane becomes essential for managing [AI automation at scale](/ai-automation).

## FastMCP vs. FastAPI: Choosing the Right Framework

A common question among Python developers is how FastMCP compares to FastAPI, a popular high-performance web framework. While they share some similarities—both are built on Starlette and Pydantic and support modern Python features—they are designed for different purposes.

### When to Use a General-Purpose API Framework

FastAPI is an excellent choice for building general-purpose REST or GraphQL APIs. Its strengths lie in its performance, automatic documentation generation (Swagger UI, ReDoc), and robust dependency injection system. If your goal is to build a standard web service for human users or other applications to consume, FastAPI is often the right tool for the job.

### When FastMCP's Specialized Approach is Essential

FastMCP is the superior choice when your primary goal is to build an interface for Large Language Models. It is purpose-built for the Model Context Protocol. This specialization provides several advantages:
- **Reduced Boilerplate**: FastMCP handles the specific request/response formats and discovery mechanisms of the MCP standard automatically. Achieving the same in FastAPI would require significant manual implementation.
- **Domain-Specific Abstractions**: Concepts like "tools," "resources," and "prompts" are first-class citizens in FastMCP, making the code more expressive and aligned with the problem domain.
- **Future-Proofing**: By building on FastMCP, your application stays aligned with the evolving MCP standard, benefiting from updates to the framework without requiring major rewrites.

Choosing FastMCP over FastAPI for MCP servers means you're using a specialized tool that simplifies the task, reduces code complexity, and ensures compliance with a critical AI ecosystem standard.

## Orchestrating FastMCP-Powered Agents with Kestra

Building an MCP server with FastMCP is a crucial first step, but in a production environment, that server is just one component in a larger system. You need a way to deploy, manage, monitor, and integrate these AI capabilities into broader business processes. This is the role of an orchestration platform like Kestra.

### Unifying FastMCP Servers within Broader AI Workflows

Kestra acts as a control plane for your entire technical stack, including your FastMCP-powered agents. You can create Kestra workflows that:
- **Deploy and update** your FastMCP servers as part of a GitOps or CI/CD process.
- **Trigger an AI agent** to perform a task by making a call to its MCP server.
- **Pass data** from other systems (like a database or a message queue) to the agent as context.
- **Take action** based on the agent's output, such as updating a CRM, sending a notification, or starting another data pipeline.

Kestra's [AIAgent plugin](/plugins/plugin-ai/agent/io.kestra.plugin.ai.agent.aiagent) can act as an MCP client, allowing you to invoke tools on any FastMCP server directly from a declarative YAML workflow. This seamless integration allows you to embed intelligent decision-making into complex, multi-step processes.

### Governing Agentic Behavior and Tool Invocation

As AI agents become more autonomous, governance becomes critical. Kestra provides the necessary guardrails for production AI. Every interaction with an MCP server is logged, audited, and version-controlled. You can implement human-in-the-loop approval steps, enforce retries and error handling, and monitor the performance and cost of your AI workflows. This ensures that even as agents operate with more autonomy, their actions remain transparent and governed by business rules. Whether you're building a RAG pipeline with a [ChatCompletion task](/plugins/plugin-ai/rag/io.kestra.plugin.ai.rag.chatcompletion) or complex [AI code generation pipelines](/resources/ai/ai-code-generation-pipelines), Kestra provides the structure for reliable execution.

### Kestra's MCP Plugin for Seamless Integration

Kestra's native support for MCP means you don't have to write custom glue code. You can simply point Kestra's AI plugins to your FastMCP server's endpoint. Kestra can even serve its own internal tools, such as its extensive library of plugins, via an embedded MCP server, allowing external AI agents to orchestrate Kestra workflows. This two-way integration creates a powerful, unified ecosystem where AI agents and declarative workflows collaborate seamlessly. You can explore a wide range of [AI and data resources](/resources/ai) to see these patterns in action.

## Accelerating AI Development with Kestra and FastMCP

FastMCP provides the fast, Pythonic way to build the tools and interfaces that connect LLMs to the world. Kestra provides the declarative, scalable platform to orchestrate, govern, and productionize those tools within end-to-end workflows.

By combining FastMCP for tool building with Kestra for orchestration, engineering teams can achieve a new level of speed and reliability in AI development. This powerful combination allows you to move from a simple AI-powered tool to a fully governed, production-grade automated process that spans your entire organization. With a declarative approach from the tool to the workflow, you can build, deploy, and manage sophisticated AI systems with confidence and control.

Explore how [Kestra's open-source platform](/) can help you unify your data, AI, and infrastructure automation.
