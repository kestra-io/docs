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

Choose the installation method that matches your build tool.

### Maven

Add this dependency to your `pom.xml`:

```xml
<dependency>
  <groupId>io.kestra</groupId>
  <artifactId>kestra-api-client</artifactId>
  <version>1.0.0</version>
  <scope>compile</scope>
</dependency>
```

### Gradle

Add this dependency to your `build.gradle`:

```groovy
implementation "io.kestra:kestra-api-client:1.0.0"
```

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
        String id = "my_flow";
        String namespace = "my_namespace";
        String tenant = "main";

        String body = """
        id: my_flow
        namespace: my_namespace

        tasks:
          - id: hello
            type: io.kestra.plugin.core.log.Log
            message: Updated message!
        """;

        KestraClients.INSTANCE.flows().updateFlow(id, namespace, tenant, body);
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
import io.kestra.sdk.ApiException;
import io.kestra.sdk.model.ExecutionKind;

public class ExecutionsExamples {
    public static void createExecution() {
        String namespace = "my_namespace";
        String id = "my_flow";
        String tenant = "main";
        Boolean wait = false;

        try {
            KestraClients.INSTANCE.executions()
                .createExecution(
                    namespace, id, wait, tenant,
                    List.of("team:platform"),  // labels
                    null,                      // revision (null = latest)
                    (OffsetDateTime) null,     // scheduleDate
                    null,                      // breakpoint task ID
                    ExecutionKind.NORMAL
                );
        } catch (ApiException e) {
            if (e.getCode() != 0) throw e; // code 0 = deserialization-only; execution ran normally
        }

        System.out.println("Execution triggered");
    }
}
```

:::alert{type="warning"}
In SDK 1.0.0, `createExecution` successfully triggers the execution but throws a deserialization exception when reading the response — the server returns a single JSON object while the SDK expects an array. The execution runs normally. The `try/catch` above suppresses this by re-throwing only on a non-zero status code.
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
            .deleteExecution(executionId, true, true, true, tenant);
        System.out.println("Execution deleted");
    }
}
```

---

## Follow an execution

Fetch the latest SSE event for an execution. Use this to check the final state after triggering an execution.

```java
public class ExecutionsExamples {
    public static void followExecution() {
        String executionId = "your-execution-id";
        String tenant = "main";

        var event = KestraClients.INSTANCE.executions()
            .followExecution(executionId, tenant);

        if (event != null) {
            System.out.printf("Event: %s%n", event.getId());
            if (event.getData() != null) {
                System.out.printf("Status: %s%n", event.getData().getState());
            }
        }
    }
}
```

---

## KV Store

The KV Store lets you read and write key-value pairs scoped to a namespace.

### List keys

```java
public class KVExamples {
    public static void listKeys() {
        String namespace = "my_namespace";
        String tenant = "main";

        var keys = KestraClients.INSTANCE.kv().listKeys(namespace, tenant);
        keys.forEach(entry -> System.out.println("Key: " + entry.getKey()));
    }
}
```

### Get a value

```java
public class KVExamples {
    public static void getKeyValue() {
        String namespace = "my_namespace";
        String tenant = "main";

        var result = KestraClients.INSTANCE.kv()
            .getKeyValue(namespace, "my_key", tenant);
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
import io.kestra.sdk.model.Level;

public class LogsExamples {
    public static void listLogs() {
        String executionId = "your-execution-id";
        String tenant = "main";

        var logs = KestraClients.INSTANCE.logs()
            .listLogsFromExecution(executionId, tenant,
                null,  // minLevel (null = all levels)
                null,  // taskRunId
                null,  // taskId
                null   // attempt
            );

        logs.forEach(log ->
            System.out.printf("[%s] %s%n", log.getLevel(), log.getMessage()));
    }
}
```

### Stream logs live

```java
import io.kestra.sdk.model.Level;

public class LogsExamples {
    public static void followLogs() {
        String executionId = "your-execution-id";
        String tenant = "main";

        var event = KestraClients.INSTANCE.logs()
            .followLogsFromExecution(executionId, tenant, null);

        if (event != null && event.getData() != null) {
            System.out.printf("[%s] %s%n",
                event.getData().getLevel(), event.getData().getMessage());
        }
    }
}
```

:::alert{type="info"}
Use `listLogsFromExecution` after an execution finishes. Use `followLogsFromExecution` to fetch the latest log event from a running execution.
:::

---

## Manage triggers

Search, enable or disable, unlock, and restart triggers for flows.

### Search triggers

```java
public class TriggersExamples {
    public static void searchTriggers() {
        String tenant = "main";

        var result = KestraClients.INSTANCE.triggers()
            .searchTriggers(1, 50, tenant,
                null,           // sort
                null,           // filters
                null,           // query string
                "my_namespace", // namespace filter
                null,           // workerId
                null            // flowId
            );

        result.getResults().forEach(t -> {
            var ctx = t.getTriggerContext();
            System.out.printf("%s: disabled=%s%n",
                ctx.getTriggerId(), ctx.getDisabled());
        });
    }
}
```

### Disable or enable a trigger

```java
import io.kestra.sdk.model.TriggerControllerSetDisabledRequest;
import io.kestra.sdk.model.Trigger;

public class TriggersExamples {
    public static void disableTrigger() {
        String tenant = "main";

        var request = new TriggerControllerSetDisabledRequest()
            .addTriggersItem(new Trigger()
                .namespace("my_namespace")
                .flowId("my_flow")
                .triggerId("my_schedule"))
            .disabled(true);  // pass false to re-enable

        KestraClients.INSTANCE.triggers()
            .disabledTriggersByIds(tenant, request);
        System.out.println("Trigger disabled");
    }
}
```

### Unlock a trigger

Use `unlockTrigger` to unlock a trigger that is stuck in a locked state.

```java
public class TriggersExamples {
    public static void unlockTrigger() {
        String tenant = "main";

        KestraClients.INSTANCE.triggers()
            .unlockTrigger("my_namespace", "my_flow", "my_schedule", tenant);
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
            .restartTrigger("my_namespace", "my_flow", "my_schedule", tenant);
        System.out.println("Trigger restarted");
    }
}
```

---

## Best practices

- **Reuse your client:** construct one `KestraClient` per application (singleton or DI).
- **Externalize credentials:** read URL and auth from environment variables or your config system.
- **Keep flow YAML as code:** store YAML strings or templates under version control for traceability.
- **Use labels** for governance, search, and routing across executions.
