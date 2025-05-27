---
title: Local Flow Synchronization
icon: /docs/icons/admin.svg
stage: Getting Started
topics:
  - Integrations
  - Kestra Concepts
---

Sync Flows from a local directory.

How to synchronize flows from a local directory on a local development instance.

<div class="video-container">
  <iframe  src="https://www.youtube.com/embed/C_aLyXBysN8?si=mIWitG5TMJFRyknB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Configure your instance

::alert{type="warning"}
This feature is only for local development, that is why you can not connect to a distant Kestra instance.
::

When developing on a local Kestra instance, it can be more convenient to have your flows in a local directory, maybe synchronize with a GitHub repository on your local machine, and have Kestra automatically load them.

Below is the minimal configuration to enable local flow synchronization:

```yaml
micronaut:
  io:
    watch:
      enabled: true
      paths:
        - /path/to/your/flows
```

Multiple paths can be provided, and nested files will also be watched.
Files have to end with `.yml` or `.yaml` to be considered as a flow. And only valid flows will be loaded, invalid flows will be ignored.

File created locally should use `<namespace>.<flow_id>.yml` or `<namespace>_<flow_id>.yml` syntax to be loaded properly.

Flow created inside the UI will be created at the root of the first path supplied in the configuration.


::alert{type="info"}
If you are using the docker-compose installation, you will need to mount a volume so Kestra container can access your local folder.

```yaml
    volumes:
      # ... other volumes
      - ./local_folder:/docker_folder
    environment:
      KESTRA_CONFIGURATION: |
        micronaut:
          io:
            watch:
              enabled: true
              paths:
                - /docker_folder
```
::

## Details

At startup, every file in the watched directory will be loaded into the database. Then every flow not existing in the watched directory will be created in the first path supplied in the configuration.

When a file is created, updated, or deleted in the watched directory, Kestra will automatically load the flow into the database or remove it if the file is deleted.
If a flow is created, updated or deleted in the UI, the file will be created, updated or deleted in the watched directory.

In the Kestra UI, you cannot change an ID nor a namespace, but in a file you can, in this case, the previous flow will be deleted, and a new one created.
