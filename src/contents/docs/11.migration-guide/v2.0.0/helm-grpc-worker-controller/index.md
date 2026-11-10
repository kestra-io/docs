---
title: Helm Chart gRPC Worker-Controller Changes in Kestra 2.0.0
h1: Update Helm Chart for gRPC Worker-Controller
sidebarTitle: Helm gRPC Worker-Controller
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: Kestra 2.0.0 exposes port 50051 by default on all pods and adds a dedicated controller deployment to the Helm chart. Review these changes before upgrading.
---

Kestra 2.0.0 introduces gRPC-based worker-controller communication. Every Kestra pod in the Helm chart now declares port 50051, and the chart supports three deployment patterns: standalone, standalone with detached workers, and fully distributed.

:::alert{type="warning"}
**Back up your database before upgrading.** Kestra 2.0.0 drops JDBC queue tables on startup. This is irreversible. A backup is the only way to recover if the upgrade fails.
:::

:::alert{type="info"}
**Required starting point.** You must be running Kestra >= 1.3.0 before upgrading to 2.0.0. If you are on an older release, complete the migration to 1.3 first. See the [LTS migration guide (1.0 → 1.3)](../../v1.3.0/lts-migration/index.md).
:::

## What changed

### Port 50051 exposed by default

Every Kestra container in the chart now declares port 50051 (`grpc`). Only pods that run a controller listen on it: the standalone pod, the webserver pod (which embeds a controller), and the dedicated controller pod. Workers open outbound connections to it. In previous releases this port was not exposed.

The chart adds port 50051 to the main `Service`, which fronts the standalone pod, or the webserver pod when standalone is disabled. When you enable `deployments.controller`, the port moves from the main `Service` to the dedicated controller `Service`.

**Action required**: Update any firewall rules or Kubernetes `NetworkPolicy` resources so that worker pods can reach port 50051 on the controller pods. If your cluster applies a default-deny network policy, add an explicit allow rule before upgrading, or workers fail to connect to the controller.

