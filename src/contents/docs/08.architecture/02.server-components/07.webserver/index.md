---
title: "Webserver in Kestra: API, UI, and Live Streams"
h1: How the Kestra Webserver Serves the API and UI
description: Understand how the Kestra Webserver serves the API, UI, live streams, and webhooks. Learn how it handles execution actions and how to run it.
sidebarTitle: Webserver
icon: /src/contents/docs/icons/architecture.svg
---

The Webserver is the server component that serves the Kestra API and UI.

It is the only component that serves user traffic. It also receives webhook calls, streams live execution updates to the UI, and checks every request against your authentication settings. Each section below links to the page that documents how to configure the feature.

## What the Webserver does

The Webserver serves:

- The REST API under `/api/v1/{tenant}/...`. In the open-source edition, a request without a tenant, such as `/api/v1/flows/search`, is served as the `main` tenant. See the [API reference](../../../api-reference/index.mdx).
- The UI under `/ui`, and the OpenAPI specification under `/swagger`.
- Live update streams for executions and logs.
- [Webhook trigger](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md) calls.
- File uploads and downloads, such as execution files, file inputs, and namespace files, which it reads from and writes to [internal storage](../../01.main-components/index.md#internal-storage).
- The [MCP server](../../../ai-tools/03.mcp-server/index.md) and [AI Copilot](../../../ai-tools/01.ai-copilot/index.md) endpoints.

The Webserver doesn't run tasks, and it doesn't evaluate Schedule or polling triggers. Those run on [Workers](../03.worker/index.md) and the [Scheduler](../05.scheduler/index.md).

### Embedded Indexer and Worker Controller

By default, `kestra server webserver` also starts an embedded [Indexer](../06.indexer/index.md) and an embedded [Worker Controller](../02.worker-controller/index.md). With the defaults, a Webserver process therefore also listens on the Worker Controller's gRPC port, `50051`, and writes logs, metrics, and execution statistics.

To run those components separately, start the Webserver with `--no-indexer` or `--no-controller`. See [`kestra server webserver`](../../../kestra-cli/kestra-server/index.md#kestra-server-webserver).

## How execution actions work

The Webserver doesn't change executions itself. When you create, restart, replay, pause, resume, kill, or relabel an execution, the Webserver sends a command to the [Executor](../01.executor/index.md) and waits for the Executor to apply it. Creating an execution works the same way: the execution is saved by the Executor, not by the Webserver.

- A single action waits up to `kestra.async-operations.wait-timeout` (default `PT30S`) for the Executor. If the Executor doesn't respond in time, the API returns `504 Gateway Timeout`.
- A bulk action, such as one sent to a `by-ids` or `by-query` endpoint, returns `202 Accepted` immediately with an operation ID and the number of executions it targets.
- Creating an execution with `?wait=true` keeps the request open until the execution ends. See [synchronous executions](../../../15.how-to-guides/synchronous-executions-api/index.md).

A few operations write directly to the repository instead of going through the Executor:

- Deleting an execution. By default, this also deletes its logs, metrics, and internal storage files.
- Creating, updating, and deleting flows.

## Live updates

The UI follows a running execution and its logs through server-sent event (SSE) streams. Each stream closes after one hour without a new update. When you open an execution right after creating it, the Webserver waits up to 10 seconds for the execution to exist before returning `404`.

Each Webserver replica reads execution and log updates from the queue and forwards them to the streams opened on that replica. Any replica can serve any stream, so a load balancer in front of several Webservers needs no sticky sessions. A replica stops reading updates while no one is following an execution.

## Webhooks

The Webserver receives [Webhook trigger](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md) calls at `/api/v1/{tenant}/executions/webhook/{namespace}/{flowId}/{key}`, with `GET`, `POST`, and `PUT`.

- Webhook routes don't require authentication. The trigger's `key` acts as the secret, and the Webserver compares it in constant time.
- An unknown flow and a wrong key both return the same `404`, so a caller can't tell which one failed.
- A disabled flow or an invalid flow returns `409`.
- The Webserver evaluates the Webhook trigger itself, then sends the new execution to the Executor. Large bodies and multipart files can be [streamed to internal storage](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md#stream-large-bodies-to-internal-storage) before the execution exists.

To restrict who can reach webhook endpoints, see [security hardening](../../../security-hardening/index.md).

## Authentication

In the open-source edition, the Webserver protects the API with [basic authentication](../../../security-hardening/index.md#basic-authentication-oss). The username must be an email address, and the password must be at least 8 characters long with an uppercase letter, a lowercase letter, and a digit. Credentials are stored hashed in the repository, so every Webserver replica accepts the same credentials. If you can't sign in, see [basic auth troubleshooting](../../../10.administrator-guide/basic-auth-troubleshooting/index.md).

Requests authenticated with a cookie are also protected against cross-site request forgery: a `POST`, `PUT`, `PATCH`, or `DELETE` without a valid CSRF token returns `403`. API clients that send an `Authorization` header aren't affected.

:::alert{type="info"}
In Enterprise Edition, the Webserver also supports [SSO, LDAP, and passwordless sign-in](../../../07.enterprise/03.auth/04.authentication/index.md), and checks every request against [RBAC](../../../07.enterprise/03.auth/rbac/index.md). Automated clients authenticate with [API tokens](../../../07.enterprise/03.auth/api-tokens/index.md).
:::

## Maintenance mode

The Webserver keeps serving the API and UI while the instance is in [maintenance mode](../../../07.enterprise/05.instance/maintenance-mode/index.md). Its embedded Indexer and Worker Controller pause with the rest of the cluster, and execution actions are held by the paused Executor until maintenance ends.

## Running the Webserver

### Scaling and load balancing

The Webserver keeps no session state, so you can run as many replicas as you need behind a load balancer. See [high availability](../../../10.administrator-guide/high-availability/index.md#load-balancing) for health checks and deployment patterns, and [reverse proxy configuration](../../../10.administrator-guide/webserver-url/index.md#reverse-proxy-configuration) for running behind a proxy.

### Ports and endpoints

| Port | Serves |
|---|---|
| `8080` | API, UI, webhooks, live streams, and `/ping`, which returns `pong` without authentication |
| `8081` | Management endpoints: `/health`, `/health/liveness`, `/health/readiness`, `/metrics`, `/prometheus`, and `/version` |
| `50051` | gRPC for the embedded Worker Controller, unless you start the Webserver with `--no-controller` |

See [Kestra endpoints](../../../10.administrator-guide/03.monitoring/index.md#kestra-endpoints) for the full list of management endpoints.

### Configuration

| Property | Default | Purpose |
|---|---|---|
| `micronaut.server.max-request-size` | `10GB` | Maximum size of a request body |
| `micronaut.server.multipart.max-file-size` | `10GB` | Maximum size of an uploaded file |
| `micronaut.server.idle-timeout`, `read-idle-timeout`, `write-idle-timeout` | `60m` | How long an idle connection stays open |
| `kestra.async-operations.wait-timeout` | `PT30S` | How long an execution action waits for the Executor before returning `504` |
| `kestra.webserver.ui.enabled` | `true` | Set to `false` to serve the API only. See [Disabling the UI](../../../configuration/03.observability-and-networking/index.md#disabling-the-ui-api-only-mode). |
| `kestra.webserver.security-headers.*` | enabled | Security headers added to every response. See [Security response headers](../../../configuration/03.observability-and-networking/index.md#security-response-headers). |

For the other server and UI settings, see [Network and HTTP settings](../../../configuration/03.observability-and-networking/index.md#network-and-http-settings) and [UI and webserver settings](../../../configuration/03.observability-and-networking/index.md#ui-and-webserver-settings).

### Monitoring and troubleshooting

The Webserver publishes a counter for each execution action it forwards, such as `webserver.execution.restart.total` and `webserver.execution.kill.total`. It also publishes `sse.connections.active` and `sse.connections.opened.total`, tagged with `sse_type`, for live streams. See [Kestra's metrics](../../../10.administrator-guide/03.monitoring/index.md#kestras-metrics).

Every request is logged by the `io.kestra.webserver.access` logger, except requests for UI assets, health checks, and metrics.

When a specific queue record blocks the Webserver's embedded components, start it with `--ignore-queue-records` or `--ignore-indexer-records` to skip that record while you investigate. These flags are for troubleshooting only.
