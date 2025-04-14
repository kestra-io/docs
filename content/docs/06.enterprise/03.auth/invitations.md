---
title: Invitations
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.20.0"
docId: users
---

Add new users to your tenant or instance by using the invitation process.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/RC1RxfxBPPI?si=vy1D3W9ysK8LS2Uo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Overview

Administrators can invite users with pre-configured RBAC permissions. Invitations can be emailed directly, and users can set up their accounts upon acceptance.

By default, if the email server is configured in Kestra EE, we send an email with an invitation link. If the email server isn’t configured, you can manually share the link with invited users.

## How to Invite Users

1. Navigate to the **IAM** page in the Administration section
2. Click on the **Users** tab
3. Click on the **Invite** button
4. Fill in the user's email address and select the desired Group or attach the role directly, optionally restricting the permission to one or more namespaces
5. Click on the **Invite** button — this will send an email to the user with an invitation link, or display the link you can share with the user manually.

![invite1](/docs/enterprise/invitations/invite1.png)

![invite2](/docs/enterprise/invitations/invite2.png)

## Accepting Invitations

When a user receives an invitation, they can click on the link in the email to accept it. The user will be redirected to the Kestra login page, where they can set up their account (i.e., create a password), or login using SSO if it's enabled.

## Invite Expiration Time

The user has 7 days to accept the invitation. After this period, the invitation will expire, and the user will need to be re-invited.

If you want to change the default expiration time, you can do so by setting the `expireAfter` property in the `kestra.security.invitation` section of your `application.yaml` file. For example, to set the expiration time to 30 days, add the following configuration:

```yaml
kestra:
  security:
    invitations:
      expireAfter: P30D
```
