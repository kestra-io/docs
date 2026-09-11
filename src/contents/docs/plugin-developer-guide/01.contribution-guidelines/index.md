---
title: Plugin Contribution Guidelines for Kestra
h1: How to Contribute to Kestra Plugins the Right Way
description: Guidelines for contributing to Kestra plugins. Covers PR rules, code quality, task lifecycle, HTTP and JSON conventions, test requirements, and how to add new plugins.
sidebarTitle: Contribution Guidelines
icon: /src/contents/docs/icons/dev.svg
---

This page outlines the guidelines to follow when contributing to **Kestra plugins**.

It helps ensure contributions are:
- easy to review
- easy to QA
- consistent with Kestra conventions
- safe and maintainable over time

---

## General Guidelines

Follow these baseline rules for every pull request.

- PR title and commits follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
- Add a `closes #ISSUE_ID` or `fixes #ISSUE_ID` in the description if the PR relates to an opened issue.
- Documentation updated (plugin docs from `@Schema` for properties and outputs, `@Plugin` with examples, `README.md` file with basic knowledge and specifics).
- Setup instructions included if needed (API keys, accounts, etc.).
- Prefix all rendered properties by `r` not `rendered` (e.g., `rHost`).
- Use `runContext.logger()` to log important information with the right level (DEBUG, INFO, WARN, or ERROR), without leaking secrets in the message.
- Use `var` for local variables whenever the type is already obvious from the right-hand side; keep an explicit type only when it improves readability or resolves ambiguity.
- Default to no code comments. Only add one when the *why* is non-obvious (a hidden constraint, a subtle invariant, a workaround for an external bug); never restate what the code already says.

---

## Task and Trigger Lifecycle

A [`RunnableTask`](../03.task/index.md) also implements `WorkerJobLifecycle`, which ships no-op `kill()` (execution killed or timed out) and `stop()` (graceful worker shutdown) hooks. Both may run on a different thread than `run()`.

- **Override `kill()`** whenever the task holds a remote, cancellable resource that keeps running or billing after the Kestra execution stops: a submitted job ID, a running query, a spawned process, an open stream. Leaving the default no-op orphans that resource on SLA kill or manual kill.
- Store the cancellation logic behind an `AtomicReference<Runnable>` set once the remote resource ID is known, and guard it with a `compareAndSet` so a duplicate or racing kill signal is a no-op:

```java
private final AtomicReference<Runnable> killable = new AtomicReference<>();
private final AtomicBoolean isKilled = new AtomicBoolean(false);

// once the remote resource id is known, inside run():
killable.set(() -> cancelRemoteResource(runContext, resourceId));

@Override
public void kill() {
    if (isKilled.compareAndSet(false, true)) {
        Optional.ofNullable(killable.get()).ifPresent(Runnable::run);
    }
}
```

- `kill()` and `stop()` must never throw or block: catch and log cancellation failures instead of propagating them.
- Only override `stop()` too when a graceful shutdown should equally avoid orphaning the resource — typically the same cancellation logic as `kill()`.
- Prefer a shared base class when several tasks in a plugin submit the same kind of cancellable job: implement the hook once instead of duplicating it per task.
- Annotate mutable lifecycle fields (`AtomicBoolean`, `AtomicReference`, a cached client, …) with `@EqualsAndHashCode.Exclude` and `@ToString.Exclude` — they are runtime state, not part of the task's declarative identity.

When a service ships both a polling [`Trigger`](../04.trigger/index.md) and a `RealtimeTrigger`, extract a shared `Abstract<Service>Trigger extends AbstractTrigger implements <Service>ConnectionInterface` that holds the connection properties and client factory, so both triggers inherit them instead of redeclaring each field. A `Task` and a `Trigger` for the same service cannot share a superclass, so connection properties are an accepted exception — keep the two declarations in lockstep (same validation, defaults, `@Schema` wording, and secret annotations on both copies).

