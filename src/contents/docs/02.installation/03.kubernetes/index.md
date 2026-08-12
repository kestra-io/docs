---
title: Deploy on Kubernetes with Helm in Kestra
h1: Kubernetes Deployment with Helm Charts
sidebarTitle: Kubernetes
icon: /src/contents/docs/icons/kubernetes.svg
description: Deploy Kestra on Kubernetes using the official Helm chart, scalable for production with PostgreSQL and object storage.
---

Install Kestra in a Kubernetes cluster using a Helm chart.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/SV7C2eHiuV0?si=jq8sgQgilYspGosx" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Prerequisites

- **[kubectl](https://kubernetes.io/docs/tasks/tools/)** — to interact with your cluster
- **[Helm](https://helm.sh/docs/intro/install/)** — to install and manage charts

## Helm charts

Kestra maintains two Helm charts:

1. **`kestra`** — production-ready chart with no bundled dependencies. Requires an external database and object storage.
2. **`kestra-starter`** — bundles PostgreSQL and Versity (S3-compatible storage) for evaluation only. Not suitable for production.

Chart sources:
- Repository: [helm.kestra.io](https://helm.kestra.io/)
- Source code: [kestra helm chart](https://github.com/kestra-io/kestra/tree/develop/charts/kestra)
- ArtifactHub: [kestra](https://artifacthub.io/packages/helm/kestra/kestra) · [kestra-starter](https://artifacthub.io/packages/helm/kestra/kestra-starter)

:::alert{type="info"}
All default image tags are listed in the [Docker installation guide](../02.docker/index.md).
:::

### Chart configuration resources

To understand available configuration options and compare versions:

- **Compare versions**: See differences between two Helm chart versions on [ArtifactHub](https://artifacthub.io/packages/helm/kestra/kestra?modal=values) using the values comparison modal.
- **Full values reference**: Review all available configuration options in the [values.yaml](https://github.com/kestra-io/kestra/blob/develop/charts/kestra/values.yaml) file on GitHub.

### Starter chart dependencies

The `kestra-starter` chart installs Versity (object storage) and PostgreSQL (database). These bundled dependencies are not suitable for production.

### Enterprise edition

To deploy the Enterprise Edition, authenticate before pulling images:

```bash
docker login registry.kestra.io --username $LICENSEID --password $FINGERPRINT
```

Use:

- `registry.kestra.io/docker/kestra-ee:latest`
- or a pinned version such as `registry.kestra.io/docker/kestra-ee:v1.0`

Review [Enterprise requirements](../../07.enterprise/05.instance/index.mdx) before deploying.
Compare editions in [Open Source vs Enterprise](../../oss-vs-paid/index.md) if you are deciding between versions.

:::alert{type="info"}
If you use ArgoCD, see [Deploy Kestra with ArgoCD using a Wrapper Chart](../../15.how-to-guides/argocd/index.md) for the recommended GitOps deployment pattern.
:::

## Install Kestra

Add the chart repository:

```bash
helm repo add kestra https://helm.kestra.io/
helm repo update
```

Install the `kestra-starter` chart:

```bash
helm install my-kestra kestra/kestra-starter
```

This deploys pods for Kestra, PostgreSQL (database), and Versity (storage).

Alternatively, install the `kestra` production chart:

```bash
helm install my-kestra kestra/kestra
```

This deploys Kestra in **standalone mode**—all core components run in a single pod.

:::alert{type="warning"}
The `kestra` chart does not include PostgreSQL or object storage. Configure these before production deployment.
:::

## Access the Kestra UI

To list all pods run:

```bash
kubectl get pods -n default -l app.kubernetes.io/name=kestra
```

If you installed the `kestra-starter` chart, you will likely see something like:

```perl
my-kestra-kestra-starter-xxxxxx-xxxxx        Running
my-kestra-postgresql-0                       Running
my-kestra-versity-0                          Running
```

The Kestra standalone pod is usually named:

```perl
my-kestra-kestra-starter-xxxxx
```

Export the pod name using the label selector for release `my-kestra`:

```bash
export POD_NAME=$(kubectl get pods \
  -l "app.kubernetes.io/name=kestra,app.kubernetes.io/instance=my-kestra,app.kubernetes.io/component=standalone" \
  -o jsonpath="{.items[0].metadata.name}")
```

Verify:

```bash
echo $POD_NAME
```

Port-forward the UI:

```bash
kubectl port-forward $POD_NAME 8080:8080
```

Open **http://localhost:8080** in your browser and create your user.

## Ingress

To expose Kestra outside the cluster, enable the built-in Ingress resource. Both charts support the same ingress properties — the only difference is where they are placed in `values.yaml`.

### kestra chart

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "0"
  hosts:
    - host: kestra.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts:
        - kestra.example.com
      secretName: kestra-tls
```

### kestra-starter chart

The `kestra-starter` chart passes all values under `kestra:` through to the main kestra chart, so nest the ingress block accordingly:

```yaml
kestra:
  ingress:
    enabled: true
    className: nginx
    annotations:
      nginx.ingress.kubernetes.io/proxy-body-size: "0"
    hosts:
      - host: kestra.example.com
        paths:
          - path: /
            pathType: Prefix
    tls:
      - hosts:
          - kestra.example.com
        secretName: kestra-tls
```

Apply with:

```bash
helm upgrade my-kestra kestra/kestra-starter -f values.yaml
```

Omit the `tls` block if TLS is terminated upstream (e.g., at a load balancer). The `className` and `annotations` values depend on your ingress controller — replace `nginx` with the appropriate class for your cluster. For TLS certificate management, see [SSL configuration](../../10.administrator-guide/ssl-configuration/index.md).

## Scaling Kestra on Kubernetes

For production deployments, run each Kestra component in its own pod.

Example `values.yaml`:

```yaml
deployments:
  webserver:
    enabled: true
  executor:
    enabled: true
  indexer:
    enabled: true
  scheduler:
    enabled: true
  worker:
    enabled: true
  standalone:
    enabled: false
```

Apply changes:

```bash
helm upgrade my-kestra kestra/kestra -f values.yaml
```

Validate pod layout:

```bash
kubectl get pods -l app.kubernetes.io/name=kestra
```

## Configuration

Kestra configuration is provided through Helm values and rendered into ConfigMaps and Secrets.

All Kestra-specific options live under `configurations.application`. The content of this block is identical to what you would put in a standalone `application.yml` — the Helm chart passes it through as-is. Every property documented in the [configuration section](../../configuration/index.mdx) is valid here.

### Production example

A typical production `values.yaml` configures the database, storage backend, and secrets manager together:

```yaml
configurations:
  application:
    kestra:
      storage:
        type: s3
        s3:
          bucket: my-kestra-bucket
          region: us-east-1
      secret:
        type: aws-secret-manager
        aws-secret-manager:
          region: us-east-1
      queue:
        type: postgres
      repository:
        type: postgres

    datasources:
      postgres:
        url: jdbc:postgresql://postgres:5432/kestra
        driverClassName: org.postgresql.Driver
        username: kestra
        password: ${POSTGRES_PASSWORD}
```

Inject credentials from a Kubernetes Secret using `common.extraEnvFrom`:

```yaml
common:
  extraEnvFrom:
    - secretRef:
        name: postgres-credentials  # Secret must contain POSTGRES_PASSWORD
```

For the full property reference for each area, see:

- [Runtime and Storage](../../configuration/02.runtime-and-storage/index.md) — storage backends (S3, GCS, Azure, and more) and datasource configuration
- [Security and Secrets](../../configuration/05.security-and-secrets/index.md) — secrets backends
- [Configuration basics](../../configuration/01.configuration-basics/index.md) — queue and repository type selection, environment variables, property naming, and override patterns

### Minimal example (H2 database for testing only)

```yaml
configurations:
  application:
    kestra:
      queue:
        type: h2
      repository:
        type: h2
      storage:
        type: local
        local:
          base-path: "/app/storage"

    datasources:
      h2:
        url: jdbc:h2:mem:public;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
        username: kestra
        password: kestra
        driverClassName: org.h2.Driver
```

## Using secrets

Secrets can be mounted into Kestra through the `secrets` section and referenced via manifests.

Example: enabling Kafka using a Secret

```yaml
configurations:
  application:
    kestra:
      queue:
        type: kafka

secrets:
  - name: kafka-server
    key: kafka.yml
```

Secret manifest:

```yaml
extraManifests:
  - apiVersion: v1
    kind: Secret
    metadata:
      name: kafka-server
    stringData:
      kafka.yml: |
        kestra:
          kafka:
            client:
              properties:
                bootstrap.servers: "localhost:9092"
```

## Environment variables

Use `extraEnv` or `extraEnvFrom` to load values from existing Secrets or ConfigMaps.

Example:

```yaml
common:
  extraEnvFrom:
    - secretRef:
        name: basic-auth-secret
```

Secret manifest:

```yaml
extraManifests:
  - apiVersion: v1
    kind: Secret
    metadata:
      name: basic-auth-secret
    stringData:
      basic-auth.yml: |
        kestra:
          server:
            basic-auth:
              enabled: true
              username: admin@localhost.com
              password: ChangeMe1234!
```

## Docker-in-Docker (DinD)

Kestra workers support rootless Docker-in-Docker by default. Some clusters restrict this.

On Google Kubernetes Engine (GKE), using a node pool based on `UBUNTU_CONTAINERD` works well with rootless Docker DinD.

### Disable rootless mode

Some clusters only support a root version of DinD. To enable insecure (privileged) mode instead, use the [insecure mode](https://github.com/kestra-io/kestra/blob/develop/charts/kestra/values.yaml) Helm values:

```yaml
dind:
  # -- Enable Docker-in-Docker (dind) sidecar.
  # @section -- kestra dind
  enabled: true
  # -- Dind mode (rootless or insecure).
  # @section -- kestra dind
  mode: 'rootless'
  base:
    # -- Rootless dind configuration.
    # @section -- kestra dind rootless
    rootless:
      image:
        repository: docker
        pullPolicy: IfNotPresent
        tag: dind-rootless
      securityContext:
        privileged: true
        runAsUser: 1000
        runAsGroup: 1000
      args:
        - --log-level=fatal
        - --group=1000
    # -- Insecure dind configuration (privileged).
    # @section -- kestra dind insecure
    insecure:
      image:
        repository: docker
        pullPolicy: IfNotPresent
        tag: dind-rootless
      securityContext:
        privileged: true
        runAsUser: 0
        runAsGroup: 0
        allowPrivilegeEscalation: true
        capabilities:
          add:
            - SYS_ADMIN
            - NET_ADMIN
            - DAC_OVERRIDE
            - SETUID
            - SETGID
      args:
        - '--log-level=fatal'
```

### Troubleshooting DinD

If you encounter errors like the following on some Kubernetes deployments:

```bash
Device "ip_tables" does not exist.
ip_tables              24576  4 iptable_raw,iptable_mangle,iptable_nat,iptable_filter
modprobe: can't change directory to '/lib/modules': No such file or directory
error: attempting to run rootless dockerd but need 'kernel.unprivileged_userns_clone' (/proc/sys/kernel/unprivileged_userns_clone) set to 1
```

Attach to the DinD container to inspect logs:

```bash
docker run -it --privileged docker:dind sh
docker logs <container-id>
docker inspect <container-id>
```

## Disable DinD and use Kubernetes task runner

To avoid using `root` to spin up containers via DinD, disable DinD by setting the following [Helm chart values](https://github.com/kestra-io/kestra/blob/develop/charts/kestra/README.md#kestra-dind):

```yaml
dind:
  enabled: false
```

Use the Kubernetes task runner as the default method for running [script tasks](../../16.scripts/index.mdx):

```yaml
pluginDefaults:
  - type: io.kestra.plugin.scripts
    forced: true
    values:
      taskRunner:
        type: io.kestra.plugin.ee.kubernetes.runner.Kubernetes
        # ... your Kubernetes runner configuration
```
