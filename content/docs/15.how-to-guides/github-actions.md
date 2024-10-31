---
title: Validate and Deploy your Flows with GitHub Actions
icon: /docs/icons/github.svg
stage: Intermediate
topics:
  - Integrations
  - DevOps
  - Version Control
version: ">= 0.6.1"
---

How to use GitHub Actions to automatically validate and deploy your flows to Kestra.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/4MqtD9VtGVs?si=eMqBQFumZG9P4OHb" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

If you're version controlling your Flows inside of a Git repository, it can be useful to automatically validate that they're in the correct format before merging into your `main` branch. On top of that, you can automatically deploy your flows in your `main` branch to your Kestra instance.

There are 2 GitHub Actions available:
- [Validate](https://github.com/marketplace/actions/kestra-validate-action) - Validate your flows and templates before deploying anything.
- [Deploy](https://github.com/marketplace/actions/kestra-deploy-action) - Deploy your flows and templates to your Kestra server.

## Validate Your Flows

Using the Validate Action, we can set up our workflow to check all flows inside of the `directory` specified when a commit is pushed to `main` or a Pull Request is opened for the `main` branch. For the full list of inputs, check out the reference [here](../version-control-cicd/cicd/01.github-action.md#validate-inputs).

In the example below:
1. Triggers when a commit is pushed to `main` or when a PR is opened for the `main` branch.
2. Checks out the repository so we can access the files in later steps.
3. Uses the Validate Action to check all the flows inside of the `./kestra/flows` directory.

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

Using the Deploy Action, we can set up our workflow to deploy when new commits are pushed to our `main` branch. Like the Validate Action, we will need to specify a `directory` and `resource`, which includes namespace files too. For the full list, check out the reference [here](../version-control-cicd/cicd/01.github-action.md#deploy-inputs).

On top of that, we need to specify the namespace that these flows will be deployed to. We can only chose one namespace meaning if we want to deploy multiple namespaces, we will need to add multiple steps using the Deploy Action.

In the example below:
1. Triggers when commits are pushed to `main`.
2. Checks out the repository so we can access the files in later steps.
3. Deploys flows inside of `kestra/flows` to the `company.team` namespace in the Kestra instance.

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

If you have [authentication](../configuration/index.md#http-basic-authentication) enabled in your Kestra instance, you will need to add additional properties so your action can authentication with your instance. If you have basic authentication enabled with a username and password (e.g. on the Open Source Edition), you can add the `user` and `password` properties to your [Action using Secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions):


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

As you can see, the `user` and `password` are added as secrets with the expression syntax `${{ secret.name }}` to prevent you from committing these to your repository.

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

## Set Up a Branch Ruleset

If you're working in a team, it can be useful to set up a [Ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) on your `main` branch to prevent broken flows from being deployed accidentally to your production instance.

To enable this, go to the **Settings** of your repository on GitHub and go to **Rules** then **Rulesets**. In here, we can create a new branch ruleset.

The goal of this ruleset is to protect the `main` branch as our GitHub Action will automatically deploy any flows in this branch to our Kestra instance. To achieve this, we can set the specific Branch rules:
- Require a pull request before merging - No commits can be made directly to the `main` branch
- Require status checks to pass - Requires our Validate Action to pass before we can merge our Pull Requests

![ruleset](/docs/how-to-guides/github-actions/ruleset.png)

With these enabled, we are required to make a Pull Request before our flows end up in production. This enables us to run our validate check and require that to pass before we can merge any pull requests. 

![pr](/docs/how-to-guides/github-actions/pr.png)

In the example above, the flow was had an incorrect indentation so it failed the validate check. As a result of this, the Pull Request is unable to be merged until it is fixed.
