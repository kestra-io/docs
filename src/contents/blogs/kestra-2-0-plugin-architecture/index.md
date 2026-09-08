---
title: "Plugins Aren't Just Integrations Anymore"
description: "Kestra 2.0 turns the plugin system from an integration catalogue into an extension point for the platform itself: policies, file previews, log storage, the queue, and now the UI."
date: 2026-09-08T09:00:00
category: Engineering
author:
  name: François Delbrayelle
  linkedin: https://www.linkedin.com/in/fdelbrayelle/
  twitter: "@fdelbrayelle"
  image: fdelbrayelle
  role: Lead Software Engineer
---

For most of Kestra's life, "plugin" meant one thing: a task that talks to something. Snowflake, dbt, S3, Slack. Kestra 2.0 just crossed 2000 of them.

The interesting part is what else a plugin could *be*.

The answer turned out to be: the governance rule that blocks a task. The renderer that draws your Parquet file. The store your logs live in. The queue underneath the whole engine. The interface you look at while a Kubernetes pod starts.

That is a different kind of product than a bigger catalogue, one where the surface you extend is the platform itself. This post is what changed, and what it means if you build on Kestra or maintain a plugin for it.

## Three new extension points, and one that changes the product

Of seventeen plugin categories, three arrived this cycle. Each one turns something that used to be ours into something that can be yours.

### Policy rules

A governance rule is now a plugin. Typed by fully qualified class name in YAML, discovered by the same scan that finds tasks, registered in the same registry, generating the same JSON schema so the editor validates and autocompletes it.

```yaml
rules:
  - type: io.kestra.plugin.ee.rules.Deny
    on: PLUGIN
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.scripts.shell
```

Read that again with an eye on the edition line: the rules are Enterprise, the extension point is open source. Which means the mechanism for enforcing what may run in your platform is part of the engine everyone gets, and the rules shipped on top of it are a product decision rather than an architectural one. Policies also brought a `POLICY` schema type and a `policyRefs` field on flows, tasks and triggers, so a rule is addressable from the thing it governs.

#### pluginDefaults is gone

The same work that gave us policy rules took away plugin defaults, and the symmetry is the point: one mechanism suggested values, the other enforces them, and keeping both would have meant two answers to the same question.

So flow level `pluginDefaults` is removed, the service that implemented it was renamed to describe what it actually does now, and a flow containing that block will not parse. This is the change most likely to interrupt your upgrade, and it arrives without a deprecation window, so plan for it rather than discover it.

What replaces it depends on your edition. In Enterprise, a `REFERENCE` policy that flows opt into through `policyRefs`, or an `Add` rule scoped to a namespace. Namespace level plugin defaults, which shipped in 1.3, are the surviving mechanism and migrate automatically. In open source there is no centralized replacement: inline the values or hoist them into flow variables.

Two behaviors follow, and neither is obvious until it bites:

**Plugin aliases are not resolved in rule matching.** A `where` clause matches the type string literally, so a rule naming the canonical type will not catch a flow using a deprecated alias. Which matters more in 2.0 because core task aliases and trigger aliases were removed outright during the cycle.

**Lists are replaced, never merged.** A tenant policy setting three environment variables and a namespace policy setting one leaves you with one.

Do not confuse any of this with `kestra.plugins.configurations`, which is unchanged and is for tuning plugin features a flow never expresses:

```yaml
kestra:
  plugins:
    configurations:
      - type: io.kestra.plugin.scripts.runner.docker.Docker
        values:
          volumeEnabled: true
```

Defaults applied reusable task values. Configurations enable or tune plugin behavior. Only the first one was replaced.

### File preview renderers

The preview panel in the execution view stopped being a list of formats we happened to support.

Two methods is the whole contract:

```java
boolean supports(String extension);
FilePreview render(String extension, InputStream in, Optional<Charset> charset, int maxRows);
```

