---
title: "OpenTofu vs Terraform: Architecture, Licensing & Migration"
description: "Compare OpenTofu and Terraform on licensing, state encryption, provider registries, and operational trade-offs for enterprise infrastructure teams."
metaTitle: "OpenTofu vs Terraform: In-Depth IaC Comparison"
metaDescription: "OpenTofu vs Terraform compared: license, governance, client-side state encryption, registries, and when to run both during a migration, with a Kestra flow."
tag: infrastructure
date: 2026-11-26
slug: opentofu-vs-terraform
faq:
  - question: "What is the difference between OpenTofu and Terraform?"
    answer: "Terraform is governed by HashiCorp under the Business Source License, while OpenTofu is an open-source MPL-2.0 fork hosted by the Linux Foundation and accepted into the CNCF Sandbox in April 2025. Both compile HCL and run execution plans, but OpenTofu adds native client-side state encryption and uses an independent community registry."
  - question: "Can you use OpenTofu and Terraform together?"
    answer: "Yes. Engineering teams frequently run OpenTofu and Terraform concurrently during phased migrations. Because both tools parse standard HCL syntax, an orchestrator can dispatch Terraform for legacy workspaces and OpenTofu for new infrastructure without rewriting configurations."
  - question: "Is OpenTofu fully compatible with Terraform configurations?"
    answer: "OpenTofu was forked from Terraform 1.5.x, so configurations written for Terraform 1.5 run unchanged. Both projects have added features since the fork, so code that uses features introduced later on either side needs a review before switching. The OpenTofu documentation publishes migration guides for later Terraform versions."
  - question: "Why are teams migrating from Terraform to OpenTofu?"
    answer: "Organizations migrate primarily to avoid BSL licensing terms that restrict competitive commercial use or embedded hosting. Teams also adopt OpenTofu for its vendor-neutral governance (Linux Foundation, CNCF Sandbox) and capabilities like client-side state encryption."
  - question: "Does OpenTofu support all Terraform providers?"
    answer: "For the vast majority of public providers, yes. The OpenTofu Registry is an independent registry that indexes the same GitHub releases provider authors publish, so existing source addresses such as hashicorp/aws resolve without code changes. A provider that is missing can be submitted to the registry."
---

> **TL;DR** — Terraform uses HashiCorp's Business Source License with deep ties to HCP Terraform, while OpenTofu is an MPL-2.0 open-source fork under the Linux Foundation with native state encryption. Choose OpenTofu for permissive licensing and client-side encryption; choose Terraform for direct HashiCorp support and turnkey enterprise cloud management.

When HashiCorp changed Terraform from the Mozilla Public License to the Business Source License (BSL 1.1) in August 2023, infrastructure teams faced an immediate operational question. What started as a licensing divergence quickly produced two separate engineering trajectories. Both tools parse HashiCorp Configuration Language (HCL) and compute dependency graphs, but diverging capabilities like client-side state encryption and separate provider registries require platform teams to weigh concrete architectural trade-offs.

## OpenTofu vs Terraform at a glance

The table below contrasts the technical, legal, and operational characteristics of both Infrastructure as Code (IaC) engines:

| Dimension | OpenTofu | Terraform |
|---|---|---|
| **License** | MPL-2.0 (open source) | BSL 1.1 (source-available) |
| **Governance** | Linux Foundation, CNCF Sandbox (since April 2025) | HashiCorp (IBM) |
| **State encryption** | ✓ Native client-side encryption | Backend-side (e.g. S3 with KMS) |
| **Configuration language** | HCL | HCL |
| **Provider registry** | OpenTofu Registry | Terraform Registry |
| **Enterprise tier** | Commercial partner solutions | HCP Terraform |
| **Compatibility** | Forked from Terraform 1.5.x, features diverge since | Reference implementation of the 1.x line |
| **Testing framework** | Native testing support | Native testing support |
| **Primary focus** | Permissive OSS and custom stacks | Turnkey enterprise HCP estates |

Feature status as of November 2026. While both engines share a common ancestry, their divergence affects day-to-day operations across licensing boundaries, security controls, and module sourcing.

## Licensing and governance: Linux Foundation neutrality vs HashiCorp BSL

The primary catalyst for OpenTofu was HashiCorp's transition from the open-source Mozilla Public License v2.0 (MPL-2.0) to the Business Source License v1.1. Under the [Business Source License](https://github.com/hashicorp/terraform/blob/main/LICENSE) published in the Terraform repository, the source stays viewable and production use stays free, except for products that compete with HashiCorp's own offerings: those fall outside the license's Additional Use Grant and need a commercial agreement.

