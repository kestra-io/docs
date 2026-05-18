---
title: "Go SDK for Kestra: Client Setup and Examples"
h1: Set Up the Kestra Go SDK and Build Workflows Programmatically
sidebarTitle: Go SDK
icon: /src/contents/docs/icons/api.svg
release: 1.0.0
description: Integrate Kestra with Go using the official SDK. Learn to set up the client, configure authentication, and programmatically create and execute workflows.
---

Use the Kestra Go SDK to interact with the Kestra API from Go applications.

## Install the Go SDK

Install the Go module:

```shell
go get github.com/kestra-io/client-sdk/go-sdk
```

Import the package in your code:

```go
import openapiclient "github.com/kestra-io/client-sdk/go-sdk"
```

---

## Configure the client

Define two helpers — `newClient()` to build the `APIClient` and `newContext()` to attach credentials — then reuse them across your application. Read configuration from environment variables.

```go
package main

import (
    "context"
    "os"
    openapiclient "github.com/kestra-io/client-sdk/go-sdk"
)

func getenv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}

func newClient() *openapiclient.APIClient {
    cfg := openapiclient.NewConfiguration()
    cfg.Servers = openapiclient.ServerConfigurations{
        {URL: getenv("KESTRA_URL", "http://localhost:8080")},
    }
    return openapiclient.NewAPIClient(cfg)
}

func newContext() context.Context {
    return context.WithValue(
        context.Background(),
        openapiclient.ContextBasicAuth,
        openapiclient.BasicAuth{
            UserName: getenv("KESTRA_USER", "root@root.com"),
            Password: getenv("KESTRA_PASS", "Root!1234"),
        },
    )
}
```

:::alert{type="info"}
To use bearer token authentication instead, pass `openapiclient.ContextAccessToken` with your token string as the context value. The examples below receive `ctx` and `apiClient` from `newContext()` and `newClient()` above.
:::

---

## Create a flow

Send the flow definition as a YAML string.

```go
func createFlow(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    body := `id: my_flow
namespace: my_namespace
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World!
`
    flow, _, err := apiClient.FlowsAPI.CreateFlow(ctx, tenant).Body(body).Execute()
    if err != nil {
        fmt.Printf("Error creating flow: %v\n", err)
        return
    }
    fmt.Println("Flow created:", flow.GetId())
}
```

:::alert{type="info"}
`body` must be valid flow YAML. If a flow with the same `id` and `namespace` already exists, use `UpdateFlow` instead.
:::

---

## Update a flow

Send the full YAML — including the same `id` and `namespace` — to replace an existing flow.

```go
func updateFlow(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    namespace := "my_namespace"
    id := "my_flow"
    body := `id: my_flow
namespace: my_namespace
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Updated message!
`
    updated, _, err := apiClient.FlowsAPI.UpdateFlow(ctx, tenant, namespace, id).Body(body).Execute()
    if err != nil {
        fmt.Printf("Error updating flow: %v\n", err)
        return
    }
    fmt.Println("Flow updated:", updated.GetId())
}
```

---

## Delete a flow

Remove a flow by its `namespace`, `id`, and `tenant`.

```go
func deleteFlow(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    namespace := "my_namespace"
    id := "my_flow"

    _, err := apiClient.FlowsAPI.DeleteFlow(ctx, namespace, id, tenant).Execute()
    if err != nil {
        fmt.Printf("Error deleting flow: %v\n", err)
        return
    }
    fmt.Println("Flow deleted:", namespace+"/"+id)
}
```

:::alert{type="info"}
Deleting a flow removes its definition. Execution history is retained unless you delete executions separately.
:::

---

## Execute a flow

Trigger an execution and optionally wait for it to complete.

```go
func createExecution(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    namespace := "my_namespace"
    id := "my_flow"
    wait := true

    execs, _, err := apiClient.ExecutionsAPI.
        CreateExecution(ctx, namespace, id, tenant).
        Wait(wait).
        Execute()
    if err != nil {
        fmt.Printf("Error creating execution: %v\n", err)
        return
    }
    if len(execs) > 0 {
        fmt.Println("Execution started:", execs[0].GetId())
    }
}
```

:::alert{type="info"}
`Wait(true)` blocks until the execution finishes. Use `Wait(false)` for non-blocking calls. Pass `.Labels([]string{"team:platform"})` to attach labels to the execution. `CreateExecution` returns a slice — the SDK wraps the single execution in an array. Always check `len(execs) > 0` before accessing `execs[0]`.
:::

