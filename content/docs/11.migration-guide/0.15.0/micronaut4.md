---
title: Migration to Micronaut 4.3
icon: /docs/icons/migration-guide.svg
release: 0.15.0
---

Kestra 0.15.0 has been migrated to Micronaut 4.3 for improved security. This page explains how to make your custom plugins compatible with this new version.

## Micronaut 4 and Project Reactor

Custom plugins need to be migrated to Micronaut 4.3 in order to be compatible with Kestra 0.15.0 and later.

Make sure to upgrade your `gradle.properties` to the following library versions:

```properties
version=0.15.0-SNAPSHOT
kestraVersion=[0.15,)
micronautVersion=4.3.0
lombokVersion=1.18.30
```

In `gradle.build`, update the dependencies as follows:

```groovy
dependencies {
    // lombok
    annotationProcessor "org.projectlombok:lombok:$lombokVersion"
    compileOnly "org.projectlombok:lombok:$lombokVersion"

    // micronaut
    annotationProcessor platform("io.micronaut.platform:micronaut-platform:$micronautVersion")
    annotationProcessor "io.micronaut:micronaut-inject-java"
    annotationProcessor "io.micronaut.validation:micronaut-validation-processor"

    compileOnly platform("io.micronaut.platform:micronaut-platform:$micronautVersion")
    compileOnly "io.micronaut:micronaut-inject"
    compileOnly "io.micronaut.validation:micronaut-validation"

    // kestra
    compileOnly group: "io.kestra", name: "core", version: kestraVersion

    // other libs go here
}
```

Note that some libraries are no longer included by default in Micronaut 4.3. For instance:
- if you use Jackson in your custom plugin, you need to add ` compileOnly "io.micronaut:micronaut-jackson-databind"`
- if you use the HTTP client, you need to add `compileOnly "io.micronaut:micronaut-http-client"`.

Make sure to remove the following Gradle configuration, as Kestra now uses SLF4J 2:

```groovy
configurations.all {
    resolutionStrategy {
        force("org.slf4j:slf4j-api:1.7.36")
    }
}
```

Test dependencies require an adjustment as well:

```groovy
dependencies {
    // lombok
    testAnnotationProcessor "org.projectlombok:lombok:" + lombokVersion
    testCompileOnly 'org.projectlombok:lombok:' + lombokVersion

    // micronaut
    testAnnotationProcessor platform("io.micronaut.platform:micronaut-platform:$micronautVersion")
    testAnnotationProcessor "io.micronaut:micronaut-inject-java"
    testAnnotationProcessor "io.micronaut.validation:micronaut-validation-processor"

    testImplementation platform("io.micronaut.platform:micronaut-platform:$micronautVersion")
    testImplementation "io.micronaut.test:micronaut-test-junit5"

    // test deps needed only for to have a runner
    testImplementation group: "io.kestra", name: "core", version: kestraVersion
    testImplementation group: "io.kestra", name: "repository-memory", version: kestraVersion
    testImplementation group: "io.kestra", name: "runner-memory", version: kestraVersion
    testImplementation group: "io.kestra", name: "storage-local", version: kestraVersion

    // test
    testImplementation "org.junit.jupiter:junit-jupiter-engine"
    testImplementation "org.hamcrest:hamcrest:2.2"
    testImplementation "org.hamcrest:hamcrest-library:2.2"
}
```

### Jakarta migration

Make sure to adjust the imports from `javax.*` to `jakarta.*` — this is due to the migration from Java EE to Jakarta EE.

Some IDEs do this automatically. For example, IntelliJ has a command `Refactor` -> `Migrate Packages and Classes` -> `Java EE to Jakarta EE`). Alternatively, you can use the [OpenRewrite](https://docs.openrewrite.org/recipes/java/migrate/jakarta/javaxmigrationtojakarta) project.

### Project Reactor migration

Our reactive stack has been migrated from the deprecated RxJava 2 to the Project Reactor.

If your plugin uses RxJava, make sure to migrate it to the Project Reactor.

Replace the library `io.micronaut.rxjava2:micronaut-rxjava2` by `io.micronaut.reactor:micronaut-reactor`.

Then, update your code to use the Project Reactor types:
- `Flux` (instead of `Flowable`)
- `Mono` (instead of `Single`).

Lastly, if you were using the reactive HTTP client, make sure to replace the `io.micronaut.rxjava2:micronaut-rxjava2-http-client` by `io.micronaut.reactor:micronaut-reactor-http-client`.
