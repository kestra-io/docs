---
title: Versioned Plugins
icon: /docs/icons/admin.svg
editions: ["EE", "BETA"]
version: "0.22.0"
---

Use multiple versions of a plugin depending on your instance requirements and upgrade path.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/h-vmMGlTGM8?si=BC_157leuRzfC0yt" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Versioned plugins are an enterprise feature that simplifies the upgrade process. They allow you to pin older plugin versions to your production and legacy flows while using the latest version for newer flows, enabling granular version management in your Kestra instance.

## Configuration

Versioned plugins support several properties that can be modified in your Kestra configuration:

- `remoteStorageEnabled`: Specifies whether remote storage is enabled (i.e., plugins are stored on the internal storage).
- `localRepositoryPath`: The local path where managed plugins will be synced.
- `autoReloadEnabled`: The interval at which the Kestra server checks for new or removed plugins.
- `autoReloadInterval`: The default version to be used when no version is specified for a plugin.
- `defaultVersion`: Accepted are: 'latest', 'current', 'oldest', 'none', or a specific version (e.g., 0.20.0)

An example configuration looks as follows:

```yaml
kestra: 
  plugins:
      management:
        enabled: true # setting to false will make Versioned plugin tab disappear + API will return an error
        remoteStorageEnabled: true
        customPluginsEnabled: true # setting to false will disable installing or uploading custom plugins
        localRepositoryPath: /tmp/kestra/plugins-repository
        autoReloadEnabled: true
        autoReloadInterval: 60s
        defaultVersion: LATEST 
```

With remote storage enabled, installed plugins are stored in a plugins repository in the `_plugins/repository` path. For example, the below paths show the storage for 0.19.0 and 0.20.0 versions of the Shell script plugin:

```bash
_plugins/repository/io_kestra_plugin__plugin-script-shell__0_19_0
_plugins/repository/io_kestra_plugin__plugin-script-shell__0_19_0.jar
_plugins/repository/io_kestra_plugin__plugin-script-shell__0_20_0
_plugins/repository/io_kestra_plugin__plugin-script-shell__0_20_0.jar
```

Artifact files are renamed using the format: `<groupId>__<artifactId>__<version>` to be easily parseable (dots `.` are replaced with `_` for `groupId` and `version`).

For locally stored plugins configured by the `localRepositoryPath` attribute, the file path looks like `/tmp/kestra/plugins-repository`. For example, the following plugins are stored locally where the local repository contains a JSON `plugins.meta` file that contains metadata about remote plugins. This file is used for the synchronization where only plugins with detected changes are synchronized.

```bash
├── io_kestra_plugin__plugin-kafka__0_20_0.jar
├── io_kestra_plugin__plugin-script-shell__0_20_0.jar
├── io_kestra_plugin__plugin-terraform__0_20_0.jar
├── io_kestra_plugin__plugin-transform-grok__0_20_0.jar
└── plugins.meta
```

## Install versioned plugins

Versioned plugins can be installed from the Kestra UI as well as programmatically.

### From the UI

Both Kestra official plugins and custom plugins can be installed from the UI. Navigate to the **Administration > Instance** section and then **Versioned Plugins**. From here, you can click **+ Install** and open up the full library of available plugins.

![versioned-plugins-1](/docs/enterprise/versioned-plugins/versioned-plugins-1.png)

From the list, search and select the plugin to install and select the version.

![versioned-plugins-2](/docs/enterprise/versioned-plugins/versioned-plugins-2.png)

After installing plugins, the full list of versioned plugins is displayed. Kestra alerts you that a newer version of your plugin is available and allows you to upgrade by installing the plugin's latest version. When upgrading, this preserves the previous version of the plugin and adds a separate, fresh installation of the latest version.

![versioned-plugins-3](/docs/enterprise/versioned-plugins/versioned-plugins-3.png)

For a custom plugin, after clicking **+ Install**, switch from Official plugin to Custom plugin. You need to specify two identifiers for each custom plugin installation:

- Group ID: The group identifier of the plugin to be installed.
- Artifact ID: The artifact identifier of the plugin to be installed.

![versioned-plugins-5](/docs/enterprise/versioned-plugins/versioned-plugins-4.png)

Additionally, instead of installing a new plugin, you can **Upload** a plugin by choosing a valid Java archive file (`.jar`).

![versioned-plugins-4](/docs/enterprise/versioned-plugins/versioned-plugins-5.png)

### From the API

Only Super Admin users can install versioned plugins with the API. To install a versioned plugin, you can use the following API POST request with either your username and password with `-u` or an [API token](../03.auth/api-tokens.md).

With Kestra username and password:

```bash
curl -X POST http://0.0.0.0:8080/api/v1/cluster/versioned-plugins/install \
-u 'admin@kestra.io:kestra' \
-H "Content-Type: application/json" \
-d '{"plugins":["io.kestra.plugin:plugin-airbyte:0.21.0"]}'
```

With API Token:

```bash
curl -X POST http://0.0.0.0:8080/api/v1/cluster/versioned-plugins/install /
-H "Authorization: Bearer YOUR-API-TOKEN" \
-H "Content-Type: application/json" \
-d '{"plugins":["io.kestra.plugin:plugin-airbyte:0.21.0"]}'
```

To uninstall a versioned plugin, use the following DELETE request:

```bash
curl -X DELETE http://0.0.0.0:8080/api/v1/cluster/versioned-plugins/uninstall \
-u 'admin@kestra.io:kestra' \
-H "Content-Type: application/json" \
-d '{"plugins":["io.kestra.plugin:plugin-airbyte:0.21.0"]}'
```

To check for all available versions of a plugin, you can use the following API request to resolve:

```bash
curl -X POST http://0.0.0.0:8080/api/v1/cluster/versioned-plugins/resolve \
-u 'admin@kestra.io:kestra' \
-H "Content-Type: application/json" \
-d '{"plugins":["io.kestra.plugin:plugin-airbyte:0.21.0"]}'
```

If you want to install a newer version of a plugin, use the install request with the specified version, or use `LATEST` in place of the version number. This creates a second, separate installation of the plugin, so you can keep using an old version in production flows and test using the newer version in development.

```bash
curl -X POST http://0.0.0.0:8080/api/v1/cluster/versioned-plugins/install \
-u 'admin@kestra.io:kestra' \
-H "Content-Type: application/json" \
-d '{"plugins":["io.kestra.plugin:plugin-airbyte:LATEST"]}'
```

### From the CLI

To install versioned plugins from the [Kestra CLI](../../ee-server-cli/index.md), you can use the following command:

```bash
./kestra plugins install --locally=false io.kestra.plugin:plugin-jdbc-duckdb:0.21.2
```

The `--locally` flag specifies whether the plugin should be installed locally or according to your Kestra configuration where remote storage can be enabled. 

-`--locally=true` installs the plugin locally.
-`--locally=false` checks if `remoteStorageEnabled` is enabled and then plugins are downloaded and pushed to the [configured internal storage](../../configuration/index.md#internal-storage) directly. 
