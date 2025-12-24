---
title: MITM Proxy for DinD
icon: /docs/icons/padlock.svg
---
Configure Docker-in-Docker (DinD) to run behind a Proxy in a Kubernetes-based Kestra deployment.

This guide describes how to configure Docker-in-Docker (DinD) to work **behind a corporate or MITM (Man-in-the-Middle) proxy** in a **rootless** setup, within a Kestra deployment.

## Why configure CA certs and proxies for DinD?

Docker-in-Docker (DinD) runs a Docker daemon inside a container, allowing it to build and run other containers. Kestra relies on DinD for certain task types that require Docker runtime isolation.

If your environment uses a proxy that intercepts HTTPS traffic (such as an MITM proxy), Docker must **trust the proxy’s CA certificate** when pulling images from remote registries (like Docker Hub or private registries).

Without this, you'll see errors like:

```text
x509: certificate signed by unknown authority
```

## Prerequisites
1. Create a ConfigMap for the Docker daemon configuration.

This should include your `daemon.json` with proxy settings.

Create a file `daemon.json`:

```json
{
    "proxies": {
        "http-proxy": "http://mitmproxy.default.svc.cluster.local:8000",
        "https-proxy": "http://mitmproxy.default.svc.cluster.local:8000",
        "no-proxy": "localhost,127.0.0.1,.svc,.cluster.local,your.nexus.domain.com,kestra-minio"
    }
}
```

Apply the configmap:

```bash
kubectl create configmap dind-daemon-config \
--from-file=daemon.json=./daemon.json \
-n kestra
```

2. Create a ConfigMap for the MITM Proxy CA certificate.  

Assuming you have the CA file saved as `mitmproxy-ca.crt`, run:
    
```bash
kubectl create configmap dind-ca-certs \
--from-file=ca.crt=./mitmproxy-ca.crt \
-n kestra
```

3. Kestra Configuration

Here is a configuration sample you can include in your Helm `values.yaml`:

```yaml
configuration: 
  kestra:
    plugins:
      configurations:
        - type:  io.kestra.plugin.scripts.runner.docker.Docker
          values:
            volume-enabled: true
extraVolumes: 
  - name: docker-daemon-config
    configMap:
      name: dind-daemon-config
  - name: ca-cert-volume
    configMap:
      name: dind-ca-certs
dind:
  enabled: true
  image:
    image: docker
    tag: dind-rootless
    pullPolicy: IfNotPresent
  socketPath: /dind/
  tmpPath: /tmp/
  resources: {}
  args:
    - --log-level=fatal
    - --group=1000
  securityContext:
    runAsUser: 1000
    runAsGroup: 1000
  extraVolumeMounts:
    - name: docker-daemon-config
      mountPath: /home/rootless/.config/docker
      readOnly: true
    - name: ca-cert-volume
      mountPath: /home/rootless/.config/docker/certs.d/mitmproxy.default.svc.cluster.local:8000
      readOnly: true
    - name: ca-cert-volume
      mountPath: /home/rootless/mitmproxy
      readOnly: true
  extraEnv:
    - name: SSL_CERT_FILE 
      value: /home/rootless/mitmproxy/ca.crt
```

Here, `volume-enabled: true` ensures that the CA certificate is mounted from the DinD pod into any container deployed by a Kestra task.

## DinD in action

The configuration will help the DinD Pod pull the required Container Images successfully through the MITM Proxy.

For Kestra tasks that run in Docker containers (e.g., `io.kestra.plugin.scripts.shell.Script`), you also need to set the `HTTPS_PROXY` environment variable and trust the certificate using `beforeCommands` as shown below.  
For consistency across tasks, consider configuring these settings as plugin defaults.

```yaml
id: mitm_proxy
namespace: company.team
tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Script
    containerImage: alpine/curl
    beforeCommands:
      - apk add --no-cache ca-certificates
      - update-ca-certificates  
    taskRunner: 
      type: io.kestra.plugin.scripts.runner.docker.Docker
      volumes:
        - /home/rootless/mitmproxy/ca.crt:/usr/local/share/ca-certificates/mitmproxy.crt
    env:
      HTTPS_PROXY: "mitmproxy.default.svc.cluster.local:8000"
    script: |
      curl https://httpbin.org/get 
```

##  How it Works
- `daemon.json`: tells Docker which proxy settings to use.
- `certs.d`: directory where Docker looks for custom CA certificates to trust registries.
- `SSL_CERT_FILE`: overrides the TLS stack used by the Docker daemon to trust the MITM CA.
- `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`: standard proxy env vars for networking.