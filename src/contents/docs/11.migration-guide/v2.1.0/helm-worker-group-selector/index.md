---
title: Helm Worker Group Deployments Get Their Own Pod Selector
h1: Recreate Worker Group Deployments When You Upgrade the Helm Chart
sidebarTitle: Helm Worker Group Selector
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE"]
description: In the 2.1.0 Helm chart, each worker group Deployment has its own pod selector so worker groups can autoscale. Delete the worker group Deployments before helm upgrade, since a Deployment's selector can't change.
---

The 2.1.0 Kestra Helm chart gives each worker group Deployment its own pod selector, so you can autoscale several worker groups.

## What changed

Each entry of the `workerGroups` key in `values.yaml` creates a Deployment named `<fullname>-workergroup-<name>`. Before 2.1.0, all of them used the same pod selector as the `worker` Deployment. Kubernetes doesn't scale a Deployment whose pods are also selected by another autoscaled Deployment. So as soon as two worker groups had an autoscaler, neither of them scaled. This applied to the chart's `autoscaler`, your own HPA, and KEDA alike.

In 2.1.0, each worker group Deployment adds the label `kestra.io/worker-group: <name>` to its selector and to its pods. The `worker` Deployment and the other components keep their selectors.

## Who is affected

Enterprise Edition installations that deploy with the Kestra Helm chart and define at least one entry under `workerGroups`.

## What to do

A Deployment's `spec.selector` can't change, so `helm upgrade` fails on existing worker group Deployments. Before you upgrade the chart, delete the Deployment of each worker group. The upgrade then recreates them with the new selector:

```bash
kubectl delete deployment <fullname>-workergroup-<name>
```

For a release named `kestra` with a worker group named `default`, the Deployment is `kestra-workergroup-default`. The `worker` Deployment doesn't need to be deleted.

If you set `kestra.io/worker-group` in a worker group's `podLabels`, remove it before you upgrade. The chart now sets this label to the worker group name, and any other value fails the upgrade with a `spec.template.metadata.labels: Invalid value` error.

Tasks running on the deleted workers are interrupted, so delete the Deployments when the workers are idle or during a maintenance window.

An autoscaled `worker` Deployment next to autoscaled worker groups still overlaps with them, because its selector matches every worker pod. Autoscale either the `worker` Deployment or the worker groups, not both.
