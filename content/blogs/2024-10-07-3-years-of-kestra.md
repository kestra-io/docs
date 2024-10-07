---
title: "3 years of Kestra, where we are from and where we go"
description: "This is the first time we, has Co-Founders, share the journey of Kestra from its beginning to the future we envision for Orchestration"
date: 2024-10-0710T12:00:00
category: Company News
author:
  name: Ludovic Dehon
  image: "ldehon"
  role: "CTO & Co-Founder"
image: 
---
This is the first time we, has Co-Founders, share the journey of Kestra from its beginning to the future we envision for Orchestration

Before Kestra officially became what it is today, its roots began in my early career. I started as a self-taught developer about 20 years ago, working mainly with **PHP**, like many developers in France who were building websites at the time. Over time, I transitioned through various roles, including working in startups and doing freelance projects. My goal was always to create products that could solve complex technical problems.

Around **2010**, while working at **Ankama**, I created the first version of what would later inspire **Kestra**. It was a simple solution to manage **distributed Cron jobs**, allowing monitoring and control of tasks across multiple servers. At the time, I called it **CronDD**, a reference to the traditional Unix **cron** jobs. The idea was to define and monitor scheduled tasks in a distributed way, but it was still a far cry from what Kestra would eventually become.

Fast forward to **2019**, when I was at **Leroy Merlin France**. The company was migrating from **Terradata** to **Google Cloud's BigQuery**, and they needed a way to orchestrate complex workflows that interacted with a variety of data systems. **Airflow** was the obvious choice, given that it had become the leader in the orchestration space. But after spending few months analyzing it, I realized it wouldn’t fit the use cases of Leroy Merlin, the philosophy of dag defined in Python, the high constraint of security, and scalabilities needed was not meet. That’s when I started to seriously consider building my own orchestrator.

In the evenings and on weekends, I began developing what would become **Kestra**. Starting such a huge project after working hours seems scary, I knew that the road to reach something usable would be long, but the more I worked on it, the clearer it became that there was a real need for a more flexible, scalable orchestrator that wasn’t limited by the design choices Airflow had made. By **2020**, Leroy Merlin was ready to go into production with Kestra, even though I was still the only person working on it at the time.

At that time, Leroy Merlin was facing multiple challenges with their existing data architecture, which relied on legacy tools like Teradata, VectorWise, and Stambia for managing pipelines, with **Dollar U** and **Automic Workload Automation** for orchestration. The system was becoming increasingly outdated, and extremely complex with multiple team dependencies, especially as competitors were making swift moves to the cloud. Their data orchestration, in particular, was hindered by rigid manual processes and limited cloud connectivity.

That’s when I decided to build something better.

## Kestra to the Rescue

Kestra was designed to solve the exact pain points Leroy Merlin was facing: **scalability, flexibility, and ease of use** for engineers across various teams. The goal was to create something that could handle the scale of Leroy Merlin’s data operations, while being simple enough for any engineer—whether they specialized in data, BI, or infrastructure—to use without a steep learning curve.

After several months of development and testing, Leroy Merlin adopted Kestra, and it quickly transformed their orchestration processes. What previously required multiple teams, complex workflows, and days of waiting was now reduced to hours, with engineers empowered to manage their own workflows autonomously.

By **August 2020**, Leroy Merlin upgraded to the **Enterprise Edition of Kestra**, unlocking even more features like role-based access control and advanced security, further streamlining their operations.

Today, Kestra powers over **400,000 executions** and **3 million tasks** per month for Leroy Merlin, orchestrating everything from real-time data transfers to long-running data science workflows with incredible efficiency.

## Scaling the Team and Building the Vision

As the project grew, I reached out to **Emmanuel Darras**, the former CEO of **Ankama** and a good friend who had hired me in the past. Emmanuel had built **Ankama** into a company of over 500 people with the success of the game **Dofus**, and I knew he had the experience and vision to help Kestra scale. After discussing the project, he agreed to join me, and we officially created the company in **2021**. Together, we set out to build a platform that could solve orchestration challenges at any scale, and by **2022**, we had our first employees and began to grow the team.

Kestra’s philosophy from the start was to build a tool that made **workflow orchestration simple**, yet powerful. We didn’t want it to be a niche product for a small group of engineers. Instead, we wanted Kestra to be **easy to adopt** while still being flexible enough to handle the most complex workflows.

One of the core decisions we made early on was to use **YAML** for defining workflows. While some see YAML as just configuration, we saw it as a way to lower the barrier for entry. Inspired by tools like **Terraform** and **GitHub Actions**, we wanted Kestra to be a platform that developers could use without needing to learn a new programming language. That’s why Kestra is **declarative**—you declare what you want to happen, and the platform handles the execution. YAML was also a natural choice because it was already becoming the standard for configuration across many industries, especially with the rise of **Kubernetes** and **CI/CD pipelines**.

## Early Wins: GitHub, Hacker News, and InfoQ

Our first milestone as a company was the public release of Kestra. The response was overwhelmingly positive when we shared the project on Hacker News. That initial success brought us attention from developers and companies around the world, solidifying our belief that we were building something special.

