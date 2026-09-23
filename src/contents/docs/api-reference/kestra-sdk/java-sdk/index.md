---
title: "Java SDK for Kestra: Client Setup and Examples"
h1: Set Up the Kestra Java SDK and Build Workflows Programmatically
sidebarTitle: Java SDK
icon: /src/contents/docs/icons/api.svg
release: 1.0.0
description: Integrate Kestra with Java using the official SDK. Learn to set up the client, configure authentication, and programmatically create and execute workflows.
---

Use the Kestra Java SDK to interact with the Kestra API from Java applications.

## Install the Java SDK

The SDK requires Java 25 or later. Choose the installation method that matches your build tool.

### Maven

Add this dependency to your `pom.xml`:

```xml
<dependency>
  <groupId>io.kestra</groupId>
  <artifactId>kestra-api-client</artifactId>
  <version>2.0.1</version>
  <scope>compile</scope>
</dependency>
<!-- required at compile time by followExecution and followLogsFromExecution -->
<dependency>
  <groupId>io.projectreactor</groupId>
  <artifactId>reactor-core</artifactId>
  <version>3.7.12</version>
</dependency>
```

### Gradle

Add this dependency to your `build.gradle`:

```groovy
implementation "io.kestra:kestra-api-client:2.0.1"
// required at compile time by followExecution and followLogsFromExecution
implementation "io.projectreactor:reactor-core:3.7.12"
```

:::alert{type="info"}
The streaming methods `followExecution` and `followLogsFromExecution` return a Reactor `Flux`, but the SDK declares `reactor-core` as a runtime-only dependency. Add `reactor-core` explicitly, as shown above, to compile code that uses them.
:::

---

## Configure the client

Initialize `KestraClient` once using the builder, then reuse it across your application. Read credentials from environment variables rather than hardcoding them.

```java
import io.kestra.sdk.KestraClient;

public final class KestraClients {
    private KestraClients() {}

    public static final KestraClient INSTANCE = KestraClient.builder()
        .url(System.getenv().getOrDefault("KESTRA_URL", "http://localhost:8080"))
        .basicAuth(
            System.getenv().getOrDefault("KESTRA_USER", "root@root.com"),
            System.getenv().getOrDefault("KESTRA_PASS", "Root!1234")
        )
        // .tokenAuth(System.getenv("KESTRA_TOKEN"))  // use instead for bearer auth
        .build();
}
```

:::alert{type="info"}
Construct the client once (singleton or DI) and reuse it. Use either `.basicAuth(...)` or `.tokenAuth(...)`, not both.
:::

---

## Configure timeouts

By default, both connect and read timeouts are infinite. Configure them on the builder before calling long-running endpoints such as `runTestSuite`:

```java
import io.kestra.sdk.KestraClient;
import java.time.Duration;

KestraClient client = KestraClient.builder()
    .url("https://kestra.example.com")
    .tokenAuth(System.getenv("KESTRA_TOKEN"))
    .connectTimeout(Duration.ofSeconds(10))  // time to establish the connection
    .readTimeout(Duration.ofMinutes(30))     // time to wait for a response
    .build();
```

Pass `Duration.ZERO` or omit the call to keep the default (infinite). Both methods accept any `java.time.Duration`.

---

## Create a flow

Send the flow definition as a YAML string. This matches what you would define in the UI.

```java
import io.kestra.sdk.KestraClient;

public class FlowsExamples {
    public static void createFlow() {
        String tenant = "main";
        String body = """
        id: my_flow
        namespace: my_namespace

        tasks:
          - id: hello
            type: io.kestra.plugin.core.log.Log
            message: Hello World!
        """;

        KestraClients.INSTANCE.flows().createFlow(tenant, body);
        System.out.println("Flow created: my_namespace/my_flow");
    }
}
```

:::alert{type="info"}
`body` must be valid YAML. If a flow with the same `id` and `namespace` already exists, use `updateFlow` instead.
:::

---

## Update a flow

Send the full YAML — including the same `id` and `namespace` — to replace an existing flow.

```java
public class FlowsExamples {
    public static void updateFlow() {
        String namespace = "my_namespace";
        String id = "my_flow";
        String tenant = "main";

        String body = """
        id: my_flow
        namespace: my_namespace

        tasks:
          - id: hello
            type: io.kestra.plugin.core.log.Log
            message: Updated message!
        """;

        KestraClients.INSTANCE.flows().updateFlow(namespace, id, tenant, body);
        System.out.println("Flow updated: my_namespace/my_flow");
    }
}
```

---

## Delete a flow

Remove a flow by its `namespace`, `id`, and `tenant`.

```java
public class FlowsExamples {
    public static void deleteFlow() {
        String namespace = "my_namespace";
        String id = "my_flow";
        String tenant = "main";

        KestraClients.INSTANCE.flows().deleteFlow(namespace, id, tenant);
        System.out.println("Flow deleted: my_namespace/my_flow");
    }
}
```