`FilePreview` carries a type of `TEXT`, `MARKDOWN`, `LIST`, `IMAGE` or `PDF`, where `LIST` becomes an interactive table and images and PDFs render inline from base64. We ship text, ION, images and PDF.

If your team lives in Parquet, or Avro, or some binary format that exists in exactly one industry, the preview panel is now yours. Write the renderer, drop it on the classpath, and the scanner finds it at startup: no YAML, no service loader entry, no configuration. Respect `maxRows`, which the Row count control drives and which defaults to 100, and set `truncated` when you cut rows. That is it.

The reason this is more than a convenience: the moment somebody has to download a file to understand a run, they have left the platform, and everything the platform knew about that run stays behind.

### Somewhere else to put your logs

This one arrived as a category with the Enterprise log shipper. What is new in 2.0 is that open source can choose one, with a config key:

```yaml
kestra:
  logs:
    type: postgres
    postgres:
      url: jdbc:postgresql://logs-db:5432/kestra_logs
      username: kestra
      password: k3str4
```

Three things convinced us this had to exist. One customer's database held 500GB of logs. Several others simply dropped their database between releases, because that was easier than managing it. And Xiaomi maintained a fork of Kestra for the sole purpose of storing logs somewhere else.

When people fork your product to solve a problem, the problem is yours. There is also a payoff beyond that: logs are the single biggest reason a database migration runs long, so moving that table out makes every upgrade after this one less frightening.

The Enterprise version of this goes further with an external log repository that needs no shipper installed at all, connecting CloudWatch or Elastic directly. Because `kestra.logs.type` applies to new executions only, there is a deliberate opt-in CLI to migrate historical logs across, since copying them can take hours or days and nobody wants that inside a startup sequence.

### Artifacts: plugins can ship their own UI

This is the biggest of the four and it has a name of its own: **Artifacts**.

Until 2.0 a plugin could contribute a form generated from its schema, and that was the whole of its UI surface. A task in the execution view was configuration, logs and a list of output files, so understanding what a task did often meant leaving Kestra: download the Parquet somewhere else, open dbt Cloud for the model graph, read Kubernetes events to find out why a pod took four minutes.

Artifacts let a plugin render a rich, domain specific view inside Kestra, before and after a run, with no extra YAML in anyone's flow. Four kinds shipped: data tables previewing Parquet, CSV, ION and Avro with local filtering, data summaries with row counts and per-column statistics, dependency graphs for dbt models and Ansible trees and Terraform plans, and topology sub-nodes that decompose a task into its real steps with per-step timing.

The architecture is worth knowing because it is more considered than a typical plugin hook. A **slot** is a part of the Kestra UI a plugin may modify. A **plugin UI artifact** is the object in the plugin that modifies the visualization for a task. A **slot contract** is a TypeScript interface defining the props your component receives, and the contracts live in the Kestra repository under `ui/packages/slot-contracts`, so they are enforced at compile time. **Module federation** glues it together, letting a plugin ship a Vue component that shares Kestra's own Vue, API client and design system instead of bundling its own copies.

In the plugin model this surfaces as a UI manifest on the registered plugin, carrying the module, its styles and a flag for whether it belongs to open source or Enterprise, with a source hash so browsers pick up new versions.

There is an `artifact-sdk` repository that acts as a development studio for building and publishing them, and `plugin-gcp` is the reference implementation. That's a different SDK from `client-sdk`, the one that talks to the Kestra API: the Artifact SDK is what actually renders a plugin's UI, and the [plugin artifact developer guide](/docs/plugin-developer-guide/plugin-ui) covers it, plus slot registration and bundling setup. The roadmap targets the places the payoff is largest: AI tasks, task runners starting with Kubernetes, dbt, Ansible and Terraform.

If you maintain a plugin, this is the most interesting thing 2.0 gives you. It is the difference between extending Kestra and improving it.

## The queue is a plugin now

This is the change with the biggest architectural consequence and the least noise around it.

