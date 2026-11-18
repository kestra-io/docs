---
title: "Bitbucket Pipes for Kestra: Build and Deploy Flows"
h1: Streamline Kestra Flow Deployment with Bitbucket Pipes
sidebarTitle: Bitbucket Pipes
icon: /src/contents/docs/icons/dev.svg
description: Use Bitbucket Pipes to streamline the build and deployment process of your Kestra flows from Bitbucket repositories.
---

How to use Bitbucket Pipes to create a CI/CD pipeline for your Kestra flows.

## Automate Kestra deployments with Bitbucket Pipes

With the [`kestractl`](../../../kestra-cli/kestractl/index.md) Docker image, you can validate and deploy flows from Bitbucket repositories through [Bitbucket Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/configure-your-first-pipeline/).

:::alert{type="info"}
For flows managed via CI/CD, add the [`system.readOnly`](../../../06.concepts/system-labels/index.md#systemreadonly) label set to `"true"` so the UI editor is disabled and production configurations stay immutable. This is especially recommended for critical production flows:

```yaml
labels:
  system.readOnly: true
```
:::

## Example pipeline

This `bitbucket-pipelines.yml` validates the flows in the `flows/` directory on every branch. On `main`, it also deploys them to the `prod` namespace:

```yaml
image: kestra/kestractl:latest

definitions:
  steps:
    - step: &validate
        name: Validate Kestra flows
        script:
          - kestractl flows validate flows/

pipelines:
  default:
    - step: *validate
  branches:
    main:
      - step: *validate
      - step:
          name: Deploy Kestra flows
          deployment: production
          script:
            - kestractl flows deploy flows/ --namespace prod --override --fail-fast
```

- `flows validate` checks each flow against your Kestra instance and fails the step if any flow is invalid.
- `flows deploy` creates the flows, and `--override` updates flows that already exist. `--namespace prod` deploys every flow to `prod`; omit it to keep the namespace written in each flow file.
- `--fail-fast` stops at the first flow that fails to deploy.

## Configure the connection

`kestractl` reads its connection settings from environment variables, so the pipeline doesn't pass credentials on the command line. Define these variables in Bitbucket under **Repository settings** > **Repository variables**, or per environment under **Deployments** so that the `production` deployment can target a different Kestra instance:

| Variable | Value |
| --- | --- |
| `KESTRACTL_HOST` | URL of your Kestra instance, such as `https://kestra.example.com` |
| `KESTRACTL_TENANT` | Tenant ID. Optional in Open-Source, which uses `main` |
| `KESTRACTL_TOKEN` | An [API token](../../../07.enterprise/03.auth/api-tokens/index.md) (Enterprise Edition and Cloud) |
| `KESTRACTL_USERNAME` and `KESTRACTL_PASSWORD` | Basic authentication credentials, if you don't use an API token |

Mark `KESTRACTL_TOKEN` and `KESTRACTL_PASSWORD` as **Secured** so Bitbucket masks them in build logs. Never print them in a step.

The Bitbucket runner must be able to reach your Kestra instance. For a Kestra instance on a private network, use a [self-hosted runner](https://support.atlassian.com/bitbucket-cloud/docs/runners/).

## Tips

- Pin the image to a release tag, `kestra/kestractl:X.Y.Z`, so that a new `kestractl` version doesn't change your pipeline unexpectedly.
- For more commands, such as deploying namespace files with `kestractl nsfiles upload`, see the [`kestractl` reference](../../../kestra-cli/kestractl/index.md).
