---
title: Kestra Java SDK
icon: /docs/icons/api.svg
release: 1.0.0
---
Interact with Kestra's API via Java SDK.

## Installation

Choose the installation method that matches your environment.



### For Maven users

Add this dependency to your project's **POM** file:

```xml
<dependency>
  <groupId>io.kestra</groupId>
  <artifactId>kestra-api-client</artifactId>
  <version>1.0.0</version>
  <scope>compile</scope>
</dependency>
```

### For Gradle users

Add this dependency to your **build.gradle** file:

```groovy
implementation "io.kestra:kestra-api-client:1.0.0"
```

### Manual installation

If you prefer to install the JAR manually, first generate it:

```shell
./gradlew publishToMavenLocal
```

---

## Getting started

Initialize the `KestraClient` and reuse it across your application. Run this minimal example to verify your client setup:

```java
import java.util.*;
import io.kestra.client.KestraClient;  // Adjust import to your SDK package

public class GettingStarted {
    // Instantiate the client once and reuse it (e.g., as a singleton)
    private static final KestraClient CLIENT = KestraClient.builder()
        .url("http://localhost:8080")
        .basicAuth("root@root.com", "Root!1234")  // or .tokenAuth("...") if you use tokens
        .build();

    public static void main(String[] args) {
        // A lightweight example to confirm that the client was initialized
        System.out.println("KestraClient initialized: " + (CLIENT != null));
    }
}
```

::alert{type="info"}
**Notes**
- Set `.url(...)` to your Kestra API base URL (for example, `http://localhost:8080`).  
- Configure either **basic** or **bearer** authentication to match your environment.  
- Construct the client **once** (singleton/DI) and reuse it for all API calls.
::

---

## Create a flow

Create a flow by sending the YAML definition as a string. This matches what you’d define in the UI, but through the SDK.

```java
import java.util.*;
import io.kestra.client.KestraClient;

public class FlowsExamples {
    private static final KestraClient CLIENT = KestraClient.builder()
        .url("http://localhost:8080")
        .basicAuth("root@root.com", "Root!1234")
        .build();

    public static void createFlow() {
        String tenant = "main";
        String flowBody = """
        id: myflow
        namespace: my.namespace

        inputs:
          - id: key
            type: STRING
            defaults: 'empty'

        tasks:
          - id: hello
            type: io.kestra.plugin.core.log.Log
            message: Hello World! 🚀
        """;

        CLIENT.flows().createFlow(tenant, flowBody);
        System.out.println("Flow created: my.namespace/myflow");
    }
}
```

::alert{type="info"}
**Important**
- `flowBody` must be **valid YAML** for a Kestra flow. Invalid YAML or missing required fields will return a `4xx`.  
- Set the correct `tenant` for multi-tenant environments.  
- On success, the API returns the created flow (including metadata and source); you may log/inspect it as needed.
::

---

## Update a flow

Update by sending the full YAML for the flow (including the same `id`/`namespace`), then calling `updateFlow`.

```java
import java.util.*;
import io.kestra.client.KestraClient;

public class FlowsUpdates {
    private static final KestraClient CLIENT = KestraClient.builder()
        .url("http://localhost:8080")
        .basicAuth("root@root.com", "Root!1234")
        .build();

    public static void updateFlow() {
        String flowId = "myflow";
        String namespace = "my.namespace";
        String tenant = "main";

        String updatedFlowBody = """
        id: myflow
        namespace: my.namespace

        inputs:
          - id: key
            type: STRING
            defaults: 'empty'

        tasks:
          - id: hello
            type: io.kestra.plugin.core.log.Log
            message: Updated! 🚀
        """;

        CLIENT.flows().updateFlow(namespace, flowId, tenant, updatedFlowBody);
        System.out.println("Flow updated: my.namespace/myflow");
    }
}
```

::alert{type="info"}
**Tips**
- Send the **full** YAML for updates (id/namespace must match the target).  
- Keep your flow YAML in source control for diffing/auditing alongside code.  
- If you frequently change only a few fields, consider templating your YAML in code.
::

---

## Execute a flow

Trigger an execution and optionally pass inputs, labels, or scheduling parameters. You can choose to block (`wait=true`) until completion or return immediately.

