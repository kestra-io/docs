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
3. Enter the user's email address and select a group (via the **Groups** tab) or assign a role directly (via the **Roles** tab). Starting in 2.1, to invite several users at once, type an email address and press Enter, then repeat for each one, or paste a list separated by commas, semicolons, spaces, or new lines. Each address becomes a tag below the field that you can remove, and an address that is not valid is shown in red with an icon. Every address receives an invitation with the same groups and roles, and you can invite up to 25 addresses at once.
4. Click **+ Add** to send the invitation email or display the shareable link.

:::alert{type="info"}
Check **Create user directly (skip invitation)** to bypass the email flow. Use this only with third-party authentication such as SSO or LDAP.
:::

:::alert{type="info"}
When you invite several users at once, Kestra validates every address before sending anything. If an address is malformed, already invited, or already has access to the tenant, no invitation is sent and the dialog lists the addresses to fix so you can submit again.
:::

To invite several users with the API, send up to 25 addresses to the bulk invitations endpoint. Every invitation gets the same roles and groups:

```bash
curl -X POST "https://kestra.example.com/api/v1/{tenant}/invitations/bulk" \
  -H "Authorization: Bearer $KESTRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"emails": ["ana@example.com", "li@example.com"], "groups": ["<group-id>"]}'
```

The request is validated as a whole: an invalid or already-invited address returns `400` with one error per address, and more than 25 addresses returns `422`. In both cases, no invitation is created. If the mail server fails partway through sending, the invitations created before the failure are kept.

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
