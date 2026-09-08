---
title: "KV Store in Kestra: Persist Shared State"
h1: Build Stateful Workflows with the KV Store
description: Build stateful workflows with the Kestra KV Store. Persist and share key-value pairs across flows and executions for dynamic configuration and shared state.
sidebarTitle: Key Value (KV) Store
icon: /src/contents/docs/icons/concepts.svg
version: ">= 0.18.0"
docId: kv
---

The KV Store lets you persist and share key-value data across executions and flows — beyond what task outputs alone can carry.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/CNv_z-tnwnQ?si=69b0O0fxKESDnQs7" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

Kestra's execution model is stateless by design — task runs are isolated and data moves between tasks via explicit outputs. The KV Store extends this with a namespace-scoped key-value layer for cases where you need to persist state across executions or share values between flows. Values are stored in Kestra's internal storage (your private cloud bucket); the database holds only metadata such as the key, TTL, and timestamps.

## Keys and values

Keys are arbitrary strings containing uppercase or lowercase letters and standard ASCII characters.

Values are stored as ION files in Kestra's internal storage and are strongly typed. Supported types:

- string
- number
- boolean
- datetime
- date
- duration
- JSON

Each KV pair can have a Time to Live (TTL) to automatically expire data that is only relevant for a limited period.

## Namespace binding

KV pairs are scoped to a namespace. Access them under **Namespaces → [namespace] → KV Store** or under **Tenant → KV Store** in the sidebar for a tenant-wide view.

