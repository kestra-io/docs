---
title: Security Hardening
icon: /docs/icons/admin.svg
---

Security hardening options for Kestra.

### Restrict access to cloud metadata endpoints

By design, Kestra allows arbitrary HTTP calls and script execution. To prevent misuse of link-local metadata services (IMDS), isolate and block access at the network layer:

- **Network ACLs or security groups** — configure your VPC or firewall to deny all requests to link-local ranges (e.g., `169.254.169.254/32`).
- **Dedicated orchestration subnet** - place Kestra workers in a private subnet with no route to management or metadata services.
- **Egress proxy or NAT gateway filtering** - route all outbound traffic through a proxy or gateway that can enforce allow-lists and block link-local IPs.

### Host-level isolation

Running workflows in isolated environments reduces the impact of potential malicious flows:

- **Container sandboxes** - launch each flow execution in its own container (for example, Docker or Kubernetes Pod) with minimal privileges.
- **Ephemeral compute** — use Kestra's native [Task Runners](../07.enterprise/04.scalability/task-runners.md) to auto-scale ephemeral compute nodes, which are destroyed after each run to ensure no residual state.
- **Minimum host permissions** - grant only the OS-level rights required for the runtime; avoid mounting cloud credential files or granting host-level IAM roles directly.

### Plugin and code validation

To prevent the execution of malicious code, you can implement several strategies:

- **Plugin configuration** — use Kestra’s plugin architecture, including [Plugin Versioning](../07.enterprise/05.instance/versioned-plugins.md), to control which plugins are allowed and [which should be prohibited](../07.enterprise/02.governance/worker-isolation.md).
- **CI/CD validation** — implement a custom [Flow Validation step in your CI/CD pipeline](../version-control-cicd/cicd/index.md) to scan task definitions for disallowed patterns (e.g., `169.254.169.254`) and block merging if detected.
- **Java Security (EE-only)** — Enterprise Edition users can define security policies to restrict access to untrusted files, plugins, or network resources.

### Documentation and audit

- **User guidance** — update onboarding materials and runbooks to highlight metadata-blocking best practices when deploying a new Kestra environment.
- **Periodic review** — include network and host configuration checks in your security audit cycle to verify link-local ranges remain blocked.
