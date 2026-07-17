---
title: Deploy Kestra with Docker Compose – PostgreSQL
h1: Set Up Kestra Locally with Docker Compose and PostgreSQL
sidebarTitle: Docker Compose
icon: /src/contents/docs/icons/docker.svg
description: Get started with Kestra quickly using Docker Compose with a PostgreSQL backend for a robust local or server deployment.
---

Start Kestra with a PostgreSQL database backend by using a Docker Compose file.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/SGL8ywf3OJQ?si=Ww-JsVKvceR_n08j" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Prerequisites

- Install [Docker](https://docs.docker.com/compose/install/) before you begin.
- Make sure Docker Compose is available in your Docker installation.

## Download the Docker Compose file

Download the Docker Compose file using the following command on Linux and macOS:

```bash file=src/contents/docs/_snippets/install/download-docker-compose.sh
```

On Windows, use the following command:

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/kestra-io/kestra/develop/docker-compose.yml" -OutFile "docker-compose.yml"
```

You can also download the [Docker Compose file](https://github.com/kestra-io/kestra/blob/develop/docker-compose.yml) manually and save it as `docker-compose.yml`.

## Launch Kestra

Use the following command to start the Kestra server:

```bash
docker compose up -d
```

Open the URL `http://localhost:8080` in your browser to launch the UI.

::snippet{name="install/ee-docker-login"}

### Adjusting the configuration

The command from the previous section starts a standalone server, with all architectural components running in one JVM.

The [configuration](../../configuration/01.configuration-basics/index.md) lives in the `KESTRA_CONFIGURATION` environment variable of the Kestra container. You can update that environment variable inside the Docker Compose file or pass it as a Docker CLI argument.

:::alert{type="info"}
If you want to extend your Docker Compose file, modify container networking, or if you have any other issues using this Docker Compose file, check the [Troubleshooting Guide](../../10.administrator-guide/16.troubleshooting/index.md).

For running Kestra in Docker Compose with each server component as a separate service, see the [multi-component Docker Compose example](../../kestra-cli/kestra-server/index.md#kestra-with-server-components-in-different-services).
:::

### Use a configuration file

If you want to use a configuration file instead of the `KESTRA_CONFIGURATION` environment variable, update the default `docker-compose.yml`.

First, create a configuration file containing the `KESTRA_CONFIGURATION` environment variable defined in the `docker-compose.yml` file. You can name it `application.yaml`.

Next, update the `kestra` service in the `docker-compose.yml` file to mount this file into the container and start up Kestra using the `--config` option:

```yaml
## [...]
  kestra:
    image: kestra/kestra:latest
    pull_policy: always
    # Note that this is meant for development only. Refer to the documentation for production deployments of Kestra which runs without a root user.
    user: "root"
    command: server standalone --worker-thread=128 --config /etc/config/application.yaml
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
      - $PWD/application.yaml:/etc/config/application.yaml
    ports:
      - "8080:8080"
      - "8081:8081"
    depends_on:
      postgres:
        condition: service_started
```
:::alert{type="info"}
Check out all of our available [Docker image tags](./../02.docker/index.md#docker-image-tags) to see which one is best for your use case.
:::

### Configure networking in Docker Compose

The [default Docker Compose file](https://github.com/kestra-io/kestra/blob/develop/docker-compose.yml) does not configure networking for the Kestra containers. This means you cannot access services exposed via `localhost` on your local machine, such as another Docker container with a mapped port. Your machine and the Docker container operate on different networks. To use a locally exposed service from the Kestra container, use the `host.docker.internal` hostname or `172.17.0.1`. The `host.docker.internal` address lets you reach your host machine's services from the container.

Alternatively, you can use a Docker network. By default, your Kestra container is placed in a `default` network. You can add your custom services to the `docker-compose.yml` file provided by Kestra and use the service aliases, which are the keys in `services`, to reach them.

A better approach may be to create a new network such as `kestra_net` and add your services to it. Then add that network to the `networks` section of the `kestra` service. With this configuration, you can access your exposed ports through `localhost`.

The example below shows how you can add `iceberg-rest`, `minio`, and `mc` (i.e., MinIO client) to your Kestra Docker Compose file.

:::collapse{title="Example"}

```yaml
volumes:
  postgres-data:
    driver: local
  kestra-data:
    driver: local

networks:
  kestra_net:

services:
  postgres:
    image: postgres
    volumes:
      - postgres-data:/var/lib/postgresql
    environment:
      POSTGRES_DB: kestra
      POSTGRES_USER: kestra
      POSTGRES_PASSWORD: k3str4
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 10
    networks:
      kestra_net:

  iceberg-rest:
      image: tabulario/iceberg-rest
      ports:
        - 8181:8181
      environment:
        - AWS_ACCESS_KEY_ID=admin
        - AWS_SECRET_ACCESS_KEY=password
        - AWS_REGION=us-east-1
        - CATALOG_WAREHOUSE=s3://warehouse/
        - CATALOG_IO__IMPL=org.apache.iceberg.aws.s3.S3FileIO
        - CATALOG_S3_ENDPOINT=http://minio:9000
      networks:
        kestra_net:

  minio:
      image: minio/minio
      container_name: minio
      environment:
        - MINIO_ROOT_USER=admin
        - MINIO_ROOT_PASSWORD=password
        - MINIO_DOMAIN=minio
      networks:
        kestra_net:
          aliases:
            - warehouse.minio
      ports:
        - 9001:9001
        - 9000:9000
      command: ["server", "/data", "--console-address", ":9001"]

  mc:
      depends_on:
        - minio
      image: minio/mc
      container_name: mc
      networks:
        kestra_net:
      environment:
        - AWS_ACCESS_KEY_ID=admin
        - AWS_SECRET_ACCESS_KEY=password
        - AWS_REGION=us-east-1
      entrypoint: >
        /bin/sh -c "
        until (/usr/bin/mc config host add minio http://minio:9000 admin password) do echo '...waiting...' && sleep 1; done;
        /usr/bin/mc rm -r --force minio/warehouse;
        /usr/bin/mc mb minio/warehouse;
        /usr/bin/mc policy set public minio/warehouse;
        tail -f /dev/null
        "

  kestra:
      image: kestra/kestra:latest
      pull_policy: always
      entrypoint: /bin/bash
      # Note that this is meant for development only. Refer to the documentation for production deployments of Kestra which runs without a root user.
      user: "root"
      command:
        - -c
        - /app/kestra server standalone --worker-thread=128
      volumes:
        - kestra-data:/app/storage
        - /var/run/docker.sock:/var/run/docker.sock
        - /tmp/kestra-wd:/tmp/kestra-wd
      environment:
        KESTRA_CONFIGURATION: |
          datasources:
            postgres:
              url: jdbc:postgresql://postgres:5432/kestra
              driver-class-name: org.postgresql.Driver
              username: kestra
              password: k3str4
          kestra:
            server:
              basic-auth:
                username: admin
                password: kestra
            repository:
              type: postgres
            storage:
              type: minio
              minio:
                endpoint: http://minio
                port: 9000
                access-key: admin
                secret-key: password
                region: us-east-1
                bucket: warehouse
            queue:
              type: postgres
            tasks:
              tmp-dir:
                path: /tmp/kestra-wd/tmp
            url: http://localhost:8080/
      ports:
        - "8080:8080"
        - "8081:8081"
      depends_on:
        postgres:
          condition: service_started
      networks:
        kestra_net:
```
:::

Finally, you can use `host` network mode for the `kestra` service. This makes the container use your host network, so it can reach all exposed ports. In that case, change `services.kestra.environment.KESTRA_CONFIGURATION.datasources.postgres.url` to `jdbc:postgresql://localhost:5432/kestra`. This is the easiest way to reach all ports, but it can be a security risk.

See the example below using `network_mode: host`.

:::collapse{title="Example"}
```yaml
volumes:
  kestra-data:
    driver: local

services:
  kestra:
    image: kestra/kestra:latest
    pull_policy: always
    entrypoint: /bin/bash
    network_mode: host
    environment:
      JAVA_OPTS: "--add-opens java.base/java.nio=ALL-UNNAMED"
      NODE_OPTIONS: "--max-old-space-size=4096"
      KESTRA_CONFIGURATION: |
        datasources:
          postgres:
            url: jdbc:postgresql://localhost:5432/kestra
            driver-class-name: org.postgresql.Driver
            username: kestra
            password: k3str4
        kestra:
          server:
            basic-auth:
              username: admin
              password: kestra
          anonymous-usage-report:
            enabled: true
          repository:
            type: postgres
          storage:
            type: local
            local:
              base-path: "/app/storage"
          queue:
            type: postgres
          tasks:
            tmp-dir:
              path: /tmp/kestra-wd/tmp
            scripts:
              docker:
                volume-enabled: true
            defaults: # Example demonstrating global pluginDefaults
              - type: io.kestra.plugin.airbyte.connections.Sync
                url: http://host.docker.internal:8000/
                username: airbyte
                password: password
          url: http://localhost:8080/
          variables:
            env-vars-prefix: "" # To avoid requiring KESTRA_ prefix on env vars
```
:::

### PostgreSQL 16 incompatibility error

By default, the Docker Compose template uses the latest image for PostgreSQL. However, if you initialized your Kestra database on an older version of PostgreSQL, you might encounter the following error:

```plaintext
The data directory was initialized by PostgreSQL version 16, which is not compatible with this version 17.0 (Debian 17.0-1.pgdg120+1).
```

To resolve this, you need to specify a specific tag for the PostgreSQL image in your Docker Compose file. In the example below, we specify `16` as the error above was originally initialized by version 16:


```yaml
services:
  postgres:
    image: postgres:16
```

### SIGILL in Java Runtime Environment on macOS M4 chip

Add the following environment variable to your Kestra container: `-e JAVA_OPTS="-XX:UseSVE=0"`:

```bash
docker run --pull=always --rm -it -p 8080:8080 --user=root -e JAVA_OPTS="-XX:UseSVE=0" --name kestra -v kestra_data:/app/storage -v kestra_db:/app/data -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp kestra/kestra:latest server local
```

To apply the same setting in a Docker Compose file:

```yaml
services:
  kestra:
    image: kestra/kestra:latest
    environment:
      JAVA_OPTS: "-XX:UseSVE=0"
```

## Kestra with server components in different services

Server components can run independently from each other. Each of them communicate through the database. The `kestra server` command starts each server component individually:

- `kestra server executor`
- `kestra server worker`
- `kestra server indexer`
- `kestra server scheduler`
- `kestra server webserver`

For more details on Kestra server commands, check out the [Server CLI documentation](../../kestra-cli/kestra-server/index.md).

Here is an example Docker Compose configuration file running Kestra services with replicas on the Postgres database backend.

```yaml
volumes:
  postgres-data:
    driver: local
  kestra-data:
    driver: local

services:
  postgres:
    image: postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: kestra
      POSTGRES_USER: kestra
      POSTGRES_PASSWORD: k3str4
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 10

  kestra-scheduler:
    image: kestra/kestra:latest
    deploy:
      replicas: 2
    pull_policy: if_not_present
    user: "root"
    command: server scheduler
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
    environment:
      KESTRA_CONFIGURATION: &common_configuration |
        datasources:
          postgres:
            url: jdbc:postgresql://postgres:5432/kestra
            driver-class-name: org.postgresql.Driver
            username: kestra
            password: k3str4
        kestra:
          server:
            basic-auth:
              username: "admin@kestra.io"
              password: kestra
          repository:
            type: postgres
          storage:
            type: local
            local:
              base-path: "/app/storage"
          queue:
            type: postgres
          tasks:
            tmp-dir:
              path: /tmp/kestra-wd/tmp
    ports:
      - "8082-8083:8081"
    depends_on:
      postgres:
        condition: service_started

  kestra-worker:
    image: kestra/kestra:latest
    deploy:
      replicas: 2
    pull_policy: if_not_present
    user: "root"
    command: server worker
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
    environment:
      KESTRA_CONFIGURATION: *common_configuration
    ports:
      - "8084-8085:8081"
    depends_on:
      postgres:
        condition: service_started
  kestra-executor:
    image: kestra/kestra:latest
    deploy:
      replicas: 2
    pull_policy: if_not_present
    user: "root"
    command: server executor
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
    environment:
      KESTRA_CONFIGURATION: *common_configuration
    ports:
      - "8086-8087:8081"
    depends_on:
      postgres:
        condition: service_started
  kestra-webserver:
    image: kestra/kestra:latest
    deploy:
      replicas: 1
    pull_policy: if_not_present
    user: "root"
    command: server webserver
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
    environment:
      KESTRA_CONFIGURATION: *common_configuration
      KESTRA_URL: http://localhost:8080/
    ports:
      - "8080:8080"
      - "8081:8081"
    depends_on:
      postgres:
        condition: service_started
```
