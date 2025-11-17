---
title: Releases & LTS Policy
icon: /docs/icons/admin.svg
---

Track Kestra’s long‑term support (LTS) releases alongside the fast cadence of feature releases.

## Release model

Kestra maintains two tracks:

- **LTS (Long Term Support)** releases receive critical fixes for a defined window so production environments can upgrade on a predictable cadence.
- **Feature** releases deliver new functionality more frequently; they become candidates for the next LTS once they stabilize.

### Tracking the latest LTS

LTS versions are clearly labeled in the [GitHub release notes](https://github.com/kestra-io/kestra/releases) and we also publish a `latest-lts` Docker tag, as described in the [Introducing LTS](../../blogs/introducing-lts.md#tracking-the-latest-lts) announcement:

```bash
kestra/kestra:latest-lts                 # Open Source
registry.kestra.io/docker/kestra-ee:latest-lts  # Enterprise Edition
```

Pin these tags to stay on the most recent stable production release without tracking exact version numbers.

## Release cadence at a glance

- **Patch releases** → weekly backports (e.g., 1.0.1 → 1.0.2)
- **Feature releases** → every 2 months (e.g., 1.0 → 1.1)
- **LTS releases** → every 6 months, supported for 1 year

## Current LTS versions

| LTS Version | Release Date | Supported Until | Release Notes |
|-------------|--------------|-----------------|---------------|
| 1.0 | 2025‑09‑09 | 2026‑09‑09 (planned) | [GitHub Release](https://github.com/kestra-io/kestra/releases/tag/v1.0.0) |

## Upcoming milestones

| Track | Planned Release | Notes |
|-------|-----------------|-------|
| 1.x LTS | 2026 (TBD) | Final support window and release notes will be announced as the feature branch stabilizes. |
| Feature | Rolling | See the [GitHub releases feed](https://github.com/kestra-io/kestra/releases) for the latest features. |

:::alert{type="info"}
Need an earlier version’s status? Check the [GitHub releases archive](https://github.com/kestra-io/kestra/releases).
:::
