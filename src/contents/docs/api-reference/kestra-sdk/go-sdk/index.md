---
title: "Go SDK for Kestra: Client Setup and Examples"
h1: Set Up the Kestra Go SDK and Build Workflows Programmatically
sidebarTitle: Go SDK
icon: /src/contents/docs/icons/api.svg
release: 1.0.0
description: Integrate Kestra with Go using the official SDK. Learn to set up the client, configure authentication, and programmatically create and execute workflows.
---

Use the Kestra Go SDK to interact with the Kestra API from Go applications. The SDK is hand-written: `kestra.NewClient` returns a `KestraClient` that groups operations by resource, such as `client.Flows()`, `client.Executions()`, and `client.Kv()`.

## Install the Go SDK

Install the Go module:

```shell
go get github.com/kestra-io/client-sdk/go-sdk/v2@latest
```

Import the package in your code:

```go
import kestra "github.com/kestra-io/client-sdk/go-sdk/v2/kestra_api_client"
```

---

## Configure the client

Define a `newClient()` helper that builds a `KestraClient` with `kestra.NewClient`, then reuse it across your application. Read configuration from environment variables.

```go
package main

import (
    "os"

    kestra "github.com/kestra-io/client-sdk/go-sdk/v2/kestra_api_client"
)

func getenv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}

func newClient() *kestra.KestraClient {
    return kestra.NewClient(
        getenv("KESTRA_URL", "http://localhost:8080"),
        kestra.WithBasicAuth(
            getenv("KESTRA_USER", "root@root.com"),
            getenv("KESTRA_PASS", "Root!1234"),
        ),
    )
}
```

:::alert{type="info"}
To authenticate with a service account API token instead, pass `kestra.WithTokenAuth("<api-token>")` in place of `kestra.WithBasicAuth(...)`. The examples below receive a `ctx` (for example `context.Background()`) and the `client` returned by `newClient()`. The examples also use the `context` and `fmt` packages, and the timeout example uses `time`; add them to your imports. The package also still exports the older `APIClient` (`NewAPIClient`) for backward compatibility with code written against earlier SDK versions; use `NewClient` for new code.
:::

---

## Create a flow

Send the flow definition as a YAML string.

