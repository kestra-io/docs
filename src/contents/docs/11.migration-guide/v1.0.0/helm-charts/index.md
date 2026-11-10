---
title: Helm Chart Updates in Kestra 1.0.0 for Production
h1: Major Helm Chart Restructuring for Production Deployments in 1.0.0
sidebarTitle: Helm Chart Restructure
icon: /src/contents/docs/icons/migration-guide.svg
release: 1.0.0
editions: ["OSS", "EE"]
description: Major updates and restructuring of Kestra Helm charts for production-grade deployments in version 1.0.0.
---


## Helm Chart Updates

Kestra's Helm charts have been updated to be more comprehensive for production environments while also offering charts for starter use cases. Previously, a single chart deployed one standalone Kestra service with one replica (all Kestra server components in a single pod) with preinstalled dependencies such as PostgreSQL and MinIO — helpful to get started but typically unnecessary for production. The Kestra Operator is also available as a custom Kubernetes Operator for reading Resource Definitions to conduct various actions in Kestra.

We also restructured configurations and values to be more comprehensive and production grade.

There are now three charts: `kestra` (production chart), `kestra-starter` (starter chart with dependencies), and `kestra-operator` (Enterprise only custom Kubernetes operator).

:::alert{type="info"}
Breaking changes have been made to the Helm chart to support the new features and improvements in Kestra 1.0.0. Review the following changes carefully before upgrading.
:::

## `kestra`

This chart is intended for production deployments. Here is how you can install it under the release name `my-kestra`:

```bash
$ helm repo add kestra https://helm.kestra.io/
$ helm install my-kestra kestra/kestra --version 1.0.0
```

PostgreSQL, MinIO, Kafka, and Elasticsearch have been removed from the chart dependencies. You can now use your own managed services or deploy them separately. To install Kestra with dependencies, use the `kestra-starter` chart, but you will then need to manage those dependencies yourself.

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
## more...
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

The method for providing custom configuration files to Kestra has changed. It is now all under the `configurations` entry in the `values.yaml` file.

### Before

```yaml
### This creates a config map of the Kestra configuration
configuration: {}
## Example: Setting the plugin defaults for the Docker runner
##   kestra:
##     plugins:
##       configurations:
##         - type:  io.kestra.plugin.scripts.runner.docker.Docker
##           values:
##             volume-enabled: true
### This will create a Kubernetes Secret for the values provided
## This will be appended to kestra-secret with the key application-secrets.yml
secrets: {}
## Example: Store your postgres backend credentials in a secret
##   secrets:
##     kestra:
##       datasources:
##         postgres:
##           username: pguser
##           password: mypass123
##           url: jdbc:postgresql://pghost:5432/db
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
## configurationPath: /app/application.yml,/app/application-secrets.yml
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

The way `dind` is managed has been updated. It is now under the `dind` entry in the `values.yaml`. A `dind.mode` option is now available to choose between `rootless` and `insecure`; `rootless` is the default and recommended mode.

For a full list of values, refer to the [Values](https://github.com/kestra-io/kestra/blob/develop/charts/kestra/README.md#values) in the chart's source code.
