---
title: "Security Upgrades in Kestra 2.0"
description: "What we fixed and hardened in the 2.0 cycle: authentication, information disclosure, CSRF and XSS, SSRF filtering, upload protection, secrets masking, and why workers no longer touch the database."
date: 2026-09-16T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  linkedin: https://www.linkedin.com/in/lo%C3%AFc-mathieu-475b144/
  image: lmathieu
  role: Lead Developer
image: ./main.png
---

Kestra 2.0 rebuilds the execution engine. The architecture side is covered in [what changed in the engine](/blogs/2026-09-01-kestra20-rebuild-engine) and the performance side in [the performance report](/blogs/performance-improvements-2-0). This post covers security.

During the 2.0 cycle we ran a systematic security review of the codebase: every endpoint, every default, every place where user input reaches the backend, followed by a second pass on the plugin ecosystem. It produced around sixty merged pull requests and a dozen published advisories. Most of the individual changes are small. The point of this post is to list them in one place, with the advisories and the relevant documentation, so you can see what changed and decide what to configure.

We also changed where security starts: in 2.0, workers no longer connect to the database at all. That is the first section, because it changes the threat model before any individual fix does.

## Workers no longer touch the database

In 1.x, every worker needed database credentials. It read its jobs and wrote its results directly to the repository. A compromised worker, or a worker in a network you did not fully trust, was one hop away from the table holding every execution and every flow.

