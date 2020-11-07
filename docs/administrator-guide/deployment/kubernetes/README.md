---
order: 2
---
# Deployment on Kubernetes

The recommended deployment environment for **production** workload is [Kubernetes](http://kubernetes.io/). 
We provide an [Helm Charts](https://helm.sh/) in order to deploy your cluster. 


- The chart repository is available [here](https://helm.kestra.io/).
- The source code of the charts is [here](https://github.com/kestra-io/helm-charts). 

By default, the helm can deploy : 
- Zookeeper using `kafka.enabled: true`
- Kafka cluster using `kafka.enabled: true`
- Elasticsearch cluster using `elasticsearch.enabled: true`
- All [Kestra servers](../../../architecture) in separate pods. 


You can change the default behaviour and configuring your cluster changing the [defaults values](https://github.com/kestra-io/helm-charts/blob/master/charts/kestra/values.yaml).


Most important configuration that will provide Kestra [configuration files](../../configuration) are:
- `configuration`: in order to set the whole configuration files from kestra
- `secrets`: that will be merged with `configuration` but kept as secret on your k8s cluster.