**Polling triggers must never re-fire on an item they already delivered.** Persist a watermark (last-seen ID, sequence number, or timestamp) in the flow's namespace KV Store (`runContext.namespaceKv(namespace)`) and advance it on every poll, not only when the trigger fires. If the KV key concatenates several identifiers, length-prefix each segment (e.g. `svc_watermark_<flowId.length()>_<flowId>_<triggerId>`) so a plain `_` join can't let `("ab", "c")` and `("a", "bc")` collide onto the same key.

---

## Properties

Ensure properties are declared and validated consistently.

- Prefer the `Property<T>` carrier type; use `@PluginProperty(dynamic = true)` only when dynamic rendering is required on a legacy `String` field — never on new code.
- **Every property must declare a group** via `@PluginProperty(group = "...")`. Use the standard groups below; introduce a custom group (e.g. `"logging"`, `"schema registry"`) only when none of the standard ones fit.

  | Group | What belongs here |
  |---|---|
  | `"main"` | Required properties and primary-intent properties (sql, query, prompt, commands, script, action, …) |
  | `"connection"` | Endpoint, account, and authentication properties |
  | `"source"` | Input origin and source location |
  | `"processing"` | Filtering, selection, and data-shaping options |
  | `"execution"` | Runner/runtime/environment controls |
  | `"destination"` | Output destination and write target |
  | `"reliability"` | Retries, failure handling, safety and consistency knobs |
  | `"advanced"` | Expert-level or rarely-changed options |

- Mandatory properties must be annotated with `@NotNull` and checked during the rendering.
- If a property has a default value, render it with `.orElse(THE_DEFAULT_VALUE)`, never `.orElseThrow()` — `orElseThrow()` defeats the declared default by forcing the user to set a property that was supposed to be optional.
- Any property that caps a count, a duration, a batch size, or otherwise expresses a numeric range must declare a sensible default and enforce valid bounds with `@Min` / `@Max` (or an equivalent Bean Validation constraint). Document the bounds and default in `@Schema(description = ...)`.
- Prefer a single enum property over two boolean flags that encode mutually exclusive modes (e.g. `FetchType`, `CompressionType`). Enums also render as an autocompleted dropdown in the Kestra UI.
- **Never convert an existing `String` property to an enum type**: existing flows may pass arbitrary or templated values through it, and narrowing it to an enum breaks deserialization for any value outside the enum set. Enums are for new properties only.
- You can model JSON with a simple `Property<Map<String, Object>>`.
- Inputs that accept either an inline list or a `kestra://` internal-storage URI (a batch of records, rows, messages, …) must use `io.kestra.core.models.property.Data` — never hand-roll URI detection or ION/NDJSON parsing.
- `version` is a reserved property name — never use it in custom plugins; it conflicts with Kestra internals.

### Secret properties

- Secret properties (passwords, API keys, API tokens, private keys, and any credential) **must** be annotated with `@PluginProperty(secret = true)` to enable masking in logs and the UI. Omitting it on a secret property is a security defect.
- **Every secret field must also carry `@ToString.Exclude`** (and `@EqualsAndHashCode.Exclude` if the field type has no meaningful equality). `@PluginProperty(secret = true)` only masks the value in the schema and UI — it does not stop Lombok's generated `toString()` from printing the raw value, which would leak the token in worker debug logs or exception dumps. This applies to both a task and its sibling trigger when a secret field is redeclared on each.

---

## HTTP

Use the shared HTTP client for all outbound requests.

- Must use Kestra's internal HTTP client from `io.kestra.core.http.client`, unless an official or well-maintained SDK is explicitly required — prefer the SDK over raw HTTP calls when one is specified.
- Handle timeouts, non-2xx responses, and partial failures explicitly.
- Guard against a null or empty response body before typed deserialization: a `200` with an empty body still reaches the mapper and throws a raw, unhelpful error. Default to an empty collection or fail with a clear `"empty response from <Service> API"` message, applied consistently across every call site that parses the same endpoint shape.
- Log meaningful context without leaking secrets.

---

## JSON

Use the standard serializers and avoid breaking changes from upstream APIs.