In 2.0, [workers never open a database connection](/docs/administrator-guide/security-hardening#worker-isolation). They connect outbound to a Controller over gRPC, receive jobs, and stream logs and results back. The database repositories are excluded from the worker classpath, so this is not a configuration you can get wrong; the code is not there.

A few consequences:

- **Secrets are decrypted on read.** In 1.x, secret values could appear in plaintext in the persisted execution and on the wire to the worker. In 2.0, secrets stay encrypted on the job queue and on the wire, the worker decrypts them at the moment of use, and the plaintext is never written into the Execution. Masking is applied longest-first so a secret that is a prefix of another cannot leak through the shorter match.
- **The channel can be encrypted and authenticated.** Worker-to-controller gRPC is plaintext by default. [TLS and mutual TLS are available on Enterprise Edition](/docs/administrator-guide/security-hardening#transport-security). With mTLS, a worker without a valid certificate is refused at the handshake. Enterprise also adds JWT-based worker authentication (`kestra.ee.worker.auth.enabled`, off by default) with registration tokens; setup is in the [gRPC TLS/mTLS configuration](/docs/configuration/enterprise-and-advanced#grpc-tlsmtls-ee-only).
- **Worker calls are internal calls.** Worker gRPC traffic is flagged as internal, so IAM does not treat it as a user API call.

In practice, this is what lets you run a worker in a restricted network, an air-gapped site or another region. If that worker is compromised, the attacker has the jobs it was given, not your database.

## Authentication

**Password hashing.** The BasicAuth password was stored as salted SHA-512, which is fast to compute and therefore fast to brute-force offline. It is now bcrypt with cost 12 (GHSA-m727-pcjm-j28h). Existing hashes are wrapped at startup by migration `2.0.10-basic-auth-password`. This migration is irreversible and prevents rolling back to 1.x basic auth, so plan the upgrade accordingly; see [database migrations in the migration guide](/docs/migration-guide/v2.0.0/database-migrations).

More generally, no secret is stored in plaintext anymore. Non-recoverable secrets, passwords and tokens, use bcrypt. Recoverable secrets are encrypted with AES under `kestra.encryption.secret-key` ([encryption configuration](/docs/configuration/security-and-secrets#encryption)).

**Timing oracles.** Several authentication paths responded faster when a username did not exist, or compared tokens byte by byte and stopped at the first difference. Basic-auth verification is now constant-time and always checks both username and password (GHSA-38rc-2jxj-2h75). Webhook keys and the auth token cache use the same constant-time comparison. The webhook endpoint is public by design, so this one is remotely exploitable without an account.

**Rate limiting.** All authentication endpoints are rate-limited to mitigate brute force. The login lockout is configurable under `kestra.security.login.failed-attempts` (defaults: 10 attempts, 5-minute window, 30-minute lock); see the [security and secrets configuration](/docs/enterprise/auth/rbac#user-lockout).

**Access control fixes.** A namespace named `webhook` matched the anonymous open-URL prefix, which let anyone execute any flow in that namespace and read its outputs. [Open-URL matching now requires the actual webhook route](/docs/configuration/security-and-secrets#security-settings) (GHSA-j5cv-8rw9-vv2p), and `/api/v1/basicAuthValidationErrors` was removed from the default open URLs. In clusters with several webservers, a changed password is rejected on every node immediately, and changing credentials now requires the current password (GHSA-94pv-f379-3gp3). The pre-authentication guard fails closed to the login page. Soft-deleted flow revisions can no longer be executed (GHSA-52wv-cgfg-4j6x).

**Setup page.** On a fresh installation with no `basic-auth` configured, the Setup page is publicly reachable and the first person to reach it sets the credentials. Configure `kestra.server.basic-auth` in the application configuration before starting Kestra in production, as described in [credential initialization](/docs/administrator-guide/security-hardening#credential-initialization).

## Information disclosure

**Existence oracles.** The webhook endpoint answered differently for a missing flow, a disabled flow, an invalid flow and a wrong key. It now returns the same 404 in all four cases, so anonymous callers cannot enumerate flows or namespaces. Oracles on database metadata were fixed the same way.

**Error messages and stack traces.** Java stack traces were removed from the expression debugger response. `page=0` on list endpoints returns a 422 instead of a 500 containing the SQL. Invalid regex filters return a 400 instead of a 500 with the rendered query. `/api/v1/configs` no longer returns instance metadata before login; the login page only learns whether basic auth is initialised. Internal storage URIs no longer expose the real backend path.

**Downloads.** Execution files and logs are served with `Cache-Control: private` so a shared proxy or CDN cannot serve one tenant's files to another. Content-Disposition filename injection was fixed on all file upload paths.

## Management endpoints

Port 8081 exposes health, metrics, loggers and the worker and scheduler endpoints. In 1.x most of it was unauthenticated. [In 2.0 the defaults changed](/docs/migration-guide/v2.0.0/management-endpoint-hardening):

| Key | 1.x | 2.0 |
|---|---|---|
| `endpoints.all.sensitive` | `false` | `true` |
| `endpoints.env.enabled` | `true` | `false` |
| `endpoints.health.details-visible` | `ANONYMOUS` | `AUTHENTICATED` |
| `endpoints.loggers.write-sensitive` | `false` | `true` |
| `endpoints.worker.sensitive`, `endpoints.scheduler.sensitive` | `false` | `true` |
| docker-compose `8081:8081` | exposed | commented out |

This is a breaking change, documented in [management endpoint hardening](/docs/migration-guide/v2.0.0/management-endpoint-hardening). If your monitoring scrapes `/metrics` or your load balancer reads health details, it now needs credentials through `endpoints.all.basic-auth`, or the port needs to stay on the internal network ([management endpoint access](/docs/administrator-guide/security-hardening#management-endpoint-access)). Malformed Authorization headers on that port return 401 instead of 500.

## CSRF

Kestra had no CSRF protection for browser sessions authenticated by cookie. 2.0 adds [a double-submit token](/docs/administrator-guide/ssl-configuration#csrf-protection), enforced when a session cookie is present and transparent to API and SDK clients that authenticate with headers.

It took a few follow-ups to get right: the `Secure` flag follows the request scheme so plain-HTTP deployments keep working; the cookie name works over HTTP behind proxies; the token is stable across tabs and reloads and forwarded by the generated OpenAPI client; and a stale token left by a previous instance on the same host is replaced instead of blocking the setup page with a 403. If you hit that 403 after replacing an OSS instance with EE on the same host, this was the cause.

## XSS

Markdown rendered in the UI is sanitised: script, iframe and object tags and all event handler attributes are stripped. This fixed a stored XSS. The in-app documentation renderers no longer disable that protection. Server-returned execution, task and flow IDs are escaped before being interpolated into confirmation dialogs. Plugin SVG icons are sanitised at load: scripts, handlers, iframes and `javascript:` URIs are removed. A namespace file whose name contains markup no longer executes it in the delete dialog (GHSA-crq7-3xg2-hjch).

## Security headers

Every response, including 401s, 403s and static files, now carries security headers, configured under [`kestra.webserver.security-headers`](/docs/configuration/observability-and-networking#security-response-headers):

| Header | Default |
|---|---|
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | empty, configurable, with a report-only mode |
| `Strict-Transport-Security` | empty, configurable |

Setting a header to an empty string disables that header only. HSTS is only sent when Kestra terminates TLS itself; behind nginx or a load balancer, set it there.

Login state is read from a server-issued flag cookie next to the HttpOnly session cookie rather than from client-side session storage.

## SSRF

Kestra runs arbitrary HTTP calls by design. On a cloud VM, that meant a flow author could point an HTTP task at `169.254.169.254` and read the instance's credentials.

2.0 adds [global allow and deny lists](/docs/administrator-guide/security-hardening#http-task-url-filtering) for the HTTP plugin tasks (`Request`, `Download`, `SseRequest`, `Trigger`) and the `http()` Pebble function:

```yaml
kestra:
  tasks:
    http:
      allowed-list:
        - https://api.example.com
      denied-list:
        - http://169.254.169.254
        - http://localhost
        - http://127.0.0.1
```

Both lists are empty by default; nothing is filtered until you configure them. The allow list is checked first, and a URI that matches both is blocked. Matching is prefix-based, not glob or CIDR: `http://10.` blocks `http://10.0.0.1/admin` but not the same host over HTTPS. This should be combined with network controls: deny link-local ranges at the VPC or firewall level, place workers in a subnet with no route to metadata services, and route egress through a proxy that can enforce the same list. The [security hardening guide](/docs/administrator-guide/security-hardening) describes the full setup.

## Uploads and user-supplied input

**Path traversal.** `inputFiles` names are resolved through the working-directory guard, closing an arbitrary file write on the worker host through `../` and absolute paths (GHSA-q3fw-mvgv-pjr2). Backslash and mixed-separator traversal is rejected in local storage, closing an authenticated arbitrary file read through the download API (GHSA-qw4v-6w32-xx9h). Namespace file operations received the same fix.

**ZIP bombs.** Flow import and namespace file upload accept archives. An opt-in guard checks the entry count and the uncompressed size of each entry during decompression and rejects the upload with a 422 if either limit is exceeded:

```yaml
kestra:
  security:
    zip-bomb-protection:
      enabled: true
      max-number-of-entries: 1000
      max-entry-size: 104857600
```

It is disabled by default and both limits are required when enabled. Set them from the largest legitimate archives your users upload; see [ZIP bomb protection](/docs/administrator-guide/security-hardening#zip-bomb-protection).

**ReDoS.** [User-supplied regexes are protected against catastrophic backtracking](/docs/configuration/security-and-secrets#regex-timeout) with a timeout, `kestra.regex.timeout`, defaulting to ten seconds. `REGEX` query and dashboard filters are rejected up front when they contain nested quantifiers or ambiguous alternation. The UI had two of its own: the topology parser and the Pebble expression highlighter no longer hang on a crafted flow source.

**Injection.** SQL injection through label search filters was fixed (GHSA-365w-2m69-mp9x). Label keys are escaped before being embedded in H2 jq programs. REGEX handling in JDBC filters was hardened.

**Validation.** Nested request bodies are now validated; a missing `@Valid` meant they were not. Flows exposed as MCP tools validate their inputs before execution. The UI is not the only client of the API, and the backend now assumes it is not.

## Secrets masking in logs

Masking existed in 1.x, with gaps. `SECRET` flow outputs and trigger outputs are masked like inputs. Exception messages and stack traces in execution logs are masked, not only the log statement, and the same applies to `logToFile` output. `kv()` is masked on read-only render paths such as `eval`, like `secret()`, and namespace ancestry uses a dot boundary so `dev` is no longer treated as the parent of `development`. The inputs wizard no longer persists `SECRET` values to browser storage. Plugin authors can mark a property as `secret = true` so it is masked without the platform knowing what it contains.

## What to configure

Most of the above is on by default. These are not, and are worth doing before the instance is used in production:

1. Set `kestra.server.basic-auth` before the first start, or use OIDC, LDAP or SAML on Enterprise.
2. Enable TLS, preferably mTLS, on the worker channel before a worker runs outside your trusted network.
3. Configure the HTTP deny list with link-local and loopback ranges, and an allow list if your flows only call known hosts.
4. Enable ZIP-bomb protection with limits that fit your imports.
5. Give your monitoring credentials for the management port, or keep the port internal, and check that nothing broke after the upgrade.

On Enterprise, also configure the [plugin allow list](/docs/administrator-guide/security-hardening#plugin-restrictions-ee) and restrict the `Process` task runner in multi-tenant or untrusted environments, since it runs directly on the worker host without a container.

## Conclusion

The 2.0 cycle fixed timing and existence oracles, moved passwords to bcrypt, added rate limiting on authentication, CSRF tokens on every form, security headers on every response, SSRF filtering for HTTP tasks, ZIP-bomb and ReDoS protection, stronger secrets masking, and closed several XSS, injection and path traversal issues. Management endpoints went from open to closed by default. And workers no longer have a path to the database.

All advisories were published on GitHub before this post, and every fix links to its pull request. If you find something, the [security policy](https://github.com/kestra-io/kestra/security/policy) explains how to report it.

The [security hardening guide](/docs/administrator-guide/security-hardening) lists every configuration key mentioned here, and the [2.0 migration guide](/docs/migration-guide/v2.0.0) covers the default changes that can affect an upgrade.

If you have any questions, reach out via [Slack](/slack) or open a GitHub issue.
