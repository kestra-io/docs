---
title: Releases
icon: /docs/icons/admin.svg
editions: ["EE"]
---

Release cadence and support policy for Kestra Enterprise Edition (EE).

## Release Cadence

We release a new Kestra version every two months. The release date is easy to remember: it's always **the first Tuesday of every second month**.

For a detailed schedule of planned and recently shipped releases, see the table below:

| Kestra Version | Release Date   |
|---------------|----------------|
| 0.20.0        | December 3, 2024|
| 0.21.0        | February 4, 2025|
| 0.22.0        | April 1, 2025  |
| 1.0           | June 3, 2025   |
| 2025.1        | August 5, 2025 |
| 2025.2        | October 7, 2025|
| 2025.3        | December 2, 2025|
| 2026.1        | February 3, 2026|


## Versioning Scheme

In June 2025, Kestra will reach version 1.0! This milestone is a testament to the platform's stability and maturity for enterprise use at scale. This version will have full backward compatibility and doesn't remove any features or plugins, even the deprecated ones. With version 1.0, you can trust that Kestra’s foundational features are battle-tested and that you can rely on them for mission-critical workflows.

After the 1.0 release, Kestra is adopting a new versioning strategy to signal product maturity and enhance our release processes. This change decouples core and plugin versioning, allowing independent releases of plugins while ensuring compatibility with the core platform. Core products will follow a [Calendar Versioning (CalVer)](https://calver.org/) scheme, while plugins will use [Semantic Versioning](https://semver.org/).

::alert{type="warning"}
Along with the new versioning scheme, we will remove deprecated features and plugins. This means that the `2025.1` release will include breaking changes ⚠️. We will provide detailed [migration guides](../../11.migration-guide/index.md) and [helper-scripts](https://github.com/kestra-io/helper-scripts) to help you transition to the new version.
::

### Core Versioning (CalVer)

- **Format:** `YEAR.MAJOR.PATCH`
- **Examples:**
    - `2025.1.0` – Major release with new features and breaking changes
    - `2025.2.0` – Next major release, introducing additional feature sets
    - `2025.2.1` – Patch release focused on bug fixes and minor improvements
- **Release Schedule:** Up to six major releases per year (e.g., 2026.1, 2026.2, 2026.3, …, 2026.6) with a bi-monthly cadence.

### Plugin Versioning (Semantic)

- **Format:** `MAJOR.MINOR.PATCH` with a declared minimum compatible core version.
- **Explanation:**
    - **Major:** Significant feature additions with potential breaking changes.
    - **Minor:** New features that are backward compatible.
    - **Patch:** Bug fixes and small improvements.
- **Release Cadence:**
    - Minor/patch updates follow the weekly release cycle.
    - Major updates are scheduled on a bi-monthly basis - see the releases page.
- **Compatibility:** Each plugin specifies a minimum core version (e.g., dbt plugin `1.1.5` is compatible with core `2025.1.0+`).

### Migration & Support

**From Legacy Versions:** Kestra 1.0 will serve as the transition point. Post-1.0, all releases will use CalVer for core and Semantic versioning for plugins and those will include breaking changes, removing previously deprecated features and plugins.

**Custom Plugins:** Detailed migration guides will be provided to assist plugin developers in adopting the new versioning standards.

### Reasons for Change

This strategy aligns Kestra with industry best practices used by major software products (e.g., Ubuntu, JetBrains, R Studio, Python pip package manager), emphasizing product maturity, predictable release cycles, and transparent release tracking without arbitrary major version increments.

## Bugfix Releases

Every **Thursday**, we release a new bugfix version for the `latest` release. This means that if you are using the latest version of Kestra, you can expect a new bugfix release every week. You can track which GitHub issues are planned for the next bugfix release in our public [GitHub project board](https://github.com/orgs/kestra-io/projects/15/views/1).

::alert{type="info"}
We recommend regularly updating to the `latest` version to benefit from the most recent bug fixes and security patches.
::

## Backport Releases

Regardless of the Kestra version you are using, we provide backport releases to Enterprise customers upon request. If you submit a ticket to our support team, we will provide a backport release with the necessary bug fixes for your specific version.

The backport releases are provided on a best-effort basis to our Enterprise customers. We still recommend upgrading to the latest version to continuously benefit from the latest improvements and security updates.

## Upgrade Support

If you have questions or need help upgrading to the latest version of Kestra EE, please contact our [support team](/demo/).
