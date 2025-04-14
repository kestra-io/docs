---
title: Single Sign-On (SSO)
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

How to enable and setup SSO in your Kestra Enterprise instance.

Single Sign-On (SSO) is an authentication process that allows users to access multiple applications with one set of login credentials (e.g., Sign in with Google). Kestra supports SSO using the OpenID Connect (OIDC) protocol, which is a simple identity layer built on top of the OAuth 2.0 protocol.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/avb90NfNdTc?si=G-pzFMy8zxzsgynm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Configuring Single Sign-On with OpenID Connect (OIDC)

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
- [Google](./google-oidc.md)
- [Microsoft](./microsoft-oidc.md)
- [Keycloak](./keycloak.md)
- [Okta](./okta.md)
- [authentik](./authentik.md).
