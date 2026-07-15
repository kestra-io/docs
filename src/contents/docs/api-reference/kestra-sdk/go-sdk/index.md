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

Fetch all log entries for a completed execution. Log operations use `KestraClient` from the same package — not the generated `APIClient`.

```go
import (
    "context"
    "fmt"
    kestra "github.com/kestra-io/client-sdk/go-sdk/kestra_api_client"
)

func listLogs() {
    ctx := context.Background()
    client := kestra.NewClient("http://localhost:8080",
        kestra.WithBasicAuth("root@root.com", "Root!1234"))

    logs, err := client.Logs().ListLogsFromExecution(ctx, "your-execution-id", "main", nil, nil, nil, nil)
    if err != nil {
        fmt.Printf("Error fetching logs: %v\n", err)
        return
    }
    for _, log := range logs {
        fmt.Printf("[%s] %s\n", log.GetLevel(), log.GetMessage())
    }
}
```

Pass a minimum log level to filter results — for example `kestra.PtrString("INFO")` as the fourth argument. Remaining arguments (`taskRunId`, `taskId`, `attempt`) narrow by task; pass `nil` to skip each filter.

---

## Stream execution logs (SSE)

Stream logs from a running execution in real time. `FollowLogsFromExecution` opens an SSE connection and returns a `<-chan *LogEntry`. Entries arrive as the execution produces them. The channel closes when the execution ends or the context is cancelled.

```go
func followLogs() {
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()

    client := kestra.NewClient("http://localhost:8080",
        kestra.WithBasicAuth("root@root.com", "Root!1234"))

    ch, err := client.Logs().FollowLogsFromExecution(ctx, "your-execution-id", "main", nil)
    if err != nil {
        fmt.Printf("Error starting log stream: %v\n", err)
        return
    }

    for entry := range ch {
        if entry.GetExecutionId() == "" {
            continue // skip the synthetic "start" entry the server sends on stream open
        }
        fmt.Printf("[%s] %s\n", entry.GetLevel(), entry.GetMessage())
    }
}
```

To stop streaming early, cancel the context. The server-side SSE connection closes and the channel drains within milliseconds:

```go
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()

ch, err := client.Logs().FollowLogsFromExecution(ctx, "your-execution-id", "main", nil)
if err != nil {
    fmt.Printf("Error starting log stream: %v\n", err)
    return
}
for entry := range ch {
    if entry.GetExecutionId() == "" {
        continue
    }
    fmt.Printf("[%s] %s\n", entry.GetLevel(), entry.GetMessage())
}
```

:::alert{type="info"}
The fourth argument is an optional minimum log level filter (`*string`). Pass `kestra.PtrString("INFO")` to receive only INFO and above, or `nil` to receive all levels.
:::

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

## Dashboards

The following examples use `NewClient`, which provides a higher-level client for APIs not available in the generated client.

```go
func newKestraClient() *openapiclient.KestraClient {
    return openapiclient.NewClient(
        getenv("KESTRA_URL", "http://localhost:8080"),
        openapiclient.WithBasicAuth(
            getenv("KESTRA_USER", "root@root.com"),
            getenv("KESTRA_PASS", "Root!1234"),
        ),
    )
}
```

### Create a dashboard

```go
func createDashboard(ctx context.Context) {
    tenant := "main"
    body := `id: my_dashboard
title: My Dashboard
`
    kestraClient := newKestraClient()
    dashboard, err := kestraClient.Dashboards().CreateDashboard(ctx, tenant, body)
    if err != nil {
        fmt.Printf("Error creating dashboard: %v\n", err)
        return
    }
    fmt.Println("Dashboard created:", dashboard.GetId())
}
```

### Search dashboards

```go
func searchDashboards(ctx context.Context) {
    tenant := "main"
    kestraClient := newKestraClient()
    result, err := kestraClient.Dashboards().SearchDashboards(ctx, tenant, nil, nil, nil, nil)
    if err != nil {
        fmt.Printf("Error searching dashboards: %v\n", err)
        return
    }
    for _, d := range result.GetResults() {
        fmt.Println("Dashboard:", d.GetId())
    }
}
```

### Delete a dashboard

```go
func deleteDashboard(ctx context.Context) {
    tenant := "main"
    kestraClient := newKestraClient()
    err := kestraClient.Dashboards().DeleteDashboard(ctx, "my_dashboard_id", tenant)
    if err != nil {
        fmt.Printf("Error deleting dashboard: %v\n", err)
        return
    }
    fmt.Println("Dashboard deleted")
}
```

---

## Namespace files

List, read, and delete files stored in a namespace.

### List files

