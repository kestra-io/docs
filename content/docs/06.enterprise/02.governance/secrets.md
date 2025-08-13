---
title: Secrets
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
docId: secrets
---

How to create and manage Secrets in the Enterprise Edition.

## What are Secrets

Secrets are used to store confidential information such as passwords, API keys, and other sensitive data that must not be exposed as plain text. Secrets managed in Kestra are encrypted at rest and in transit to guarantee that your sensitive information is secure.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/u0yuOYG-qMI?si=9T-mMYgs-_SOIPoG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## How to create a new Secret

From the left navigation menu, go to **Namespaces**. Select a namespace and click on the **Secrets** tab. Then, click on the **Create** button to add a new secret.

## How are Secrets different between the Open-Source and Enterprise Editions?

The Open Source Edition does not include built-in secrets management. However, you can pass special base64-encoded environment variables to your Kestra instance to store sensitive information. These environment variables can still be accessed in your flows using the `secret()` function, just like in the Enterprise Edition. 

::alert{type="info"}
Since there is no real notion of Secrets Management in the Open Source Edition, you will need to manage the lifecycle of these environment variables manually. This means that you will need to restart your Kestra instance to update or delete a Secret. We recommend planning these operations carefully to avoid any downtime, or contact us about upgrading to the Enterprise Edition to gain access to full secrets management features, including integration with external [Secrets Managers](./secrets-manager.md).
::

For more, check out our [secrets documentation](../../05.concepts/04.secret.md) and [secrets best practices guide](../../14.best-practices/9.secrets-management.md).
