---
title: Releases & LTS Policy
icon: /docs/icons/admin.svg
---

Track Kestra's long‑term support (LTS) releases alongside the fast cadence of feature releases.

## Current releases

Kestra maintains two tracks:

| Type    | Version | Release Date | Supported Until           | Release Notes |
|---------|---------|--------------|---------------------------|---------------|
| LTS     | 1.0     | 2025‑09‑09   | 2026‑09‑09 (planned)      | [GitHub Release](https://github.com/kestra-io/kestra/releases/tag/v1.0.0) |
| Feature | 1.1     | 2025‑11‑04   | Superseded by next release | [GitHub Release](https://github.com/kestra-io/kestra/releases/tag/v1.1.0) |

## Release model

Kestra follows a structured release strategy with three release types:

### Patch releases (x.y.Z)

- Weekly backports — every Tuesday
- Security fixes and non-breaking bug fixes
- Applied to all supported release lines (Latest Feature Release + LTS)

### Feature releases (x.Y.z)

- Deliver new functionality every ~2 months
- Candidates for future LTS promotion

### LTS (Long-Term Support) releases

- Promoted from stable feature releases every ~6 months
- Supported for 1 year with all security and bug fixes
- Recommended for production deployments

## LTS support model

Each LTS release receives support for 1 year. All security fixes, bug fixes, and patches are automatically applied.

Up to 2 LTS versions can be active at the same time. Both receive the same bug and security fixes. The newer LTS also includes features released between the two versions.`

## Backports and bug fixes

Bugs are fixed in the latest current version line first, then backported to all active LTS versions. Changes are carried forward where technically feasible.

To identify backported changes, check the [GitHub releases](https://github.com/kestra-io/kestra/releases). Release notes indicate which fixes are included in each version.

## Tracking the latest LTS

LTS versions are clearly labeled in the [GitHub release notes](https://github.com/kestra-io/kestra/releases) and we also publish a `latest-lts` Docker tag, as described in the [Introducing LTS](../../blogs/introducing-lts.md#tracking-the-latest-lts) announcement:

```bash
kestra/kestra:latest-lts                 # Open Source
registry.kestra.io/docker/kestra-ee:latest-lts  # Enterprise Edition
```

:::alert{type="info"}
For production environments, we strongly recommend pinning to a specific version number (instead of using `latest` or `latest-lts`) to ensure your deployments remain stable and avoid unplanned upgrades. This practice helps prevent unexpected changes from upstream releases.
For example:

```bash
kestra/kestra:1.0.3  # Open Source
registry.kestra.io/docker/kestra-ee:1.0.3 # Enterprise Edition
```
:::



## Plugin releases

Plugin releases are **totally uncoupled from Kestra Core**. Plugins follow their own versioning and release cycle.

### Kestra Core Minimal Compatible Version

Every plugin version matches a **Kestra Core Minimal Compatible Version**. This means the given plugin version works within the range provided by this value.


### Plugin versioning: Major, Minor, Patch

**Patch (x.y.Z)**
A patch release is made mainly for bug fixes.

**Minor (x.Y.z)**
A minor release is made for:
- A new feature introduced in the plugin (e.g., a new task)
- A breaking change, usually due to a change in the Kestra Core version

**Major (X.y.z)**
A major release is made only for important breaking changes where users must update their task definitions.

### Plugins and LTS

**Plugins don't have LTS versions.** The Kestra Core Minimal Compatible Version indicates which plugin version is supported for a given Kestra Core LTS.

To find the right plugin version for your Kestra installation you can visit each dedicated plugin page where you'll find the Kestra Core Minimal Compatible Version listed. You can also check the plugin's GitHub releases page and match the compatible version with your Kestra version.


:::alert{type="info"}
Need an earlier version's status? Check the [GitHub releases archive](https://github.com/kestra-io/kestra/releases).
:::
