---
title: "Security Hardening for Kestra: Network and Process Isolation"
h1: Harden your deployment with isolation and network controls
sidebarTitle: Security Hardening
icon: /src/contents/docs/icons/admin.svg
description: Best practices for hardening Kestra security, including network isolation, host-level controls, and plugin validation.
---

Configure network isolation, endpoint authentication, and upload protection to harden a Kestra deployment.

By design, Kestra allows arbitrary HTTP calls and script execution. To prevent misuse of link-local metadata services (IMDS), isolate and block access at the network layer:

- Network ACLs or security groups: configure your VPC or firewall to deny all requests to link-local ranges (e.g., `169.254.169.254/32`).
- Dedicated orchestration subnet: place Kestra workers in a private subnet with no route to management or metadata services.
- Egress proxy or NAT gateway filtering: route all outbound traffic through a proxy or gateway that can enforce allow-lists and block link-local IPs.

## Host-level isolation

Running workflows in isolated environments reduces the impact of potentially malicious flows:

- Container sandboxes: launch each flow execution in its own container (for example, Docker or Kubernetes Pod) with minimal privileges.
- Ephemeral compute: use Kestra's native [Task Runners](../../07.enterprise/04.scalability/task-runners/index.md) to auto-scale ephemeral compute nodes that are destroyed after each run, leaving no residual state.
- Minimum host permissions: grant only the OS-level rights required for the runtime; avoid mounting cloud credential files or granting host-level IAM roles directly.

## Plugin and code validation

- Plugin configuration: use Kestra’s plugin architecture, including [Plugin Versioning](../../07.enterprise/05.instance/versioned-plugins/index.md), to control which plugins are allowed and [which should be prohibited](../../07.enterprise/02.governance/worker-isolation/index.md).
- CI/CD validation: add a [Flow Validation step in your CI/CD pipeline](../../version-control-cicd/cicd/index.md) to scan task definitions for disallowed patterns (e.g., `169.254.169.254`) and block merging if detected.
- Java Security (EE): Enterprise Edition users can define security policies to restrict access to untrusted files, plugins, or network resources.

## Credential initialization

On Enterprise Edition, use [OIDC/SSO](../../07.enterprise/03.auth/sso/index.md) or [LDAP](../../07.enterprise/03.auth/sso/ldap/index.md) instead of Basic Authentication. These integrate with your existing identity provider, support MFA, and remove the risk of locally managed credentials.

If you use Basic Authentication on OSS or EE:

:::alert{type="warning"}
On a fresh installation with no `basic-auth` credentials configured, the Setup page at `/ui/main/setup` is publicly reachable. Any user who reaches it first can set credentials and lock out the intended administrator.

**Configure `username` and `password` in the application configuration file before starting Kestra in production.** This skips the Setup page entirely and ensures the instance is never in an unprotected state.

```yaml
kestra:
  server:
    basic-auth:
      username: admin@kestra.io
      password: "{{ your-strong-password }}"
```
:::

## Management endpoint access

Kestra exposes internal endpoints on a separate management port (default `8081`). These include health checks, runtime log level changes (`/loggers`), metrics (`/metrics`), and an environment inspection endpoint (`/env`) that can expose configuration values. This port is unauthenticated by default.

The primary protection is network isolation: do not expose port `8081` outside the internal network. Firewall or security-group rules should restrict access to the management port to trusted internal hosts only (monitoring agents, load balancer health checkers, operations tooling).

If network isolation is not sufficient, you can add Basic Auth to the management port and optionally move it to a non-default port by configuring `endpoints.all` in your `application.yml`:

```yaml
endpoints:
  all:
    port: 8084   # move away from the default 8081
    basic-auth:
      username: <management-username>
      password: <strong-password>
```

When `basic-auth` credentials are present, Kestra's management endpoint filter requires Basic Auth on every request to that port.

You can also disable individual endpoints you do not need:

```yaml
endpoints:
  env:
    enabled: false   # disables /env, which can expose config values
```

:::alert{type="warning"}
The `/env` endpoint is enabled by default and can expose configuration properties including secrets passed as environment variables. Disable it or restrict the management port at the network layer before deploying to production.
:::

See [Kestra endpoints](../03.monitoring/index.md#kestra-endpoints) for the full list of what is exposed on the management port.

## ZIP bomb protection

Kestra guards against ZIP bomb attacks on the two endpoints that accept user-uploaded ZIP archives: flow import and namespace file upload. The protection is opt-in and disabled by default.

Enable it under `kestra.security.zip-bomb-protection` in your `application.yml`:

```yaml
kestra:
  security:
    zip-bomb-protection:
      enabled: true
      max-number-of-entries: <integer>   # maximum number of entries in the archive
      max-entry-size: <bytes>            # maximum uncompressed size of a single entry
```

Both `max-number-of-entries` and `max-entry-size` are required when `enabled: true`. Set them based on the largest legitimate ZIP archives your users are expected to upload. When a ZIP exceeds either limit, the request is rejected with an HTTP 422 error.

:::alert{type="info"}
The protection applies only to user-uploaded ZIPs (flow import and namespace file upload). Internal Kestra archives used for task execution caching are not affected.
:::

## Documentation and audit

- User guidance: update onboarding materials and runbooks to highlight metadata-blocking best practices when deploying a new Kestra environment.
- Periodic review: include network and host configuration checks in your security audit cycle to verify link-local ranges remain blocked.
