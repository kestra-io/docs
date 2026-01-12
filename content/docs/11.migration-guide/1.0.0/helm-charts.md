---
title: Helm Chart Updates
icon: /docs/icons/migration-guide.svg
release: 1.0.0
editions: ["OSS", "EE"]
---

## Overview

We have updated our Helm charts to be more comprehensive for production environments while also offering charts for starter use cases. Previously, we offered one chart that deployed one standalone Kestra service with one replica (i.e., all Kestra server components deployed in a single pod). It also came with preinstalled dependencies, such as PostgreSQL and MinIO, which were helpful to get started, but which were typically unnecessary for production installations. The Kestra Operator is also available as a custom Kubernetes Operator, specifically for reading Resource Definitions to conduct various actions in Kestra.

We also restructured configurations and values to be more comprehensive and production grade.

There are now three charts: `kestra` (production chart), `kestra-starter` (starter chart with dependencies), and `kestra-operator` (Enterprise only custom Kubernetes operator).

:::alert{type="info"}
Breaking changes have been made to the Helm chart in order to support the new features and improvements introduced in Kestra 1.0.0. Please review the following changes carefully before upgrading.
:::

## `kestra`

This chart is intended for production deployments. Here is how you can install it under the release name `my-kestra`:

```bash
$ helm repo add kestra https://helm.kestra.io/
$ helm install my-kestra kestra/kestra --version 1.0.0
```

We removed PostgreSQL, MinIO, Kafka and Elasticsearch from the chart dependencies. You can now use your own managed services or deploy them separately. If you want to install Kestra with dependencies, use `kestra-starter` chart. Keep in mind, that you will then have to manage these dependencies yourself.

## Deployment configuration

Most of the deployment configuration options have been restructured. There is now a common entry in the `values.yaml` — compare the `Before` and `After` sections below.

### Before

```yaml
nodeSelector: {}
tolerations: []
affinity: {}
extraVolumeMounts: []
extraVolumes: []
extraEnv: []
# more...
```

### After

```yaml
common:
  nodeSelector: {}
  tolerations: []
  affinity: {}
  extraVolumeMounts: []
  extraVolumes: []
  extraEnv: []
  # more...
```

You can override all those configuration options in the `deployments` entry in the `values.yaml` file.

```yaml
deployments:
  standalone:
    nodeSelector: {}
    tolerations: []
    affinity: {}
    extraVolumeMounts: []
    extraVolumes: []
    extraEnv: []
    # more...
```

## Custom configuration files

We changed the way to provide custom configuration files to Kestra. It's now all under configurations entry in the `values.yaml` file.

### Before

```yaml
### This creates a config map of the Kestra configuration
configuration: {}
# Example: Setting the plugin defaults for the Docker runner
#   kestra:
#     plugins:
#       configurations:
#         - type:  io.kestra.plugin.scripts.runner.docker.Docker
#           values:
#             volume-enabled: true
### This will create a Kubernetes Secret for the values provided
## This will be appended to kestra-secret with the key application-secrets.yml
secrets: {}
# Example: Store your postgres backend credentials in a secret
#   secrets:
#     kestra:
#       datasources:
#         postgres:
#           username: pguser
#           password: mypass123
#           url: jdbc:postgresql://pghost:5432/db
### Load Kestra configuration from existing secret
## Here this assumes the secret is already deployed and the following apply:
## 1. The secret type is "Opaque"
## 2. The secret has a single key
## 3. The value of the secret is the Kestra configuration.
externalSecret: {}
  #secretName: secret-name
  #key: application-kestra.yml
### configuration files
## This option allows you to reference existing local files to configure Kestra, e.g.
configurationPath:
# configurationPath: /app/application.yml,/app/application-secrets.yml
extraConfigMapEnvFrom:
  # - name: my-existing-configmap-no-prefix
  # - name: my-existing-configmap-with-prefix
  #   prefix: KESTRA_
extraSecretEnvFrom:
  # - name: my-existing-no-prefix
  # - name: my-existing-with-prefix
  #   prefix: SECRET_
```

### After

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
        password: ""
        driver-class-name: org.h2.Driver
  configmaps:
    - name: kestra-others
      key: others.yml
  secrets:
    - name: kestra-basic-auth
      key: basic-auth.yml
```

There is no more need to take care of `configurationPath:`; it's automatically managed by the chart. If you need to add extra environment variables from existing `ConfigMaps` or `Secrets`, you can still use `extraEnv` and `extraEnvFrom` under the `common` entry.

## Managing Docker in Docker (dind)

We upgraded the way that `dind` is managed. It's now under the `dind` entry in the `values.yaml`. We added `dind.mode`, to choose between `rootless` and `insecure` ; `rootless` is the default and recommended mode.

For a full list of values, refer to the [Values](https://github.com/kestra-io/helm-charts/tree/master/charts/kestra/README.md#values) in the chart's source code.
