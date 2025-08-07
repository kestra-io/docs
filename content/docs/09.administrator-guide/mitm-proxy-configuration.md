---
title: Configure MITM Proxy for Kestra
icon: /docs/icons/padlock.svg
---

Configure outbound HTTP/S traffic through an MITM proxy in Kestra.

This guide walks through the steps to route and inspect Kestra's HTTP/S traffic using an MITM proxy.

## Why use MITM proxy 

When working in secured or restricted environments, it’s common to route outbound HTTP/S traffic through a **Man-in-the-Middle (MITM) proxy**. This allows inspecting, logging, or modifying traffic for auditing or security purposes. For this to work seamlessly, clients need to:

- Trust the MITM proxy's certificate
- Route traffic through the proxy
- Configure Java system properties accordingly

## Prerequisites

Before configuring Kestra to use an MITM proxy, complete the following setup steps:

### 1. Create a Truststore with the MITM Proxy CA Certificate

Use the `keytool` command to import the mitmproxy CA certificate into a new Java truststore:

```bash
keytool -importcert \
  -alias mitmproxy-ca \
  -storepass changeit \
  -keystore truststore.jks \
  -trustcacerts \
  -file mitmproxy-ca.crt \
  -noprompt
```
This step ensures that Kestra trusts the HTTPS traffic intercepted by the MITM proxy.
### 2. For Kubernetes Deployment, create a Secret with the Truststore
Once you have the `truststore.jks` file, create a Kubernetes secret to mount it into the Kestra pod
```bash
kubectl create secret generic kestra-ssl \
  --from-file=truststore.jks \
  -n kestra
```
These resources will be used in your Kestra deployment configuration to enable proxying.

## Configuring MITM Proxy in Kestra

To configure MITM proxy behavior in Kestra, you need to update the following sections in the configuration

### 1. Configuration File
```yaml
# values.yaml
configuration: 
  micronaut:
    http:
      client:
        proxy-address: "PROXY_URI:PROXY_PORT"
        proxy-type: HTTP

    server:
      ssl:
        clientAuthentication: want
        trustStore:
          path: file:/app/ssl/truststore.jks
          password: changeit
          type: JKS
```
This sets up:
- The HTTP proxy endpoint.
- Trust settings for the MITM certificate stored in a Java Keystore.

### 2. Mounting the TrustStore
**For Kubernetes Deployments**: You must mount the Java TrustStore containing the MITM proxy’s certificate into the container.
```yaml
# values.yaml
extraVolumeMounts:
  - name: ssl-secret
    mountPath: "/app/ssl"

extraVolumes:
  - name: ssl-secret
    secret:
      secretName: kestra-ssl   
```
**For Docker Compose Deployments**: You need the following properties:
```yaml
# docker-compose.yaml
services:
  kestra:
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - tmp-kestra:/tmp/kestra-wd
      - /app/ssl:/app/ssl # this is where the `truststore.jks` exists on your host machine
```
### 3. Environment Variables
Set the following environment variables to ensure the JVM routes traffic via the proxy and uses the correct truststore. Ensure internal endpoints that shouldn't be routed through MITM proxy are added to the `-Dhttp.nonProxyHosts` flag.

**For Kubernetes Deployments**: 
```yaml
# values.yaml
extraEnv:
  - name: JAVA_OPTS
    value: "-Djavax.net.ssl.trustStore=/app/ssl/truststore.jks -Djavax.net.ssl.trustStorePassword=changeit -Dhttp.proxyHost=your.proxy.net -Dhttp.proxyPort=8000 -Dhttps.proxyHost=your.proxy.net -Dhttps.proxyPort=8000 -Dhttp.nonProxyHosts=localhost|127.0.0.1|kubernetes.default.svc|.svc|.cluster.local|your.nexus.domain.com|kestra-minio"
```

**For Docker Compose Deployments**: 
```yaml
# docker-compose.yaml
    environment:
      JAVA_OPTS: "-Djavax.net.ssl.trustStore=/app/ssl/truststore.jks -Djavax.net.ssl.trustStorePassword=changeit -Dhttp.proxyHost=your.proxy.net -Dhttp.proxyPort=8000 -Dhttps.proxyHost=your.proxy.net -Dhttps.proxyPort=8000 -Dhttp.nonProxyHosts=localhost|127.0.0.1|your.nexus.domain.com"
```
These settings ensure HTTP and HTTPS traffic goes through the proxy while bypassing internal services.

## Troubleshooting
1. If HTTPS calls fail, verify the truststore contains the correct CA.
2. Check mitmproxy logs to confirm traffic is routed through it.
3. Make sure your Kubernetes Secret is correctly mounted.
4. You can also enable additional logs by adding the following flag to `JAVA_OPTS`, i.e., `-Djavax.net.debug=ssl,handshake`