You can create and read KV pairs across namespaces as long as those namespaces are [allowed](../../07.enterprise/02.governance/07.namespace-management/index.md#allowed-namespaces).

## Managing KV pairs

KV pairs can be managed from the UI, in flows via tasks, through the REST API, via Terraform, or from the command line:

1. **Kestra UI**: create, edit, and delete KV pairs directly (see [Namespace binding](#namespace-binding) for navigation paths).
2. **Tasks in a flow**: use `io.kestra.plugin.core.kv.Set`, `Get`, and `Delete` tasks.
3. **REST API**: create, read, and delete KV pairs via the HTTP API.
4. **Terraform**: use the `kestra_kv` resource.
5. **Pebble function**: use `kv()` to retrieve a value inline in a flow expression.
6. **GitHub Actions**: manage KV pairs in your CI/CD pipeline.
7. **kestractl**: use `kestractl kv` to list, set, get, and delete from the command line. See the [kestractl docs](../../kestra-cli/kestractl/index.md) for setup.

### Create a KV pair from the UI

Open the **KV Store** tab and click **New Key-Value**. Enter a key name, select a type (string, number, boolean, datetime, date, duration, or JSON), and enter the value. Optionally set a TTL — choose a standard duration from the dropdown or select **Custom duration** to enter an ISO 8601 duration string. Click **Save**.

### Update, delete, and copy KV pairs

Edit, delete, or copy any KV pair using the action buttons on the right. The copy option copies the [Pebble expression for the KV pair](#read-kv-pairs-with-pebble) (`{{ kv('YOUR_KEY') }}`) ready to paste into a flow.

## KV tasks in flows

### Create a KV pair with the `Set` task

Use `io.kestra.plugin.core.kv.Set` to create or update a KV pair from a flow:

```yaml
id: add_kv_pair
namespace: company.team

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: set_kv
    type: io.kestra.plugin.core.kv.Set
    key: my_key
    value: "{{ outputs.download.uri }}"
    namespace: company.team # the current namespace of the flow is used by default
    overwrite: true # whether to overwrite or fail if a value for that key already exists; default true
    ttl: P30D # optional Time to Live (TTL) for the KV pair

  - id: set_simple_kv
    type: io.kestra.plugin.core.kv.Set
    key: simple_string
    value: hello from Kestra

  - id: set_json_kv
    type: io.kestra.plugin.core.kv.Set
    key: json_kv
    value: |
      {
        "author": "Rick Astley",
        "song": "Never Gonna Give You Up"
      }

  - id: get_kv
    type: io.kestra.plugin.core.output.OutputValues
    values:
      my_key: "{{ kv('my_key') }}"
      simple_string: "{{ kv('simple_string') }}"
      favorite_song: "{{ fromJson(kv('json_kv')).song }}"
```

Set `overwrite: false` to fail instead of silently replacing an existing value. The default is `true`.

### Read KV pairs with Pebble

Use `{{ kv('YOUR_KEY') }}` to retrieve a value inline. The full signature is:

```
{{ kv(key='your_key_name', namespace='your_namespace_name', errorOnMissing=false) }}
```

When reading from the same namespace as the flow, the namespace argument is optional:

```yaml
id: read_kv_pair
namespace: company.team
tasks:
  - id: log_key
    type: io.kestra.plugin.core.log.Log
    message: "{{ kv('my_key') }}"
```

To read from another namespace, pass it as the second argument:

```yaml
id: read_kv_pair_from_another_namespace
namespace: company.team
tasks:
  - id: log_key_from_another_namespace
    type: io.kestra.plugin.core.log.Log
    message: "{{ kv('my_key', 'kestra.engineering.myproject') }}"
```

By default, referencing a missing key causes the task to fail. Set `errorOnMissing=false` to return `null` instead:

```yaml
id: read_non_existing_kv_pair
namespace: company.team
tasks:
  - id: log_key_from_another_namespace
    type: io.kestra.plugin.core.debug.Return
    format: "{{ kv('non_existing_key', errorOnMissing=false) }}"
```

### Read KV pairs with the `Get` task

The `Get` task produces a `value` output you can reference in downstream tasks — useful when you need to pass the same KV value to multiple steps:

```yaml
id: get_kv_pair
namespace: company.team

tasks:
  - id: get
    type: io.kestra.plugin.core.kv.Get
    key: my_key
    namespace: company.team
    errorOnMissing: false

  - id: log_key_get
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.get.value }}"
```

### Read and parse JSON-type values from KV pairs

To parse JSON values in Kestra's templated expressions, wrap the `kv()` call in the `fromJson()` function: `"{{ fromJson(kv('your_json_key')).json_property }}"`.

This example sets a JSON KV pair and reads individual fields using `fromJson()`:
```yaml
id: kv_json_flow
namespace: company.team

tasks:
  - id: set_json_kv
    type: io.kestra.plugin.core.kv.Set
    key: favorite_song
    value: |
      {
        "author": "Rick Astley",
        "song": "Never Gonna Give You Up",
        "album": {
          "name": "Whenever You Need Somebody",
          "release_date": "1987-11-16"
        }
      }

  - id: parse_json_kv
    type: io.kestra.plugin.core.log.Log
    message:
      - "Author: {{ fromJson(kv('favorite_song')).author }}"
      - "Song: {{ fromJson(kv('favorite_song')).song }}"
      - "Album name: {{ fromJson(kv('favorite_song')).album.name }}"
      - "Album release date: {{ fromJson(kv('favorite_song')).album.release_date }}"

  - id: get
    type: io.kestra.plugin.core.kv.Get
    key: favorite_song

  - id: parse_json_from_kv
    type: io.kestra.plugin.core.log.Log
    message: "Album name: {{ fromJson(outputs.get.value).album.name }}"
```


### Read keys by prefix with the `GetKeys` task

Search for keys matching a prefix with `GetKeys`:

```yaml
id: get_keys_by_prefix
namespace: company.team

tasks:
  - id: get
    type: io.kestra.plugin.core.kv.GetKeys
    prefix: "test_"
    namespace: company.team

  - id: log_key_prefix
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.get.keys }}"
```

The output is a list of matching keys, or an empty list if none are found.

### Delete a KV pair with the `Delete` task

`Delete` produces a boolean `deleted` output confirming whether the key existed and was removed:

```yaml
id: delete_kv_pair
namespace: company.team

tasks:
  - id: kv
    type: io.kestra.plugin.core.kv.Delete
    key: my_key
    namespace: company.team
    errorOnMissing: false

  - id: check_if_deleted
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.kv.deleted }}"
```

---

## REST API

### Create a KV pair

Use a `PUT` request to set a KV pair:

```bash
curl -X PUT -H "Content-Type: application/json" http://localhost:8080/api/v1/main/namespaces/company.team/kv/my_key -d '"Hello World"'
```

The API returns no response body on success.

### Read all keys in a namespace

```bash
curl -G "http://localhost:8080/api/v1/main/kv" \
  --data-urlencode "filters[namespace][EQUALS]=company.team" \
  -H "Authorization: Bearer <API-TOKEN>"
```

The response is a JSON array of keys with their creation and update timestamps:

```json
[
  {"key":"my_key","creationDate":"2024-07-27T06:10:33.422Z","updateDate":"2024-07-27T06:11:08.911Z"},
  {"key":"test_key","creationDate":"2024-07-27T04:37:18.196Z","updateDate":"2024-07-27T04:37:18.196Z"}
]
```

:::alert{type="info"}
Your Kestra instance exposes an interactive API reference at `https://<your-kestra-host>/api` listing all available endpoints.
:::

### Delete a KV pair

```bash
curl -X DELETE -H "Content-Type: application/json" http://localhost:8080/api/v1/main/namespaces/company.team/kv/my_key
```

Returns `true` if the key existed and was deleted, `false` if it did not exist.

---

## Terraform

Use the `kestra_kv` resource to create or update a KV pair:

```hcl
resource "kestra_kv" "my_key" {
  namespace = "company.team"
  key       = "my_key"
  value     = "Hello World"
  type      = "STRING"
}
```

Use the `kestra_kv` data source to read a KV pair:

```hcl
data "kestra_kv" "new" {
  namespace = "company.team"
  key       = "my_key"
}
```

Run `terraform apply` to create, update, or delete KV pairs from your Terraform state.
