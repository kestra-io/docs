---
title: Flow and Namespace File Server CLI Commands Removed
h1: Replace Removed kestra flow Commands with kestractl
sidebarTitle: Server CLI Flow Commands Removed
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: Kestra 2.0 removes the server CLI commands that validated and deployed flows and namespace files, along with the flow include helpers. Use kestractl in CI/CD pipelines instead.
---

Kestra 2.0 removes the server CLI commands that validated, created, and updated flows and namespace files through the Kestra API. Use [`kestractl`](../../../kestra-cli/kestractl/index.md#installation), the command-line client for the Kestra API, instead.

:::alert{type="warning"}
CI/CD pipelines that run these commands, for example `/app/kestra flow validate` or `kestra flow namespace update` in the `kestra/kestra` image, fail on 2.0 because the commands no longer exist.
:::

## Replacement commands

| Removed command | Replacement |
| --- | --- |
| `kestra flow validate <path>` | `kestractl flows validate <path>` |
| `kestra flow create <file>` | `kestractl flows deploy <file>` |
| `kestra flow update <file> <namespace> <id>` | `kestractl flows deploy <file> --override` |
| `kestra flow updates <directory>` | `kestractl flows deploy <directory> --override` |
| `kestra flow namespace update <namespace> <directory>` | `kestractl flows deploy <directory> --namespace <namespace> --override` |
| `kestra namespace files update <namespace> <directory> <path>` | `kestractl nsfiles upload <namespace> <directory> <path> --no-root --override` |
| `kestra flow expand <file>` | None. See [Include helpers](#include-helpers). |

`kestractl flows deploy` never deletes flows. If a pipeline relied on the old commands deleting flows that were missing from the directory, use `kestractl flows namespace-sync` with `--delete`.

The server CLI commands that run Kestra itself, such as `kestra server standalone`, `kestra flow test`, and `kestra migrate`, are unchanged. See [Kestra Server CLI](../../../kestra-cli/kestra-server/index.md).

## Migration steps

1. Find every pipeline and script that calls `kestra flow` or `kestra namespace files`, for example `/app/kestra flow ...` in a `kestra/kestra` container.
2. Replace each command with its `kestractl` equivalent from the table above.
3. Replace the `--server`, `--api-token`, `--user`, and `--tenant` options with `KESTRACTL_HOST`, `KESTRACTL_TOKEN`, `KESTRACTL_USERNAME` and `KESTRACTL_PASSWORD`, and `KESTRACTL_TENANT` environment variables. In CI, store the token and password as masked secrets.
4. Run the pipeline in the `kestra/kestractl` image instead of `kestra/kestra`.

**Before**

```bash
/app/kestra flow validate flows/ --server https://kestra.example.com --api-token $KESTRA_API_TOKEN
/app/kestra flow namespace update prod flows/ --server https://kestra.example.com --api-token $KESTRA_API_TOKEN
```

**After**

```bash
export KESTRACTL_HOST=https://kestra.example.com
export KESTRACTL_TOKEN=$KESTRA_API_TOKEN
kestractl flows validate flows/
kestractl flows deploy flows/ --namespace prod --override --fail-fast
```

For complete pipeline examples, see [GitLab CI](../../../version-control-cicd/cicd/02.gitlab/index.md) and [Bitbucket Pipes](../../../version-control-cicd/cicd/06.bitbucket-pipes/index.md).

## Include helpers

The `[[> file]]` include helper, which inserted the content of a local file into a flow when the CLI expanded it before upload, is removed along with `kestra flow expand` and `kestra flow validate --local`. `kestractl` deploys flow files as they are, so a flow that still contains `[[> file]]` is deployed with that text unchanged.

To keep long scripts or SQL out of the flow YAML, store them as [namespace files](../../../06.concepts/02.namespace-files/index.md) and reference them at runtime:

- Read a file into a property with the [`read()`](../../../expressions/04.functions/02.data-access/index.mdx#read) function, for example `sql: "{{ read('queries/report.sql') }}"`.
- For script tasks, enable `namespaceFiles` and run the file directly, for example `python scripts/etl.py`.

Upload the files from CI with `kestractl nsfiles upload`. The namespace must already exist; create it first with `kestractl namespaces create` if needed.