:::alert{type="info"}
Deleting a flow removes its definition. Execution history is retained unless you delete executions separately.
:::

---

## Execute a flow

Trigger an execution and optionally pass labels or scheduling parameters.

```java
import java.util.List;
import java.time.OffsetDateTime;
import io.kestra.sdk.model.ExecutionControllerExecutionResponse;
import io.kestra.sdk.model.ExecutionKind;

public class ExecutionsExamples {
    public static void createExecution() {
        String tenant = "main";
        String namespace = "my_namespace";
        String id = "my_flow";
        Boolean wait = false;

        ExecutionControllerExecutionResponse execution = KestraClients.INSTANCE.executions()
            .createExecution(
                tenant, namespace, id,
                List.of("team:platform"),  // labels
                wait,
                null,                      // revision (null = latest)
                (OffsetDateTime) null,     // scheduleDate
                null,                      // breakpoints
                ExecutionKind.NORMAL
            );

        System.out.println("Execution triggered: " + execution.getId());
    }
}
```

:::alert{type="info"}
The SDK throws `io.kestra.sdk.internal.ApiException` (an unchecked `RuntimeException`) when the API returns an error. Use `getCode()` to read the HTTP status and `getResponseBody()` for the error payload.
:::

---

## Delete an execution

Delete an execution and optionally purge its logs, metrics, and storage.

```java
public class ExecutionsExamples {
    public static void deleteExecution() {
        String executionId = "your-execution-id";
        String tenant = "main";

        KestraClients.INSTANCE.executions()
            .deleteExecution(executionId, tenant,
                true,   // deleteLogs
                true,   // deleteMetrics
                true    // deleteStorage
            );
        System.out.println("Execution deleted");
    }
}
```

---

## Follow an execution

`followExecution` returns a reactive `Flux<Execution>` that streams state updates as the execution progresses. Each emission is an `Execution` object — skip entries where `getState()` is `null` (keepalive frames emitted by the server before the first real update).

```java
public class ExecutionsExamples {
    public static void followExecution() {
        String executionId = "your-execution-id";
        String tenant = "main";

        KestraClients.INSTANCE.executions()
            .followExecution(executionId, tenant)
            .filter(execution -> execution.getState() != null) // skip keepalive frames
            .doOnNext(execution -> System.out.printf("[%s] %s%n",
                execution.getId(), execution.getState().getCurrent()))
            .blockLast(); // blocks until the execution stream ends
    }
}
```

---

## KV Store

The KV Store lets you read and write key-value pairs scoped to a namespace.

### List keys

Filter the keys by namespace with a `QueryFilter`:

```java
import java.util.List;
import io.kestra.sdk.model.QueryFilter;
import io.kestra.sdk.model.QueryFilterField;
import io.kestra.sdk.model.QueryFilterOp;

public class KVExamples {
    public static void listKeys() {
        String namespace = "my_namespace";
        String tenant = "main";

        var keys = KestraClients.INSTANCE.kv().listAllKeys(tenant, 1, 50, null,
            List.of(new QueryFilter()
                .field(QueryFilterField.NAMESPACE)
                .operation(QueryFilterOp.EQUALS)
                .value(namespace)));
        keys.getResults().forEach(entry -> System.out.println("Key: " + entry.getKey()));
    }
}
```

:::alert{type="info"}
`listKeysWithInheritance(namespace, tenant)` returns only the keys inherited from parent namespaces, not the keys defined in `namespace` itself.
:::

### Get a value

```java
public class KVExamples {
    public static void getKeyValue() {
        String namespace = "my_namespace";
        String tenant = "main";

        var result = KestraClients.INSTANCE.kv()
            .keyValue(namespace, "my_key", tenant);
        System.out.println("Value: " + result.getValue());
    }
}
```

### Set a value

```java
public class KVExamples {
    public static void setKeyValue() {
        String namespace = "my_namespace";
        String tenant = "main";

        KestraClients.INSTANCE.kv()
            .setKeyValue(namespace, "my_key", tenant, "my_value");
        System.out.println("Key set");
    }
}
```

### Delete a key

```java
public class KVExamples {
    public static void deleteKey() {
        String namespace = "my_namespace";
        String tenant = "main";

        KestraClients.INSTANCE.kv().deleteKeyValue(namespace, "my_key", tenant);
        System.out.println("Key deleted");
    }
}
```

---

## Read execution logs

Fetch or stream logs for an execution.

### List logs

