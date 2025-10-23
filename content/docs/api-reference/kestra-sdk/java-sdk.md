---
title: Kestra Java SDK
icon: /docs/icons/api.svg
release: 1.0.0
---

## Requirements

Building the API client library requires:

1. **Java** 1.8 or higher  
2. **Maven** or **Gradle**

## Installation

Choose the installation method that matches your environment.

### Local installation

Install the API client library to your **local** Maven repository:

```shell
mvn clean install
```

### Remote deployment

Deploy the library to a **remote** Maven repository (configure repository credentials first):

```shell
mvn clean deploy
```

For details, see the [OSSRH Guide](http://central.sonatype.org/pages/ossrh-guide.html).

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
mvn clean package
```

Then install the following artifacts:

- `target/kestra-api-client-1.0.0.jar`
- `target/lib/*.jar`

---

## Getting started

Run this minimal example to verify your client setup:

```java
import io.kestra.sdk.internal.*;
import io.kestra.sdk.internal.auth.*;
import io.kestra.sdk.model.*;
import io.kestra.sdk.api.AiApi;

public class AiApiExample {

    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("http://localhost");
        
        AiApi apiInstance = new AiApi(defaultClient);
        String tenant = "tenant_example"; // Tenant identifier
        FlowGenerationPrompt flowGenerationPrompt = new FlowGenerationPrompt(); // Prompt and context for flow generation
        
        try {
            String result = apiInstance.generateFlow(tenant, flowGenerationPrompt);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling AiApi#generateFlow");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

::alert{type="info"}
**Notes:**  
- Set `setBasePath` to your Kestra API endpoint (for example, `http://localhost:8080`).  
- Configure authentication as required by your environment (basic or bearer).  
- Ensure your Kestra server is running before executing the example.
::

---

## Create a flow

Create a flow using the [`createFlow` model](https://github.com/kestra-io/client-sdk/blob/main/java-sdk/docs/FlowsApi.md#createFlow). The snippet below shows both **basic** and **bearer** auth examples; use whichever applies to your environment.

```java
// Import classes:
import io.kestra.sdk.internal.ApiClient;
import io.kestra.sdk.internal.ApiException;
import io.kestra.sdk.internal.Configuration;
import io.kestra.sdk.internal.auth.*;
import io.kestra.sdk.internal.models.*;
import io.kestra.sdk.api.FlowsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("http://localhost");
        
        // Configure HTTP basic authorization: basicAuth
        HttpBasicAuth basicAuth = (HttpBasicAuth) defaultClient.getAuthentication("basicAuth");
        basicAuth.setUsername("YOUR USERNAME");
        basicAuth.setPassword("YOUR PASSWORD");

        // Configure HTTP bearer authorization: bearerAuth
        HttpBearerAuth bearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("bearerAuth");
        bearerAuth.setBearerToken("BEARER TOKEN");

        FlowsApi apiInstance = new FlowsApi(defaultClient);
        String tenant = "tenant_example"; // String | 
        String body = "body_example"; // String | The flow source code
        try {
            FlowWithSource result = apiInstance.createFlow(tenant, body);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling FlowsApi#createFlow");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

::alert{type="info"}
**Important:**  
- `body` must be **valid YAML** for a Kestra flow. Invalid YAML or missing required fields will result in a `4xx` error.  
- Set the correct `tenant` for multi-tenant deployments; cross-tenant requests are rejected.  
- The response (`FlowWithSource`) includes the created flow’s metadata and its source.
::

---

## Execute a flow

Execute a flow using the [`createExecution` model](https://github.com/kestra-io/client-sdk/blob/main/java-sdk/docs/ExecutionsApi.md#createExecution). Customize parameters to control scheduling, labels, and blocking behavior.

```java
// Import classes:
import io.kestra.sdk.internal.ApiClient;
import io.kestra.sdk.internal.ApiException;
import io.kestra.sdk.internal.Configuration;
import io.kestra.sdk.internal.auth.*;
import io.kestra.sdk.internal.models.*;
import io.kestra.sdk.api.ExecutionsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("http://localhost");
        
        // Configure HTTP basic authorization: basicAuth
        HttpBasicAuth basicAuth = (HttpBasicAuth) defaultClient.getAuthentication("basicAuth");
        basicAuth.setUsername("YOUR USERNAME");
        basicAuth.setPassword("YOUR PASSWORD");

        // Configure HTTP bearer authorization: bearerAuth
        HttpBearerAuth bearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("bearerAuth");
        bearerAuth.setBearerToken("BEARER TOKEN");

        ExecutionsApi apiInstance = new ExecutionsApi(defaultClient);
        String namespace = "namespace_example"; // String | The flow namespace
        String id = "id_example"; // String | The flow id
        Boolean wait = false; // Boolean | If the server will wait the end of the execution
        String tenant = "tenant_example"; // String | 
        List<String> labels = Arrays.asList(); // List<String> | The labels as a list of 'key:value'
        Integer revision = 56; // Integer | The flow revision or latest if null
        OffsetDateTime scheduleDate = OffsetDateTime.now(); // OffsetDateTime | Schedule the flow on a specific date
        String breakpoints = "breakpoints_example"; // String | Set a list of breakpoints at specific tasks 'id.value', separated by a coma.
        ExecutionKind kind = ExecutionKind.fromValue("NORMAL"); // ExecutionKind | Specific execution kind
        try {
            List<ExecutionControllerExecutionResponse> result = apiInstance.createExecution(namespace, id, wait, tenant, labels, revision, scheduleDate, breakpoints, kind);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling ExecutionsApi#createExecution");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

::alert{type="info"}
**Notes:**  
- `wait=true` makes the call block until the execution finishes; keep it `false` for fire‑and‑forget.  
- Use `labels` (e.g., `team:platform`) to tag executions for search and observability.  
- `scheduleDate` submits the run for a future time; ensure delayed executions are enabled on your Kestra instance.  
- `breakpoints` pause at specific task IDs for step‑through debugging.  
- The response includes execution identifiers and statuses you can poll or stream via the API.
::

---

## Kestra plugin

The [Kestra plugin](/plugins/plugin-kestra) is built with the Java SDK. It provides tasks to interact with [flows](/plugins/plugin-kestra/kestra-flows), [executions](/plugins/plugin-kestra/kestra-executions), and [namespaces](/plugins/plugin-kestra/kestra-namespaces), and can also operate on Kestra metadata (for example, listing all flows or exporting definitions). Watch the overview below.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/RkVugo8wD80?si=6sPClrNQ1z3fehsd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

### Example flow

Use this example to list all namespaces and their flows, then log the output.

```yaml
id: kestra_plugin
namespace: demo
tasks:
  - id: list_namespaces
    type: io.kestra.plugin.kestra.namespaces.List
  - id: loop
    type: io.kestra.plugin.core.flow.ForEach
    values: "{{ outputs.list_namespaces.namespaces }}"
    tasks:
      - id: list_flows
        type: io.kestra.plugin.kestra.flows.List
        namespace: "{{ taskrun.value }}"
  - id: log_output
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.list_flows | jq('[.[] .flows[] | {namespace: .namespace, id: .id}]') | first }}"
pluginDefaults:
  - type: io.kestra.plugin.kestra
    values:
      kestraUrl: http://host.docker.internal:8080
      auth:
        username: admin@kestra.io # pass your Kestra username as secret or KV pair
        password: Admin1234 # pass your Kestra password as secret or KV pair
```
