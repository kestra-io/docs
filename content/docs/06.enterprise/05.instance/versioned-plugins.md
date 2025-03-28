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

After installing plugins, the full list of versioned plugins is displayed. Kestra alerts you that a newer version of your plugin is available and allows you to upgrade each plugin to its latest version as needed.

![versioned-plugins-3](/docs/enterprise/versioned-plugins/versioned-plugins-3.png)

For a custom plugin, after clicking **+ Install**, switch from Official plugin to Custom plugin. You need to specify two identifiers for each custom plugin installation:

- Group ID: The group identifier of the plugin to be installed.
- Artifact ID: The artifact identifier of the plugin to be installed.

![versioned-plugins-5](/docs/enterprise/versioned-plugins/versioned-plugins-4.png)

Additionally, instead of installing a new plugin, you can **Upload** a plugin by choosing a valid Java archive file (`.jar`).

![versioned-plugins-4](/docs/enterprise/versioned-plugins/versioned-plugins-5.png)

### From the CLI and API

Only Super Admin users can install versioned plugins with the API.

## Configuration

## Other capabilities

- add support for internal storage as plugin repository
- add support for plugins auto-reloading