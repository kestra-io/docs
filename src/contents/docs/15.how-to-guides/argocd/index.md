---
title: Deploy Kestra with ArgoCD
h1: Deploy Kestra with ArgoCD using a Wrapper Chart
icon: /src/contents/docs/icons/helm.svg
stage: Getting Started
topics:
  - DevOps
editions: ["OSS", "EE"]
description: Learn how to deploy Kestra with ArgoCD using a wrapper chart that pulls from helm.kestra.io, so you stay in full control of when upgrades happen.
---

Deploy Kestra with ArgoCD by creating a wrapper chart in your own infrastructure repository. Nothing deploys until you commit a change — you decide when upgrades happen.

## Prerequisites

- **kubectl** — to interact with your cluster
- **Helm** — to manage chart dependencies
- **ArgoCD** — installed and configured in your cluster

## Source charts from helm.kestra.io, not the git repository

The `kestra` GitHub repository is a development repository, not a Helm distribution channel. The `develop` branch intentionally carries `version: 0.0.0` in `Chart.yaml` — a deliberate signal that it is not a release artifact.

The stable, versioned Helm chart is published at **[helm.kestra.io](https://helm.kestra.io/)**, which Kestra keeps stable and immutable across versions.

:::alert{type="warning"}
Do not point ArgoCD directly at `github.com/kestra-io/kestra` to source the Helm chart. The develop branch does not reflect released chart versions and its structure may change at any time.
:::

## Recommended pattern: wrapper chart

Create a **wrapper chart** in your own infrastructure repository. The wrapper chart declares kestra as a dependency pinned to a specific version from `helm.kestra.io`. Your `values.yaml` overrides sit alongside it. ArgoCD watches only your repository, so nothing deploys until you push a commit.

### Directory structure

```
your-infra-repo/
└── kestra/
    ├── Chart.yaml        # wrapper chart with pinned kestra dependency
    ├── Chart.lock        # generated; locks the resolved dependency
    ├── values.yaml       # your overrides (secrets, database, storage)
    └── charts/
        └── kestra-x.y.z.tgz   # vendored chart; committed for reproducibility
```

### 1. Create the wrapper Chart.yaml

```yaml
# kestra/Chart.yaml
apiVersion: v2
name: my-kestra
version: 0.1.0
dependencies:
  - name: kestra
    repository: https://helm.kestra.io
    version: "1.3.16"   # pin to the version you want to run
```

To find available versions:

```bash
helm repo add kestra https://helm.kestra.io/
helm repo update
helm search repo kestra/kestra --versions
```

### 2. Add your values.yaml

Place your environment-specific configuration alongside the wrapper chart. Prefix all keys with `kestra.` to scope them to the dependency:

```yaml
# kestra/values.yaml
kestra:
  # All keys here match the Kestra Helm chart values.
  # See https://github.com/kestra-io/kestra/blob/develop/charts/kestra/values.yaml
  configurations:
    application:
      kestra:
        storage:
          type: s3
          s3:
            bucket: your-kestra-bucket
            region: us-east-1
      datasources:
        postgres:
          url: jdbc:postgresql://your-db-host:5432/kestra
          driverClassName: org.postgresql.Driver
          username: kestra
          password: "<your-db-password>"
```

For credentials, use Kubernetes Secrets rather than plain values. See [Pass Kubernetes Secrets and Env Vars via Helm Chart](../kubernetes-secrets/index.md) for the recommended pattern.

### 3. Vendor the chart

Fetch the pinned chart from `helm.kestra.io` and commit it to your repository:

```bash
cd kestra/
helm dependency update
```

This creates `Chart.lock` and downloads `charts/kestra-x.y.z.tgz`. Commit all three files (`Chart.yaml`, `Chart.lock`, and `charts/kestra-x.y.z.tgz`) so the chart content is fully reproducible from your repository without any external network dependency at deploy time.

```bash
git add Chart.yaml Chart.lock charts/
git commit -m "chore: add kestra helm chart dependency v1.3.16"
```

### 4. Configure an ArgoCD Application

Point ArgoCD at the `kestra/` directory in your repository:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: kestra
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/your-infra-repo
    targetRevision: main
    path: kestra
  destination:
    server: https://kubernetes.default.svc
    namespace: kestra
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

ArgoCD now watches your repository. Because the chart is vendored, syncs do not require network access to `helm.kestra.io`.

## Upgrade to a new chart version

1. Update the version pin in `kestra/Chart.yaml`
2. Re-vendor the chart:

   ```bash
   cd kestra/
   helm dependency update
   ```

3. Commit the updated `Chart.yaml`, `Chart.lock`, and `charts/kestra-x.y.z.tgz`
4. Push to your repository — ArgoCD detects the change and syncs

## Trigger ArgoCD syncs from Kestra flows

If you use Kestra to orchestrate infrastructure operations, the [ArgoCD plugin](/plugins/plugin-argocd/tasks/apps/io.kestra.plugin.argocd.apps.sync) lets you trigger and monitor ArgoCD application syncs directly from a flow:

```yaml
id: deploy_kestra_upgrade
namespace: company.infra

tasks:
  - id: sync
    type: io.kestra.plugin.argocd.apps.Sync
    server: "{{ secret('ARGOCD_SERVER') }}"
    token: "{{ secret('ARGOCD_TOKEN') }}"
    application: kestra

  - id: status
    type: io.kestra.plugin.argocd.apps.Status
    server: "{{ secret('ARGOCD_SERVER') }}"
    token: "{{ secret('ARGOCD_TOKEN') }}"
    application: kestra
```

Use this to chain a chart upgrade commit with an automated sync and status check as part of a larger deployment pipeline.
