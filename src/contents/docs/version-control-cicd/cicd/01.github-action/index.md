---
title: GitHub Actions for Kestra – CI/CD Workflow Examples
sidebarTitle: GitHub Actions
icon: /src/contents/docs/icons/dev.svg
description: Automate Kestra flow validation and deployment directly from your GitHub repository using official Kestra GitHub Actions.
---

Use GitHub Actions to automate the validation and deployment of your Kestra flows and namespace files with the latest official Kestra GitHub Actions.

## Automate Kestra deployments with GitHub Actions

Kestra provides three official [GitHub Actions](https://github.com/features/actions) enabling you to build robust CI/CD pipelines in your GitHub repository:
- **Validate your flows**
- **Deploy your flows**
- **Deploy namespace files**

To use these Actions, your Kestra instance must be reachable by the GitHub Actions runner—either publicly or via a self-hosted runner.

For flows managed through CI/CD, add the [`system.readOnly`](../../../06.concepts/system-labels/index.md#systemreadonly) label set to `"true"` to ensure production configurations are immutable:

:::alert{type="info"}
For flows managed through CI/CD, add the [`system.readOnly`](../../../06.concepts/system-labels/index.md#systemreadonly) label set to `"true"` so the UI editor is disabled and production configurations stay immutable. This is especially recommended for critical production flows:

```yaml
labels:
  system.readOnly: true
```
:::

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/4MqtD9VtGVs?si=eMqBQFumZG9P4OHb" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

## Official Kestra Actions

Kestra provides these three Actions for CI/CD pipelines:

- [`kestra-io/github-actions/validate-flows`](https://github.com/kestra-io/github-actions/tree/main/validate-flows): Validate a folder of flows before deployment.
- [`kestra-io/github-actions/deploy-flows`](https://github.com/kestra-io/github-actions/tree/main/deploy-flows): Deploy a folder of flows to your Kestra server.
- [`kestra-io/github-actions/deploy-namespace-files`](https://github.com/kestra-io/github-actions/tree/main/deploy-namespace-files): Deploy namespace files to your Kestra server.

**Migration Note:**  
The new actions have updated names and input parameters. Update any references from older actions to point to the new directory-based actions above.

---

## Input reference

### Validate Flows Action inputs

| Input       | Required | Default  | Description |
|-------------|----------|----------|-------------|
| `directory` | ❌       | `'./'`   | Folder containing your flows (YAMLs). |
| `server`    | ✅       | —        | URL of your Kestra server. |
| `apiToken`  | ❌       | —        | API Token for authentication (Enterprise Edition only). |
| `user`      | ❌       | —        | Basic auth username. |
| `password`  | ❌       | —        | Basic auth password. |
| `tenant`    | ✅       | `"main"` | Tenant identifier (Enterprise Edition only, for multi-tenancy). |

[(See action.yml)](https://github.com/kestra-io/github-actions/blob/main/validate-flows/action.yml)

---

### Deploy Flows Action inputs

| Input       | Required | Default  | Description |
|-------------|----------|----------|-------------|
| `directory` | ❌       | `'./'`   | Folder containing your flows (YAMLs). |
| `namespace` | ❌       | —        | Namespace to deploy flows to (optional). |
| `override`  | ❌       | `'false'`| If `true`, override existing flows. |
| `server`    | ✅       | —        | URL of your Kestra server. |
| `apiToken`  | ❌       | —        | API Token for authentication (EE only). |
| `user`      | ❌       | —        | Basic auth username. |
| `password`  | ❌       | —        | Basic auth password. |
| `tenant`    | ✅       | `"main"` | Tenant identifier (Enterprise Edition only, for multi-tenancy). |

[(See action.yml)](https://github.com/kestra-io/github-actions/blob/main/deploy-flows/action.yml)

---

### Deploy Namespace Files Action inputs

| Input          | Required | Default  | Description |
|----------------|----------|----------|-------------|
| `localPath`    | ❌       | `'./'`   | Path to your local file or directory for upload. |
| `namespacePath`| ✅       | —        | Remote namespace path to deploy files to (if uploading a file, must match a file path). |
| `namespace`    | ✅       | —        | Namespace to deploy files to. |
| `override`     | ❌       | `'false'`| If `true`, override existing files. |
| `server`       | ✅       | —        | URL of your Kestra server. |
| `apiToken`     | ❌       | —        | API Token for authentication (EE only). |
| `user`         | ❌       | —        | Basic auth username. |
| `password`     | ❌       | —        | Basic auth password. |
| `tenant`       | ✅       | `"main"` | Tenant identifier (Enterprise Edition only, for multi-tenancy). |

[(See action.yml)](https://github.com/kestra-io/github-actions/blob/main/deploy-namespace-files/action.yml)

---

## Example workflow

A sample CI/CD workflow that validates and deploys flows with the new Kestra Actions:

```yaml
name: Kestra CI/CD
on: [push]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository content
        uses: actions/checkout@v4
      - name: Validate flows
        uses: kestra-io/github-actions/validate-flows@main
        with:
          directory: ./kestra/flows
          server: ${{ secrets.KESTRA_HOSTNAME }}
          # Optional: uncomment for EE
          # apiToken: ${{ secrets.KESTRA_API_TOKEN }}

  deploy:
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - name: Checkout repository content
        uses: actions/checkout@v4
      - name: Deploy product flows
        uses: kestra-io/github-actions/deploy-flows@main
        with:
          directory: ./kestra/flows/product
          namespace: product
          server: ${{ secrets.KESTRA_HOSTNAME }}
      - name: Deploy engineering flows
        uses: kestra-io/github-actions/deploy-flows@main
        with:
          directory: ./kestra/flows/engineering
          namespace: engineering
          server: ${{ secrets.KESTRA_HOSTNAME }}

  # Example: Deploy namespace files
  upload_nsfiles:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository content
        uses: actions/checkout@v4
      - name: Upload config YAML to engineering namespace
        uses: kestra-io/github-actions/deploy-namespace-files@main
        with:
          localPath: ./config/eng.yaml
          namespace: engineering
          namespacePath: config/eng.yaml
          server: ${{ secrets.KESTRA_HOSTNAME }}
```

:::alert{type="info"}
**Tips:**
- Store your Kestra server credentials and tokens as GitHub Secrets for security.
- All actions invoke the Kestra CLI via a managed binary—no manual CLI install needed.

- You can authenticate using either an **API token** (Enterprise Edition) or basic auth credentials (username and password):

```yaml
# Using API token (EE)
with:
  server: ${{ secrets.KESTRA_HOSTNAME }}
  apiToken: ${{ secrets.KESTRA_API_TOKEN }}
# Using basic auth
with:
  server: ${{ secrets.KESTRA_HOSTNAME }}
  user: ${{ secrets.KESTRA_USERNAME }}
  password: ${{ secrets.KESTRA_PASSWORD }}
```

- When using Enterprise features, provide `apiToken` and/or set `tenant` as needed.

:::

---

## Additional resources

- [How-to Guide: GitHub Actions CI/CD](../../../15.how-to-guides/github-actions/index.md) — More examples and advanced workflows.
- [Kestra Validate Flows Action](https://github.com/kestra-io/github-actions/tree/main/validate-flows)
- [Kestra Deploy Flows Action](https://github.com/kestra-io/github-actions/tree/main/deploy-flows)
- [Kestra Deploy Namespace Files Action](https://github.com/kestra-io/github-actions/tree/main/deploy-namespace-files)
