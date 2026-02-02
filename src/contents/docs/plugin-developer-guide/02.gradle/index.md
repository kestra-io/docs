---
title: Gradle Configuration for Kestra Plugins
sidebarTitle: Gradle Configuration
icon: /src/contents/docs/icons/dev.svg
description: Configure Gradle for Kestra plugin development, including dependencies, mandatory settings, and shadow jar creation.
---

We use [Gradle](https://gradle.org/) as a build tool. This page will help you configure Gradle for your plugin.

## Configure Gradle for Kestra plugins

Start by setting the core project metadata and required configuration.

## Mandatory configuration
The first thing you need to configure is the plugin name and the class package.

1. In `settings.gradle`, change the `rootProject.name = 'plugin-template'` with your plugin name.
2. Change the class package: by default, the template provides a package `io.kestra.plugin.templates`, just rename the folder in `src/main/java` & `src/test/java`
3. Change the package name on `build.gradle`: replace `group "io.kestra.plugin.templates"` to the package name.


Now you can start [developing your task](../03.task/index.md) or look at other optional Gradle configuration.

## Include some dependencies on plugins

You can add many dependencies to your plugins, they will be isolated in the Kestra runtime. Thanks to this isolation, we ensure that two different versions of the same library will not clash and have runtime errors due to missing methods.

The `build.gradle` includes the Kestra core library which covers most of the task needs via `compileOnly group: "io.kestra", name: "core", version: kestraVersion`.

If your plugin need some dependencies, you can add as many as you want that will be isolated; you just need to add `api` dependencies:

```groovy
api group: 'com.google.code.gson', name: 'gson', version: '2.8.6'
```
