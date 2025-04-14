---
title: Secrets
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
docId: secrets
---

How to create and manage Secrets in the Enterprise Edition.

## What are Secrets

Secrets are used to store confidential information such as passwords, API keys, and other sensitive data that should not be exposed in plain text. Secrets managed in Kestra are encrypted at rest and in transit to guarantee that your sensitive information is secure.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/u0yuOYG-qMI?si=9T-mMYgs-_SOIPoG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## How to create a new Secret

From the left navigation menu, go to **Namespaces**. Select a namespace and click on the **Secrets** tab. Then, click on the **Create** button to add a new Secret.

## How are Secrets different between the Open-Source and Enterprise Editions?

Currently, we don't provide Secrets Management in the Open Source Edition. However, you can pass special base64-encoded environment variables to your Kestra instance to store sensitive information. Then, you can access these variables in your flows using the same `secret()` function as in the Enterprise Edition. Since there is no real notion of Secrets Management in the Open Source Edition, you will need to manage the lifecycle of these environment variables manually. This means that you will need to restart your Kestra instance to update or delete a Secret. We encourage you to plan such operations carefully to avoid any downtime, or reach out to us to upgrade to the Enterprise Edition to benefit from the full Secrets Management backend including the possibility to integrate with your existing [Secrets Manager](./secrets-manager.md).

For more, check out our [secrets documentation](../../05.concepts/04.secret.md).
