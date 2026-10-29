---
title: "What Is GitOps? Principles, Tools, and GitOps for Workflows"
description: "GitOps runs systems from a desired state declared in Git, with automated agents that pull that state and reconcile reality to it. This guide covers the four OpenGitOps principles, pull vs push, GitOps vs CI/CD and IaC, the tools, the failure modes, and how to apply GitOps to workflows and operations, not only Kubernetes deployments."
metaTitle: "What Is GitOps? Principles, Tools & Workflows | Kestra"
metaDescription: "GitOps explained: the 4 OpenGitOps principles, pull vs push, GitOps vs CI/CD and IaC, and how to run workflows and infra runbooks from Git with Kestra."
tag: infrastructure
date: 2026-05-02
lastUpdated: 2026-10-26
faq:
  - question: "What are the four GitOps principles?"
    answer: "The OpenGitOps project (CNCF) defines four: the desired state is declarative; it is versioned and immutable, with a complete history; software agents pull it automatically from the source; and those agents continuously reconcile the live system toward it. A CI job that runs kubectl apply after a merge meets the first two but not the last two, which is why it is CI/CD with Git, not GitOps."
  - question: "What is the difference between GitOps and CI/CD?"
    answer: "CI/CD automates building, testing, and shipping software; GitOps is a specific way to do the deployment part. In classic CI/CD the pipeline pushes changes into the target with credentials to it. In GitOps the pipeline stops at a commit, and an agent inside the target pulls that commit and keeps reconciling. Most teams run both: CI builds the image, GitOps deploys it."
  - question: "Does GitOps work for stateful applications, or does it create drift?"
    answer: "It works for the configuration of stateful systems, not for their data. GitOps can declare a database's version, replicas, and storage class, but not the rows inside it. Drift appears when controllers or humans mutate fields Git also declares, such as autoscaler replica counts. Exclude those fields from reconciliation, run schema migrations as versioned workflow steps, and keep runtime state and secret values out of Git."
  - question: "What is a GitOps operator?"
    answer: "A GitOps operator is the agent that does the pulling and reconciling: it watches a Git repository, compares the declared state with the live state, and applies the difference. Argo CD and Flux are the common operators for Kubernetes. For workflows, a scheduled Kestra flow running the git SyncFlows task plays the same role: it pulls flow definitions from a branch and overwrites anything that drifted."
  - question: "Can you use GitOps for workflows and automation, not just Kubernetes?"
    answer: "Yes. Any system whose desired state can be declared as files qualifies. Workflows defined as YAML, such as Kestra flows, fit directly: the repository holds every flow and script, pull requests become the change-control gate, a sync task or CI job applies merged changes, and git revert rolls a pipeline or runbook back to its previous definition."
  - question: "What are the best GitOps tools for managing infrastructure state and rollbacks?"
    answer: "It depends on what the state is. Argo CD and Flux reconcile Kubernetes resources and roll back by reverting a commit. Terraform or OpenTofu, driven from pull requests, manage cloud resources, with drift found by a scheduled plan. Crossplane reconciles cloud resources through Kubernetes controllers. For the workflows and runbooks that tie these together, an orchestrator that syncs its definitions from Git closes the gap."
---

GitOps is a way of operating systems in which the desired state of everything you run is declared in files stored in Git, and automated agents pull that state and continuously reconcile the live system to match it. Git becomes the single source of truth: the only way to change production is to change the repository, and the only way the repository reaches production is through an agent that applies it and corrects drift.

Most GitOps guides stop at Kubernetes deployments. That is where the practice was born and where Argo CD and Flux live. But the same discipline applies to the things platform teams change most often and govern least: the pipelines, scheduled automations, and infrastructure runbooks that sit around the clusters. This guide covers the definition and principles, the trade-offs, and then the practitioner part: how to run workflow orchestration the GitOps way.

> **TL;DR** — GitOps = declarative desired state in Git + agents that pull and continuously reconcile it. It is a deployment model, not a synonym for "CI/CD with Git". It handles configuration well and runtime state badly, so drift, secrets, and stateful data need explicit design. The same model works for workflows: flows as YAML in Git, pull requests as change control, a sync task or CI job to apply, and `git revert` as rollback.

## GitOps defined: Git holds the desired state, agents enforce it

