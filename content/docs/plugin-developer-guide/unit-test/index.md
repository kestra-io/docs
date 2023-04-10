---
order: 6
---
# Add unit tests

Kestra is build from the inception with unit tests in mind. A task must be unit testable to avoid regression and bugs. So we provide 2 ways to unit test your tasks. Both will be regular Micronaut tests so must be annotated with `@MicronautTest`.


## Unit test a RunnableTask 

This is the most common way to test a RunnableTask. You create your RunnableTask, and test output or Exception. This will cover most of the case.
Here is an example :

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

The same as any java unit tests, fell free to use any dependencies, test methods, started docker containers, ... 


## Unit test with a full flow

Maybe you want to add some unit test with a full flow, in some rare case, it can be necessary (mostly for FlowableTask). 

Here is an example: 
```java
@MicronautTest
class ExampleRunnerTest {
    @Inject
    protected MemoryRunner runner;

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
        Execution execution = runnerUtils.runOne("io.kestra.templates", "example");

        assertThat(execution.getTaskRunList(), hasSize(3));
        assertThat(((Map<String, Object>)execution.getTaskRunList().get(2).getOutputs().get("child")).get("value"), is("task-id"));
    }
}
```

With this, you will: 
- Inject all dependencies with `@Inject`.
- On `init()`, load all the flow on the `src/resources/flow` directory.
- Run a full execution with `Execution execution = runnerUtils.runOne("io.kestra.templates", "example");` .

With this execution, you can look at all the properties you want to control (status, taskRunList number, outputs, ...)


To make it work, you need to have an `application.yml` files with this minimum configuration: 

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

This will enabled the in memory runner and will run your flow without any others dependencies (kafka, ...).
