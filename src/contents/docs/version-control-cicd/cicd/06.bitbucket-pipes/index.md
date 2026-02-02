---
title: Bitbucket Pipes for Kestra – Build and Deploy from Bitbucket
sidebarTitle: Bitbucket Pipes
icon: /src/contents/docs/icons/dev.svg
description: Use Bitbucket Pipes to streamline the build and deployment process of your Kestra flows from Bitbucket repositories.
---

How to use Bitbucket Pipes to create a CI/CD pipeline for your Kestra flows.

## Automate Kestra deployments with Bitbucket Pipes

With the Kestra Docker image and CLI, you can validate and deploy flows from Bitbucket repositories through [Bitbucket Pipes](https://support.atlassian.com/bitbucket-cloud/docs/configure-your-first-pipeline/).

:::alert{type="info"}
For flows managed via CI/CD, add the [`system.readOnly`](../../../06.concepts/system-labels/index.md#systemreadonly) label set to `"true"` so the UI editor is disabled and production configurations stay immutable. This is especially recommended for critical production flows:

```yaml
labels:
  system.readOnly: true
```
:::

Here is a basic pipeline:


```yaml

image: kestra/kestra

pipelines:
  default:
    - step:
        name: 'Validate Kestra flows'
        deployment: staging
        script:
          - /bin/sh /app/kestra flow validate flows/ --server $SERVER --tenant $TENANT --user $KESTRA_USER:$KESTRA_PASSWORD

    - step:
        name: 'Deploy Kestra flows'
        deployment: production
        script:
          - echo $SERVER
          - echo $KESTRA_USER
          - echo $KESTRA_PASSWORD
          - /bin/sh /app/kestra flow namespace update dev flows/ --server=$SERVER --tenant=$TENANT --user=$KESTRA_USER:$KESTRA_PASSWORD
```

Variables such as `$SERVER`, `$KESTRA_USER`, `$KESTRA_PASSWORD`, and optionally `$TENANT` (for multi-tenant environments) are set in the Bitbucket variable configuration:

![Bitbucket Pipes Variable](./bitbucket_pipe_variable.png)

:::alert{type="info"}
If you're using Kestra Enterprise Edition, you can replace ``--user $KESTRA_USER:$KESTRA_PASSWORD`` with the `--api-token` option to authenticate with a service account API token.
:::

This example uses the Kestra CLI to:

1. Validate flows contained in the `flows/` directory of the repository.
2. Deploy flows into the `company.team` namespace of your Kestra instance.
