---
title: "Insurance Digital Transformation: Modernizing Legacy Core Systems"
description: "Insurance digital transformation rarely starts by replacing the core system. It means orchestrating around it: connecting legacy platforms to cloud data, AI services, and compliance workflows, without a costly rip-and-replace programme."
metaTitle: "Insurance Digital Transformation: Modernizing Legacy Systems"
metaDescription: "Insurance digital transformation without rip-and-replace: orchestrate legacy core systems with cloud data, AI services, and compliance workflows."
tag: business
date: 2026-09-17
slug: "insurance-digital-transformation"
faq:
  - question: "What is digital transformation in insurance?"
    answer: "Digital transformation in insurance involves using technology to improve customer experience, simplify operations, and develop new products. For insurers, this often means modernizing processes and systems while working within the constraints of existing core platforms and stringent regulatory requirements."
  - question: "What are the 5 pillars of digital transformation?"
    answer: "While frameworks vary, common pillars of digital transformation include customer experience, operational agility, workforce enablement, digital technology integration, and innovation. For insurance, these pillars are often supported by strategic orchestration that bridges legacy systems with modern capabilities."
  - question: "What are the four types of digital transformation?"
    answer: "Digital transformation typically encompasses four types: process transformation (optimizing operations), business model transformation (creating new value propositions), domain transformation (entering new markets), and cultural transformation (shifting organizational mindset). Each requires careful orchestration to succeed in the insurance sector."
  - question: "What are the key technology trends for the insurance industry in 2026?"
    answer: "Key technology trends for insurance in 2026 include widespread adoption of AI and machine learning for underwriting and claims, advanced data analytics, cloud-native architectures, and orchestration platforms that connect hybrid on-premise to cloud operations and ensure regulatory compliance."
  - question: "How do you modernise insurance legacy systems without replacing the core?"
    answer: "Modernizing insurance legacy systems without replacing the core involves a 'strangler-fig' approach. This means building new digital capabilities and workflows around the existing core system, using an orchestration layer to integrate new technologies like AI and cloud data platforms, while gradually reducing reliance on the legacy platform."
---

> **TL;DR** — Insurance digital transformation rarely starts with replacing the policy or claims core. It means orchestrating around it: connecting the legacy platform to cloud data, AI services, and compliance workflows through declarative, versioned pipelines, so new capabilities ship without a rip-and-replace programme and every regulated step stays auditable.

Insurance digital transformation often feels like an impossible mission, especially when faced with core systems that have powered operations for decades. The promise of agility and innovation clashes with the reality of costly, high-risk "rip-and-replace" projects that frequently stall. Instead of a wholesale overhaul, a more pragmatic approach is emerging: modernizing *around* the core. This article explores how a flexible orchestration layer can connect legacy insurance platforms with modern cloud infrastructure and AI, enabling true transformation without the existential threat of replacing your most critical systems.

## Why Legacy Systems Stall Insurance Digital Transformation

The primary obstacle to transformation isn't a lack of vision; it's the operational reality of the existing IT landscape. Insurers run on a complex mix of core platforms, custom code, and legacy schedulers that are deeply embedded in daily operations.

Core platforms like Guidewire, Duck Creek, and Majesco are the systems of record for policies, claims, and billing. They are stable and feature-rich, but they weren't designed for the agility modern digital services require. Over years, business processes have conformed to the software's limitations, not the other way around. This has led to "brittle custom code and technical debt built around Guidewire integration," as one insurer described it.

Surrounding these core systems is a constellation of older technologies. Many insurers still rely on legacy [job scheduling software](/resources/infrastructure/job-scheduling-software) like Control-M, HCL Domino, or basic Windows Task Scheduler to run critical batch processes. These tools often lack the visibility, error handling, and modern integration capabilities needed for a hybrid cloud world. This fragmentation creates data silos, requiring "20 to 200 hours to pull basic data for business users," according to one insurance client. The result is a slow, manual, and fragile environment where true transformation is perpetually out of reach.

## Orchestration as the Bridge: Modernizing Around the Core

Instead of a high-risk replacement project, leading insurers are adopting a "strangler-fig" pattern. This approach uses a central orchestration layer to build new capabilities that gradually envelop and replace legacy functions.

This model enables hybrid orchestration, connecting on-premise core applications to modern [cloud orchestration tools](/resources/infrastructure/cloud-orchestration-tools). For example, a workflow can securely extract claims data from an on-premise Guidewire instance, process it in a cloud data platform like Snowflake or Microsoft Fabric, and push insights back to business users. This allows for multi-layer data modernization—creating bronze, silver, and gold data tiers for analytics without disrupting the core system.

An orchestration platform also replaces brittle, custom integration scripts with declarative, version-controlled workflows. This makes processes transparent, auditable, and easier to maintain. It also becomes the deterministic bridge for AI. As insurers adopt [AI orchestration](/resources/ai/ai-orchestration) for tasks like fraud detection or underwriting assistance, the orchestrator translates the probabilistic outputs of LLMs into the deterministic, auditable commands that core systems require. This [event-driven orchestration](/resources/infrastructure/event-driven-orchestration) allows for real-time responsiveness while maintaining control and compliance.

## Orchestrate Insurance Workflows with Kestra: An Approval & Data Pipeline Example

A common challenge in insurance is modernizing the claims process. This involves extracting data from a legacy system, enriching it with AI, ensuring human oversight for compliance, and updating a modern data warehouse for analytics. A declarative workflow can automate and govern this entire process.

Here is a Kestra flow that accomplishes this:

