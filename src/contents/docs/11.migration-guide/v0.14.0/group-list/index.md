---
title: "Groups API Change in Kestra 0.14.0: groupList Rename"
h1: How to Update Group Management via the API in Kestra 0.14.0
sidebarTitle: groups → groupList Rename
description: API changes in Kestra 0.14.0. The groups property is renamed to groupList, and groupId must now be unique to prevent duplicate groups across tenants.
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.14.0
editions: ["EE"]
---


## Change in managing Groups via the API

This change affects the way you manage groups via the API.

In the [v0.14.0 release](../../../../blogs/2024-01-22-release-0-14/index.md), the Groups API structure changed to prevent duplicate groups from being created.

Before Kestra v0.14.0, you could create multiple groups with the same name. Since this can lead to confusion in a multitenant environment, this behavior is now prevented.

## Migration

The `groups` property has been renamed to `groupList` and the `groupId` now needs to be unique.

```yaml
groupList:
  - groupId: yourGroupId
    membership: MEMBER
```

:::alert{type="info"}
If you use Kestra UI or manage users and groups via Terraform, this change does not affect you. This change only affects customers who manage groups programmatically via the API.
:::

## Summary

The main change is that you no longer can create multiple groups with the same name. If you try to edit a group of which name exists more than once, you will be prompted to rename the group to a unique name.
