---
title: Plugin Developer Guide
icon: /docs/icons/dev.svg
---

Browse [Kestra's integrations](/plugins) and learn how to create your own plugins.

## The purpose of plugins

Plugins are the building blocks of Kestra's tasks and triggers. They encompass components interacting with external systems and performing the actual work in your flows.

Kestra comes prepackaged with hundreds of [plugins](/plugins), and you can also develop your own custom plugins.

To integrate with your internal systems and processes, you can build custom plugins. If you think it could be useful to others, consider contributing your plugin to our open-source community.




## Add Unit Tests

To avoid regression, we recommend adding unit tests for all your tasks.

There are two main ways to unit-test your tasks. Both will be regular Micronaut tests, and hence must be annotated with `@MicronautTest`.

### Unit test a RunnableTask

This is the most common way to test a RunnableTask. You create your RunnableTask, and test output or Exception. This will cover most of the cases.
::collapse{title="Example"}


```java

@MicronautTest
class ExampleTest {
    @Inject
    private RunContextFactory runContextFactory;

    @Test
    void run() throws Exception {
        RunContext runContext = runContextFactory.of(ImmutableMap.of("variable", "John Doe"));

        Example task = Example.builder()
            .format("Hello {{ variable }}")
            .build();

        Example.Output runOutput = task.run(runContext);

        assertThat(runOutput.getChild().getValue(), is(StringUtils.reverse("Hello John Doe")));
    }
}
```
::

This is same as any Java unit tests, feel free to use any dependencies, test methods, start docker containers, ...


### Unit test with a full flow

In case you want to add some unit test with a full flow (In some rare case, it can be necessary; for example, for FlowableTask), here is how you can write the unit test with the full flow.

::collapse{title="Example"}
```java
@KestraTest
class ExampleRunnerTest {
    @Inject
    protected StandAloneRunner runner;

    @Inject
    protected RunnerUtils runnerUtils;

    @Inject
    protected LocalFlowRepositoryLoader repositoryLoader;

    @BeforeEach
    private void init() throws IOException, URISyntaxException {
        repositoryLoader.load(Objects.requireNonNull(ExampleRunnerTest.class.getClassLoader().getResource("flows")));
        this.runner.run();
    }

    @SuppressWarnings("unchecked")
    @Test
    void flow() throws TimeoutException {
        Execution execution = runnerUtils.runOne(null, "io.kestra.templates", "example");

        assertThat(execution.getTaskRunList(), hasSize(3));
        assertThat(((Map<String, Object>)execution.getTaskRunList().get(2).getOutputs().get("child")).get("value"), is("task-id"));
    }
}
```
::

With this, you will:
- Inject all dependencies with `@Inject`.
- On `init()`, load all the flow on the `src/resources/flow` directory.
- Run a full execution with `Execution execution = runnerUtils.runOne(null, "io.kestra.templates", "example");`. The first parameter is for the `tenantId` which can be null on tests.

With this execution, you can look at all the properties you want to control (status, taskRunList number, outputs, ...)


To make it work, you need to have an `application.yml` file with this minimum configuration:

```yaml
kestra:
  repository:
    type: memory
  queue:
    type: memory
  storage:
    type: local
    local:
      base-path: /tmp/unittest
```

And these dependencies on your `build.gradle`:
```groovy
    testImplementation group: "io.kestra", name: "core", version: kestraVersion
    testImplementation group: "io.kestra", name: "repository-memory", version: kestraVersion
    testImplementation group: "io.kestra", name: "runner-memory", version: kestraVersion
    testImplementation group: "io.kestra", name: "storage-local", version: kestraVersion
```

This will enable the in memory runner and will run your flow without any other dependencies (kafka, ...).


## Document Your Plugin
Here is how you can document your plugin.

First, let us remember the organization of a plugin project:

- The Gradle project can contain several plugins, we call it a group of plugins.
- The package in which a plugin is written in is called a sub-group of plugins. Sometimes, there is only one sub-group, in which case the group and the sub-group are the same.
- Each class is a plugin that provides one task, trigger, condition, etc.

The plugin documentation will be used on the Kestra website and the Kestra UI.

We provide a way to document each level of a plugin project.

### Document the plugin group

#### Manifest attributes

Kestra uses custom manifest attributes to provide top-level group documentation.

The following manifest attributes are used to document the group of plugins:

- `X-Kestra-Title`: by default, the Gradle `project.name` property is used.
- `X-Kestra-Group`: by default, the Gradle `group.id` property with an additional group name is used.
- `X-Kestra-Description`: by default, the Gradle `project.description` property is used.
- `X-Kestra-Version`: by default, the Gradle `project.version` property is used.

If you follow the plugin structure of the template on GitHub, you should have something like this:
::collapse{title="Example"}

```groovy
group "io.kestra.plugin"
description 'Google Cloud Platform (GCP) plugins for Kestra.'

// [...]

jar {
    manifest {
        attributes(
                "X-Kestra-Title": project.name,
                "X-Kestra-Group": project.group + ".gcp",
                "X-Kestra-Description": project.description,
                "X-Kestra-Version": project.version
        )
    }
}
```
::

As you can see, the most important documentation attribute is the `description`, which should be a short sentence describing the plugins.

#### Additional markdown files

You can add additional markdown files in the `src/main/resources/doc` directory.

If there is a file `src/main/resources/doc/<plugin-group>.md`, it will be inlined inside the main documentation page as the long description for the group of plugins.

For example, for the GCP group of plugins, the file is `src/main/resources/doc/io.kestra.plugin.gcp.md`, and it contains authentication information that applies to all tasks.

If there are files inside the `src/main/resources/doc/guides` directory, we will list them in a `Guides` section on the documentation for the group of plugins.

#### Group Icon

It is possible to provide an icon representing the whole plugin group. If there is a [SVG file](https://www.w3.org/Graphics/SVG/) `src/main/resources/icons/plugin-icon.svg`, it will be used as the group icon.

### Document the plugin sub-groups

Each sub-group can be documented via the `io.kestra.core.models.annotations.PluginSubGroup` annotation that must be defined at the package level in a `package-info.java` file.

The `@PluginSubGroup` annotation allows setting:

- The sub-group `title`. If not set, the name of the sub-group will be used.
- The sub-group `description`, which is a short sentence introducing the sub-group.
- The sub-group `categories`, which is a list of `PluginCategory`. If not set, the category `MISC` will be used.

For example, for the GCP BigQuery sub-group:

```java
@PluginSubGroup(
    title = "BigQuery",
    description = "This sub-group of plugins contains tasks for accessing Google Cloud BigQuery.\n" +
        "BigQuery is a completely serverless and cost-effective enterprise data warehouse.",
    categories = { PluginSubGroup.PluginCategory.DATABASE, PluginSubGroup.PluginCategory.CLOUD }
)
package io.kestra.plugin.gcp.bigquery;

import io.kestra.core.models.annotations.PluginSubGroup;
```

#### Sub-Group Icon

Each plugin sub-group can define an icon representing plugins contained in the sub-group. If there is a SVG file `src/main/resources/icons/<plugin-sub-group>.svg`, it will be used as the icon for the corresponding plugins.

For example, for the GCP BigQuery sub-group, the `src/main/resources/icons/io.kestra.plugin.gcp.bigquery.svg` file is used.

### Document each plugin

Plugin documentation will generate a [JSON Schema](https://json-schema.org/) that will be used to validate flows. It also generates documentation for both the UI and the website (see the `kestra plugins doc` command).

#### Document the plugin class

Each plugin class must be documented via the following:

- The `io.kestra.core.models.annotations.Plugin` annotation allows providing examples.
- The `io.swagger.v3.oas.annotations.media.Schema` annotation, which the `title` attribute will use as the plugin description.

For example, the `Query` task of the PostgreSQL group of plugins is documented as follows:

```java
@Schema(
    title = "Query a PostgresSQL server"
)
@Plugin(
    examples = {
        @Example(
            full = true,
            title = "Execute a query",
            code = {
                "tasks:",
                "- id: update",
                "  type: io.kestra.plugin.jdbc.postgresql.Query",
                "  url: jdbc:postgresql://127.0.0.1:56982/",
                "  username: postgres",
                "  password: pg_passwd",
                "  sql: select concert_id, available, a, b, c, d, play_time, library_record, floatn_test, double_test, real_test, numeric_test, date_type, time_type, timez_type, timestamp_type, timestampz_type, interval_type, pay_by_quarter, schedule, json_type, blob_type from pgsql_types",
                "  fetch: true"}
        )
    }
)
```

For convenience, the `code` attribute of the `@Example` annotation is a list of strings. Each string will be a line of the example. That avoids concatenating multi-line strings in a single attribute.

You can add multiple examples if needed.

#### Document the plugin properties

In a plugin, all properties must be annotated by `io.kestra.core.models.annotations.PluginProperty` and should provide documentation via the `io.swagger.v3.oas.annotations.media.Schema` annotation and validation rules via `javax.validation.constraints.*`.

The `@PluginProperty` annotation contains two attributes:

- `dynamic`: set it to true if the property will be rendered dynamically.
- `additionalProperties`: you can use it to denote the sub-type of the property. For example, when using a `Map<String, Message>`, you can set it to `Message.class`.

The Swagger `@Schema` annotation contains a lot of attributes that can be used to document the plugin properties. The most useful are:

- `title`: a short description of a property.
- `description`: long description of a property.
- `anyOf`: a list of allowed sub-types of a property. Use it when the property type is an interface, an abstract class, or a class inside a hierarchy of classes to denote possible sub-types. This should be set when the property type is `Object`.

The `@Schema` and `@PluginProperty` annotations can be used on fields, methods, or classes.

Many tasks can take input from multiple sources on the same property. They usually have a single `from` property, a string representing a file in the Kestra Storage, a single object, or a list of objects. To document such property, you can use `anyOf` this way:

```java
@PluginProperty(dynamic = true)
@NotNull
@Schema(
    title = "The source of the published data.",
    description = "Can be an internal storage URI, a list of Pub/Sub messages, or a single Pub/Sub message.",
    anyOf = {String.class, Message[].class, Message.class}
)
private Object from;
```

::alert{type="info"}
Due to limitations on how JSON Schema works, you cannot add `@Schema` on a Java enum type and the plugin property that uses this type. We advise avoiding using `@Schema` on enumerations.
::

### Document the plugin outputs

Outputs should be documented with the `io.swagger.v3.oas.annotations.media.Schema` annotation in the same way as plugin properties. Please read the section above for more information.

Only use the annotation mentioned above. Never use `@PluginProperty` on an output.

### Document the plugin metrics

Tasks can expose metrics; to document those you must add a `@Metric` annotation instance for each metric in the `@Plugin` annotation instance of the task.

For example, to document two metrics: a **length** metric of type `counter` and a **duration** metric of `type` timer, you can use the following:

```java
@Plugin(
    metrics = {
        @Metric(name = "length", type = Counter.TYPE),
        @Metric(name = "duration", type = Timer.TYPE)
    }
)
```


## Build and Publish a Plugin
Use the included Gradle task to build the plugin. Then, you can publish it to [Maven Central](https://central.sonatype.com).

### Build a plugin
To build your plugin, execute the `./gradlew shadowJar` command from the plugin directory.

The resulting JAR file will be generated in the `build/libs` directory.

To use this plugin in your Kestra instance, add this JAR to the [Kestra plugins path](/docs/administrator-guide/server-cli#plugins-directory).

#### Use a custom docker image with your plugin

Adding this `Dockerfile` to the root of your plugin project:
```
FROM kestra/kestra:develop

COPY build/libs/* /app/plugins/
```
You can build and run the image with the following command assuming you're in the root directory of your plugin:
`./gradlew shadowJar && docker build -t kestra-custom . && docker run --rm -p 8080:8080 kestra-custom server local`

You can now navigate to http://localhost:8080 and start using your custom plugin. Feel free to adapt the Dockerfile to your needs (eg. if you plan to use multiple custom plugins, include all builds directory in it).

### Publish a plugin

Here is how you can publish your plugin to Maven Central.

#### GitHub Actions

The plugin template includes a [GitHub Actions](https://github.com/features/actions) workflow to test and publish your plugin. You can extend it by adding any additional testing or deployment steps.

#### Publish to Maven Central
The template includes a Gradle task that will publish the plugin to Maven Central. You need a Maven Central account in order to publish your plugin.

You only need to configure the `gradle.properties` to have all required properties:

```yaml
sonatypeUsername=
sonatypePassword=
signing.keyId=
signing.password=
signing.secretKeyRingFile=

```


There is a pre-configured GitHub Actions workflow in the `.github/workflows/main.yml` file that you can customize to your need:
::collapse{title="Example"}
```yaml
# Publish
- name: Publish package to Sonatype
  if: github.ref == 'refs/heads/master'
  env:
    ORG_GRADLE_PROJECT_sonatypeUsername: ${{ secrets.SONATYPE_USER }}
    ORG_GRADLE_PROJECT_sonatypePassword: ${{ secrets.SONATYPE_PASSWORD }}
    SONATYPE_GPG_KEYID: ${{ secrets.SONATYPE_GPG_KEYID }}
    SONATYPE_GPG_PASSWORD: ${{ secrets.SONATYPE_GPG_PASSWORD }}
    SONATYPE_GPG_FILE: ${{ secrets.SONATYPE_GPG_FILE }}
  run: |
    echo "signing.keyId=${SONATYPE_GPG_KEYID}" > ~/.gradle/gradle.properties
    echo "signing.password=${SONATYPE_GPG_PASSWORD}" >> ~/.gradle/gradle.properties
    echo "signing.secretKeyRingFile=${HOME}/.gradle/secring.gpg" >> ~/.gradle/gradle.properties
    echo ${SONATYPE_GPG_FILE} | base64 -d > ~/.gradle/secring.gpg
    ./gradlew publishToSonatype

# Release
- name: Release package to Maven Central
  if: startsWith(github.ref, 'refs/tags/v')
  env:
    ORG_GRADLE_PROJECT_sonatypeUsername: ${{ secrets.SONATYPE_USER }}
    ORG_GRADLE_PROJECT_sonatypePassword: ${{ secrets.SONATYPE_PASSWORD }}
    SONATYPE_GPG_KEYID: ${{ secrets.SONATYPE_GPG_KEYID }}
    SONATYPE_GPG_PASSWORD: ${{ secrets.SONATYPE_GPG_PASSWORD }}
    SONATYPE_GPG_FILE: ${{ secrets.SONATYPE_GPG_FILE }}
  run: |
    echo "signing.keyId=${SONATYPE_GPG_KEYID}" > ~/.gradle/gradle.properties
    echo "signing.password=${SONATYPE_GPG_PASSWORD}" >> ~/.gradle/gradle.properties
    echo "signing.secretKeyRingFile=${HOME}/.gradle/secring.gpg" >> ~/.gradle/gradle.properties
    echo ${SONATYPE_GPG_FILE} | base64 -d > ~/.gradle/secring.gpg
    ./gradlew publishToSonatype closeAndReleaseSonatypeStagingRepository
```

::
