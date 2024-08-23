---
title: BitBucket Pipes
icon: /docs/icons/dev.svg
---

How to use BitBucket Pipes to create a CI/CD pipeline for your Kestra flows.

## Setup a BitBucket Pipes

Using a basic Kestra image and corresponding Kestra CLI, you can validate and deploy flow from BitBucket repositories through [BitBucket Pipes](https://support.atlassian.com/bitbucket-cloud/docs/configure-your-first-pipeline/).

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

Variables such as `$SERVER`, `$KESTRA_USER`, `$KESTRA_PASSWORD` (and optionally `$TENANT` if you're using a Kestra version supporting multi-tenancy) are set in the BitBucket Variable configuration:

![BitBucket Pipes Variable](/docs/developer-guide/ci-cd/bitbucket_pipe_variable.png)

::alert{type="info"}
Note that if you're using Kestra Enterprise Edition, instead of ``--user $KESTRA_USER:$KESTRA_PASSWORD``, you can use the `--api-token` option to authenticate using an API token of a Service Account.
::

Here, we're using directly the Kestra CLI to:

1. Validate flows contained in the `flows/` directory of the repository.
2. Deploy flows into the `company.team` namespace to your Kestra instance.

