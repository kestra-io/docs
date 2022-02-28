---
order: 2
---
# Deployment on Kubernetes

The recommended deployment environment for **production** workload is [Kubernetes](http://kubernetes.io/).
We provide a [Helm Charts](https://helm.sh/) in order to deploy your cluster.

- The chart repository is available [here](https://helm.kestra.io/).
- The source code of the charts is [here](https://github.com/kestra-io/helm-charts).

## Quick Start

```bash
helm repo add kestra https://helm.kestra.io/
helm install kestra --set kafka.enabled=true --set elasticsearch.enabled=true --set minio.enabled=true kestra/kestra
```

## Details
You can change the default behaviour and configuring your cluster changing the [defaults values](https://github.com/kestra-io/helm-charts/blob/master/charts/kestra/values.yaml).

By default, charts will only deploy kestra service with only 1 replica for each [servers](../../../architecture).

You can also deploy the standalone server (not for production), that will host all kestra servers in only one pod, using this values:
```yaml
kestra:
  deployments:
    webserver:
      enabled: false
    executor:
      enabled: false
    indexer:
      enabled: false
    scheduler:
      enabled: false
    worker:
      enabled: false
    standalone:
      enabled: true
```

The charts could also deploy all needed services:
- Zookeeper using `kafka.enabled: true`
- Kafka cluster using `kafka.enabled: true`
- Elasticsearch cluster using `elasticsearch.enabled: true`
- Minio standalone using `minio.enabled: true`

::: warning
All service (kafka, elasticsearch, zookeeper, minio) are deployed using unsecured configurations (no authentification, no tls, ...). When installing for a production environnement, you **need** to secure all these services and adapt all service configuration to be production ready.
:::

Most important values to adapt are [configuration files](../../configuration), with these values:
- `configuration`: in order to set the whole configuration files from kestra
- `secrets`: that will be merged with `configuration` but kept as secret on your k8s cluster.


