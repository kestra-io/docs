---
title: Access Files on your Local Machine in Kestra
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Scripting
  - Integrations
---

Access locally stored files on your machine inside Kestra workflows.

In Kestra, you can access files stored on your local machine from within your flows.  
This is useful when you have a directory of files to process or scripts to execute without needing to copy them into Kestra.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/aWvUtbu8FAo?si=KTF7V7PrcjR_fBuY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Setting up Kestra with Docker

If you're running Kestra with [Docker](../02.installation/02.docker.md), you’ll need to create a bind mount to a local directory on your machine so that Kestra can access those files inside the container.

In your [Docker Compose](../02.installation/03.docker-compose.md) file, add the absolute path of the local directory and define its mount point inside the container.  

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

By default, a Script task runs inside a [Docker Task Runner](../task-runners/04.types/02.docker-task-runner.md).  
To access local files, change the Task Runner type to [Process](../task-runners/04.types/01.process-task-runner.md), so it runs as a subprocess on your Kestra instance:

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
