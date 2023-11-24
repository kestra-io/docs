---
title: RBAC FAQ
---

## Why service account is not just one type of User?

Service Account is a concept that resembles a Role more than a User. It’s a collection of permissions and an OAuth token associated with it to allow an external application (such as Terraform or GitHub Action) to assume some programmatic permissions to perform actions on behalf of a user. It’s not a real user, so it shouldn’t be a User type but an independent concept.

## Why Instance Admin or Tenant Admin are Roles rather than users?

Becuase they can be assumed by multiple users or groups, and because some user may initially be a “normal” user and be promoted to be granted a higher permission; in the same way, some user may initially be an Admin but then this user may lose access - imagine a DevOps/SysAdmin who leaves a company or changes department.


