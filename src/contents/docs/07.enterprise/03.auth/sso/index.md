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

## Users and groups

### First login

Kestra identifies an SSO user by their email. When no Kestra user has this email yet, Kestra creates one only if one of the following gives them access:

- One of the groups in the user's groups claim exists in Kestra, in any tenant.
- A tenant has a [default role](../../../configuration/05.security-and-secrets/index.md#default-role).
- The user has a pending [invitation](../invitations/index.md). Kestra accepts it at login.

Otherwise, the login is refused and no user is created.

### Group sync

Set `kestra.security.oidc.groups-claim-path` to the claim holding the user's groups, for example `groups`. With [LDAP in `GROUP_SYNC_ONLY` mode](./ldap/index.md#group-sync-with-sso-group_sync_only), the user's LDAP groups are merged with the groups from the claim.

Group sync never creates groups. Create the groups in Kestra first, with the same names as the identity provider groups, and bind them to roles in each tenant (see [RBAC](../rbac/index.md)). The names must match the values the identity provider sends: Microsoft Entra ID, for example, sends group object IDs rather than names by default.

At every login:

- The user joins every Kestra group, in every tenant, whose name matches one of their identity provider groups.
- The user leaves any group they joined through the identity provider that the identity provider no longer sends. Group memberships added manually in Kestra are kept.
- When the user leaves the last group that gave them access to a tenant, they lose access to that tenant. They keep it only if a role, including a default role, is bound directly to them in that tenant, or if [SCIM](../scim/index.mdx) provisioned them there.

After group sync, a returning user must still have access to a tenant, or the login is refused.

:::alert{type="info"}
Before 2.0.9, SSO logins created every group of the groups claim in every tenant, and a new user needed a default role or an invitation. See the [migration guide](../../../11.migration-guide/v2.0.0/idp-groups-existing-only/index.md).
:::

## Provider guides

Provider-specific setup guides:
- [Google](/docs/enterprise/auth/sso/google-oidc)
- [Microsoft](/docs/enterprise/auth/sso/microsoft-oidc)
- [Keycloak](/docs/enterprise/auth/sso/keycloak)
- [Okta](/docs/enterprise/auth/sso/okta)
- [authentik](/docs/enterprise/auth/sso/authentik)
- [LDAP](/docs/enterprise/auth/sso/ldap)
