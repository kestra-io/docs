---
title: Bind Mount
icon: /docs/icons/dev.svg
---

Use bind-mount to execute locally stored scripts.

To run a script stored locally, you can bind-mount it to your Kestra container.

## Bind-mounting local scripts

Bind-mounting local scripts to the Kestra server can also make the local scripts available to the Docker containers running the script tasks. This is useful when you want to test a script and you don't want to use Namespace Files.

First, make sure that your Kestra configuration in the [Docker Compose file](https://github.com/kestra-io/kestra/blob/develop/docker-compose.yml) allows volume mounting. Below is an example with the intended setting in the final line:

```yaml
  kestra:
    image: kestra/kestra:latest
    pull_policy: always
    user: "root"
    env_file:
      - .env
    command: server standalone --worker-thread=128
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd:rw
    environment:
      KESTRA_CONFIGURATION: |
        datasources:
          postgres:
            url: jdbc:postgresql://postgres:5432/kestra
            driverClassName: org.postgresql.Driver
            username: kestra
            password: k3str4
        kestra:
          server:
            basicAuth:
              enabled: false
              username: "admin@kestra.io" # it must be a valid email address
              password: kestra
          repository:
            type: postgres
          storage:
            type: local
            local:
              basePath: "/app/storage"
          queue:
            type: postgres
          tasks:
            tmpDir:
              path: /tmp/kestra-wd/tmp
          plugins:
            configurations:
              - type: io.kestra.plugin.scripts.runner.docker.Docker
                values:
                  volume-enabled: true # 👈 this is the relevant setting
```

With that setting, you can point the script task to any script on your local file system:

```yaml
id: pythonVolume
namespace: company.team
tasks:
  - id: anyPythonScript
    type: io.kestra.plugin.scripts.python.Commands
    containerImage: ghcr.io/kestra-io/pydata:latest
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
      volumes:
        - /Users/anna/gh/KESTRA_REPOS/scripts:/app
    commands:
      - python /app/etl/parametrized.py
```

This flow points the Python task running in a Docker container to [this ETL script](https://github.com/kestra-io/scripts/blob/main/etl/parametrized.py).
