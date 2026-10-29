---
title: "IT General Controls (ITGC): A Guide to Compliance and Automation"
description: "What IT General Controls (ITGC) are, the four domains auditors test (access, change, development, operations), how they relate to SOX, and how to automate change and access controls with an audit trail."
metaTitle: "IT General Controls (ITGC): Compliance & Automation Guide"
metaDescription: "IT General Controls (ITGC) cover access, change management, development, and operations. Learn what auditors test and how to automate ITGC with an audit trail."
tag: "infrastructure"
date: 2026-10-21
slug: "itgc"
faq:
  - question: "What are IT General Controls (ITGCs)?"
    answer: "IT General Controls (ITGCs) are foundational policies and procedures that ensure the proper operation of an organization's information technology systems. They cover aspects like access security, change management, and data center operations, providing a reliable basis for all other IT controls and ultimately safeguarding data integrity and system availability."
  - question: "What are the types of IT controls in an audit?"
    answer: "Auditors usually distinguish IT general controls (ITGCs), which apply across systems, from application controls, which are built into a specific application. Controls are also classified by purpose: preventive controls stop an error or misuse from happening, detective controls find it afterwards, and corrective controls fix it. A given control, such as an access review, is both an ITGC and detective."
  - question: "What is SOX ITGC testing?"
    answer: "SOX ITGC testing involves evaluating an organization's IT General Controls for effectiveness and compliance with the Sarbanes-Oxley Act. This testing ensures that IT systems supporting financial reporting are reliable, secure, and accurate, covering areas like logical access, program changes, and computer operations to prevent material misstatements."
  - question: "What are the five steps of the ITGC process?"
    answer: "The ITGC process typically involves five key steps: identification of relevant IT risks, design and documentation of controls, implementation of the controls, regular testing and monitoring of control effectiveness, and continuous improvement based on audit findings and evolving risks. This iterative process ensures ongoing compliance and security."
  - question: "What are the four pillars of IT General Controls (ITGC)?"
    answer: "The four ITGC domains most audit programs test are access to programs and data (who can read or change what), program changes (how changes are requested, approved, tested, and deployed), program development (how new systems are built and implemented), and computer operations (job scheduling, backups, and incident handling). Physical security of data centers is usually covered under access."
  - question: "What are the 5 C's of auditing?"
    answer: "The 5 C's of auditing are typically used to evaluate control deficiencies: Condition (what is the problem?), Criteria (what should be?), Cause (why did it happen?), Consequence (what is the impact?), and Corrective Action (what needs to be done?). These elements help auditors systematically describe and address control weaknesses."
  - question: "How do ITGCs differ from application controls?"
    answer: "ITGCs are broad controls applied across the entire IT environment, such as network security or data center management. Application controls, in contrast, are embedded within specific software applications to ensure the integrity of transactions and data processed by that application, like input validation or segregation of duties within an ERP system."
  - question: "Why automate ITGCs?"
    answer: "Manual controls depend on people remembering to follow the procedure and on screenshots as evidence. Automated controls run the same way every time and produce their own evidence: who requested a change, who approved it, when it ran, and what it changed. That makes testing faster for auditors and reduces findings caused by missing evidence."
---

> **TL;DR** — IT General Controls (ITGCs) are the controls that make IT systems trustworthy for auditors: who can access programs and data, how changes reach production, how new systems are built, and how daily operations run. Under SOX, ITGCs over financial systems are tested every year. Automating them turns each control run into its own audit evidence.

Every financial statement audit eventually asks the same question about IT: can the systems that produce the numbers be trusted? IT General Controls (ITGCs) are how organizations answer it. They govern who can access systems, how changes reach production, how new systems are built, and how day-to-day operations run.

This guide covers what ITGCs are, the four domains auditors test, how they relate to SOX and application controls, and how an orchestration platform such as Kestra automates change and access controls so they produce their own audit evidence.

## What are IT General Controls (ITGC)?