---

## KV Store

The KV Store lets you read and write key-value pairs scoped to a namespace.

### List keys

```go
func listKVKeys(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    keys, _, err := apiClient.KVAPI.ListKeys(ctx, "my_namespace", tenant).Execute()
    if err != nil {
        fmt.Printf("Error listing keys: %v\n", err)
        return
    }
    for _, entry := range keys {
        fmt.Println("Key:", entry.GetKey())
    }
}
```

### Get a value

```go
func getKVValue(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    result, _, err := apiClient.KVAPI.
        GetKeyValue(ctx, "my_namespace", "my_key", tenant).
        Execute()
    if err != nil {
        fmt.Printf("Error getting key: %v\n", err)
        return
    }
    fmt.Println("Value:", result.GetValue())
}
```

### Set a value

```go
func setKVValue(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    _, _, err := apiClient.KVAPI.
        SetKeyValue(ctx, "my_namespace", "my_key", tenant).
        Body("my_value").
        Execute()
    if err != nil {
        fmt.Printf("Error setting key: %v\n", err)
        return
    }
    fmt.Println("Key set")
}
```

### Delete a key

```go
func deleteKVKey(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    _, _, err := apiClient.KVAPI.
        DeleteKeyValue(ctx, "my_namespace", "my_key", tenant).
        Execute()
    if err != nil {
        fmt.Printf("Error deleting key: %v\n", err)
        return
    }
    fmt.Println("Key deleted")
}
```

---

## Read execution logs

Fetch logs for a completed execution.

```go
func listLogs(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    result, _, err := apiClient.LogsAPI.
        ListLogsFromExecution(ctx, "your-execution-id", tenant).
        Execute()
    if err != nil {
        fmt.Printf("Error fetching logs: %v\n", err)
        return
    }
    for _, log := range result.GetResults() {
        fmt.Printf("[%s] %s\n", log.GetLevel(), log.GetMessage())
    }
}
```

---

## Manage triggers

Search, enable or disable, unlock, and restart triggers for flows.

### Search triggers

```go
func searchTriggers(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    result, _, err := apiClient.TriggersAPI.
        SearchTriggers(ctx, tenant).
        Namespace("my_namespace").
        Execute()
    if err != nil {
        fmt.Printf("Error searching triggers: %v\n", err)
        return
    }
    for _, t := range result.GetResults() {
        fmt.Printf("%s: disabled=%v\n", t.GetTriggerId(), t.GetDisabled())
    }
}
```

### Disable or enable a trigger

Add `"time"` to your import block for `time.Time{}`.

```go
func disableTrigger(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    trigger := openapiclient.NewTrigger("my_namespace", "my_flow", "my_schedule", time.Time{})

    request := openapiclient.NewTriggerControllerSetDisabledRequest(
        []openapiclient.Trigger{*trigger},
        true, // disabled=true; pass false to re-enable
    )

    _, _, err := apiClient.TriggersAPI.
        DisabledTriggersByIds(ctx, tenant).
        TriggerControllerSetDisabledRequest(*request).
        Execute()
    if err != nil {
        fmt.Printf("Error disabling trigger: %v\n", err)
        return
    }
    fmt.Println("Trigger disabled")
}
```

### Unlock a trigger

```go
func unlockTrigger(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    _, _, err := apiClient.TriggersAPI.
        UnlockTrigger(ctx, "my_namespace", "my_flow", "my_schedule", tenant).
        Execute()
    if err != nil {
        fmt.Printf("Error unlocking trigger: %v\n", err)
        return
    }
    fmt.Println("Trigger unlocked")
}
```

### Restart a trigger

```go
func restartTrigger(ctx context.Context, apiClient *openapiclient.APIClient) {
    tenant := "main"
    _, _, err := apiClient.TriggersAPI.
        RestartTrigger(ctx, "my_namespace", "my_flow", "my_schedule", tenant).
        Execute()
    if err != nil {
        fmt.Printf("Error restarting trigger: %v\n", err)
        return
    }
    fmt.Println("Trigger restarted")
}
```

---

## Best practices

- **Reuse your client:** construct one `APIClient` at startup and share it via dependency injection or a package-level variable.
- **Externalize credentials:** read URL and auth from environment variables.
- **Handle errors explicitly:** all SDK methods return an error value — always check it.
- **Use context for timeouts:** pass a `context.WithTimeout` to control request deadlines.
