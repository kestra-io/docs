---
title: "SSL/TLS Configuration: Enable HTTPS for Kestra"
h1: Enable HTTPS on the Kestra UI with SSL/TLS certificates
sidebarTitle: Configure SSL for Kestra
icon: /src/contents/docs/icons/padlock.svg
description: Configure SSL/TLS encryption for Kestra to secure the UI and API access using self-signed or CA-signed certificates.
---

Configure secure access to the Kestra UI via HTTPS. The right approach depends on your deployment type:

| Approach | Best for | Cert management |
|---|---|---|
| [Caddy reverse proxy](#using-caddy-as-a-reverse-proxy) | Docker/VM deployments, local dev | Automatic (Let's Encrypt or local CA) |
| [Kubernetes Ingress + cert-manager](#using-ingress-with-tls-termination-recommended-for-production) | Kubernetes deployments | Automatic via cert-manager |
| [Micronaut SSL config](#micronaut-ssl-configuration) | Air-gapped or no reverse proxy option | Manual (bring your own certs) |
| [Self-signed certificates](#creating-self-signed-certificates) | Local testing only | Manual |

## Why use SSL/TLS encryption

Adding TLS encryption to your environment provides the following benefits:

- Data is encrypted in transit, preventing sensitive data from being intercepted in "man-in-the-middle" attacks.

- TLS adds a layer of trust by ensuring users know the URL they access is genuine (e.g., `https://mycompany.kestra.com/ui` is verified as an internal site).

For further details, see [Why use HTTPS?](https://www.cloudflare.com/en-gb/learning/ssl/why-use-https/) on the Cloudflare documentation.

## Using Caddy as a reverse proxy

[Caddy](https://caddyserver.com/) is a reverse proxy that manages HTTPS automatically. For public domains it obtains and renews Let's Encrypt certificates without any manual steps; for local development it generates a local CA and prompts once for system trust.

### Local development (macOS)

This setup gives multiple local Kestra instances clean HTTPS URLs (e.g. `https://oss`, `https://ee`) with a single local CA prompt.

1. **Install Caddy**:
   ```bash
   brew install caddy
   ```

2. **Create a `~/Caddyfile`** with one `reverse_proxy` block per Kestra instance (adjust ports to match your instances):
   ```
   oss {
       reverse_proxy localhost:8080
   }

   oss-dev {
       reverse_proxy localhost:8081
   }

   ee {
       reverse_proxy localhost:8082
   }

   ee-dev {
       reverse_proxy localhost:8083
   }
   ```

3. **Run Caddy**:
   ```bash
   sudo caddy run --config ~/Caddyfile
   ```

   Caddy generates a local CA on first run and prompts once to trust it in the macOS Keychain. After that, all configured hostnames are available over HTTPS with no browser warnings.

:::alert{type="info"}
For the short hostnames (e.g. `oss`, `ee`) to resolve, add them to `/etc/hosts`:
```
127.0.0.1 oss oss-dev ee ee-dev
```
:::

### Production (public domain)

For a publicly accessible Kestra instance, point your domain at the server and Caddy handles certificate issuance and renewal automatically via Let's Encrypt.

```
kestra.yourdomain.com {
    reverse_proxy localhost:8080
}
```

Run Caddy as a background service so it persists across reboots:

```bash
sudo caddy start --config /etc/caddy/Caddyfile
```

With this setup, Kestra itself runs on plain HTTP internally (`localhost:8080`) and Caddy terminates TLS at the edge — no changes to Kestra's Micronaut SSL configuration are needed.

:::alert{type="info"}
Kestra uses WebSockets for real-time execution log streaming. Caddy's `reverse_proxy` directive supports WebSocket upgrades by default, so no extra configuration is required.
:::

## Creating self-signed certificates

To get started in lower environments, create self-signed certificates using the OpenSSL library. For more detail on examining certificates and keys, see this [Micronaut article](https://guides.micronaut.io/latest/micronaut-security-x509-maven-groovy.html).

:::alert{type="info"}
While self-signed certificates encrypt traffic, they are considered unsuitable for production usage. They are deemed untrustworthy, as they do not come from a trusted Certificate Authority (CA) such as [Let's Encrypt](https://letsencrypt.org/). Follow your organization's best practices when choosing a CA provider.
:::

```bash
## Create a folder which will be later mounted to the kestra container
mkdir -p /app/ssl
cd /app/ssl
```

```bash
## Create CA in PEM format along with private key
openssl req -x509 -sha256 -days 365 -newkey rsa:4096 \
  -keyout cacert.key -out cacert.pem \
  -subj '/CN=example.kestra.com/C=IE/O=kestra' \
  -passout pass:changeit

## Create certificate signing request
openssl req -newkey rsa:4096 \
  -keyout server.key -out server.csr \
  -subj '/CN=example.kestra.com/C=IE/O=kestra' \
 -passout pass:changeit

## Create the server configuration which will be used to sign the certificate
cat <<< 'authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost' > server.conf

## sign certificate
openssl x509 -req -CA cacert.pem -CAkey cacert.key \
        -in server.csr -out server.pem -days 365 \
        -CAcreateserial -extfile server.conf \
        -passin pass:changeit

## Create server.p12
openssl pkcs12 -export -out server.p12 -name "localhost" \
        -inkey server.key -in server.pem \
        -passin pass:changeit \
        -passout pass:changeit

## Create keystore.p12 with JDK keytool
keytool -importkeystore -srckeystore server.p12 \
        -srcstoretype pkcs12 -destkeystore keystore.p12 \
        -deststoretype pkcs12 \
        -deststorepass changeit -srcstorepass changeit

## Create truststore.jks
keytool -import -trustcacerts -noprompt -alias ca \
        -ext san=dns:localhost,ip:127.0.0.1 \
        -file cacert.pem -keystore truststore.jks \
        -storepass changeit -keypass changeit
```

## Micronaut SSL configuration

Configure HTTPS through the `micronaut` settings in the [Observability and Networking configuration](../../configuration/03.observability-and-networking/index.md).

:::alert{type="info"}
Ensure that you expose the secure port of the connection if different from the default port.
:::

```yaml
  kestra:
    image: registry.kestra.io/docker/kestra:latest
    pull_policy: always
    user: "root"
    command: server standalone --worker-thread=128
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - tmp-kestra:/tmp/kestra-wd
      - /app/ssl:/app/ssl
    ports:
      - "8443:8443"
    environment:
      KESTRA_CONFIGURATION: |
        micronaut:
          security:
            x509:
              enabled: false
          ssl:
            enabled: true
          server:
            ssl:
              port: 8443
              enabled: true
              clientAuthentication: want
              keyStore:
                path: file:/app/ssl/server.p12
                password: changeit
                type: PKCS12
              trustStore:
                path: file:/app/ssl/truststore.jks
                password: changeit
                type: JKS
        datasources:
          postgres:
            url: jdbc:postgresql://postgres:5432/kestra
            driver-class-name: org.postgresql.Driver
            username: kestra
            password: k3str4
        kestra:
          server:
            basic-auth:
              enabled: false
              username: "admin@kestra.io" # it must be a valid email address
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
            - "8443:8443"
```

## Outbound SSL configuration

If Kestra tasks make outbound calls to services that require SSL, configure the JVM to trust your certificates by setting the following options in the `JAVA_OPTS` environment variable in your [Observability and Networking configuration](../../configuration/03.observability-and-networking/index.md):

```yaml
JAVA_OPTS: "-Djavax.net.ssl.trustStore=/app/ssl/truststore.jks -Djavax.net.ssl.trustStorePassword=changeit"
```

The following example shows the full service configuration with `JAVA_OPTS` set:

```yaml
  kestra:
    image: registry.kestra.io/docker/kestra:latest
    pull_policy: always
    user: "root"
    command: server standalone --worker-thread=128
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - tmp-kestra:/tmp/kestra-wd
      - /app/ssl:/app/ssl
    ports:
      - "8443:8443"
    environment:
      JAVA_OPTS: "-Djavax.net.ssl.trustStore=/app/ssl/truststore.jks -Djavax.net.ssl.trustStorePassword=changeit"
      KESTRA_CONFIGURATION: |
        micronaut:
          security:
            x509:
              enabled: false
          ssl:
            enabled: true
          server:
            ssl:
              port: 8443
              enabled: true
              clientAuthentication: want
              keyStore:
                path: file:/app/ssl/server.p12
                password: changeit
                type: PKCS12
              trustStore:
                path: file:/app/ssl/truststore.jks
                password: changeit
                type: JKS
        datasources:
          postgres:
            url: jdbc:postgresql://postgres:5432/kestra
            driver-class-name: org.postgresql.Driver
            username: kestra
            password: k3str4
        kestra:
          server:
            basic-auth:
              enabled: false
              username: "admin@kestra.io" # it must be a valid email address
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
            - "8443:8443"
```

## Enabling CSRF protection

Cross-site request forgery (CSRF) is an attack where a malicious website or email tricks a user's browser into performing unwanted actions on a trusted site while authenticated.

CSRF protection requires TLS/SSL to be enabled on your instance. Once TLS is configured, add the following to your configuration file:

```yaml
micronaut:
  security:
    csrf:
      enabled: true
```

This setting enables CSRF protection on all endpoints that reach `/api/.*`.

## Configuring SSL with Kubernetes

For Kubernetes deployments, you can enable HTTPS either by configuring TLS at the Ingress level or by using self-signed certificates at the application level.

### Using ingress with TLS termination (recommended for production)

Most cloud providers expect TLS termination at the ingress controller. Here's how to configure HTTPS using Let's Encrypt certificates:

1. **Install cert-manager**. To use a different version, see [available releases on GitHub](https://github.com/cert-manager/cert-manager/releases):
   ```bash
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.1/cert-manager.yaml
   ```

2. **Create a Let's Encrypt issuer** (replace `your-email@example.com`):
   ```yaml
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: letsencrypt-prod
   spec:
     acme:
       server: https://acme-v02.api.letsencrypt.org/directory
       email: your-email@example.com
       privateKeySecretRef:
         name: letsencrypt-prod
       solvers:
       - http01:
           ingress:
             class: nginx # Update for your ingress controller
   ```

3. **Configure Ingress with TLS** (Azure AKS example):
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: kestra-ingress
     annotations:
       cert-manager.io/cluster-issuer: letsencrypt-prod
       nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
   spec:
     tls:
       - hosts:
           - kestra.yourdomain.com
         secretName: kestra-tls
     rules:
       - host: kestra.yourdomain.com
         http:
           paths:
             - path: /
               pathType: Prefix
               backend:
                 service:
                   name: kestra-service
                   port:
                     number: 80
   ```

### Using self-signed certificates (for testing)

1. **Generate certificates** using the OpenSSL commands in the [Creating self-signed certificates](#creating-self-signed-certificates) section above.

2. **Create TLS secret**:
   ```bash
   kubectl create secret tls kestra-tls \
     --cert=server.pem \
     --key=server.key
   ```

3. **Reference the secret in your Ingress**:
   ```yaml
   spec:
     tls:
       - hosts:
           - kestra.yourdomain.com
         secretName: kestra-tls
   ```

### Application-level SSL configuration

For environments where ingress TLS termination isn't available:

1. **Create secret with SSL files**:
   ```bash
   kubectl create secret generic kestra-ssl \
     --from-file=keystore.p12 \
     --from-file=truststore.jks
   ```

2. **Configure Kestra deployment**:
   ```yaml
   env:
     - name: KESTRA_CONFIGURATION
       value: |
         micronaut:
           server:
             ssl:
               enabled: true
               port: 8443
               keyStore:
                 path: file:/app/ssl/keystore.p12
                 password: changeit
                 type: PKCS12
   volumeMounts:
     - name: ssl-secret
       mountPath: "/app/ssl"
   volumes:
     - name: ssl-secret
       secret:
         secretName: kestra-ssl
   ```

3. **Expose HTTPS port** in your service:
   ```yaml
   ports:
     - name: https
       port: 8443
       targetPort: 8443
   ```

:::alert{type="warning"}
Production deployments on cloud platforms such as Azure AKS typically require valid certificates from trusted CAs for SSO integration. Self-signed certificates may work for testing but aren't suitable for production use.
:::

### Verifying the configuration

Check certificate validity with:

```bash
kubectl get certificate kestra-tls -w
```

Expected output:
```plaintext
NAME        READY   SECRET      AGE
kestra-tls  True    kestra-tls  5m
```

For a step-by-step guide to adding a self-signed or internal CA to the JVM truststore in a Kubernetes deployment, see [Trusting a custom CA for outbound connections on Kubernetes](../custom-ca-kubernetes/index.md).
