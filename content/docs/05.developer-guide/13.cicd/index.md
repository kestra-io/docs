---
title: Create a CI/CD pipeline
---

## Introduction

Manual deployments can be challenging. CI/CD pipelines are a great way to automate the validation and deployment of your workflows. This section explains several ways of creating a CI/CD pipeline for your Kestra resources.

## Why a CI/CD pipeline?

A CI/CD process helps ensure fast and reliable deployments. Your changes get deployed automatically, as soon as they get peer-reviewed and merged to a Git branch.

## CI/CD for data workflows

There are several ways to create a CI/CD pipeline for your flows in Kestra. Pick one of the options listed below that best suits your needs.


<ChildTableOfContents :max="1" />

### Kestra CLI 

Kestra CLI provides several [CLI commands](./04.helpers.md) for validating and deploying your flows.

If you run Kestra in a container, you can access those as follows:

```bash
docker exec -it kestra-container-name /bin/bash
./kestra flow validate flow_directory/myflow.yml
./kestra flow namespace update namespace_name flow_directory/myflow.yml --no-delete
```

To validate and deploy multiple flows within a directory named `flows`, you can provide a path to that directory:

```bash
docker exec -it kestra-container-name /bin/bash
./kestra flow validate flows/
./kestra flow namespace update namespace_name flows/ --no-delete
```

The `--no-delete` flag is used to preserve existing flows already stored within your Kestra instance. Don't include that flag if you want that a specific Git repository or a local directory is used as the single source of truth for your production workflows. This way, all previously stored flows get deleted, and only those flows maintained in Git (or that directory) are kept and updated.

#### CLI options

The CLI provides several options to customize your validation and deployment process. CLI options you should be aware of include:

* `--local`: performs the validation locally using the client. By default, Kestra validates flows server-side (a remote API call to your Kestra server).
* `--server`: allows you to specify the remote server URL. The default URL is [http://localhost:8080](http://localhost:8080).


For all available CLI options on both `flow validate` and `flow namespace update` commands, use the `-h` or `--help` flag:

```bash
./kestra flow validate -h
./kestra flow namespace update -h
```


#### Templates 

Templates can be validated and deployed in the same way as flows:

```bash
docker exec -it kestra-container-name /bin/bash
./kestra template validate path-to-template-directory
./kestra template namespace update template-namespace-to-update path-to-template-directory
```


### Deploy flows... from a flow!

The CLI commands explained above can be used in a Bash script within a flow. This way, your CI/CD pipeline can be managed directly from your Kestra instance. 

```yaml
id: ci-cd
namespace: prod
variables:
  host: "http://your_host_name:8080/" # e.g. "http://localhost:8080/"
  auth: "yourUsername:yourPassword" # e.g. "" - leave as empty string for a locally running Kestra instance

tasks:
  - id: deploy
    type: io.kestra.core.tasks.flows.Worker
    tasks:
      - id: cloneRepository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/anna-geller/kestra-ci-cd
        branch: main
        username: anna-geller 
        
      - id: validateFlows
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - /app/kestra flow validate flows/ --server={{vars.host}} --user={{vars.auth}}
      
      - id: deployFlows
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - /app/kestra flow namespace update prod flows/prod/ --no-delete --server={{vars.host}} --user={{vars.auth}}
          - /app/kestra flow namespace update prod.marketing flows/prod.marketing/ --no-delete --server={{vars.host}} --user={{vars.auth}}

triggers:
  - id: github
    type: io.kestra.core.models.triggers.types.Webhook
    key: "yourSecretKey1234"
```

While you can trigger that deployment pipeline manually using Kestra UI or API, just like any other flow, it's better to combine that with a push event emitted by your Git repository. The above flow leverages the [Webhook trigger](../08.triggers/03.webhook.md) so that your CI/CD flow runs as soon as you push changes to your Git branch. 

To configure the webhook for your GitHub repository, go to **Settings**, and then select **Webhooks**. The URL in your browser should look as follows:

```bash
https://github.com/your_username/your_repository_name/settings/hooks
```

Select "Add webhook":

![[github_webhook_1.png]]

Then, paste the webhook into the Payload URL field, as shown below. The webhook to trigger a Kestra flow should be in the following format:

```bash
https://kestra_hostname/api/v1/executions/webhook/namespace/flow_id/webhook_key
```


![[github_webhook_2.png]]

Note that we configured this webhook to be sent upon a push event to the main branch, but you can choose the option "Let me select individual events" for further customization.

### Deploy flows from a GitHub Action

The official Kestra's [GitHub Actions](01.github-action.md) leverage the same CLI commands to:
1. Validate flows and templates using the [Validate Action](https://github.com/marketplace/actions/kestra-validate-action)
2. Deploy flows and templates using the [Deploy Action](https://github.com/marketplace/actions/kestra-deploy-action).

Here is a full example validating and deploying flows from a GitHub Action:

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
          server: ${{secrets.KESTRA_HOST}}
          user: ${{secrets.KESTRA_USER}}
          password: ${{secrets.KESTRA_PASSWORD}}
      - name: deploy-prod
        uses: kestra-io/deploy-action@develop
        with:
          namespace: prod
          directory: ./flows/prod
          resource: flow
          server: ${{secrets.KESTRA_HOST}}
          user: ${{secrets.KESTRA_USER}}
          password: ${{secrets.KESTRA_PASSWORD}}
          delete: false
      - name: deploy-prod-marketing
        uses: kestra-io/deploy-action@develop
        with:
          namespace: prod.marketing
          directory: ./flows/prod.marketing
          resource: flow
          server: ${{secrets.KESTRA_HOST}}
          user: ${{secrets.KESTRA_USER}}
          password: ${{secrets.KESTRA_PASSWORD}}
          delete: false
```

Note that this example uses GitHub repository secrets to store Kestra host name, user name and password. 


### Deploy flows from a GitLab CI/CD

GitLab CI/CD follows a similar pattern. See the [GitLab](02.gitlab.md) section for more details.


### Deploy flows from Terraform

Finally, you can deploy flows using Terraform. While Terraform might be more challenging to understand at first, we highly recommend this option, as it provides the most flexibility and integrates your flows seamlessly with other Terraform providers from related tools in your stack.

The [Terraform CI/CD](03.terraform.md) page provides a more detailed explanation, but here is a simple Terraform configuration you can use to automate the deployment of flows stored in a `flows` directory:

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
  url = "http://localhost:8080"
}

resource "kestra_flow" "flows" {
  for_each  = fileset(path.module, "flows/*.yml")
  flow_id   = yamldecode(templatefile(each.value, {}))["id"]
  namespace = yamldecode(templatefile(each.value, {}))["namespace"]
  content   = templatefile(each.value, {})
  keep_original_source = true
}
```

You can store the code shown above into a file named `main.tf`. Then run the following commands from the same directory where you stored that `main.tf` file:

```bash
terraform init # downloads the terraform provider for Kestra
terraform validate # validates the configuration incl. the syntax of your flows
terraform apply -auto-approve # deploys your flows - can be used in a CI/CD process
```