```go
func createFlow(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    body := `id: my_flow
namespace: my_namespace
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World!
`
    flow, err := client.Flows().CreateFlow(ctx, tenant, body)
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

Send the full YAML — including the same `id` and `namespace` — to replace an existing flow. `UpdateFlow` takes `(ctx, namespace, id, tenant, body)`.

```go
func updateFlow(ctx context.Context, client *kestra.KestraClient) {
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
    updated, err := client.Flows().UpdateFlow(ctx, namespace, id, tenant, body)
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
func deleteFlow(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    namespace := "my_namespace"
    id := "my_flow"

    err := client.Flows().DeleteFlow(ctx, namespace, id, tenant)
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
func createExecution(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    namespace := "my_namespace"
    id := "my_flow"

    execution, err := client.Executions().CreateExecution(
        ctx, tenant, namespace, id,
        nil,                  // labels, e.g. []string{"team:platform"}
        kestra.PtrBool(true), // wait for the execution to finish
        nil, nil, nil, nil,   // revision, scheduleDate, breakpoints, kind
    )
    if err != nil {
        fmt.Printf("Error creating execution: %v\n", err)
        return
    }
    state := execution.GetState()
    fmt.Println("Execution", execution.GetId(), "finished in state", state.GetCurrent())
}
```

:::alert{type="info"}
`kestra.PtrBool(true)` blocks until the execution finishes. Pass `kestra.PtrBool(false)` (or `nil`) for a non-blocking call. Pass labels as `[]string{"team:platform"}` to attach them to the execution. `CreateExecution` returns a single `*ExecutionControllerExecutionResponse`.
:::

---

## KV Store

The KV Store lets you read and write key-value pairs scoped to a namespace.

### List keys

```go
func listKVKeys(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    filters := []kestra.SearchFilter{
        {Field: kestra.FilterNamespace, Operation: kestra.OpEquals, Value: "my_namespace"},
    }
    page, err := client.Kv().ListAllKeys(ctx, tenant, kestra.PtrInt(1), kestra.PtrInt(100), nil, filters)
    if err != nil {
        fmt.Printf("Error listing keys: %v\n", err)
        return
    }
    for _, entry := range page.GetResults() {
        fmt.Println("Key:", entry.GetKey())
    }
}
```

### Get a value

```go
func getKVValue(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    result, err := client.Kv().KeyValue(ctx, "my_namespace", "my_key", tenant)
    if err != nil {
        fmt.Printf("Error getting key: %v\n", err)
        return
    }
    fmt.Println("Type:", result.GetType(), "Value:", result.GetValue())
}
```

`GetValue()` returns an `interface{}` holding the decoded value (`string`, `bool`, number, and so on); use `GetType()` to check its KV type.

### Set a value

```go
func setKVValue(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    err := client.Kv().SetKeyValue(ctx, "my_namespace", "my_key", tenant, `"my_value"`)
    if err != nil {
        fmt.Printf("Error setting key: %v\n", err)
        return
    }
    fmt.Println("Key set")
}
```

:::alert{type="info"}
The value is parsed by type: quote strings (`"my_value"`), and pass `true` or `42` unquoted to store a boolean or a number. To set an expiration, use `SetKeyValueWithTTL` with an ISO 8601 duration such as `kestra.PtrString("PT1H")`.
:::

### Delete a key

```go
func deleteKVKey(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    _, err := client.Kv().DeleteKeyValue(ctx, "my_namespace", "my_key", tenant)
    if err != nil {
        fmt.Printf("Error deleting key: %v\n", err)
        return
    }
    fmt.Println("Key deleted")
}
```

---

## Read execution logs

Fetch all log entries for a completed execution.

```go
func listLogs(ctx context.Context, client *kestra.KestraClient) {
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
func followLogs(client *kestra.KestraClient) {
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()

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

Filter results with a slice of `kestra.SearchFilter`, built from the `Filter*` field and `Op*` operation constants.

```go
func searchTriggers(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    filters := []kestra.SearchFilter{
        {Field: kestra.FilterNamespace, Operation: kestra.OpEquals, Value: "my_namespace"},
    }
    result, err := client.Triggers().SearchTriggers(ctx, tenant, kestra.PtrInt(1), kestra.PtrInt(10), nil, filters, nil)
    if err != nil {
        fmt.Printf("Error searching triggers: %v\n", err)
        return
    }
    for _, t := range result.GetResults() {
        state := t.GetState()
        fmt.Printf("%s: disabled=%v\n", state.GetTriggerId(), state.GetDisabled())
    }
}
```

### Disable or enable a trigger

Identify each trigger by its namespace, flow ID, and trigger ID.

```go
func disableTrigger(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    request := kestra.TriggerControllerSetDisabledRequest{
        Triggers: []kestra.TriggerControllerApiTriggerId{{
            Namespace: kestra.PtrString("my_namespace"),
            FlowId:    kestra.PtrString("my_flow"),
            TriggerId: kestra.PtrString("my_schedule"),
        }},
        Disabled: true, // pass false to re-enable
    }

    _, err := client.Triggers().DisabledTriggersByIds(ctx, tenant, request)
    if err != nil {
        fmt.Printf("Error disabling trigger: %v\n", err)
        return
    }
    fmt.Println("Trigger disabled")
}
```

### Unlock a trigger

`UnlockTrigger` and `RestartTrigger` take the tenant first: `(ctx, tenant, namespace, flowId, triggerId)`.

```go
func unlockTrigger(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    _, err := client.Triggers().UnlockTrigger(ctx, tenant, "my_namespace", "my_flow", "my_schedule")
    if err != nil {
        fmt.Printf("Error unlocking trigger: %v\n", err)
        return
    }
    fmt.Println("Trigger unlocked")
}
```

### Restart a trigger

```go
func restartTrigger(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    _, err := client.Triggers().RestartTrigger(ctx, tenant, "my_namespace", "my_flow", "my_schedule")
    if err != nil {
        fmt.Printf("Error restarting trigger: %v\n", err)
        return
    }
    fmt.Println("Trigger restarted")
}
```

---

## Dashboards

Create, search, and delete dashboards.

### Create a dashboard

```go
func createDashboard(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    body := `id: my_dashboard
title: My Dashboard
timeWindow:
  default: P30D
  max: P365D
charts: []
`
    dashboard, err := client.Dashboards().CreateDashboard(ctx, tenant, body)
    if err != nil {
        fmt.Printf("Error creating dashboard: %v\n", err)
        return
    }
    fmt.Println("Dashboard created:", dashboard.GetId())
}
```

### Search dashboards

```go
func searchDashboards(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    result, err := client.Dashboards().SearchDashboards(ctx, tenant, nil, nil, nil, nil)
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
func deleteDashboard(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    err := client.Dashboards().DeleteDashboard(ctx, "my_dashboard", tenant)
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
func listFiles(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    files, err := client.Files().ListNamespaceDirectoryFiles(ctx, "my_namespace", tenant, kestra.PtrString("/"))
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

`FileContent` downloads the file to a temporary `*os.File` and returns it.

```go
func readFile(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    content, err := client.Files().FileContent(ctx, "my_namespace", tenant, "/scripts/main.py", nil)
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
func deleteFile(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    err := client.Files().DeleteFileDirectory(ctx, "my_namespace", tenant, "/scripts/main.py")
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

A test suite targets one flow (`flowId`) and lists its `testCases`. This example assumes `my_flow` has a `STRING` input `inputA` and a `return` task of type `io.kestra.plugin.core.debug.Return` that outputs it.

```go
func createTestSuite(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    body := `id: my_tests
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
`
    suite, err := client.TestSuites().CreateTestSuite(ctx, tenant, body)
    if err != nil {
        fmt.Printf("Error creating test suite: %v\n", err)
        return
    }
    fmt.Println("Test suite created:", suite.GetId())
}
```

### Run a test suite

```go
func runTestSuite(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    result, err := client.TestSuites().RunTestSuite(ctx, "my_namespace", "my_tests", tenant, nil)
    if err != nil {
        fmt.Printf("Error running test suite: %v\n", err)
        return
    }
    fmt.Println("Run:", result.GetId(), "State:", result.GetState())
}
```

### Get test results

Pass the run ID returned by `RunTestSuite`.

```go
func getTestResult(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    result, err := client.TestSuites().TestResult(ctx, "run-id", tenant)
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

An app needs a `type`, the `namespace` and `flowId` of the flow it runs, a `displayName`, and a `layout`.

```go
func createApp(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    body := `id: my_app
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
`
    app, err := client.Apps().CreateApp(ctx, tenant, body)
    if err != nil {
        fmt.Printf("Error creating app: %v\n", err)
        return
    }
    fmt.Println("App created:", app.GetUid())
}
```

### Enable or disable an app

```go
func enableApp(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    _, err := client.Apps().EnableApp(ctx, "app-uid", tenant)
    if err != nil {
        fmt.Printf("Error enabling app: %v\n", err)
        return
    }
    fmt.Println("App enabled")
}

func disableApp(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    _, err := client.Apps().DisableApp(ctx, "app-uid", tenant)
    if err != nil {
        fmt.Printf("Error disabling app: %v\n", err)
        return
    }
    fmt.Println("App disabled")
}
```

### Delete an app

```go
func deleteApp(ctx context.Context, client *kestra.KestraClient) {
    tenant := "main"
    err := client.Apps().DeleteApp(ctx, "app-uid", tenant)
    if err != nil {
        fmt.Printf("Error deleting app: %v\n", err)
        return
    }
    fmt.Println("App deleted")
}
```

---

## Best practices

- **Reuse your client:** construct one `KestraClient` at startup and share it via dependency injection or a package-level variable.
- **Externalize credentials:** read URL and auth from environment variables.
- **Handle errors explicitly:** all SDK methods return an error value — always check it.
- **Use context for timeouts:** pass a `context.WithTimeout` to control request deadlines.