ITGCs are the base layer of an organization's internal control framework, as described in frameworks such as [COSO's Internal Control guidance](https://www.coso.org/guidance-on-ic) and ISACA's [COBIT](https://www.isaca.org/resources/cobit). They are policies and procedures that apply to all IT systems, components, processes, and data within an organization. Unlike application controls, which are specific to a single piece of software, ITGCs provide a secure and reliable environment for all applications to operate.

### Defining IT General Controls

IT General Controls are broad, entity-level controls that create a consistent and reliable IT environment. They are not tied to any single business application but rather provide the assurance that the overall infrastructure is managed securely and effectively. Think of them as the foundation of a house: if the foundation is weak, the integrity of every room is at risk, no matter how strong its individual door locks are. The primary goal of ITGCs is to ensure the confidentiality, integrity, and availability (CIA) of IT systems and data.

### Why ITGCs are critical for modern organizations

Strong ITGCs matter for four reasons:
- **Data Integrity:** Ensuring that the data processed by IT systems is accurate, complete, and reliable. This matters most for financial reporting, where inaccuracies can have severe legal and financial consequences.
- **Security:** Protecting sensitive data and systems from unauthorized access, modification, or destruction.
- **Regulatory Compliance:** Meeting the requirements of regulations like the Sarbanes-Oxley Act (SOX), GDPR, HIPAA, and PCI DSS. Auditors rely on effective ITGCs as a prerequisite for trusting the data produced by IT systems.
- **Operational Stability:** Ensuring that IT systems are available and operate as intended, minimizing disruptions to business processes.

For more resources on building a secure and compliant IT environment, explore our [Infrastructure Automation Resources](/resources/infrastructure). The principles of [workflow orchestration security](/resources/infrastructure/workflow-orchestration-security) apply directly to implementing ITGCs.

## Key Categories of ITGCs

Auditors typically group ITGCs into four main categories or domains. These pillars cover the lifecycle of IT systems and the processes that govern them.

### Access Management Controls

These controls ensure that access to systems and data is restricted to authorized users. They are fundamental to preventing both internal and external threats. Key aspects include:
- **User Authentication and Authorization:** Processes for granting, reviewing, and revoking user access. This includes password policies, multi-factor authentication (MFA), and role-based access control (RBAC).
- **Segregation of Duties (SoD):** Policies that prevent a single individual from having control over all aspects of a transaction, reducing the risk of fraud and error.
- **Privileged Access Management (PAM):** Controls over accounts with elevated permissions (e.g., administrators, root users).

### Change Management Controls

Change management controls govern how changes to the IT environment (applications, infrastructure, databases) are requested, tested, approved, and deployed. The goal is to prevent unauthorized or flawed changes from disrupting services or compromising security. A mature change management process includes:
- **Formal Request and Approval:** All changes must be documented and approved by relevant stakeholders.
- **Testing:** Changes are thoroughly tested in a non-production environment before deployment.
- **Deployment:** A standardized process for deploying approved changes into production.
- **Rollback Plans:** Procedures to revert a change if it causes unintended issues.

### Operations Controls

These controls ensure that IT operations are executed in a consistent, secure, and reliable manner. This domain covers the day-to-day activities required to keep systems running. Key areas include:
- **Job Scheduling and Monitoring:** Automated processes for running batch jobs and monitoring their success or failure.
- **Backup and Recovery:** Procedures for regularly backing up data and systems and ensuring they can be restored in case of a disaster.
- **Incident and Problem Management:** Processes for identifying, responding to, and resolving IT incidents.
- **Log Management:** Systematically collecting, storing, and reviewing logs for security events and operational issues, often governed by a [log retention policy](/resources/infrastructure/log-retention-management).

### Program Development Controls

Program development controls, often part of a Software Development Life Cycle (SDLC), govern the process of developing and implementing new applications or systems. This ensures that new software is built securely and meets business requirements. These controls cover:
- **Requirements Gathering and Design:** Formal processes for defining what a new system should do.
- **Coding Standards and Code Review:** Ensuring code is secure, efficient, and maintainable.
- **Testing and Quality Assurance (QA):** Rigorous testing to identify and fix bugs before deployment.
- **Data Migration:** Securely and accurately moving data to the new system.
Version-controlling code and configuration in Git, the basis of GitOps, is how most teams make this auditable.

## ITGC in Context: Comparisons and Distinctions

It's common for ITGCs to be confused with other types of controls. Understanding the distinctions is key to designing an effective control framework.

### ITGC vs. Application Controls

The primary difference lies in their scope:
- **IT General Controls (ITGCs)** are pervasive. They apply to the entire IT environment, including networks, operating systems, databases, and data centers. They provide the foundation for all other controls.
- **Application Controls** are specific. They are built into a particular software application to ensure the completeness and accuracy of transactions processed by that application. Examples include input validation in a form, automated calculations within an ERP system, or access rights within a specific financial application.

An effective control environment requires both. Strong ITGCs provide assurance that the underlying infrastructure is secure, which in turn allows auditors to rely on the application controls.

### ITGC vs. SOX Controls: Understanding the Differences

This is a common point of confusion. ITGCs are not an alternative to SOX controls; rather, they are a critical component of SOX compliance.
- **The [Sarbanes-Oxley Act (SOX)](https://www.govinfo.gov/content/pkg/PLAW-107publ204/pdf/PLAW-107publ204.pdf)** is a US federal law that mandates certain practices in financial record keeping and reporting for public companies.
- **SOX Controls** are the specific internal controls an organization implements to comply with SOX requirements, particularly Section 302 and 404, which relate to the accuracy of financial reporting.
- **SOX ITGC Testing** is the process of auditing the IT General Controls for systems that support financial reporting. If a company's financial statements are produced by an ERP system, auditors must test the ITGCs related to that system (e.g., who can access it, how are changes made to it) to ensure the financial data is reliable.

Effective ITGCs are a prerequisite for a successful SOX audit. Without them, auditors cannot rely on the data produced by financial systems. This makes [workflow governance](/resources/ai/ai-governance-workflows) and standards like [SOC 2 compliance](/resources/infrastructure/soc2-compliance) close relatives of ITGC work.

## Implementing and Auditing ITGCs

A structured approach to implementation and auditing is essential for creating a sustainable and effective ITGC framework.

### The ITGC Process: Steps for Effective Implementation

While specifics vary, a typical ITGC implementation follows five key steps:
1.  **Risk Assessment and Scoping:** Identify key IT systems and the risks associated with them. Determine which systems are in scope for compliance requirements like SOX.
2.  **Control Design and Documentation:** Define and document the specific controls that will mitigate the identified risks. This documentation becomes the basis for audits.
3.  **Implementation:** Put the designed controls into practice. This may involve configuring systems, creating new processes, or deploying new tools.
4.  **Testing and Monitoring:** Regularly test the controls to ensure they are operating effectively. This can involve periodic reviews, penetration testing, or automated monitoring.
5.  **Remediation and Improvement:** When control weaknesses are identified, create and execute a plan to fix them. The ITGC framework should be a living system that evolves with the organization and its risk landscape.

### Key Pillars of ITGC Frameworks

The "four pillars" or domains of ITGCs that most audit programs test are:
1.  **Access to Programs and Data:** Controls ensuring that only authorized individuals can access or modify data and applications.
2.  **Program Changes:** The process for managing changes to applications and infrastructure to ensure they are authorized, tested, and properly deployed.
3.  **Program Development:** Controls over the entire lifecycle of developing and implementing new systems.
4.  **Computer Operations:** Controls ensuring the ongoing integrity of production systems, including job scheduling, data backups, and incident response.

### ITGC Audit: Ensuring Compliance and Security

An ITGC audit assesses the effectiveness of these controls. Auditors often use the "5 C's" to structure their findings for any identified control deficiency:
- **Condition:** What is the problem? (e.g., "Former employees still have active accounts.")
- **Criteria:** What is the standard or policy that is not being met? (e.g., "The company policy requires all accounts to be disabled within 24 hours of termination.")
- **Cause:** Why did the problem occur? (e.g., "The offboarding process does not include a step for IT to deprovision accounts.")
- **Consequence:** What is the impact or risk? (e.g., "Unauthorized access to sensitive company data.")
- **Corrective Action:** What needs to be done to fix the problem? (e.g., "Update the offboarding checklist and implement an automated workflow to deprovision accounts.")

Centralized [audit logs](/resources/infrastructure/audit-logs-orchestration) and [workflow observability](/resources/infrastructure/workflow-observability) are what give auditors that evidence without screenshots.

## Why ITGC needs orchestration

Manually managing ITGCs is fraught with challenges. It relies on people following procedures perfectly every time, which is unrealistic at scale. Manual processes are prone to human error, inconsistency, and are difficult to audit. Evidence often consists of screenshots, emails, and checklists, which are time-consuming to gather and easy to lose.

An orchestration platform transforms ITGC management by turning processes into automated, auditable workflows. It addresses the core challenges of manual controls:
- **Consistency:** Automated workflows execute the same way every time, ensuring that controls like change deployment or access reviews are applied consistently.
- **Auditability:** Every step in an orchestrated workflow is logged automatically. This creates an immutable audit trail that shows who requested an action, who approved it, when it was executed, and what the outcome was.
- **Automation:** Repetitive tasks like user provisioning, running backup jobs, or deploying approved changes can be fully automated, freeing up IT staff for more strategic work.
- **Integration:** Orchestration platforms connect to existing tools (like ServiceNow, Jira, or Slack) so the control runs end to end.

By using a central control plane for [infrastructure automation](/infra-automation), you can enforce ITGCs across your entire stack, from legacy systems to modern cloud infrastructure.

## Orchestrate ITGC processes with Kestra: An example for change management

One of the most critical ITGC domains is change management. A flawed change can cause outages and security breaches. The following Kestra workflow demonstrates how to automate a change management process with a human-in-the-loop approval, ensuring segregation of duties and creating a complete audit trail.

In this scenario, the ITSM tool (ServiceNow or Jira) calls a webhook when a change request is ready for implementation. The workflow notifies the approver group in Slack and pauses. A reviewer resumes it from the Kestra UI with a decision and the ticket reference. The change runs only if it was approved and the approver is not the person who requested it.

```yaml
id: itgc-change-management-approval
namespace: company.team.compliance

triggers:
  - id: itsm-change-request
    type: io.kestra.plugin.core.trigger.Webhook
    key: replace-with-a-long-random-key

tasks:
  - id: notify-approvers
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_CHANGE_APPROVERS_WEBHOOK') }}"
    payload: |
      {
        "text": {{ ("Change " ~ trigger.body.ticketId ~ " requested by " ~ trigger.body.requestedBy ~ ": " ~ trigger.body.description ~ ". Review it in Kestra.") | toJson }}
      }

  - id: wait-for-approval
    type: io.kestra.plugin.core.flow.Pause
    onResume:
      - id: approved
        type: BOOL
        defaults: false
        description: Approve this change?
      - id: ticket_ref
        type: STRING
        description: ITSM ticket reference for this change.

  - id: enforce-approval
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs['wait-for-approval'].onResume.approved and outputs['wait-for-approval'].resumed.by != trigger.body.requestedBy }}"
    then:
      - id: execute-change
        type: io.kestra.plugin.scripts.shell.Commands
        namespaceFiles:
          enabled: true
        commands:
          - ./deploy-change.sh "{{ outputs['wait-for-approval'].onResume.ticket_ref }}"
      - id: record-in-itsm
        type: io.kestra.plugin.core.http.Request
        method: POST
        uri: "{{ secret('ITSM_API_URL') }}/changes/{{ trigger.body.ticketId }}/notes"
        headers:
          Authorization: "Bearer {{ secret('ITSM_API_TOKEN') }}"
          Content-Type: application/json
        body: "{{ {'note': 'Implemented by Kestra execution ' ~ execution.id ~ ', approved by ' ~ outputs['wait-for-approval'].resumed.by} | toJson }}"
    else:
      - id: block-change
        type: io.kestra.plugin.core.execution.Fail
        errorMessage: "Change {{ trigger.body.ticketId }} not implemented: rejected, or approved by the requester."
```

The comparison between the requester and the approver assumes both systems identify people the same way, for example by corporate email through single sign-on.

A few things are worth noticing in this workflow:
- **Audit Trail:** Kestra's execution history records every step: the trigger payload (who requested the change), the `Pause` outputs (`resumed.by` holds who approved it, with the decision and ticket reference), and the logs of the change script.
- **Human-in-the-Loop:** The [`Pause` task](/docs/how-to-guides/pause-resume) stops the workflow until a human provides input, creating a formal gate for manual approvals while keeping the entire process within an auditable, automated context.
- **Segregation of Duties (SoD):** The `If` condition runs the change only when it was approved and the approver differs from the requester; otherwise the `Fail` task stops the execution, so a blocked change is visible as a failed run.
- **Integration:** The workflow starts from a [webhook](/docs/workflow-components/triggers/webhook-trigger) and writes the outcome back to the ITSM ticket, so the change record stays complete in both systems.

## Where strong ITGCs pay off

Automated ITGCs deliver benefits beyond passing an audit. It strengthens the entire organization's security posture and operational efficiency.
- **Enhancing Data Integrity and Security:** By enforcing consistent controls, organizations reduce the risk of data breaches, corruption, and unauthorized access. This builds trust in the data used for decision-making across the business.
- **Achieving Regulatory Compliance:** Automated, auditable processes simplify compliance with regulations like SOX, GDPR, and HIPAA. Auditors can rely on system-generated logs instead of manual evidence, reducing audit time and cost. The same approach applies to [PCI DSS compliance automation](/resources/infrastructure/pci-dss-compliance-automation).
- **Improving Operational Efficiency:** Automating manual control processes reduces human error, accelerates delivery cycles (like software deployments), and frees up skilled IT professionals to focus on value-adding activities instead of administrative tasks.

## Related concepts

- [Role-Based Access Control (RBAC)](/resources/infrastructure/rbac)
- [CI/CD Orchestration](/resources/infrastructure/ci-cd-orchestration)
- [ITSM Automation](/resources/infrastructure/itsm-automation)
- [GitOps](/resources/infrastructure/gitops)
- [DORA Compliance](/resources/infrastructure/dora-compliance)