```java
public class LogsExamples {
    public static void listLogs() {
        String executionId = "your-execution-id";
        String tenant = "main";

        var logs = KestraClients.INSTANCE.logs()
            .listLogsFromExecution(executionId, tenant,
                null,  // minLevel
                null,  // taskRunId
                null,  // taskId
                null   // attempt
            );

        logs.forEach(log ->
            System.out.printf("[%s] %s%n", log.getLevel(), log.getMessage()));
    }
}
```

:::alert{type="info"}
The Kestra 2.x server does not apply the `minLevel`, `taskRunId`, `taskId`, and `attempt` arguments of `listLogsFromExecution`: it always returns every log entry of the execution. Filter on `log.getLevel()` or `log.getTaskId()` in your code if needed.
:::

### Stream logs live

`followLogsFromExecution` returns a reactive `Flux<FollowLogEvent>`. Each `FollowLogEvent` carries the same fields as `LogEntry` (plus `tenantId`). The server sends an initial keepalive frame with all fields `null` — filter it out before processing.

The server keeps the log stream open after the execution ends, so stop it yourself. This example completes the log stream when `followExecution` completes, which happens when the execution reaches a final state.

```java
public class LogsExamples {
    public static void followLogs() {
        String executionId = "your-execution-id";
        String tenant = "main";

        KestraClients.INSTANCE.logs()
            .followLogsFromExecution(executionId, tenant, null) // null = no filters
            .filter(event -> event.getExecutionId() != null)    // skip keepalive frames
            .takeUntilOther(KestraClients.INSTANCE.executions()
                .followExecution(executionId, tenant).then())    // stop when the execution ends
            .doOnNext(event -> System.out.printf("[%s] %s%n",
                event.getLevel(), event.getMessage()))
            .blockLast();
    }
}
```

:::alert{type="info"}
Use `listLogsFromExecution` after an execution finishes. Use `followLogsFromExecution` to stream logs in real time from a running execution.
:::

---

## Manage triggers

Search, enable or disable, unlock, and restart triggers for flows.

### Search triggers

Filter the search with a list of `QueryFilter` objects, for example by namespace:

```java
import java.util.List;
import io.kestra.sdk.model.QueryFilter;
import io.kestra.sdk.model.QueryFilterField;
import io.kestra.sdk.model.QueryFilterOp;

public class TriggersExamples {
    public static void searchTriggers() {
        String tenant = "main";

        List<QueryFilter> filters = List.of(new QueryFilter()
            .field(QueryFilterField.NAMESPACE)
            .operation(QueryFilterOp.EQUALS)
            .value("my_namespace"));

        var result = KestraClients.INSTANCE.triggers()
            .searchTriggers(tenant,
                1,       // page
                50,      // size
                null,    // sort
                filters, // filters
                null     // dateFilter
            );

        result.getResults().forEach(t -> {
            var state = t.getState();
            System.out.printf("%s: disabled=%s%n",
                state.getTriggerId(), state.getDisabled());
        });
    }
}
```

### Disable or enable a trigger

```java
import io.kestra.sdk.model.TriggerControllerSetDisabledRequest;
import io.kestra.sdk.model.TriggerControllerApiTriggerId;

public class TriggersExamples {
    public static void disableTrigger() {
        String tenant = "main";

        var request = new TriggerControllerSetDisabledRequest()
            .addTriggersItem(new TriggerControllerApiTriggerId()
                .namespace("my_namespace")
                .flowId("my_flow")
                .triggerId("my_schedule"))
            .disabled(true);  // pass false to re-enable

        KestraClients.INSTANCE.triggers()
            .disabledTriggersByIds(tenant, request);
        System.out.println("Trigger disabled: " + request.getDisabled());
    }
}
```

### Unlock a trigger

Use `unlockTrigger` to unlock a trigger that is stuck in a locked state. If the trigger is not locked, the call throws an `ApiException` with status `409`.

```java
public class TriggersExamples {
    public static void unlockTrigger() {
        String tenant = "main";

        KestraClients.INSTANCE.triggers()
            .unlockTrigger(tenant, "my_namespace", "my_flow", "my_schedule");
        System.out.println("Trigger unlocked");
    }
}
```

### Restart a trigger

```java
public class TriggersExamples {
    public static void restartTrigger() {
        String tenant = "main";

        KestraClients.INSTANCE.triggers()
            .restartTrigger(tenant, "my_namespace", "my_flow", "my_schedule");
        System.out.println("Trigger restarted");
    }
}
```

---

## Dashboards

Create, search, and delete dashboards.

### Create a dashboard

```java
public class DashboardsExamples {
    public static void createDashboard() {
        String tenant = "main";
        String body = """
            id: my_dashboard
            title: My Dashboard
            charts: []
            """;
        var dashboard = KestraClients.INSTANCE.dashboards().createDashboard(tenant, body);
        System.out.println("Dashboard created: " + dashboard.getId());
    }
}
```

### Search dashboards

