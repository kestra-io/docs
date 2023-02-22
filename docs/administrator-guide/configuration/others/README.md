---
order: 7
---
# Others Kestra configuration

## URL configuration
Some notification services require a URL configuration defined in order to add some links directly to the Web UI. Use a full URI here with a trailing `/` (without ui or api).

```yaml
kestra:
  url: https://www.my-host.com/kestra/

```

## Plugins configuration
Configuration of Maven repositories used by the command `kestra plugins install`.

Maven Central is mandatory for Kestra and its plugins, but you can add your own Maven repository in order to download your own plugins with this command.

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

## Docker configuration


### `kestra.tasks.scripts.docker.volume-enabled`
Volumes mount are disabled by default for security reasons, you can enabled it with this configurations:
```yaml
kestra:
  tasks:
    scripts:
      docker:
        volume-enabled: true
```

## Variables configuration

### `kestra.variables.env-vars-prefix`
Kestra provides a way to use environment variables in your flow.
By default, we only get environment variables that start with `KESTRA_`, use this configuration option to change this prefix.

These variables will be accessible inside a flow with <code v-pre>{{ env.your_env }}</code>.

For example, an environment variable with the name `KESTRA_MY_ENV` will be usable with  <code v-pre>{{ env.my_env }}</code>.


### `kestra.variables.globals`
You can also provide global variables that will be accessible in all your flows.
These can be used to declare the environment on your instance, such as global datasets for example.


For example, this variable will be accessible inside a flow with <code v-pre>{{ globals.env }}</code>:
```yaml
kestra:
  variables:
    globals:
      env: dev

```


### `kestra.variables.disable-handlebars`
By default, [deprecated handlebars](../../../developer-guide/variables/deprecated-handlebars) is disabled, it can be enabled by setting this option to `true`.


### `kestra.variables.cache-enabled`
The rendering of template variables can be CPU intensive, and by default we **enable** a cache of "templates". You can disable it, but it's really recommended keeping it enabled.

### `kestra.variables.cache-size`
The rendering of template variables cache is an LRU cache (keep most used) and will be in memory (default `1000`). You can change the size of the template cache (in number of templates), take care that the higher this number will be, the more memory the server will use, maybe for not so many used templates.

### `kestra.tasks.defaults`
You can also provide task defaults that will be applied on each task on your cluster **if not defined** on flows or tasks unless the task default is forced.
It will allow being sure a value was defined at a default value for these tasks.

```yaml
kestra:
  tasks:
    defaults:
    - type: io.kestra.core.tasks.debugs.Echo
      level: ERROR
```

Forced task default allow to make sure a value is set cluster-wise for a task attribute and no task can override it. 
This can be handy to enforce security concerns, for example by enforcing Bash tasks to run as Docker containers.

```yaml
kestra:
  tasks:
    defaults:
      - type: io.kestra.core.tasks.scripts.Bash
        forced: true
          runner: DOCKER
```

## Metrics configuration

- `kestra.metrics.prefix`: Change the prefix for [all metrics](../monitoring) for Kestra (default: kestra).


## Servers configuration

### `kestra.server.access-log`: Access Log configuration
- `kestra.server.access-log.enabled`: enable access log from webserver (default `true`).
- `kestra.server.access-log.name`: logger name (default `io.kestra.webserver.access`).
- `kestra.server.access-log.format`: access log format (default `[Date: {}] [Duration: {} ms] [Method: {}] [Url: {}] [Status: {}] [Length: {}] [Ip: {}] [Port: {}]`).
- `kestra.server.access-log.filters`: list of regexp to define which log to include, use `.*` to enable all logs (default `- ".*\\[Url: /api/.*"`).

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

### `kestra.configurations.delete-files-on-start`: Delete configuration files
This setting allows to deletion of all configuration files just after the server startup. It prevents the ability to read configuration files (that may contain your secrets) from a Bash task for example. The server will keep these values in memory and they won't be accessible from tasks. Values are either `true` or `false` (default `false`).

## Management endpoints configuration
Management endpoints configuration can be done with Micronaut configuration from [Micronaut endpoint configuration](https://docs.micronaut.io/latest/guide/index.html#endpointConfiguration).
You can also secure all endpoints with basic authentication using this additional configuration:

```yaml
endpoints:
  all:
    basic-auth:
      username: your-user
      password: your-password
```

## Temporary storage configuration
Kestra writes temporary files during task processing. By default, files will be created on `/tmp`, but you can change the location with this configuration:

```yaml
kestra:
  tasks:
    tmp-dir:
      path: /home/kestra/tmp
```

## JVM configuration

All JVM options can be passed in an environment variable named `JAVA_OPTS`. You can use it to change all JVM options available, such as memory, encoding, etc.

Example:

```shell
export JAVA_OPTS="-Duser.timezone=Europe/Paris"
```

### `user.timezone`: Timezone
By default, Kestra will handle all dates using your system's timezone. You can change the timezone with JVM options.

Changing the timezone will mostly affect:
* **scheduler**: by default, all schedule dates are UTC, changing the Java timezone will allow scheduling the flow in your timezone.
* **log**:  that will be displayed on your timezone.




## Anonymous usage report

Understanding how you use Kestra is very important to us: it helps us improve the solution in many ways.
For this reason, the `kestra.anonymous-usage-report.enabled` option is mandatory: we want you to consider whether you wish to share anonymous data with us so that we can benefit from your experience and use cases.

- `kestra.anonymous-usage-report.enabled`: (default true)
- `kestra.anonymous-usage-report.initial-delay`: (default 5m)
- `kestra.anonymous-usage-report.fixed-delay`: (default 1h)

### Collected Data

The collected data can be found [here](https://github.com/kestra-io/kestra/tree/develop/core/src/main/java/io/kestra/core/models/collectors). We collect only **anonymous data** that allows us to understand how you use Kestra. The data collected includes:

- **host data:** cpu, ram, os, jvm and a fingerprint of the machine.
- **plugins data:** the list of plugins installed and their current versions.
- **flow data:** the namespace count, flow count, the task type and the trigger type used.
- **execution data:** the execution and taskruns count for last 2 days with count and duration grouped by status.
- **common data:** the server type, version, timezone, env, start time and url.


## Webserver configuration

### `kestra.webserver.google-analytics`: Google Analytics ID
Add Google Analytics tracking ID (ex: `UA-12345678-1`) and report all page tracking.


### `kestra.webserver.html-head`: Append some head tags on the webserver application
Useful for injecting CSS or JavaScript to customize a web application.

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
