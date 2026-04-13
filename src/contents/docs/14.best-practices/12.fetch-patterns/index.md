---
title: Choose the Right Fetch Pattern in Kestra
sidebarTitle: Fetch Patterns
icon: /src/contents/docs/icons/best-practices.svg
description: Learn when to use Download, HTTP Request, or script-based fetching in Kestra, and how to choose the right pattern for files, APIs, and custom integrations.
---

Choose the simplest fetch pattern that matches the shape, size, and the amount of control you need.

## Decision guide

Use `Download` when:

- You need to retrieve a file over HTTP or HTTPS.
- The result is naturally a file, such as CSV, JSON, ZIP, or a binary artifact.
- The result is a large payload.
- You want the response body streamed directly to Kestra internal storage.
- Downstream tasks should consume a file URI rather than an in-memory response body.

Use `Request` when:

- You need to call an HTTP API and inspect the response directly.
- You need to work with status codes, headers, form data, JSON payloads, or authentication options.
- The response is small enough to treat as task output, less than 10 MB.
- You are orchestrating an API call, not implementing a full client.

Use a script task when:

- You need custom pagination, signing, retries, throttling, or SDK-specific logic.
- You need to combine multiple requests before producing one output.
- The integration logic is complex enough that inline HTTP task configuration becomes harder to maintain than code.
- You want to write a file after custom processing and pass that file to downstream tasks.

:::alert{type="info"}
Prefer built-in tasks first. Use scripts when you genuinely need custom fetching logic, not just because HTTP can also be called from Python or Shell.
:::

## Start with dedicated plugins

If Kestra already provides a plugin for the system you want to integrate with, prefer that plugin over generic HTTP tasks or scripts.

Dedicated plugins are usually the best choice because they:

- model the external system more clearly
- reduce custom request construction and parsing
- make flows easier to read and maintain
- often provide better task outputs and task-specific validation

Use `Request` or script-based fetching when:

- no dedicated plugin exists
- the plugin does not yet support the endpoint or behavior you need
- you need temporary or highly custom integration logic

