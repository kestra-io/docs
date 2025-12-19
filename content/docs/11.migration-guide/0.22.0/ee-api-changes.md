---
title: Enterprise Edition API changes
icon: /docs/icons/migration-guide.svg
release: 0.22.0
editions: ["EE"]
---

Service Account name uniqueness is no longer enforced.

## Overview

Before Kestra 0.22, the Service Account name had to be globally unique within the instance. As a result, attempting to create a Service Account `cicd` in a `dev` tenant would raise an error `"Username already exists"` if your `prod` tenant also has a Service Account with the name `cicd`.

To support multiple service accounts with the same name, we’ve renamed the `username` property to `name` in the JSON payload for the following REST API endpoint: `POST /api/v1{/tenant}/users/service-accounts{/id}`.

## Before Kestra 0.22

Here is an example of a JSON payload returned by the REST API endpoint `POST /api/v1{/tenant}/users/service-accounts{/id}` in Kestra 0.21:

```json
{
  "username": "cicd",
  "password": "Admin2025"
}
```

## After Kestra 0.22

Here is an example of a JSON payload returned by the REST API endpoint `POST /api/v1{/tenant}/users/service-accounts{/id}` in Kestra 0.22:

```json
{
  "name": "cicd",
  "password": "Admin2025"
}
```
