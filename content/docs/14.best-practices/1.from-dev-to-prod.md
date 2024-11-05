---
title: Moving from Development to Production
icon: /docs/icons/best-practices.svg
---

Common patterns to deploy your flows from development to production environments.


## Development Environment

One best practice with Kestra is to have one development instance where users can write their flow directly in UI. This instance can be seen as a "sandbox" where flows can be tested and executed without the fear to break critical business operations.

We usually encourage two types of development environment:
- installing Kestra on your local machine (usually with Docker Compose installation)
- installing Kestra on a Kubernetes cluster accessible by users and separated from production matters.


## Production Environment

The production instance should be safeguarded. Especially as this environment supports critical operations and engages your responsibilities for end users.

One common best practice here is to limit the access of the production environment. In this case, there two elements to consider:
- Users access
- Flow deployments


### User Access

For Kestra Enterprise users, this is streamlined with RBAC and SSO features. With role policies such as "Admin" or "Viewer", one administrator can manage all user access with fine-grain control over all Kestra resources. You can learn more in the [dedicated documentation](../06.enterprise/index.md).

For open-source users it's usually a good idea to have a restricted instance, meaning an instance only accessible by CI/CD and administrators.


### Flows Deployment

Kestra offers many strategies to deploy flows to an instance. Through the UI directly, Git operations, Terraform or the API directly.
Choosing one way or the other depends of your preferences and your current deployment patterns.

One recurring pattern is moving flows from the development to the production instance through version control system and CI/CD.

When users have developed flows, they will usually commit changes to a version control system (Git). Then, upon validated pull request, the CI/CD engine will deploy the corresponding flows to the production instance.

The way users can commit flow changes to Git can be addressed with the following patterns:
- Export or copy-paste flows from the user interface
- Using the [`git.PushFlows` task](/plugins/plugin-git/tasks/io.kestra.plugin.git.pushflows)

The way CI/CD deploy flows to production instance can be addressed with the following patterns:
- GitHub Action, GitLab CI/CD, Jenkins, Azure DevOps, etc.
- Terraform deployment
- Kestra CLI

You can find more about CI/CD pattern with Kestra [here](../version-control-cicd/cicd/index.md).