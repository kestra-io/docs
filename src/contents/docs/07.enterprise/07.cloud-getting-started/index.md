---
title: "Kestra Cloud: Getting Started"
h1: Getting Started with Kestra Cloud
description: Set up your Kestra Cloud instance, run your first flow, add secrets, invite your team, and connect to production.
sidebarTitle: Cloud Getting Started
icon: /src/contents/docs/icons/admin.svg
editions: ["Cloud"]
---

Kestra Cloud is a fully managed Kestra instance run by the Kestra team. You build the pipelines; Kestra handles hosting, scaling, upgrades, SSO, and secrets.

## Two places you'll work

Kestra Cloud consists of two platforms:

- **[Console](https://console.kestra.io/ui/login):** where you create, monitor, and manage your instances and billing.
- **Your Kestra instance:** where you and your team build and run flows.

| | Console | Your Kestra instance |
|---|---|---|
| For | Managing instances and billing | Building and running flows |
| What | View instances, usage, and invoices; set up SSO; add Console users | Write flows, run executions, add secrets, invite teammates, configure IAM/RBAC, build Apps |

:::alert{type="info"}
Console users and instance users are separate. Adding someone in Console does not give them access to the instance, and vice versa. Invite people where they'll actually work (usually the instance). SSO is configured in Console per instance.
:::

## Step 1: Log in

Go to your instance URL, or sign in to **[Console](https://console.kestra.io/ui/login)** to find it. Sign-in is passwordless: enter the login code emailed to you.

If the code doesn't arrive, your email security filter is likely blocking it. Allowlist **noreply@kestra.io**, check spam, then request a new code.

Whoever creates the instance becomes its **Instance Owner**: the role that manages instances, users, and IAM across the whole instance.

:::alert{type="info"}
Instance Owner does not grant access to namespaces or data by default. Working with flows also requires a tenant role (see [Step 5](#step-5-invite-your-team)).
:::

## Step 2: Run your first flow from a blueprint

Three getting-started blueprints run successfully on the first execution with public data and no secrets required. Pick one based on your use case:

| Blueprint | Use for | What it does |
|---|---|---|
| [ELT pipeline](https://kestra.io/blueprints/getting-started-elt-pipeline) | Data pipelines | Public CSV → aggregate in DuckDB → log top products |
| [AI enrichment](https://kestra.io/blueprints/getting-started-ai-enrichment) | AI / LLM work | Fetch records → log a preview; add a key to summarize and classify |
| [Automation](https://kestra.io/blueprints/getting-started-automation) | Alerts / ops | Call an API → log the response; add a Slack alert and a trigger |

In your instance: go to **Flows → Create → Blueprints**, pick one, **Save**, then **Execute**. Open the run and review the **Logs**, the **Gantt** timeline, and each task's **Outputs**. Edit, execute, review the run: that's the core loop.

Hundreds more are available in the [blueprints library](https://kestra.io/blueprints). The [AI Copilot](../../ai-tools/01.ai-copilot/index.md) can also write a flow from a plain-English description.

Building with AI tools? The [Kestra MCP server](../../ai-tools/03.mcp-server/index.md) gives Claude, Cursor, and other tools live access to Kestra docs, plugins, and blueprints. Add [kestractl](https://github.com/kestra-io/kestractl) to generate and deploy flows from the CLI.

Prefer your editor? The [VS Code extension](../../version-control-cicd/05.vscode/index.md) edits, validates, and runs flows locally with instance-aware autocomplete and a topology preview.

## Step 3: Namespaces

Every flow belongs to a [namespace](../../05.workflow-components/02.namespace/index.md) (for example, `mycompany`): a folder that holds flows, secrets, files, and variables. Three rules to follow:

- **Create your own** namespace (for example, `dev`) and build there. Leave `system` alone; it holds Kestra's own maintenance flows.
- **Nest with `.` to share config.** `marketing.dev` and `marketing.prod` are two environments under `marketing`. Both inherit the parent's secrets, variables, and files, so shared config lives in one place.
- **Split `dev` from `prod`.** When flows matter, use separate namespaces and promote between them (see [Step 6](#step-6-go-to-production)) so only reviewed work reaches production.

## Step 4: Add your first secret

Store credentials as [secrets](../../06.concepts/04.secret/index.md) and reference them with `{{ secret('NAME') }}`. Never paste credentials directly into a flow.

To add a Slack webhook (used by all three getting-started blueprints):

1. In your instance: go to **Namespaces → your namespace → Secrets → Add**. Name the key `SLACK_WEBHOOK`.
2. In the blueprint's `notify` task, remove `disabled: true` and run it. You'll receive a Slack message.

Use the same pattern for a `DB_PASSWORD` to point the ELT blueprint at your own warehouse.

Secrets are namespace-scoped but readable across namespaces in the same tenant, so shared tokens can live in one place:

```yaml
message: "{{ secret('SHARED_TOKEN', namespace='shared') }}"
```

Cross-namespace reads are allowed by default. Restrict them with `allowedNamespaces` on the owning namespace.

[Policies](../02.governance/policies/index.md) set plugin values (host, credentials, region) once per namespace and apply them to every matching flow. Use them to avoid repeating auth config on every task.

## Step 5: Invite your team

Go to **Tenant → IAM → Invitations → Create**: enter their email and assign a role. For people building flows, **Developer** is the best fit (**Editor** and **Admin** also work). Avoid Instance Owner — that role manages the instance, not the data.

Leave the namespace field empty to apply the role to all namespaces, or name specific namespaces to limit access.

Related:
- [Invite colleagues](../03.auth/invitations/index.md)
- [Set up SSO](../03.auth/sso/index.md) (configured in [Console](https://console.kestra.io/ui/login))

## Step 6: Go to production

Once flows matter, stop editing production by hand. Build in `dev`, commit to Git, and let Git be the source of truth for `prod`. Common patterns — combinable:

| Method | Best for |
|---|---|
| [Git Sync](../../version-control-cicd/04.git/index.md) | Flows and namespace files: Kestra pulls `main` on a schedule or push |
| [Terraform](../../13.terraform/index.mdx) | Static config: secrets, variables, namespaces, roles |
| GitHub Actions / CI/CD | Validate on PR, deploy on merge: [validate flows](https://github.com/kestra-io/validate-flows-action-v2), [deploy flows](https://github.com/kestra-io/deploy-flows-action-v2), [deploy namespace files](https://github.com/kestra-io/deploy-namespace-files-action) |

No Git? [Promote](../02.governance/promote/index.md) copies a flow from one instance to another directly from the UI with a diff review before it lands. It moves the flow YAML only, so configure secrets and files per environment separately. See the [dev-to-prod guide](../../14.best-practices/1.from-dev-to-prod/index.md) for the full picture.

## What's next

In the order most active teams adopt them:

1. **Put it on a [schedule or trigger](../../05.workflow-components/07.triggers/index.mdx)** so it runs unattended.
2. **Wire a Slack alert** (Step 4) so you know when something breaks.
3. **Connect a second system**: your warehouse, dbt, an API.
4. **Sync from Git** (Step 6).
5. **Create a Kestra App.** An [App](../04.scalability/apps/index.md) gives stakeholders a dedicated URL to submit or download data and approve runs without touching flows directly.

Common first-week blockers:

- Credentials not reaching a task: [Secrets](../../06.concepts/04.secret/index.md)
- A worker that can't reach your network: [Worker Groups](../04.scalability/worker-group/index.md)
- Cloud auth or OIDC trust issues: [Credentials](../03.auth/credentials/index.md)

For help, reach the team at support@kestra.io, in the [Slack community](https://kestra.io/slack), or by replying to your onboarding email.