OpenTofu operates under the [Linux Foundation](https://opentofu.org/docs) with a formal charter, and was [accepted into the CNCF Sandbox](https://www.cncf.io/projects/opentofu/) on April 23, 2025. Its MPL-2.0 license grants engineers the legal right to run, modify, fork, and embed the binary into any internal or external platform without licensing fees or competitive restrictions.

For platform teams, the question is less internal use, which the license allows, than where the platform is heading: a portal that may one day be offered to customers or embedded in a product needs a legal read of the competitive-use terms. OpenTofu removes that question.

## Feature divergence: Client-side state encryption and early evaluation

State management is the most critical technical divergence between the two projects. Terraform state files often store unencrypted sensitive values, including cloud provider credentials, database passwords, and private certificates generated during provisioning.

In standard Terraform workflows, state encryption occurs at rest within the storage backend, such as an AWS S3 bucket with server-side KMS encryption or an Azure Storage Account. Transfers use TLS and the backend can encrypt at rest, but the state itself is plaintext JSON: anyone with read access to the bucket and its key can read the secrets it contains.

OpenTofu introduced native [client-side state encryption](https://opentofu.org/docs/language/state/encryption/) in version 1.7.0. Platform engineers can configure encryption blocks directly in HCL using AES-GCM or cloud key management services:

```hcl
terraform {
  encryption {
    key_provider "aws_kms" "main" {
      kms_key_id = "arn:aws:kms:us-east-1:123456789012:key/example"
      region     = "us-east-1"
      key_spec   = "AES_256"
    }

    method "aes_gcm" "state_encryption" {
      keys = key_provider.aws_kms.main
    }

    state {
      method = method.aes_gcm.state_encryption
    }

    plan {
      method = method.aes_gcm.state_encryption
    }
  }
}
```

With this configuration, OpenTofu encrypts the state and plan files in memory before transmitting them to remote storage. Storage backends hold cipher text, meaning compromised storage credentials do not expose sensitive infrastructure variables.

Terraform continues to handle state security primarily at the backend layer, directing enterprise customers needing advanced state controls toward HCP Terraform workspaces.

OpenTofu 1.8 also added early variable evaluation: variables and locals can be used in backend configuration and module sources, where Terraform requires literal values.

## Registries and providers: where your dependencies come from

Infrastructure automation depends heavily on providers to interface with cloud APIs. Terraform downloads providers from the HashiCorp Terraform Registry, whose terms of use restrict it to Terraform.

The OpenTofu community runs its own registry, open source and served from a CDN. It indexes the GitHub releases that provider authors already publish, so existing provider declarations resolve without changes:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

When `tofu init` runs, a source such as `hashicorp/aws` resolves to `registry.opentofu.org/hashicorp/aws`, built from the same releases as its Terraform Registry entry.

Private module hosting also differs. Terraform integrates with HCP Terraform private registries and local Git endpoints. OpenTofu supports standard HTTP, S3, and Git module endpoints, while commercial partners like Spacelift, env0, and Scalr provide hosted private registries tailored to OpenTofu workloads.

## When to choose OpenTofu

OpenTofu is the right choice when your organization requires:

- **Strict open-source compliance:** Legal mandates requiring software licensed under OSI-approved frameworks like MPL-2.0 or Apache 2.0.
- **Client-side state security:** Workloads handling regulated data where credentials in state files must be encrypted before hitting storage buckets.
- **Embedded platform automation:** Companies building SaaS platforms or customer-facing infrastructure products that embed IaC capabilities without BSL liability.
- **Independence from vendor roadmaps:** Infrastructure teams that prefer vendor-neutral governance under the Linux Foundation.

## When to choose Terraform

Terraform is the right choice when your organization requires:

- **Existing HCP Terraform investments:** Infrastructure operations standardized on HCP Terraform workspaces, Sentinel policy engines, and run tasks.
- **Single-vendor commercial support:** Procurement policies requiring direct vendor SLAs, enterprise indemnification, and consulting directly from HashiCorp and IBM.
- **Features added after the fork:** Projects that depend on Terraform capabilities released after 1.5 that OpenTofu implements differently or not at all. Check each one against the OpenTofu docs before migrating.
- **One vendor across the stack:** Teams already standardized on Vault, Consul and HCP that want a single vendor relationship.

## When to run both during migration

Running both engines simultaneously is an established operational pattern during infrastructure migrations. Because OpenTofu functions as a drop-in substitute for Terraform 1.5.x, teams rarely execute complete cutovers in a single pass.

Instead, platform engineers isolate workloads by workspace or environment:

1. Maintain production workspaces on Terraform while testing dev and staging environments on OpenTofu.
2. Run dual-plan pipelines: execute `tofu plan` alongside `terraform plan` against the same state file to confirm identical resource calculations.
3. Migrate isolated modules sequentially, verifying that provider downloads, variable interpolations, and outputs behave consistently.

Running dual pipelines exposes discrepancies in custom modules before engineers apply changes to critical production environments. Compare plans before the first `tofu apply`: after the cutover, OpenTofu manages the state.

## How to orchestrate OpenTofu and Terraform with Kestra

Relying on CLI scripts or scattered CI runners to execute IaC creates blind spots. An orchestration control plane coordinates infrastructure provisioning alongside configuration tasks, approval gates, and downstream application deployments.

Kestra runs both engines through dedicated plugins, and you can [orchestrate Terraform with Kestra](/orchestration/terraform) alongside the rest of your stack. Platform teams can define workflows that run either engine inside isolated containers, extract plan outputs, pause for manual review, and trigger post-provisioning configurations.

The following flow runs the migration check described above. Terraform and OpenTofu plan the same code, stored as the flow's namespace files; an engineer compares both plans; OpenTofu then applies the exact plan that was approved:

```yaml
id: opentofu_migration_cutover
namespace: company.infra

tasks:
  - id: terraform_plan
    type: io.kestra.plugin.terraform.cli.TerraformCLI
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: hashicorp/terraform:1.5.7
    namespaceFiles:
      enabled: true
    env:
      AWS_ACCESS_KEY_ID: "{{ secret('AWS_ACCESS_KEY_ID') }}"
      AWS_SECRET_ACCESS_KEY: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    beforeCommands:
      - terraform init -input=false
    commands:
      - terraform plan -input=false -lock=false -no-color > terraform-plan.txt
      - cat terraform-plan.txt
    outputFiles:
      - terraform-plan.txt

  - id: opentofu_plan
    type: io.kestra.plugin.opentofu.cli.OpenTofuCLI
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: ghcr.io/opentofu/opentofu:1.9.0
    namespaceFiles:
      enabled: true
    env:
      AWS_ACCESS_KEY_ID: "{{ secret('AWS_ACCESS_KEY_ID') }}"
      AWS_SECRET_ACCESS_KEY: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    beforeCommands:
      - tofu init -input=false
    commands:
      - tofu plan -input=false -no-color -out=tfplan > tofu-plan.txt
      - cat tofu-plan.txt
    outputFiles:
      - tfplan
      - tofu-plan.txt

  - id: approve_cutover
    type: io.kestra.plugin.core.flow.Pause
    description: Compare terraform-plan.txt and tofu-plan.txt, then resume to apply with OpenTofu
    pauseDuration: PT8H
    behavior: CANCEL

  - id: opentofu_apply
    type: io.kestra.plugin.opentofu.cli.OpenTofuCLI
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: ghcr.io/opentofu/opentofu:1.9.0
    namespaceFiles:
      enabled: true
    inputFiles:
      tfplan: "{{ outputs.opentofu_plan.outputFiles['tfplan'] }}"
    env:
      AWS_ACCESS_KEY_ID: "{{ secret('AWS_ACCESS_KEY_ID') }}"
      AWS_SECRET_ACCESS_KEY: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    beforeCommands:
      - tofu init -input=false
    commands:
      - tofu apply -input=false tfplan
```

Worth noticing in this workflow:
- The [Terraform plugin](/plugins/plugin-terraform) and the [OpenTofu plugin](/plugins/plugin-opentofu) run in their own pinned container images through the Docker task runner, so both engine versions coexist without touching the host.
- The plan file leaves the plan task through `outputFiles` and comes back through `inputFiles`: OpenTofu applies exactly the plan the engineer approved, not a fresh one.
- The `Pause` task is an auditable checkpoint between plan and apply: if nobody resumes it within eight hours, the execution is cancelled and nothing is applied. Credentials stay in `secret()` expressions, out of Git and execution logs.

Teams running migration validation can also use the [OpenTofu Terraform migration check blueprint](/blueprints/opentofu-terraform-migration-check) to test plan parity across environments automatically.

## Related pages

- [Terraform Drift Detection](/resources/infrastructure/terraform-drift-detection)
- [Terraform Cloud Alternatives](/resources/infrastructure/terraform-cloud-alternative)
- [Terraform vs Ansible: Differences & How to Use Both Together](/resources/infrastructure/terraform-and-ansible)
- [Infrastructure Resources Hub](/resources/infrastructure)