```java
import java.util.*;
import io.kestra.client.KestraClient;
import io.kestra.client.types.ExecutionKind; // Adjust to your SDK model package

public class ExecutionsExamples {
    private static final KestraClient CLIENT = KestraClient.builder()
        .url("http://localhost:8080")
        .basicAuth("root@root.com", "Root!1234")
        .build();

    public static void createExecution() {
        String flowId = "myflow";
        String namespace = "my.namespace";
        String tenant = "main";
        Boolean wait = false;                    // non-blocking call
        List<String> labels = List.of("label1:created");
        Integer revision = null;                 // latest
        String scheduleDate = null;              // or ISO-8601 string, e.g. "2025-11-01T10:00:00Z"
        List<String> breakpoints = List.of();    // task ids to pause at (for debugging)
        ExecutionKind kind = ExecutionKind.NORMAL;

        Map<String, Object> variables = Map.of();  // flow variables (if any)
        Map<String, Object> inputs = new HashMap<>();
        inputs.put("key", "value");                // matches the flow `inputs` definition

        var exec = CLIENT.executions()
            .createExecution(namespace, flowId, wait, tenant, labels, revision, scheduleDate, breakpoints, kind, variables, inputs);

        System.out.println("Execution started: " + exec.getId());
    }
}
```

::alert{type="info"}
**Notes**
- `wait=true` blocks until the execution finishes (useful for [synchronous flows/test runners](../../15.how-to-guides/synchronous-executions-api.md#synchronous-executions-api)).  
- Use [`labels`](../../05.workflow-components/08.labels.md) (e.g., `team:platform`) for search, routing, or reporting.  
- `scheduleDate` allows delayed start.
- `breakpoints` pause at specific task IDs to debug step-by-step.
::

---

## Follow (stream) an execution

Stream execution events/logs as they happen. This is useful for building live console output or CI visibility.

```java
import java.util.*;
import io.kestra.client.KestraClient;

public class ExecutionStreaming {
    private static final KestraClient CLIENT = KestraClient.builder()
        .url("http://localhost:8080")
        .basicAuth("root@root.com", "Root!1234")
        .build();

    public static void followExecution() {
        String executionId = "yourExecutionId";
        String tenant = "main";

        CLIENT.executions().followExecution(executionId, tenant)
            .doOnNext(execution -> {
                System.out.printf("Event: %s | Status: %s%n", execution.getId(), execution.getState());
            })
            .doOnError(err -> {
                System.err.println("Stream error: " + err.getMessage());
            })
            .doOnComplete(() -> {
                System.out.println("Execution stream completed.");
            })
            .subscribe();
    }
}
```

::alert{type="info"}
**Tips**
- Use `followExecution` in interactive tools or long-running services to surface progress in real time.  
- The first event is an empty keepalive payload—skip it before processing subsequent updates.  
- If you only need the final result, poll the execution by ID instead of streaming.  
- Consider backoff/retry logic when streaming over unstable networks.
::

---

## Putting it together (recommended structure)

Create one utility class to hold your client and reuse it everywhere:

```java
import io.kestra.client.KestraClient;

public final class KestraClients {
    private KestraClients() {}

    public static final KestraClient INSTANCE = KestraClient.builder()
        .url(System.getenv().getOrDefault("KESTRA_URL", "http://localhost:8080"))
        // Choose one auth mechanism:
        .basicAuth(
            System.getenv().getOrDefault("KESTRA_USER", "root@root.com"),
            System.getenv().getOrDefault("KESTRA_PASS", "Root!1234")
        )
        // .tokenAuth(System.getenv("KESTRA_TOKEN"))
        .build();
}
```

Then, in your feature classes:

```java
public class MyFlows {
    public void create() {
        KestraClients.INSTANCE.flows().createFlow("main", "...yaml...");
    }
}
```

::alert{type="info"}
**Best practices**
- Prefer **one** `KestraClient` per application (share via DI or a static holder).  
- Externalize **URL** and **auth** via environment variables or your config system.  
- Keep flow YAML as code (templates/strings) under version control for traceability.  
- Use **labels** and consistent naming for easier search, dashboards, and governance.
::
