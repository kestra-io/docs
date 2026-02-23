---
title: Enterprise License Upgrade
sidebarTitle: Enterprise License Upgrade
icon: /src/contents/docs/icons/migration-guide.svg
release: 1.3.0
description: Migration guide for moving to cloud-console managed Enterprise licenses in Kestra 1.3.0, with feature gating and new license enforcement.
---

## Overview

Kestra 1.3.0 switches Enterprise licensing to the new cloud-console managed model. Licenses issued before 1.3.0 (legacy offline keys) will not be accepted by 1.3.0+ nodes. Every customer upgrading to 1.3.0 must install a newly generated license from the cloud console.

## Why this change

- Align all customers to the new cloud console so licensing and feature access can be centrally managed and enforced.
- Improve control over license lifecycle (rotation, revocation, renewals) from a single place.

## Breaking change in 1.3.0

- **Startup enforcement:** Nodes running 1.3.0+ will refuse to start with legacy licenses. A valid cloud-console license is required at boot.
- **Scope:** Applies to all new installs and upgrades to 1.3.0+.

## Action required for existing customers

1. Before upgrading to 1.3.0, generate a new license in the cloud console for each environment.
2. Install the new license on all Kestra Enterprise nodes (controllers, executors, webapps) before restarting on 1.3.0.
3. Verify startup succeeds and feature access aligns with the entitlements in the new license.

## Action required for new installations

- New hosts deploying 1.3.0+ must be provisioned with a cloud-console license during setup; legacy keys will fail validation at startup.
