---
title: Kestra Go SDK
icon: /docs/icons/api.svg
release: 1.0.0
---

## Install the Go SDK

To get started with the Kestra Go SDK, install the following dependencies:

```sh
go get github.com/stretchr/testify/assert
go get golang.org/x/net/context
```

Then, import the SDK package into your project:

```go
import kestra_api_client "github.com/kestra-io/client-sdk/go-sdk"
```

If you need to use a proxy, set the `HTTP_PROXY` environment variable:

```go
os.Setenv("HTTP_PROXY", "http://proxy_name:proxy_port")
```

---

## Configure the server URL

By default, the configuration includes a `Servers` field that contains server objects as defined in the OpenAPI specification. You can customize these values to point to your Kestra instance or a specific environment.

### Selecting a server configuration

To use a server other than the default (index `0`), set the context value `kestra_api_client.ContextServerIndex`:

```go
ctx := context.WithValue(context.Background(), kestra_api_client.ContextServerIndex, 1)
```

### Using templated server URLs

Templated server URLs can be formatted using variables from either the configuration or context values. Use `kestra_api_client.ContextServerVariables` to define custom values:

```go
ctx := context.WithValue(context.Background(), kestra_api_client.ContextServerVariables, map[string]string{
	"basePath": "v2",
})
```

:::alert{type="info"}
**Note:** `enum` values are validated automatically, and unused variables are silently ignored.
:::

### Per-operation URL configuration

Each API operation can use its own server URL, defined through the `OperationServers` map in the `Configuration`.  
An operation is uniquely identified by the string `"{classname}Service.{nickname}"`.

To override the default operation server index and variables, use these context maps:

```go
ctx := context.WithValue(context.Background(), kestra_api_client.ContextOperationServerIndices, map[string]int{
	"{classname}Service.{nickname}": 2,
})
ctx = context.WithValue(context.Background(), kestra_api_client.ContextOperationServerVariables, map[string]map[string]string{
	"{classname}Service.{nickname}": {
		"port": "8443",
	},
})
```

---

## Create a flow

You can create a new flow in Kestra by providing its YAML source using the [`CreateFlow` model](https://github.com/kestra-io/client-sdk/blob/main/go-sdk/docs/FlowsAPI.md#CreateFlow):

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/kestra-io/client-sdk/go-sdk"
)

func main() {
	tenant := "tenant_example" // The tenant identifier
	body := "body_example"     // The flow source code in YAML

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.FlowsAPI.CreateFlow(context.Background(), tenant).Body(body).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `FlowsAPI.CreateFlow`: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// Response from `CreateFlow`: FlowWithSource
	fmt.Fprintf(os.Stdout, "Response from `FlowsAPI.CreateFlow`: %v\n", resp)
}
```

:::alert{type="info"}
**Important:**  
- The `body` variable must contain valid YAML defining the flow.  
- Make sure the flow is scoped to the correct tenant (multi-tenant setups may reject cross-tenant operations).  
- The response object (`FlowWithSource`) includes both the flow metadata and its source definition.
:::

---

## Execute a flow

You can trigger a flow execution using the [`CreateExecution` model](https://github.com/kestra-io/client-sdk/blob/main/go-sdk/docs/ExecutionsAPI.md#CreateExecution):

```go
package main

import (
	"context"
	"fmt"
	"os"
	"time"
	openapiclient "github.com/kestra-io/client-sdk/go-sdk"
)

func main() {
	namespace := "namespace_example" // The flow namespace
	id := "id_example"               // The flow ID
	wait := true                     // Whether to wait for execution completion
	tenant := "tenant_example"       // Tenant identifier
	labels := []string{"key:value"}  // Optional labels for traceability
	revision := int32(56)            // Flow revision (or latest if null)
	scheduleDate := time.Now()       // Optional scheduled date for execution
	breakpoints := "task1,task2"     // Optional list of breakpoints
	kind := openapiclient.ExecutionKind("NORMAL") // Execution kind

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ExecutionsAPI.CreateExecution(context.Background(), namespace, id, tenant).
		Wait(wait).
		Labels(labels).
		Revision(revision).
		ScheduleDate(scheduleDate).
		Breakpoints(breakpoints).
		Kind(kind).
		Execute()

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ExecutionsAPI.CreateExecution`: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// Response from `CreateExecution`: []ExecutionControllerExecutionResponse
	fmt.Fprintf(os.Stdout, "Response from `ExecutionsAPI.CreateExecution`: %v\n", resp)
}
```

:::alert{type="info"}
**Notes:**  
- The `wait` flag determines whether the API call blocks until execution completes or returns immediately.  
- If using `scheduleDate`, ensure your Kestra instance supports delayed executions.  
- `breakpoints` allow pausing at specific tasks for debugging or step-by-step analysis.  
- The API returns an `ExecutionControllerExecutionResponse`, which includes the execution ID and status for tracking.
:::

---

## Next steps

- Explore the [Kestra API Reference](https://kestra.io/docs/api/) for details on available endpoints.  
- Combine executions with event triggers or task templates for more advanced workflows.  
- For production use, configure retry logic and connection timeouts in your API client.

---
