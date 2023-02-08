---
order: 1
---

# GitHub

GitHub integrates a solution called [GitHub Actions](https://github.com/features/actions) that allow you
to create CI/CD pipelines easily.
Those pipelines are called `Workflows` and are build from `Actions` which
performs complex tasks with small amount of codes.

## Kestra Actions

Kestra offer 2 `Actions` to create a CI/CD pipeline within a GitHub repository.

[Kestra Validate Action](https://github.com/kestra-io/validate-action/releases) - Validate your flows and your templates before deploying anything.

[Kestra Deploy Action](https://github.com/kestra-io/deploy-action/releases) - Deploy your flows and your templates to your Kestra server.

## Examples

Here is an example of a `Workflow` using `Kestra Actions` that validate all `Flows` and `Templates` before deploying them.

::: warning
`Flows` should always be deployed before `Templates`, to avoid flows running before their templates are created.
:::

```yaml
name: Kestra CI/CD

on: [push]

jobs:
  # Start by validating all kestra resources
  Kestra_validate:
    runs-on: ubuntu-latest
    name: Kestra validate
    steps:
      # Validate all templates within the client
      - name: Validate all templates locally
        uses: ./
        with:
          directory: ./kestra/templates
          resource: template
      # Validate all flows with the server
      - name: Validate all flows on server-side
        uses: ./
        with:
          directory: ./kestra/flows
          server: https://kestra.io/
  # If validation passed, deploy resources
  Kestra_deploy:
    runs-on: ubuntu-latest
    name: Kestra Deploy
    steps:
      # Deploy all templates in the io.kestra namespace
      - name: Deploy templates
        uses: ./
        with:
          namespace: io.kestra
          directory: ./kestra/templates
          resource: template
          server: https://kestra.io/
      # Can only deploy in one namespace at once
      # so we have 2 differents step for our two namespaces io.kestra and io.kestra.dev
      - name: Deploy prod flows
        description: Deploy flow in the io.kestra namespace
        uses: ./
        with:
          namespace: io.kestra
          directory: ./kestra/flows/prod
          server: https://kestra.io/
      - name: Deploy flows in io.kestra.dev
        description: Deploy flow in the io.kestra.dev namespace
        uses: ./
        with:
          namespace: io.kestra.dev
          directory: ./kestra/flows/dev
          server: https://kestra.io/
```