Queue implementations used to live inside the Enterprise repository, compiled in, part of the engine. In 2.0 they moved out and became plugins. The thing at the very bottom of the stack, the component every execution in the system passes through, is now an extension point.

Today that shows up as an internal simplification: you still choose with `kestra.queue.type`, and the supported pairings are documented and finite. What it means is that the list can grow without a core release, and that the boundary between "the engine" and "a thing you plug into the engine" moved down a layer.

Storage, secret managers and log data stores are plugins in the strict sense too, selected by a type key and looked up by `@Plugin.Id` through the registry:

```java
@Plugin
@Plugin.Id("s3")
public class S3Storage implements S3Config, StorageInterface
```

The repository, on the other hand, is still a compiled-in Gradle module. `QueueInterface` extends `Closeable` and `Pauseable`, and no repository interface extends `Plugin`. So "pluggable backend" means selected by configuration for all of them, and means a registry plugin for storage, secrets, logs and now queues.

## Task forms stopped being a wall of fields

If you have configured a plugin with forty properties, you know the problem: the form lists them in schema order, required and obscure side by side, and finding `timeout` means scrolling past six authentication fields.

2.0 added a property group taxonomy to `@PluginProperty`, with nine groups: `MAIN`, `CONNECTION`, `SOURCE`, `PROCESSING`, `EXECUTION`, `DESTINATION`, `RELIABILITY`, `ADVANCED` and `DEPRECATED`, plus an optional index for ordering inside a group. The generator threads it into the JSON schema and the task form renders the sections.

The scale of the follow-up is the detail I find most telling about the size of the plugin catalogue: annotating roughly **8,800 properties across more than 150 plugin repositories**, with an optional fallback bucket kept in place until that migration finishes. So the mechanism shipped and the annotation lands progressively, which is why some plugins already group cleanly and others do not yet.

Useful for plugin authors: the annotation is non-breaking and was made available to 1.x plugin builds, so you can adopt it without moving your plugin to a 2.0 dependency. The rendering is what is new.

While in the same area, plugin icons became real SVG resources instead of data URIs, with lazy loading and content sanitization through a new sanitizer, and a monochrome flag derived from whether the SVG uses `currentColor`. The measurable result is **12MB removed from a JSON payload**, which is a page load rather than a feature but you will feel it on the plugins page.

## Plugin Auto-download

The default image bundles every plugin at its latest version. That is convenient and it is over 3GB, which is a genuinely bad first experience: almost every product evaluator mentioned image size as a drawback of onboarding.

2.0 splits it. Every tag has a `-slim` twin, both built on `eclipse-temurin:21-jre`, so `kestra/kestra:latest-slim` is the lean core and you add what you need. It's also what [kestra.io/get-started](https://kestra.io/get-started) hands you by default:

```bash
docker run --pull=always --rm -it -p 8080:8080 --user=root \
  --name kestra \
  -v kestra_data:/app/storage \
  -v kestra_db:/app/data \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/tmp \
  kestra/kestra:latest-slim server local
```

That auto-install is scoped: it's an open source, `server local` behavior, gated by `KESTRA_PLUGINS_AUTO_INSTALL_ENABLED` (or `kestra.plugins.auto-install.enabled` in configuration), true by default for that mode. Turn it off and the `-slim` image goes back to needing plugins pre-installed, which is the setting to reach for once you're past evaluating and want a fixed, reviewed plugin set.

The editor doesn't lose autocompletion in the meantime, either. It works off the plugin bundle schema, which is available whether or not the plugin's JAR has actually been downloaded to that instance yet, so a task gets validation and suggestions before Kestra has ever fetched it.

With auto-install on, you don't need to do anything else, or you can be explicit about it:

```yaml
services:
  kestra:
    image: kestra/kestra:latest-slim
    entrypoint: /bin/sh -c "
      kestra plugins install io.kestra.plugin:plugin-dbt:LATEST && \
      kestra plugins install io.kestra.plugin:plugin-scripts:LATEST && \
      kestra server standalone"
```

