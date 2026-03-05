---
title: Enterprise License Upgrade
sidebarTitle: Enterprise License Upgrade
icon: /src/contents/docs/icons/migration-guide.svg
release: 1.3.0
description: Migration guide for updating Enterprise licenses in Kestra 1.3.0.
---

## Overview

Kestra 1.3.0 included required changes in the Kestra licensing API. Licenses issued before 1.3.0 will not be accepted by 1.3.0+ nodes. Every customer upgrading to 1.3.0 must install a newly generated [license](../../../configuration/index.md#ee-license). If you are planning to upgrade to `v1.3.0`, please reach out to our Customer Success or Sales contacts so we can provide you with a compatible license. 

The change required will be to update the license ID, key, and fingerprint with the new value prior to deploying Kestra v1.3.0.

## Breaking change in 1.3.0

- **Startup enforcement:** Nodes running 1.3.0+ will refuse to start with legacy licenses. A valid license is required at boot.
- **Scope:** Applies to all new installs and upgrades to 1.3.0+.

## Action required for existing customers

1. Before upgrading to 1.3.0, ensure communication with our Customer Success or Sales contacts to generate a new license for each environment.
2. Install the new license on all Kestra Enterprise nodes (controllers, executors, webapps) before restarting on 1.3.0.
3. Verify startup succeeds and feature access aligns with the entitlements in the new license.