```java
public class DashboardsExamples {
    public static void searchDashboards() {
        String tenant = "main";
        var result = KestraClients.INSTANCE.dashboards().searchDashboards(tenant, null, null, null, null);
        result.getResults().forEach(d -> System.out.println(d.getId()));
    }
}
```

### Delete a dashboard

```java
public class DashboardsExamples {
    public static void deleteDashboard() {
        String tenant = "main";
        KestraClients.INSTANCE.dashboards().deleteDashboard("my_dashboard_id", tenant);
        System.out.println("Dashboard deleted");
    }
}
```

---

## Namespace files

List, read, and delete files stored in a namespace.

### List files

```java
public class FilesExamples {
    public static void listFiles() {
        var files = KestraClients.INSTANCE.files()
            .listNamespaceDirectoryFiles("my_namespace", "main", "/");
        files.forEach(f -> System.out.println(f.getFileName()));
    }
}
```

### Read file content

```java
import java.io.File;

public class FilesExamples {
    public static void readFile() {
        String tenant = "main";
        File content = KestraClients.INSTANCE.files()
            .fileContent("my_namespace", "/scripts/main.py", tenant, null);
        System.out.println("Downloaded to: " + content.getAbsolutePath());
    }
}
```

### Delete a file

```java
public class FilesExamples {
    public static void deleteFile() {
        String tenant = "main";
        KestraClients.INSTANCE.files()
            .deleteFileDirectory("my_namespace", "/scripts/main.py", tenant);
        System.out.println("File deleted");
    }
}
```

---

## Test suites

:::alert{type="warning"}
Test suites require Kestra Enterprise Edition.
:::

Create, run, and fetch results for unit test suites.

### Create a test suite

A test suite targets one flow (`flowId`) and lists its `testCases`. This example assumes `my_flow` has a `STRING` input `inputA` and a `return` task of type `io.kestra.plugin.core.debug.Return` that outputs it.

```java
public class TestSuitesExamples {
    public static void createTestSuite() {
        String tenant = "main";
        String body = """
            id: my_tests
            namespace: my_namespace
            flowId: my_flow
            testCases:
              - id: returns_input
                type: io.kestra.core.tests.flow.UnitTest
                fixtures:
                  inputs:
                    inputA: "Hi there"
                assertions:
                  - value: "{{ outputs.return.value }}"
                    equalTo: "Hi there"
            """;
        var suite = KestraClients.INSTANCE.testSuites().createTestSuite(tenant, body);
        System.out.println("Test suite created: " + suite.getId());
    }
}
```

### Run a test suite

```java
public class TestSuitesExamples {
    public static void runTestSuite() {
        String tenant = "main";
        var result = KestraClients.INSTANCE.testSuites()
            .runTestSuite("my_namespace", "my_tests", tenant, null);
        System.out.println("Run: " + result.getId() + " State: " + result.getState());
    }
}
```

### Get test results

Pass the run ID returned by `runTestSuite`.

```java
public class TestSuitesExamples {
    public static void getTestResult() {
        String tenant = "main";
        var result = KestraClients.INSTANCE.testSuites().testResult("run-id", tenant);
        System.out.println("State: " + result.getState());
    }
}
```

---

## Apps

:::alert{type="warning"}
Apps require Kestra Enterprise Edition.
:::

Create, enable, disable, and delete apps.

### Create an app

```java
public class AppsExamples {
    public static void createApp() {
        String tenant = "main";
        String body = """
            id: my_app
            type: io.kestra.plugin.ee.apps.Execution
            namespace: my_namespace
            flowId: my_flow
            displayName: My App
            layout:
              - on: OPEN
                blocks:
                  - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
                    content: "# My App"
              - on: SUCCESS
                blocks:
                  - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
                    content: "Done!"
            """;
        var app = KestraClients.INSTANCE.apps().createApp(tenant, body);
        System.out.println("App created: " + app.getUid());
    }
}
```

### Enable or disable an app

```java
public class AppsExamples {
    public static void enableApp() {
        String tenant = "main";
        KestraClients.INSTANCE.apps().enableApp("app-uid", tenant);
        System.out.println("App enabled");
    }

    public static void disableApp() {
        String tenant = "main";
        KestraClients.INSTANCE.apps().disableApp("app-uid", tenant);
        System.out.println("App disabled");
    }
}
```

### Delete an app

```java
public class AppsExamples {
    public static void deleteApp() {
        String tenant = "main";
        KestraClients.INSTANCE.apps().deleteApp("app-uid", tenant);
        System.out.println("App deleted");
    }
}
```

---

## Best practices

- **Reuse your client:** construct one `KestraClient` per application (singleton or DI).
- **Externalize credentials:** read URL and auth from environment variables or your config system.
- **Keep flow YAML as code:** store YAML strings or templates under version control for traceability.
- **Use labels** for governance, search, and routing across executions.
