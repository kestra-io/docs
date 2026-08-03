---
title: "Security Hardening for Kestra: Network and Process Isolation"
h1: Harden your deployment with isolation and network controls
sidebarTitle: Security Hardening
icon: /src/contents/docs/icons/admin.svg
description: Best practices for hardening Kestra security, including network isolation, host-level controls, and plugin validation.
---

Security hardening options for Kestra.

By design, Kestra allows arbitrary HTTP calls and script execution. To prevent misuse of link-local metadata services (IMDS), isolate and block access at the network layer:

- **Network ACLs or security groups** — configure your VPC or firewall to deny all requests to link-local ranges (e.g., `169.254.169.254/32`).
- **Dedicated orchestration subnet** - place Kestra workers in a private subnet with no route to management or metadata services.
- **Egress proxy or NAT gateway filtering** - route all outbound traffic through a proxy or gateway that can enforce allow-lists and block link-local IPs.

## Host-level isolation

Running workflows in isolated environments reduces the impact of potential malicious flows:

- **Container sandboxes** - launch each flow execution in its own container (for example, Docker or Kubernetes Pod) with minimal privileges.
- **Ephemeral compute** — use Kestra's native [Task Runners](../../07.enterprise/04.scalability/task-runners/index.md) to auto-scale ephemeral compute nodes, which are destroyed after each run to ensure no residual state.
- **Minimum host permissions** - grant only the OS-level rights required for the runtime; avoid mounting cloud credential files or granting host-level IAM roles directly.

## Plugin and code validation

To prevent the execution of malicious code, you can implement several strategies:

- **Plugin configuration** — use Kestra’s plugin architecture, including [Plugin Versioning](../../07.enterprise/05.instance/versioned-plugins/index.md), to control which plugins are allowed and [which should be prohibited](../../07.enterprise/02.governance/worker-isolation/index.md).
- **CI/CD validation** — implement a custom [Flow Validation step in your CI/CD pipeline](../../version-control-cicd/cicd/index.md) to scan task definitions for disallowed patterns (e.g., `169.254.169.254`) and block merging if detected.
- **Java Security (EE-only)** — Enterprise Edition users can define security policies to restrict access to untrusted files, plugins, or network resources.

## Credential initialization

On Enterprise Edition, configure a robust authentication mechanism such as [OIDC/SSO](../../07.enterprise/03.auth/sso/index.md) or [LDAP](../../07.enterprise/03.auth/sso/ldap/index.md) instead of Basic Authentication. These mechanisms integrate with your existing identity provider, support MFA, and remove the risk of locally managed credentials.

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

## Documentation and audit

- **User guidance** — update onboarding materials and runbooks to highlight metadata-blocking best practices when deploying a new Kestra environment.
- **Periodic review** — include network and host configuration checks in your security audit cycle to verify link-local ranges remain blocked.
