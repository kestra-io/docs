---
title: Kafka
icon: /docs/icons/admin.svg
editions: ["EE"]
---

Configure Kestra Enterprise Edition to use Kafka as a queue.

**Kafka is an [Enterprise Edition](/enterprise) functionality.**

## `kestra.kafka.client.properties`

The most important configuration step is defining how Kestra should connect to the Kafka cluster.

Here is a minimal configuration example:

```yaml
kestra:
  kafka:
    client:
      properties:
        bootstrap.servers: "localhost:9092"
  queue:
    type: kafka
```

Here is another example with SSL configuration:

```yaml
kestra:
  kafka:
    client:
      properties:
        bootstrap.servers: "host:port"
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

`kestra.kafka.client.properties` allows passing any standard Kafka properties. More details can be found [on the Kafka Documentation](https://kafka.apache.org/documentation/).

## `kestra.kafka.defaults.topic`

By default, Kestra automatically creates all the needed topics. You can change the partition count and replication factor of these topics:

- `kestra.kafka.defaults.topic.partitions`: (default 16)
- `kestra.kafka.defaults.topic.replication-factor`: (default 1)

The number of topic's partitions limits the number of concurrently processing server instances consuming that particular topic. For example, using 16 partitions for every topic limits the effective number of instances to 16 executor servers, 16 worker servers, etc.

::alert{type="warning"}
For the optimal value of the replication factor, validate the actual configuration of the target Kafka cluster. Generally, for high availability, the value should match the number of Kafka brokers in the cluster. For example, a cluster consisting of 3 nodes should use the replication factor of 3.
::

## `kestra.kafka.defaults.[consumer|producer|stream].properties`

You can change the default properties of the Kafka client used by Kestra. These allow you to change any available properties.

Here is the default configuration:

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
          state.dir: "/tmp/kafka-streams"
```

## `kestra.kafka.defaults.topics`

All the topics used by Kestra are declared with the default name and properties.
You can change the default values:

- `kestra.kafka.defaults.topics.{{topic}}.name`: Change the name of the topic.
- `kestra.kafka.defaults.topics.{{topic}}.properties`: Change the default properties used during topic automatic creation.

You can see default configuration on this [file](https://github.com/kestra-io/kestra/blob/develop/cli/src/main/resources/application.yml).

## `kestra.kafka.defaults.consumer-prefix`

This configuration allows changing the consumer-group prefix. By default, the prefix will be `kestra`.

For example, if you want to share a common Kafka cluster for multiple instances of Kestra, you must configure a different prefix for each instance like this:

```yaml
kestra:
  kafka:
    defaults:
      consumer-prefix: "uat_kestra"
```

## `kestra.kafka.defaults.topic-prefix`

This configuration allows changing the topic name prefix. By default, the prefix will be `kestra_`.

For example, if you want to share a common Kafka cluster for multiple instances of Kestra, add a different prefix for each instance like this:

```yaml
kestra:
  kafka:
    defaults:
      topic-prefix: "uat_kestra"
```

## `kestra.kafka.client.loggers`

This configuration allows enabling logging for all messages processed by the Kafka cluster. Use it to debug all the messages consumed or produced on the Kafka cluster.

::alert{type="warning"}
This configuration has a huge performance impact, using regexp and serialization for most of the messages.
::

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

## `kestra.kafka.stream.properties.state.dir`

Kestra uses the Kafka Stream framework, this framework uses a local directory for state persistence.
By default, the state directory is `/tmp/kafka-streams` and can be configured using the `kestra.kafka.stream.properties.state.dir` configuration property.

This directory should not be purged while the application runs but can be purged between restarts. If persisted between restarts, the startup time could be improved as the state of the Kafka Stream will be recovered from the directory.

It is advised to purge this directory before a Kestra update, if not, an error message may be displayed in the log that can be safely ignored.

## Topic retention

Each Kafka topic used by Kestra is configurable using the following configuration property:

```yaml
kestra:
  kafka:
    topics:
      execution:
        properties:
          kafka.property: value
```

By default, except for topics where we need unlimited retention as they store referential data like flow or trigger definition, all topics are configured with a default retention of 7 days.

For example, for the topic storing executions, you can configure the retention via this configuration property:

```yaml
  kafka:
    topics:
      execution:
        properties:
          retention.ms: "86400000"
```

## Protecting against too big messages

::alert{type="info"}
Note: this is an experimental feature.
::

Kafka topic has a limit of the size of messages it can handle. By default, we set this limit to 10MiB.
If a message exceeds this limit, it may crash the executor and Kestra will stop.

To prevent that, you can configure a functionality that will automatically store too big messages to the internal storage.

The following configuration will store all messages that exceed 1MiB to the internal storage, and refuse messages that exceed 10MiB by failing the execution, the executor will not crash, and Kestra will keep functioning.

```yaml
kestra:
  kafka:
    message-protection:
      soft-limit: 1048576
      hard-limit: 10485760
```

The `hard-limit` is not mandatory, in this case messages of any size will be accepted.