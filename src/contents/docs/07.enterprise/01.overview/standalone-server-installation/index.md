---
title: Install Kestra Enterprise from Standalone JAR
description: Install Kestra on a standalone server with a simple executable file.
sidebarTitle: Standalone Server Installation Guide
icon: /src/contents/docs/icons/installation.svg
editions: ["EE"]
---

Install Kestra on a standalone server with a simple executable file.

## Run Kestra Enterprise from a standalone JAR

To deploy Kestra without Docker, there's a standalone JAR available that allows deployment in any environment that has JVM version 21+.

## Instructions

The following is a quick start guide to get your Kestra Enterprise Edition up and running in standalone mode.

---

## Standalone JAR

Download the latest version of the Kestra EE JAR from:

[http://registry.kestra.io/exe/latest](http://registry.kestra.io/exe/latest)

**Credentials:**

- **Username**: `license-id`
- **Password**: `fingerprint`

:::alert{type="info"}
Make sure to store your credentials in an `application.yaml` file.
:::

This provides a single JAR file that can be used to start Kestra. Store the file in your execution environment as `kestra` (make it executable).

To make the file executable, Linux or MacOS users use the following with filename:

```bash
chmod +x kestra-ee-VERSION # Replace VERSION with your version
```

Or with a file path:

```bash
mv kestra-ee-VERSION /usr/local/bin/kestra # Replace with your version and execution environment file path
chmod +x /usr/local/bin/kestra
```

The file is then executable with:

```bash
./kestra-ee-VERSION server standalone # Replace VERSION with your version
```

:::alert{type="info"}
You need to provide a configuration with a connection to a database.
:::

---

For Windows users:

```powershell
java -jar kestra-ee-VERSION # Replace VERSION with your version
```

Or with a file path assuming execution from the current directory:

```powershell
java -jar kestra-ee-VERSION server standalone -c ./application.yaml -p ./plugins --port=8080 # Replace VERSION with your version
```

---

## Plugins

In standalone JAR deployments, all plugins must be downloaded separately.

Kestra EE provides a command to install all available plugins:

```shell
## Install all available plugins
kestra plugins install --all
```

This installs task plugins in the `plugins` directory. To install them elsewhere, specify a path with the `-p` argument.

Additional Enterprise Edition plugins that are not task related may also be required -- such as secrets or storage plugins.

---

## Secret plugins

Secret plugins must be downloaded from the Kestra registry using the same credentials, and placed in your `plugins` directory.

| Secret Service | Download Link |
| :------------- | :------------- |
| Vault | https://registry.kestra.io/maven/io/kestra/ee/secret/secret-vault/0.24.0/secret-vault-0.24.0.jar |
| AWS | https://registry.kestra.io/maven/io/kestra/ee/secret/secret-aws/0.24.0/secret-aws-0.24.0.jar |
| GCP | https://registry.kestra.io/maven/io/kestra/ee/secret/secret-gcp/0.24.0/secret-gcp-0.24.0.jar |
| Azure | https://registry.kestra.io/maven/io/kestra/ee/secret/secret-azure/0.24.0/secret-azure-0.24.0.jar |

---

## MinIO Internal Storage

To enable MinIO storage, install the storage plugin:

```shell
## Install MinIO internal storage plugin
kestra plugins install io.kestra.storage:storage-minio:LATEST
```

---

## Enterprise deployment configuration

For the full list of configuration options, refer to the [Configuration Reference](https://kestra.io/docs/configuration).

To enable Kestra Enterprise features, configure the following parameters:

| Configuration Parameter | Required | Documentation Link                                                                                                                 | Description |
| :---------------------- | :------- |:-----------------------------------------------------------------------------------------------------------------------------------| :---------- |
| Enterprise License | Yes | [EE License](../../../configuration/index.md#ee-license)                                                                           | License information for the Kestra instance |
| Multi-tenancy | Yes | [Multi-tenancy](../../../configuration/index.md#multi-tenancy)                                                                     | Enables/disables multi-tenancy (required for SCIM) |
| Secret Manager | Yes | [Secret Managers](../../../configuration/index.md#secret-managers)                                                                 | Configure a secret manager in RW or RO mode |
| Encryption Key | Yes | [Encryption](../../../configuration/index.md#encryption)                                                                           | Key to encrypt inputs/outputs in flows |
| Security | No | [Security](../../../configuration/index.md#security)                                                                               | Configure Super Admin (also settable in UI on startup) |
| User Invitations | No | [Kestra URL](../../../configuration/index.md#kestra-url), [Mail Server](../../../configuration/index.md#configuring-a-mail-server) | Required for email invitations (not needed with LDAP/SCIM) |
| SSO | No | [SSO](../../03.auth/sso/index.md)                                                                                                  | Configure OIDC provider |
| LDAP | No | [LDAP](../../03.auth/sso/ldap/index.md)                                                                                            | Connect to an existing LDAP provider |
| SCIM | No | [SCIM](../../03.auth/scim/index.mdx)                                                                                               | Sync user/group membership with SCIM 2.0 |

---

## Starting Kestra

Kestra can be started in **standalone mode** or in a **distributed setup** for production.

Make sure to have a database configured and your Enterprise credentials stored in the `application.yaml` file.

---

## Standalone server

```shell
kestra server standalone -c ./application.yaml -p ./plugins --port=8080
```

This starts Kestra as a standalone service on port `8080`.

---

## Distributed mode

For production usage, Kestra should run in distributed mode for scalability and high availability.

Each component can run independently across servers, with shared access to the same database (no TCP communication is required between components).

Example with all components on one server:

```shell
kestra server webserver -c ./application.yaml -p ./plugins --port=8080
kestra server scheduler -c ./application.yaml -p ./plugins --port=8081
kestra server worker -c ./application.yaml -p ./plugins --port=8082
kestra server executor -c ./application.yaml -p ./plugins --port=8083
```
