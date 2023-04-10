---
order: 10
---
# Build a plugin

Kestra plugin template includes a Gradle task in order to build your plugin. 

Use `./gradlew shadowJar` to build your plugin.

This jar will be generated on the `build/libs` directory. 

Just drop this jar on the Kestra plugins path and it will be usable by your Kestra instance.