```yaml
id: insurance-claims-processing
namespace: com.insurance.claims

tasks:
  - id: extract-legacy-claims
    type: io.kestra.plugin.scripts.shell.Commands
    description: "Simulates extracting new claims data from a legacy system via a secure file transfer or CLI."
    commands:
      - echo "Extracting claims data from mainframe..."
      - cat claims_data.csv > {{ outputFiles.claims_data }}
    outputFiles:
      - claims_data

  - id: prepare-data-for-ai
    type: io.kestra.plugin.scripts.python.Script
    description: "Parses and prepares the claims data for AI analysis."
    inputFiles:
      data.csv: "{{ outputs['extract-legacy-claims'].outputFiles.claims_data }}"
    script: |
      import pandas as pd
      df = pd.read_csv('data.csv')
      # Transformation logic here
      print(f"Prepared {len(df)} claims for AI enrichment.")

  - id: ai-fraud-detection
    type: io.kestra.plugin.ai.completion.ChatCompletion
    description: "Uses an AI model to analyze claims for potential fraud indicators."
    provider:
      type: io.kestra.plugin.ai.provider.OpenAI
      apiKey: "{{ secret('OPENAI_API_KEY') }}"
      model: "gpt-4o"
    messages:
      - role: SYSTEM
        content: "You are a fraud detection expert for an insurance company. Analyze the following claims data and flag any suspicious entries with a brief explanation. Respond in JSON format."
      - role: USER
        content: "Claims data: {{ inputs.claims_data }}"

  - id: human-review-and-approval
    type: io.kestra.plugin.core.flow.Pause
    description: "Pauses the workflow for a human to review the AI's findings and approve or reject the claim batch."
    timeout: PT3H

  - id: update-data-warehouse
    type: io.kestra.plugin.jdbc.postgresql.Query
    description: "Updates the cloud data warehouse with the processed and approved claims data."
    if: "{{ outputs['human-review-and-approval'].resumed.status == 'SUCCESS' }}"
    url: "{{ secret('POSTGRES_URL') }}"
    username: "{{ secret('POSTGRES_USER') }}"
    password: "{{ secret('POSTGRES_PASSWORD') }}"
    sql: |
      -- SQL statement to UPSERT claims data
      INSERT INTO claims_processed (claim_id, status, fraud_score)
      VALUES (..., 'approved', ...)
      ON CONFLICT (claim_id) DO UPDATE SET status = 'approved';

errors:
  - id: send-failure-alert
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {
        "text": "Insurance claims processing workflow failed at task `{{ task.id }}` with error: `{{ error.message }}`"
      }
```

A few things are worth noticing in this workflow:
*   **Declarative & Auditable:** The entire process is defined in a single YAML file. This makes it easy to version in Git, review changes, and provide a clear audit trail for regulators.
*   **Human-in-the-Loop:** The `Pause` task creates a mandatory review point. This ensures that while AI provides valuable analysis, a human expert makes the final decision, which is critical for compliance and accountability. You can find more patterns for [approval processes in the documentation](/docs/use-cases/approval-processes).
*   **Polyglot Execution:** The workflow combines a shell command (for legacy interaction), a Python script (for data manipulation), an AI service call, and a SQL query. Teams can use the best tool for each job without complex glue code.
*   **Automated Error Handling:** The `errors` block automatically triggers an alert if any task fails, ensuring that operations teams are immediately notified of issues, improving reliability and response times.

## Ensuring Governance and Compliance in Regulated Environments

For insurers, transformation is not just about technology; it's about maintaining trust and meeting stringent regulatory requirements. An orchestration platform provides the necessary guardrails.

Every action, decision, and data movement within a workflow is recorded, creating immutable [audit logs](/docs/enterprise/governance/audit-logs) for regulators. This centralized visibility simplifies preparation for annual compliance and financial audits, reducing both effort and stress. For insurers operating across borders, workflows can be designed to enforce region-specific compliance rules automatically.

A central orchestration layer also helps avoid vendor lock-in. By abstracting the interaction with specific AI models or data platforms into standardized tasks, you can swap out a vendor—for instance, changing from OpenAI to Anthropic—by changing a few lines of configuration, not by rebuilding the entire workflow. This architectural freedom is essential for long-term strategic agility.

## Building a Transformation Roadmap That Survives Contact with IT

A successful digital transformation program in insurance is incremental and pragmatic. Instead of a multi-year, big-bang project, the focus should be on delivering value quickly in a single domain, such as claims processing or underwriting, and then expanding from there.

1.  **Start Small:** Identify a high-impact, low-risk process that is currently manual or running on a legacy scheduler.
2.  **Instrument First:** Before automating, ensure you have visibility into the existing process. A modern orchestration platform provides the observability needed to understand performance and identify bottlenecks.
3.  **Involve Teams:** Change management is critical. Bring operations and business teams into the process early, using the visual and declarative nature of modern workflows to build shared understanding and ownership.
4.  **Iterate and Expand:** Once the initial workflow is delivering value, use it as a blueprint to tackle adjacent processes, building momentum and demonstrating the benefits of a modern, orchestrated approach.

## Related concepts

*   [Declarative Orchestration for Modern Data Engineers](/data)
*   [Orchestrate Your Entire Infrastructure from One Control Plane](/infra-automation)
*   [Stop writing glue code around your AI pipelines.](/ai-automation)
*   [DORA Compliance Guide for Digital Resilience](/resources/infrastructure/dora-compliance)
*   [Fila & Kestra: ERP Transformation Smarter, Faster, Fully Automated](/customers/fila)
*   [dbt vs SQLMesh: Modern Data Transformation Tools](/resources/data/dbt-vs-sqlmesh)

Getting started with a modern approach to insurance digital transformation doesn't have to be a monumental task. By focusing on orchestration as the bridge between your legacy core and modern capabilities, you can build a resilient, compliant, and agile foundation for the future.
