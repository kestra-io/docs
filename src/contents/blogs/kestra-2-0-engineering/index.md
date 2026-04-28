---
title: "Kestra 2.0 Is Coming — and Developers Matter More Than Ever"
description: "How we got here, what we got right, what held us back, and what we're rebuilding from the ground up with Kestra 2.0."
date: 2026-04-01T10:00:00
category: Engineering
author:
  name: Ludovic Dehon
  image: ldehon
  linkedin: https://www.linkedin.com/in/ludovic-dehon/
  role: CTO & Co-founder
image: ./main.png
---

Yesterday, we shared [why we raised $25 million and where orchestration is heading](/blogs/kestra-series-a). Today I want to talk about the engineering side: how we got here, what we got right, what held us back, and what we're rebuilding from the ground up with Kestra **2.0**.

But first, one thing I keep hearing that I want to address directly.

There's a narrative that AI will replace the need for engineers. That orchestration will just happen. We see the opposite every single day. Every AI system that enters production needs coordination: retries, fallback logic, approval gates, observability, state management, and someone who understands what happens when things break at 3 AM and nothing is idempotent anymore. The more autonomous systems become, the more engineering rigor they require — not less.

**Kestra will not be replaced by AI. Kestra orchestrates your AI stack.** That's the lens everything below should be read through.

## How it started

