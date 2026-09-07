---
title: Back Up GitHub Repos with Kestra Playground
h1: Test and Automate GitHub Repository Backups in Kestra
description: Automate GitHub repository backups with Kestra. Schedule periodic exports of your repos to cloud storage with built-in error handling and audit logging.
icon: /src/contents/docs/icons/github.svg
stage: Intermediate
topics:
  - Integrations
  - Version Control
  - Kestra Concepts
---

Clone every repository in the `kestra-io` GitHub organization, zip each repo, and upload the archives to Google Cloud Storage (GCS) for safekeeping.

---

## Why run this backup?

Organizations often mirror source control data outside GitHub to satisfy compliance, enable disaster recovery drills, or seed analytics and search workloads. This flow collects every repository, produces portable zip artifacts, and stores them in GCS so you have an off-platform copy you can restore or inspect independently of GitHub.

This flow has potentially long running operations, so to optimize testing certain tasks, we use the [Playground](../../09.ui/10.playground/index.md) feature to ensure each component works before a production execution.

---

## Prerequisites

- GitHub personal access token stored as `GITHUB_TOKEN`.
- GCP service account JSON key stored as `GCP_SERVICE_ACCOUNT`.
- A target bucket such as `gs://your_gcs_bucket/kestra-backups/`.
- The [Google Cloud Storage plugin](/plugins/plugin-gcp/google-cloud-storage-gcs/io.kestra.plugin.gcp.gcs.upload) available to your workers.

---

## Choosing a fetch mode

The `repositories.Search` task exposes a `fetchType` property that controls how search results reach downstream tasks:

| `fetchType` | Output field | Best for |
|---|---|---|
| `FETCH` | `rows` — a list of result objects directly in the task output | Moderate result sets where you want to use Pebble expressions immediately |
| `FETCH_ONE` | `row` — only the first result | Lookups where you expect a single match |
| `STORE` (default) | `uri` — an Ion file written to Kestra internal storage | Large result sets, auditing, or when you need to persist the raw data |
| `NONE` | _(empty)_ | Triggering a side-effect without needing results |

Use `FETCH` when you want to feed results directly into a Loop task with a simple Pebble expression. Use `STORE` when the result set may be large, when you want the raw file persisted in internal storage for inspection or reuse, or when downstream tasks need to read the data multiple times.

---

## Flow Definition — FETCH mode

`fetchType: FETCH` places results directly in `outputs.search_kestra_repos.rows` as a list of objects. The Loop `values` expression reads from that list without any file I/O step.

```yaml
id: github_repo_backup
namespace: company.team
description: Clones Kestra GitHub repositories and backs them up to Google Cloud Storage.

tasks:
  - id: search_kestra_repos
    type: io.kestra.plugin.github.repositories.Search
    description: Search for all repositories under the 'kestra-io' GitHub organization.
    query: "user:kestra-io"
    fetchType: FETCH
    oauthToken: "{{ secret('GITHUB_TOKEN') }}"

  - id: for_each_repo
    type: io.kestra.plugin.core.flow.Loop
    description: Iterate over each found repository.
    values: "{{ outputs.search_kestra_repos.rows | jq('.[].clone_url') }}"
    tasks:
      - id: working_dir
        type: io.kestra.plugin.core.flow.WorkingDirectory
        description: Create a temporary working directory for cloning and zipping each repository.
        tasks:
          - id: clone_repo
            type: io.kestra.plugin.git.Clone
            description: Clone the current repository from GitHub.
            url: "{{ item.value }}"
            directory: "{{ item.value | split('/') | last | split('.') | first }}"

          - id: zip_repo
            type: io.kestra.plugin.scripts.shell.Commands
            description: Zip the cloned repository's contents.
            beforeCommands:
              - apk add zip > /dev/null 2>&1 || true
            commands:
              - |
                REPO_DIR="{{ outputs.clone_repo.directory }}"
                REPO_NAME="{{ REPO_DIR | split('/') | last }}"
                cd "${REPO_DIR}"
                zip -r "../${REPO_NAME}.zip" .
            outputFiles:
              - "{{ outputs.clone_repo.directory | split('/') | last }}.zip"

          - id: upload_to_gcs
            type: io.kestra.plugin.gcp.gcs.Upload
            description: Upload the zipped repository to Google Cloud Storage.
            from: "{{ outputs.zip_repo.outputFiles['' ~ (outputs.clone_repo.directory | split('/') | last) ~ '.zip'] }}"
            to: "gs://your_gcs_bucket/kestra-backups/{{ outputs.clone_repo.directory | split('/') | last }}.zip"
            serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT') }}"
```

---

## Flow Definition — STORE mode

`fetchType: STORE` (the default) writes results to an Ion file in Kestra internal storage and returns a `uri`. Use this variant when the result set is large, when you want to retain the raw file for auditing or reuse across multiple tasks, or when you are integrating with tasks that consume a storage URI directly.

