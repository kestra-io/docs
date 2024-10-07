---
title: "3 years of Kestra, From Zero to 10,000 Stars on GitHub"
description: "To celebrate reaching 10,000 stars on GitHub, we’re looking back at Kestra’s journey — from its early days to becoming a unified orchestration platform."
date: 2024-10-0710T12:00:00
category: Company News
author:
  name: Ludovic Dehon
  image: "ldehon"
  role: "CTO & Co-Founder"
image: 
---

Before Kestra became what it is today, the idea started back in the early days of my career. I began as a self-taught developer about 20 years ago, mostly working with **PHP** like many other developers in France at the time. Over the years, I took on various roles, from working in startups to freelance gigs, always aiming to create products that could solve tricky technical problems.

Around **2010**, while I was at **Ankama**, I built an early version of what would eventually inspire **Kestra**. It was a simple tool to manage **distributed Cron jobs** — a way to monitor and control tasks across multiple servers. I called it CronDD as a reference to the well-known Unix cron jobs. It was a useful solution for scheduling tasks, but it was still far from the more flexible and scalable orchestrator that Kestra would become.

Fast forward to **2019**, and I was working at **Leroy Merlin France**. The company was in the middle of migrating from **Teradata** to **Google Cloud’s BigQuery**, and they needed a way to manage complex workflows that interacted with all kinds of data systems. **Airflow** was the obvious choice, but after spending months with it, I realized it wasn’t the right fit for Leroy Merlin’s needs. The way it worked, its security limitations, and the scalability issues meant it wouldn’t meet their requirements. That’s when I started to seriously think about building my own solution.

In my spare time, I began working on what would eventually become **Kestra**. It was a huge project to take on after hours, but the more I worked on it, the more I saw the value it would bring to Leroy Merlin and potentially other companies. By **2020**, Leroy Merlin was ready to use Kestra in production.

Leroy Merlin was dealing with a data architecture that was getting outdated and overly complex. They were using legacy tools like Teradata, VectorWise, and Stambia to manage pipelines, with **Dollar U** and **Automic Workload Automation** handling orchestration. The system was slow and dependent on manual processes, making it hard to keep up with competitors moving to the cloud.

## How Kestra Helped

Kestra was designed to tackle Leroy Merlin’s issues—**scalability, flexibility**, and making things easier for engineers across various teams. The idea was to build something that could handle their massive data operations but still be user-friendly for engineers from different teams, whether they worked in data, BI, or infrastructure.

After months of development and testing, Kestra went live at Leroy Merlin, and it transformed their workflows. What used to take multiple teams days to complete was now done in hours, with engineers able to manage their own workflows independently.

By **August 2020**, Leroy Merlin upgraded to the **Enterprise Edition of Kestra**, which brought even more features like role-based access control and advanced security, further improving their processes. Today, Kestra runs over **400,000 executions** and **3 million tasks** per month at Leroy Merlin, handling everything from real-time data transfers to long-running data science workflows.

## Growing the Team and Expanding

As Kestra gained traction, I reached out to **Emmanuel Darras**, a good friend and former CEO of **Ankama**, where I had worked before. Emmanuel had built **Ankama** into a successful company of over 500 people, and I knew his experience would be invaluable in scaling Kestra. After talking it over, he decided to join, and in **2021**, we officially founded the company. By **2022**, we had started hiring and growing the team.

Our goal from the start was to create an orchestration platform that was simple to adopt but powerful enough to handle complex workflows. One of our first decisions was to use **YAML** for defining workflows. We didn’t want developers to have to learn a new language just to use Kestra, so we went with a **declarative** approach: you tell Kestra what needs to happen, and it takes care of the rest. **YAML** was also becoming the go-to configuration format across industries, so it was the natural choice.

## Early Milestones: GitHub, Hacker News, and InfoQ

Our first big milestone was Kestra’s public release. The feedback was incredible when we shared it on Hacker News, and that helped us gain attention from developers and companies around the world. An article on **InfoQ** followed, which brought even more visibility and credibility to Kestra. By the time we raised our **pre-seed funding**, it was clear that Kestra was evolving beyond just a data orchestration tool — it was a flexible platform that could handle all kinds of use cases, from data pipelines to operational workflows.

### One Platform for Company-Wide Orchestration

One of the strengths of Kestra is in how it brings everyone together. While other tools focus on specific areas such as data pipelines, ML workflows, or business processes, we wanted Kestra to be able to provide a more unified solution. Whether you’re running **ETL jobs**, managing infrastructure, or handling business processes, Kestra can orchestrate it.

We designed Kestra to be **language-agnostic**, meaning you can run tasks in **Java**, **Python**, **Go**, **JavaScript**, and more. By integrating with **Docker**, we made it easy to run highly specialized workflows, whether they’re in **Go** for performance reasons or in **R** for data science tasks.

## Plugins for Flexibility

One of the things that makes Kestra stand out is its **plugin system**. We wanted the platform to work with a wide range of technologies, so we built it to be easily extendable. Today, Kestra has over **535 plugins**, with more on the roadmap.

Creating a plugin for Kestra is straightforward. We provide templates, so that anyone with basic **Java skills** can get started quickly. Most plugins are about 80% done just by following the **Quick Start guide**. We also run nightly tests on all plugins to make sure everything is up to date with any changes in technologies or APIs.

We’ve kept control of core plugins to ensure quality, and we also maintain community-contributed plugins to avoid issues with outdated or low-quality code.

---

## Open Source and Enterprise Ready

At its core, Kestra is an open-source project. We’ve always believed that open-source is key to our growth, and we continue to evolve based on feedback from the community. While we do offer an **Enterprise version** with advanced features, the open-source version of Kestra is also capable of running in single-player production environments.

The open-source nature of Kestra has allowed us to reach users all over the world, including places like China, where large companies have been using Kestra for years without ever contacting us directly. We might not convert every user into an enterprise customer, but the reach and credibility we gain from open-source adoption means a lot to us.

To meet the needs of larger organizations, Kestra is fully **scalable** and **distributed**. We’ve split the system into microservices, with each service capable of scaling to handle a variety of workloads. For teams with specific infrastructure needs, we offer **worker groups**, allowing tasks to run on specialized hardware, like **GPU** or **Windows-based** environments.

We’ve also added **task runners** in our Enterprise version, which allow users to delegate the execution of tasks to remote engines like **Kubernetes**, **AWS Batch**, **Azure Batch**, **Google Batch**, or **Cloud Run**. This enables users to take advantage of **serverless** execution when necessary, while still keeping the core system performant for high-throughput workloads.

---

## What’s Next?

As we look ahead, we want to make Kestra the go-to tool for orchestration across industries. We’re not just focused on data orchestration — we’re building a platform that can manage all workflows from **business processes** to **infrastructure automation**.

While our team is growing and our cloud offering is in **private Beta**, we’re taking our time to make sure we get it right. The goal is to offer a reliable, secure, and performant cloud service that can accommodate the needs of any organization, from startups to enterprises.

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).
If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
