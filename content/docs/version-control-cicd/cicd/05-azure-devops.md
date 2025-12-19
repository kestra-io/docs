---
title: Azure DevOps
icon: /docs/icons/dev.svg
---

How to use Azure DevOps to create a CI/CD pipeline for your Kestra flows.

## Set up an Azure DevOps pipeline

Azure DevOps allows you to automate the validation and deployment of your Kestra flows using YAML-based pipelines. Follow the steps below to configure a simple Terraform-based CI/CD setup.

:::alert{type="info"}
For flows managed through CI/CD, add the [`system.readOnly`](../../06.concepts/system-labels.md#systemreadonly) label set to `"true"` so the UI editor is disabled and production configurations stay immutable. This is especially recommended for critical production flows:

```yaml
labels:
  system.readOnly: true
```
:::

### Connect to your repository

First, connect your pipeline to a code repository such as **GitHub**, **Azure Repos Git**, or **Bitbucket**.

![az-devops-image-repo](/docs/developer-guide/ci-cd/az-devops-image-repo.png)

### Select your repository

Choose the repository where your Kestra flows are stored.

### Configure your pipeline

Start with a minimal pipeline template or an existing configuration.

![az-devops-image-config](/docs/developer-guide/ci-cd/az-devops-image-config.png)

### Example pipeline

Below is a complete example of a Terraform pipeline that validates and deploys Kestra resources.

```yaml
trigger:
  branches:
    include:
      - main

pool:
  name: test-pool

stages:
  - stage: tfvalidate
    jobs:
      - job: deploy
        continueOnError: false
        steps:
          - task: TerraformInstaller@1
            inputs:
              terraformVersion: 'latest'

          - task: TerraformTaskV4@4
            inputs:
              provider: 'aws'
              command: 'init'
              backendServiceAWS: 'aws_s3'
              backendAWSBucketName: 'eu-north-1'
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

### How it works

- The pipeline runs automatically whenever the **`main`** branch is updated (for example, after merging a pull request).  
- The **pool** defines the agent that runs your pipeline. For setup details, refer to the [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/pools-queues?view=azure-devops&tabs=yaml,browser).  
- The **Terraform extension** manages installation, validation, and deployment of Terraform resources.

To install the Terraform extension, navigate to **Organization Settings → Extensions**, then browse the Marketplace to install it.

![image-terraform](/docs/developer-guide/ci-cd/az-devops-image-terraform.png)

### Task breakdown

This pipeline includes one installation step and three Terraform tasks:

1. **Install Terraform** — The `TerraformInstaller@1` task installs Terraform at runtime.  
2. **Initialize Terraform** — The first `TerraformTaskV4@4` runs the `init` command. In this example, the backend uses an AWS S3 bucket, but you can use Azure RM, AWS, or GCP.  
3. **Validate configuration** — The second task runs the `validate` command to ensure the configuration is correct.  
4. **Apply changes** — The final task executes the `apply` command to deploy your Terraform-managed resources.

![image-green-pipeline](/docs/developer-guide/ci-cd/az-devops-image-green-pipleine.png)

---

For more details, refer to the [Kestra Terraform provider documentation](../../13.terraform/index.md).