```yaml
id: github_repo_backup
namespace: company.team
description: Clones Kestra GitHub repositories and backs them up to Google Cloud Storage.

tasks:
  - id: search_kestra_repos
    type: io.kestra.plugin.github.repositories.Search
    description: Search for all repositories under the 'kestra-io' GitHub organization.
    query: "user:kestra-io"
    fetchType: STORE
    oauthToken: "{{ secret('GITHUB_TOKEN') }}"

  - id: for_each_repo
    type: io.kestra.plugin.core.flow.Loop
    description: Iterate over each found repository.
    values: "{{ outputs.search_kestra_repos.uri | internalStorage.get() | jq('.[].clone_url') }}"
    tasks:
      - id: working_dir
        type: io.kestra.plugin.core.flow.WorkingDirectory
        description: Create a temporary working directory for cloning and zipping each repository.
        tasks:
          - id: clone_repo
            type: io.kestra.plugin.git.Clone
            description: Clone the current repository from GitHub.
            url: "{{ item.value }}"
            directory: "{{ item.value | split('/') | last | split('.') | first }}"

          - id: zip_repo
            type: io.kestra.plugin.scripts.shell.Commands
            description: Zip the cloned repository's contents.
            beforeCommands:
              - apk add zip > /dev/null 2>&1 || true
            commands:
              - |
                REPO_DIR="{{ outputs.clone_repo.directory }}"
                REPO_NAME="{{ REPO_DIR | split('/') | last }}"
                cd "${REPO_DIR}"
                zip -r "../${REPO_NAME}.zip" .
            outputFiles:
              - "{{ outputs.clone_repo.directory | split('/') | last }}.zip"

          - id: upload_to_gcs
            type: io.kestra.plugin.gcp.gcs.Upload
            description: Upload the zipped repository to Google Cloud Storage.
            from: "{{ outputs.zip_repo.outputFiles['' ~ (outputs.clone_repo.directory | split('/') | last) ~ '.zip'] }}"
            to: "gs://your_gcs_bucket/kestra-backups/{{ outputs.clone_repo.directory | split('/') | last }}.zip"
            serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT') }}"
```

---

## How It Works

Both variants share the same structure. The only difference is how the search results move from the `search_kestra_repos` task to the `for_each_repo` loop.

With `FETCH`, results live in `outputs.search_kestra_repos.rows` as a native list — no file read needed. With `STORE`, results are written to an Ion file and the Loop `values` expression reads the file via `internalStorage.get()` before applying the `jq` filter.

In both cases:

1. `search_kestra_repos` fetches all repositories in the `kestra-io` organization.
2. `for_each_repo` loops over each `clone_url` extracted from the results.
3. `working_dir` isolates each iteration, keeping cloned data and archives scoped to a temporary folder.
4. `clone_repo` clones the current repository URL.
5. `zip_repo` compresses the cloned repository and exposes the zip file through `outputFiles` so the next task can read it.
6. `upload_to_gcs` uploads each archive to the chosen bucket path using the GCP service account key.

Secrets supply tokens to GitHub and GCP at runtime without embedding credentials in the flow definition.

For a smaller dry run, narrow the search query (for example, add `topic:cli`) or slice the list — `jq('.[0:2].clone_url')` with FETCH or `jq('.[0:2].clone_url')` with STORE — to process only a few repositories.

---

## Use Playground to Test Safely

Playground mode helps you validate expensive steps incrementally. Start with the search task to confirm authentication and inspect the results before any cloning. When refining the zip or upload steps, slice the list to a single repository so you can replay those tasks without hitting GitHub or GCS repeatedly. Because Playground keeps prior task outputs, you can iterate on shell commands and storage paths while reusing the same search result and clone, keeping feedback fast and low-risk.

Playground mode lets you validate one task at a time without running the whole backup loop. Follow [the Playground guide](../../09.ui/10.playground/index.md) and use this flow as follows:

1. Toggle Playground mode in the editor.
2. Run only `search_kestra_repos` to confirm your GitHub token works and inspect the search output. In the example below, the task fails in Playground due to a misconfigured secret. This lets you catch the issue before any attempted executions are made. Update the secret, then run it in Playground again to verify that it's correct.
3. Temporarily limit the `values` expression to a single repository while you iterate — with FETCH, use `jq('.[0:1].clone_url')`; with STORE, use `jq('.[0:1].clone_url')` after `internalStorage.get()`.
4. Play `zip_repo` and `upload_to_gcs` individually inside Playground; Kestra reuses outputs from previous played tasks, so you avoid recloning every repository.
5. When satisfied, revert any temporary limits and use **Run all tasks** for a full backup execution.

This approach prevents unnecessary GitHub calls and GCS writes while you refine the flow logic.

---

You now have a reusable flow that continuously backs up the `kestra-io` GitHub organization to GCS with secrets-managed authentication and a safe Playground workflow for testing.
