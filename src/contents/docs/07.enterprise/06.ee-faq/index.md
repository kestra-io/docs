---
title: "Cloud & Enterprise FAQ: Licensing and Configuration"
h1: "Frequently Asked Questions: Kestra Cloud and Enterprise"
description: FAQ for Kestra Cloud and Enterprise. Find answers to common questions about licensing, configuration, session management, and enterprise features.
sidebarTitle: Cloud & Enterprise Edition FAQ
icon: /src/contents/docs/icons/faq.svg
editions: ["EE", "Cloud"]
---

Frequently asked questions about the Cloud and Enterprise Edition of Kestra.

## My session expires too quickly. Is there a way to change the session expiration time?

Add the following Micronaut setting to your [Observability and Networking configuration](../../configuration/03.observability-and-networking/index.md) to set the session expiration time to 10 hours:

```yaml
    environment:
      KESTRA_CONFIGURATION: |
        micronaut:
          security:
            token:
              generator:
                access-token:
                  expiration: 36000
              cookie:
                cookie-max-age: 10h
```

On Kestra Cloud, contact support to change this setting.

## How do I configure Kestra with my license details?

Kestra Enterprise Edition requires a valid license configured under `kestra.ee.license`. The license is unique to your organization. To get a license, contact the Sales team at [sales@kestra.io](mailto:sales@kestra.io).

The license uses three configuration properties: `id`, `fingerprint`, and `key`.

- `kestra.ee.license.id`: license identifier.
- `kestra.ee.license.fingerprint`: license authentication.
- `kestra.ee.license.key`: license key.

```yaml
kestra:
  ee:
    license:
      id: <LICENSE ID>
      fingerprint: <LICENSE FINGERPRINT>
      key: |
        <LICENSE KEY>
```

Kestra validates the license on startup and logs the validation result.

## When should I use Secrets vs Credentials?

Use [Secrets](../../06.concepts/04.secret/index.md) when you need to store and reference sensitive values such as API keys, passwords, webhook URLs, or tokens in your flows and configuration. Secrets are the right choice when you want to inject a protected value with the `secret()` function or manage sensitive data centrally.

Use [Credentials](../03.auth/credentials/index.md) when a supported integration or plugin expects a reusable authentication object managed through the UI. Credentials are better suited to connection-level authentication that you want to define once and reuse across multiple flows.

In short: use **Secrets** for protected values, and use **Credentials** for managed authentication objects supported by Kestra integrations.
