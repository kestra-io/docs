---
title: Helm Chart gRPC Worker-Controller Changes in Kestra 2.0.0
sidebarTitle: Helm gRPC Worker-Controller
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: Kestra 2.0.0 exposes port 50051 by default on all pods and adds a dedicated controller deployment to the Helm chart. Review these changes before upgrading.
---

Kestra 2.0.0 introduces gRPC-based worker-controller communication. Port 50051 is now exposed by default on all pods, and the Helm chart adds support for three deployment patterns: standalone, standalone with detached workers, and fully distributed.

:::alert{type="warning"}
**Back up your database before upgrading.** Kestra 2.0.0 drops JDBC queue tables on startup. This is irreversible. A backup is the only way to recover if the upgrade fails.
:::

:::alert{type="info"}
**Required starting point.** You must be running Kestra >= 1.0.0 before upgrading to 2.0.0. If you are on an older release, complete the 1.0 → 1.3 migration first. See the [LTS migration guide (1.0 → 1.3)](../../v1.3.0/lts-migration/index.md).
:::

## What changed

### Port 50051 exposed by default

The Kestra chart now exposes port 50051 (`grpc`) on all pods and on the standalone `Service` resource. In previous releases this port was not exposed.

**Action required**: Update any firewall rules or Kubernetes `NetworkPolicy` resources that restrict ingress to Kestra pods to allow traffic on port 50051 between Kestra components. If your cluster applies a default-deny network policy, you must add an explicit allow rule before upgrading or workers will fail to connect to the controller.

### New `deployments.controller` deployment option

A new `deployments.controller` key is available in `values.yaml`. When enabled, the chart creates a dedicated controller `Deployment` and a `ClusterIP` `Service` named `<release-name>-controller` at port 50051.

The controller deployment is **disabled by default**. Existing standalone deployments require no change to this key.

## Deployment patterns

Choose the pattern that matches your target architecture.

### Pattern 1: Standalone (no change required)

All Kestra components run in a single pod. The controller runs inside the standalone pod and the default `STATIC localhost:50051` config resolves automatically — no `values.yaml` changes are needed. Review the [Port 50051 exposed by default](#port-50051-exposed-by-default) section for network policy requirements.

### Pattern 2: Standalone pod with detached workers

The standalone pod handles the controller, executor, scheduler, webserver, and indexer. Workers run in a separate deployment and connect back to the standalone pod for controller instructions.

```yaml
deployments:
  worker:
    enabled: true

configurations:
  application:
    kestra:
      worker:
        controllers:
          type: STATIC
          static:
            endpoints:
              - host: my-kestra  # Kubernetes Service name of the standalone pod
                port: 50051
```

Replace `my-kestra` with your Helm release name. The `Service` created for the standalone pod is named `<release-name>`.

### Pattern 3: Fully distributed with a dedicated controller

Each Kestra component runs in its own deployment. The controller runs separately and workers connect to it. This pattern is recommended for high-throughput production environments.

```yaml
deployments:
  standalone:
    enabled: false
  webserver:
    enabled: true
  executor:
    enabled: true
  indexer:
    enabled: true
  scheduler:
    enabled: true
  worker:
    enabled: true
  controller:
    enabled: true

configurations:
  application:
    kestra:
      worker:
        controllers:
          type: STATIC
          static:
            endpoints:
              - host: my-kestra-controller  # dedicated controller Service
                port: 50051
```

Replace `my-kestra` with your Helm release name. The chart creates a `ClusterIP` `Service` named `<release-name>-controller` on port 50051.

The webserver pod also starts an embedded controller by default. In this mode workers only connect to `<release-name>-controller`, so the embedded controller is unused. To disable it and recover those resources, add `--no-controller` to the webserver's `extraArgs`:

```yaml
deployments:
  webserver:
    extraArgs:
      - --no-controller
```

This is optional — Kestra supports multiple controllers for load balancing, so the embedded one is harmless if left running.

## Upgrade steps

1. **Back up your database.** Kestra 2.0.0 drops JDBC queue tables on startup. This cannot be undone without a backup.
2. **Review network policies.** Port 50051 is now exposed. Add allow rules between Kestra components before upgrading if your cluster uses default-deny network policies.
3. **Select your deployment pattern.** Determine whether you are staying on standalone, adding detached workers, or moving to fully distributed. Prepare the corresponding `values.yaml` changes.
4. **Upgrade the chart.**
   ```bash
   helm upgrade my-kestra kestra/kestra --version 2.0.0 -f values.yaml
   ```
5. **Verify all pods reach `Running` state.**
   ```bash
   kubectl get pods -l app.kubernetes.io/name=kestra
   ```
6. **Confirm workers connect to the controller.** Check worker pod logs for a successful controller handshake. If workers log connection errors on port 50051, verify the `kestra.worker.controllers.static.endpoints[0].host` value matches the correct `Service` name and that network policies allow the traffic.

## Reference

- [Kubernetes deployment guide](../../../02.installation/03.kubernetes/index.md) — full `configurations.application` reference and credential injection patterns
- [Helm chart values.yaml](https://github.com/kestra-io/kestra/blob/develop/charts/kestra/values.yaml) — full list of available chart options
