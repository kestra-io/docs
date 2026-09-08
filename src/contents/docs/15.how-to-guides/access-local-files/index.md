---
title: "Access Local Files in Kestra: Bind Mounts Guide"
h1: Read and Process Local Machine Files Using Bind Mounts
icon: /src/contents/docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Scripting
  - Integrations
description: Access files stored on your local machine within Kestra workflows using bind mounts, and batch-upload files to the local filesystem using the local.Uploads task.
---

Access locally stored files on your machine inside Kestra workflows.

In Kestra, you can access files stored on your local machine from within your flows.
This is useful when you have a directory of files to process or scripts to execute without needing to copy them into Kestra.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/aWvUtbu8FAo?si=KTF7V7PrcjR_fBuY" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Setting up Kestra with Docker

If you're running Kestra with [Docker](../../02.installation/02.docker/index.md), you’ll need to create a bind mount to a local directory on your machine so that Kestra can access those files inside the container.

In your [Docker Compose](../../02.installation/03.docker-compose/index.md) file, add the absolute path of the local directory and define its mount point inside the container.

In this example, the local path `/Users/username/Documents/files` is mounted to `/files` inside the container using `- /Users/username/Documents/files:/files`.

Add this under the `volumes` section of your Docker Compose file:

```yaml
...
  kestra:
    image: kestra/kestra:latest
    pull_policy: always
    user: "root"
    command: server standalone
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
      - /Users/username/Documents/files:/files
...
```

You can now access any files or directories within `/Users/username/Documents/files` from inside Kestra under the `/files` path.

## Accessing files inside Script tasks

By default, a Script task runs inside a [Docker Task Runner](../../task-runners/04.types/02.docker-task-runner/index.md).
To access local files, change the Task Runner type to [Process](../../task-runners/04.types/01.process-task-runner/index.md), so it runs as a subprocess on your Kestra instance:

```yaml
id: process
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - cat /files/myfile.txt
```

## Batch-uploading files with `local.Uploads`

[`io.kestra.plugin.fs.local.Uploads`](/plugins/plugin-fs/local/io.kestra.plugin.fs.local.uploads) writes multiple Kestra internal storage files to a directory on the local filesystem in a single task. It mirrors the `Uploads` task available on the FTP, FTPS, SFTP, and SMB backends.

### Configure allowed paths

Both [`local.Upload`](/plugins/plugin-fs/local/io.kestra.plugin.fs.local.upload) (single file) and `local.Uploads` (batch) require the destination directory to be listed in the plugin's `allowed-paths` configuration. Add the following to your `kestra.yml`:

```yaml
kestra:
  plugins:
    configurations:
      - type: io.kestra.plugin.fs.local.Uploads
        values:
          allowed-paths:
            - /data/uploads
      - type: io.kestra.plugin.fs.local.Upload
        values:
          allowed-paths:
            - /data/uploads
```

Without this, any write to `/data/uploads` is rejected with a `SecurityException` even if the path is bind-mounted into the container.

### Upload a list of files

Pass a list of Kestra internal storage URIs to `from`. Each file is written to the `to` directory using its original filename.

The flow below runs a data ingestion job that produces run logs and SQL migration scripts, then archives the logs to a local directory:

```yaml
id: archive_pipeline_logs
namespace: company.team

tasks:
  - id: run_pipeline
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    outputFiles:
      - "*.log"
      - "*.sql"
    commands:
      - echo "ingested 1024 rows" > ingest.log
      - echo "0 errors"           > errors.log
      - echo "ALTER TABLE orders ADD COLUMN status TEXT;" > schema.sql
      - echo "INSERT INTO orders VALUES (1, 'pending');" > seed.sql

  - id: upload_logs
    type: io.kestra.plugin.fs.local.Uploads
    from:
      - "{{ outputs.run_pipeline.outputFiles['ingest.log'] }}"
      - "{{ outputs.run_pipeline.outputFiles['errors.log'] }}"
    to: /data/uploads/logs
```

### Upload with custom destination filenames

To rename files at the destination, pass a map of `destinationFilename: sourceURI` pairs instead of a list. This is useful for versioning — for example, tagging migration scripts with a version prefix before archiving them.

In the flow above, replace the `upload_logs` task with:

```yaml
  - id: upload_migrations
    type: io.kestra.plugin.fs.local.Uploads
    from:
      v1_schema.sql: "{{ outputs.run_pipeline.outputFiles['schema.sql'] }}"
      v1_seed.sql:   "{{ outputs.run_pipeline.outputFiles['seed.sql'] }}"
    to: /data/uploads/migrations
```

### Filter by regular expression

Use `regExp` to upload only files whose internal storage URI matches a pattern. Files that do not match are skipped.

When a task produces a mixed set of outputs, `regExp` lets you route file types to separate destinations without splitting the upstream task. In the flow above, replace the `upload_logs` task with:

```yaml
  - id: upload_sql_only
    type: io.kestra.plugin.fs.local.Uploads
    from:
      - "{{ outputs.run_pipeline.outputFiles['ingest.log'] }}"
      - "{{ outputs.run_pipeline.outputFiles['errors.log'] }}"
      - "{{ outputs.run_pipeline.outputFiles['schema.sql'] }}"
      - "{{ outputs.run_pipeline.outputFiles['seed.sql'] }}"
    regExp: ".*\\.sql$"
    to: /data/uploads/migrations
```

### Additional properties

| Property | Default | Description |
|---|---|---|
| `maxFiles` | `25` | Upper bound on how many files are written. Excess files are dropped with a warning. |
| `overwrite` | `true` | When `false`, the task fails if a destination file already exists. |
