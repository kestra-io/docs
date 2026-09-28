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
- Ephemeral compute: use Kestra's native [Task Runners](../../task-runners/index.mdx) to auto-scale ephemeral compute nodes that are destroyed after each run, leaving no residual state.
- Minimum host permissions: grant only the OS-level rights required for the runtime; avoid mounting cloud credential files or granting host-level IAM roles directly.

## Worker isolation

In Kestra 2.0, workers do not connect to the database. A worker opens an outbound gRPC stream to a Worker Controller, receives jobs on that stream, and sends results, logs, and metrics back on it. The database repositories are not on the worker classpath, so there is no worker-side setting that can re-enable direct database access. See [worker communication](../../08.architecture/index.mdx#worker-communication) for how the stream works.

This changes what a compromised worker can reach:

- A worker holds no database credentials. An attacker who takes over a worker host gets the jobs that worker was given, not the tables holding every execution and flow.
- Secrets travel encrypted on the job queue and on the gRPC stream. The worker decrypts a secret at the moment a task uses it, and the plaintext is never written back into the execution.
- Worker gRPC traffic is flagged as internal, so IAM does not treat it as a user API call.

Because the worker only needs an outbound route to the controller, you can run it in a restricted subnet, a separate region, or an air-gapped site. Give it network access to the controller port and to the systems its tasks call, and nothing else. Do not give worker hosts database credentials or cloud IAM roles that the tasks themselves do not need.

The gRPC channel is plaintext by default. Before a worker runs outside the network you trust, secure the channel as described in the next section.

## Transport security

In distributed deployments, Worker Controllers communicate with Workers over gRPC. By default this channel is plaintext. TLS, mTLS, and JWT-based worker authentication are Enterprise Edition features; the open-source edition always uses a plaintext channel, so keep controller and workers on a trusted network.

- **One-way TLS** — the controller presents a certificate; workers verify it. Encrypts the channel without requiring worker certificates.
- **Mutual TLS (mTLS)** — both controller and worker present certificates. Use this when you need strong identity verification between components, not just encryption.

See [gRPC TLS/mTLS configuration](../../configuration/06.enterprise-and-advanced/index.md#grpc-tlsmtls-ee-only) for setup instructions and a full property reference. With mTLS (`kestra.grpc.tls.client-auth: REQUIRE`), a worker without a certificate signed by the controller's trusted CA is refused at the handshake.

On top of transport security, Enterprise Edition workers can be required to present a JWT obtained with a per-group registration token (`kestra.ee.worker.auth.enabled`, off by default). See [worker authentication](../../07.enterprise/04.scalability/worker-group/index.md#worker-authentication).

## HTTP task URL filtering

HTTP plugin tasks (`Request`, `Download`, `SseRequest`, and `Trigger`) make server-side HTTP calls to URIs controlled by flow authors. Without restrictions, a flow author can reach cloud metadata endpoints (such as `169.254.169.254` on AWS, GCP, and Azure), internal management APIs, or private services not reachable from the internet.

Configure an allow-list, a deny-list, or both under `kestra.tasks.http`:

```yaml
kestra:
  tasks:
    http:
      allowed-list:
        - https://api.example.com
        - https://*.data.partner.io   # matches foo.data.partner.io, bar.data.partner.io, etc.
      denied-list:
        - http://169.254.169.254
        - http://localhost
        - http://127.0.0.1
```

| Property | Default | Description |
|---|---|---|
| `kestra.tasks.http.allowed-list` | `[]` | When non-empty, a request URI must match at least one entry or the task fails. |
| `kestra.tasks.http.denied-list` | `[]` | A request URI that matches any entry causes the task to fail. Evaluated after the allowed-list. |

Both lists are empty by default — no filtering is applied unless you configure them.

When both lists are set, the allowed-list is checked first. A URI that matches an allowed-list entry but also matches a denied-list entry is still blocked.

### Matching rules

Host matching is **exact** by default. The scheme and port must also match. The path is prefix-matched.

- `https://api.example.com` matches `https://api.example.com/v1/data` but not `https://sub.api.example.com/v1/data`.
- `http://169.254.169.254` blocks `http://169.254.169.254/latest/meta-data/...`.

**Wildcard subdomain matching**: prefix an entry with `*.` to match all subdomains of a host. A wildcard entry matches subdomains only — not the host itself.

- `*.example.com` (or `https://*.example.com`) matches `foo.example.com` and `bar.example.com` but not `example.com`.
- To match both a domain and all its subdomains, add two entries: `example.com` and `*.example.com`.

Matching is not CIDR or glob-based. IP ranges cannot be expressed as a single entry; list each address explicitly.

When a URI is blocked, the task fails with an error that identifies the matching config key:

```
The URI http://169.254.169.254/... is in the configured denied list (kestra.tasks.http.denied-list).
```

:::alert{type="info"}
This filter applies to HTTP plugin tasks and the `http()` Pebble expression function.
:::

## Encryption key

An encryption key under `kestra.encryption.secret-key` is required for `SECRET` inputs and outputs to be stored safely at rest. Without it, any flow that uses `SECRET`-typed inputs or outputs fails at runtime.

```yaml
kestra:
  encryption:
    secret-key: BASE64_ENCODED_STRING_OF_32_CHARACTERS
```

Generate a key with:

```bash
openssl rand -base64 32
```

See [Encryption configuration](../../configuration/05.security-and-secrets/index.md#encryption) for full details.

## Plugin restrictions (EE)

Plugin restrictions control which task runners and plugins flow authors can use. At minimum, the Process task runner should be restricted in multi-tenant or untrusted environments — it executes directly on the worker host with no container isolation.

Configure plugin restrictions and worker isolation under [Worker Isolation](../../07.enterprise/02.governance/worker-isolation/index.md). For finer-grained policy enforcement across namespaces and tenants, use [Policies](../../07.enterprise/02.governance/policies/index.md) to inject, validate, or reject plugin and flow configuration at save or execution time.

## Plugin and code validation

- Plugin configuration: use Kestra’s plugin architecture, including [Plugin Versioning](../../07.enterprise/05.instance/versioned-plugins/index.md), to control which plugins are allowed and [which should be prohibited](../../07.enterprise/02.governance/worker-isolation/index.md).
- CI/CD validation: add a [Flow Validation step in your CI/CD pipeline](../../version-control-cicd/cicd/index.md) to scan task definitions for disallowed patterns (e.g., `169.254.169.254`) and block merging if detected.

## Credential initialization

On Enterprise Edition, use [OIDC/SSO](../../07.enterprise/03.auth/sso/index.md) or [LDAP](../../07.enterprise/03.auth/sso/ldap/index.md) instead of Basic Authentication. These integrate with your existing identity provider, support MFA, and remove the risk of locally managed credentials. [One-Time-Password (OTP)](../../07.enterprise/03.auth/04.authentication/index.md#passwordless-otp) is also supported, though it provides less protection than SSO with MFA.

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

Kestra exposes internal endpoints on a separate management port (default `8081`). These include health checks, metrics (`/metrics`), and runtime log level inspection (`/loggers`). This port is unauthenticated by default.

The primary protection is network isolation: do not expose port `8081` outside the internal network. Firewall or security-group rules should restrict access to the management port to trusted internal hosts only (monitoring agents, load balancer health checkers, operations tooling).

When network isolation alone is insufficient, Basic Auth can be added to the management port and the port can be moved from its default by configuring `endpoints.all` in your `application.yml`:

```yaml
endpoints:
  all:
    port: 8084   # move away from the default 8081
    basic-auth:
      username: <management-username>
      password: <strong-password>
```

When `basic-auth` credentials are present, Kestra's management endpoint filter requires Basic Auth on every request to that port.

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


## Related configuration

- [Encryption and secrets configuration](../../configuration/05.security-and-secrets/index.md) — encryption key setup, secret backend configuration, and auth security settings.
- [External Secrets Manager](../../07.enterprise/02.governance/secrets-manager/index.md) — integrate with AWS Secrets Manager, Azure Key Vault, GCP Secret Manager, HashiCorp Vault, and others to avoid storing credentials in Kestra directly.
- [Policies](../../07.enterprise/02.governance/policies/index.md) — enforce governance rules that inject, validate, or reject plugin and flow configuration across namespaces and tenants.
