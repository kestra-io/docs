---
title: Change in managing Groups via the API
icon: /docs/icons/migration-guide.svg
release: 0.14.0
editions: ["EE"]
---

This change affects the way you manage groups via the API.

## Overview

In the [v0.14.0 release](/blogs/2024-01-22-release-0-14.md), we've changed the structure of the Groups API to prevent duplicate groups from being created.

Before Kestra v0.14.0, you could create multiple groups with the same name. Since this can lead to confusion especially in a multitenant environment, we've decided to prevent this behavior.

## Migration

The `groups` property has been renamed to `groupList` and the `groupId` now needs to be unique.

```yaml
groupList:
  - groupId: yourGroupId
    membership: MEMBER
```

::alert{type="info"}
Note that if you use Kestra UI or manage users and groups via Terraform, you won't be affected by this change at all. This change only affects customers who manage groups programmatically via the API directly.
::

## Summary

The main change is that you no longer can create multiple groups with the same name. If you try to edit a group of which name exists more than once, you will be prompted to rename the group to a unique name.