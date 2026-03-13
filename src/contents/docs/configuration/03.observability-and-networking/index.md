---
title: Kestra Observability and Networking Configuration
description: Configure telemetry, logs, metrics, Micronaut settings, endpoints, SSL, CORS, and webserver behavior in Kestra.
sidebarTitle: Observability and Networking
icon: /src/contents/docs/icons/admin.svg
---

Use this page for operational visibility and network-facing configuration.

## Observability

Configuration areas in this group include:

- anonymous telemetry
- logger settings
- access logs and log formatting
- metrics and label-based metrics
- Micronaut HTTP settings

These settings are useful when you need to tune visibility, log volume, request handling, or integration with monitoring platforms.

## Network and HTTP settings

Micronaut-backed settings cover:

- server port
- SSL
- timeouts
- upload size
- base path
- host resolution
- CORS
- management endpoints

## UI and webserver settings

The webserver-related configuration also includes:

- Google Analytics ID
- additional HTML tags
- mail server settings

## Typical use cases

Use this section when you need to:

- expose Kestra behind a reverse proxy
- enable HTTPS
- adjust access log format for GCP or ECS
- configure Prometheus-style metrics ingestion
- change management endpoint behavior

For detailed properties and examples, see [Full Reference](../99.full-reference/index.md#telemetry).
