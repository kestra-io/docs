---
title: Micronaut
icon: /docs/icons/admin.svg
---

How to configure Micronaut options for Kestra.

As Kestra is a Java-based application built with Micronaut, you can configure any Micronaut configuration options.
We will not explain all the possible configuration options, these are available [here](https://docs.micronaut.io/latest/guide/index.html). However, we will provide some tips on the most useful options:


## Configure port
```yaml
micronaut:
  server:
    port: 8086
```

## Configure SSL
[This guide](https://guides.micronaut.io/latest/micronaut-security-x509-maven-groovy.html) will help you configure SSL with Micronaut. A final working configuration would look as follows (considering you would use environment variables injection for passwords):
```yaml
micronaut:
  security:
    x509:
      enabled: true
  ssl:
    enabled: true
  server:
    ssl:
      client-authentication: need
      key-store:
        path: classpath:ssl/keystore.p12
        password: ${KEYSTORE_PASSWORD}
        type: PKCS12
      trust-store:
        path: classpath:ssl/truststore.jks
        password: ${TRUSTSTORE_PASSWORD}
        type: JKS
```

## Configure the timeout or max uploaded file size
A lot of configuration options affect these, here is the default configuration:
```yaml
micronaut:
  server:
    max-request-size: 10GB
    multipart:
      max-file-size: 10GB
      disk: true
    read-idle-timeout: 60m
    write-idle-timeout: 60m
    idle-timeout: 60m
    netty:
      max-chunk-size: 10MB
```

## Changing base path
If behind a reverse proxy, you can change the base path of the application with the following configuration:
```yaml
micronaut:
  server:
    context-path: "kestra-prd"
```


## Changing host resolution
If behind a reverse proxy, you can change host resolution (http/https/domain name) providing the header sent by your reverse proxy:
```yaml
micronaut:
  server:
    host-resolution:
      host-header: Host
      protocol-header: X-Forwarded-Proto
```


## Configuring CORS
In case you run into issues related to CORS policy, say while calling the webhook API from a JS application, you can enable the processing of CORS requests with the following configuration:
```yaml
micronaut:
  server:
    cors:
      enabled: true
```

For more detailed changes like allowing only specific origins or specific methods, you can refer [this guide](https://docs.micronaut.io/latest/guide/index.html#corsConfiguration).
