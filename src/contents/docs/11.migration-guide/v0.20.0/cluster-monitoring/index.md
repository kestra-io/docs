---
title: Different permissions for accessing Cluster Monitoring
description: Cluster Monitoring permissions update in Kestra 0.20.0. Access to the Instance/Cluster Monitoring page now requires `SUPER_ADMIN` privileges.
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---


## Different permissions for accessing Cluster Monitoring

Migrating permissions for accessing Cluster Monitoring

Before the 0.20.0 release, the permission `INFRASTRUCTURE` was required to access the Cluster Monitoring page.

However, the page has been renamed `Instance` and now provides more information and offer new features.

In consequence, now the user need to be set as `SUPER_ADMIN` to access this page.
