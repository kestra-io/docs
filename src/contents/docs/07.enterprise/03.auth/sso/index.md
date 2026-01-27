---
title: Single Sign-On for Kestra – Providers and Setup
description: Enable Single Sign-On (SSO) in Kestra Enterprise. Configure OIDC authentication with providers like Google, Microsoft, Okta, and Keycloak.
sidebarTitle: SSO
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

How to enable and set up SSO in your Kestra Enterprise instance.

## Configure single sign-on

Single Sign-On (SSO) is an authentication process that allows users to access multiple applications with a single set of login credentials (e.g., "Sign in with Google"). Kestra supports SSO using the OpenID Connect (OIDC) protocol, which is a simple identity layer built on top of the OAuth 2.0 protocol.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/avb90NfNdTc?si=G-pzFMy8zxzsgynm" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Configuring single sign-on with OpenID Connect (OIDC)

To implement OIDC SSO, you'll need to configure the Micronaut framework that Kestra uses under the hood. Start by enabling OIDC in your `yaml` configuration file as follows:

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

Check out our guides for specific SSO providers:
- [Google](./google-oidc/index.md)
- [Microsoft](./microsoft-oidc/index.md)
- [Keycloak](./keycloak/index.md)
- [Okta](./okta/index.md)
- [authentik](./authentik/index.md)
