---
title: "Single Sign-On in Kestra: Providers and Setup"
h1: Configure SSO with Google, Microsoft, Okta, and Keycloak
description: Enable Single Sign-On (SSO) in Kestra Enterprise. Configure OIDC authentication with providers like Google, Microsoft, Okta, and Keycloak.
sidebarTitle: SSO
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

Single Sign-On (SSO) lets users authenticate to Kestra using an external identity provider such as Google, Microsoft, Okta, or Keycloak.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/avb90NfNdTc?si=G-pzFMy8zxzsgynm" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Configure OIDC

Kestra supports SSO using the OpenID Connect (OIDC) protocol, a simple identity layer built on top of OAuth 2.0. Enable OIDC in your configuration file:

```yaml
micronaut:
  security:
    oauth2:
      enabled: true
      clients:
        oidc-provider:
          client-id: "{{ clientId }}"
          client-secret: "{{ clientSecret }}"
          openid:
            issuer: "{{ issuerUrl }}"
```

Replace `oidc-provider` with your chosen provider's name, `{{ clientId }}` with your client ID, `{{ clientSecret }}` with your client secret, and `{{ issuerUrl }}` with your issuer URL.

For more configuration details, refer to the [Micronaut OIDC configuration guide](https://micronaut-projects.github.io/micronaut-security/latest/guide/#openid-configuration).

## Provider guides

Provider-specific setup guides:
- [Google](/docs/enterprise/auth/sso/google-oidc)
- [Microsoft](/docs/enterprise/auth/sso/microsoft-oidc)
- [Keycloak](/docs/enterprise/auth/sso/keycloak)
- [Okta](/docs/enterprise/auth/sso/okta)
- [authentik](/docs/enterprise/auth/sso/authentik)
- [LDAP](/docs/enterprise/auth/sso/ldap)
