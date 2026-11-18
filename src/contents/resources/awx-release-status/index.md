---
title: "AWX Release Status: Is AWX Still Maintained in 2026?"
description: "AWX releases have been paused since July 2024 for a major refactor. Here is a factual overview of the project's current status, what it means for users, and available options."
metaTitle: "Is AWX Dead? AWX Release Status and Latest Version (2026)"
metaDescription: "AWX hasn't shipped a release since 24.6.1 in July 2024. Here's where the refactor stands, what's next, and your options if you run AWX today."
tag: "infrastructure"
date: 2026-11-18
slug: "awx-release-status"
faq:
  - question: "Is AWX dead?"
    answer: "No, AWX is not dead. Red Hat paused official tagged releases in July 2024 to refactor the software into a modular, service-oriented architecture. Development remains active on the devel branch on GitHub, but Red Hat has announced no release date or supported installation path for the next stable build."
  - question: "What is the latest version of AWX?"
    answer: "The latest official release of AWX is version 24.6.1, published on July 2, 2024. The companion AWX Operator project also published its latest release, version 2.19.1, on the same day. No packaged release has shipped since that date."
  - question: "When is the next AWX release?"
    answer: "There is no announced release date or estimated timeline for the next version of AWX. While the core refactor was merged into the devel branch in early 2026, members of the Ansible Steering Committee confirmed in late 2026 that no official release timeline exists."
  - question: "Is AWX still maintained?"
    answer: "AWX receives commits on its devel branch, but it is not maintained through regular stable releases or backported bug fixes. Teams running AWX 24.6.1 do not receive security patches unless they build custom container images directly from untagged development commits."
  - question: "Is there a fork of AWX?"
    answer: "Yes. Ascender, maintained by CIQ, is an open-source downstream project derived from AWX under the Apache 2.0 license. Ascender ships regular packaged releases (such as version 25.6.3 in late October 2026) and offers commercial enterprise support through Ascender Pro."
  - question: "What is the difference between AWX and Ansible Automation Platform?"
    answer: "AWX is the free, community-driven upstream project, whereas Red Hat Ansible Automation Platform (AAP) is a commercial enterprise product. AAP includes enterprise support, certified content collections, commercial automation controller builds, and role-based governance licensed on a per-managed-node subscription model."
  - question: "Can I keep my playbooks if I move off AWX?"
    answer: "Yes. Ansible playbooks are defined independently of AWX using standard YAML syntax executed by ansible-core. Moving to an alternative control plane requires migrating credentials, schedules, inventories, and survey prompts, but existing tasks and playbooks execute without code changes."
  - question: "What does AWX stand for?"
    answer: "AWX is a recursive acronym standing for 'AWX Is Not X'. It was introduced in 2017 when Red Hat open-sourced the web management and API layer originally developed for the proprietary Ansible Tower product."
---

> **TL;DR** — No, AWX is not dead, but it has not shipped a release since 24.6.1 on July 2, 2024. Red Hat paused releases to refactor AWX into a service-oriented architecture. The refactor is merged into the `devel` branch, but as of November 2026 there is no release date and no supported install path for the new version.

Engineers and platform administrators managing Ansible environments frequently ask whether AWX is still viable for production operations. While commits continue to land in source control, the absence of packaged builds for over two years has forced infrastructure teams to evaluate their ongoing operational posture.

This guide summarizes the current project status, documents the refactoring timeline since mid-2024, explains the operational implications of remaining on legacy builds, and outlines the primary migration options.

---

## AWX status at a glance

The following table summarizes the verified state of AWX and its related projects as of November 2026.

