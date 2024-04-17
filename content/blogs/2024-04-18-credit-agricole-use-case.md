---
title: "Credit Agricole automating and managing their infrastructure workflows with Kestra"
description: "The Crédit Agricole Groupe Infrastructure Platform is using Kestra to automate their infrastructure automation"
date: 2024-04-18T08:00:00
category: Company News
author:
  name: Martin-Pierre Roset
  image: "mproset"
image: /blogs/2024-04-18-credit-agricole-use-case.jpg
---

Crédit Agricole Group Infrastructure Platform (CA-GIP) is the IT production entity of Crédit Agricole Group, acting as the central provider of IT services for the entire group.  They operate a private cloud environment and have many different needs regarding infrastructure operations, with a specific initial focus on patch management for private virtual machines (VMs), while ensuring high security and confidentiality. The initial need for a centralized orchestration tool to manage extensive infrastructures, including private cloud environments, has led CA-GIP towards Kestra. 

## Infrastructure Provisioning

The team at CA-GIP use a combination of production ready tools to support its IT operations and enhance workflow efficiency across its extensive infrastructure. Central to their workflow automation is the use of GitLab CI and Jenkins, which are critical for their continuous integration processes. These tools allow the teams to test and deploy code rapidly, ensuring that new updates are both efficient and reliable, creating a high level of confidence in their releases. Additionally, they employs Argo Workflows, particularly useful for teams working across different technology stacks. This tool is specifically used for orchestrating Spark jobs.

Furthermore, Ansible plays a crucial role in their infrastructure management by providing a robust platform for writing and maintaining scripts that streamline patch management and deployment processes. This is essential for maintaining the integrity and security of their systems, allowing for routine updates and management tasks to be executed smoothly and effectively. Traefik is another integral component of their technology stack, used to manage networks and proxies across various teams and applications. This tool ensures that network policies are automated and services across the organization’s platforms are reliably connected and secured, facilitating smooth and efficient service delivery and operational continuity. 

![Architecture](/blogs/2024-04-18-credit-agricole-use-case/architecture.png)

## Challenges in Infrastructure Automation

The organization operates more than 30 Kafka clusters, with each cluster requiring an average of 15 individual workflow deployments Their current approach rely heavily on manual execution of Ansible jobs through the command line interface (CLI). This translates to potentially 450 ongoing workflows across their Kafka infrastructure, with a new Kafka cluster every month, it’s significant time investment that could be significantly reduced with automation.

## Integrating Kestra for Centralized Orchestration

Kestra provides a unified platform that facilitates the orchestration of workflows, replacing the manual processes with an automated, centralized approach. By integrating with existing tools like Git for version control, Kestra enhances traceability and collaboration across teams. Its capabilities extend to managing sensitive data through secure secret management practices, thus reinforcing the security framework. 

- **Streamlined Workflow Management**: Kestra offers a centralized platform to manage and orchestrate workflows, eliminating the need for manual execution. This simplifies workflow creation, version control, and deployment.
- **Version Control with Git**: Kestra integrates seamlessly with Git, allowing teams to leverage existing version control practices for their workflows. This ensures traceability, simplifies collaboration and facilitates rollbacks if necessary.
- **Secret Management**: Kestra's "get secrets from vault" functionality provides a secure way to manage sensitive data within workflows. This eliminates the need to hardcode secrets or store them in plain text, enhancing security and compliance.
- **Ansible Playbook Integration**: Kestra's ability to run Ansible playbooks directly within workflows provides a bridge between existing automation practices and the centralized orchestration platform. This enables a smooth transition and leverages the existing expertise within the team.
- **Leveraging Kestra’s Flexible Data Integration**: Kestra supports retrieving data from diverse sources – including HTTP APIs, MongoDB databases, and GitLab CI pipelines. This flexibility allows for seamless integration with existing infrastructure and data sources within Credit Agricole's environment.






--- 

Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance. Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.