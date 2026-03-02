---
title: ERP Transformation Smarter, Faster, Fully Automated
description: This is the story of how FILA, a global leader in sportswear,
  orchestrates complex ERP and supply chain workflows across continents using
  Kestra.
metaTitle: "Fila & Kestra: ERP Transformation Smarter, Faster, Fully Automated"
metaDescription: This is the story of how FILA, a global leader in sportswear,
  orchestrates complex ERP and supply chain workflows across continents using
  Kestra.
heroImage: ./hero.png
featuredImage: ./hero.png
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.docker.Build
  - io.kestra.plugin.jdbc.mariadb.Query
  - io.kestra.plugin.notifications.teams.TeamsIncomingWebhook
  - io.kestra.plugin.scripts.node.Script
  - io.kestra.plugin.scripts.powershell.Script
  - io.kestra.plugin.jdbc.mysql.Query
kpi1: |-
  ##### 2.5 Million
  Monthly Executions
kpi2: |-
  ##### 2000+ 
  Workflows
kpi3: |-
  ##### 25+
  Engineers working with Kestra
quote: Kestra has changed how we handle data orchestration. Instead of spending
  days fixing issues, we now have full visibility and control. As we scale,
  having a system that grows with us is invaluable
quotePerson: John Kim
quotePersonTitle: IT Lead
industry: Retail & Manufacturing
headquarter: Seoul, South Korea
solution: Fila has evolved into a global sportswear brand, known for its
  high-quality and stylish clothing and accessories.
companyName: Fila
---

FILA is a world-renowned sportswear brand with a legacy spanning over a century. Founded in Italy in 1911 and now headquartered in South Korea, FILA has become a global leader in athletic and lifestyle apparel, footwear, and accessories. With a presence in over 70 countries, the brand is known for blending performance and style, serving professional athletes, casual wearers, and fashion-forward consumers.

Behind its expansive product catalog and vast distribution network lies a complex supply chain that must integrate its Product Lifecycle Management (PLM) and Enterprise Resource Planning (ERP) systems. To support its continuous growth and innovation, FILA relies on a robust, scalable, and highly automated IT infrastructure that ensures operational efficiency across its global operations.

At the heart of this transformation, Kestra serves as a core orchestration layer, enabling FILA to automate and manage mission-critical workflows. With 25+ engineers managing Kestra workflows, executing over 3 million workflows per month, and maintaining 2000+ active workflows, FILA has streamlined its supply chain processes and improved system resilience.

## FILA’s Challenge: Managing Complex ERP and Supply Chain Integrations

FILA is undergoing a major digital transformation of its Product Lifecycle Management (PLM) and Enterprise Resource Planning (ERP) systems. As part of this multi-year initiative, beginning at their South Korean headquarters, they required an orchestration solution capable of synchronizing data between their PLM and downstream SQL Server databases while ensuring data consistency, scalability, and error recovery.

Manual batch scripts and traditional integrations were insufficient due to frequent schema changes, slow deployment cycles, and increasing operational complexity. They needed a resilient solution that could efficiently orchestrate workflows, handle errors, and scale as the company expanded into new markets like North America and other Asian regions.

## Why FILA Chose Kestra

After evaluating multiple orchestration tools, including Apache Airflow and Apache NiFi, FILA selected Kestra for its scalability, extensive plugin ecosystem, and API-first architecture. Kestra provided the flexibility and control required to build an efficient data pipeline orchestration layer without adding unnecessary operational overhead.

"_We looked at Airflow and NiFi, but Kestra’s architecture made the most sense for us in terms of scalability. The wide range of plugins and the ability to integrate with our systems was a key factor in our decision._" 
— **John Kim, IT Lead, FILA**

### Building Reliable Data Orchestration with Kestra

FILA’s ERP migration requires **data synchronization across multiple systems** while ensuring stability. Kestra’s **event-driven architecture** plays a key role in maintaining the correct execution order for tasks. This ensures that data flows row-by-row in a transactional manner, preventing inconsistencies. Each execution is stored, allowing FILA to **replay failed** **executions and recover from errors** when needed easily.

"_One of our workflows isn’t just about moving data from one database to another. It involves reading from a source database, downloading and uploading files across servers, calling multiple APIs, and inserting data into the final destination. Kestra's event-driven model ensures each step happens correctly and automatically retries when issues occur. This is critical for us because so many external systems are involved._" 
— **John Kim, IT Lead, FILA**

### Leveraging Kestra’s API-First Approach for Automation

Kestra’s **API-first design** allows FILA to integrate workflow automation into its broader ecosystem. Rather than manually building workflows, John Kim and his team developed a **middleware service** that connects to their database, reads schemas, and automatically generates queries. This service then constructs JSON-based workflow definitions, which are pushed to Kestra for execution.

"_Kestra doesn’t generate workflows automatically, but its API-first approach allowed me to build automation on top of it. We now have a system that dynamically creates workflows for standard database integrations, making deployment across different regions much faster._"
— **John Kim**

### Enhancing Monitoring and Error Handling

With **Kestra’s execution context**, FILA ensures that every step of their workflows is fully traceable. If an issue arises, engineers can track the execution ID, inspect logs, and pinpoint where the error occurred. This visibility allows them to modify logic and **replay executions seamlessly**, preventing data loss and minimizing operational disruptions.

"_In our ERP, even a single corrupted row can trigger a chain of failures down the line. With Kestra, I can trace every execution, see exactly where things went wrong, and rerun the workflow after fixing the issue. This level of control is something I didn’t have before._"
 — **John Kim**

To improve incident response, FILA has also set up **automated monitoring**. If a task fails, Kestra triggers an alert on Microsoft Teams, providing a direct link to the failed execution. Additionally, workflows that run longer than expected due to database locks or other issues are automatically terminated and restarted.

"_If a workflow gets stuck, I don’t have to manually intervene. Our system detects long-running jobs, kills them, and retries. This kind of automation significantly reduces downtime and improves operational efficiency._" 
— **John Kim**

### **Scaling Operations with Kestra**

As FILA expands into **North America and Asia**, they need a workflow orchestration platform that supports global scaling. Kestra’s **flexibility and reliability** enable FILA to deploy workflows across multiple locations while adapting to regional compliance requirements. By leveraging Kestra’s capabilities, FILA maintains a **consistent and efficient ERP data flow** across different business units.

"_Scaling our operations used to be a challenge. With Kestra, we now have a reliable orchestration layer that adapts to different environments, ensuring smooth integration as we expand internationally._"
— **John Kim**

### Conclusion

FILA continues to deepen its automation strategy with Kestra, exploring **new use cases beyond ERP**, such as inventory management and supply chain optimization. The ability to **track, monitor, and replay executions** ensures that critical business processes remain stable and resilient, even as operational complexity grows.

"_Kestra has changed how we handle data orchestration. Instead of spending days fixing issues, we now have full visibility and control. As we scale, having a system that grows with us is invaluable._"
— **John Kim**

Kestra remains a **key pillar** in FILA’s digital transformation, helping them **orchestrate complex workflows with confidence and efficiency.**
