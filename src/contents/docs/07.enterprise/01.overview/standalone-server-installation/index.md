---
title: Install Kestra Enterprise from Standalone JAR
h1: Run Kestra Enterprise Without Docker Using a JAR File
description: Install Kestra Enterprise on a standalone server using an executable JAR file. Run the platform without Docker where containerization is unavailable.
sidebarTitle: Standalone Server Installation Guide
icon: /src/contents/docs/icons/installation.svg
editions: ["EE"]
---

To deploy Kestra without Docker, use the standalone JAR — a single executable that runs in any environment with JVM 21+.

## Standalone JAR

Download the Kestra EE JAR from `https://registry.kestra.io/exe/` using your license ID and fingerprint as Basic auth credentials. Use `/exe/latest` for the latest release or pin a specific version:

```bash
# Latest
curl -u "$LICENSE_ID:$LICENSE_FINGERPRINT" https://registry.kestra.io/exe/latest | funzip > kestra-ee

# Specific version
VERSION=2.0.3
curl -u "$LICENSE_ID:$LICENSE_FINGERPRINT" https://registry.kestra.io/exe/$VERSION | funzip > kestra-ee
```

This provides a single executable file. Store it in your execution environment as `kestra`.

Make the file executable (Linux or macOS):

```bash
chmod +x kestra-ee-VERSION # Replace VERSION with your version
```

Or with a file path:

```bash
mv kestra-ee-VERSION /usr/local/bin/kestra # Replace with your version and execution environment file path
chmod +x /usr/local/bin/kestra
```

Then run:

```bash
./kestra-ee-VERSION server standalone # Replace VERSION with your version
```

:::alert{type="info"}
You need to provide a configuration with a connection to a database.
:::

For Windows users:

```powershell
java -jar kestra-ee-VERSION # Replace VERSION with your version
```

Or with a file path assuming execution from the current directory:

```powershell
java -jar kestra-ee-VERSION server standalone -c ./application.yaml -p ./plugins --port=8080 # Replace VERSION with your version
```

## Plugins

In standalone JAR deployments, all plugins must be downloaded separately.

[Install `kestractl`](../../../kestra-cli/kestractl/index.md#installation), then download plugins with [`kestractl plugins download`](../../../kestra-cli/kestractl/index.md#plugin-management). Enterprise plugins are served from the Kestra registry, so pass your license credentials:

```shell
kestractl plugins download <version> \
  --plugins-dir ./plugins \
  --maven-repository https://registry.kestra.io/maven \
  --maven-username "$KESTRA_LICENSE_ID" \
  --maven-password "$KESTRA_LICENSE_FINGERPRINT"
```

Replace `<version>` with your Kestra version. This downloads every plugin compatible with that version. To download only selected plugins, pass `--compatible-for <version>` with one `--plugins` flag per plugin instead of the version argument. Start Kestra with `-p ./plugins` or set `KESTRA_PLUGINS_PATH` to that directory.

The server CLI can also install plugins directly, for example `kestra plugins install --all`.

## Secret and storage plugins

Secret managers and storage backends other than local storage also ship as separate plugins. To list the ones your configuration requires, pass your configuration file to `kestractl`:

```shell
kestractl plugins list <version> --from-config /etc/kestra/application.yaml
```

Download them into the same `plugins` directory with the same registry credentials:

```shell
kestractl plugins download <version> \
  --from-config /etc/kestra/application.yaml \
  --plugins-dir ./plugins \
  --maven-repository https://registry.kestra.io/maven \
  --maven-username "$KESTRA_LICENSE_ID" \
  --maven-password "$KESTRA_LICENSE_FINGERPRINT"
```

See [Bootstrap core plugins with `--from-config`](../../../kestra-cli/kestractl/index.md#bootstrap-core-plugins-with---from-config) for the supported backends.

## Enterprise deployment configuration

For the full list of configuration options, refer to the [Configuration Reference](https://kestra.io/docs/configuration).

To enable Kestra Enterprise features, configure the following parameters:

| Configuration Parameter | Required | Documentation Link                                                                                                                 | Description |
| :---------------------- | :------- |:-----------------------------------------------------------------------------------------------------------------------------------| :---------- |
| Enterprise License | Yes | [Enterprise and Advanced Features](../../../configuration/06.enterprise-and-advanced/index.md)                                     | License information for the Kestra instance |
| Multi-tenancy | Yes | [Enterprise and Advanced Features](../../../configuration/06.enterprise-and-advanced/index.md)                                     | Enables/disables multi-tenancy (required for SCIM) |
| Secret Manager | Yes | [Security and Secrets](../../../configuration/05.security-and-secrets/index.md)                                                   | Configure a secret manager in RW or RO mode |
| Encryption Key | Yes | [Security and Secrets](../../../configuration/05.security-and-secrets/index.md)                                                   | Key to encrypt inputs/outputs in flows |
| Security | No | [Security and Secrets](../../../configuration/05.security-and-secrets/index.md)                                                   | Configure Instance Owner (also settable in UI on startup) |
| User Invitations | No | [Runtime and Storage](../../../configuration/02.runtime-and-storage/index.md), [Observability and Networking](../../../configuration/03.observability-and-networking/index.md) | Required for email invitations (not needed with LDAP/SCIM) |
| SSO | No | [SSO](../../03.auth/sso/index.md)                                                                                                  | Configure OIDC provider |
| LDAP | No | [LDAP](../../03.auth/sso/ldap/index.md)                                                                                            | Connect to an existing LDAP provider |
| SCIM | No | [SCIM](../../03.auth/scim/index.mdx)                                                                                               | Sync user/group membership with SCIM 2.0 |

## Starting Kestra

Kestra can be started in **standalone mode** or in a **distributed setup** for production.

Ensure a database is configured and your Enterprise credentials are stored in `application.yaml`.

## Standalone server

```shell
kestra server standalone -c ./application.yaml -p ./plugins --port=8080
```

This starts Kestra as a standalone service on port `8080`.

## Distributed mode

For production, run Kestra in distributed mode for scalability and high availability.

Each component can run independently across servers, with shared access to the same database (no TCP communication is required between components).

Example with all components on one server:

```shell
kestra server webserver -c ./application.yaml -p ./plugins --port=8080
kestra server scheduler -c ./application.yaml -p ./plugins --port=8081
kestra server worker -c ./application.yaml -p ./plugins --port=8082
kestra server executor -c ./application.yaml -p ./plugins --port=8083
```