:::alert{type="warning"}
The gRPC port inherits `service.type`. If your main `Service` is a `LoadBalancer` or `NodePort`, port 50051 becomes reachable from outside the cluster after the upgrade, and gRPC traffic is unencrypted by default. Restrict access to the port. In Enterprise Edition, also enable [worker authentication](#worker-authentication-enterprise-edition) and [TLS](../../../07.enterprise/04.scalability/worker-group/index.md#transport-security-tls).
:::

### Resource names

The chart names its resources after the chart's full name, written `<fullname>` on this page:

- If the release name contains `kestra`, `<fullname>` is the release name. A release named `my-kestra` creates the `Service` resources `my-kestra` and `my-kestra-controller`.
- Otherwise, `<fullname>` is `<release-name>-kestra`. A release named `prod` creates `prod-kestra` and `prod-kestra-controller`.
- `fullnameOverride` replaces it entirely.

Run `kubectl get svc` to see the exact names in your release.

### New `deployments.controller` deployment option

A new `deployments.controller` key is available in `values.yaml`. When enabled, the chart creates a dedicated controller `Deployment` and a `ClusterIP` `Service` named `<fullname>-controller` on port 50051.

The controller deployment is **disabled by default**. Existing standalone deployments require no change to this key.

The controller `Service` type is fixed to `ClusterIP`. Workers running outside the cluster need an additional `Service` or load balancer in front of the controller pods, which you can add with `extraManifests`.

### `--worker-group` flag removed

The worker `--worker-group` CLI flag no longer exists, and a worker started with an unknown flag fails to start. Before upgrading, remove `--worker-group` from the `extraArgs` of `deployments.worker` and of every `workerGroups` entry. A worker now joins a group by presenting a registration token.

### Using the `workerGroups` Helm key (Enterprise Edition)

The `workerGroups` map in `values.yaml` is still supported, and each entry still creates a worker deployment named `<fullname>-workergroup-<name>`. What changed is how groups are defined and how tasks reach them:

- Worker Groups are created on the server, through the Kestra UI, API, or declarative configuration. Workers join a group at runtime by presenting a registration token (see [Worker authentication](#worker-authentication-enterprise-edition) below).
- Tasks no longer target a group by name. They declare `workerSelector.tags`, which route them to a Worker Queue that one or more groups subscribe to. The `workerGroup.key` task property is removed, and the default `fallback` changes from `WAIT` to `FAIL`. See [Migrating from earlier versions](../../../07.enterprise/04.scalability/worker-group/index.md#migrating-from-earlier-versions).

Kestra does not migrate existing worker groups. For each group you previously defined in `workerGroups`:

1. In the Instance Owner console, go to **Infrastructure → Worker Queues** and create a Worker Queue with a tag for the old key, for example the id `wg-1` with the tag `wg-1`.
2. Go to **Infrastructure → Worker Groups**, create a Worker Group (for example `wg-1`), and subscribe it to that queue. Group ids must be RFC 1123 labels: lowercase letters, digits, and hyphens. Rename any old key that contains uppercase letters or underscores.
3. Generate a registration token for that group. Copy it immediately because it is shown only once.
4. Store the token in a Kubernetes Secret, for example `kestra-wg-1-token` with the key `token`.
5. Enable worker authentication for the release and give the worker deployment its token, as shown below.
6. Update your flows: replace `workerGroup.key: wg-1` with `workerSelector.tags: [wg-1]`. Add `fallback: WAIT` where tasks should keep waiting for an unavailable worker, as they did before 2.0.

:::alert{type="info"}
For automated and IaC deployments, use `kestra.ee.setup` to declare the full worker topology in `application.yml`. Kestra applies it at startup, so all services can start in a single Helm pass. A worker that starts before the configuration is applied exits with an authentication error, and Kubernetes restarts it until it can register. See [Declarative configuration](../../../07.enterprise/04.scalability/worker-group/index.md#declarative-configuration) on the Worker Groups page.
:::

`configurations.application` is mounted on every pod in the release, workers included. Put the settings every pod shares there, and put each worker's registration token in that worker deployment's `extraEnv`:

```yaml
# Shared by every pod: webserver, executor, scheduler, controller, and workers
configurations:
  application:
    kestra:
      ee:
        worker:
          auth:
            enabled: true

deployments:
  worker:
    enabled: true
    # Only this deployment receives the token, so its workers join wg-1
    extraEnv:
      - name: KESTRA_WORKER_AUTH_REGISTRATION_TOKEN
        valueFrom:
          secretKeyRef:
            name: kestra-wg-1-token
            key: token
```

The registration token is what assigns the worker to a group, so no `extraArgs` are needed. Workers need `kestra.ee.worker.auth.enabled: true`, which they get from `configurations.application`. Without it, the worker ignores its token and the controller rejects the connection.

The signing key for worker access tokens defaults to `kestra.encryption.secret-key`. To set a separate `kestra.ee.worker.auth.jwt-signing-key`, keep it out of `configurations.application`, which the chart renders into a plaintext `ConfigMap`. Mount it from a Kubernetes Secret with `configurations.secrets` instead. Workers ignore the signing key.

If you previously ran multiple worker groups in parallel (for example `wg-1` and `wg-2`), each group needs its own worker deployment with its own token. Add an entry under `workerGroups` for each additional group:

```yaml
workerGroups:
  wg-2:
    enabled: true
    extraEnv:
      - name: KESTRA_WORKER_AUTH_REGISTRATION_TOKEN
        valueFrom:
          secretKeyRef:
            name: kestra-wg-2-token
            key: token
```

Do not put `kestra.worker.auth.registration-token` in `configurations.application`. Every worker deployment would receive the same token and join the same group.

## Deployment patterns

Choose the pattern that matches your target architecture. Detached workers need `kestra.worker.controllers` to find the controller: the chart does not configure it.

### Pattern 1: Standalone (no change required)

All Kestra components run in a single pod. The controller runs inside the standalone pod and the default `STATIC localhost:50051` config resolves automatically, so no `values.yaml` changes are needed. Review the [Port 50051 exposed by default](#port-50051-exposed-by-default) section for network policy requirements.

### Pattern 2: Standalone pod with detached workers

The standalone pod runs the controller, executor, scheduler, webserver, and indexer. Workers run in a separate deployment and connect back to the standalone pod for controller instructions.

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
              - host: my-kestra  # <fullname>: the main Service in front of the standalone pod
                port: 50051
```

Replace `my-kestra` with the `<fullname>` of your release (see [Resource names](#resource-names)).

Keep `deployments.controller` disabled in this pattern. Enabling it moves port 50051 off the main `Service`, and workers pointed at `<fullname>` can no longer connect.

The standalone pod also keeps its own embedded worker, so it still runs tasks. Because `configurations.application` reaches every pod, the embedded worker uses the same `controllers` setting and connects back through the `Service`. To run tasks only on the detached workers, start the standalone pod without a worker. Setting `workerThreads: 0` does not work, because the chart skips the flag when the value is `0`. Pass it explicitly:

```yaml
deployments:
  standalone:
    extraArgs:
      - --worker-thread=0
```

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
              - host: my-kestra-controller  # <fullname>-controller
                port: 50051
```

Replace `my-kestra-controller` with `<fullname>-controller` for your release. The chart creates this `ClusterIP` `Service` on port 50051.

The webserver pod also starts an embedded controller by default. Workers pointed at `<fullname>-controller` never connect to it. To disable it and recover those resources, add `--no-controller` to the webserver's `extraArgs`:

```yaml
deployments:
  webserver:
    extraArgs:
      - --no-controller
```

This is optional. The embedded controller is harmless if left running.

To run more than one controller, set `deployments.controller.replicas`. The `ClusterIP` `Service` resolves to a single virtual IP, so each worker stays on one controller pod until the controller recycles the connection (`kestra.controller.max-connection-age`, default `PT1H`). To spread workers evenly across controller pods, add a headless `Service` (`clusterIP: None`) with `extraManifests` and use [`type: DNS` discovery](../../../07.enterprise/04.scalability/worker-group/index.md#controller-discovery-strategies) against it.

## Worker authentication (Enterprise Edition)

Worker authentication secures the gRPC channel between workers and controllers with JWT tokens. It is **disabled by default** and requires explicit opt-in. In the open-source edition, use [`kestra.grpc.basic-auth`](../../../configuration/05.security-and-secrets/index.md#grpc-basic-authentication) to require a shared username and password on the gRPC channel instead.

When enabled, workers present a registration token generated for their Worker Group. On first connect, the worker exchanges this token for a short-lived access token and a rotating refresh token. The access token is refreshed automatically. Revoking or deleting a token, or force-deleting its Worker Group, disconnects the workers that used it immediately.

In a Helm release, the settings split like this:

| Setting | Where to put it | Pods that use it |
|---|---|---|
| `kestra.ee.worker.auth.enabled: true` | `configurations.application` | Every pod, workers included |
| `kestra.ee.worker.auth.jwt-signing-key` (optional) | A Secret mounted with `configurations.secrets` | Every pod except workers. Workers ignore it |
| `KESTRA_WORKER_AUTH_REGISTRATION_TOKEN` | `extraEnv` of each worker deployment (`deployments.worker` or a `workerGroups` entry) | Only the workers of that group |

See [Using the `workerGroups` Helm key](#using-the-workergroups-helm-key-enterprise-edition) for a complete `values.yaml` example, and [Where each setting goes](../../../07.enterprise/04.scalability/worker-group/index.md#where-each-setting-goes) for the same split outside Helm.

Generate registration tokens from **Infrastructure → Worker Groups → [group] → Tokens** in the Instance Owner console, or via `POST /api/v1/instance/worker-groups/{id}/tokens`. The plaintext token is shown only once, so copy it before closing the dialog.

To encrypt the gRPC channel, configure [TLS](../../../07.enterprise/04.scalability/worker-group/index.md#transport-security-tls) in `configurations.application`, and mount the keystore and truststore files from Kubernetes Secrets with `extraVolumes` and `extraVolumeMounts`.

## Upgrade steps

1. **Back up your database.** Kestra 2.0.0 drops JDBC queue tables on startup. This cannot be undone without a backup.
2. **Review network policies.** Port 50051 is now exposed. Add allow rules between Kestra components before upgrading if your cluster uses default-deny network policies. If your main `Service` is not `ClusterIP`, restrict external access to port 50051.
3. **Remove `--worker-group` from `extraArgs`.** Check `deployments.worker` and every `workerGroups` entry.
4. **Select your deployment pattern.** Determine whether you are staying on standalone, adding detached workers, or moving to fully distributed. Prepare the corresponding `values.yaml` changes.
5. **Upgrade the chart.** Use `2.0.0` or the latest `2.0.x` chart version:
   ```bash
   helm upgrade my-kestra kestra/kestra --version 2.0.0 -f values.yaml
   ```
6. **Verify all pods reach `Running` state.**
   ```bash
   kubectl get pods -l app.kubernetes.io/name=kestra
   ```
7. **Confirm workers connect to the controller.** Each worker logs `Connected to controller, workerGroup: <group>` once connected. If workers log connection errors on port 50051, verify that the `kestra.worker.controllers.static.endpoints[0].host` value matches a `Service` name from `kubectl get svc` and that network policies allow the traffic.

## Reference

- [Kubernetes deployment guide](../../../02.installation/03.kubernetes/index.md): full `configurations.application` reference and credential injection patterns
- [Helm chart values.yaml for 2.0](https://github.com/kestra-io/kestra/blob/releases/v2.0.x/charts/kestra/values.yaml): full list of available chart options
