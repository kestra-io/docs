---
title: SCIM Directory Sync
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.18.0"
---

Sync users and groups from your Identity Provider to Kestra using SCIM.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/WQBWxt7ruM4?si=wEYUyO5kJuWxQMft" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## What is SCIM

SCIM (System for Cross-domain Identity Management) is an open standard protocol designed to facilitate user identity management across multiple systems.

 It simplifies user provisioning, de-provisioning, and group synchronization between identity providers (IdPs) such as Microsoft Entra ID or Okta, and service providers (SPs) such as Kestra. In Layman's terms, SCIM allows you to automatically keep your users and groups in sync between your IdP and Kestra.

Kestra relies explicitly on the SCIM 2.0 protocol for directory synchronization.

![scim.jpeg](/docs/enterprise/scim.png)

## Benefits of a Directory Sync with SCIM

1. **Automated provisioning and de-provisioning**: SCIM allows you to automate provisioning and de-provisioning of users, creating a single source of truth (SSOT) of the user identity data. Instead of manually creating and managing users in Kestra, you can sync them from your IdP.
2. **Consistency and compliance**: with SCIM, you can ensure consistency of identity information across systems and stay compliant with security and regulatory requirements.
3. **Governance at scale**: managing users at scale across many applications can be difficult without a standardized method for identity synchronization. SCIM provides a scalable solution for managing user identities.

## Supported Identity Providers

For a detailed guide on how to set up SCIM provisioning with a specific IdP, refer to the documentation for the respective provider.

::ChildCard
::

