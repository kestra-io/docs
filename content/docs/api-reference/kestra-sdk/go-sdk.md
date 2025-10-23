---
title: Kestra Go SDK
icon: /docs/icons/api.svg
release: 1.0.0
---

## Install Go SDK

Install the following dependencies:

```sh
go get github.com/stretchr/testify/assert
go get golang.org/x/net/context
```

Put the package under your project folder and add the following `import`:

```go
import kestra_api_client "github.com/kestra-io/client-sdk/go-sdk"
```

To use a proxy, set the environment variable `HTTP_PROXY`:

```go
os.Setenv("HTTP_PROXY", "http://proxy_name:proxy_port")
```

## Configuration of Server URL

Default configuration comes with `Servers` field that contains server objects as defined in the OpenAPI specification.

### Select Server Configuration

For using other server than the one defined on index 0 set context value `kestra_api_client.ContextServerIndex` of type `int`.

```go
ctx := context.WithValue(context.Background(), kestra_api_client.ContextServerIndex, 1)
```

### Templated Server URL

Templated server URL is formatted using default variables from configuration or from context value `kestra_api_client.ContextServerVariables` of type `map[string]string`.

```go
ctx := context.WithValue(context.Background(), kestra_api_client.ContextServerVariables, map[string]string{
	"basePath": "v2",
})
```

::alert{type="info"}
Note, `enum` values are always validated, and all unused variables are silently ignored.
::

### URL configuration per operation

Each operation can use a different server URL defined in the `Configuration` through the `OperationServers` map. An operation is uniquely identified by the string `"{classname}Service.{nickname}"`. You can override the default operation server index and variables by using the context maps `kestra_api_client.ContextOperationServerIndices` and `kestra_api_client.ContextOperationServerVariables`.

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
