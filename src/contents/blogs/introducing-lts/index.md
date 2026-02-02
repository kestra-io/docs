---
title: "Introducing Long-Term Support (LTS) for Kestra"
description: "Kestra 1.0 marks the first LTS release, with weekly backports and one year of guaranteed maintenance for each LTS version."
date: 2025-09-11T15:00:00
category: News & Product Updates
authors:
  - name: Anna Geller
    image: ageller
    role: Product Lead
image: ./main.jpg
---

With the release of **Kestra 1.0**, we are introducing a **Long-Term Support (LTS)** release model. This change ensures predictable upgrade paths and long-term stability for production environments.

## New LTS every 6 months

Each LTS release is supported for **1 year**, with at most two LTS versions maintained in parallel. Kestra 1.0 is the first LTS release. Six months later, a second LTS will follow. When the third LTS arrives, support for 1.0 will end.

## Backporting fixes weekly

From 1.0 onward, backports are applied to the **latest**, the **latest LTS**, and the **previous LTS**. Patch releases are shipped every Tuesday (e.g., 1.0.1, 1.0.2). These include critical fixes, CVE remediations, and non-breaking fixes across all supported versions.

## Tracking the latest LTS

Each LTS release is clearly labeled in **GitHub release notes**. For simplicity, we also provide a `latest-lts` Docker image tag:

```bash
kestra/kestra:latest-lts # Open Source
registry.kestra.io/docker/kestra-ee:latest-lts # Enterprise Edition
```

Pinning your image to this tag keeps your environment on the most recent **stable production release** without having to track exact version numbers.

## Versioning at a glance

- **Patch releases** → weekly backports (e.g., 1.0.1 → 1.0.2)
- **Minor releases** → every 2 months (e.g., 1.0 → 1.1)
- **LTS releases** → every 6 months, supported for 1 year.

## Next steps

With LTS, Kestra offers stability and predictability for production, while allowing fast iteration and innovation in development environments.

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️.

For questions or feedback, join [our Slack community](/slack) or open an issue on GitHub.
