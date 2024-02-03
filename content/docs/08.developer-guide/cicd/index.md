---
title: Create a CI/CD pipeline
icon: /docs/icons/ci.svg
---

Kestra provides several ways to create a CI/CD pipeline for your flows. This section explains how to automate the validation and deployment of your workflows using CI/CD.

## Introduction

Manual deployments can be challenging. CI/CD pipelines are a great way to automate the validation and deployment of your workflows. This section explains several ways of creating a CI/CD pipeline for your Kestra resources.

## Why a CI/CD pipeline?

A CI/CD process helps ensure fast and reliable deployments. Your changes get deployed automatically, as soon as they get peer-reviewed and merged to a VCS (Version Control System) like Git.

## CI/CD for data workflows

There are several ways to create a CI/CD pipeline for your flows in Kestra. Pick one of the options listed below that best suits your needs.
<ChildTableOfContents :max="1" />

### Kestra CLI

Kestra CLI provides several [commands](./04.helpers.md) for validating and deploying your flows:

```bash
./kestra flow validate flow_directory/myflow.yml
./kestra flow namespace update namespace_name flow_directory/myflow.yml --no-delete
```

If you run Kestra in a Docker container, you can access the CLI as follows:

```bash
docker exec -it kestra-container-name /bin/bash
./kestra flow --help
```

To validate and deploy multiple flows within a directory named `flows`, you can provide a path to that directory:

```bash
./kestra flow validate flows/
./kestra flow namespace update namespace_name flows/ --no-delete
```

The `--no-delete` flag is used to preserve existing flows already stored within your Kestra instance. Don't include that flag if you want that a specific Git repository or a local directory is used as the single source of truth for your production workflows. This way, all previously stored flows get deleted, and only those flows maintained in Git (or that directory) are kept and updated.

#### CLI options

The CLI provides several options to customize your validation and deployment process. CLI options you should be aware of include:

* `--local`: performs the validation locally using the client. By default, Kestra validates flows server-side (a remote API call to your Kestra webserver/standalone server).
* `--server`: allows you to specify the remote Kestra webserver/standalone server URL. The default URL is http://localhost:8080.


For all available CLI options on both `flow validate` and `flow namespace update` commands, use the `-h` or `--help` flag:

```bash
./kestra flow validate -h
./kestra flow namespace update -h
```


#### Templates

Templates can be validated and deployed in the same way as flows:

```bash
./kestra template validate path-to-template-directory
./kestra template namespace update template-namespace-to-update path-to-template-directory
```


### Deploy flows... from a flow!

The CLI commands explained above can be used in a Bash script within a flow. This way, your CI/CD pipeline can be managed directly from your Kestra instance.

```yaml
id: ci-cd
namespace: prod
tasks:
  - id: github-ci-cd
    type: io.kestra.core.tasks.flows.Worker
    tasks:
      - id: clone-repository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/anna-geller/kestra-ci-cd
        branch: main
      - id: validate-flows
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - /app/kestra flow validate flows/
      - id: deploy-flows
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - /app/kestra flow namespace update prod flows/prod/
          - /app/kestra flow namespace update prod.marketing flows/prod.marketing/
triggers:
  - id: github
    type: io.kestra.core.models.triggers.types.Webhook
    key: "yourSecretKey1234"
```

While you can trigger that deployment pipeline manually using Kestra UI or API (*i.e. just like any other Kestra flow*), it's better to combine that with a `push` event emitted by your Git repository. The above flow leverages the Webhook trigger so that your CI/CD flow runs as soon as you push changes to your Git branch.

To configure the webhook for your GitHub repository, go to **Settings**, and then select **Webhooks**. The URL in your browser should look as follows:

```bash
https://github.com/your_username/your_repository_name/settings/hooks
```

Select "Add webhook":

![github_webhook_1](/docs/developer-guide/ci-cd/github_webhook_1.png)

