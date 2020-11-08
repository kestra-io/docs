---
order: 3
---
# Configuration

Kestra have a lot of configuration in orders to customize the way you use it. 

## Kestra configuration 
First things, you will need to configure the queue type and the repository type.

### Kafka configuration  
To enable Kafka Queue, we need add this to your configuration files:
```yaml
kestra:
  queue:
    type: kafka
```

Details about Kafka configuration is [here](./kafka)

### ElasticSearch configuration
To enable ElasticSearch Repository, we need add this to your configuration files:
```yaml
kestra:
  repository:
    type: elasticsearch
```

Details about ElasticSearch configuration is [here](./elasticsearch)

### Storage configuration
Kestra support multiple storage, the default one a local storage (**only for local testing**)
To choose the storage type, you will need to add this to your configuration files and be sure to download the corresponding plugins.
```yaml
kestra:
  storage:
    type: gcs
```

Details about Storage configuration is [here](./storage)

### Others Kestra configuration

Others Kestra configurations can be found [here](./others)

### Micronaut configuration

Since Kestra is a Java app based on micronaut, you can configure to fit your need, more details [here](./micronaut)
