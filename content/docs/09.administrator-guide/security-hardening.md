---
title: Security Hardening
icon: /docs/icons/admin.svg
---

Security hardening options

### Restrict access to cloud metadata endpoints

By design, Kestra allows arbitrary HTTP calls and script execution. To prevent misuse of link-local metadata services (IMDS), we recommend isolating and blocking access at the network layer:

- **Network ACLs or security groups** - configure your VPC or firewall to deny all requests to link-local ranges (for example, 169.254.169.254/32).
- **Dedicated orchestration subnet** - place Kestra workers in a private subnet with no route to management or metadata services.
- **Egress proxy or NAT gateway filtering** - route all outbound traffic through a proxy or gateway that can enforce allow-lists and block link-local IPs.

### Host-level isolation

Running workflows in isolated environments reduces the blast radius of a malicious flow:

- **Container sandboxes** - launch each flow execution in its own container (for example, Docker or Kubernetes Pod) with minimal privileges.
- **Ephemeral compute** - use Kestra's native [Task Runners](../06.enterprise/04.scalability/task-runners.md) to auto-scale ephemeral compute nodes that are destroyed after each run, ensuring no residual state.
- **Minimum host permissions** - grant only the OS-level rights required for the runtime; avoid mounting cloud credential files or granting host-level IAM roles directly.

### Pre-execution script guards

For teams that need an extra check before running untrusted code:

- **Plugin configuration** - use Kestra’s flexible plugin architecture incl. [Plugin Versioning](../06.enterprise/05.instance/versioned-plugins.md) to control which plugins do you want to be used within the platform and [which should be prohibites](../06.enterprise/02.governance/worker-isolation.md).
- **Java Security (EE only)** - Enterprise Edition users can define Security policies to prohibit access to untrusted files or network resources.
- **CI/CD validation** - implement a custom [CI/CD check within Flow Validation step](../version-control-cicd/cicd/index.md) that scans task definitions for disallowed patterns (e.g., `169.254.169.254`) and disallow merging flow code if detected.

### Documentation and audit

- **User guidance** - update your internal onboarding and runbooks to highlight metadata-blocking best practices when standing up a new Kestra environment.
- **Periodic review** - include network-and-host configuration checks in your security audit cycle to verify link-local ranges remain inaccessible.


