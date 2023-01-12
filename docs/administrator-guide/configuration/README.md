---
order: 3
---
# Configuration

Kestra offers a lot of configuration options in order to customize the way you use it. 

## Kestra configuration 
First things first, you will need to configure the queue type and the repository type.

### Kafka configuration  
To enable Kafka Queue, you need to add the following to your configuration files:
```yaml
kestra:
  queue:
    type: kafka
```

Details about your Kafka configuration can be found [here](./kafka)

### ElasticSearch configuration
To enable ElasticSearch Repository, you need to add the following to your configuration files:
```yaml
kestra:
  repository:
    type: elasticsearch
```

Details about ElasticSearch configuration can be found [here](./elasticsearch)

### Storage configuration
Kestra supports multiple storage options, the default being local storage (**only for local testing**).
To choose another storage type, you will need to configure the `kestra.storage.type` option, be sure to download the corresponding plugins first. The following example configure the [Google Cloud Storage](./storage/README.md#gcs) storage.
```yaml
kestra:
  storage:
    type: gcs
```

Details about Storage configuration can be found [here](./storage).

### Others Kestra configuration

Others Kestra configurations can be found [here](./others).

### Micronaut configuration

Since Kestra is a Java based application built with Micronaut, you can configure it to fit your needs, more details [here](./micronaut).
