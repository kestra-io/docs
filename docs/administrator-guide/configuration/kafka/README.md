---
order: 3
---
# Kafka configuration

## `kestra.kafka.client.properties`
Most important configuration is to configure the way Kestra connect to the Kafka cluster.


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


Here is another example with a secure Kafka cluster hosted by [Aiven](https://aiven.io):
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


`properties` is the standard Java Kafka client properties, more details can be found [on Kafka Documentation](https://kafka.apache.org/documentation/)

## `kestra.kafka.defaults.topic`
By default, Kestra automatically creates all the topics needed, you can change partition & replication factor of these topics :
- `kestra.kafka.defaults.topic.partitions`: (default 16)
- `kestra.kafka.defaults.topic.replication-factor`: (default 1)

## `kestra.kafka.defaults.[consumer|producer|stream].properties`
You can change the default properties of the Kafka client used by Kestra. These allow you to change compression, max request, etc...

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
All the topics used by Kestra are declared with default name & properties. You can change the default values:

- `kestra.kafka.defaults.topics.{{topic}}.name`: Change the name of this topic.
- `kestra.kafka.defaults.topics.{{topic}}.properties`: Change the default properties used during topic automatic creation.

You can see default configuration on this [file](https://github.com/kestra-io/kestra/blob/develop/cli/src/main/resources/application.yml)

## `kestra.kafka.defaults.consumer-prefix`
This configuration allow you to change the consumer-group prefix. By default, the prefix will be `kestra`.

For example, if you want to share a common Kafka cluster for the multiple instances of Kestra, add a different prefix for each instance like this:

```yaml
kestra:
  kafka:
    defaults:
      consumer-prefix: "uat_kestra"
```

## `kestra.kafka.defaults.topic-prefix`
This configuration allow you to change the topic prefix. By default, the prefix will be `kestra_`.

For example, if you want to share a common Kafka cluster for the multiple instances of Kestra, add a different prefix for each instance like this:

```yaml
kestra:
  kafka:
    defaults:
      topic-prefix: "uat_kestra"
```

## `kestra.kafka.client.loggers`
This configuration allow you to enable log for all messages from or to Kafka. Use this one to debug all the messages consumed, produced or both from Kafka.

::: warning
This configuration have a huge performance impact, using regexp & serialization for most of the messages.
:::

```yaml
kestra:
  kafka:
    client:
      loggers:
        - level: INFO # mandatory: ERROR, WARN, INFO, DEBUG, TRACE, the logger must be configured at least at this level for class io.kestra.runner.kafka.AbstractInterceptor
          type: PRODUCER # optional: CONSUMER or PRODUCER
          topic-regexp: "kestra_(executions|workertaskresult)" # optional: a regexp validating the topic
          key-regexp: .*parallel.* # optional: a regexp validating the key
          value-regexp: .*parallel.* # optional: a regexp validating the json full body
```