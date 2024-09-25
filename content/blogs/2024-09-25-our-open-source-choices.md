---
title: "Lessons Learned from Turning an Open-Source Project into a Viable Business"
description: "TL;DR Kestra is an open-source orchestrator and after two years we raised $8 Million by being true to the open-source philosophy."
date: 2024-09-25T18:00:00
category: Company News
author:
  name: Ludovic Dehon
  image: "ldehon"
  role: "CTO & Co-Founder"
image: /blogs/2024-09-25-our-open-source-choices.jpg
---

Kestra was originally created as part of my consulting project for Leroy Merlin France. The client faced multiple challenges when adopting another data orchestration product — that platform didn't scale for their use cases, led to complex Python dependency management, and introduced a barrier to entry for BI engineers proficient in SQL and YAML. Kestra was born to address these issues and was [open-sourced](https://github.com/kestra-io/kestra) under Apache 2.0 license.

Today, we’ve grown to thousands of users and over 100 million workflows executed. Open source has been a vital part of our growth, and I’d like to share what we've learned, what worked and what didn’t. If you’re running an open-source project (or thinking about starting one), I hope this helps you in your journey.

---

## **On Launching Your Product**

### **What Worked: Open-Source from Day One**

Our biggest win was open-sourcing the product from the start. This step accelerated our growth in ways we couldn’t have achieved alone. The community played a huge role, contributing ideas and use cases we never expected—like using Kestra for real-time network monitoring and cloud infrastructure orchestration. Those contributions shaped Kestra into a more versatile product than we initially planned.

The open-source model also helped us build trust. Users could see the code, understand how it worked, and contribute back. Ultimately, this created a flywheel effect: more use cases led to more community adoption, which led to more growth.

### **What Didn’t Work: Following the Common VC Advice**

You probably know the common VC advice: “nail a niche before expanding.” Well, that advice wasn't the right one for us!

At first, we positioned ourselves as a data orchestration tool, comparing ourselves to the most popular tool in the category - Apache Airflow. We thought it would help, but it backfired. People started seeing Kestra as just another data tool, even though we built it to handle everything from CI/CD pipelines to IoT systems. Lesson learned: open yourself up to more possibilities, and don’t let a common VC mantra limit your vision. Focusing on addressing a narrow niche can be the right advice for most companies, but it wasn’t for us.

### **What We've Learned: You Can't Be a Yes-Man**

When working on an open-source project, you get all kinds of feature requests, complaints and ideas. Some ideas will be amazing and push your product forward — especially those around scalability, performance, and integrations. Feature requests of that kind are worth embracing because they unlock adoption in real-world teams.

But be careful not to lose focus. Some users might try to bend your project in a direction you never intended. In those cases, saying *no* is the right thing to do. In the end, you likely started an open-source project (and potentially a company) around a problem you are genuinely passionate about. The last thing you want is working day and night on a problem you don’t care about or not solving the problem you set out to solve because you got distracted by edge cases. Saying no is hard and can feel uncomfortable (it certainly does for me!), but it’s necessary to keep your project on track. Strike a balance between welcoming users and staying true to your core vision and don’t let edge cases pull you off course.

### **What Moved the Needle: Enterprise Adoption**

As Kestra gained traction, we noticed that many companies adopted it through the “backdoor” — teams started using it before it was officially approved internally. While this “shadow IT” adoption was flattering, it left us wondering: how do we move from silent usage to official, paid deals?

The key was delivering on enterprise needs: **security** (think SSO, RBAC, SCIM, Secrets management), **scalability** (hardening your product to handle large workloads and a really large number of them!), **observability** (making sure your product is easy to monitor and troubleshoot), and **governance** (giving Admins the right tools to centrally manage plugin and secrets configuration, preventing undesirable access patterns). These features aren’t optional if you want serious companies to consider you. And while some of these shadow users may never turn into paying customers (we often don’t even know who they are!), they still contribute to your growth and reputation.

---

## **On Making Technical Decisions**

![technical decisions](/blogs/2024-09-25-our-open-source-choices/technos.jpg)

### **Engineering vs. UX: Finding the Right Balance**

When we started, Kestra required both a Kafka and Elasticsearch cluster. Technically, this was ideal—high availability, no single point of failure, great for scaling. But it also made installation a nightmare for some users. If people can’t get your software running easily, they won’t stick around long enough to see the benefits.

We still believe in that architecture for long-term use at the Enterprise scale. Still, for people just trying out Kestra, a simple Docker container with a Postgres or MySQL setup made the initial experience a lot smoother. Easier setup → faster time to value → better community traction.

### **Accessibility vs. Flexibility: Why We Chose YAML**

When designing workflows, many orchestration tools require you to use a programming language like Python. We considered this to be a limiting factor. After weighing our options, we went with YAML, which has broad adoption for configuration files and is familiar to a wide range of users, from GitHub Actions to infrastructure as code.

Lessons learned: don’t reinvent the wheel. Stick with widely-used standards to make your product accessible to more people.

### **Java vs. Python: Why We Went Against the Grain**

Most data orchestrators are written in Python, but we chose Java. Why? Java’s ecosystem, combined with Kafka and Elasticsearch, gave us a strong foundation for performance, scalability, and durability. Java’s concurrency model and multi-threading support allowed us to scale Kestra across CI/CD pipelines, infrastructure orchestration, and real-time data processing.

Python is a popular choice for data orchestration frameworks, but Java gave us the flexibility to go broader — a critical decision as we didn’t want to be stuck in a niche.

---

### **Conclusion**

We’ve had wins, and we’ve had challenges, but staying open-source has been a critical driver of our growth. Hopefully, these insights help you on your open-source journey. As for us, we’re not slowing down — Kestra is evolving, and we’re working on a fully managed Cloud product.

**Check out our [GitHub repo](https://github.com/kestra-io/kestra) and give us a star if you like what we’re building! 🛡️**

Feel free to ask any questions about our tech decisions (good and bad), or where we’re heading next. We’d love to talk more about open source — it's been an incredible journey and we appreciate the open source community that’s been with us every step of the way.

 **Resources:**
- [Join the Kestra Slack Community](https://kestra.io/slack)
- Star us on [GitHub](https://github.com/kestra-io/kestra)!