If a dedicated plugin exists but does not meet your needs, open a [GitHub issue](https://github.com/kestra-io) on that plugin repository rather than silently replacing it with long-term custom code. That helps improve the plugin for the next user facing the same limitation.

## Quick rule of thumb

- If you are fetching a file, start with `Download`.
- If you are calling an API endpoint, start with `Request`.
- If you need custom client behavior, move to a script task.

## Comparison table

| If your goal is... | Prefer | Why |
| --- | --- | --- |
| Download a file and store it for downstream tasks | [`Download`](/plugins/core/http/io.kestra.plugin.core.http.download) | It streams the response body directly to internal storage and returns a file URI |
| Call an API and inspect status, headers, or body | [`Request`](/plugins/core/http/io.kestra.plugin.core.http.request) | It exposes structured HTTP outputs such as `code`, `headers`, and `body` |
| Implement custom pagination, retries, signing, or SDK logic | A script task from [`plugin-scripts`](/docs/scripts) | It gives you full code control and can still emit files or structured outputs |

## Use `Download` for file-oriented retrieval

`Download` is the best default when the remote resource should be treated as a file.

This task is implemented in Kestra's core to stream the response body directly to Kestra internal storage and return a `uri`, `code`, `headers`, and `length`. That makes it a good fit for file ingestion pipelines.

Best practice:

- Use `Download` when the next task expects a file URI.
- Prefer it over `Request` for large payloads or binary files.
- Let downstream conversion or processing tasks read the file from internal storage.

### Example: download a CSV file and convert it

```yaml
id: fetch_with_download
namespace: company.team

tasks:
  - id: download_orders
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: csv_to_ion
    type: io.kestra.plugin.serdes.csv.CsvToIon
    from: "{{ outputs.download_orders.uri }}"

  - id: log_download_status
    type: io.kestra.plugin.core.log.Log
    message: "Downloaded {{ outputs.download_orders.length }} bytes with status {{ outputs.download_orders.code }}"
```

Use this pattern when the remote system is serving a file and your workflow should continue from a persisted file URI.

## Use `Request` for API-oriented retrieval

`Request` is the right fit when you need HTTP semantics, not just file retrieval.

This task is implemented in Kestra's core as a generic HTTP client. It is designed to render URLs, headers, request bodies, form data, and auth options, then expose structured outputs such as response code, headers, and body.

Best practice:

- Use `Request` for JSON APIs, form posts, or authenticated HTTP endpoints.
- Keep response bodies small enough to work with as task output.
- Prefer dedicated plugins when one exists for the external system.
- Prefer `Download` instead when the response is really a file or a large payload.

### Example: call an API and use the JSON response

```yaml
id: fetch_with_request
namespace: company.team

tasks:
  - id: api
    type: io.kestra.plugin.core.http.Request
    uri: https://dummyjson.com/products
    method: GET

  - id: log_status
    type: io.kestra.plugin.core.log.Log
    message: "API status: {{ outputs.api.code }}"

  - id: extract_first_product
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.api.body | jq('.products[0].title') }}"
```

Use this pattern when the API response itself is the thing you want to orchestrate around.

## Use script-based fetching for custom integration logic

[Script tasks](../../16.scripts/index.mdx) are the right choice when the fetch logic starts to look like application code.

This is especially true for:

- multi-step authentication
- cursor-based or token-based pagination
- API-specific retry or backoff behavior
- combining multiple responses into one normalized output

Best practice:

- Keep orchestration in YAML and only move the integration-specific logic into code.
- Emit files with `outputFiles` when the result should be persisted and reused.
- Use explicit dependencies rather than assuming packages are already installed.
- Do not hide simple one-request logic inside a script when `Request` is enough.

### Example: fetch paginated API data with Python and emit one file

```yaml
id: fetch_with_script
namespace: company.team

tasks:
  - id: fetch_all_products
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:3.13-slim
    dependencies:
      - requests
    outputFiles:
      - all_products.json
    script: |
      import json
      import requests

      all_products = []
      limit = 10
      skip = 0

      while True:
          response = requests.get(
              "https://dummyjson.com/products",
              params={"limit": limit, "skip": skip},
              timeout=30
          )
          response.raise_for_status()
          payload = response.json()
          products = payload.get("products", [])

          if not products:
              break

          all_products.extend(products)
          skip += limit

          if skip >= payload.get("total", 0):
              break

      with open("all_products.json", "w") as f:
          json.dump(all_products, f)

  - id: preview_output
    type: io.kestra.plugin.core.log.Log
    message: "{{ read(outputs.fetch_all_products.outputFiles['all_products.json']) }}"
```

Use this pattern when your fetch logic needs real code, but the workflow should still continue from a persisted file in Kestra.

## `Download` vs `Request`

Choose between them based on the shape of the response:

- If the response should be treated as a file, use `Download`.
- If the response should be treated as HTTP output data, use `Request`.

For example:

- fetching `orders.csv` for downstream conversion is a `Download` use case
- calling `/products` and branching on the JSON payload is a `Request` use case

## `Request` vs script-based fetching

Choose between them based on how much client logic you need.

Use `Request` when:

- one request is enough
- auth and headers are straightforward
- the response can be handled directly with outputs and expressions

Use a script when:

- you need loops, pagination, or multiple dependent requests
- the external API requires custom signing or SDK usage
- you want to normalize or aggregate responses before downstream tasks

Rule of thumb:

- `Request` is for orchestrating API calls.
- A script is for implementing API client behavior.

## Anti-patterns

Avoid these patterns:

- using a Python or Shell script just to download one file from a public URL
- using `Request` for very large file downloads that should go straight to storage
- storing large API payloads in task outputs when a file-based pattern would scale better
- hiding complex integration logic in a long inline script without clear output artifacts
- skipping dedicated plugins when they already solve the target integration cleanly

## Recommended patterns

### Pattern 1: File ingestion

Use `Download`, then pass the returned URI to a conversion or processing task.

### Pattern 2: API orchestration

Use `Request`, then branch, transform, or log based on `code`, `headers`, or `body`.

### Pattern 3: Custom fetch client

Use a script task, then persist the result with `outputFiles` so downstream tasks still operate on Kestra-managed files.

## Summary

- Start with built-in tasks.
- Use `Download` for file retrieval.
- Use `Request` for API calls and structured HTTP responses.
- Use script-based fetching only when you need custom client logic that built-in tasks do not provide.

For task-level details, see [`Download`](/plugins/core/http/io.kestra.plugin.core.http.download), [`Request`](/plugins/core/http/io.kestra.plugin.core.http.request), and the [`plugin-scripts` documentation](/docs/scripts).
