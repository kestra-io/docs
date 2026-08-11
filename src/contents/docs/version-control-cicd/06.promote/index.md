---
title: "Promote Flows Across Environments in Kestra"
h1: Promote Flows Between Environments from the UI
sidebarTitle: Promote (EE)
icon: /src/contents/docs/icons/dev.svg
editions: ["EE"]
description: Move flows from dev to staging to production directly from the Kestra UI, with a diff review, confirmation gate, and full promotion history.
---

Promote moves a flow from one environment to another directly from the Kestra UI, with a diff review and confirmation step before anything lands in production.

## When to use Promote

Promote is the right tool when your team authors flows in the UI, uses separate Kestra instances per environment (dev, staging, prod), and does not want to build or maintain a Git pipeline to deploy between them.

If you already treat Git as the source of truth and have a CI/CD pipeline deploying flows on merge, continue using that path. Promote and [Git-based deployment](../04.git/index.md) solve the same problem; Promote trades automation for simplicity. See [Version Control & CI/CD](../index.mdx) for a side-by-side comparison of all deployment paths.

## How it works

Each flow in Kestra EE gains a **Deploy** tab alongside the editor. From the Deploy tab, select a target environment, review the diff between what is currently running there and the revision you are about to promote, and confirm. Gated targets — typically production — require explicit confirmation before the promotion runs.

The flows table gains a **Deploy** column showing drift state at a glance:

| State | Meaning |
|---|---|
| In sync | The target is running this revision |
| Out of sync | The target is running an older revision |
| Not promoted | The flow has never been promoted to this environment |

Every promotion is recorded in full: which revision moved, which target it went to, who confirmed it, and when. The history is available on the Deploy tab.

Flows can also be promoted directly from the editor without switching to the Deploy tab.

## Targets and gates

A target represents a Kestra instance or namespace that flows are promoted into. Targets are configured at the tenant level. Each target can optionally be gated: a gated target presents a diff and requires an explicit confirmation click before the promotion runs. Use gated targets for production environments where you want a review step.

## Promotion history

Every promotion is stored as an auditable record. You can see the full history of what was deployed, when, by whom, and from which revision. This history is visible on the Deploy tab for each flow and, for audit purposes, in the [Audit Logs](../../07.enterprise/02.governance/06.audit-logs/index.md).

## What changes in the target

Promote copies the flow definition (YAML) from the source revision to the target environment. Namespace-level configuration — KV pairs, secrets, variables, namespace files — is not automatically promoted. If the flow depends on namespace resources that differ between environments, those must be managed separately.

## Git as a promotion target (roadmap)

A later release will add Git as a native promotion target. Promoting a flow will push a commit or open a pull request against the configured repository, routing through your existing review process. The UI action stays the same; only the delivery mechanism changes.
