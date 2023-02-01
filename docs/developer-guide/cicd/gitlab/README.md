---
order: 2
---

# GitLab

## GitLab CI

GitLab integrate a solution call [GitLAb CI/CD](https://docs.gitlab.com/ee/ci/) that allow you to
define pipelines in `YAML` files to automate tests, compilation or even deployment for your
applications.

## Example

Here is an example of a GitLab CI pipeline. We define 3 stages, `test` where we validate our flow,
`deploy-template` where we deploy our `templates` before our `flows`, to avoid running before their
templates are created. And finally the stage `deploy-flow` where we deploy our flows.

```yaml
stages:
  - test
  - deploy-template
  - deploy-flow

default:
  image: kestra/kestra:latest

variables:
  KESTRA_HOST: https://kestra.io/

# --------------------------------------
# Validating Kestra Resources
# --------------------------------------
kestra-validate-flows-job:
  stage: test
  # Validate our flows on server-side
  script:
    - /app/kestra flow validate --server https://${KESTRA_HOST}/

kestra-validate-template-job:
  stage: test
  # Validate our template within the client
  script:
    - /app/kestra template validate ./kestra/templates --local

# --------------------------------------
# Deploying Kestra Templates
# --------------------------------------
kestra-deploy-templates-job:
  stage: deploy-template
  script:
    - /app/kestra template namespace update io.kestra ./kestra/templates --server ${KESTRA_HOST}

# --------------------------------------
# Deploying Kestra Flows
# --------------------------------------
kestra-deploy-flows-io.kestra-job:
  stage: deploy-flow
  script:
    - /app/kestra flow namespace update io.kestra ./kestra/flows/prod --server ${KESTRA_HOST}

kestra-deploy-flows-io.kestra.dev-job:
  stage: deploy-flow
  script:
    - /app/kestra flow namespace update io.kestra ./kestra/flows/dev --server ${KESTRA_HOST}

```
