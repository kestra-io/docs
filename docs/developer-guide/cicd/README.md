---
order: 15
---

# Create a CI/CD pipeline for Kestra

## Introduction

In Kestra, the number of flows you develop can grow quickly, and maintaining them can get challenging.
CI/CD pipelines are a great way to automate your flows' validation and deployment.
This section will guide you through creating a CI/CD pipeline for your Kestra flows.

## Why a CI/CD pipeline?

CI/CD pipelines provide an easy and reliable way to ensure that your flows are always deployed as soon as they're done.
It integrates nicely with VCS (Version Control System) like Git and can easily integrate into your development workflow.

## How to create a CI/CD pipeline?

There are several ways to create a CI/CD pipeline. At Kestra, we propose three different methods:

<ChildTableOfContents :max="1" />

## Useful CLI commands

Kestra provides several commands intended for use in CI/CD pipelines.

### Flow validation

```bash
./kestra flow validate path-to-flow-directory
```

Validates given YAML flow files.

**Options:**

* `--local`: perform the validation locally using the client. Default is to use a remote call.
* `--server`: specify the remote Kestra server URL. Default is [http://localhost:8080](http://localhost:8080).

### Flow namespace update

```bash
./kestra flow namespace update flow-namespace-to-update path-to-flow-directory
```

Deploys given YAML flow files as flows of the given namespace.

**Options:**

* `--no-delete`: preserve existing flows which are missing from the update. Default is to remove the flows.
* `--server`: specify the remote Kestra server URL. Default is [http://localhost:8080](http://localhost:8080).

### Template validation

```bash
./kestra template validate path-to-template-directory
```

Validates given YAML template files.

**Options:**

* `--local`: perform the validation locally using the client. Default is to use a remote call.
* `--server`: specify the remote Kestra server URL. Default is [http://localhost:8080](http://localhost:8080).

### Template namespace update

```bash
./kestra template namespace update template-namespace-to-update path-to-template-directory
```

Deploys given YAML template files as templates of the given namespace.

**Options:**

* `--no-delete`: preserve existing templates which are missing from the update. Default is to remove the templates.
* `--server`: specify the remote Kestra server URL. Default is [http://localhost:8080](http://localhost:8080).
