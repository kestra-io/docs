---
order: 1
---
# Gradle configuration

We use [gradle](https://gradle.org/) as built tool in Kestra.


## Mandatory configuration 
The first thing you need to configure is the plugin name & the class package. 

1. change in `settings.gradle` the `rootProject.name = 'plugin-template'` with your plugin name. 
2. change the class package: by default, the template provide a package `org.kestra.task.templates`, just rename the folder in `src/main/java` & `src/test/java` 
3. change the package name on `build.gradle`: replace `group "org.kestra.task.templates"` to the package name.


Now you can start [develop your task](docs/plugin-developer-guide/runnable-task) or look at other optional gradle configuration.

## Others configurations 

### Include some dependencies on plugins

You can add as many dependencies with your plugins, that will be isolated in Kestra runtimes. By this way, we ensure the 2 different libs will not clash and have some runtime errors about missing methods. 

The `build.gradle` handle most of Kestra use case by default using `compileOnly group: "org.kestra", name: "core", version: kestraVersion` for Kestra libs.

But if your plugin need some dependencies, you can add as many as you want that will be isolated, you just add to provide an `api` dependencies : 

```groovy
api group: 'com.google.code.gson', name: 'gson', version: '2.8.6'
```


