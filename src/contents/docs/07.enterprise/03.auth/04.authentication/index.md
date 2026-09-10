---
title: "Authentication in Kestra Enterprise: OIDC Setup"
h1: Configure Basic Auth and OIDC Login in Kestra
description: Configure Authentication in Kestra. Set up Basic Auth and OpenID Connect (OIDC) for secure user login and access management.
sidebarTitle: Authentication
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

Kestra supports three authentication methods: Basic Auth (enabled by default), OpenID Connect (OIDC), and passwordless One-Time-Password (OTP).

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/MNXewBufBw0?si=CGjEVa-KEDN5N5ii" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

Configure JWT signing keys to secure session tokens. These keys must be the same across all Webserver instances.

```yaml
micronaut:
  security:
    token:
      jwt:
        generator:
          refresh-token:
            secret: refresh-token-256-bits-secret
        signatures:
          secret:
            generator:
              secret: signature-256-bits-secret
```

:::alert{type="info"}
You can change the JWT cookie behavior using [Micronaut Cookie Token Reader](https://micronaut-projects.github.io/micronaut-security/latest/guide/#cookieToken) configuration. For example, define the cookie's maximum lifetime with `micronaut.security.token.cookie.cookie-max-age: P2D`.
:::

## Basic authentication

The default installation comes with no users defined. To create an administrator account, use the following CLI command:

```bash
./kestra auths users create --admin --username=<admin-username> --password=<admin-password> --tenant=<tenant-id>
```

When using `--admin`, `--tenant` is required to specify which tenant the admin role applies to. Omit `--tenant` only when creating a user without group or role assignments.

## Single sign-on (SSO)

Single Sign-On (SSO) is an authentication process that allows users to access multiple applications with one set of login credentials (e.g., Sign in with Google). Kestra supports SSO using the OpenID Connect (OIDC) protocol, which is a simple identity layer built on top of the OAuth 2.0 protocol.

Enable OIDC in your Micronaut configuration:

```yaml
micronaut:
  security:
    oauth2:
      enabled: true
      clients:
        google:
          client-id: "{{ clientId }}"
          client-secret: "{{ clientSecret }}"
          openid:
            issuer: "{{ issuerUrl }}"
```

See the [Micronaut OIDC configuration guide](https://micronaut-projects.github.io/micronaut-security/latest/guide/#openid-configuration) for full details. See [Single Sign-On](../sso/index.md) to configure SSO with Google, Microsoft, and other providers.

## Passwordless (One-Time-Password)

Passwordless login lets users sign in without a password. When a user enters their email address, Kestra sends a one-time code to that address. The user enters the code to authenticate.

OTP requires a mail service to deliver codes. Configure the mail service before enabling OTP — see [Enterprise and Advanced configuration](../../../configuration/06.enterprise-and-advanced/index.md#mail-service) for the full property reference.

Enable OTP and optionally tune its defaults:

```yaml
kestra:
  security:
    one-time-password:
      enabled: true
      expiration: PT5M       # how long a code remains valid (default: 5 minutes)
      code-length: 6         # number of digits in the code (default: 6)
      rate-limit:
        max-requests: 10     # maximum code requests per window (default: 10)
        window: PT1H         # rate limit window (default: 1 hour)
```

:::alert{type="info"}
OTP is more convenient than Basic Auth but less secure than SSO with MFA. Prefer [OIDC/SSO](../sso/index.md) with MFA enabled at the identity provider when security is the priority.
:::
