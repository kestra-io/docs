---
title: "AWX Release Status: Is AWX Still Maintained in 2026?"
description: "AWX hasn't shipped a release since July 2024, and in November 2026 its maintainers removed the release pipeline. Here is a factual overview of the project's current status, what it means for users, and available options."
metaTitle: "Is AWX Dead? AWX Release Status and Latest Version (2026)"
metaDescription: "AWX hasn't shipped a release since 24.6.1 in July 2024. Here's where the refactor stands, what's next, and your options if you run AWX today."
tag: "infrastructure"
date: 2026-11-18
slug: "awx-release-status"
faq:
  - question: "Is AWX dead?"
    answer: "AWX is not abandoned: code still lands on the devel branch on GitHub. But packaged releases have stopped. The last one is 24.6.1, published on July 2, 2024, and on November 16, 2026 the maintainers removed the release pipeline from the repository, noting that AWX releases are no longer published. No announcement says whether releases will resume."
  - question: "What is the latest version of AWX?"
    answer: "The latest official release of AWX is version 24.6.1, published on July 2, 2024. The companion AWX Operator project also published its latest release, version 2.19.1, on the same day. No packaged release has shipped since that date."
  - question: "When is the next AWX release?"
    answer: "None is planned. The refactor was merged into the devel branch in January 2026, but Red Hat never announced a release date. In August 2026, a member of the Ansible Steering Committee replied on the forum that they were not involved in AWX and did not know of any plans or ETAs. On November 16, 2026, the AWX maintainers removed the release staging and publishing workflows, stating that AWX releases are no longer published."
  - question: "Is AWX still maintained?"
    answer: "AWX receives commits on its devel branch, including dependency updates, but it is not maintained through stable releases or backported bug fixes. Teams running AWX 24.6.1 do not receive security patches unless they build custom container images directly from untagged development commits."
  - question: "How do I move AWX job templates to Kestra?"
    answer: "Each job template becomes a Kestra flow with an AnsibleCLI task that runs the same playbook. Surveys become flow inputs, schedules become Schedule triggers, credentials become secrets and approval nodes become Pause tasks. Your playbooks, roles and inventories do not change."
  - question: "Does Kestra still ship security fixes?"
    answer: "Yes. Kestra publishes patch releases every week: eight 2.0 patch releases came out between October 13 and November 24, 2026, and the 1.3 line is still maintained. Every release is listed on <a href='https://github.com/kestra-io/kestra/releases'>GitHub</a>."
  - question: "Can I keep my playbooks if I move off AWX?"
    answer: "Yes. Ansible playbooks are defined independently of AWX using standard YAML syntax executed by ansible-core. Moving to an alternative control plane requires migrating credentials, schedules, inventories, and survey prompts, but existing tasks and playbooks execute without code changes."
  - question: "What does AWX stand for?"
    answer: "AWX is a recursive acronym standing for 'AWX Is Not X'. It was introduced in 2017 when Red Hat open-sourced the web management and API layer originally developed for the proprietary Ansible Tower product."
resourceCtaOverride:
  href: /blueprints/ansible-playbook-from-git
  label: See your playbook run in Kestra
  action: playbook
  tagline: "Still on AWX? Run the playbooks you already have in Kestra."
  taglineEnd: "Keep your playbooks. Replace the controller."
---

> **TL;DR** — AWX is still developed, but it no longer ships releases. The last one is 24.6.1, from July 2, 2024. Red Hat paused releases to refactor AWX into a service-oriented architecture, and the refactor is merged into the `devel` branch. On November 16, 2026, the maintainers removed the release pipeline from the repository, noting that AWX releases are no longer published. As of November 2026 there is no release date and no supported install path for the new version.

::resource-cta

Engineers and platform administrators managing Ansible environments frequently ask whether AWX is still viable for production operations. While commits continue to land in source control, the absence of packaged builds for over two years has forced infrastructure teams to evaluate their ongoing operational posture.

This guide summarizes the current project status, documents the refactoring timeline since mid-2024, explains the operational implications of remaining on legacy builds, and outlines the primary migration options.

---

## AWX status at a glance

The following table summarizes the verified state of AWX as of November 2026.

