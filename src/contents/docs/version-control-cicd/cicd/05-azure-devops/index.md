---
title: Azure DevOps for Kestra – YAML Pipelines Example
h1: Automate Kestra Flow Deployment with Azure DevOps Pipelines
sidebarTitle: Azure DevOps
icon: /src/contents/docs/icons/dev.svg
description: Build CI/CD pipelines in Azure DevOps to automate the validation and deployment of Kestra flows using YAML configurations.
---

How to use Azure DevOps to create a CI/CD pipeline for your Kestra flows.

## Automate Kestra deployments with Azure DevOps

Azure Pipelines can validate and deploy your Kestra flows on every change to your repository. This page shows two approaches: [`kestractl`](../../../kestra-cli/kestractl/index.md), the command-line client for the Kestra API, and the [Kestra Terraform provider](../../../13.terraform/index.mdx).

:::alert{type="info"}
For flows managed through CI/CD, add the [`system.readOnly`](../../../06.concepts/system-labels/index.md#systemreadonly) label set to `"true"` so the UI editor is disabled and production configurations stay immutable. This is especially recommended for critical production flows:

```yaml
labels:
  system.readOnly: true
```
:::

## Deploy flows with kestractl

This `azure-pipelines.yml` runs on every push to `main`. It installs `kestractl`, validates the flows in the `flows/` directory, and deploys them to the `prod` namespace:

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: ubuntu-latest

variables:
  KESTRACTL_HOST: https://kestra.example.com

steps:
  - script: curl -fsSL https://raw.githubusercontent.com/kestra-io/kestractl/main/install-scripts/install.sh | INSTALL_DIR=$(Agent.TempDirectory) bash
    displayName: Install kestractl

  - script: $(Agent.TempDirectory)/kestractl flows validate flows/
    displayName: Validate flows
    env:
      KESTRACTL_TOKEN: $(KESTRACTL_TOKEN)

  - script: $(Agent.TempDirectory)/kestractl flows deploy flows/ --namespace prod --override --fail-fast
    displayName: Deploy flows
    env:
      KESTRACTL_TOKEN: $(KESTRACTL_TOKEN)
```

- `flows validate` checks each flow against your Kestra instance and fails the step if any flow is invalid.
- `flows deploy` creates the flows, and `--override` updates flows that already exist. `--namespace prod` deploys every flow to `prod`; omit it to keep the namespace written in each flow file.
- The agent must be able to reach your Kestra instance. For a Kestra instance on a private network, use a [self-hosted agent](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/agents).

### Configure credentials

`kestractl` reads its settings from `KESTRACTL_*` environment variables. Pipeline variables such as `KESTRACTL_HOST` are passed to scripts automatically, but secret variables aren't, so map them in each step's `env`, as the example does for `KESTRACTL_TOKEN`.

In the pipeline's **Variables** settings, add `KESTRACTL_TOKEN` with an [API token](../../../07.enterprise/03.auth/api-tokens/index.md) (Enterprise Edition and Cloud) and select **Keep this value secret**. In Open-Source, add `KESTRACTL_USERNAME` and `KESTRACTL_PASSWORD` instead, and map both in `env`. To target a tenant other than `main`, set `KESTRACTL_TENANT`.

## Deploy flows with Terraform

If you manage Kestra resources with the [Kestra Terraform provider](../03.terraform/index.md), run Terraform from the pipeline. This example uses the [Terraform extension](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.custom-terraform-tasks), which you install from **Organization Settings** > **Extensions**, and stores the Terraform state in an S3 bucket:

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: ubuntu-latest

stages:
  - stage: deploy
    jobs:
      - job: terraform
        steps:
          - task: TerraformInstaller@1
            inputs:
              terraformVersion: 'latest'

          - task: TerraformTaskV4@4
            inputs:
              provider: 'aws'
              command: 'init'
              backendServiceAWS: 'aws_s3'
              backendAWSBucketName: '<your-state-bucket>'
              backendAWSKey: 'kestra-tf'

          - task: TerraformTaskV4@4
            inputs:
              provider: 'aws'
              command: 'validate'

          - task: TerraformTaskV4@4
            inputs:
              provider: 'aws'
              command: 'apply'
              environmentServiceNameAWS: 'aws_s3'
```

1. `TerraformInstaller@1` installs Terraform on the agent.
2. The first `TerraformTaskV4@4` task runs `init`. This example keeps the state in AWS S3 through the `aws_s3` service connection; the extension also supports Azure and Google Cloud backends.
3. The second task runs `validate` to check the configuration.
4. The last task runs `apply` to create or update the Kestra resources.

For the provider configuration and flow resources, see [Terraform](../03.terraform/index.md).
