---
title: Volume Mount
icon: /docs/icons/migration-guide.svg
release: 0.17.0
---

How to migrate `volume-enabled` to the plugin configuration.

The docker volume mount, by setting the property `kestra.tasks.scripts.docker.volume-enabled` to `true`, has been deprecated since 0.17.0. It is now recommended to use the plugin configuration `volume-enabled` for the Docker runner plugin.

This change is implemented in a non-breaking way, so you don't need to immediately change the way you use the docker volume mount. In case you use this older method for mounting the volume, you will receive the following deprecation warning:

::alert{type="warning"}
The `kestra.tasks.scripts.docker.volume-enabled` is deprecated, please use the plugin configuration `volume-enabled` instead.
::

It is recommended to make the following change in the [Docker Compose file](https://github.com/kestra-io/kestra/blob/develop/docker-compose.yml) for mounting the volume:

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

For more information, you can refer the [Bind mount](../../16.scripts/index.md) page.
