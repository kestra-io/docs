---
title: Why Kestra Enterprise Edition?
icon: /docs/icons/admin.svg
editions: ["EE"]
---

Discover the features only available in Kestra Enterprise Edition and why it is the best option for teams using Kestra.

# **Kestra Open-Source vs. Paid**

## **Security & Access Control**

When it comes to access control, the Enterprise Edition has enhanced capabilities compared to open source. While the basic authentication of the open source version may be adequate for single-user application or development projects, the security of the Enterprise Edition from integrated **Single Sign-On (SSO)** and **OpenID Connect (OIDC)** authentication is desirable for multi-user instances. The Enterprise Edition allows seamless access management through various identity providers. It also introduces **Role-Based Access Control (RBAC)** and Namespace-Level Permissions, ensuring fine-grained control over user actions within specific workflow environments.

For managing sensitive credentials, the Enterprise Edition includes **Secret Manager Integrations** and **Namespace-Level Secrets Management**, which help securely store and control access to secrets. Secrets can be implemented in the open source version with the Key Value Store, but this may not be enough for certain use cases. Additionally, Service Accounts & API Tokens allow automated and programmatic interactions with the Kestra platform. To streamline user provisioning and governance, **SCIM Directory Sync** ensures synchronization of users and groups with identity providers.

---

## **Governance & Compliance**

Organizations requiring strict compliance and audit capabilities benefit from **Audit Logs**, which provide a complete history of user actions and workflow changes. The Enterprise Edition also includes the **Log Shipper** task for sending logs to whichever monitoring platform(s) your DevOps team uses. **Worker Security Isolation** enhances operational security by segregating worker processes. Encryption & Fault Tolerance ensures data protection and system resilience against failures.

For enterprises managing multiple teams, **Multi-Tenancy Support** allows the creation of isolated environments for different departments or projects. Additionally, Dedicated Storage & Tenant Isolation ensures that data is segregated across different tenants for improved security and compliance. This is essential for managing different Business Units that use Kestra but should only be concerned with workflow production and data in their own segment.

---

## **Workflow Development & Productivity**

The Enterprise Edition introduces several features to improve workflow development efficiency. **Custom Plugins** are available, enabling organizations to extend Kestra’s capabilities with tailored integrations. **Custom Blueprints** simplify workflow creation by providing reusable, predefined structures. The Enterprise Edition streamlines task and flow development and promotes organizational consistency with reusable templates across your instance for whichever teams can benefit.

To facilitate rapid troubleshooting, **Full-Text Search** on Task Runs enables quick retrieval of task execution details. Administrators benefit from Centralized User & Permission Management, which simplifies access control across teams. Admins can impersonate users to guarantee correct permissions and access. Additionally, enterprises can build Custom Apps to create **custom UIs for flows**, allowing users to interact with Kestra from the outside world.

---

## **Enterprise Support & Services**

Companies using the Enterprise Edition gain access to Onboarding & Training Support, ensuring teams can quickly get up to speed with Kestra’s features. Additionally, Kestra provides a Customer Success Program with Service-Level Agreements (SLAs), offering dedicated support, guaranteed response times, and expert guidance to optimize workflow execution. Enterprise Edition also keeps you one step ahead with a preview of the product roadmap and upcoming features.

---

## **Scalability & Performance**

For organizations requiring high availability, the Enterprise Edition includes **High Availability (HA) Architecture**, ensuring that no single point of failure disrupts workflows. **Worker Groups** for Distributed Tasks optimize resource utilization by allowing workers to be grouped and assigned specific workloads. This is especially useful tasks with bursts in resource demand and always-on, intensive tasks. **Task Runners** further improve execution efficiency by managing task distribution intelligently by offloading compute-intensive tasks to remote environments.

To enhance observability and performance monitoring, **Cluster Monitoring & Custom Storage** enables real-time infrastructure insights and customized storage solutions. Finally, for organizations handling massive data processing workloads, **High-Throughput Event Handling** ensures that workflows can scale efficiently while maintaining performance.
