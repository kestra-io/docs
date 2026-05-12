---
title: Adding a Self-Signed Certificate to Kestra on Kubernetes
h1: Trust a custom CA for outbound connections on Kubernetes
sidebarTitle: Custom CA on Kubernetes
icon: /src/contents/docs/icons/padlock.svg
description: Add a self-signed or internal CA certificate to the JVM truststore in a Kubernetes-based Kestra deployment.
---

Add a self-signed or internal CA certificate to the JVM truststore so Kestra tasks can make outbound calls to services secured by that CA.

## Prerequisites

You need `kubectl`, `keytool` (bundled with the JDK), and `helm`.

The commands use the following variables:

| Variable | Description |
| --- | --- |
| `$NAMESPACE` | Kubernetes namespace where Kestra is running |
| `$WEBSERVER_POD_NAME` | Name of a running Kestra pod (e.g., the webserver or executor) |
| `$ALIAS_FOR_YOUR_DOMAIN` | Unique alias for your certificate (e.g., `my-internal-ca`) |
| `$RELEASE_NAME` | Helm release name for your Kestra installation |

## Steps

1. **Prepare a working directory**:

   ```bash
   mkdir ssl
   cp /path/to/self-signed-certificate.pem ./ssl/
   ```

2. **Retrieve the base keystore from the running pod**: Pull the default Java truststore (`cacerts`) from a running pod to preserve all standard public CAs while you add your own.

   ```bash
   kubectl get po -n $NAMESPACE
   WEBSERVER_POD_NAME=<pod-name-from-above>

   kubectl cp $NAMESPACE/$WEBSERVER_POD_NAME:/opt/java/openjdk/lib/security/cacerts ./ssl/cacerts
   ls -l ./ssl
   ```

3. **Import and convert the certificate**: Import your PEM file into the downloaded truststore:

   ```bash
   keytool -importcert \
     -trustcacerts \
     -file ssl/self-signed-certificate.pem \
     -keystore ssl/cacerts \
     -alias $ALIAS_FOR_YOUR_DOMAIN \
     -storepass changeit \
     -noprompt
   ```

   Convert the modified keystore to PKCS12 format:

   ```bash
   keytool -importkeystore \
     -srckeystore ssl/cacerts \
     -destkeystore ssl/truststore.p12 \
     -deststoretype PKCS12 \
     -srcstorepass changeit \
     -deststorepass changeit
   ```

   Verify your alias is present in the new truststore:

   ```bash
   keytool -list -keystore ssl/truststore.p12 -storetype PKCS12 -storepass changeit | grep $ALIAS_FOR_YOUR_DOMAIN
   ```

   If the command returns a line containing your alias, the import was successful.

4. **Create a Kubernetes Secret**:

   ```bash
   kubectl create secret generic kestra-ssl \
     --from-file=truststore.p12=ssl/truststore.p12 \
     -n $NAMESPACE
   ```

5. **Configure Helm**: Add the following to your `values.yaml` to mount the secret and point the JVM to it:

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
     extraEnv:
       - name: JAVA_OPTS
         value: >-
           -Djavax.net.ssl.trustStore=/app/ssl/truststore.p12
           -Djavax.net.ssl.trustStorePassword=changeit
           -Djavax.net.ssl.trustStoreType=PKCS12
   ```

   Then apply the changes:

   ```bash
   helm upgrade --install $RELEASE_NAME kestra/kestra -n $NAMESPACE -f /path/to/values.yaml
   ```

:::alert{type="info"}
The default Java keystore password is `changeit`. If your organization uses a different password, update it consistently across all `keytool` and `JAVA_OPTS` references above.
:::
