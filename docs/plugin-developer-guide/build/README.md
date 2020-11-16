---
order: 7
---
# Build a plugin

Kestra template include a gradle task in order to build your plugin. 

Simple use `./gradlew shadowJar` to build your plugin.

The jar will be generated on the `build/libs/*.jar` directory. 

Just drop this jar on the Kestra plugins path and it will be usable by your Kestra instance.
