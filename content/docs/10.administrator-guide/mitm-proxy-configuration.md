---
title: MITM Proxy for Kestra
icon: /docs/icons/padlock.svg
---

Configure outbound HTTP/S traffic through an MITM proxy in Kestra.

This guide walks through the steps to route and inspect Kestra's outbound HTTP/S traffic using an MITM proxy.

## Why use an MITM proxy

In secured or restricted environments it’s common to route outbound HTTP/S traffic through a **Man-in-the-Middle (MITM) proxy** for auditing, inspection, or policy enforcement. For this to work seamlessly, clients (Kestra) must:

- Trust the proxy’s CA certificate.
- Route outbound traffic through the proxy.
- Configure the JVM and any auxiliary daemons (e.g., Docker daemon) to use the proxy and truststore.

:::alert{type="info"}
**Security note:** An MITM proxy intercepts TLS traffic. Only enable this in controlled environments and with appropriate approvals.
:::

---

## Prerequisites

### 1. Create a Java truststore with the MITM CA certificate

Import the MITM CA certificate into a Java keystore so the JVM trusts intercepted TLS connections:

```bash
keytool -importcert   -alias mitmproxy-ca   -storepass changeit   -keystore truststore.jks   -trustcacerts   -file mitmproxy-ca.crt   -noprompt
```

:::alert{type="info"}
Tip: prefer a strong password instead of `changeit` in production. You can also use PKCS12 by setting `-deststoretype PKCS12`.
:::

### 2. (Kubernetes) Create a Secret containing the truststore

Create a Kubernetes secret from the `truststore.jks`:

```bash
kubectl create secret generic kestra-ssl   --from-file=truststore.jks   -n kestra
```

This secret will be mounted into Kestra pods.

---

## Configuring Kestra to use the MITM proxy

You must update the [Kestra configuration](../configuration/index.md) and ensure the truststore is available inside the container. Below are suggested changes for both Kubernetes (Helm) and Docker Compose deployments.

### 1. Micronaut / Kestra configuration

Add proxy settings and truststore configuration to your [Kestra configuration](../configuration/index.md) (merged via Helm `configurations.application` or a config file):

```yaml
# values.yaml (or application.yml configuration)
configuration:
  micronaut:
    http:
      client:
        proxy-address: "your.proxy.net:8000"
        proxy-type: HTTP

  server:
    ssl:
      clientAuthentication: want
      trustStore:
        path: "file:/app/ssl/truststore.jks"
        password: "changeit"
        type: "JKS"
```

### 2. Mount the truststore inside the container

**Kubernetes (Helm `values.yaml`)**

```yaml
extraVolumeMounts:
  - name: ssl-secret
    mountPath: "/app/ssl"
    readOnly: true

extraVolumes:
  - name: ssl-secret
    secret:
      secretName: kestra-ssl
```

**Docker Compose**

```yaml
services:
  kestra:
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - tmp-kestra:/tmp/kestra-wd
      - ./ssl:/app/ssl   # ensure ./ssl/truststore.jks exists on host
```

### 3. JVM environment variables (JAVA_OPTS)

**Kubernetes (values.yaml)**

```yaml
extraEnv:
  - name: JAVA_OPTS
    value: >-
      -Djavax.net.ssl.trustStore=/app/ssl/truststore.jks
      -Djavax.net.ssl.trustStorePassword=changeit
      -Djavax.net.ssl.trustStoreType=JKS
      -Dhttp.proxyHost=your.proxy.net
      -Dhttp.proxyPort=8000
      -Dhttps.proxyHost=your.proxy.net
      -Dhttps.proxyPort=8000
      -Dhttp.nonProxyHosts=localhost|127.0.0.1|kubernetes.default.svc|.svc|.cluster.local|your.nexus.domain.com|kestra-minio
```

**Docker Compose**

```yaml
services:
  kestra:
    environment:
      - JAVA_OPTS=-Djavax.net.ssl.trustStore=/app/ssl/truststore.jks -Djavax.net.ssl.trustStorePassword=changeit -Djavax.net.ssl.trustStoreType=JKS -Dhttp.proxyHost=your.proxy.net -Dhttp.proxyPort=8000 -Dhttps.proxyHost=your.proxy.net -Dhttps.proxyPort=8000 -Dhttp.nonProxyHosts=localhost|127.0.0.1|your.nexus.domain.com
```

---

## Troubleshooting

1. **TLS handshake errors**
   Verify `truststore.jks` contains the correct CA (`keytool -list -keystore truststore.jks`).

2. **Requests not reaching the proxy**
   Confirm `http.proxyHost` / `https.proxyHost` and `http.nonProxyHosts` are correct.

3. **Docker image pull failures**
   Add the MITM CA to Docker daemon certs (`/etc/docker/certs.d/.../ca.crt`).

4. **Debugging TLS**
   Temporarily enable: `-Djavax.net.debug=ssl,handshake`.