GitOps treats a Git repository as the authoritative description of what should be running, and treats every difference between that description and reality as something to fix automatically. The term was coined by Weaveworks in 2017 to describe how they ran Kubernetes clusters: no one ran `kubectl apply` against production; an in-cluster agent applied whatever was on the main branch.

Three properties separate GitOps from "we keep our YAML in Git":

- The repository is the only write path. Engineers change production by opening a pull request, never by editing the live system.
- An agent, not a person or a CI job, applies the change, and it does so from inside or next to the target environment.
- The agent keeps comparing declared and live state after the deployment, so manual changes are reverted or flagged instead of silently persisting.

The result is an audit trail you get for free (every change is a commit with an author, a reviewer, and a reason), a rollback path that is a `git revert`, and a recovery story where rebuilding an environment means pointing a fresh agent at the repository. GitOps builds on [infrastructure and pipelines defined as code](/resources/infrastructure/everything-as-code), but adds the reconciliation loop that keeps the code and the running system from diverging.

## The four OpenGitOps principles

The vendor-neutral definition comes from [OpenGitOps](https://opengitops.dev/), a CNCF project run by the GitOps Working Group. Its four principles are short enough to quote and strict enough to disqualify a lot of setups that call themselves GitOps.

1. **Declarative.** The desired state of the system is expressed declaratively: what should exist, not the commands to get there. Kubernetes manifests, Helm values, Terraform configurations, and YAML workflow definitions all qualify. A shell script that provisions a server does not.
2. **Versioned and immutable.** Desired state is stored in a way that enforces immutability and versioning and keeps a complete history. Git is the usual store, but the principle names the property, not the tool. An OCI registry holding versioned artifacts also satisfies it.
3. **Pulled automatically.** Software agents pull the desired state from the source. Nothing outside the target pushes changes in.
4. **Continuously reconciled.** Agents keep observing the actual state and applying the desired state, so drift gets corrected without a new deployment.

Two consequences matter in practice. First, Git is conventional, not mandatory: the principles are about immutable, versioned desired state. Second, principles 3 and 4 are what most "GitOps" pipelines skip. A CI job that runs on merge and applies manifests is declarative and versioned, but it pushes, and it never looks at the system again until the next merge.

## Pull vs push: the deployment model is what makes it GitOps

The pull model is the defining architectural choice in GitOps: the agent that applies changes lives with the target and reaches out to the repository, instead of an external pipeline reaching into the target.

| Dimension | Push-based deployment (classic CI/CD) | Pull-based deployment (GitOps) |
|---|---|---|
| Who applies the change | CI runner after merge | Agent running in or next to the target |
| Credentials | CI holds write credentials to production | Agent holds read access to Git; CI needs no production access |
| Trigger | Pipeline event (merge, tag) | Polling interval or a Git webhook that prompts a pull |
| Drift after deploy | Undetected until the next run | Detected and corrected on every reconcile cycle |
| Rollback | Re-run an old pipeline or a rollback job | Revert the commit; the agent converges |
| Failure mode | Partial apply if the pipeline dies mid-run | Agent retries until state converges or alerts |
| Network direction | Inbound into the environment | Outbound from the environment to Git |
| Typical tools | GitHub Actions, GitLab CI, Jenkins | Argo CD, Flux |

Push is not wrong. It is simpler to start with, works for targets that cannot run an agent, and is how most teams deploy to SaaS APIs. But it gives up the two properties that make GitOps resilient: no standing production credentials outside the environment, and continuous correction of drift. Argo CD, for example, polls its repositories every three minutes by default and can be told to refresh immediately through a Git webhook, which keeps the pull model while removing most of the latency.

## GitOps vs CI/CD vs DevOps vs infrastructure as code

These four terms overlap, and search results blur them. They sit at different levels: DevOps is a culture, IaC and CI/CD are practices, and GitOps is an operating model that combines them under a specific deployment rule.

| Dimension | DevOps | Infrastructure as code (IaC) | CI/CD | GitOps |
|---|---|---|---|---|
| What it is | Culture and organizational model | Practice of defining infrastructure in files | Practice of automating build, test, and release | Operating model for deployment and drift control |
| Scope | Whole delivery lifecycle | Provisioning and configuration | Code to artifact to environment | Desired state to running system, continuously |
| Primary artifact | Shared ownership, feedback loops | Terraform, OpenTofu, Ansible, CloudFormation files | Pipeline definitions | Declarative state in a versioned repository |
| Deployment direction | Not prescribed | Usually pushed (`terraform apply`) | Usually pushed | Pulled by an agent |
| Drift handling | Not prescribed | Detected on the next plan | Not addressed | Continuous reconciliation |
| Rollback | Not prescribed | Re-apply previous config | Re-run previous release | Revert the commit |
| Typical tools | Any | Terraform, OpenTofu, Pulumi, Ansible | GitHub Actions, GitLab CI, Jenkins | Argo CD, Flux, Git-synced orchestrators |
| Relationship | Umbrella | GitOps applies it with a reconciler | GitOps replaces its deploy stage | Uses IaC and CI/CD, adds pull and reconcile |

The short version: IaC tells you how to describe infrastructure, CI/CD tells you how to ship changes, and GitOps tells you who is allowed to apply them and how the system stays honest afterwards. A team can do IaC and CI/CD without GitOps; it cannot do GitOps without declarative definitions. The same idea extends to delivery definitions themselves, covered in [pipeline as code](/resources/infrastructure/pipeline-as-code).

## GitOps tools: Argo CD and Flux for clusters, other tools for everything else

Argo CD and Flux are the two GitOps operators most teams mean when they say "GitOps tool". Both are CNCF graduated projects, both reconcile Kubernetes resources from Git, and the choice between them is mostly about operating style.

- [Argo CD](https://argo-cd.readthedocs.io/en/stable/) ships a web UI, an Application custom resource, sync waves and hooks, and the app-of-apps pattern for managing many applications from one parent. It suits teams that want a visual view of sync status. The [Argo CD guide](/resources/infrastructure/argocd) covers its architecture in depth.
- [Flux](https://fluxcd.io/flux/) is a set of composable controllers (source, kustomize, helm, notification) with no built-in UI and native SOPS decryption. It suits teams that want everything expressed as Kubernetes resources.

Both stop at the cluster boundary. Infrastructure outside Kubernetes and the operational workflows around it need other tools:

| Kind of state | Common GitOps-style tooling | How rollback works |
|---|---|---|
| Kubernetes workloads and config | Argo CD, Flux | Revert the commit; the operator converges |
| Cloud resources (networks, databases, IAM) | Terraform or OpenTofu driven from pull requests (for example with Atlantis), or Crossplane controllers | Revert and re-apply; Crossplane reconciles continuously, Terraform on the next apply |
| Configuration of existing servers | Ansible from a Git-triggered pipeline | Re-run the previous playbook version |
| Pipelines, automations, runbooks | An orchestrator that syncs its definitions from Git | Revert the commit; the sync restores the previous definition |

Terraform is the important nuance. It is declarative and versioned, but it does not reconcile on its own: drift stays invisible until someone runs a plan. Teams close that gap with a scheduled plan that alerts on changes, a pattern detailed in [Terraform drift detection](/resources/infrastructure/terraform-drift-detection).

## Where GitOps breaks: drift, secrets, and stateful configuration

GitOps reconciles declared configuration. Every hard GitOps problem comes from something that is not declared configuration: runtime state, secret values, fields other controllers own, and differences between environments.

### Drift from controllers, not just humans

The textbook drift scenario is an engineer running `kubectl edit` in production. The more common one is a controller doing its job. A HorizontalPodAutoscaler changes `replicas`, a mutating webhook injects a sidecar, a cloud provider adds default tags. If Git also declares those fields, the GitOps operator and the controller fight forever. The fix is to declare ownership explicitly: remove the field from the manifest, or tell the operator to ignore it (Argo CD's `ignoreDifferences` exists for this). Self-heal should be on for fields Git owns and off for fields it does not.

### Secrets do not belong in the repository

A GitOps repository is read by every agent, every CI job, and often every engineer, so plaintext secrets in it are a breach waiting for a clone. The three standard patterns are encrypted secrets committed to Git (Sealed Secrets, SOPS), references resolved at runtime from a secrets manager (External Secrets Operator, Vault), or platform-native secret stores that the declared config only names. In every case, Git holds the reference and the access policy, never the value.

### Stateful applications: configuration yes, data no

GitOps handles the configuration of stateful systems well: database version, replica count, storage class, backup schedule. It cannot handle the data. A database's rows, a queue's backlog, and a volume's contents are not desired state, and reverting a commit does not un-run a migration. Two rules keep stateful systems sane under GitOps. Run schema migrations and data operations as explicit, versioned workflow steps with their own ordering and approvals, not as something the reconciler applies opportunistically. And treat backup and restore as operations a workflow performs, because a `git revert` restores the definition of a database, not its contents.

### Environment sprawl

Every environment needs slightly different values: replica counts, endpoints, feature flags. Branch-per-environment repositories look tidy and decay fast, because promotions become merges between long-lived branches and differences hide in merge history. Directory-per-environment on a single main branch, with overlays (Kustomize) or per-environment values files (Helm), keeps every difference visible in one diff and makes promotion a reviewed file change.

### Operational discipline is the real cost

Once Git is the production control plane, it needs production-grade governance: protected branches, required reviews, CODEOWNERS on sensitive paths, signed commits where compliance demands it, and an emergency path that still goes through Git. Teams that adopt the tooling without the discipline end up with a reconciler applying unreviewed commits, which is worse than no GitOps. Encoding the review rules themselves as code is the job of [policy as code](/resources/infrastructure/policy-as-code).

## GitOps beyond Kubernetes: workflows and operations belong in Git too

GitOps adoption usually covers application manifests and stops there. Meanwhile, the systems that change production most often run outside that loop: the ETL pipeline edited in a UI on Friday, the certificate-renewal job living in a cron table on one VM, the incident runbook that exists as a wiki page and a folder of scripts. These are operations, they have blast radius, and they are typically the least reviewed changes a platform team makes.

Applying GitOps to them means holding them to the same four principles:

| OpenGitOps principle | Applied to clusters | Applied to workflows and runbooks |
|---|---|---|
| Declarative | Manifests describe resources | Workflow definitions describe tasks, triggers, retries, and dependencies as YAML |
| Versioned and immutable | Manifests committed to Git | Every flow and its scripts committed to Git; pull requests are the only edit path |
| Pulled automatically | Operator pulls from the repo | The orchestrator pulls definitions from a branch on a schedule or on a Git webhook |
| Continuously reconciled | Operator corrects live drift | Scheduled sync overwrites UI edits with the Git version, or a dry run reports the difference |

The payoff is concrete. A change to a patching runbook gets a code review and a diff, like a change to a Deployment. A bad edit to a nightly pipeline rolls back with `git revert` instead of someone reconstructing yesterday's version from memory. And the question "what exactly was running in production on March 3rd" has an answer in commit history. This requires workflows that are declarative to begin with: a definition the orchestrator can apply as a whole, not an imperative program whose behavior depends on how it was deployed.

## How to run workflow orchestration the GitOps way with Kestra

Kestra defines every workflow (a flow) as a YAML file, which makes it a direct fit for GitOps: flows, their scripts, and their triggers are plain files that can live in Git, be reviewed in pull requests, and be applied by an agent. Kestra supports two GitOps-compatible deployment patterns: Kestra pulls from Git with its own sync tasks, or a CI pipeline pushes to Kestra on merge. Both keep Git as the source of truth; only the first follows the pull and reconcile principles end to end.

### Lay out the repository by namespace

Namespaces are how Kestra groups flows by team or domain, and they map cleanly onto repository folders. A typical operations repository looks like this:

```text
ops-workflows/
  _flows/
    certificate-renewal.yaml        # deployed to company.ops
    patching/
      monthly-os-patching.yaml      # deployed to company.ops.patching
    incident/
      disk-cleanup-runbook.yaml     # deployed to company.ops.incident
  _files/
    scripts/
      rotate_certs.py               # namespace file used by certificate-renewal
```

Flow definitions go under `_flows` and supporting scripts, SQL, and config under `_files`, which Kestra stores as namespace files that flows can reference. Subfolders under `_flows` map to child namespaces when you enable child-namespace sync.

### Pattern 1: Kestra pulls from Git and reconciles

The [git plugin](/plugins/plugin-git) provides the sync tasks. `io.kestra.plugin.git.SyncFlows` imports flows from a branch into a target namespace and rewrites each flow's namespace to that target, which is what lets the same repository feed different instances. `io.kestra.plugin.git.SyncNamespaceFiles` does the same for scripts and files. With `delete: true`, both remove anything absent from Git, which makes the sync authoritative. Per the [Git version control docs](/docs/version-control-cicd/git), a sync applies the Git version over any conflicting edit made in the UI.

The flow below is the GitOps agent for the `company.ops` namespace. It runs on every push to `main` through a GitHub webhook and every 15 minutes as a reconcile loop, so a change made by hand in the UI survives at most one cycle.

```yaml
id: gitops-sync-company-ops
namespace: company.platform

description: |
  GitOps agent for company.ops. Applies the main branch of ops-workflows
  on every push, and re-applies it every 15 minutes to undo drift.

# Webhook and schedule can fire close together; run one sync at a time.
concurrency:
  limit: 1

tasks:
  # Sync scripts first so flows never reference a file that is not there yet.
  - id: sync-namespace-files
    type: io.kestra.plugin.git.SyncNamespaceFiles
    url: https://github.com/acme/ops-workflows
    branch: main
    username: "{{ secret('GIT_USERNAME') }}"
    password: "{{ secret('GIT_TOKEN') }}"
    gitDirectory: _files
    namespace: company.ops
    delete: true

  - id: sync-flows
    type: io.kestra.plugin.git.SyncFlows
    url: https://github.com/acme/ops-workflows
    branch: main
    username: "{{ secret('GIT_USERNAME') }}"
    password: "{{ secret('GIT_TOKEN') }}"
    gitDirectory: _flows
    targetNamespace: company.ops
    # _flows/patching -> company.ops.patching, _flows/incident -> company.ops.incident
    includeChildNamespaces: true
    # Git is authoritative: flows deleted from the repo are deleted from Kestra.
    delete: true

errors:
  - id: alert-platform-team
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "GitOps sync of company.ops from main failed (execution {{ execution.id }}). Check the sync diff before re-running."

triggers:
  # GitHub push webhook (content type application/json); only pushes to main start a sync.
  - id: on-push-to-main
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('GITOPS_WEBHOOK_KEY') }}"
    when: "{{ trigger.body.ref == 'refs/heads/main' }}"

  # Reconcile loop: re-apply Git even when nothing was pushed.
  - id: reconcile-every-15-min
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/15 * * * *"
```

A few choices in this flow are deliberate. The sync flow lives in `company.platform`, outside the namespace it manages, so `delete: true` can never remove the agent itself. Both triggers feed the same flow, and the flow-level concurrency limit queues the second run instead of letting two syncs race. The sync is not retried on failure: a sync with deletes enabled should be inspected, not replayed blindly. In Kestra 2.0, Git sync tasks call the Kestra API, so they need SDK credentials: derived automatically from basic auth on open source, set as namespace or tenant defaults in the Enterprise Edition, or passed inline with the task's `auth` property.

For larger setups, `io.kestra.plugin.git.NamespaceSync` and `io.kestra.plugin.git.TenantSync` sync a whole namespace or tenant with an opinionated folder layout. They take an explicit `sourceOfTruth` (`GIT` or `KESTRA`), a `whenMissingInSource` policy (`DELETE`, `KEEP`, or `FAIL`), and `protectedNamespaces` that are never deleted; the [namespace sync blueprint](/blueprints/namespace-sync-from-git) shows a 15-minute reconcile loop. In the Enterprise Edition they also sync apps, unit tests, dashboards, and custom blueprints.

### Pattern 2: CI pushes to Kestra on merge

If your organization already standardizes on CI-driven deploys, Kestra fits that model too. The pipeline validates flows on every pull request and deploys them on merge, using the official GitHub Actions (`kestra-io/validate-flows-action-v2` and `kestra-io/deploy-flows-action-v2`), the Kestra CLI (`kestra flow validate`, then `kestra flow namespace update`), or the `kestra_flow` resource of the Kestra Terraform provider. The [CI/CD docs](/docs/version-control-cicd/cicd) cover each option. With the CLI, omitting `--no-delete` makes the directory authoritative, so flows missing from Git are removed.

This is push-based, so it gives up continuous reconciliation. Compensate with the `system.readOnly: true` label on production flows, which disables the UI editor; in the Enterprise Edition, server-side updates to read-only flows are also restricted to service accounts and API keys. Teams that already orchestrate their delivery stages around Kestra often combine the two, as described in [CI/CD orchestration](/resources/infrastructure/ci-cd-orchestration).

| | Pull (sync tasks) | Push (CI on merge) |
|---|---|---|
| Who applies | A Kestra flow on a schedule or webhook | GitHub Actions, GitLab CI, CLI, or Terraform |
| Credentials | Kestra holds a Git read token | CI holds Kestra API credentials |
| Drift correction | Every reconcile cycle | None; prevent it with `system.readOnly` |
| Best for | Teams that want strict GitOps semantics | Teams with established CI deploy pipelines |

### Pull requests are the change-control gate

Once flows only reach production through Git, the pull request becomes the approval workflow for operations. Branch protection requires a review before a runbook change merges, CODEOWNERS routes changes under `_flows/incident/` to the on-call team, and CI runs flow validation so a malformed YAML never reaches main. The review diff is readable because flows are declarative: a reviewer sees "retry raised from 3 to 5 attempts" or "new task calls the patching API", not a change to an opaque deploy script. In the Enterprise Edition, Policies add a second check inside Kestra itself, enforcing rules on flows at save time and execution time per namespace.

### Rollback is `git revert`

To roll back a bad change, revert the commit and merge the revert. The webhook fires, the sync applies the previous definition, and Kestra records the change as a new revision in the flow's [revision history](/docs/concepts/revision), so the timeline shows both the bad change and its rollback. Two caveats apply. A revert restores the workflow definition, not the effects of executions that already ran: if the bad version deleted files or changed infrastructure, recovery is its own workflow. And drafts saved in the editor are neither executed nor pushed to Git, so experimentation in the UI does not leak into production.

### Handling drift deliberately

Drift in an orchestrator means a flow edited in the UI, a script uploaded by hand, or a flow created outside Git. The scheduled sync above corrects it automatically. If you prefer to see drift before overwriting it, run a second flow with `dryRun: true` on the sync tasks: it computes the diff between Git and Kestra without applying anything, which turns the reconcile loop into a drift report you can route to a channel or an approval step. Combined with `system.readOnly` on production flows, this leaves Git as the only path that changes production.

### Environments: separate instances, one repository

Kestra's own guidance is to run at least two instances, development and production, rather than separating environments by tenant or namespace, because tenants share the same underlying resources (see [managing environments](/docs/best-practices/manage-environments)). The GitOps mapping follows: one repository, a sync flow per instance, each pointed at its branch or directory, with `targetNamespace` rewriting namespaces where they differ. Environment-specific values stay out of flow definitions: they come from secrets (`secret()`), namespace variables, or the KV store configured per instance. Namespaces as lightweight environments are fine for getting started on open source, but not for critical operations. For teams that author in the UI and do not want a Git pipeline, Promote (Enterprise Edition) moves flows between instances with a diff review and a confirmation gate; it solves the same problem without GitOps semantics.

## GitOps best practices that hold for clusters and workflows alike

The practices that make GitOps work do not depend on whether the desired state is a Deployment or a runbook.

- Make Git the only write path. Out-of-band changes, even during incidents, go through a pull request afterwards or get reverted by the next reconcile.
- Keep application source and deployment configuration in separate repositories or at least separate paths, so a code change and a rollout are distinct, reviewable events.
- Use directories, not long-lived branches, for environments, and promote by changing files in a reviewed pull request.
- Validate before merge: schema checks, flow validation, policy checks, and a dry-run diff in CI catch errors while they are still cheap.
- Turn on deletion only after a dry run. Authoritative syncs (`delete: true`, `whenMissingInSource: DELETE`, `prune`) are what make Git the truth, and also what make a misconfigured path dangerous.
- Store references to secrets, never secret values, and give the agent read-only Git credentials.
- Decide which fields Git owns. Ignore the ones controllers manage, and let reconciliation enforce the rest.
- Monitor the agent. A sync that fails silently turns a GitOps setup back into a manual one without anyone noticing.

As GitOps matures inside a platform team, the boundary of "what lives in Git" keeps moving outward: first manifests, then infrastructure, then the workflows that provision, patch, and recover that infrastructure. Treating those workflows as declarative, reviewed, reconciled code is what closes the loop. To try it on your own repository, start from the [Git sync blueprint](/blueprints/git-sync-flows-source-of-truth) with `dryRun: true`, read the diff, then turn on deletes.
