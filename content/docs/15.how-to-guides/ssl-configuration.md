---
title: Configure SSL for Kestra
icon: /docs/icons/padlock.svg
stage: Getting Started
topics:
  - Kestra Concepts
---

Configure secure access via https to the Kestra UI.

This guide will walk through the steps to configure secure access via https to the Kestra UI. 

## Why use SSL/TLS encryption

In short, adding TLS encryption to your environment provides the following benefits:

- Data is encrypted in transit so no sensitive data can be intercepted in so-called "man-in-the-middle" attacks. 

- Adding TLS to your environment provides an added layer of trust, so  your users know the URL they are accessing is genuine - e.g. you want your users to be confident that accessing https://mycompany.kestra.com/ui is a valid internal site. 

For further details, Cloudflare have a good write-up on why you should use https on your site https://www.cloudflare.com/en-gb/learning/ssl/why-use-https/

## Creating self-signed certificates 

To get started in lower environments, you can easily create self-signed certificates using the OpenSSL library. Full details on the various steps and how to examine the certificates and keys in more details can be found in this Micronaut article https://guides.micronaut.io/latest/micronaut-security-x509-maven-groovy.html. 

::alert{type="info"}
While self-signed certificates encrypt traffic, they are considered unsuitable for production usage. They are deemed untrustworthy as they do not come from a trusted Certificate Authority (CA) such as Let's Encrypt. Please follow your organizations best-pratices when choosing the appropriate CA provider.
::

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

Enabling https is accomplished via the `micronaut` configuration settings. These are set at the root level within the Kestra configuration. 

::alert{type="info"}
Ensure that you expose the secure port of the connection if different from the default port! 
::

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
            driverClassName: org.postgresql.Driver
            username: kestra
            password: k3str4
        kestra:
          server:
            basicAuth:
              enabled: false
              username: "admin@kestra.io" # it must be a valid email address
              password: kestra
          repository:
            type: postgres
          storage:
            type: local
            local:
              basePath: "/app/storage"
          queue:
            type: postgres
          tasks:
            tmpDir:
              path: /tmp/kestra-wd/tmp
          ports:
            - "8443:8443"
```
