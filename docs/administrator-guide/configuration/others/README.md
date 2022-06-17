---
order: 7
---
# Others Kestra configuration

## Url configuration
Some notification services require a URL configuration defined in order to add some links directly to the Web UI. Use a full uri here with a trailing `/` (without ui or api).

```yaml
kestra:
  url: https://www.my-host.com/kestra/

```

## Plugins configuration
Configuration of maven repositories used for the command `plugins install`.
Defaults are necessary for Kestra and plugins, but you can add your own custom maven registries in order to download your own plugins with this command.

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

## Docker configurations


### `kestra.tasks.scripts.docker.volume-enabled`
Volumes mount are disabled by default for security reasons, you can enabled it with this configurations:
```yaml
kestra:
  tasks:
    scripts:
      docker:
        volume-enabled: true
```

## Variables configurations

### `kestra.variables.env-vars-prefix`
Kestra provides a way to use environment variables in your flow.
By default, we only get environment variables that start with `KESTRA_`.

These variables will be accessible on flow with <code v-pre>{{ env.your_env }}</code>

For example, env vars with the name `KESTRA_MY_ENV` will be usable with  <code v-pre>{{ env.my_env }}</code>


### `kestra.variables.globals`
You can also provide globals variables from the configuration files that will be accessible in all your flows.
Mostly these will be used to declare the environment on your instance,  such as global datasets, for example

```yaml
kestra:
  variables:
    globals:
      env: dev

```
These variables will be accessible on flows with <code v-pre>{{ globals.env }}</code>


### `kestra.variables.disable-handlebars`
By default, [deprecated handlebars](../../../developer-guide/variables/deprecated-handlebars) is disabled, it can be enabled with `true` value.


### `kestra.variables.cache-enabled`
The rendering of template variables can be cpu intensive, and by default we **enable** a cache of "templates". You can disable it, but it's really recommended keeping it enabled.

### `kestra.variables.cache-size`
The rendering of template variables cache is an LRU cache (keep most used) and will be in memory (default `1000`). You can change the size of the template cache (in number of template), take care that more this number will be high, the more memory server will use, maybe for not so many use templates.

### `kestra.tasks.defaults`
You can also provide from configuration files tasks defaults that will be applied on each tasks on your cluster **if not defined** on flow or tasks.
Mostly it will allow you to be sure a value was defined at a default value for these task types.

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
This setting allows you to delete all configurations just after the server startup. It prevents the ability to read configurations files (that may contain your secrets) from a Bash task for example. The server will keep this value on memory and won't be accessible from tasks. Values are either `true` or `false` (default `false`)

## Endpoint configuration
Endpoint configuration can be done with micronaut configuration from [micronaut](https://docs.micronaut.io/latest/guide/index.html#endpointConfiguration).
You can also secure all endpoints with a basic auth authentification using this additional configuration:

```yaml
endpoints:
  all:
    basic-auth:
      username: your-user
      password: your-password
```

## Temporary storage configuration
Kestra writes temporary files during task processing. By default files will be created on `/tmp`, but you can change the location with this configuration:

```yaml
kestra:
  tasks:
    tmp-dir:
      path: /home/kestra/tmp
```

## JVM configuration

All JVM options can be passed as environmental vars named `JAVA_OPTS`. You can use it to change all JVM options available, such as memory, encoding, etc...

Example:

```shell
export JAVA_OPTS="-Duser.timezone=Europe/Paris"
```

### `user.timezone`: Timezone
By default, Kestra will handle all dates using your system's timezone. You can change the timezone with JVM options.

Changing the timezone will mostly affect:
* **scheduler**: by default, all schedule dates are UTC, changing the java timezone will allow you to schedule the flow in your timezone.
* **log**:  that will be displayed on your timezone.




## Anonymous usage report

Understanding how you use Kestra is very important to us: it helps us improve the solution in many ways.
For this very reason, the `kestra.anonymous-usage-report.enabled` option is mandatory: we want you to take time to consider whether you wish to share anonymous data with us, so we can benefit from your experience and use cases.

- `kestra.anonymous-usage-report.enabled`: (default true)
- `kestra.anonymous-usage-report.initial-delay`: (default 5m)
- `kestra.anonymous-usage-report.fixed-delay`: (default 1h)

### Collected Data

The collected data can be found [here](https://github.com/kestra-io/kestra/tree/develop/core/src/main/java/io/kestra/core/models/collectors). We collect only **anonymous data** that allows us to understand how you used Kestra. The data collected includes:

- **host data:** cpu, ram, os, jvm and a fingerprint of the machine
- **plugins data:** the list of plugins installed and the current version
- **flow data:** the namespace count, flow count, the task type and the trigger type used.
- **execution data:** the execution & taskruns count for last 2 days with count and duration grouped by status
- **common data:** the server type, version, timezone, env, start time and url


## Webserver configuration

### `kestra.webserver.google-analytics`: Google Analytics ID
Add Google Analytics tracking ID (ex: `UA-12345678-1`) and report all page tracking.


### `kestra.webserver.html-head`: Append some head tags on the webserver application
Mostly useful for injecting css or javascript to customize a web application.

For example, you can add a red banner on production environments:
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
