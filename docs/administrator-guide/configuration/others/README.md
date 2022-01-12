---
order: 5
---
# Others Kestra configuration

## Url configuration
Some notification service need to have an url configuration defined in order to add some link directly to the web ui. Use full uri here with a trailing `/` (without ui or api).
```yaml
kestra:
  url: https://www.my-host.com/kestra/

```

## Plugins configuration
Configuration of maven repositories used for commande `plugins install`.
Default are necessary for kestra and plugins, but you can add your custom maven registries in order to download your own plugins with this command.

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

## Variables configuration

### `kestra.variables.env-vars-prefix`
Kestra provide a way to use environment variables in your flow.
By default, we only get environment variables that start with `KESTRA_`.

These variables will be accessible on flow with <code v-pre>{{ env.your_env }}</code>

For example env vars with name `KESTRA_MY_ENV` will be usable with  <code v-pre>{{ env.my_env }}</code>


### `kestra.variables.globals`
You can also provide from configuration files globals variables that will be accessible in all your flow.
Mostly it will be use for example to declare environnement on your instance, some global dataset, ...

```yaml
kestra:
  variables:
    globals:
      env: dev

```
These variables will be accessible on flow with <code v-pre>{{ globals.env }}</code>


### `kestra.variables.disable-handlebars`
By default, [deprecated handlebars](../../../developer-guide/variables/deprecated-handlebars) is disabled, you can enable it with `true` value.


### `kestra.tasks.defaults`
You can also provide from configuration files tasks defaults that will be applied on each tasks on your cluster **if not defined** on flow or tasks.
Mostly it will allow you to be sure a value was defined at a default value for these tasks type.

```yaml
kestra:
  tasks:
    defaults:
    - type: io.kestra.core.tasks.debugs.Echo
      level: ERROR
```
These variables will be accessible on flow with <code v-pre>{{ globals.env }}</code>


```yaml
kestra:
  tasks:
    defaults:
    - type: io.kestra.core.tasks.debugs.Echo
      level: ERROR
```
These variables will be accessible on flow with <code v-pre>{{ globals.env }}</code>


## Metrics configuration

- `kestra.metrics.prefix`: Change the prefix for [all metrics](../monitoring) for Kestra(default: kestra)


## Servers configuration

### `kestra.server.access-log`: Access Log configuration
- `kestra.server.access-log.enabled`: Enabled access log from webserver (default `true`)
- `kestra.server.access-log.name`: Logger name (default `io.kestra.webserver.access`)
- `kestra.server.access-log.format`: Access log format (default `[Date: {}] [Duration: {} ms] [Method: {}] [Url: {}] [Status: {}] [Length: {}] [Ip: {}] [Port: {}]`)
- `kestra.server.access-log.filters`: list of regexp that will log, use `.*` to enable all  (default `- ".*\\[Url: /api/.*"`)

Here is the default values:
```yaml
kestra:
  server:
    access-log:
      enabled: true
      name: io.kestra.webserver.access
      format: "[Date: {}] [Duration: {} ms] [Method: {}] [Url: {}] [Status: {}] [Length: {}] [Ip: {}] [Port: {}]"
      filters:
        - ".*\\[Url: /api/.*"
```

### `kestra.configurations.delete-files-on-start`: Delete configurations files
This setting allow you to delete all configurations just after the server startup. It prevents to be able to read configurations files (that may contain your secrets) from a Bash task for example. The server will keep this value on memory and won't be accessible from tasks. `true` or `false` (default `false`)

## Endpoint configuration
Endpoint configuration can be done with micronaut configuration from [micronaut](https://docs.micronaut.io/latest/guide/index.html#endpointConfiguration).
You can also secure all endpoint with an basic auth authentification with this additional configuration :

```yaml
endpoints:
  all:
    basic-auth:
      username: your-user
      password: your-password
```

## Temporary storage configuration
Kestra write some temporary files during task processing, but default file will be created on `/tmp` but you can change the location with this configuration :
```yaml
kestra:
  tasks:
    tmp-dir:
      path: /home/kestra/tmp
```

## JVM configuration

All JVM options can be passed as environment vars name `JAVA_OPTS`. You can use it to change all JVM options available like memory, encoding, ...

example:

```shell
export JAVA_OPTS="-Duser.timezone=Europe/Paris"
```

### `user.timezone`: Timezone
By default, Kestra will handle all date with your system timezone. You can change the timezone with JVM options.
Changing the timezone will affect mostly :
* **scheduler**: by default, all schedule date is UTC, changing the java timezone will allow you to schedule flow in your timezone.
* **log**:  that will be displayed on your timezone.




## Anonymous usage report

Understanding how you use Kestra is very important to us: it helps us improve the solution in many different ways.
For this very reason, the `kestra.anonymous-usage-report.enabled` option is mandatory: we want you to take time to consider whether or not you wish to share anonymous data with us so we can benefit from your experience and use cases.

- `kestra.anonymous-usage-report.enabled`: (default true)
- `kestra.anonymous-usage-report.initial-delay`: (default 5m)
- `kestra.anonymous-usage-report.fixed-delay`: (default 1h)

### Collected Data

The collected data can be found [here](https://github.com/kestra-io/kestra/tree/develop/core/src/main/java/io/kestra/core/models/collectors), We collect only **anonymous data** that allow to understand how you used Kestra. Mostly the data collected are :

- **host data:** cpu, ram, os, jvm and a fingerprint of the machine
- **plugins data:** the list of plugins installed and the current version
- **flow data:** the namespace count, flow count, the task type and the trigger type used.
- **execution data:** the execution & taskruns count for last 2 days with count and duration grouped by status
- **common data:** the server type, version, timezone, env, start time and url