---
title: Configuration Reference
icon: /docs/icons/admin.svg
---

Almost everything is configurable in Kestra. This section describes the different configuration options available to Administrators.

## `kestra.elasticsearch`

**Elasticsearch is an [Enterprise Edition](/enterprise) functionality.**

The most important thing is to configure the way Kestra connects to the Elasticsearch cluster.

Here is a minimal configuration example:

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: "http://localhost:9200"
  repository:
    type: elasticsearch
```

Here is another example with a secured Elasticsearch cluster with basic authentication:

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts:
        - "http://node-1:9200"
        - "http://node-2:9200"
        - "http://node-3:9200"
      basic-auth:
        username: "<your-user>"
        password: "<your-password>"
  repository:
    type: elasticsearch
```

### `kestra.elasticsearch.client.trust-all-ssl`
Default `false`, if you enable this option, we trust all certificate during connection. Useful for development server with self-signed certificate.

```yaml
kestra:
  elasticsearch:
    client:
      http-hosts: "https://localhost:9200"
      trust-all-ssl: true
```

### `kestra.elasticsearch.defaults.indice-prefix`
This configuration allows to change the indices prefix. By default, the prefix will be `kestra_`.

For example, if you want to share a common Elasticsearch cluster for multiple instances of Kestra, add a different prefix for each instance like this:

```yaml
kestra:
  elasticsearch:
    defaults:
      indice-prefix: "uat_kestra"
```

### `kestra.elasticsearch.indices`
By default, a unique indices is used for all different data, it could be useful to split the index by day / week / month to avoid having large indices in ElasticSearch.

For now, `executions`, `logs` & `metrics` can be split, and we support all this split type:
- `DAILY`
- `WEEKLY`
- `MONTHLY`
- `YEARLY`

```yaml
kestra:
  elasticsearch:
    indices:
      executions:
        alias: daily
      logs:
        alias: daily
      metrics:
        alias: daily
```

#### Index Rotation

When you enable index rotation, it creates an alias and one index per periodicity (day, week, etc.).

It's safe to enable it on an existing instance however the alias will clash with the existing index so you should move the existing index, for example change `kestra_logs` to `kestra_logs-1` before switching to the alias.

As indexes will be created with `name-periodicity` using the `-1` suffix, make sure you will still include the old data (until you make the decision to purge it).

Be careful that not all indexes can be safely purged. You should only enable alias for historical data that keeps growing (like logs, metrics and executions).

It's safe to disable aliases but in the case existing data would not be recovered anymore.

It is totally safe to switch from one periodicity to another as the alias is for `name-*` so the periodicity is not important.

### `kestra.elasticsearch.client.trust-all-ssl`

### `kestra.indexer`
Indexer send data from Kafka to Elasticsearch using Bulk Request. You can control the batch size and frequency to reduce the load on ElasticSearch. This will delay some information on the UI raising that values, example:

```yaml
kestra:
  indexer:
    batch-size: 500 # (default value, any integer > 0)
    batch-duration: PT1S # (default value, any duration)
```

## `kestra.templates`
Templates are marked as [deprecated](../11.migration-guide/0.11.0/templates.md) and disabled by default starting from the 0.11.0 release. You can re-enable them with this configuration:

```yaml
kestra:
  templates:
    enabled: true
```

## `kestra.listeners`

Listeners are deprecated and disabled by default since the 0.11.0 release. You can re-enable them with this configuration:
```yaml
kestra:
  listeners:
    enabled: true
```


### `kestra.encryption`

Kestra 0.15.0 and later supports encryption of sensitive data. This allows inputs and outputs to be automatically encrypted and decrypted when they are stored in the database.

To enable encryption, you need to provide a base64-encoded secret key in the configuration:

```yaml
kestra:
  encryption:
    secret-key: BASE64_ENCODED_STRING_OF_32_CHARCTERS
```

To generate a 32-character string and then base64 encode it, you can use the defacto standard for cryptography, OpenSSL:

```bash
openssl rand -base64 32
```

If you don't have OpenSSL installed, you can use the following Bash commands to generate a base64-encoded 32-character encryption key:

```bash
random_string=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32)
echo "$random_string" | base64
```

