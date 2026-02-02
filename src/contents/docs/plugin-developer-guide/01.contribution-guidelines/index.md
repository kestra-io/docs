---
title: Plugin Contribution Guidelines
description: Guidelines for contributing to Kestra plugins, ensuring easy review, quality assurance, consistency, safety, and maintainability. Follow rules for PRs, properties, HTTP, JSON, new plugins, and tests.
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
- Use `runContext.logger()` to log important information with the right level (DEBUG, INFO, WARN, or ERROR).

---

## Properties

Ensure properties are declared and validated consistently.

- Properties are declared with `Property<T>` carrier type, do **not** use `@PluginProperty`.
- Mandatory properties must be annotated with `@NotNull` and checked during the rendering.
- You can model a JSON thanks to a simple `Property<Map<String, Object>>`.

---

## HTTP

Use the shared HTTP client for all outbound requests.

- Must use Kestra’s internal HTTP client from `io.kestra.core.http.client`.

---

## JSON

Use the standard serializers and avoid breaking changes from upstream APIs.

- If you are serializing response from an external API, you may have to add a `@JsonIgnoreProperties(ignoreUnknown = true)` at the mapped class level to prevent crashes when providers add new fields.
- Must use Jackson mappers provided by core (`io.kestra.core.serializers`).

---

## New plugins / subplugins

Keep new packages aligned with project conventions and metadata.

- Make sure your new plugin is configured like mentioned [here](https://kestra.io/docs/plugin-developer-guide/gradle#mandatory-configuration).
- Add a `package-info.java` under each sub package respecting [this format](https://github.com/kestra-io/plugin-odoo/blob/main/src/main/java/io/kestra/plugin/odoo/package-info.java) and choosing the right category.
- Every time you use `runContext.metric(...)` you have to add a `@Metric` ([see this doc](https://kestra.io/docs/plugin-developer-guide/document#document-the-plugin-metrics))
- Docs don't support to have both tasks/triggers in the root package (e.g. `io.kestra.plugin.kubernetes`) and in a sub package (e.g. `io.kestra.plugin.kubernetes.kubectl`), whether it's: all tasks/triggers in the root package OR only tasks/triggers in sub packages.
- Icons added in `src/main/resources/icons` in SVG format and not in thumbnail (keep it big):
  - `plugin-icon.svg`
  - One icon per package, e.g. `io.kestra.plugin.aws.svg`
- For subpackages, e.g. `io.kestra.plugin.aws.s3`, add `io.kestra.plugin.aws.s3.svg`
    See example [here](https://github.com/kestra-io/plugin-elasticsearch/blob/master/src/main/java/io/kestra/plugin/elasticsearch/Search.java#L76).
- Use `"{{ secret('YOUR_SECRET') }}"` in the examples for sensible infos such as an API KEY.
- If you are fetching data (one, many or too many), you must add a `Property<FetchType> fetchType` to be able to use `FETCH_ONE`, `FETCH` and even `STORE` to store large amounts of data in the internal storage.
- Align the `"""` to close examples blocks with the flow id.
- Update the existing `index.yaml` for the main plugin, and for each new subpackage add a metadata file named exactly after the subpackage (e.g. `s3.yaml` for `io.kestra.plugin.aws.s3`) under `src/main/resources/metadata/`, following the same schema.

---

## Tests

Cover behavior and provide evidence of local validation.

- Unit tests added or updated to cover the change (using the `RunContext` to actually run tasks).
- Add sanity checks if possible with a YAML flow inside `src/test/resources/flows`.
- Prefer **Testcontainers** when possible to avoid running extra Docker services that can consume a lot of GitHub Actions runner disk space (and reduce flakiness / CI setup complexity).
- If Testcontainers is not suitable, avoid disabling tests for CI. Instead, configure a local environment with `.github/setup-unit.sh` (to be set executable with `chmod +x setup-unit.sh`) (which can be executed locally and in the CI) all along with a new `docker-compose-ci.yml` file (do **not** edit the existing `docker-compose.yml`). If needed, create an executable (`chmod +x cleanup-unit.sh`) `cleanup-unit.sh` to remove the potential costly resources (tables, datasets, etc).
- Provide screenshots from your QA / tests locally in the PR description. The goal here is to use the JAR of the plugin and directly test it locally in Kestra UI to ensure it integrates well.

---

## Outputs

Ensure outputs are minimal and non-duplicative.

- Do not send back as outputs the same information you already have in your properties.
- If you do not have any output use `VoidOutput`.
- Do not output twice the same information (e.g., a status code and an error code saying the same thing).