| Component / Initiative | Current Status (November 2026) | Primary Source |
|---|---|---|
| **Latest AWX release** | Version 24.6.1, published July 2, 2024 | [GitHub Releases (`ansible/awx`)](https://github.com/ansible/awx/releases) |
| **Latest AWX Operator release** | Version 2.19.1, published July 2, 2024 | [GitHub Releases (`ansible/awx-operator`)](https://github.com/ansible/awx-operator/releases) |
| **Active development** | Active commits on `devel` branch (November 2026) | [GitHub Commit Log (`ansible/awx`)](https://github.com/ansible/awx/commits/devel) |
| **Next release timeline** | None planned: release pipeline removed on November 16, 2026 | [Pull request `ansible/awx#16803`](https://github.com/ansible/awx/pull/16803) |
| **Web interface** | Removed from AWX during the refactor; development resumed in `ansible/ansible-ui` | [Ansible Forum Announcement (April 2026)](https://forum.ansible.com/t/awx-modernization-ansible-ui/45757) |
| **Jewel proxy layer** | Source code and dev container available; no releases planned | [Ansible Forum Announcement (May 2026)](https://forum.ansible.com/t/awx-modernization-ansible-jewel/45775) |

---

## Why AWX stopped shipping releases

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
* **September 22, 2025**: A thread titled *"Is there a future for AWX?"* opens on the official Ansible forum. Community members ask for a status update and a timeline. In October and November 2025, a member of the Red Hat community team acknowledges the communication gap and announces a plan to provide more regular updates.
* **January 20, 2026**: Red Hat posts an update titled *"AWX modernization: Moving forward"*. The post confirms that the architectural refactoring work is merged into the `devel` branch and nearing completion. The update does not provide a release target or a documented installation procedure.
* **April 30, 2026**: Red Hat announces that development of the web interface, removed from AWX during the refactor, has resumed in the public `ansible/ansible-ui` repository. The post describes the UI as in active development and warns that "not everything is going to work out of the box" when running AWX from the `devel` branch.
* **May 6, 2026**: Maintainers publish the source code for Jewel, a lightweight reverse proxy and authentication routing layer designed to connect AWX with peripheral pluggable services. The post explicitly clarifies that Jewel is an upstream development project with no planned standalone packaged releases.
* **August 11, 2026**: Asked on the forum whether a release is possible in 2026, an Ansible Steering Committee member replies that they are not involved in AWX and do not know of any plans or ETAs.
* **November 16, 2026**: The maintainers merge a pull request that removes the release staging and publishing workflows from `ansible/awx`. Its description states that "AWX releases are no longer published, so the release pipeline in this repo is dead code." Commits continue to land on the `devel` branch.

---

## What this means if you run AWX today

Teams currently operating AWX in production face specific maintenance, security, and planning trade-offs.

### 1. Version 24.6.1 is frozen

AWX 24.6.1 still executes Ansible playbooks as expected on compatible Kubernetes clusters, but this version receives no maintenance. CVEs identified in underlying Python libraries, Django components, or base operating system packages will not receive backported patches.

A related indicator is the companion `awx.awx` collection on Ansible Galaxy. The collection has not received an update since version 24.6.1 on July 2, 2024. Automation scripts that configure AWX via this collection cannot access modern capabilities without running into compatibility warnings.

### 2. Running the `devel` branch is not production-ready

While developers can build container images directly from the Git `devel` branch, doing so in production introduces substantial stability risks. The upstream maintainers explicitly acknowledge that documentation, migration scripts, and component glue remain incomplete. Pulling development commits risks encountering breaking schema changes, missing UI screens, and unverified API contracts.

### 3. There is no release to wait for

With the release pipeline removed in November 2026, there is no packaged version of the new architecture to upgrade to, and no announcement says one is coming. Based on Red Hat's forum posts, running the refactored AWX would in any case mean a new deployment rather than an in-place upgrade: the user interface is now a separate project, Jewel adds a routing layer, and the installation methods have changed.

Either way, staying on AWX means owning a control plane that no longer ships releases, which gives infrastructure teams a natural moment to evaluate whether AWX still fits their operational requirements.

---

## Your options

You have three paths. The first two keep AWX as it is. The third keeps your playbooks and replaces the controller around them.

| Option | What you keep | What you give up | Releases and security fixes |
|---|---|---|---|
| **1. Stay on AWX 24.6.1** | Your whole AWX setup | Security fixes and new features | None since July 2024 |
| **2. Wait in case AWX releases return** | Your AWX setup, for now | A date to plan around: no release is announced | None planned since the release pipeline was removed in November 2026 |
| **3. Run your playbooks in Kestra** | Playbooks, roles, inventories and Git repositories | The AWX controller | Patch releases every week ([Kestra on GitHub](https://github.com/kestra-io/kestra/releases)) |

### Option 1: Stay on AWX 24.6.1

For teams with isolated network boundaries, low change frequency, and strict change freezes, continuing to run AWX 24.6.1 is technically possible, as long as platform engineers accept that security vulnerabilities in the web interface and API will remain unpatched.

### Option 2: Wait in case AWX releases return

Teams with deep investments in AWX-specific workflows can wait in case packaged releases return. Since the release pipeline was removed in November 2026, nothing indicates when or whether that will happen. If a build is tagged again, expect a full redeployment of the control plane: playbook code will remain compatible, but existing Helm charts, operator manifests, and integration configurations will need to be rebuilt.

### Option 3: Keep your playbooks, replace the controller with Kestra

Kestra is an open-source orchestrator (Apache 2.0) that runs your existing playbooks with its [Ansible plugin](/plugins/plugin-ansible). Each playbook runs unchanged with `ansible-core` in a container. Kestra handles what AWX did around it: schedules, inputs, approvals, retries and a log of every run.

Unlike AWX, Kestra still ships. It published eight 2.0 patch releases between October 13 and November 24, 2026, and still maintains its 1.3 line.

#### Where each AWX object goes

| In AWX | In Kestra |
|---|---|
| **Job template** | A flow with an AnsibleCLI task |
| **Survey** | Flow inputs, or a Kestra App (Enterprise) |
| **Schedule** | Schedule trigger |
| **Credentials** | Secrets |
| **Inventory** | A file in Git or Namespace Files, or built at run time from NetBox or a Terraform output |
| **Workflow template** | A flow, with subflows, If and Switch |
| **Approval node** | Pause task |
| **Instance group** | Worker group (Enterprise) |

#### Run one of your playbooks in a few minutes

1. Start Kestra on any machine with Docker:

```bash
docker run --pull=always --rm -it -p 8080:8080 --user=root \
  --name kestra \
  -v kestra_data:/app/storage \
  -v kestra_db:/app/data \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/tmp \
  kestra/kestra:latest-slim server local
```

2. Open `http://localhost:8080`, create a flow and paste this one. Replace the inline playbook with one of yours; `dry_run` keeps it in check mode until you turn it off.

```yaml
id: run_my_playbook
namespace: company.team

inputs:
  - id: dry_run
    type: BOOL
    defaults: true

tasks:
  - id: playbook
    type: io.kestra.plugin.ansible.cli.AnsibleCLI
    checkMode: "{{ inputs.dry_run }}"
    inputFiles:
      inventory.ini: |
        localhost ansible_connection=local
      playbook.yml: |
        ---
        - hosts: localhost
          gather_facts: false
          tasks:
            - name: Your playbook, unchanged
              ansible.builtin.debug:
                msg: "Run by Kestra, logged per host"
    commands:
      - ansible-playbook -i inventory.ini playbook.yml
```

3. Execute the flow and read the result for each host in the logs. To run playbooks from your own repository, start from the [Git playbook blueprint](/blueprints/ansible-playbook-from-git).

#### For network teams

Build the inventory at run time from your source of truth, run in check mode, pause for approval, then apply. Start from the blueprints that [run Ansible by NetBox role and site](/blueprints/netbox-ansible-by-role-site) and [build a dynamic inventory from NetBox](/blueprints/ansible-netbox-dynamic-inventory).

#### Open source and Enterprise

AWX gives each user their own login and permissions for free. Kestra's open-source edition has one shared login. Teams that need SSO, role-based access, audit logs or worker groups in isolated networks use [Kestra Enterprise](/enterprise).

CAGIP, the IT production arm of Crédit Agricole, [transformed its infrastructure operations](/stories/credit-agricole) and scaled data workflows across more than 100 clusters with Kestra.

Comparing other controllers? Our [AWX alternatives guide](/resources/infrastructure/awx-alternatives) covers them, and [orchestrating Ansible with Kestra](/orchestration/ansible) shows the patterns teams use next.

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
* **Release Pipeline Removal (November 2026)**: [https://github.com/ansible/awx/pull/16803](https://github.com/ansible/awx/pull/16803)
* **Release Timeline Discussion (August 2026)**: [https://forum.ansible.com/t/is-there-an-estimated-timeline-for-the-next-awx-release/46156](https://forum.ansible.com/t/is-there-an-estimated-timeline-for-the-next-awx-release/46156)
* **Kestra Releases (GitHub)**: [https://github.com/kestra-io/kestra/releases](https://github.com/kestra-io/kestra/releases)
* **Ansible Galaxy Collection Record (`awx.awx`)**: [https://galaxy.ansible.com/ui/repo/published/awx/awx/](https://galaxy.ansible.com/ui/repo/published/awx/awx/)