Kestra started [six years ago](https://kestra.io/blogs/2022-02-01-kestra-opensource#the-history-of-kestra) as a one-person project — the biggest application I had ever built. This was before AI coding assistants. Every single line needed to be crafted with care and attention.

It was born out of real-world pain at the largest DIY retailer in Europe: Leroy Merlin. They had been struggling with Airflow for months and were stuck with no solution. All of these constraints led to some early technical compromises in the name of speed.

At the time, the only implementation of Kestra was built on top of Kafka, Kafka Streams, Elasticsearch, and a GCS bucket. Everything was designed for performance above all else.

The early results were encouraging. We delivered a first version that went from POC to trial, then to live production at [Leroy Merlin in 2020](https://kestra.io/blogs/2022-02-22-leroy-merlin-usage-kestra). Having a real design partner who gave daily feedback on real use cases was invaluable. But that also led to some trade-offs and shortcuts on the technical side, even more so for an [open-source project](https://kestra.io/blogs/2024-09-25-our-open-source-choices).

After the [open-source announcement](https://kestra.io/blogs/2022-02-01-kestra-opensource) (we had 40 stars back then — now multiply that by 666), we discovered that the product was genuinely attractive. We hit 2,500 [GitHub stars](https://github.com/kestra-io/kestra) in a single week. But we also heard pushback from users: deploying Kafka, Elasticsearch, a bucket, and Kestra was too complex for most people. So we [added a simple database version](https://kestra.io/blogs/2022-06-21-light-architecture) to make deployment easier. This drastically increased the traction of the open-source version.

Then came the second phase for Kestra: delivering on a wave of new use cases from the community, but now as a company. We grew the team to 10 people quickly after our first fundraising round. Each engineer brought great ideas, each new customer pushed us toward new features, and the product evolved to meet all of this daily.

## The road to 1.0

We continued on this road [toward our 1.0 goal](https://kestra.io/blogs/from-kestra-0-to-1), the most stable version of Kestra, while keeping one principle we had followed since day one: **no massive breaking changes inside the application.** Flow definitions are code that belongs to our users and customers, and they should not be forced to change. Of course, there were parts of the application we wanted to remove — some mistakes, some architectural decisions that were complex to maintain. But we held off on those changes so that our users could enjoy easy upgrades and our customers could rely on LTS versions with strong guarantees.

All of this, done for the sake of our customers, also held us back from innovating as freely as we wanted. And that tension is precisely what motivated us from the moment we shipped [Kestra 1.0](https://kestra.io/blogs/from-kestra-0-to-1): we knew we needed a version that would free us from those constraints.

## Why we're rebuilding the core

The architecture that got us here won't get us to the next order of magnitude. And that's fine — because that's engineering. You build for the constraints you have, and when those constraints change, you rebuild with everything you've learned.

There are three constraints we can't work around anymore.

### Two parallel implementations

One of the major pain points we saw from the engineering team was maintaining two parallel versions of everything: data stored in JDBC or Elasticsearch, and queues in JDBC or Kafka. The JDBC version was easy to install; the other brought performance and high availability. But inside the codebase, every single feature required two implementations. At our pace of delivery, this was becoming complex and costly to maintain.

The queue was tied to the database — Kafka required Elasticsearch, Postgres could only use its own queue implementation. The engineering team had to implement and maintain features across two separate systems. That stopped being a design choice and became a tax on everything we shipped.

### Kafka Streams past its limits

The Kafka Streams implementation was the most costly piece to maintain. While it was highly performant, Kafka Streams is fundamentally a streaming framework, far from a standard queue. We had used every feature it offers: group by key, count, sum, state stores, partitions — all of it. It was all stable and working, but it was also complex to maintain, and only a handful of experts in the company could work on it.

When a critical part of your infrastructure can only be maintained by three people, that's not stability. That's a warning sign.

### Workers tied to the database

Workers had a [direct connection to the database](/docs/architecture). That was the fast path, and it worked well, but our largest customers raised a key concern: *How can I deploy a worker in another region? I don't want to expose the database port over the internet.*

We didn't have a good answer. Complex network setups and hybrid deployments were effectively impossible. And that direct database connection had led us to take shortcuts inside some plugins — technical debt we've been carrying since the beginning.

## Kestra **2.0**: what's changing

Kestra **2.0** is a ground-up rearchitecture of the platform's core infrastructure. We're not releasing it today — we're deep in the work — but here's what's changing, why, and what it means for you.

### Re-architecting the queue

The first decision was clear: we needed a single implementation with thin adapters to abstract the connection to the underlying queues.

So we decided to replace the most costly piece to maintain: the Kafka Streams implementation. We took a step back and rebuilt the entire queuing layer around the simplest possible pattern: plain queueing. While this might sound like a step backward, it actually works better than ever. Decoupling services with queues is a pattern that has been around for decades and is proven to work for mission-critical applications.

In Kestra **2.0**, administrators can choose from multiple queue backends: **JDBC, Kafka, Redis, or AMQP**, with cloud-native options from AWS, GCP, and Azure on the roadmap. Queue and database choices are fully independent, so you can pick whatever matches your execution volume and existing tech stack. You can use JDBC for the data layer and Redis for queuing, or Elasticsearch for data and JDBC for the queue — whatever combination suits you.

We also took the opportunity to change how messages flow through the queue. We now send minimal information over the queue and use the database as the source of truth. This significantly reduces the load on the queuing systems.

What seems counterintuitive at first glance — having more queue options — is actually simpler to maintain. Most of the code is shared, and only a thin adapter layer needs to be developed and battle-tested for each backend. Regardless of the queue or database, we have a single implementation for the executor, scheduler, and worker, making feature development and bug fixes faster to ship and easier to maintain.

What we've learned over the past year is that orchestration needs vary widely depending on each organization's architecture. Some customers have a very large number of executions and need maximum throughput. Some have fewer executions but need high availability for regulatory compliance. And every customer has different levels of familiarity with these technologies. Asking people to conform to your software's architectural decisions is never easy, and it's even harder when they don't have the in-house knowledge to maintain the stack.

### Workers now speak gRPC

The architecture now cleanly separates the **control plane** (executor, scheduler, webserver) from the **data plane** (workers). Workers and API controller communicate through gRPC, making workers fully stateless and independently deployable — in segregated networks, deep in customer infrastructure, or across regions. gRPC is faster than HTTPS, improving performance especially for cross-region deployments.

The control plane and data plane scale independently. You can deploy a standalone instance (control plane only) without any workers, then scale workers separately based on actual workload — reducing the cost of underlying infrastructure. No more paying for full capacity just to run the scheduler.

This will also enable a **Bring Your Own Worker (BYOW)** model: customers on [Kestra Cloud](/cloud) will be able to manage the entire platform infrastructure while deploying their own workers on-premise or in their own cloud, keeping sensitive workloads running within their security perimeter.

The most challenging part of this change was that the old direct database connection had led us to take shortcuts inside some plugins. Many of those have been fully rewritten to remove the database dependency. But the deployment options are now far more flexible than anything we could offer before.

### Secure by design

With workers communicating exclusively over gRPC, there is no longer any direct database exposure to the data plane. All communication supports mTLS and service mesh, enabling fine-grained ACL and network policies for controlled access between components. Execution data flows through well-defined boundaries with clear ownership of executions, scheduling, and state.

Data lives in a single source of truth — easier to audit and govern. With BYOW, sensitive data never leaves the customer's network: workers execute locally while only communicating with the platform over secured gRPC.

The result is a clean architecture with clear boundaries — easier to reason about, scale, and evolve.

### Leaner execution context

We had long-standing issues with task outputs. Some could be large enough to slow down the entire application. Imagine an execution context containing 10 MB of data that gets read multiple times — on each state change. With a high execution count, the network latency could become unacceptable.

In Kestra **2.0**, we extract these outputs and fetch execution context on demand, using the database for the smallest payloads and internal storage for the largest ones. Execution outputs are stored based on a configurable threshold. This gives us the lowest possible latency even when execution data grows significantly, and it greatly reduces the load on the database.

As a bonus, the execution object itself is now smaller, which also noticeably improves UI responsiveness.

## What we're building next

The new architecture unlocks a pace of innovation that wasn't possible before. Here's where we're investing beyond the core engine.

**Observability that goes inside the box.** We're building a plugin-native interface that doesn't just tell you a workflow ran — it shows you what happened inside every integration. What happened, why it happened, where it slowed down, what depended on what. Execution becomes something you can reason about, not just monitor.

**Dedicated interfaces for different teams.** Data engineers, AI engineers, and platform teams have fundamentally different mental models. They deserve tools and context shaped for the work they actually do — not a one-size-fits-all dashboard. One platform, multiple views, each surfacing the right information for the job.

**A deeper plugin ecosystem.** [1,200+ integrations](/plugins) today, and every new plugin increases the value of all the others. We treat the plugin ecosystem with the same discipline as the core — tested daily, kept up to date, upgrades kept safe. We're making it easier for the community to build, share, and maintain them.

**Agentic orchestration.** A production AI workflow is never just a model call. It's data retrieval, model versioning, routing, guardrails, fallbacks, approval gates, retries, policy checks, and side effects written back into live systems — often with humans in the loop. That's orchestration. We've been building for this problem since day one, and the architecture we're putting in place with **2.0** is designed to make agentic workflows as reliable as any other mission-critical process.

**Kestra Cloud.** Our fully managed SaaS with usage-based pricing — the full platform with us operating the infrastructure. For teams that want to move fast without self-hosting, and with BYOW for those that need execution to stay within their own perimeter. [Request early access](/cloud).

## An engineering-first company

Building a high-throughput orchestration engine is distributed systems work.

You deal with state across workers, retries that must be idempotent, queues under backpressure, network partitions, slow downstream APIs, and partial execution: you have to design for all of it.

Because this kind of system can't be assembled. It has to be designed, debated, and built by people who understand the trade-offs. People who think about failure modes before they happen, not after. People who care about how systems behave under real load, not just in ideal conditions.

Kestra runs in environments we don't control: bare metal, restricted VPCs, arbitrary Kubernetes clusters. The system has to be understandable, inspectable, and robust enough to be debugged without us.

That's why we're [hiring](https://kestra.io/careers) more engineers than ever.

## The road ahead

[Kestra Cloud](/cloud) is available today. Kestra **2.0** is being built right now — to remove the constraints we now understand deeply. And we're [growing the engineering team](https://kestra.io/careers) to move at the pace this moment requires.

The AI era doesn't reduce the need for engineers. It raises the bar for what engineering has to handle. More automation means more coordination. More autonomy means more responsibility.

That's the future we're building for.

[**Come build it with us.**](https://kestra.io/careers)

If you have questions or feedback, come find us on [Slack](/slack).

*— Ludovic Dehon, CTO and Co-Founder of Kestra*