Or bake it, which is what you want for anything reproducible:

```dockerfile
ARG IMAGE_TAG=latest-slim
FROM kestra/kestra:$IMAGE_TAG
RUN /app/kestra plugins install \
  io.kestra.plugin:plugin-aws:LATEST \
  io.kestra.storage:storage-gcs:LATEST \
  io.kestra.plugin:plugin-gcp:LATEST
```

Behind the scenes, the build itself changed: plugin JARs are now pre-downloaded in CI through `kestractl` and copied into the image, instead of being installed by the Dockerfile, with a base image carrying the open source plugin set.

For anyone running detached workers, and 2.0 gives you many more reasons to, there is a new pair of commands that answers "which JARs does this particular process actually need":

```shell
kestractl plugins list 2.0.0 --from-config /etc/kestra/application.yaml
kestractl plugins download 2.0.0 --plugins "$(kestractl plugins list 2.0.0 --from-config /etc/kestra/application.yaml)"
```

`--from-config` reads exactly four keys, `kestra.storage.type`, `kestra.secret.type`, `kestra.queue.type` and `kestra.repository.type`, and emits only the backends that ship as separate artifacts. Local storage, the JDBC and Elasticsearch secret backends, the memory, H2, Postgres, MySQL and Kafka queues and the memory, H2, Postgres and MySQL repositories are bundled, so they never appear. Point it at an S3 configuration and you get `io.kestra.storage:storage-s3:1.4.1`.

`download` takes `--plugins-dir`, `--edition` to filter open source or Enterprise, `--concurrency`, `--keep-only-last-version` which is on by default, `--force-redownload`, `--global-timeout` at five minutes, and `--maven-repository` with credentials, which you need for the external secret managers and the Elasticsearch and OpenSearch backends because those are not on Maven Central.

### The supply chain moved

An unglamorous change with real availability consequences. Plugin JARs used to be fetched straight from Maven Central at API startup, during release CI and while indexing plugins. Maven Central rate limits and occasionally returns 403s, and the failures cascaded: a restart of the plugin API could take the plugin catalogue down with it.

All of that now goes through a caching artifact registry proxy, with a public mirror for open source plugins. Not a feature you will notice, unless you were one of the people watching it break.

## Compatibility, and a deliberate decision not to break you

If you maintain a plugin, here is the sentence that matters: **your 1.x plugin runs on 2.0, on purpose.**

Of the 246 plugin artifacts compatible with 2.0, 235 are still published at a 1.x version. Only a handful, including `plugin-aws`, `plugin-gcp`, `plugin-azure`, `plugin-fs` and `plugin-kestra`, have their own 2.x line. There is no plugin API migration guide because there was no plugin API break.

That took work to keep true. A nightly compatibility check runs against the development branch, and most of what it caught was a Java version gap, with plugins on 21 while core moved to 25. We decided against forcing every plugin onto a 2.0 build, so older plugin versions stay usable. Ludovic put the tradeoff plainly internally: keeping 1.x compatibility means holding some dependency upgrades until 1.x support ends. Concretely, Micronaut 5 and Jackson 3 are not in 2.0 for exactly this reason.

What changed for plugin authors is not the API but what plugin code may touch. Workers in 2.0 never reach the database, and some core tasks did, so those were removed and replaced with tasks that call the Kestra API through the `plugin-kestra` SDK:

| Removed in 2.0 | Replacement |
| --- | --- |
| `io.kestra.plugin.core.execution.Count` | `io.kestra.plugin.kestra.executions.Count` |
| `io.kestra.plugin.core.execution.Resume` | `io.kestra.plugin.kestra.executions.Resume` |
| `io.kestra.plugin.core.trigger.Toggle` | `io.kestra.plugin.kestra.triggers.Toggle` |
| `io.kestra.plugin.core.log.Fetch` | `io.kestra.plugin.kestra.logs.Fetch` |

