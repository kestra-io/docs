---
order: 1
---
# Deployment with Docker

The quickest way to install Kestra is to use *Docker Compose*. It will start a **non production** Kestra with all the dependency.


## Before you begin
Make sure you have already installed :
- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Launch Kestra 

- Download the compose file [here](https://github.com/kestra-io/kestra/blob/develop/docker-compose.yml)
- Run `docker-compose up` 
- Open `http://localhost:8080` on your browser

It will start all the dependencies with a preconfigured Kestra that is connected to all! 

Kestra will start with *Standalone* server (all the different [servers](../../architecture) in one JVM). 
This is clearly not  for **production** workload but sufficient to test on a local computer.


## Docker Image 

### Use official image

The Kestra docker image is available in [Docker hub](https://hub.docker.com/r/kestra/kestra).

We provide 2 images :
* `kestra/kestra:latest`
* `kestra/kestra:latest-full`

The docker image is based on `openjdk:11-jre-slim` docker image.

#### `kestra/kestra:latest`
This image :
- does't contain any kestra plugins. 
- does't contain a lot of binaries to work with your [Bash task](/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Bash.html).
- does't contain some binaries for [Python task](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Python.html) or [Node task](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Node.html).

#### `kestra/kestra:latest-full`
This image contains all the kestra plugins and all the binaries for [Python task](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Python.html) or [Node task](https://kestra.io/plugins/core/tasks/scripts/io.kestra.core.tasks.scripts.Node.html).
Take care that this image will always contain the last version of plugins that can have some breaking change.

### Create a new image with more binaries

If the base or full image don't contain binaries 
You can easily create a new one with the `DockerFile` : 

```dockerfile
ARG IMAGE_TAG=latest
FROM kestra/kestra:$IMAGE_TAG

RUN mkdir -p /app/plugins && \
  apt-get update -y && \
  apt-get install -y --no-install-recommends golang && \
  apt-get clean && rm -rf /var/lib/apt/lists/* /var/tmp/*
```

### Create a new image with plugins
By default, the kestra base docker image don't contain any plugins, but you can create a new image with all the plugins you want : 
```dockerfile
ARG IMAGE_TAG=latest
FROM kestra/kestra:$IMAGE_TAG

RUN /app/kestra plugins install \
  io.kestra.plugin.notifications:task-notifications:LATEST \
  io.kestra.storage.gcs:storage-gcs:LATEST \
  io.kestra.plugin.gcp:task-gcp:LATEST 
```


### Docker image tag 

We provide a 3 tags for docker image : 
- `latest`: that will contain the default latest image with its full variant `latest-full`.
- `release`: an image with preview of the next release  with its full variant `release-full`.
- `develop`: an image based on `develop` branch that will change every day and contain all **unstable** feature we are working and with its full variant `develop-full`.
