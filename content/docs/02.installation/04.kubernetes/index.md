---
title: Kubernetes
icon: /docs/icons/kubernetes.svg
---

Install Kestra in a Kubernetes cluster using a Helm chart.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/SV7C2eHiuV0?si=jq8sgQgilYspGosx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Helm Chart repository

For production workloads, we recommend using [Kubernetes](http://kubernetes.io/) for deployment, as it enables scaling of specific Kestra services as needed. Before getting started, make sure that you have [Helm](https://helm.sh/docs/intro/install/) and [kubectl](https://kubernetes.io/docs/tasks/tools/) installed, check out their documentation if needed.

We provide an official [Helm Chart](https://helm.sh/) to make the deployment easier.

- The chart repository is available under [helm.kestra.io](https://helm.kestra.io/).
- The source code of the charts can be found in the [kestra-io/helm-charts](https://github.com/kestra-io/helm-charts) repository on GitHub.

::alert{type="info"}
All image tags provided by default can be found in the [Docker installation guide](./02.docker.md).
::

## Install the chart

```bash
helm repo add kestra https://helm.kestra.io/
helm install kestra kestra/kestra
```

Now you'll be able to see 4 pods have been started:
- Standalone: All the components of Kestra in a deployed together in one pod
- PostgreSQL: Database service
- Docker DinD: For Script Tasks using Docker Task Runners
- MinIO: Internal storage backend

To access, export the pod name as an environment variable with the following command:

```bash
helm upgrade kestra kestra/kestra -f values.yaml
export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=kestra,app.kubernetes.io/instance=kestra,app.kubernetes.io/component=standalone" -o jsonpath="{.items[0].metadata.name}")
```
To then access from localhost, run the following `port-forward` command with kubectl:

```bash
kubectl port-forward $POD_NAME 8080:8080
```

## Scale Kestra with Kubernetes

By default, the chart deploys only one standalone Kestra [service](../07.architecture/index.md) with one replica within a single pod. However, to increase scalability and flexbility, you can also configure the Kestra components to run in their own dedicated, standalone pods. Use the following [Helm chart values]() to change that default behavior and deploy each service independently in their own pod:

To deploy each service independently in their own pod, add the values you want from the [Helm chart values](https://github.com/kestra-io/helm-charts/blob/master/charts/kestra/values.yaml) into a `values.yml` file in your instance's configuration like below:

```yaml
deployments:
  webserver:
    enabled: true
  executor:
    enabled: true
  indexer:
    enabled: true
  scheduler:
    enabled: true
  worker:
    enabled: true
  standalone:
    enabled: false
```

The above configuration enables a standalone pod for each Kestra component (webserver, executor, indexer, etc.) and disables the combined, standalone pod. This offers more scalable, granular resource allocation of each component depending on workflow demand and how intensely each component is utilized.

To confirm these changes and re-deploy, save the `values.yml` and upgrade your Helm Charts with the same commands as before:

```bash
helm upgrade kestra kestra/kestra -f values.yaml
export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=kestra,app.kubernetes.io/instance=kestra,app.kubernetes.io/component=standalone" -o jsonpath="{.items[0].metadata.name}")
kubectl port-forward $POD_NAME 8080:8080
```

Now you are able to access Kestra at `localhost:8080`.

The chart can also deploy the following related services:
- A Kafka cluster and Zookeeper using `kafka.enabled: true`
- An Elasticsearch cluster using `elasticsearch.enabled: true`
- A MinIO standalone using `minio.enabled: true`
- A PostgreSQL using `postgresql.enabled: true`

The MinIO (as the internal storage backend) and PostgreSQL (as the database backend) services are enabled by default to provide a fully working setup out of the box.

::alert{type="warning"}
All external services (Kafka, Elasticsearch, Zookeeper, MinIO, and PostgreSQL) are deployed using unsecured configurations (no authentication, no TLS, etc.). When installing for a production environment, make sure to adjust their configurations to secure your deployment.

**Note:** PostgreSQL is configured to use a low amount of resources by default but can be configured. 
::

## Secret environment variables

Like in the Docker installation, you can use secrets as environment variables by adding them to your `values.yml` file. The `extraEnv` property enables you to access the variables as secrets in your Kestra instance. For example, you could add the following to your configuration for database access with base64 encoding:

```yaml
extraEnv:
  - name: SECRET_DB_USERNAME
    value: "YWRtaW4"
  -name: SECRET_DB_PASSWORD
    value: "cGFzc3dvcmQ="
```

## Configuration

There are two methods to adjust the Kestra configuration:
- Using a Kubernetes `ConfigMap` via the `configuration` Helm value
- Using a Kubernetes `Secret` via the `secrets` Helm value

Both must be valid YAML that is merged as the Kestra configuration file.

Below is an example that shows how to enable Kafka as the queue implementation and configure its `bootstrap.servers` property using a secret:

```yaml
configuration:
  kestra:
    queue:
      type: kafka

secrets:
  kestra:
    kafka:
      client:
        properties:
          bootstrap.servers: "localhost:9092"
```

## Docker in Docker (DinD) Worker side car

By default, Docker in Docker (DinD) is installed on the worker in the `rootless` version.
This can be restricted on some environments due to security limitations.

Some solutions you may try:
- On Google Kubernetes Engine (GKE), use a node pool based on `UBUNTU_CONTAINERD` that works well with Docker DinD, even rootless.
- Some Kubernetes clusters only support a root version of DinD; to make your Kestra deployment work, [disable the rootless version](https://github.com/kestra-io/helm-charts/blob/master/charts/kestra/values.yaml#L102-L106) using the following Helm chart values:

```yaml
dind:
  image:
    image: docker
    tag: dind
  args:
    - --log-level=fatal
```

## Troubleshooting

### Docker in Docker (DinD)

If you face some issues using Docker in Docker (e.g., with [Script tasks](../04.workflow-components/01.tasks/02.scripts/index.md) using `io.kestra.plugin.scripts.runner.docker.Docker` Task Runner), start troubleshooting by attaching the terminal: ``docker run -it --privileged docker:dind sh``. Next, use `docker logs container_ID` to get the container logs. Also, try `docker inspect container_ID` to get more information about your Docker container. The output from this command displays details about the container, its environments, network settings, etc. This information can help you identify what might be wrong.

### Docker in Docker using Helm charts

On some Kubernetes deployments, using DinD with our default Helm charts can lead to errors like below:

```bash
Device "ip_tables" does not exist.
ip_tables              24576  4 iptable_raw,iptable_mangle,iptable_nat,iptable_filter
modprobe: can't change directory to '/lib/modules': No such file or directory
error: attempting to run rootless dockerd but need 'kernel.unprivileged_userns_clone' (/proc/sys/kernel/unprivileged_userns_clone) set to 1
```

To fix this, use `root` to launch the DinD container by setting the following values:

```yaml
dind:
  image:
    tag: dind
  args:
    - --log-level=fatal
  securityContext:
    runAsUser: 0
    runAsGroup: 0

securityContext:
  runAsUser: 0
  runAsGroup: 0
```

### Disable Docker in Docker and use Kubernetes task runner

To avoid using `root` to spin up containers via DinD, disable DinD by setting the following [Helm chart values](https://github.com/kestra-io/helm-charts/blob/master/charts/kestra/values.yaml#L135-L136):

```yaml
dind:
  enabled: false
```

Next, set Kubernetes task runner as the default way to run [script tasks](../04.workflow-components/01.tasks/02.scripts/index.md):

```yaml
pluginDefaults:
  - type: io.kestra.plugin.scripts
    forced: true
    values:
      taskRunner:
        type: io.kestra.plugin.ee.kubernetes.runner.Kubernetes
        # ... your Kubernetes runner configuration
```

