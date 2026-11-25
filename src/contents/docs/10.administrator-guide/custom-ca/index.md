---
title: "Trust a Custom CA in Kestra: Docker and Kubernetes"
h1: Trust an internal CA for outbound HTTPS connections
sidebarTitle: Custom CA Certificates
icon: /src/contents/docs/icons/padlock.svg
description: Add an internal or self-signed root CA to the Kestra JVM truststore on Docker, Docker Compose, or Kubernetes, and keep it current across upgrades.
---

Add your internal root certificate authority (CA) to the Kestra JVM truststore so tasks can call HTTPS services signed by that CA.

Without it, tasks that connect to those services fail with:

```plaintext
javax.net.ssl.SSLHandshakeException: PKIX path building failed: unable to find valid certification path to requested target
```

## When you need a custom truststore

You need this setup when Kestra connects over HTTPS to an endpoint whose certificate chains to a CA that the JVM doesn't ship with:

- **Internal services.** APIs, artifact registries, or object storage whose certificates are signed by a private or self-signed CA.
- **The Kestra API itself.** Tasks in the [Kestra plugin](/plugins/plugin-kestra) call the Kestra API at `kestraUrl`, which defaults to the [`kestra.url`](../webserver-url/index.md) setting. If `kestra.url` is served with a certificate from an internal CA, these tasks fail with the same `PKIX path building failed` error, even though they run inside Kestra. See [Kestra plugin tasks](#kestra-plugin-tasks) for an alternative that avoids the truststore.
- **Your identity provider (Enterprise Edition).** The webserver fetches the OpenID Connect discovery document from the issuer URL at startup. If that fetch fails, Kestra still starts, but SSO login returns HTTP 500 with `Failed to retrieve OpenID configuration`.

The JVM truststore covers outbound connections made by the Kestra JVM. Other TLS settings have their own configuration:

| Connection | Configured with |
| --- | --- |
| Browsers and API clients connecting to Kestra over HTTPS | `micronaut.server.ssl`. See [Configure SSL for Kestra](../ssl-configuration/index.md). |
| Workers connecting to the controller over gRPC (Enterprise Edition) | `kestra.grpc.tls.trust-store`. See [Worker Groups transport security](../../07.enterprise/04.scalability/worker-group/index.md#transport-security-tls). |
| Commands run by script tasks, such as Python or Shell scripts | A CA bundle passed to the script's runtime. See [Script tasks](#script-tasks). |

## How the JVM truststore works

The JVM ships with a default truststore, `cacerts`, that holds the public CAs. Setting `-Djavax.net.ssl.trustStore` **replaces** that default; it doesn't add to it. The truststore you point Kestra at must therefore hold the image's `cacerts` **plus** your internal CA.

:::alert{type="warning"}
Don't point `javax.net.ssl.trustStore` at a file that holds only your internal CA. Kestra then stops trusting every public endpoint, including cloud APIs, GitHub, and SaaS services, and those tasks fail with the same `PKIX path building failed` error.
:::

Import your internal **root** CA, not the server certificates it signs. Server certificates are renewed often, and each renewal would break trust; the root CA stays valid for years and covers every certificate it issues.

## Prerequisites

- The root CA certificate in PEM format. The examples use `internal-root-ca.pem`.
- Docker, to read `cacerts` from the Kestra image and run `keytool`. The Kestra image ships `keytool`, so you don't need a local JDK.
- For Kubernetes: `kubectl` and `helm` access to the namespace where Kestra runs.

## Build the truststore

Build the truststore from the same Kestra image tag that you deploy. The steps are the same for Docker, Docker Compose, and Kubernetes.

1. **Set the image** to the exact tag you run, and place your root CA in a working directory:

   ```bash
   KESTRA_IMAGE=registry.kestra.io/docker/kestra:latest  # replace with the tag you deploy
   mkdir -p ssl
   cp /path/to/internal-root-ca.pem ssl/
   ```

2. **Copy `cacerts` out of the image.** The file is already in PKCS12 format, so no conversion is needed:

   ```bash
   docker run --rm --entrypoint cat "$KESTRA_IMAGE" \
     /opt/java/openjdk/lib/security/cacerts > ssl/truststore.p12
   ```

   On Kubernetes, you can instead copy it from a running pod with `kubectl cp $NAMESPACE/$POD_NAME:/opt/java/openjdk/lib/security/cacerts ./ssl/truststore.p12`.

3. **Import the root CA** with the `keytool` bundled in the image:

   ```bash
   docker run --rm --user "$(id -u):$(id -g)" -v "$PWD/ssl:/ssl" \
     --entrypoint keytool "$KESTRA_IMAGE" \
     -importcert -noprompt \
     -alias internal-root-ca \
     -file /ssl/internal-root-ca.pem \
     -keystore /ssl/truststore.p12 \
     -storepass changeit
   ```

   If you have a JDK installed locally, you can run the same `keytool -importcert` command directly against `ssl/truststore.p12`.

4. **Verify the truststore** holds both your CA and the public CAs:

   ```bash
   docker run --rm -v "$PWD/ssl:/ssl:ro" --entrypoint keytool "$KESTRA_IMAGE" \
     -list -keystore /ssl/truststore.p12 -storepass changeit | grep -E "contains|internal-root-ca"
   ```

   The output lists your alias and a total of more than 100 entries:

   ```plaintext
   Your keystore contains 118 entries
   internal-root-ca, Nov 24, 2026, trustedCertEntry,
   ```

   If the total is 1, you imported into an empty truststore instead of a copy of `cacerts`. Restart from step 2.

`changeit` is the default `cacerts` password. If you change it with `keytool -storepasswd`, use the new value in every command and in `JAVA_OPTS`.

## Configure Kestra to use the truststore

Mount `truststore.p12` into the Kestra container and point the JVM at it with `JAVA_OPTS`. If you already set `JAVA_OPTS`, append these flags to the existing value.

Apply the truststore to every Kestra server that makes outbound calls: workers run tasks, and the webserver calls your identity provider. A standalone server covers both. In a distributed deployment, configure each component, including workers that run outside the cluster or on other Docker hosts.

### Docker Compose

Add a bind mount and the `JAVA_OPTS` variable to the Kestra service:

```yaml
services:
  kestra:
    image: registry.kestra.io/docker/kestra:latest
    volumes:
      - ./ssl/truststore.p12:/app/ssl/truststore.p12:ro
      # ...your existing volumes
    environment:
      JAVA_OPTS: >-
        -Djavax.net.ssl.trustStore=/app/ssl/truststore.p12
        -Djavax.net.ssl.trustStorePassword=changeit
        -Djavax.net.ssl.trustStoreType=PKCS12
      # ...your existing environment variables
```

Recreate the container to apply the change:

```bash
docker compose up -d kestra
```

### Docker

Add the same mount and variable to your `docker run` command. For example:

```bash
docker run -d --name kestra \
  -v "$PWD/ssl/truststore.p12:/app/ssl/truststore.p12:ro" \
  -e JAVA_OPTS="-Djavax.net.ssl.trustStore=/app/ssl/truststore.p12 -Djavax.net.ssl.trustStorePassword=changeit -Djavax.net.ssl.trustStoreType=PKCS12" \
  -p 8080:8080 \
  "$KESTRA_IMAGE" server local
```

### Kubernetes with Helm

1. **Create a Secret** from the truststore. The `truststore.p12=` prefix sets the key name, which becomes the mounted filename:

   ```bash
   kubectl create secret generic kestra-truststore \
     --from-file=truststore.p12=ssl/truststore.p12 \
     -n $NAMESPACE --save-config
   ```

2. **Mount the Secret and set `JAVA_OPTS`** in your `values.yaml`:

   ```yaml
   common:
     extraVolumes:
       - name: truststore
         secret:
           secretName: kestra-truststore
     extraVolumeMounts:
       - name: truststore
         mountPath: /app/ssl
         readOnly: true
     extraEnv:
       - name: JAVA_OPTS
         value: >-
           -Djavax.net.ssl.trustStore=/app/ssl/truststore.p12
           -Djavax.net.ssl.trustStorePassword=changeit
           -Djavax.net.ssl.trustStoreType=PKCS12
   ```

   Values under `common` apply to every component the chart deploys, including worker groups.

3. **Apply the values:**

   ```bash
   helm upgrade --install $RELEASE_NAME kestra/kestra -n $NAMESPACE -f values.yaml
   ```

:::alert{type="warning"}
The chart doesn't merge `extraEnv` entries by name. A `JAVA_OPTS` set in a component's own `extraEnv`, such as `deployments.worker.extraEnv`, is added next to the one from `common`, so the container gets two `JAVA_OPTS` entries. Helm 4 then rejects the install with `duplicate entries for key [name="JAVA_OPTS"]`. With client-side apply (Helm 3, or Helm 4 with `--server-side=false`), the component's value wins and the truststore flags are lost.

Set `JAVA_OPTS` in one place only: in `common.extraEnv`, or in the `extraEnv` of each component, with the truststore flags included. To add other JVM options to a single component, use `deployments.<component>.jvm.extraOpts` instead.
:::

## Verify outbound connections

Run a flow that calls one internal endpoint and one public endpoint. Both tasks must succeed:

```yaml
id: truststore_check
namespace: company.team

tasks:
  - id: internal_endpoint
    type: io.kestra.plugin.core.http.Request
    uri: https://internal.example.com/

  - id: public_endpoint
    type: io.kestra.plugin.core.http.Request
    uri: https://api.github.com/
```

- If `internal_endpoint` fails with `PKIX path building failed`, the JVM isn't using your truststore, or the truststore doesn't hold the CA that signed the server certificate. Check the value inside the container, for example with `docker compose exec kestra sh -c 'echo $JAVA_OPTS'`, and check the alias with the verification command in [Build the truststore](#build-the-truststore).
- If `public_endpoint` fails, the truststore holds only your CA. Rebuild it from `cacerts`. Other features that call public services, such as community blueprints, fail the same way.

## Kestra plugin tasks

Tasks in the Kestra plugin can reach the Kestra API on its internal address instead of `kestra.url`, which avoids TLS for those calls. Set the default endpoint for all tasks in your configuration:

```yaml
kestra:
  tasks:
    sdk:
      authentication:
        url: http://kestra:8080 # internal service address
        username: admin@example.com
        password: "<password>"
```

To change a single task, set its `kestraUrl` property instead. Credentials sent to a plain HTTP address are not encrypted, so use this only on a network you trust. Otherwise, use the truststore.

## Script tasks

Script tasks run their commands in a separate process or container, which doesn't use the Kestra JVM truststore. Pass a CA bundle to the runtime instead, and build it from the image's system bundle plus your CA. As with the JVM, some clients replace their default CAs with the file you give them; `requests` is one of them.

Upload `internal-root-ca.pem` as a [namespace file](../../06.concepts/02.namespace-files/index.md), then pass it to the task:

```yaml
id: script_with_internal_ca
namespace: company.team

tasks:
  - id: call_internal_api
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:3.12-slim
    inputFiles:
      internal-root-ca.pem: "{{ read('internal-root-ca.pem') }}"
    beforeCommands:
      - cat /etc/ssl/certs/ca-certificates.crt internal-root-ca.pem > ca-bundle.pem
      - pip install requests
    env:
      SSL_CERT_FILE: ca-bundle.pem
      REQUESTS_CA_BUNDLE: ca-bundle.pem
    script: |
      import requests
      print(requests.get("https://internal.example.com/").status_code)
```

- Set `REQUESTS_CA_BUNDLE` for `requests` and the Kestra Python library, which ignore `SSL_CERT_FILE`.
- Create the bundle before any command that downloads packages, such as `pip install`: the variables apply to `beforeCommands` too.
- The system bundle path depends on the image. `/etc/ssl/certs/ca-certificates.crt` applies to Debian, Ubuntu, and Alpine images.
- For `curl`, pass the bundle with `--cacert ca-bundle.pem`.

## Keep the truststore current

The `cacerts` you copied freezes the JDK's list of public CAs at the image version you took it from. Kestra images pick up JDK updates, including in patch releases, and JDK updates add new CAs and remove distrusted ones. A truststore mounted from an older image misses the new CAs and keeps trusting removed ones.

Rebuild the truststore:

- **On every Kestra upgrade, including patch releases.** Repeat [Build the truststore](#build-the-truststore) with the new image tag, then replace the mounted file before you start the new version. On Kubernetes, update the Secret before running `helm upgrade`:

  ```bash
  kubectl create secret generic kestra-truststore \
    --from-file=truststore.p12=ssl/truststore.p12 \
    -n $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
  ```

  The JVM reads the truststore at startup, so a running Kestra keeps the old file until its pods or containers restart.
- **When your internal root CA rotates.** Import the new root under a new alias, and keep the old alias until no server presents a certificate signed by the old root.

### Alternative: bake the CA into a custom image

If you build your own Kestra image, import the CA into the image's `cacerts` at build time. The CA list then follows each base image you build from, and you don't need `JAVA_OPTS` or a mounted file:

```dockerfile
FROM registry.kestra.io/docker/kestra:latest
USER root
COPY internal-root-ca.pem /tmp/internal-root-ca.pem
RUN keytool -importcert -cacerts -noprompt \
      -alias internal-root-ca \
      -file /tmp/internal-root-ca.pem \
      -storepass changeit \
 && rm /tmp/internal-root-ca.pem
USER kestra
```

Rebuild the image for every Kestra version you deploy.
