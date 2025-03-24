---
title: Versioned Plugins
icon: /docs/icons/admin.svg
editions: ["EE"]
version: "0.22.0"
---

Use multiple versions of a plugin depending on your instance requirements and upgrade path.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/h-vmMGlTGM8?si=BC_157leuRzfC0yt" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Versioned plugins are an enterprise feature that simplifies the upgrade process. They allow you to pin older plugin versions to your production and legacy flows while using the latest version for newer flows, enabling granular version control in your Kestra instance.

## Install versioned plugins

Versioned plugins can be installed from the Kestra UI as well as programmatically.

### From the UI

Both Kestra official plugins and custom plugins can be installed from the UI. Navigate to the **Administration > Instance** section and then **Versioned Plugins**. From here, you can click **+ Install** and open up the full library of available plugins.

![versioned-plugins-1](/docs/enterprise/versioned-plugins-1.png)

From the list, search and select the plugin to install and select the version.

![versioned-plugins-2](/docs/enterprise/versioned-plugins-2.png)

After installing some plugins, your full list of versioned plugins are displayed. Kestra alerts you that a newer version of your plugin is available and gives you the capability to upgrade singular plugins as needed rather than all plugins to their newest version.

![versioned-plugins-3](/docs/enterprise/versioned-plugins-3.png)

### From the CLI and API

## Configuration

## Other capabilities

- add support for internal storage as plugin repository
- add support for plugins auto-reloading