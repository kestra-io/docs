---
order: 2
---
# Develop your RunnableTask

Here is the instruction to develop the most common **Runnable Task**.

Here is a simple task example that reverse a string:

```java
@SuperBuilder
@ToString
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Schema(
    title = "Reverse a string",
    description = "Reverse all letters from a string"
)
public class ReverseString extends Task implements RunnableTask<ReverseString.Output> {
    @Schema(
        title = "The base string you want to reverse"
    )
    @PluginProperty(dynamic = true)
    private String format;

    @Override
    public Example.Output run(RunContext runContext) throws Exception {
        Logger logger = runContext.logger();

        String render = runContext.render(format);
        logger.debug(render);

        return Output.builder()
            .reverse(StringUtils.reverse(render))
            .build();
    }

    @Builder
    @Getter
    public static class Output implements io.kestra.core.models.tasks.Output {
        @Schema(
            title = "The reverse string "
        )
        private final String reverse;
    }
}
```

Let look at these one deeply:

## Class annotations
```java
@SuperBuilder
@ToString
@EqualsAndHashCode
@Getter
@NoArgsConstructor
```
These are required in order to make your plugin works with Kestra, these are [Lombok](https://projectlombok.org/) annotation that allow kestra and internal serialization to work properly.


## Class declaration
```java
public class ReverseString extends Task implements RunnableTask<Example.Output>
```

* `ReverseString` is the name of your task and can be use on Kestra with `type: io.kestra.plugin.templates.ReverseString` (aka: <code v-pre>{{package}}.{{className}}</code>)
* Class must extends `Task` to be usable
* `implements RunnableTask<ReverseString.Output>`: must implements `RunnableTask` to be discovered and must declared the output of the tasks `ReverseString.Output`

## Properties
```java
    @PluginProperty(dynamic = true)
    private String format;
```
Declare all the properties that you can pass to current task on flow. For example, this will be a valid yaml for this task:

```yaml
type: io.kestra.plugin.templates.ReverseString
format: "{{outputs.previousTask.name}}"
```

You can declare as many properties you want, all of these will be filled by Kestra executors.
You can use any serializable by [Jackson](https://github.com/FasterXML/jackson) for your properties (ex: Double, boolean, ...). You can create any class since the class Serializable.

### Properties validation
Properties can be validated using `javax.validation.constraints.*` annotations. When the user creates a flow, your task properties will be validated before insertion and prevent wrong definition to be inserted.

The default available annotations are:
- `@Positive`
- `@AssertFalse`
- `@AssertTrue`
- `@Max`
- `@Min`
- `@Negative`
- `@NegativeOrZero`
- `@Positive`
- `@PositiveOrZero`
- `@NotBlank`
- `@NotNull`
- `@Null`
- `@NotEmpty`
- `@Past`
- `@PastOrPresent`
- `@Future`
- `@FutureOrPresent`

You can also create your custom validation, you must defined the annotation

```java
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = { })
public @interface CronExpression {
    String message() default "invalid cron expression ({validatedValue})";
}
```

and a factory to inject the validation method :

```java
@Factory
public class ValidationFactory {
private static final CronParser CRON_PARSER = new CronParser(CronDefinitionBuilder.instanceDefinitionFor(CronType.UNIX));

    @Singleton
    ConstraintValidator<CronExpression, CharSequence> cronExpressionValidator() {
        return (value, annotationMetadata, context) -> {
            if (value == null) {
                return true;
            }

            try {
                Cron parse = CRON_PARSER.parse(value.toString());
                parse.validate();
            } catch (IllegalArgumentException e) {
                return false;
            }

            return true;
        };
    }
}


```


## Run
```java
    @Override
    public Example.Output run(RunContext runContext) throws Exception {
        Logger logger = runContext.logger();

        String render = runContext.render(format);
        logger.debug(render);

        return Output.builder()
            .reverse(StringUtils.reverse(render))
            .build();
    }
```
Is where the main logic of your task will do all the work needed. You can used any Java code here with any libs you need until you have declared it [Gradle configuration](../gradle/).

### Log
```java
Logger logger = runContext.logger();
```
To have a logger, you need to use this instruction, this will provide a logger for the current execution and will be log properly, don't have your own logger in order to track log on the UI.


### Render variables
```java
String render = runContext.render(format);
```
In order to use [variables](../../developer-guide/variables), you need to render the variables, aka: transform the properties with handlebars.
Just don't forgot to render this variables if you need to pass some output from previous variables.

You also need to this annotations `@PluginProperty(dynamic = true)` in order to explain in the documentation that you can pass some variables.
Provide a `@PluginProperty(dynamic = false)` to explain clearly that you don't transform the value.

### Kestra storage
You can read any file from Kestra storage using method `runContext.uriToInputStream()`
```java
final URI from = new URI(runContext.render(this.from));
final InputStream inputStream = runContext.uriToInputStream(from);
```
You will get an `InputStream` in order to read the file from Kestra storage (coming from inputs or task outputs)

You can also write files to Kestra storage using `runContext.putTempFile(File file)`. The local file will be deleted, so you must use a temporary file.

```java
File tempFile = File.createTempFile("concat_", "");
runContext.putTempFile(tempFile)
```

Don't forgot to provide [Outputs](#outputs) with the link generated by `putTempFile` in order to be usable by others tasks.


## Outputs

```java
public class ReverseString extends Task implements RunnableTask<ReverseString.Output> {
    @Override
    public Example.Output run(RunContext runContext) throws Exception {
        return Output.builder()
            .reverse(StringUtils.reverse(render))
            .build();
    }

    @Builder
    @Getter
    public static class Output implements io.kestra.core.models.tasks.Output {
        @Schema(
            title = "The reverse string "
        )
        private final String reverse;
    }
}

```
Each task must return a class instance with outputs values that can be used for next tasks.
You must return a class that implements `io.kestra.core.models.tasks.Output`.
You can add as many properties as you want, but keep in mind that all theses must be serializable.
All output will be available for next task through [variables](../../developer-guide/variables).


If your task don't provide any outputs (mostly never), you can create a task like that:
```java
public class NoOutput extends Task implements FlowableTask<VoidOutput> {
    @Override
    public VoidOutput run(RunContext runContext) throws Exception {
        return null;
    }
}
```

## Exception
In the `run` methods, you can throw any `Exception` that will be catch by Kestra and will failed the execution.
We advise you to throw any Exception that can break your task as soon as possible.

## Metrics
You can send metrics to add some observability on your task. Metrics will be recorded with yout execution and will be show on the UI.

There is 2 kind of metrics :

- `Counter`: `Counter.of("your.counter", count, tags);` with args
  - `String name`: The name of the metrics
  - `Double|Long|Integer|Float count`: the counter associated
  - `String... tags`: a list of tags associated with your metrics
- `Timer`: `Timer.of("your.duration", duration, tags);`
  - `String name`: The name of the metrics
  - `Duration duration`: the duration recorded
  - `String... tags`: a list of tags associated with your metrics

To save metrics with execution, you need to use `runContext.metric(metrics)`


### Name
Must be lowercase separated by dots.

### Tags
Must be a key and value of tags. Example of a valid tags are :

```java
Counter.of("your.counter", count, "zone", "EU", "location", "france");
```

## Documentation
Documentation (on the ui and on this website) is based on annotations.
We tried to guess as many documentation from `javax` annotation, default value from properties, ...
But some need to be declared manually in order to provide a full documentation for final users.

### With `@Schema`
Most are based on swagger annotation of package `io.swagger.v3.oas.annotations.media`.

You can add a `@Schema` on :
- class
- properties
- output

Most of `@Schema` properties can be used, most important are :
- `title`
- `description`
- but feel free to used other one

### With `@Plugin` annotation on class
We have introduced `@Plugin` annotation for the documentation that is out of scope of json schema.

For now only examples are available :
```java
@Plugin(
    examples = @Example(
        full = true,
        title = "A schedule trigger",
        code = {
            "triggers:",
            "  - id: schedule",
            "    type: io.kestra.core.models.triggers.types.Schedule",
            "    cron: \"*/15 * * * *\"",
            "    backfill:",
            "      start: 2020-06-25T14:00:00Z"
        }
    )
)
```


### With `@PluginProperty` on class

Like `@Plugin`, `@PluginProperty` for the documentation that is out of scope of json schema.

```java
@PluginProperty(dynamic = true, additionalProperties = Task.class)
```

For now,
- `dynamic`: to documentation [Render variables](#render-variables)
- `additionalProperties`: to document for a `Map<String, T>` the `T` type.