Only the last is renamed automatically by the flow migration CLI. The other three need a manual rewrite, and moving `Resume` in particular was about permissions: changing another execution's state should go through the API where RBAC applies.

The SDK that absorbed them grew a lot in the cycle, and it is worth knowing as a surface. Open source: `executions.Count`, `Delete`, `Kill`, `Query`, `Resume`, `flows.Export`, `ExportById`, `List`, `logs.Fetch`, `namespaces.List`, `NamespacesWithFlows`, `triggers.ScheduleMonitor` and `Toggle`. Enterprise adds asset management, test running, and the whole IAM surface, covering bindings, groups, invitations, roles, service accounts and tenant access.

That IAM family is a 2.0 addition worth pausing on. Until now IAM was only manageable from outside a flow, through the REST API, Terraform or `kestractl`. Now it is a set of tasks, which makes event driven onboarding a flow: a joiner event arrives, a flow creates the user, adds them to groups and binds a role, and every step is an audited execution. Authentication is usually free, because `auth.auto` defaults to on and reuses the credentials of the instance the flow is running on.

## The plugins you did not know shipped

The 2.0 cycle also produced a category of Enterprise plugins that has nothing to do with data pipelines, and it is the clearest signal of where Kestra is being taken.

The stated strategy is that the winning position in private infrastructure is a tightly integrated orchestration layer across compute, network, storage and management. Compute existed already, with VMware, Nutanix and Proxmox. Network existed, with Infoblox, Netbox and phpIPAM. Storage was the missing pillar, and 2.0 closed it:

- **NetApp ONTAP**, covering snapshot create, delete and restore, volume cloning, SnapMirror replication, SVM management and QoS policies over the ONTAP REST API
- **Veeam Backup and Replication**, because almost every VMware or Nutanix customer runs it
- **Pure Storage FlashArray**
- **Dell EMC PowerStore**
- **Ceph**

Alongside them, an **F5 load balancer** plugin, IPAM plugins for **Infoblox** and **SolarWinds**, and a whole new hyperscaler family in **Huawei Cloud**, built as the equivalent of the AWS plugin.

The use cases those enable are day two operations rather than analytics: snapshot before patching, clone a volume for a dev and test environment, check replication health on a schedule, provision a VM and register it in IPAM and put it behind a load balancer in one flow. Combine that with asset locking, which stops two executions mutating the same VM at once, and Kestra starts being the thing running your infrastructure changes rather than the thing reporting on them.

Two more worth naming. A **Syslog** exporter, which sends audit and execution logs in CEF over UDP, TCP or TCP with TLS, and exists because plenty of SIEMs ingest syslog and nothing else, where previously the log shipper only spoke HTTP to Splunk, Graylog and Datadog. And **Delinea Secret Server** as an external secret manager, covering the full secret lifecycle.

## Versioned plugins

What it does, briefly, because it remains one of the most useful things in the plugin system: Kestra hosts several versions of the same plugin at once and any task or trigger names the one it wants.

```yaml
  - id: shell_script_task
    type: io.kestra.plugin.scripts.shell.Script
    version: "0.21.0"
    script: |
      echo "The current execution is : {{ execution.id }}"
```

Resolution walks four levels, most specific first: the task's version, the flow default, the namespace default, then `kestra.plugins.management.defaultVersion`, which is `LATEST` unless you change it. Setting that instance default to `NONE` means nothing resolves implicitly and every task must state its version, which is the setting to reach for on a regulated platform.

What 2.0 added around it is smaller and useful: work toward the same version selection inside the instance UI, and a clearer distinction between open source and Enterprise plugins in the catalogue, backed by artifact filtering on the distribution flag.

The instance level configuration, with the documented comments because they tell you what each switch actually gates:

