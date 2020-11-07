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

The docker image is based on `openjdk:11-jre-slim` docker image, so it don't contain a lot of binaries to work with your [Bash task](/plugins/core/tasks/scripts/org.kestra.core.tasks.scripts.Bash.html). 
Fell free to recreate a new image of need more tools. 


### Create a new image for Python tasks

Also the base image don't contain binaries for [Python task](https://kestra.io/plugins/core/tasks/scripts/org.kestra.core.tasks.scripts.Python.html).
You can easily create a new one with the `DockerFile` : 

```dockerfile
ARG IMAGE_TAG=latest
FROM kestra/kestra:$IMAGE_TAG

RUN mkdir -p /app/plugins && \
  apt-get update -y && \
  apt-get install -y --no-install-recommends python3-pip python3-wheel python3-setuptools python3-virtualenv && \
  apt-get clean && rm -rf /var/lib/apt/lists/* /var/tmp/*
```

### Create a new image with plugins

By default the kestra docker image don't contain any plugins, but you can create a new image with all the plugins you want : 
```dockerfile
ARG IMAGE_TAG=latest
FROM kestra/kestra:$IMAGE_TAG

RUN /app/kestra plugins install \
  org.kestra.task.notifications:task-notifications:LATEST \
  org.kestra.storage.gcs:storage-gcs:LATEST \
  org.kestra.task.gcp:task-gcp:LATEST 
```


### Docker image tag 

We provide a 3 tags for docker image : 
- `latest`: that will contain the default latest image. 
- `release`: an image with preview of the next release  
- `develop`: an image based on `develop` branch that will change everyday and contain all **unstable** feature we are working.
