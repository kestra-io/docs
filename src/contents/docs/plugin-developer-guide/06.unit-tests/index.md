---
title: Add Unit Tests for Kestra Plugins
sidebarTitle: Add Unit Tests
icon: /src/contents/docs/icons/dev.svg
description: Learn how to write unit tests for your Kestra plugins using JUnit and the Kestra testing framework.
---

To avoid regression, we recommend adding unit tests for all your tasks.

There are two main ways to test your tasks. In both cases, annotate your tests with `@KestraTest` so the required Kestra components start correctly.

## Unit test a RunnableTask

This is the most common way to test a `RunnableTask`. You create your `RunnableTask`, test its `run()` method, and assert on its output or exception.

This example shows a task test that builds the task, creates a `RunContext`, runs the task directly, and asserts on the output:

:::collapse{title="Example"}

```java

@KestraTest
class ExampleTest {
    @Inject
    private RunContextFactory runContextFactory;

    @Test
    void run() throws Exception {
        RunContext runContext = runContextFactory.of(Map.of("variable", "John Doe"));

        Example task = Example.builder()
            .format("Hello {{ variable }}")
            .build();

        Example.Output runOutput = task.run(runContext);

        assertThat(runOutput.getChild().getValue(), is(StringUtils.reverse("Hello John Doe")));
    }
}
```
:::

This works like any other Java unit test. You can use additional dependencies, helper methods, and Docker containers when needed.
Kestra tests are Micronaut tests, so you can inject any bean into them.


## Unit test with a full flow

If you want to add some unit tests with a full flow (which can be necessary in some rare cases, for example, for a `FlowableTask`), you will use the `@ExecuteFlow` annotation.

This example shows a flow-level test that executes a test flow from `src/test/resources` and asserts on the resulting execution:

:::collapse{title="Example"}
```java
@KestraTest(startRunner = true) // This annotation starts an embedded Kestra for tests
class ExampleRunnerTest {
  @Test
  @ExecuteFlow("flows/example.yaml")
  void flow(Execution execution) throws TimeoutException, QueueException {
    assertThat(execution.getTaskRunList(), hasSize(3));
    assertThat(((Map<String, Object>)execution.getTaskRunList().get(2).getOutputs().get("child")).get("value"), is("task-id"));
  }
}
```
:::

- `@KestraTest(startRunner = true)` will start Kestra with an in-memory backend.
- `@ExecuteFlow("flows/example.yaml")` will start the flow from the `src/test/resources/flows/example.yaml` file and execute it.
- The created execution is then available for test method parameter injection so that you can make assertions on it.

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
testAnnotationProcessor group: "io.kestra", name: "processor", version: kestraVersion
testImplementation group: "io.kestra", name: "core", version: kestraVersion
testImplementation group: "io.kestra", name: "tests", version: kestraVersion
testImplementation group: "io.kestra", name: "repository-memory", version: kestraVersion
testImplementation group: "io.kestra", name: "runner-memory", version: kestraVersion
testImplementation group: "io.kestra", name: "storage-local", version: kestraVersion
```

This enables the in-memory runner and runs your flow without any other dependencies such as Kafka.
If you created it from our plugin template, those are usually already included in your project.
