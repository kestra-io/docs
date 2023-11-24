---
title: Roles
---


## Roles

A Role is a collection of permissions that can be assigned to users and groups. A Role can be granted one or more permissions, which are defined by a combination of a permission (e.g. `FLOW`) and an action (e.g. `CREATE`).

A Role can be limited to a specific namespace, or can be granted access to all namespaces. When a Role is tied to a namespace, it also automatically grants permission to all child namespaces. For example, a Role attached to `prod` namespace will automatically inherit access to `prod.engineering` namespace.

In short, Roles encapsulate permission boundaries that can be attached to users and groups across tenants and namespaces.

---

### Permissions

A Permission is a resource that can be accessed by a user or group. The following permissions are currently supported:

- FLOW
- BLUEPRINT
- TEMPLATE
- NAMESPACE
- EXECUTION
- USER
- GROUP
- ROLE
- BINDING
- AUDITLOG
- SECRET
- IMPERSONATE
- SETTING
- WORKER
- TENANT

---

### Actions

An Action is a specific operation that can be performed on a permission. The currently supported actions are:

- CREATE
- READ
- UPDATE
- DELETE

---

## Roles currently supported

Kestra currently supports the following roles by default:
- **Instance Admin**: This role has full access to all resources in all tenants.
- **Tenant Admin**: This role has full access to all resources in a specific tenant.

However, you can create additional roles with custom permissions.

<ChildTableOfContents />