```yaml
kestra:
  plugins:
    management:
      enabled: true                 # false hides the Versioned Plugins tab and errors the API
      remoteStorageEnabled: true
      customPluginsEnabled: true    # false disables installing or uploading custom plugins
      localRepositoryPath: /tmp/kestra/plugins-repository
      autoReloadEnabled: true
      autoReloadInterval: 60s
      defaultVersion: LATEST
```

`autoReload` is why installing does not mean restarting: each server rescans repositories periodically. With `remoteStorageEnabled`, plugins live in internal storage under `_plugins/repository` and a `plugins.meta` file lets synchronization transfer only what changed.

And a scoping note, because the launch messaging is looser than the behavior. Installing plugins at runtime, on demand, is an open source and standalone capability. Enterprise and distributed deployments keep governed, pre-provisioned plugin management, which is the right default when installing a plugin is a cluster wide change a super admin owns.

### Versioned plugin docs

Version resolution needed a matching change on the [plugin catalogue](https://kestra.io/plugins). Task and trigger docs used to reflect whatever version happened to be latest at build time, which is a problem the moment a flow deliberately pins an older one: the documentation in front of you and the plugin actually running could disagree on what a property does.

Plugin pages are now versioned. The [dbt plugin](https://kestra.io/plugins/plugin-dbt) is a good one to look at, since it has accumulated enough releases to make the version picker worth having: pick an older version from the dropdown and the page shows that version's tasks, properties and examples, not the latest one. If your flow pins `version: "0.21.0"` on a task, the docs for `0.21.0` are the ones you actually want, and now they are the ones you get.

## Deciding which plugins may run

Two mechanisms, both worth setting up before you hand out an instance.

Instance wide, an allow list in configuration, matching by trailing wildcard, regex or plain prefix:

```yaml
kestra:
  plugins:
    security:
      includes:
        - io.kestra.*
      excludes:
        - io.kestra.plugin.core.debug.Echo
```

Per tenant or namespace, an Enterprise policy. `Deny` bans a plugin type wherever it appears, including error handlers, triggers and task runners. `Restrict` on `taskRunner.type` with an enum whitelists which runners a namespace may use. `Require` on `taskRunner` forces every script task to name its runner rather than inheriting a default nobody reviewed.

## What plugin authors should do about all this

Nothing urgent, which is the point. But three things are worth doing.

**Annotate your property groups.** The taxonomy is available to 1.x builds, and a plugin with grouped properties is visibly nicer to configure than one without now that the form renders sections.

**Check your Java version.** Core moved to Java 25 while the public plugin template still targets Java 21 and a 1.3 dependency. The template works, and it is not yet the 2.0 reference. If you are starting fresh, look at `plugin-kestra` for what a current build looks like.

**Consider whether your plugin should render something.** Artifacts and file renderers are both new, and both turn a plugin from something that extends Kestra into something that improves it. Start with the `artifact-sdk` repository and read `plugin-gcp`. If your plugin produces a graph, a table or a multi-step process, there is a view worth building.

The version pin in `gradle.properties` still governs compatibility:

```properties
version=0.20.0-SNAPSHOT
kestraVersion=[0.20,)
```

Build against a library older than your instance expects and flow creation returns a 422 with an Invalid bean error.

## Where this leaves the plugin system

The queue moved out of core. Governance rules became plugins. The log store became something you choose. The preview panel and now whole regions of the interface became things a plugin can supply. In every case, something we owned became something you can own.

That is a different bet than a bigger integration catalogue. A catalogue makes Kestra useful with more tools. This makes Kestra shaped like your platform: your queue, your storage, your rules about what may run, your view of what a task did, your plugin rendering your format in a panel we never wrote.

The storage and backup plugins that arrived this cycle are the same bet pointed outward. NetApp, Veeam, Pure Storage, PowerStore and Ceph are not analytics integrations.

If you maintain a plugin, the practical version of all this is short. Annotate your property groups, check your Java version, and go look at whether your plugin should be drawing something. The first two take an afternoon. The third one is the one that will make somebody's day better.
