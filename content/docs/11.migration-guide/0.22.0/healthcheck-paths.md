---
title: Helm Chart Health Check Paths
icon: /docs/icons/migration-guide.svg
release: 0.22.0
editions: ["OSS", "EE"]
---

Change in the health check paths for Kestra's Helm Chart

## Overview

Before [this Helm Charts PR](https://github.com/kestra-io/helm-charts/pull/62/files), both probes pointed to `/health`. This caused Kubernetes to restart the pod when an external component was unavailable.

To resolve this, we updated the value file to configure the liveness and readiness probes to use the health paths recommended by Micronaut:

- Liveness probe now points to `/health/liveness`
- Readiness probe now points to `/health/readiness`.

## Before Kestra 0.22

- Liveness probe: `/health`
- Readiness probe: `/health`

## After Kestra 0.22

- Liveness probe: `/health/liveness`
- Readiness probe: `/health/readiness`
