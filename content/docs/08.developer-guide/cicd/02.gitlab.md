---
title: GitLab CI
icon: /docs/icons/dev.svg
---

How to use GitLab CI to create a CI/CD pipeline for your Kestra flows.

GitLab provides a solution called [GitLab CI](https://docs.gitlab.com/ee/ci/) that allows you to define pipelines in YAML files to automate tests, compilation, and deployments of your applications.

Here is an example of a GitLab CI pipeline. We define the following stages:
* `validate`, where we validate our flows
* `deploy`, where we deploy our flows.


```yaml
stages:
  - validate
  - deploy

default:
  image:
    name: kestra/kestra:latest
    entrypoint: [""]

variables:
  KESTRA_HOST: https://kestra.io/

validate:
  stage: validate # Validate our flows server-side
  script:
    - /app/kestra flow validate ./kestra/flows --server ${KESTRA_HOST} --api-token $KESTRA_API_TOKEN

deploy:
  stage: deploy
  script:
    - /app/kestra flow namespace update my_namespace ./kestra/flows/prod --server ${KESTRA_HOST} --api-token $KESTRA_API_TOKEN
```
