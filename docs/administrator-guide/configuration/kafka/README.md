---
order: 1
---
# Kafka configuration

## `kestra.kafka.client.properties`
Most important configuration is to configure the way Kestra connect to Kafka cluster.


Here is a minimal configuration example :
```yaml
kestra:
  kafka:
    client:
      properties:
        bootstrap.servers: "localhost:9092"
  queue:
    type: kafka
```


Here is another example with a secure kafka cluster hosted by [aiven](https://aiven.io):
```yaml
kestra:
  kafka:
    client:
      properties:
        bootstrap.servers: "your-host.aivencloud.com:12835"
        security.protocol: "SSL"
        ssl.endpoint.identification.algorithm: ""
        ssl.key.password: "<your-password>"
        ssl.keystore.location: "/etc/ssl/private/keystore.p12"
        ssl.keystore.password: "<your-password>"
        ssl.keystore.type: "PKCS12"
        ssl.truststore.location: "/etc/ssl/private/truststore.jks"
        ssl.truststore.password: "<your-password>"

  queue:
    type: kafka
```


`properties` is the standard java kafka client properties, more details can be found [on Kafka Documentation](https://kafka.apache.org/documentation/)

## `kestra.kafka.defaults.topic`
By default, Kestra automatically create all the topics needed, you can change partition & replication factor of these topics :
- `kestra.kafka.defaults.topic.partitions`: (default 16)
- `kestra.kafka.defaults.topic.replication-factor`: (default 1)

## `kestra.kafka.defaults.[consumer|producer|stream].properties`
You can change the default properties of Kafka client from Kestra. These allow you to change compression, max request, etc...

Here is the default configuration :
```yaml
kestra:
  kafka:
    defaults:
      consumer:
        properties:
          isolation.level: "read_committed"
          auto.offset.reset: "earliest"
          enable.auto.commit: "false"

      producer:
        properties:
          acks: "all"
          compression.type: "lz4"
          max.request.size: "10485760"

      stream:
        properties:
          processing.guarantee: "exactly_once"
          replication.factor: "${kestra.kafka.defaults.topic.replication-factor}"
          acks: "all"
          compression.type: "lz4"
          max.request.size: "10485760"
```





## `kestra.kafka.defaults.topics`
All the topic used by Kestra are declared with default name & properties. You can change the default values:

- `kestra.kafka.defaults.topics.{{topic}}.name`: Change the name of this topic.
- `kestra.kafka.defaults.topics.{{topic}}.properties`: Change the default properties used during topic automatic creation.

You can see default configuration on this [file](https://github.com/kestra-io/kestra/blob/develop/cli/src/main/resources/application.yml)

## `kestra.kafka.defaults.consumer-prefix`
This configuration allow you to change the consumer-group prefix. By default, the prefix will be `kestra`.

For example, if you want to share a common Kafka cluster for the multiple instance of Kestra, just add another prefix like this :

```yaml
kestra:
  kafka:
    defaults:
      consumer-prefix: "uat_kestra"
```

## `kestra.kafka.defaults.topic-prefix`
This configuration allow you to change the topic prefix. By default, the prefix will be `kestra_`.

For example, if you want to share a common Kafka cluster for the multiple instance of Kestra, just add another prefix like this :

```yaml
kestra:
  kafka:
    defaults:
      topic-prefix: "uat_kestra"
```

