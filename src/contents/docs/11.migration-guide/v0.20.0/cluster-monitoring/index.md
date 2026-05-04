---
title: Cluster Monitoring Permissions Change in Kestra 0.20.0
h1: Cluster Monitoring Now Requires SUPER_ADMIN in Kestra 0.20.0
sidebarTitle: "Cluster Monitoring: SUPER_ADMIN"
description: Cluster Monitoring permissions update in Kestra 0.20.0. Access to the Instance/Cluster Monitoring page now requires `SUPER_ADMIN` privileges.
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---


## Different permissions for accessing Cluster Monitoring

Migrating permissions for accessing Cluster Monitoring

Before the 0.20.0 release, the permission `INFRASTRUCTURE` was required to access the Cluster Monitoring page.

The page has been renamed `Instance` and now provides more information and offers new features.

Access to this page now requires `SUPER_ADMIN` status.