- Must use Jackson mappers provided by core (`io.kestra.core.serializers`).
- Add `@JsonIgnoreProperties(ignoreUnknown = true)` at the mapped class level when serializing responses from external APIs to prevent crashes when providers add new fields. Never assume response stability.
- **Never mutate the mappers returned by `JacksonMapper.of*()`**: they are process-wide shared singletons, and reconfiguring one (`registerModule`, `configure`, `setSerializationInclusion`, …) changes serialization for every plugin in the JVM. If you need a customized mapper, `.copy()` it first and mutate the copy.

---

## Outputs

Ensure outputs are minimal and non-duplicative.

- Do not send back as outputs the same information you already have in your properties, unless downstream tasks genuinely need it templated.
- If you do not have any output, declare `RunnableTask<VoidOutput>` but **return `null`** from `run()` — never `return new VoidOutput();`. On Kestra 2.0, Jackson has no serializer for `VoidOutput`, so returning an instance makes the worker fail to emit the task result and the execution hangs in `RUNNING` forever even though the task's work already completed (see [kestra-io/plugin-zoom#10](https://github.com/kestra-io/plugin-zoom/pull/10)).
- Do not output twice the same information (e.g., a status code and an error code saying the same thing).
- Never expose secrets or large raw payloads unless explicitly designed for it. Do not grow outputs proportionally to input size: store per-row results in the internal storage and return the URI instead of accumulating a list.
- Choose output names that are obvious in Pebble templates — `{{ outputs.myTask.fileUri }}` is clearer than `{{ outputs.myTask.internalStorageAddress }}`. Return typed values (dates, numbers, IDs), not raw strings.
- If the task retrieves data, add a `Property<FetchType> fetchType` supporting `FETCH_ONE`, `FETCH`, and `STORE` (mandatory for large datasets).

---

## Error Messages

- User-facing exceptions must say what went wrong **and** what to do: `"API returned 403 — check that the API key has read:buckets permission"` is actionable, `"Forbidden"` is not.
- Do not expose internal stack traces or SDK error types as the top-level message — wrap and translate them into plain language before throwing `IllegalStateException` or the appropriate Kestra exception.
- Avoid a bare `.orElseThrow()`, `.get()` on an empty `Optional`, or `getFirst()` on a possibly-empty list: these surface as an opaque `NoSuchElementException` / `IndexOutOfBoundsException` with no context. Pass a message naming the field or resource and the fix, e.g. `.orElseThrow(() -> new IllegalStateException("No stream named '" + rStream + "' — create it or check the region"))`.

---

## New plugins / subplugins

Keep new packages aligned with project conventions and metadata.

