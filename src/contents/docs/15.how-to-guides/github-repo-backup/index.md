---
title: Test GitHub Repository Backups with Kestra Playground
icon: /src/contents/docs/icons/github.svg
stage: Intermediate
topics:
  - Integrations
  - Version Control
  - Kestra Concepts
---

Clone every repository in the `kestra-io` GitHub organization, zip each repo, and upload the archives to Google Cloud Storage (GCS) for safekeeping.

## Test GitHub Repository Backups with Kestra Playground

---

## Why run this backup?

Organizations often mirror source control data outside GitHub to satisfy compliance, enable disaster recovery drills, or seed analytics and search workloads. This flow collects every repository, produces portable zip artifacts, and stores them in GCS so you have an off-platform copy you can restore or inspect independently of GitHub.

This flow has potentially long running operations, so to optimize testing certain tasks, we use the [Playground](../../09.ui/10.playground/index.md) feature to ensure each component works before a production execution.

---

## Prerequisites

- GitHub personal access token stored as `GITHUB_TOKEN`.
- GCP service account JSON key stored as `GCP_SERVICE_ACCOUNT`.
- A target bucket such as `gs://your_gcs_bucket/kestra-backups/`.
- The [Google Cloud Storage plugin](/plugins/plugin-gcp/gcs/io.kestra.plugin.gcp.gcs.upload) available to your workers.

---

## Flow Definition

```yaml
id: github_repo_backup
namespace: company.team
description: Clones Kestra GitHub repositories and backs them up to Google Cloud Storage.

tasks:
  - id: search_kestra_repos
    type: io.kestra.plugin.github.repositories.Search
    description: Search for all repositories under the 'kestra-io' GitHub organization.
    query: "user:kestra-io"
    oauthToken: "{{ secret('GITHUB_TOKEN') }}"

  - id: for_each_repo
    type: io.kestra.plugin.core.flow.ForEach
    description: Iterate over each found repository.
    values: "{{ outputs.search_kestra_repos.uri | internalStorage.get() | jq('.items[].clone_url') }}"
    tasks:
      - id: working_dir
        type: io.kestra.plugin.core.flow.WorkingDirectory
        description: Create a temporary working directory for cloning and zipping each repository.
        tasks:
          - id: clone_repo
            type: io.kestra.plugin.git.Clone
            description: Clone the current repository from GitHub.
            url: "{{ taskrun.value }}"
            directory: "{{ taskrun.value | split('/') | last | split('.') | first }}"

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

The flow stages data once and reuses it through internal storage to avoid repeated GitHub calls. The search task writes its JSON response to storage, and the ForEach loop reads only the `clone_url` fields, keeping the payload small. Each iteration runs in a fresh working directory so cloned files and archives stay isolated. The zip command emits a predictable filename via `outputFiles`, which the GCS upload consumes directly, reducing chances of path mismatches. Secrets supply tokens to GitHub and GCP at runtime without embedding credentials in the flow definition.

1. `search_kestra_repos` fetches all repositories in the `kestra-io` organization and stores the JSON results in internal storage.
2. `for_each_repo` loops over each `clone_url` extracted via `jq` from the stored JSON.
3. `working_dir` isolates each iteration, keeping cloned data and archives scoped to a temporary folder.
4. `clone_repo` clones the current repository URL.
5. `zip_repo` compresses the cloned repository and exposes the zip file through `outputFiles` so the next task can read it.
6. `upload_to_gcs` uploads each archive to the chosen bucket path using the GCP service account key.

For a smaller dry run, narrow the search query (for example, add `topic:cli`) or wrap the `jq` extraction with a slice such as `jq('.items[:2].clone_url')` to process only a few repositories.

---

## Use Playground to Test Safely

Playground mode helps you validate expensive steps incrementally. Start with the search task to confirm authentication and inspect the JSON before any cloning. When refining the zip or upload steps, slice the list to a single repository so you can replay those tasks without hitting GitHub or GCS repeatedly. Because Playground keeps prior task outputs, you can iterate on shell commands and storage paths while reusing the same search result and clone, keeping feedback fast and low-risk.

Playground mode lets you validate one task at a time without running the whole backup loop. Follow [the Playground guide](../../09.ui/10.playground/index.md) and use this flow as follows:

1. Toggle Playground mode in the editor.
2. Run only `search_kestra_repos` to confirm your GitHub token works and inspect the search output. Below the task fails in the Playground due to a misconfigured secret. You now know before ant attempted executions were made that this must be fixed. Update the secret, run in the Playground again to verify it's correct.
3. Temporarily limit the `values` expression (for example, `jq('.items[:1].clone_url')`) so downstream tasks operate on a single repository while you iterate.
4. Play `zip_repo` and `upload_to_gcs` individually inside Playground; Kestra reuses outputs from previous played tasks, so you avoid recloning every repository.
5. When satisfied, revert any temporary limits and use **Run all tasks** for a full backup execution.

This approach prevents unnecessary GitHub calls and GCS writes while you refine the flow logic.

---

You now have a reusable flow that continuously backs up the `kestra-io` GitHub organization to GCS with secrets-managed authentication and a safe Playground workflow for testing.
