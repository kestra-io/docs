---
title: "CI/CD Pipelines in Kestra: Validate and Deploy Flows"
h1: Automate Kestra Flow Validation and Deployment with CI/CD
description: Automate Kestra flow validation and deployment with CI/CD. Integrate with GitHub Actions, GitLab CI, and other pipelines to enforce quality before production.
sidebarTitle: CI/CD Pipeline
icon: /src/contents/docs/icons/dev.svg
---

Automate the validation and deployment of your Kestra flows using CI/CD pipelines.

:::alert{type="info"}
If you are on Kestra Enterprise and want to move flows between environments without building a pipeline, see [Promote](../../07.enterprise/02.governance/promote/index.md), a UI-first alternative that requires no Git or automation setup.
:::

## Automate validation and deployment with CI/CD

Continuous integration and delivery (CI/CD) pipelines enable teams to deploy updates automatically and consistently as soon as they are reviewed and merged into a version control system (VCS) like Git.
This section covers multiple approaches to building a CI/CD pipeline for Kestra, from `kestractl` and GitHub Actions to Terraform.

:::alert{type="info"}
When flows are deployed through CI/CD, add the [`system.readOnly`](/docs/concepts/system-labels#systemreadonly) label set to `"true"` so the UI editor is disabled and production configurations stay immutable. This is especially recommended for critical production flows:

```yaml
labels:
  system.readOnly: true
```
:::

## Why use a CI/CD pipeline?

A pipeline deploys the same reviewed flow definitions the same way every time. It removes manual steps, catches invalid flows before they reach production, and keeps a record of what was deployed and when.

## CI/CD for Kestra flows

Kestra supports several approaches for automating flow validation and deployment. Choose the one that best fits your environment and tooling preferences.

### kestractl

[`kestractl`](../../kestra-cli/kestractl/index.md) is the command-line client for the Kestra API. It validates and deploys flows from any CI system, or from your terminal.

`kestractl` reads its connection settings from environment variables, which suits CI pipelines:

```bash
export KESTRACTL_HOST=http://localhost:8080
export KESTRACTL_TOKEN=<your-api-token>   # Enterprise Edition and Cloud
# In Open-Source, use basic authentication instead:
# export KESTRACTL_USERNAME=<username>
# export KESTRACTL_PASSWORD=<password>
```

On your own machine, you can save the same settings once with `kestractl config add`. See [Quick Setup](../../kestra-cli/kestractl/index.md#quick-setup).

#### Validate and deploy a single flow

```bash
kestractl flows validate flow_directory/myflow.yml
kestractl flows deploy flow_directory/myflow.yml --override
```

#### Validate and deploy multiple flows

```bash
kestractl flows validate flows/
kestractl flows deploy flows/ --namespace prod --override --fail-fast
```

- `flows validate` checks each flow against your Kestra instance and exits non-zero if any flow is invalid, so the pipeline stops before deploying.
- `flows deploy` creates flows, and `--override` updates flows that already exist. Existing flows that aren't in the directory are kept.
- `--namespace` deploys every flow to one namespace. Omit it to keep the namespace written in each flow file, or use `--namespace-prefix` to prepend a prefix such as `staging` to each flow's namespace.

To make the repository the single source of truth and delete flows that aren't in it, use `kestractl flows namespace-sync`. For every command and option, see the [`kestractl` reference](../../kestra-cli/kestractl/index.md).

### Automate deployments within Kestra

To deploy from Git without an external CI system, run the deployment as a Kestra flow. The [SyncFlows](/plugins/plugin-git/io.kestra.plugin.git.syncflows) and [SyncNamespaceFiles](/plugins/plugin-git/io.kestra.plugin.git.syncnamespacefiles) tasks read a Git branch and apply its flows and namespace files to Kestra, on a schedule or on every push through a GitHub webhook. See [Sync from Git](../04.git/02.sync-from-git/index.md).

### Deploy flows with GitHub Actions

Kestra provides [official GitHub Actions](https://github.com/kestra-io/kestra-actions) to validate and deploy flows:

- [`validate-flows`](https://github.com/kestra-io/validate-flows-action-v2): validate flows in a directory against a Kestra server.
- [`deploy-flows`](https://github.com/kestra-io/deploy-flows-action-v2): create or update flows from a directory.
- [`deploy-namespace-files`](https://github.com/kestra-io/deploy-namespace-files-action): deploy namespace files from a local path.

Each action installs and runs `kestractl` for you. See [GitHub Actions](./01.github-action/index.md) for every input.

#### Example GitHub Actions workflow

```yaml
name: Kestra CI/CD
on:
  push:
    branches:
      - main
jobs:
  prod:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate flows
        uses: kestra-io/validate-flows-action-v2@main
        with:
          directory: ./flows/prod
          server: ${{secrets.KESTRA_HOSTNAME}}
          user: ${{secrets.KESTRA_USER}}
          password: ${{secrets.KESTRA_PASSWORD}}
      - name: Deploy prod
        uses: kestra-io/deploy-flows-action-v2@main
        with:
          namespace: prod
          directory: ./flows/prod
          server: ${{secrets.KESTRA_HOSTNAME}}
          user: ${{secrets.KESTRA_USER}}
          password: ${{secrets.KESTRA_PASSWORD}}
      - name: Deploy prod-marketing
        uses: kestra-io/deploy-flows-action-v2@main
        with:
          namespace: prod.marketing
          directory: ./flows/prod.marketing
          server: ${{secrets.KESTRA_HOSTNAME}}
          user: ${{secrets.KESTRA_USER}}
          password: ${{secrets.KESTRA_PASSWORD}}
```

:::alert{type="info"}
You can also authenticate using an [API token](/docs/enterprise/auth/api-tokens) instead of username and password:

```yaml
with:
  server: ${{secrets.KESTRA_HOSTNAME}}
  apiToken: ${{secrets.KESTRA_API_TOKEN}}
```
:::

### Deploy flows with GitLab CI and Bitbucket Pipelines

GitLab CI and Bitbucket Pipelines run `kestractl` in the `kestra/kestractl` image. See [GitLab CI](./02.gitlab/index.md) and [Bitbucket Pipes](./06.bitbucket-pipes/index.md) for complete pipelines.

### Deploy flows with Terraform

With the [Kestra Terraform provider](../../13.terraform/index.mdx), you manage flows as infrastructure as code, alongside the rest of your cloud infrastructure.

This configuration deploys every flow in the `flows` directory. Each flow's ID and namespace come from its file:

```hcl
terraform {
  required_providers {
    kestra = {
      source  = "kestra-io/kestra"
      version = "~> 2.0"
    }
  }
}

provider "kestra" {
  url       = "http://localhost:8080"
  api_token = var.kestra_api_token # Enterprise Edition and Cloud
  # In Open-Source, use basic authentication instead:
  # username = var.kestra_username
  # password = var.kestra_password
}

resource "kestra_flow" "flows" {
  for_each = fileset(path.module, "flows/*.yml")
  content  = file(each.value)
}
```

Then run the following commands:

```bash
terraform init        # Download the Kestra provider
terraform validate    # Validate both the configuration and your flows
terraform apply -auto-approve   # Deploy your flows automatically
```

## Next steps

- [GitHub Actions](./01.github-action/index.md)
- [GitLab CI](./02.gitlab/index.md)
- [Terraform](./03.terraform/index.md)
- [Azure DevOps](./05-azure-devops/index.md)
- [Bitbucket Pipes](./06.bitbucket-pipes/index.md)
- [`kestractl` reference](../../kestra-cli/kestractl/index.md)