- Ensure your new plugin is configured as described in the [Gradle mandatory configuration guide](../02.gradle/index.md#mandatory-configuration).
- Add a `package-info.java` under each sub package respecting [this format](https://github.com/kestra-io/plugin-odoo/blob/main/src/main/java/io/kestra/plugin/odoo/package-info.java), choosing the right category (one or more of `AI`, `BUSINESS`, `CLOUD`, `CORE`, `DATA`, `INFRASTRUCTURE`).
- Every time you use `runContext.metric(...)` you have to add a `@Metric` ([see this doc](../07.document/index.md#document-the-plugin-metrics)).
- Docs don't support having both tasks/triggers in the root package (e.g. `io.kestra.plugin.kubernetes`) and in a sub package (e.g. `io.kestra.plugin.kubernetes.kubectl`) — either all tasks/triggers live in the root package, or only in sub packages.
- **Never create a Java package named `tasks`** inside a plugin or subplugin — it conflicts with Kestra internals and conventions. Group tasks directly under the subpackage (e.g. `io.kestra.plugin.aws.s3`, not `io.kestra.plugin.aws.s3.tasks`).
- Icons added in `src/main/resources/icons` in SVG format and not in thumbnail (keep it big):
  - `plugin-icon.svg`
  - One icon per package, e.g. `io.kestra.plugin.aws.svg`
- For subpackages, e.g. `io.kestra.plugin.aws.s3`, add `io.kestra.plugin.aws.s3.svg`. See the [Elasticsearch Search.java example](https://github.com/kestra-io/plugin-elasticsearch/blob/master/src/main/java/io/kestra/plugin/elasticsearch/Search.java#L76). Individual tasks never get their own icon — they inherit their sub-group's icon.
- Use `"{{ secret('YOUR_SECRET') }}"` in the examples for sensitive info such as an API key.
- Align the `"""` to close examples blocks with the flow id.
- Update the existing `index.yaml` for the main plugin, and for each new subpackage add a metadata file named exactly after the subpackage (e.g. `s3.yaml` for `io.kestra.plugin.aws.s3`) under `src/main/resources/metadata/`, following the same schema — never invent fields, and make sure `group` matches the Java package name of the subpackage.
- Update `AGENTS.md` at the repository root whenever new tasks, triggers, or subpackages are added, describing only what the current diff actually adds — never leave dangling references to code that doesn't exist yet on `main`.
- **Storage providers**: when adding a new storage provider plugin, open a PR on the `kestra-ee` repository and register it in `listAvailableVersionedPluginsForStorage()` inside `webserver-ee/src/main/java/io/kestra/ee/webserver/controllers/api/InstanceController.java`.
- **Secret managers**: when adding a new secret manager plugin, open a PR on the `kestra-ee` repository and register it in `listAvailableVersionedPluginsForSecretManager()` inside the same `InstanceController.java`.

---

## Tests

Cover behavior and provide evidence of local validation.

- Unit tests added or updated to cover the change, injecting a `RunContextFactory` and actually running the task.
- Every task must include at least one **functional test covering the happy path** — testing only edge cases or failure scenarios is not sufficient. The happy path test must validate successful execution, expected outputs, and the absence of unexpected side effects. Also cover failure scenarios and rendering edge cases.
- Add sanity checks if possible with a YAML flow inside `src/test/resources/flows`.
- Prefer **Testcontainers** when possible, to avoid running extra Docker services that consume GitHub Actions runner disk space (and to reduce flakiness / CI setup complexity).
- If Testcontainers is not suitable, avoid disabling tests for CI. Instead, configure a local environment with `.github/setup-unit.sh` (executable, runnable both locally and in CI) along with a new `docker-compose-ci.yml` file (do **not** edit the existing `docker-compose.yml`). Add an executable `.github/cleanup-unit.sh` if needed to remove costly resources (tables, datasets, etc.) afterward.
- If Testcontainers can't be used and there is no suitable Docker image, fall back to WireMock (`testImplementation "org.wiremock:wiremock-jetty12"`) rather than disabling the test.
- **An `@EnabledIfEnvironmentVariable`-gated test does not run in CI unless `.github/setup-unit.sh` exports that gate variable.** A test gated on a variable the setup script never sets is silently skipped on every CI run and protects nothing. Every task and trigger must have at least one **unconditional** happy-path test (WireMock or a Testcontainers/local service the setup script actually starts) exercising its default code path. Reserve env gates for tests that genuinely require live cloud credentials, and wire the gate variable into `setup-unit.sh` if the test is meant to run in CI.
- Provide screenshots from your QA / tests locally in the PR description — use the JAR of the plugin and test it directly in the Kestra UI to ensure it integrates well.
- Capture logs in a `CopyOnWriteArrayList` instead of an `ArrayList` (never a `synchronized` list), and randomize task IDs in plugin unit tests to avoid flakiness.

---

## Clean Code Principles

Apply these principles to every change:

- **Separation of Concerns**: each class or method has one clearly bounded responsibility — mixing HTTP calls, business logic, and serialization in a single method is forbidden.
- **DRY**: extract shared behavior into an abstract base class or utility; duplicated logic across tasks/triggers must be refactored.
- **KISS**: the simplest solution that correctly solves the problem is always preferred; complexity must be justified by a concrete requirement.
- **YAGNI**: do not add abstractions, configuration options, or extensibility hooks for hypothetical future requirements.

---

## Pull Request & Commit Descriptions

Write PR descriptions and commit messages that are direct and purposeful.

- Commits and PR titles follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): `type(scope): short imperative summary`, under 72 characters.
- Add a commit body only when the *why* isn't obvious from the diff (a workaround for an external bug, a deliberate trade-off, a breaking change).
- A PR description should cover: why the change exists, a tight bullet list of what changed, and a test plan describing what to run or check to verify it. A reviewer should grasp the scope in under 30 seconds.