```go
func listFiles(ctx context.Context) {
    tenant := "main"
    kestraClient := newKestraClient()
    path := "/"
    files, err := kestraClient.Files().ListNamespaceDirectoryFiles(ctx, "my_namespace", tenant, &path)
    if err != nil {
        fmt.Printf("Error listing files: %v\n", err)
        return
    }
    for _, f := range files {
        fmt.Println("File:", f.GetFileName())
    }
}
```

### Read file content

```go
func readFile(ctx context.Context) {
    tenant := "main"
    kestraClient := newKestraClient()
    content, err := kestraClient.Files().FileContent(ctx, "my_namespace", tenant, "/scripts/main.py", nil)
    if err != nil {
        fmt.Printf("Error reading file: %v\n", err)
        return
    }
    defer content.Close()
    fmt.Println("Downloaded to:", content.Name())
}
```

### Delete a file

```go
func deleteFile(ctx context.Context) {
    tenant := "main"
    kestraClient := newKestraClient()
    err := kestraClient.Files().DeleteFileDirectory(ctx, "my_namespace", tenant, "/scripts/main.py")
    if err != nil {
        fmt.Printf("Error deleting file: %v\n", err)
        return
    }
    fmt.Println("File deleted")
}
```

---

## Test suites

:::alert{type="warning"}
Test suites require Kestra Enterprise Edition.
:::

Create, run, and fetch results for unit test suites.

### Create a test suite

```go
func createTestSuite(ctx context.Context) {
    tenant := "main"
    body := `id: my_tests
namespace: my_namespace
flows:
  - flowId: my_flow
`
    kestraClient := newKestraClient()
    suite, err := kestraClient.TestSuites().CreateTestSuite(ctx, tenant, body)
    if err != nil {
        fmt.Printf("Error creating test suite: %v\n", err)
        return
    }
    fmt.Println("Test suite created:", suite.GetId())
}
```

### Run a test suite

```go
func runTestSuite(ctx context.Context) {
    tenant := "main"
    kestraClient := newKestraClient()
    result, err := kestraClient.TestSuites().RunTestSuite(ctx, "my_namespace", "my_tests", tenant, nil)
    if err != nil {
        fmt.Printf("Error running test suite: %v\n", err)
        return
    }
    fmt.Println("State:", result.GetState())
}
```

### Get test results

```go
func getTestResult(ctx context.Context) {
    tenant := "main"
    kestraClient := newKestraClient()
    result, err := kestraClient.TestSuites().TestResult(ctx, "run-id", tenant)
    if err != nil {
        fmt.Printf("Error fetching test result: %v\n", err)
        return
    }
    fmt.Println("State:", result.GetState())
}
```

---

## Apps

:::alert{type="warning"}
Apps require Kestra Enterprise Edition.
:::

Create, enable, disable, and delete apps.

### Create an app

```go
func createApp(ctx context.Context) {
    tenant := "main"
    body := `id: my_app
title: My App
`
    kestraClient := newKestraClient()
    app, err := kestraClient.Apps().CreateApp(ctx, tenant, body)
    if err != nil {
        fmt.Printf("Error creating app: %v\n", err)
        return
    }
    fmt.Println("App created:", app.GetUid())
}
```

### Enable or disable an app

```go
func enableApp(ctx context.Context) {
    tenant := "main"
    kestraClient := newKestraClient()
    _, err := kestraClient.Apps().EnableApp(ctx, "app-uid", tenant)
    if err != nil {
        fmt.Printf("Error enabling app: %v\n", err)
        return
    }
    fmt.Println("App enabled")
}

func disableApp(ctx context.Context) {
    tenant := "main"
    kestraClient := newKestraClient()
    _, err := kestraClient.Apps().DisableApp(ctx, "app-uid", tenant)
    if err != nil {
        fmt.Printf("Error disabling app: %v\n", err)
        return
    }
    fmt.Println("App disabled")
}
```

### Delete an app

```go
func deleteApp(ctx context.Context) {
    tenant := "main"
    kestraClient := newKestraClient()
    err := kestraClient.Apps().DeleteApp(ctx, "app-uid", tenant)
    if err != nil {
        fmt.Printf("Error deleting app: %v\n", err)
        return
    }
    fmt.Println("App deleted")
}
```

---

## Best practices

- **Reuse your client:** construct one `APIClient` at startup and share it via dependency injection or a package-level variable.
- **Externalize credentials:** read URL and auth from environment variables.
- **Handle errors explicitly:** all SDK methods return an error value — always check it.
- **Use context for timeouts:** pass a `context.WithTimeout` to control request deadlines.
