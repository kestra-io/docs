---
title: "MITM Proxy: Inspect Kestra's Outbound HTTPS Traffic"
h1: Route and inspect outbound HTTPS traffic through a MITM proxy
sidebarTitle: MITM Proxy for Kestra
icon: /src/contents/docs/icons/padlock.svg
description: Configure Kestra to route outbound HTTPS traffic through a Man-in-the-Middle (MITM) proxy for secure environments.
---

Route and inspect Kestra’s outbound HTTP/S traffic through an MITM proxy. In secured or restricted environments this is used for auditing, inspection, or policy enforcement. Kestra must trust the proxy’s CA certificate, route outbound traffic through the proxy, and configure the JVM and any auxiliary daemons (such as the Docker daemon) to use the proxy and truststore.

:::alert{type="info"}
**Security note:** An MITM proxy intercepts TLS traffic. Only enable this in controlled environments and with appropriate approvals.
:::

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

## Configuring Kestra to use the MITM proxy

The [Observability and Networking configuration](../../configuration/03.observability-and-networking/index.md) must include proxy settings, and the truststore must be available inside the container. The following covers both Kubernetes (Helm) and Docker Compose deployments.

### 1. Micronaut / Kestra configuration

Add proxy settings and truststore configuration to your [Observability and Networking configuration](../../configuration/03.observability-and-networking/index.md) (merged via Helm `configurations.application` or a config file):

```yaml
## values.yaml
configurations:
  application:
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

#### Bypass the proxy for internal hosts

:::badge{version=">=1.3.47" editions="OSS,EE"}
:::

`micronaut.http.client.proxy-*` applies to every server-side HTTP call made by Kestra, including calls to `api.kestra.io` (community blueprints, plugin catalog) and the OpenID Connect discovery of your SSO provider. Starting with Kestra 1.3.47 on the 1.3 line and 2.0.10 on the 2.0 line, these calls skip the proxy for any host listed in the JVM `http.nonProxyHosts` property (see [JVM environment variables](#3-jvm-environment-variables-java_opts) below). Add internal hosts the proxy cannot reach to that list, such as an on-premises identity provider (Keycloak, PingFederate, ADFS):

```
-Dhttp.nonProxyHosts=localhost|127.0.0.1|keycloak.internal.example.com|*.internal.example.com
```

:::alert{type="warning"}
Before Kestra 1.3.47 on the 1.3 line and 2.0.10 on the 2.0 line, the Micronaut HTTP client ignores `http.nonProxyHosts`, so SSO login fails when the identity provider is only reachable without the proxy. As a workaround, leave `micronaut.http.client.proxy-*` unset. Community blueprints are then unavailable, while custom blueprints keep working.
:::

### 2. Mount the truststore inside the container

**Kubernetes (Helm `values.yaml`)**

```yaml
common:
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
common:
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
        -Dhttp.nonProxyHosts=localhost|127.0.0.1|kubernetes.default.svc|*.svc|*.cluster.local|your.nexus.domain.com|your.object-storage.domain.com
```

**Docker Compose**

```yaml
services:
  kestra:
    environment:
      - JAVA_OPTS=-Djavax.net.ssl.trustStore=/app/ssl/truststore.jks -Djavax.net.ssl.trustStorePassword=changeit -Djavax.net.ssl.trustStoreType=JKS -Dhttp.proxyHost=your.proxy.net -Dhttp.proxyPort=8000 -Dhttps.proxyHost=your.proxy.net -Dhttps.proxyPort=8000 -Dhttp.nonProxyHosts=localhost|127.0.0.1|your.nexus.domain.com
```

## Troubleshooting

1. **TLS handshake errors**
   Verify `truststore.jks` contains the correct CA (`keytool -list -keystore truststore.jks`).

2. **Requests not reaching the proxy**
   Confirm `http.proxyHost` / `https.proxyHost` and `http.nonProxyHosts` are correct.

3. **Docker image pull failures**
   Add the MITM CA to Docker daemon certs (`/etc/docker/certs.d/.../ca.crt`).

4. **Debugging TLS**
   Temporarily enable: `-Djavax.net.debug=ssl,handshake`.
