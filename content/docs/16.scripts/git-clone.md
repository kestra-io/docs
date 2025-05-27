---
title: Git Clone task
icon: /docs/icons/dev.svg
---

Clone a Git repository and use the files in your tasks.

This task clones a Git repository into a working directory, and then enables you to use the files from that repository in downstream tasks.

## `Git` plugin

To use the `io.kestra.plugin.git.Clone` task in your flow, make sure to add it as the first child task of the `WorkingDirectory` task. Otherwise, you’ll get an error: `Destination path "xyz" already exists and is not an empty directory`. This happens because you can only clone a GitHub repository into an empty working directory.

### Add `io.kestra.plugin.git.Clone` as the first task in a `WorkingDirectory`

Adding the `io.kestra.plugin.git.Clone` task directly as the first child task of the `WorkingDirectory` task ensures that you clone your repository into an empty directory before any other task would generate any output artifacts.

### Private Git repositories
Typically, you want to use `io.kestra.plugin.git.Clone`  with a private GitHub repository. Make sure to:
1. Add your organization/user name as `username`
2. Generate your access token and provide it on the `password` property

Below you can find links to instructions on how to generate an access token for the relevant Git platform:

- [GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [GitLab](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
- [Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/create-a-repository-access-token/)
- [AWS CodeCommit](https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control.html)
- [Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows)