Paste Kestra's webhook URL into the *Payload URL* field, as shown below. The webhook to trigger a Kestra flow should be in the following format:

```bash
https://kestra_host_url/api/v1/executions/webhook/namespace/flow_id/webhook_key
```

![github_webhook_2](/docs/developer-guide/ci-cd/github_webhook_2.png)


Note that we configured this webhook to be sent upon a push event to the default branch, but you can choose the option "Let me select individual events" for further customization e.g. to trigger the flow any time there is a new pull request.

### Deploy flows from a GitHub Action

The official Kestra's [GitHub Actions](./01.github-action.md) leverage the same CLI commands to:
1. Validate flows and templates using the [Validate Action](https://github.com/marketplace/actions/kestra-validate-action)
2. Deploy flows and templates using the [Deploy Action](https://github.com/marketplace/actions/kestra-deploy-action).

Here is a full example validating and deploying flows within a GitHub Actions workflow:

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
      - uses: actions/checkout@v3
      - name: validate-all flows
        uses: kestra-io/validate-action@develop
        with:
          directory: ./flows/prod
          resource: flow
          server: ${{secrets.KESTRA_WEBSERVER_OR_STANDALONE_HOST}}
          user: ${{secrets.KESTRA_USER}}
          password: ${{secrets.KESTRA_PASSWORD}}
      - name: deploy-prod
        uses: kestra-io/deploy-action@develop
        with:
          namespace: prod
          directory: ./flows/prod
          resource: flow
          server: ${{secrets.KESTRA_WEBSERVER_OR_STANDALONE_HOST}}
          user: ${{secrets.KESTRA_USER}}
          password: ${{secrets.KESTRA_PASSWORD}}
          delete: false
      - name: deploy-prod-marketing
        uses: kestra-io/deploy-action@develop
        with:
          namespace: prod.marketing
          directory: ./flows/prod.marketing
          resource: flow
          server: ${{secrets.KESTRA_WEBSERVER_OR_STANDALONE_HOST}}
          user: ${{secrets.KESTRA_USER}}
          password: ${{secrets.KESTRA_PASSWORD}}
          delete: false
```

Note that this example uses GitHub repository **secrets** to store the host name, user name and password to your Kestra instance. Make sure to add those secrets to your repository before using this workflow.


### Deploy flows from a GitLab CI/CD

GitLab CI/CD follows a similar pattern to the GitHub Actions example. See the [GitLab](./02.gitlab.md) section for more details.


### Deploy flows from Terraform

While Terraform might be more challenging to understand at first, we highly recommend this option, as it provides the highest degree of flexibility. Using Kestra and Terraform together, your flows can be deployed along with other infrastructure resources in your stack, making it easier to adopt Infrastructure as Code.

The [Terraform CI/CD](./03.terraform.md) page provides a more detailed explanation, but here is a simple Terraform configuration that you can use to automate the deployment of flows stored in a `flows` directory:

```hcl
terraform {
  required_providers {
    kestra = {
      source  = "kestra-io/kestra" # namespace of Kestra provider
      version = "~> 0.7.0"         # version of Kestra Terraform provider, not the version of Kestra
    }
  }
}

provider "kestra" {
  url = "http://localhost:8080" # Kestra webserver/standalone server URL
}

resource "kestra_flow" "flows" {
  for_each  = fileset(path.module, "flows/*.yml")
  flow_id   = yamldecode(templatefile(each.value, {}))["id"]
  namespace = yamldecode(templatefile(each.value, {}))["namespace"]
  content   = templatefile(each.value, {})
  keep_original_source = true
}
```

You can save the code shown above in a file named `main.tf`. Then, run the following commands from the same directory where you stored that `main.tf` file:

```bash
terraform init # downloads the terraform provider for Kestra
terraform validate # validates the configuration incl. the syntax of your flows
terraform apply -auto-approve # deploys your flows - can be used in a CI/CD process
```

## Dive into each option

The following sections provide more details on each of the options listed above.

<ChildTableOfContents />