A second boost came from an article on **InfoQ**, which further expanded our reach and helped Kestra gain credibility in the tech community. By the time we raised our **pre-seed** funding, it was clear that Kestra was evolving beyond just a data orchestration tool — we were creating a flexible platform that could handle a wide variety of use cases, from complex data pipelines to operational workflows.

### A Unified Approach to Orchestration

The real power of Kestra lies in its **unified orchestration**. While many of our competitors focus on specific use cases—like orchestration for data pipelines, ML pipelines, or Business workflows—our goal is to provide a platform that can handle any type of workflow, regardless of the technology or use case. This means that whether you're orchestrating **ETL jobs**, managing **infrastructure with Terraform**, or handling **business processes**, Kestra can do it all.

We’ve worked hard to ensure that Kestra is **language-agnostic**. You can run tasks in **Java**, **Python**, **Go**, **JavaScript**, or any other language. We achieved this by building tight integrations with **Docker** and leveraging containerization to isolate task executions. In fact, many of our clients are running highly specialized workflows, using languages like **Go** for performance-critical tasks. One of our clients even migrated all their processes from **Python to Go**, integrating it with Kestra to handle the orchestration.

## Leveraging Plugins for Flexibility

One of Kestra’s biggest strengths is the flexibility provided by our **plugin system**. When building Kestra, we wanted to ensure it could easily interact with a wide variety of technologies and ecosystems. That’s why we designed the platform with an architecture that makes it easy to create and extend plugins. Today, Kestra has **over 535 plugins**, and we’re aiming to double that number in the near future.

Creating a plugin for Kestra is straightforward. We provide templates that make it simple for any **Java developer** to get started. In most cases, a plugin is 80% complete just by copying the **Quick Start guide** from the technology it’s integrating with. The heavy lifting happens behind the scenes, so the complexity is abstracted away from the developer. We also ensure high quality by running **nightly tests** on all plugins, checking for changes in technology or API updates.

We’ve designed Kestra in such a way that users can interact with any technology through plugins, whether it's **cloud services**, **databases**, or even **custom in-house systems**. One of the major architectural choices we made was to normalize data exchange between tasks using **Amazon Ion**, a format that extends JSON but includes native support for data types like **date**, **time**, and **timestamps** with time zones. This makes sure that data is typed correctly and managed efficiently across tasks. It’s 2024, and it’s no longer acceptable for dates to be strings!

We didn’t over-engineer the system either. While we use typed data formats like Ion, we don’t require users to define strict schemas (like Avro, Json Schema, ...) between tasks. This was a deliberate decision. We wanted to keep Kestra flexible and easy to use without adding unnecessary complexity. If users need strict data quality control, we provide plugins to handle that, but it’s not enforced by default.

We’ve always maintained control over our core plugins to ensure quality. When community members contribute a plugin, we review it, merge it into the core if it fits, and then take over its long-term maintenance. This approach helps us avoid the risks that come with community-contributed plugins becoming outdated or inconsistent in quality.

---

## Open Source  at Core and Enterprise Ready

Our open-source philosophy is in Kestra’s DNA. The open-source community is essential to our growth, and we continue to listen and evolve based on their feedback. Kestra is designed to be **open-source first**, which means that even though we offer an **Enterprise version** with features like **SSO, secret management,** and **advanced scalability options**, anyone can run the open-source version in production.

Despite the challenges of balancing **open-source** and **commercial** strategies, we strongly believe in the benefits of open-source. It has allowed us to reach a global audience and gain adoption in industries we might never have touched otherwise. For example, we know that large companies in China have been using Kestra for years without ever contacting us directly. This is part of the nature of open-source, and while we might not convert every user to an Enterprise customer, the visibility and validation we gain through widespread usage is invaluable.

---

To meet these enterprise demands, Kestra is fully **scalable** and **distributed**. We’ve split the system into microservices, with a **Scheduler**, an **Executor**, and **Workers** that can run across multiple environments. Each service can scale both **horizontally** and **vertically** to handle varying workloads. For organizations with unique infrastructure requirements, we also offer **worker groups**, which allow specific tasks to be run on specialized hardware, like **GPU** or **Windows-based** environments.

We’ve also added **task runners** in our Enterprise version, which allow users to delegate the execution of tasks to remote engines like **Kubernetes**, **AWS Batch**, **Azure Batch**, **Google Batch**, or **Cloud Run**. This enables users to take advantage of **serverless** execution when necessary, while still keeping the core system performant for high-throughput workloads.

---

## Building for the Future

Looking ahead, our ambition is to make Kestra the go-to tool for workflow orchestration across industries. We don’t want to be known as just a **data orchestrator**. Instead, our vision is to create a **category leader**—a platform that can orchestrate everything, from **business processes** to **infrastructure automation**.

While we’ve grown quickly, with a team nearing **20 people**, we’re far from finished. We’re continuing to build out Kestra’s capabilities, and part of that includes expanding our **Cloud offering**. Right now, we have a **private beta** of Kestra Cloud, where we’re working with select customers to ensure it meets their needs. The challenge with running Kestra in the cloud is that it needs to handle an incredibly diverse range of workloads, from high-memory tasks to network-heavy operations. We’re taking our time to get it right because we want to offer a **reliable, secure, and performant** cloud service that can scale with any workload.

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).
If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::