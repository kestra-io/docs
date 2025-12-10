---
title: Configure SSL for Kestra
icon: /docs/icons/padlock.svg
---

Configure secure access to the Kestra UI via HTTPS.

This guide walks through the steps to configure secure access via https to the Kestra UI.

## Why use SSL/TLS encryption

In short, adding TLS encryption to your environment provides the following benefits:

- Data is encrypted in transit, preventing sensitive data from being intercepted in "man-in-the-middle" attacks.

- TLS adds a layer of trust by ensuring users know the URL they access is genuine (e.g., `https://mycompany.kestra.com/ui` is verified as an internal site).

For further details, Cloudflare has a good write-up on [why you should use https](https://www.cloudflare.com/en-gb/learning/ssl/why-use-https/).

## Creating self-signed certificates

To get started in lower environments, you can create self-signed certificates using the OpenSSL library. Full details on the steps and how to examine the certificates and keys in more detail can be found in this [Micronaut article](https://guides.micronaut.io/latest/micronaut-security-x509-maven-groovy.html).

:::alert{type="info"}
While self-signed certificates encrypt traffic, they are considered unsuitable for production usage. They are deemed untrustworthy, as they do not come from a trusted Certificate Authority (CA) such as [Let's Encrypt](https://letsencrypt.org/). Follow your organization's best practices when choosing a CA provider.
:::

```bash
# Create a folder which will be later mounted to the kestra container
mkdir -p /app/ssl
cd /app/ssl
```

```bash
# Create CA in PEM format along with private key
openssl req -x509 -sha256 -days 365 -newkey rsa:4096 \
  -keyout cacert.key -out cacert.pem \
  -subj '/CN=example.kestra.com/C=IE/O=kestra' \
  -passout pass:changeit

# Create certificate signing request
openssl req -newkey rsa:4096 \
  -keyout server.key -out server.csr \
  -subj '/CN=example.kestra.com/C=IE/O=kestra' \
 -passout pass:changeit

# Create the server configuration which will be used to sign the certificate
cat <<< 'authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost' > server.conf

# sign certificate
openssl x509 -req -CA cacert.pem -CAkey cacert.key \
        -in server.csr -out server.pem -days 365 \
        -CAcreateserial -extfile server.conf \
        -passin pass:changeit

# Create server.p12
openssl pkcs12 -export -out server.p12 -name "localhost" \
        -inkey server.key -in server.pem \
        -passin pass:changeit \
        -passout pass:changeit

# Create keystore.p12 with JDK keytool
keytool -importkeystore -srckeystore server.p12 \
        -srcstoretype pkcs12 -destkeystore keystore.p12 \
        -deststoretype pkcs12 \
        -deststorepass changeit -srcstorepass changeit

# Create truststore.jks
keytool -import -trustcacerts -noprompt -alias ca \
        -ext san=dns:localhost,ip:127.0.0.1 \
        -file cacert.pem -keystore truststore.jks \
        -storepass changeit -keypass changeit
```

## Sample Kestra configuration with SSL enabled

Enable HTTPS through the `micronaut` configuration settings. These are set at the root level within the [Kestra configuration](../configuration/index.md).

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
If Kestra tasks make outbound calls to other services, secure the process by configuring SSL for outbound traffic. You can accomplish this in your [Kestra configuration](../configuration/index.md) file by passing the following JVM options in the `JAVA_OPTS` environment variable:

```yaml
JAVA_OPTS: "-Djavax.net.ssl.trustStore=/app/ssl/truststore.jks -Djavax.net.ssl.trustStorePassword=changeit"
```

Below is an example configuration file with the newly added environment variable:

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
      JAVA_OPTS: "-Djavax.net.ssl.trustStore=/app/ssl/truststore.jks -Djavax.net.ssl.trustStorePassword=changeit" # Add in the JVM options as an environment variable
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

To enable CSRF protection, you must ensure that your instance has TLS/SSL enabled.
Once this is configured, add the following to your configuration file:

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

1. **Install cert-manager** (automates certificate management — to select a different version, check the [available releases on GitHub](https://github.com/cert-manager/cert-manager/releases)):
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

1. **Generate certificates** using the OpenSSL commands from the previous section.

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
```
NAME        READY   SECRET      AGE
kestra-tls  True    kestra-tls  5m
```
