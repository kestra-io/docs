---
order: 1
---

# GitHub

GitHub integrates a solution called [GitHub Actions](https://github.com/features/actions), allowing you to create CI/CD pipelines easily.
These pipelines are called Workflows and are built with Actions, which perform complex tasks with a small amount of codes.

To use the GitHub Actions, your Kestra installation must be accessible from the GitHub Actions runner.

## Kestra Actions

Kestra offers two Actions to create a CI/CD pipeline within a GitHub repository.

* [Kestra Validate Action](https://github.com/marketplace/actions/kestra-validate-action) - Validate your flows and templates before deploying anything.

* [Kestra Deploy Action](https://github.com/marketplace/actions/kestra-deploy-action) - Deploy your flows and templates to your Kestra server.

## Examples

Here is an example of a Workflow using the Kestra actions to validate all Flows and Templates before deploying them.

::alert{type="warning"}
Flows should always be deployed before Templates, to avoid flows running before their templates are created.
::
```yaml
name: Kestra CI/CD

on: [push]

jobs:
  # Start by validating all kestra resources
  Kestra_validate:
    runs-on: ubuntu-latest
    name: Kestra validate
    steps:
      # Validate all templates with the client
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
      - name: Deploy templates in io.kestra
        uses: ./
        with:
          namespace: io.kestra
          directory: ./kestra/templates
          resource: template
          server: https://kestra.io/
      # We can only deploy in one namespace at once,
      # so we have two different steps for our two namespaces io.kestra and io.kestra.dev
      - name: Deploy flows in io.kestra
        description: Deploy flows in the io.kestra namespace
        uses: ./
        with:
          namespace: io.kestra
          directory: ./kestra/flows/prod
          server: https://kestra.io/
      - name: Deploy flows in io.kestra.dev
        description: Deploy flows in the io.kestra.dev namespace
        uses: ./
        with:
          namespace: io.kestra.dev
          directory: ./kestra/flows/dev
          server: https://kestra.io/
```