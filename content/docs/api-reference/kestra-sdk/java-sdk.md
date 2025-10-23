---
title: Kestra Java SDK
icon: /docs/icons/api.svg
release: 1.0.0
---

## Overview

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
