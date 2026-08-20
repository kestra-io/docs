---
title: "Invitations in Kestra Enterprise: Onboard Users"
h1: Onboard Users by Sending Email Invitations
description: Onboard users easily with Invitations in Kestra. Manage user access by sending email invitations to join specific tenants or the entire instance.
sidebarTitle: Invitations
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.20.0"
docId: users
---

Add users to a tenant or instance by invitation.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/RC1RxfxBPPI?si=vy1D3W9ysK8LS2Uo" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

Administrators can invite users with pre-configured RBAC permissions. If an [email server is configured](../../../configuration/03.observability-and-networking/index.md), Kestra sends the invitation link by email. Otherwise, you can copy and share the link manually.

## How to invite users

1. Go to **IAM** in the sidebar and open the **Users** tab.
2. Click **+ Add**.
3. Enter the user's email address and select a group (via the **Groups** tab) or assign a role directly (via the **Roles** tab).
4. Click **+ Add** to send the invitation email or display the shareable link.

:::alert{type="info"}
Check **Create user directly (skip invitation)** to bypass the email flow. Use this only with third-party authentication such as SSO or LDAP.
:::

## Accepting invitations

When a user receives an invitation, they can click the link in the email to accept it. The user is redirected to the Kestra login page, where they create a password or log in with SSO if enabled.

If password-based login is enabled, the password they choose must satisfy the instance password policy configured under `kestra.security.basic-auth`. See [Security and Secrets configuration](../../../configuration/05.security-and-secrets/index.md) for the available password policy settings.

## Invite expiration time

Users have 7 days to accept the invitation. After this period, the invitation expires and must be reissued.

To change the default expiration, set `expireAfter` in `kestra.security.invitations`. For example, to set 30 days:

```yaml
kestra:
  security:
    invitations:
      expireAfter: P30D
```
