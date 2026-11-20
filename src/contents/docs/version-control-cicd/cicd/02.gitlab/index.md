---
title: "GitLab CI for Kestra: Automate Flow Validation"
h1: Configure GitLab CI Pipelines to Deploy Kestra Flows
sidebarTitle: GitLab CI
icon: /src/contents/docs/icons/dev.svg
description: Configure GitLab CI pipelines to automatically validate and deploy Kestra flows and resources to your Kestra instance.
---

Use GitLab CI to automate the validation and deployment of your Kestra flows.

## Automate Kestra deployments with GitLab CI

[GitLab CI](https://docs.gitlab.com/ee/ci/) lets you define pipelines in a `.gitlab-ci.yml` file to automate tests, builds, and deployments.
With Kestra, you can validate and deploy flows directly from your pipeline using [`kestractl`](../../../kestra-cli/kestractl/index.md).

:::alert{type="info"}
For flows managed through CI/CD, add the [`system.readOnly`](../../../06.concepts/system-labels/index.md#systemreadonly) label set to `"true"` so the UI editor is disabled and production configurations stay immutable. This is especially recommended for critical production flows:

```yaml
labels:
  system.readOnly: true
```
:::

:::alert{type="info"}
Your GitLab runner must be able to reach your Kestra instance.
- If your Kestra server is **publicly accessible**, a shared GitLab runner is sufficient.
- If your Kestra server is **private**, use a **self-hosted runner** with network access to Kestra.
:::

---

## Example pipeline

The example below defines two stages, `validate` and `deploy`, and runs `kestractl` from the `kestra/kestractl` image.
Validation runs first; if it succeeds on the default branch, the deploy stage creates or updates the flows from your repository in the `prod` namespace.

```yaml
stages:
  - validate
  - deploy

default:
  image:
    name: kestra/kestractl:latest
    entrypoint: [""]

variables:
  KESTRACTL_HOST: https://your-kestra-host

validate:
  stage: validate
  script:
    - kestractl flows validate ./kestra/flows

deploy:
  stage: deploy
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  script:
    - kestractl flows deploy ./kestra/flows/prod --namespace prod --override --fail-fast
```

- `entrypoint: [""]` clears the image's `kestractl` entrypoint so GitLab can run the `script` commands in a shell.
- `flows validate` checks each flow against your Kestra instance and fails the job if any flow is invalid.
- `flows deploy` creates the flows, and `--override` updates flows that already exist. `--namespace prod` deploys every flow to `prod`; omit it to keep the namespace written in each flow file.

## Authentication

`kestractl` reads its credentials from environment variables. Add them in GitLab under **Settings** > **CI/CD** > **Variables**, and mark the secret ones as **Masked** and **Protected**:

- `KESTRACTL_TOKEN`: an [API token](../../../07.enterprise/03.auth/api-tokens/index.md) (Enterprise Edition and Cloud).
- `KESTRACTL_USERNAME` and `KESTRACTL_PASSWORD`: basic authentication credentials, if API tokens aren't available.
- `KESTRACTL_TENANT`: your tenant ID. Optional in Open-Source, which uses `main`.

Don't write credentials in `.gitlab-ci.yml`.

---

## Tips

- Pin the image to a release tag, `kestra/kestractl:X.Y.Z`, to avoid unexpected CLI changes.
- For more commands, such as deploying namespace files with `kestractl nsfiles upload`, see the [`kestractl` reference](../../../kestra-cli/kestractl/index.md).