If you run Kestra with Docker-Compose, here is how you can add that key in the `KESTRA_CONFIGURATION` environment variable in your `docker-compose.yml` file:

```yaml
  kestra:
    image: kestra/kestra:latest
    environment:
      KESTRA_CONFIGURATION: |
        kestra:
          encryption:
            secret-key: NWRhUDc5TERWY2QyMDhSSHhfeWYzbjJpNE5vb3M5NnY=
```


Once the secret key is set, you can use an `input` and `output` of type `SECRET`:

```yaml
id: my_secret_flow
namespace: company.team

inputs:
  - id: secret
    type: SECRET

tasks:
  - id: mytask
    type: io.kestra.plugin.core.log.Log
    message: task that needs the secret to connect to an external system

outputs:
  - id: secret_output
    type: SECRET
    value: "{{ inputs.secret }}"
```

When executing this flow, you will see a masked field:

![secret1](/docs/configuration-guide/secret1.png)


In the Execution Overview tab, you will see a masked value of the secret.

::alert{type="warning"}
If the `secret-key` is not set in the `kestra.encryption` configuration, you will get an error: `Illegal argument: Unable to use a SECRET input as encryption is not configured` when trying to use a `SECRET` input or output type.
::

## `endpoints`

Management endpoints can be set up from the [Micronaut endpoint configuration](https://docs.micronaut.io/latest/guide/index.html#endpointConfiguration). You can also secure all endpoints with basic authentication using this additional configuration:

```yaml
endpoints:
  all:
    basic-auth:
      username: your-user
      password: your-password
```

## `kestra.environment`

Here are the configuration options for the environment UI display.

You can add a label and a color to identify your environment in the UI by adding this configuration:

```yaml
kestra:
  environment:
    name: Production
    color: "#FCB37C"
```

You can also set that environment name and color directly from the UI. Just go to the settings page and type the desired Environment name and select the color.

![env_color](/docs/administrator-guide/configuration/env_color.png)

## JVM

All JVM options can be passed in an environment variable named `JAVA_OPTS`. You can use it to change all JVM options available, such as memory, encoding, etc.

Example:

```shell
export JAVA_OPTS="-Duser.timezone=Europe/Paris"
```

### `user.timezone`: Timezone
By default, Kestra will handle all dates using your system's timezone. You can change the timezone with JVM options.

Changing the timezone will mostly affect:
* **scheduler**: by default, all schedule dates are UTC; changing the Java timezone will allow scheduling the flow in your timezone.
* **logs display**: in your configured timezone.

## `kestra.kafka`

**Kafka is an [Enterprise Edition](/enterprise) functionality.**

### `kestra.kafka.client.properties`

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

### `kestra.kafka.defaults.topic`

By default, Kestra automatically creates all the needed topics. You can change the partition count and replication factor of these topics:

- `kestra.kafka.defaults.topic.partitions`: (default 16)
- `kestra.kafka.defaults.topic.replication-factor`: (default 1)

The number of topic's partitions limits the number of concurrently processing server instances consuming that particular topic. For example, using 16 partitions for every topic limits the effective number of instances to 16 executor servers, 16 worker servers, etc.

::alert{type="warning"}
For the optimal value of the replication factor, validate the actual configuration of the target Kafka cluster. Generally, for high availability, the value should match the number of Kafka brokers in the cluster. For example, a cluster consisting of 3 nodes should use the replication factor of 3.
::

### `kestra.kafka.defaults.[consumer|producer|stream].properties`

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

### `kestra.kafka.defaults.topics`

All the topics used by Kestra are declared with the default name and properties.
You can change the default values:

- `kestra.kafka.defaults.topics.{{topic}}.name`: Change the name of the topic.
- `kestra.kafka.defaults.topics.{{topic}}.properties`: Change the default properties used during topic automatic creation.

You can see default configuration on this [file](https://github.com/kestra-io/kestra/blob/develop/cli/src/main/resources/application.yml).

### `kestra.kafka.defaults.consumer-prefix`

This configuration allows changing the consumer-group prefix. By default, the prefix will be `kestra`.

For example, if you want to share a common Kafka cluster for multiple instances of Kestra, you must configure a different prefix for each instance like this:

```yaml
kestra:
  kafka:
    defaults:
      consumer-prefix: "uat_kestra"
```

### `kestra.kafka.defaults.topic-prefix`

This configuration allows changing the topic name prefix. By default, the prefix will be `kestra_`.

For example, if you want to share a common Kafka cluster for multiple instances of Kestra, add a different prefix for each instance like this:

```yaml
kestra:
  kafka:
    defaults:
      topic-prefix: "uat_kestra"
```

### `kestra.kafka.client.loggers`

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

### `kestra.kafka.stream.properties.state.dir`

Kestra uses the Kafka Stream framework, this framework uses a local directory for state persistence.
By default, the state directory is `/tmp/kafka-streams` and can be configured using the `kestra.kafka.stream.properties.state.dir` configuration property.

This directory should not be purged while the application runs but can be purged between restarts. If persisted between restarts, the startup time could be improved as the state of the Kafka Stream will be recovered from the directory.

It is advised to purge this directory before a Kestra update, if not, an error message may be displayed in the log that can be safely ignored.

### Topic retention

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

### Protecting against too big messages

::alert{type="info"}
Note: this is an experimental feature.
::

Kafka topic has a limit of the size of messages it can handle. By default, we set this limit to 10MiB.
If a message exceeds this limit, it may crash the executor and Kestra will stop.

To prevent that, you can configure a functionality that will automatically store too big messages to the internal storage.

```yaml
kestra:
  kafka:
    message-protection:
      enabled: true
```

The `hard-limit` is not mandatory, in this case messages of any size will be accepted.

## logger

You can change the log behavior in Kestra by adjusting the following configuration parameters:

```yaml
logger:
  levels:
    io.kestra.runner: TRACE
    org.elasticsearch.client: TRACE
    org.elasticsearch.client.sniffer: TRACE
    org.apache.kafka: DEBUG
    io.netty.handler.logging: TRACE
```


## `micronaut.server.netty.access-logger`: Access Log configuration
- `micronaut.server.netty.access-logger.enabled`: enable access log from webserver (default `true`).
- `micronaut.server.netty.access-logger.name`: logger name (default `io.kestra.webserver.access`).
- `micronaut.server.netty.access-logger.format`: access log format (default `"%{yyyy-MM-dd'T'HH:mm:ss.SSS'Z'}t | %r | status: %s | ip: %a | length: %b | duration: %D"`).
- `micronaut.server.netty.access-logger.exclusions`: list of regexp to define which log to exclude.

Here is the default values:

```yaml
micronaut:
  server:
    netty:
      access-logger:
        enabled: true
        name: io.kestra.webserver.access
        format: "[Date: {}] [Duration: {} ms] [Method: {}] [Url: {}] [Status: {}] [Length: {}] [Ip: {}] [Port: {}]"
        exclusions:
          - /ui/.+
          - /health
          - /prometheus
```

### Log Format

We are using [Logback](https://logback.qos.ch/) to handle log. You change the format of the log format, and we provide some default and common one configuring a [logback configuration files](https://logback.qos.ch/manual/).

If you want to customize the log format, you can create a `logback.xml` file and add it to the classpath. Then, add a new `JAVA_OPTS` environment variable: `"-Dlogback.configurationFile=file:/path/to/your/configuration/logback.xml"`

We provide some predefined configuration, and some example of the `logback.xml` files:

#### GCP
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false">
    <include resource="logback/base.xml" />
    <include resource="logback/gcp.xml" />

    <root level="WARN">
        <appender-ref ref="CONSOLE_JSON_OUT" />
        <appender-ref ref="CONSOLE_JSON_ERR" />
    </root>
</configuration>
```

#### Elastic Common Schema (ECS) format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="true">
  <include resource="logback/base.xml" />
  <include resource="logback/ecs.xml" />

  <root level="WARN">
    <appender-ref ref="CONSOLE_ECS_OUT" />
    <appender-ref ref="CONSOLE_ECS_ERR" />
  </root>
</configuration>
```

## `kestra.metrics`

You can set the prefix for all Kestra metrics using the following configuration:

```yaml
kestra:
  metrics:
    prefix: kestra
```

## `micronaut`

As Kestra is a Java-based application built with Micronaut, you can configure any Micronaut configuration options.
We will not explain all the possible configuration options, these are available [here](https://docs.micronaut.io/latest/guide/index.html). However, we will provide some tips on the most useful options:


### Configure port
```yaml
micronaut:
  server:
    port: 8086
```

### Configure SSL
[This guide](https://guides.micronaut.io/latest/micronaut-security-x509-maven-groovy.html) will help you configure SSL with Micronaut. A final working configuration would look as follows (considering you would use environment variables injection for passwords):
```yaml
micronaut:
  security:
    x509:
      enabled: true
  ssl:
    enabled: true
  server:
    ssl:
      client-authentication: need
      key-store:
        path: classpath:ssl/keystore.p12
        password: ${KEYSTORE_PASSWORD}
        type: PKCS12
      trust-store:
        path: classpath:ssl/truststore.jks
        password: ${TRUSTSTORE_PASSWORD}
        type: JKS
```

### Configure the timeout or max uploaded file size
A lot of configuration options affect these, here is the default configuration:
```yaml
micronaut:
  server:
    max-request-size: 10GB
    multipart:
      max-file-size: 10GB
      disk: true
    read-idle-timeout: 60m
    write-idle-timeout: 60m
    idle-timeout: 60m
    netty:
      max-chunk-size: 10MB
```

### Changing base path
If behind a reverse proxy, you can change the base path of the application with the following configuration:
```yaml
micronaut:
  server:
    context-path: "kestra-prd"
```


### Changing host resolution
If behind a reverse proxy, you can change host resolution (http/https/domain name) providing the header sent by your reverse proxy:
```yaml
micronaut:
  server:
    host-resolution:
      host-header: Host
      protocol-header: X-Forwarded-Proto
```


### Configuring CORS
In case you run into issues related to CORS policy, say while calling the webhook API from a JS application, you can enable the processing of CORS requests with the following configuration:
```yaml
micronaut:
  server:
    cors:
      enabled: true
```

For more detailed changes like allowing only specific origins or specific methods, you can refer [this guide](https://docs.micronaut.io/latest/guide/index.html#corsConfiguration).

## `kestra.plugins`

Configuration of Maven repositories used by the command `kestra plugins install`.

Maven Central is mandatory for Kestra and its plugins. However, you can add your own (Maven) repository in order to download your own plugins using the following configuration:

```yaml
kestra:
  plugins:
    repositories:
      central:
        url: https://repo.maven.apache.org/maven2/
      jcenter:
        url: https://jcenter.bintray.com/
      kestra:
        url: https://dl.bintray.com/kestra/maven
```

### Plugin configurations to enable or disable features

The `configuration` of `plugins` section can be also used to enable or disable some features of specific Kestra plugins, or to set some default values for them.

Here is an example of how to enable outputs for `Subflow` and `Flow` tasks:

```yaml
kestra:
  plugins:
    configurations:
      - type: io.kestra.plugin.core.flow.Subflow
        values:
          outputs:
            enabled: true # for backward-compatibility -- false by default
      - type: io.kestra.plugin.core.flow.Flow
        values:
          outputs:
            enabled: true # for backward-compatibility -- false by default
```

By default, the `outputs` property of a parent flow's `Subflow` task is deprecated in favor of flow `outputs` in Kestra 0.15.0 and higher. However, setting such configuration will keep the old behavior with the `outputs` property.

### Plugin configurations to set default values

You can also set default values for a plugin. For example, starting from Kestra 0.15.0, you can set the default value for the `recoverMissedSchedules` property of the `Schedule` trigger to `NONE` to avoid recovering missed scheduled executions after a server restart:

```yaml
kestra:
  plugins:
    configurations:
      - type: io.kestra.plugin.core.trigger.Schedule
        values:
          # Available options: LAST | NONE | ALL. The default is ALL
          recoverMissedSchedules: NONE
```

Before 0.15, Kestra was always recovering missed schedules. This means that if your server was down for a few hours, Kestra would recover all missed schedules when it was back up. This behavior was not always desirable, as often the recovery of missed schedules is not necessary e.g. during a planned maintenance window. This is why, starting from Kestra 0.15 release, you can customize the `recoverMissedSchedules` property and choose whether you want to recover missed schedules or not.

The `recoverMissedSchedules` configuration can be set to `ALL`, `NONE` or `LAST`:
- `ALL`: Kestra will recover all missed schedules. This is the default value.
- `NONE`: Kestra will not recover any missed schedules.
- `LAST`: Kestra will recover only the last missed schedule for each flow.

Note that this is a global configuration that will apply to all flows, unless explicitly overwritten within the flow definition:

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/15 * * * *"
    recoverMissedSchedules: NONE
```

In this example, the `recoverMissedSchedules` is set to `NONE`, which means that Kestra will not recover any missed schedules for this specific flow regardless of the global configuration.

### Restrict which plugins can be used

::alert{type="info"}
This is an [Enterprise Edition](/docs/enterprise) feature available starting with Kestra 0.19.
::

You can restrict which plugins can be used in a Kestra instance by configuring an allowlist / exclude list using regexes.

The following configuration only allow plugin from the `io.kestra` package and disallow the `io.kestra.plugin.core.debug.Echo` plugin.

```yaml
kestra:
  plugins:
    security:
      includes:
        - io.kestra.*
      excludes:
        - io.kestra.plugin.core.debug.Echo
```

### `kestra.plugins.defaults`

You can provide plugin defaults that will be applied to each task on your cluster **if a property is not defined** on flows or tasks. Plugin defaults allow ensuring a property is defined at a default value for these tasks.

```yaml
kestra:
  plugins:
    defaults:
    - type: io.kestra.plugin.core.log.Log
      values:
        level: ERROR
```

Forced plugin defaults ensure a property is set cluster-wise for a task, and no task can override it.
Forced plugin defaults can be handy to enforce security concerns, for example, by enforcing Shell tasks to run as Docker containers.

```yaml
kestra:
  plugins:
    defaults:
      - type: io.kestra.plugin.scripts.shell.Script
        forced: true
        values:
          runner: DOCKER
```

## `kestra.server`

### HTTP Basic Authentication

You can protect your Kestra installation with HTTP Basic Authentication.

```yaml
kestra:
  server:
    basic-auth:
      enabled: true
      username: admin
      password: kestra
```

HTTP Basic Authentication is disabled by default - you can enable it in your Kestra configuration, as shown above. If you need more fine-grained control over user and access management, the Enterprise Edition provides additional authentication mechanisms, including features such as SSO and RBAC. For more details, see
the [Authentication page](../06.enterprise/04.authentication.md).

### Delete configuration files

#### `kestra.configurations.delete-files-on-start`:

This setting allows to delete all configuration files after the server startup. It prevents the ability to read
configuration files (that may contain your secrets) from a Bash task for example. The server will keep these values in
memory, and they won't be accessible from tasks.

::ConfigPropertyCard
---
type: Boolean
defaultValue: false
---
::

### Server Liveness & Heartbeats

Kestra's servers use a heartbeat mechanism to periodically send their current state to the Kestra backend,
indicating their liveness. That mechanism is crucial for the timely detection of server failures and for ensuring
seamless continuity in workflow executions.

Here are the configuration parameters for all server types starting from Kestra **0.16.0**.

Note that although it's recommended to deploy the same configuration for all Kestra servers,
it's perfectly safe to set different values for those parameters depending on the server type.

#### `kestra.server.liveness.enabled`

Enable the liveness probe for the server. This property controls whether a server can be detected as `DISCONNECTED` or
not. Must always be `true` for production environment.

::ConfigPropertyCard
---
type: Boolean
defaultValue: true
---
::

#### `kestra.server.liveness.interval`

Frequency at which an `Executor` will check the liveness of connected servers.

::ConfigPropertyCard
---
type: Duration
defaultValue: 5s
---
::

#### `kestra.server.liveness.timeout`

The time an `Executor` will wait for a state update from a server before considering it as `DISCONNECTED`.

::ConfigPropertyCard
---
type: Duration
defaultValue: 45s
---
::

::alert{type="warning"}
Note that this parameter MUST be configured with the same value for all `Executor` server.
::

#### `kestra.server.liveness.initialDelay`

The initial delay after which an `Executor` will start monitoring the liveliness of a server joining the cluster.

::ConfigPropertyCard
---
type: Duration
defaultValue: 45s
---
::

::alert{type="warning"}
Note that this parameter MUST be configured with the same value for all `Executor` server.
::

#### `kestra.server.liveness.heartbeatInterval`

The interval at which a server will send a heartbeat indicating its current state.
Must be strictly inferior to `kestra.server.liveness.timeout`.

::ConfigPropertyCard
---
type: Duration
defaultValue: 3s
---
::

#### Recommended configuration for production

Here is the default and recommended configuration for production ():

**For JDBC deployment-mode (OSS):**
```yaml
kestra:
  server:
    liveness:
      enabled: true
      interval: 5s
      timeout: 45s
      initialDelay: 45s
      heartbeatInterval: 3s
```

**For Kafka deployment-mode (Enterprise Edition):**
```yaml
kestra:
  server:
    liveness:
      timeout: 1m
      initialDelay: 1m
```

::alert{type="warning"}
Note that Worker liveness is directly managed by the Apache Kafka protocol which natively provides
durability and reliability of task executions.
::

::collapse{title="For Kestra versions prior to 0.16.0"}


Prior to Kestra 0.16.0, the liveness mechanism was only supported by **Workers** ([JDBC deployment mode](../07.architecture/index.md#architecture-with-jdbc-backend)).
A **Worker** was either `UP` or `DEAD`. `Executors` was responsible to detect unhealthy workers as follows:

* If the last received Heartbeat for a `Worker` is older than `heartbeat-missed * frequency`, then the `Worker` is
  marked as unhealthy.
* If the last received Heartbeat for a `Worker` is older than `heartbeat-missed * frequency * 2`, then the `Worker` is
  deleted from the server metadata.

### `kestra.heartbeat.frequency`

The interval at which a Worker will send a heartbeat indicating its current state.

::ConfigPropertyCard
---
type: Duration
defaultValue: 10s
---
::

### `kestra.heartbeat.heartbeat-missed`

The number of missed heartbeats before `Executors` will consider a Worker as `DEAD`.

::ConfigPropertyCard
---
type: Integer
defaultValue: 3
---
::

### Worker Task Restart Strategy

Starting with Kestra `0.16.0`, you can configure the strategy to be used by `Executors` when a `Worker` is
detected as unhealthy regarding uncompleted tasks ([JDBC deployment mode](../07.architecture/index.md#architecture-with-jdbc-backend)).

#### `kestra.server.workerTaskRestartStrategy`

The strategy to be used for restarting uncompleted tasks in the event of a worker failure.

Supported strategies are:

* **`NEVER`**:

Tasks will never be restarted in the event of a worker failure (i.e., tasks are run at most once).

* **`IMMEDIATELY`**:

Tasks will be restarted immediately in the event of a worker failure, (i.e., as soon as a worker is detected
as `DISCONNECTED`).
This strategy can be used to reduce task recovery times at the risk of introducing duplicate executions (i.e., tasks are
run at least once).

* **`AFTER_TERMINATION_GRACE_PERIOD`**:

Tasks will be restarted on worker failure after the `kestra.server.terminationGracePeriod`.
This strategy should prefer to reduce the risk of task duplication  (i.e., tasks are run exactly once in the best
effort).


::ConfigPropertyCard
---
type: String
defaultValue: AFTER_TERMINATION_GRACE_PERIOD
validValues: NEVER, IMMEDIATELY, AFTER_TERMINATION_GRACE_PERIOD
---
::

### Termination Grace Period

When a Kestra Server receives a `SIGTERM` signal it will immediately try to stop gracefully.

Starting with Kestra `0.16.0`, you can configure the termination grace period for each Kestra Server.
The termination grace period defines the allowed period for a server to stop gracefully.

#### `kestra.server.terminationGracePeriod`

The expected time for the server to complete all its tasks before shutting down.

::ConfigPropertyCard
---
type: Duration
defaultValue: 5m
---
::


## `kestra.system-flows`

By default, the `system` namespace is reserved for [System Flows](../05.concepts/system-flows.md). These background workflows are intended to perform routine tasks such as sending alerts and purging old logs. If you want to overwrite the name used for System Flows, use the following configuration:

```yaml
kestra:
  system-flows:
    namespace: system
```

## `kestra.tasks`

### `kestra.tasks.scripts.docker.volume-enabled`

Volumes mount are disabled by default for security reasons, you can enabled it with this configurations:

```yaml
kestra:
  tasks:
    scripts:
      docker:
        volume-enabled: true
```

### Temporary storage configuration
Kestra writes temporary files during task processing. By default, files will be created on `/tmp`, but you can change the location with this configuration:

```yaml
kestra:
  tasks:
    tmp-dir:
      path: /home/kestra/tmp
```

**Note:** The `tmp-dir` path must be aligned to the volume path otherwise Kestra will not know what directory to mount for the `tmp` directory. 
```yaml
volumes:
  - kestra-data:/app/storage
  - /var/run/docker.sock:/var/run/docker.sock
  - /home/kestra:/home/kestra
```
In this example, `/home/kestra:/home/kestra` matches the tasks `tmp-dir` field.

### `kestra.tutorial-flows`

Tutorial flows are used to help users understand how Kestra works. They are used in the Guided Tour that allows you to select your use case and see how Kestra can help you solve it.

#### Disable Tutorial Flows

To disable the tutorial flows, set the `tutorial-flows` property to `false` in your configuration file.

```yaml
kestra:
  tutorial-flows:
    enabled: false # true by default
```

The tutorial flows are included in the open-source edition of Kestra by default. It's recommended to set that property to `false` in production environments to avoid unnecessary flows from being loaded into the production system.

## `kestra.variables`

### `kestra.variables.env-vars-prefix`

Kestra provides a way to use environment variables in your flow. By default, Kestra will only look at environment variables that start with `KESTRA_`. You can change this prefix by setting the `env-vars-prefix` configuration option:

```yaml
kestra:
  variables:
    env-vars-prefix: KESTRA_
```

These variables will be accessible in a flow with `{{ envs.your_env }}` in **lowercase without the prefix**.

For example, an environment variable with the name `KESTRA_MY_ENV` can be accessed using `{{ envs.my_env }}`.

### `kestra.variables.globals`

You can also set global variables directly in the configuration file. These variables will be accessible in all flows across the instance.

For example, the following variable will be accessible in a flow using `{{ globals.host }}`:

```yaml
kestra:
  variables:
    globals:
      host: pg.db.prod
```

Keep in mind that if a variable is in camel case, it will be transformed into hyphenated case. For example, the global variable shown below will be accessible in flows with `{{ globals['my-var'] }}` or `{{ globals['environment-name'] }}`:

```yaml
kestra:
  variables:
    globals:
      environment_name: dev
      myVar: my variable
```

### `kestra.variables.recursive-rendering`

Flag enabling the pre-0.14.0 [template recursive rendering](../11.migration-guide/0.14.0/recursive-rendering.md) behavior and giving administrators more time to migrate deployed flows. Defaults to `false`.

### `kestra.variables.cache-enabled`

The rendering of template variables can be CPU intensive, and by default we **enable** a cache of "templates". You can disable it, even though it's recommended keeping it enabled.

### `kestra.variables.cache-size`

The rendering of template variables cache is an LRU cache (keeps most commonly used variables) and will be cached in memory (default `1000`). You can change the size of the template cache (in number of templates) using this configuration. Keep in mind that the higher this number will be, the more memory the server will use.


## `kestra.webserver`

### `kestra.webserver.google-analytics`: Google Analytics ID
Add Google Analytics tracking ID (ex: `UA-12345678-1`) and report all page tracking.


### `kestra.webserver.html-head`: Append HTML tags to the webserver application
Useful for injecting CSS or JavaScript to customize a web application.

For example, here is how you can add a red banner in production environments:
```yaml
kestra:
  webserver:
    html-head: |
      <style type="text/css">
        .v-sidebar-menu .logo:after {
          background: var(--danger);
          display: block;
          content: "Local";
          position: relative;
          text-transform: uppercase;
          bottom: -65px;
          text-align: center;
          color: var(--white-always);
        }
      </style>
```
