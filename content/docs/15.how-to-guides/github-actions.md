---
title: Validate and Deploy your Flows with GitHub Actions
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Integrations
---

How to use GitHub Actions to automatically validate and deploy your flows to Kestra.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/4MqtD9VtGVs?si=eMqBQFumZG9P4OHb" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Having your Flows inside of a Git repository can be useful if you have a team developing flows locally or in a dev environment. By using GitHub Actions, we can automatically validate the flows are correct and deploy them to a Kestra instance, for example a production instance.

There are 2 GitHub Actions available:
- [Validate](https://github.com/marketplace/actions/kestra-validate-action)
- [Deploy](https://github.com/marketplace/actions/kestra-deploy-action)

## Validate Your Flows

Using the Validate Action, we can setup our workflow to check all flows inside of the `directory` specified when a commit is pushed to `main` and a Pull Request is opened for the `main` branch. We also need to specify the `resource` to be `flow or `template` (deprecated).

```yaml
name: Kestra CI/CD
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  validate:
    runs-on: ubuntu-latest
    name: Kestra validate
    steps:
      - name: Checkout repo content
        uses: actions/checkout@v4

      - name: Validate all flows on server-side
        uses: kestra-io/validate-action@master
        with:
          directory: ./kestra/flows
          resource: flow
          server: https://server-url.com
```

## Deploy Your Flows

Using the Deploy Action, we can setup our workflow to deploy when new commits are pushed to our `main` branch. Like the Validate Action, we will need to specify a `directory` and `resource, which includes namespace files too. 

On top of that, we need to specify a namespace that want these flows to be deployed to. We can only chose one namespace meaning if we want to deploy multiple, we will need to add multiple steps using the Deploy Action.

```yaml
name: Kestra CI/CD
on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Kestra deploy
    steps:
      - name: Checkout repo content
        uses: actions/checkout@v4
      
      - name: Deploy flows
        uses: kestra-io/deploy-action@master
        with:
          namespace: company.team
          directory: ./kestra/flows
          resource: flow
          server: https://server-url.com
```

## Authentication

If you have authentication enabled in your Kestra instance, you will need to add additional properties so your action can authentication with your instance. If you have basic authentication enabled with a username and password (e.g. on the Open Source Edition), you can add the `user` and `password` properties to your [Action using Secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions):


```yaml
name: Kestra CI/CD
on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Kestra deploy
    steps:
      - name: Checkout repo content
        uses: actions/checkout@v4
      
      - name: Deploy flows
        uses: kestra-io/deploy-action@master
        with:
          namespace: company.team
          directory: ./kestra/flows
          resource: flow
          server: https://server-url.com
          user: ${{ secrets.user }}
          password: ${{ secrets.password }}
```

If you're using the [Enterprise Edition](/enterprise), you can use an [API Token](../06.enterprise/api-tokens.md) instead:

```yaml
name: Kestra CI/CD
on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Kestra deploy
    steps:
      - name: Checkout repo content
        uses: actions/checkout@v4
      
      - name: Deploy flows
        uses: kestra-io/deploy-action@master
        with:
          namespace: company.team
          directory: ./kestra/flows
          resource: flow
          server: https://server-url.com
          apiToken: ${{ secrets.KESTRA_API_TOKEN }}
```

## Set Up Branch Rulesets to enforce checks before deploying

If you're working in a team, it can be useful to set up a Ruleset on your main branch to prevent broken flows from being deployed to your production Kestra instance.

To do this, go to the Settings of your repository on GitHub and go to Rules then Rulesets. In here, we can create a new branch ruleset.

The goal of this ruleset is to protect the `main` branch as our GitHub Action will automatically deploy any flows in this branch. To achieve this, we can set the specific Branch rules:
- Require a pull request before merging
- Require status checks to pass

![ruleset](/docs/how-to-guides/github-actions/ruleset.png)

These will require us to make a Pull Request before our flows end up in production, meaning someone can review the changes and confirm they're happy. On top of that, 

![pr](/docs/how-to-guides/github-actions/pr.png)
