---
order: 8
---
# Document your plugin

First, let remember ourself the organization of a plugin project:

- The Gradle project is called a group of plugins as it contains multiple plugins.
- The package in which a plugin is, is called a sub-group of plugins, sometimes there is only one sub-group so the group and the sub-group are the same.
- Each class is a plugin that provides one of: task, trigger, condition, ...

The documentation will be used on the Kestra website and on the Kestra UI.

We provides a way to document each level of a plugin project.

## Document the plugin group

### Manifest attributes

Kestra uses custom manifest attributes to provides group top level documentation.

The following manifest attributes are used to document the group of plugins:

- `X-Kestra-Title`: we usually use the Gradle `project.name` property.
- `X-Kestra-Group`: we usually use the Gradle `group.id` property with an additional group name.
- `X-Kestra-Description`: we usually use the Gradle `project.description` property.
- `X-Kestra-Version`: we usually use the Gradle `project.version` property.

If you follow the plugin structure of the GitHub template you should have something like that:

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

As you can see, the most important documentation attribute is the `description` that should be a short sentence that describe the group of plugins.

### Additional markdown files

You can add additional markdown files in the `src/main/resources/doc` directory.

If there is a file `src/main/resources/doc/<plugin-group>.md`, it will be inlined inside the main documentation page as what we call the group of plugins long description.

For example, for the GCP group of plugins the file is `src/main/resources/doc/io.kestra.plugin.gcp.md` and it contains authentication information that apply to all tasks.

If there is files inside the `src/main/resources/doc/guides` directory, we will list them in a `Guides` section on the group of plugins documentation. 

## Document the plugin sub-groups

Each sub-groups can be documented via the `io.kestra.core.models.annotations.PluginSubGroup` annotation that must be defined at the package level in a `package-info.java` file.

The `@PluginSubGroup` annotation allows to set:

- The sub-group `title`: if not set, the name of the sub-group will be used.
- The sub-group `description` which is a short sentence to introduce the sub-group.

For example, for the GCP BigQuery sub-group:

```java
@PluginSubGroup(
    title = "BigQuery",
    description = "This sub-group of plugins contains tasks for accessing Google Cloud BigQuery.\n" +
        "BigQuery is a completely serverless and cost-effective enterprise data warehouse. "
)
package io.kestra.plugin.gcp.bigquery;

import io.kestra.core.models.annotations.PluginSubGroup;
```

## Document each plugin

Plugin documentation will generates a JSON Schema that will be used to validate flows and generates documentation on both the UI and the website.

### Document the plugin class

Each plugin class must be documented via:

- The `io.kestra.core.models.annotations.Plugin` annotation that allow providing examples.
- The `io.swagger.v3.oas.annotations.media.Schema` annotation which `title` attribute will be used as the plugin description.

For example, the `Query` task of the PostgreSQL group of plugins is documented as follow:

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

For convenience, the `code` attribute of the `@Example` annotation is a list of strings, each string will be a line of example. This avoid concatenating multi-line strings in a single attribute.

You can add multiple examples if needed.

### Document the plugin properties

In a plugin, all properties must be annotated by `io.kestra.core.models.annotations.PluginProperty` and should provide documentation via the `io.swagger.v3.oas.annotations.media.Schema` annotation and validation rules via `javax.validation.constraints.*`.

For validation rules, please check the [Properties validation](../runnable-task/#properties-validation) documentation page.

The `@PluginProperty` annotation contains two attributes:

- `dynamic`: set it to true if the property will be rendered dynamically, see [Render Variable](..//runnable-task/#render-variables).
- `additionalProperties`: you can use it to denote the sub-type of the property, for example when using a `Map<String, Message>` you can set it to `Message.class`.

The Swagger `@Schema` annotation contains a lot of attributes that can be used to document the plugin properties, the most useful are:

- `title`: short description of a property.
- `description`: long description of a property.
- `anyOf`: allows to specify which types are allowed when the type of the property can be extended (interface, abstract classes, ...). This should be set when the type of the property is `Object`.

The `@Schema` and `@PluginProperty` annotations can be used on fields, methods or classes.

A lot of tasks can take input from multiple sources on the same property, they usually have a single `from` property that can be a string that represent a file in the Kestra Storage, a single object or a list of objects. To document such property you can use `anyOf` this way:

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

Note that, due to limitation on the way JSON schema works, you cannot add `@Schema` both on a Java enum type and the plugin property that uses this type. We advise to avoid using `@Schema` on enumerations.

### Document the plugin outputs

Outputs should be documented with the `io.swagger.v3.oas.annotations.media.Schema` annotation the same way as plugin properties, please read the section above for more information.
 
Only this annotation should be used, never use `@PluginProperty` on an output.