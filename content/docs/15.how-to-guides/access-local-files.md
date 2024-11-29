---
title: Access Local Files in Kestra
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Scripting
  - Integrations
---

Access locally stored files on your machine.

In Kestra, you can access files stored on your local machine inside of your Flows. 

This can be useful if you have a directory of files you want to process, or code you want to run without having to run them 

## Setting up Kestra with Docker

If you're running Kestra with [Docker](../02.installation/02.docker.md), you'll need to create a bind mount to a local directory on your machine in order to access files inside of Kestra.

Inside of your [Docker Compose](../02.installation/03.docker-compose.md) file, add the absolute path of the directory on your local machine with a name for this location inside of the container. 

In this example, we will add the local path `/Users/username/Documents/files` to bind to `/files` inside of the container using `- /Users/username/Documents/files:/files`

We will put it under `volumes` in our Docker Compose file:
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

Now we can access any files and directories inside of `/Users/username/Documents/files` inside of Kestra in our `/files` directory.

## Access files inside of Script tasks

By default, when you run a Script task, it will run inside of a [Docker Task Runner](../task-runners/04.types/02.docker-task-runner.md). 
To access our local files, we can change the Task Runner type to [Process](../task-runners/04.types/01.process-task-runner.md) so it runs as a subprocess on our Kestra instance.

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
