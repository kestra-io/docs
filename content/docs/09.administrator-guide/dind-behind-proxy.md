---
title: Configure MITM Proxy for DinD
icon: /docs/icons/padlock.svg
---
Running Docker-in-Docker (DinD) Behind a Proxy in Kestra deployed on Kubernetes

This guide describes how to configure Docker-in-Docker (DinD) to work **behind a corporate or MITM (Man-in-the-Middle) proxy** in a **rootless** setup, within a Kestra deployment.

## Why Configure CA Certs and Proxies for DinD?

Docker-in-Docker (DinD) allows containers to run their own Docker daemon, enabling them to build and run other containers. Kestra uses DinD in certain task types that need Docker runtime isolation.

If your environment uses a proxy that intercepts HTTPS traffic (such as a MITM proxy), Docker must **trust the proxy’s CA certificate** when pulling images from remote registries (like Docker Hub or private registries).

Without this, you'll see errors like:

```text
x509: certificate signed by unknown authority
```

## Prerequisites
1. Create a ConfigMap for Docker daemon config
This ConfigMap should include your `daemon.json` with proxy settings.
    Create a file `daemon.json`
    ```json
    {
        "proxies": {
            "http-proxy": "http://mitmproxy.default.svc.cluster.local:8000",
            "https-proxy": "http://mitmproxy.default.svc.cluster.local:8000",
            "no-proxy": "localhost,127.0.0.1,.svc,.cluster.local,your.nexus.domain.com,kestra-minio"
        }
    }
    ```
    Apply the configmap.
    ```bash
    kubectl create configmap dind-daemon-config \
    --from-file=daemon.json=./daemon.json \
    -n kestra
    ```
2. Create a ConfigMap for the MITM Proxy CA Certificate.
    
    Assuming you have the CA file as `mitmproxy-ca.crt`
    
    ```bash
    kubectl create configmap dind-ca-certs \
    --from-file=ca.crt=./mitmproxy-ca.crt \
    -n kestra
    ```
3. Kestra Configuration
    Here is a configuration sample you can include in your Helm `values.yaml`.
    ```yaml
      configuration: 
        kestra:
          plugins:
            configurations:
              - type:  io.kestra.plugin.scripts.runner.docker.Docker
                values:
                  volume-enabled: true
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
    Notice that we used `volume-enabled: true` in the configuration to mount the CA cert from DinD pod to the Container deployed later by a Task in Kestra.  

## DinD in Action

The configuration will help the DinD Pod pull required Container Images successfully through the MITM Proxy.

Further for Kestra tasks, that need to run as a Docker Container such as the `io.kestra.plugin.scripts.shell.Script`, you must provide the `HTTPS_PROXY` env variable and trust the certificate in the `beforeCommands` as shown below.
It might also be a good idea to configure the settings as plugin defaults.
```yaml
tasks:
  - id: hello
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
- `certs.d`: where Docker looks for custom CA certs to trust registries.
- `SSL_CERT_FILE`: overrides the TLS stack used by the Docker daemon to trust the MITM CA.
- `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`: standard proxy env vars for networking.