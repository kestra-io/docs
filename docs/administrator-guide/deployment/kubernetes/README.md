---
order: 2
---
# Deployment on Kubernetes

The recommended deployment environment for **production** workloads is [Kubernetes](http://kubernetes.io/).
We provide a [Helm Chart](https://helm.sh/) in order to deploy your cluster.

- The chart repository is available [here](https://helm.kestra.io/).
- The source code of the charts can be found [here](https://github.com/kestra-io/helm-charts).

## Quick Start

```bash
helm repo add kestra https://helm.kestra.io/
helm install kestra kestra/kestra
```

## Details
You can change the default behavior and configure your cluster changing the [defaults values](https://github.com/kestra-io/helm-charts/blob/master/charts/kestra/values.yaml).

By default, the chart will only deploy one kestra standalone [service](../../../architecture) (all kestra servers in only one pod) with only 1 replica.

You can also deploy each server independently, using these values:
```yaml
kestra:
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

The chart could also deploy all needed services:
- A Kafka cluster and Zookeeper using `kafka.enabled: true`
- An Elasticsearch cluster using `elasticsearch.enabled: true`
- A Minio standalone using `minio.enabled: true`
- A PostgreSQL using `postgresql.enabled: true`

By default, we enable Minio & PostgreSQL to have a working version.

::: warning
All services (Kafka, Elasticsearch, Zookeeper, Minio, PostgreSQL) are deployed using unsecured configurations (no authentication, no TLS, ...). When installing for a production environnement, you **need** to secure all these services and adapt all services configurations to be production ready.
:::


## Configuration

[Configuration](../../configuration) of Kestra could be made:
- In a Kubernetes `ConfigMap` via the `configuration` Helm value.
- In a Kubernetes `Secret` via the `secrets` Helm value.
Both must be valid YAML that will be merged as the Kestra configuration file.

For example, to enable Kafka as the queue implementation and configure its `bootstrap.servers` property inside a secret:

```yaml
configuration:
  kestra:
    queue:
      type: kafka


secrets:
  kestra:
    kafka:
      client:
        properties:
          bootstrap.servers: "localhost:9092"
```
