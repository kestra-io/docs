---
title: "Authentication in Kestra Enterprise: OIDC Setup"
h1: Configure Basic Auth and OIDC Login in Kestra
description: Configure Authentication in Kestra. Set up Basic Auth and OpenID Connect (OIDC) for secure user login and access management.
sidebarTitle: Authentication
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

Kestra supports two authentication methods: Basic Auth (enabled by default) and OpenID Connect (OIDC).

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/MNXewBufBw0?si=CGjEVa-KEDN5N5ii" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

Kestra uses the default encryption key for JWT sessions. Generate a secret of at least 256 bits and add it to your [Kestra Security and Secrets configuration](../../../configuration/05.security-and-secrets/index.md):

```yaml
kestra:
  encryption:
    secret-key: your-256-bits-secret
```

This secret must be the same across all your webserver instances and will be used to sign the JWT cookie and encode the refresh token.

To use separate keys for the signature and refresh token:

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

Without multi-tenancy, omit the `--tenant` parameter.

:::alert{type="info"}
Multi-tenancy is enabled by default. Include the `--tenant` parameter.
:::

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
