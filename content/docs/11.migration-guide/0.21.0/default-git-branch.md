---
title: Default Git Branch
icon: /docs/icons/migration-guide.svg
release: 0.21.0
editions: ["OSS", "EE"]
---

Changed default Git branch name from `kestra` to `main`.

## Overview

The default branch within Git tasks has been renamed from `kestra` to `main` ([PR #98](https://github.com/kestra-io/plugin-git/pull/98)). Make sure to update any workflows that implicitly rely on the former default branch within [PushFlows](/plugins/plugin-git/io.kestra.plugin.git.pushflows), [PushNamespaceFiles](/plugins/plugin-git/io.kestra.plugin.git.pushnamespacefiles), [SyncNamespaceFiles](/plugins/plugin-git/io.kestra.plugin.git.syncnamespacefiles).

Let's look at an example before and after the change.

### Before 0.21.0

```yaml
id: push_to_git
namespace: system

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushFlows
    gitDirectory: _flows
    url: https://github.com/kestra-io/scripts # required string
    username: git_username # required string needed for Auth with Git
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: main # optional, uses "kestra" by default
```

### After 0.21.0

```yaml
id: push_to_git
namespace: system

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushFlows
    gitDirectory: _flows
    url: https://github.com/kestra-io/scripts # required string
    username: git_username # required string needed for Auth with Git
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: main # optional, uses "main" by default
```