| Component / Initiative | Current Status (November 2026) | Primary Source |
|---|---|---|
| **Latest AWX release** | Version 24.6.1, published July 2, 2024 | [GitHub Releases (`ansible/awx`)](https://github.com/ansible/awx/releases) |
| **Latest AWX Operator release** | Version 2.19.1, published July 2, 2024 | [GitHub Releases (`ansible/awx-operator`)](https://github.com/ansible/awx-operator/releases) |
| **Active development** | Active commits on `devel` branch (November 2026) | [GitHub Commit Log (`ansible/awx`)](https://github.com/ansible/awx/commits/devel) |
| **Next release timeline** | No target date or ETA announced | [Ansible Forum Discussions](https://forum.ansible.com/t/is-there-an-estimated-timeline-for-the-next-awx-release/46156) |
| **Web interface rewrite** | Moved to separate repository (`ansible/ansible-ui`) | [Ansible Forum Announcement (April 2026)](https://forum.ansible.com/t/awx-modernization-ansible-ui/45757) |
| **Jewel proxy layer** | Source code and dev container available; no releases planned | [Ansible Forum Announcement (May 2026)](https://forum.ansible.com/t/awx-modernization-ansible-jewel/45775) |
| **Red Hat AAP** | Actively developed and supported commercially | <a href="https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.7" rel="nofollow">Red Hat Documentation</a> |
| **Ascender (CIQ fork)** | Regular releases, latest version 25.6.3 (October 28, 2026) | [GitHub Releases (`ctrliq/ascender`)](https://github.com/ctrliq/ascender/releases) |

---

## Why AWX releases are paused

In July 2024, Red Hat engineering placed the AWX release cycle on hold. The maintainers added a prominent banner to the project repository: *"Releases of this project are now paused during a large scale refactoring."*

The rationale behind this pause centers on architectural debt. AWX historically operated as a monolithic Django application containing the user interface, API endpoints, task dispatcher, database models, and operational tooling within a single codebase. Over several years, managing dependencies across these components became increasingly difficult.

Red Hat initiated a modernization program aimed at restructuring AWX into a pluggable, service-oriented architecture. Under this vision, individual components run as decoupled microservices rather than a single monolithic container:

1. **Separation of the web interface**: The front-end UI was extracted from the backend repository so it could iterate independently.
2. **Pluggable service integration**: The core engine was reworked to interact with adjacent automation components (such as Event-Driven Ansible and Galaxy) via dedicated service contracts.
3. **Container-first execution**: Changes were made to align the internal task lifecycle with containerized execution environments.

Because these changes altered internal APIs, database schemas, and packaging formats, the maintainers elected to suspend stable releases until the underlying architecture reached functional parity.

---

## What's changed since the last release (timeline)

The following chronological timeline records the major milestones, community updates, and repository changes that have occurred since stable packaging stopped:

* **July 2, 2024**: Red Hat publishes AWX 24.6.1 and AWX Operator 2.19.1. These remain the final stable builds distributed by the upstream maintainers.
* **July 2024**: Maintainers officially announce the release pause and publish technical notes detailing plans to break AWX into modular services.
* **September 2025**: A thread titled *"Is there a future for AWX?"* on the official Ansible forum receives 76 replies. Community administrators express concern over unpatched vulnerabilities and lack of operational updates. A Red Hat representative acknowledges communication gaps and commits to providing quarterly status updates.
* **January 20, 2026**: Red Hat posts an update titled *"AWX modernization: Moving forward"*. The post confirms that the architectural refactoring work is merged into the `devel` branch and nearing completion. The update does not provide a release target or a documented installation procedure.
* **April 30, 2026**: The legacy user interface is removed from the primary AWX repository. Maintainers direct developers to the newly created `ansible/ansible-ui` repository, noting that the standalone front-end remains in active development and warning that "not everything is going to work out of the box."
* **May 6, 2026**: Maintainers publish the source code for Jewel, a lightweight reverse proxy and authentication routing layer designed to connect AWX with peripheral pluggable services. The post explicitly clarifies that Jewel is an upstream development project with no planned standalone packaged releases.
* **August 2026**: In a follow-up forum discussion regarding release estimates, an Ansible Steering Committee member notes that they are not aware of any firm plans, dates, or ETAs for an upcoming public release.
* **November 2026**: Git commits continue to land on the `devel` branch of `ansible/awx`, but tagged releases remain absent.

---

## What this means if you run AWX today

Teams currently operating AWX in production face specific maintenance, security, and planning trade-offs.

### 1. Version 24.6.1 is frozen

AWX 24.6.1 still executes Ansible playbooks as expected on compatible Kubernetes clusters, but this version receives no maintenance. CVEs identified in underlying Python libraries, Django components, or base operating system packages will not receive backported patches.

A related indicator is the companion `awx.awx` collection on Ansible Galaxy. The collection has not received an update since version 24.6.1 on July 2, 2024. Automation scripts that configure AWX via this collection cannot access modern capabilities without running into compatibility warnings.

### 2. Running the `devel` branch is not production-ready

While developers can build container images directly from the Git `devel` branch, doing so in production introduces substantial stability risks. The upstream maintainers explicitly acknowledge that documentation, migration scripts, and component glue remain incomplete. Pulling development commits risks encountering breaking schema changes, missing UI screens, and unverified API contracts.

### 3. A migration is required regardless of your path

Based on published design documents and forum announcements, the next generation of AWX will not be an in-place drop-in upgrade. Because the architecture decouples the user interface, introduces the Jewel routing proxy, and reorganizes deployment manifests, platform teams waiting for the next AWX release will still have to redesign their deployment infrastructure. 

Because rebuilding the control plane will be mandatory whenever the new architecture arrives, infrastructure teams have a natural window to evaluate whether staying on AWX aligns with their broader operational requirements.

---

## Your options

Platform engineers running AWX have five distinct operational paths. For a wider comparison of tools, see our guides to [AWX alternatives](/resources/infrastructure/awx-alternatives) and [Ansible Tower alternatives](/resources/infrastructure/ansible-tower-alternatives).

| Option | Operational Effort | Licensing / Cost | Support Model | Architecture & Portability |
|---|---|---|---|---|
| **1. Stay on AWX 24.6.1** | None initially; grows as base packages age | Free (Apache 2.0) | None (community forum only) | Frozen legacy deployment; unpatched CVEs |
| **2. Wait for next AWX release** | High when released (full deployment rebuild) | Free (Apache 2.0) | Community | Microservice-based; breaking deployment changes |
| **3. Migrate to Ascender (CIQ)** | Low to moderate (direct AWX fork) | Free (Apache 2.0) or paid Pro | Community or commercial SLA from CIQ | AWX-compatible controller; regular upstream releases |
| **4. Red Hat AAP** | Moderate (migration tooling provided) | Commercial (per managed node) | Enterprise SLA from Red Hat | Official commercial platform; automated installation |
| **5. Decouple orchestration from playbooks** | Moderate (reconfigure jobs as workflows) | Open source or enterprise | Community or enterprise SLA | Standard `ansible-core` execution; multi-tool control plane |

### Option 1: Stay on AWX 24.6.1

For teams with isolated network boundaries, low change frequency, and strict change freezes, continuing to run AWX 24.6.1 is technically possible, as long as platform engineers accept that security vulnerabilities in the web interface and API will remain unpatched.

### Option 2: Wait for the next AWX architecture

Teams with deep investments in AWX-specific workflows can wait for Red Hat to finalize packaging for the refactored architecture. When a build is eventually tagged, teams must prepare for a complete redeployment of the control plane. Playbook code will remain compatible, but existing Helm charts, operator manifests, and integration configurations will need to be rebuilt.

### Option 3: Ascender by CIQ

Ascender is an open-source project maintained by CIQ that derives directly from upstream AWX. It maintains an Apache 2.0 codebase while continuing to ship regular packaged releases, including version 25.6.3 in late October 2026. 

Ascender provides an attractive bridge for organizations that require an actively maintained web console and REST API that mirrors AWX conventions. For regulated environments, CIQ offers commercial support under the Ascender Pro subscription.

### Option 4: Red Hat Ansible Automation Platform

Organizations seeking an enterprise-backed product can migrate to Red Hat Ansible Automation Platform (AAP). AAP includes the commercial automation controller (the enterprise successor to Ansible Tower), Event-Driven Ansible, private automation hubs, and Red Hat technical support. AAP is licensed via annual commercial subscriptions based on the number of managed nodes in your inventory.

### Option 5: Decouple orchestration from playbooks

A growing number of platform teams choose to separate the scheduling and orchestration layer from raw playbook execution. Because Ansible playbooks execute independently via `ansible-core`, teams do not need a dedicated Ansible-specific server to run their automation.

Modern declarative orchestrators coordinate `ansible-playbook` CLI executions inside isolated containers, while extending the workflow to include adjacent infrastructure systems. For example, declarative workflow engines like Kestra [orchestrate Ansible](/orchestration/ansible) with the [Ansible plugin](/plugins/plugin-ansible), running playbooks natively alongside Terraform scripts, database updates, HTTP webhooks, and manual approval gates.

This architectural pattern offers several practical benefits:

* **No playbook rewrites**: Playbooks run without modification inside containerized task runners.
* **Unified control plane**: Teams coordinate end-to-end operational pipelines that combine Ansible configuration with cloud provisioning, incident alerting, and container deployments across their [infrastructure automation resources](/resources/infrastructure).
* **Predictable maintenance**: Unlike specialized tools with stalled release cycles, general-purpose workflow engines adhere to [scheduled release cadences and LTS policies](/docs/releases).
* **Self-service workflows**: Teams can expose automated runbooks with parameter forms, access control, and audit logs without managing a dedicated Django application stack through a [unified infrastructure orchestration control plane](/infra-automation).

---

## What is AWX?

AWX is an open-source web application, REST API, and task engine designed to centralize and manage Ansible automation across teams. It provides role-based access control, visual inventory management, credential storage, graphical playbook execution logs, and scheduling mechanisms.

The project traces its lineage to Ansible Tower, a proprietary commercial management tool introduced in 2013. In September 2017, Red Hat open-sourced the underlying codebase under the Apache 2.0 license as AWX, positioning it as the rapid-release upstream project for Ansible Tower. When Red Hat later transitioned Tower into the automation controller component of Ansible Automation Platform, AWX remained the open-source community foundation until releases paused in 2024.

---

## Sources

The factual assertions in this guide are drawn directly from the following public primary sources:

* **AWX GitHub Releases**: [https://github.com/ansible/awx/releases](https://github.com/ansible/awx/releases)
* **AWX Operator GitHub Releases**: [https://github.com/ansible/awx-operator/releases](https://github.com/ansible/awx-operator/releases)
* **AWX Development Commit Stream**: [https://github.com/ansible/awx/commits/devel](https://github.com/ansible/awx/commits/devel)
* **Refactoring Announcement (Ansible Forum)**: [https://forum.ansible.com/t/refactoring-awx-into-a-pluggable-service-oriented-architecture/7404](https://forum.ansible.com/t/refactoring-awx-into-a-pluggable-service-oriented-architecture/7404)
* **Release Pause Notice (Ansible Forum)**: [forum.ansible.com, AWX releases thread](https://forum.ansible.com/t/streamlining-awx-releases/6894)
* **Red Hat Project Status Summary**: [https://www.redhat.com/en/ansible-collaborative/upcoming-changes-to-the-awx-project](https://www.redhat.com/en/ansible-collaborative/upcoming-changes-to-the-awx-project)
* **AWX Modernization Moving Forward (January 2026)**: [https://forum.ansible.com/t/awx-modernization-moving-forward/45134](https://forum.ansible.com/t/awx-modernization-moving-forward/45134)
* **Ansible UI Extraction (April 2026)**: [https://forum.ansible.com/t/awx-modernization-ansible-ui/45757](https://forum.ansible.com/t/awx-modernization-ansible-ui/45757)
* **Jewel Service Proxy Overview (May 2026)**: [https://forum.ansible.com/t/awx-modernization-ansible-jewel/45775](https://forum.ansible.com/t/awx-modernization-ansible-jewel/45775)
* **Release Timeline Discussion (August 2026)**: [https://forum.ansible.com/t/is-there-an-estimated-timeline-for-the-next-awx-release/46156](https://forum.ansible.com/t/is-there-an-estimated-timeline-for-the-next-awx-release/46156)
* **Ascender Releases (CIQ)**: [https://github.com/ctrliq/ascender/releases](https://github.com/ctrliq/ascender/releases)
* **Ansible Galaxy Collection Record (`awx.awx`)**: [https://galaxy.ansible.com/ui/repo/published/awx/awx/](https://galaxy.ansible.com/ui/repo/published/awx/awx/)
