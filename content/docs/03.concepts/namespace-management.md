---
title: Namespace management
---

::alert{type="info"}
This feature requires a [commercial license](https://kestra.io/pricing).
::

Kestra is a [multi-tenant](multi-tenancy.md) platform. Each tenant can have multiple namespaces, and each namespace provides additional isolation and security.

Once you create a namespace, you can manage the following on a namespace-level:
- [secrets](secret.md)
- [variables](variables.md)
- [task defaults](task-defaults.md)

## Creating a namespace

You can create a namespace from the Kestra UI or programmatically via [Terraform](../11.terraform/resources/namespace.md).