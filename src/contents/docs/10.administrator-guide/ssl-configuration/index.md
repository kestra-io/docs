---
title: "SSL/TLS Configuration: Enable HTTPS for Kestra"
h1: Enable HTTPS on the Kestra UI with SSL/TLS certificates
sidebarTitle: Configure SSL for Kestra
icon: /src/contents/docs/icons/padlock.svg
description: Configure SSL/TLS encryption for Kestra to secure the UI and API access using self-signed or CA-signed certificates.
---

Configure secure access to the Kestra UI via HTTPS. The right approach depends on your deployment type.

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

With this setup, Kestra itself runs on plain HTTP internally (`localhost:8080`) and Caddy terminates TLS at the edge — no changes to Kestra's Micronaut SSL configuration are needed. Set `kestra.url` to the HTTPS address, see [Webserver URL](../webserver-url/index.md).

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
```

Clients must trust `cacert.pem` to connect without certificate errors: add it to the users' browsers or operating systems, and to the JVM of Kestra components that call the webserver, as described in [Trust an internal CA for outbound HTTPS connections](../custom-ca/index.md).

## Micronaut SSL configuration

To serve HTTPS from Kestra itself, without a reverse proxy, configure TLS through the `micronaut.server.ssl` settings of the webserver. The following Docker Compose service runs a standalone server with the `server.p12` keystore created in the previous section:

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
          server:
            ssl:
              enabled: true
              port: 8443
              key-store:
                path: file:/app/ssl/server.p12
                password: changeit
                type: PKCS12
        datasources:
          postgres:
            url: jdbc:postgresql://postgres:5432/kestra
            driver-class-name: org.postgresql.Driver
            username: kestra
            password: k3str4
        kestra:
          url: https://localhost:8443/
          server:
            basic-auth:
              username: "admin@kestra.io" # it must be a valid email address
              password: Admin1234! # at least 8 characters, with an uppercase letter, a lowercase letter, and a number
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
```

With TLS enabled, the webserver behaves as follows:

- It serves HTTPS on port `8443` only. The plain-HTTP listener on `8080` is no longer started, so `http://` URLs are refused instead of redirected. Publish `8443` (or map it to `443`) and give users the `https://` address.
- The management port `8081` (health checks, metrics) keeps serving plain HTTP. Don't publish it outside the host or the internal network.
- Login and CSRF cookies get the `Secure` attribute, so browsers send them over HTTPS only.
- Set `kestra.url` to the HTTPS address. Notifications and tasks that call the Kestra API use it, see [Webserver URL](../webserver-url/index.md).

In a distributed deployment, set `micronaut.server.ssl` on the webserver only. The other components don't serve the UI or API.

## Outbound SSL configuration

The `micronaut.server.ssl` settings above apply only to connections made to the Kestra webserver. Outbound HTTPS calls from tasks, including calls to the Kestra API at `kestra.url`, use the JVM truststore instead.

To trust an internal CA for those calls, build a truststore from the Kestra image's `cacerts` plus your root CA and pass it with `JAVA_OPTS`. A truststore that holds only your CA stops Kestra from trusting public endpoints. See [Trust an internal CA for outbound HTTPS connections](../custom-ca/index.md) for the Docker, Docker Compose, and Kubernetes steps.

## CSRF protection

Cross-site request forgery (CSRF) is an attack where a malicious website tricks a signed-in user's browser into sending requests to Kestra.

Kestra 2.0 ships CSRF protection enabled by default. It uses a double-submit token: the webserver sets a `csrfToken` cookie and injects the same value into the UI, which sends it back in the `X-CSRF-TOKEN` header on every state-changing request. The token is validated only when the request is authenticated by a session cookie (`BASIC_AUTH` or `JWT`). API and SDK clients that authenticate with an `Authorization` header are not affected, and `GET`, `HEAD`, and `OPTIONS` requests are never checked.

CSRF protection does not require TLS. The `Secure` flag on the token cookie follows the request scheme, including `X-Forwarded-Proto` from a reverse proxy, so plain-HTTP deployments keep working. To force it, see [Secure cookies](../../configuration/03.observability-and-networking/index.md#secure-cookies). The token is signed with `kestra.encryption.secret-key` when one is configured.

To disable it, for example while debugging a reverse proxy setup, set:

```yaml
micronaut:
  security:
    csrf:
      enabled: false
```

:::alert{type="warning"}
Leave CSRF protection enabled on any instance reachable from a browser. A token left by a previous Kestra instance on the same host is detected and renewed on page load, so it does not need to be cleared by hand.
:::

## Configuring SSL with Kubernetes

Kubernetes deployments support HTTPS via ingress-level TLS termination or via self-signed certificates at the application level.

### Using ingress with TLS termination (recommended for production)

Most cloud providers expect TLS termination at the ingress controller. The following steps configure HTTPS using Let's Encrypt certificates:

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
     --from-file=keystore.p12
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

Certificate validity can be checked with:

```bash
kubectl get certificate kestra-tls -w
```

Expected output:
```plaintext
NAME        READY   SECRET      AGE
kestra-tls  True    kestra-tls  5m
```

To trust a self-signed or internal CA for outbound calls from tasks, see [Trust an internal CA for outbound HTTPS connections](../custom-ca/index.md).
