---
title: Different permissions for accessing Cluster Monitoring
icon: /docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---

Migrating permissions for accessing Cluster Monitoring

## Overview

Before the 0.20.0 release, the permission `INFRASTRUCTURE` was required to access the Cluster Monitoring page.

However, the page has been renamed `Instance` and now provides more information and offer new features.

In consequence, now the user need to be set as `SUPER_ADMIN` to access this page.