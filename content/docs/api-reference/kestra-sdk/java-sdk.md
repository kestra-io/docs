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

There are multiple methods to install the Java SDK, depending on your deployment refer to the appropriate option.

### Local installation

To install the API client library in your local Maven repository, run:

```shell
mvn clean install
```

### Remote deployment

To deploy the library to a remote Maven repository, configure the repository settings and run:

```shell
mvn clean deploy
```

For more information, see the [OSSRH Guide](http://central.sonatype.org/pages/ossrh-guide.html).

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

If you prefer to install the JAR manually, first generate it by running:

```shell
mvn clean package
```

Then install the following JARs:

- `target/kestra-api-client-1.0.0.jar`
- `target/lib/*.jar`

## Getting started

After installation, you can test the client by running the following Java example:

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

## Kestra plugin

The [dedicated Kestra plugin](/plugins/plugin-kestra) is developed with the Java SDK. The plugin enables you to interact with [flows](/plugins/plugin-kestra/kestra-flows), [executions](/plugins/plugin-kestra/kestra-executions), and [namespaces](/plugins/plugin-kestra/kestra-namespaces) via tasks and provides tasks to interact with Kestra's own metadata, such as listing all flows in a namespace or exporting flow definitions. To see it in action check out the video below.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/RkVugo8wD80?si=6sPClrNQ1z3fehsd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

### Example flow

To test the Kestra Plugin, use the following example flow that lists all namespaces and their flows, then logs the output.

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
