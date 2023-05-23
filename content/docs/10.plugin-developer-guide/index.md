---
title: 🧩 Plugin Developer Guide
---


We provide a plugin template in order to quickly start the development of a new plugins.
This template will create a project that will host a group of plugins, as we usually create multiple plugins for a technology/use case.

## Requirements
Kestra plugins development requirements are:
* [Java](https://java.com) 17 or later.
* [IntelliJ IDEA](https://www.jetbrains.com/idea/) (or any other Java IDE, we provide only help for IntelliJ IDEA).
* [Gradle](https://gradle.org/) (included most of the time with the IDE).


## Create a new plugins

Here are the steps:

1. Go on the [plugin-template](https://github.com/kestra-io/plugin-template) repository.
2. Click on *Use this template*.
3. Choose the github account your want to link and the repository name for the new plugin.
4. Clone the new repository: `git clone git@github.com:{{user}}/{{name}}.git`.
5. Open the cloned directory in IntelliJ IDEA.
6. Enable [annotations processors](https://www.jetbrains.com/help/idea/annotation-processors-support.html).
7. If you are using an IntelliJ IDEA < 2020.03, install the [lombok plugins](https://plugins.jetbrains.com/plugin/6317-lombok) (if not, it's included by default).


Done! You are ready to create a new plugin, here is the directory structure you will have:
![Structure](/docs/plugin-developer-guide/plugins-architecture.png)

As you can see, there is one generated plugin: the `Example` class representing the `Example` plugin (a task).
A project typically hosts multiple plugins. We call a project a group of plugins, and you can have multiple sub-groups inside a project by splitting plugins into different packages. Each package that has a plugin class is a sub-group of plugins.


## Develop a new plugins
In order to customize your plugin to your need, you can follow these guides:

<ChildTableOfContents :max="1" />
