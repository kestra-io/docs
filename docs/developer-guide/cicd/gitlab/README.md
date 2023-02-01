---
order: 2
---

# Gitlab

## Example

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
  script:
    - /app/kestra flow validate --server https://${KESTRA_HOST}/

kestra-validate-template-job:
  stage: test
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
