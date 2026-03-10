---
title: Kestra Cloud & Enterprise FAQ – Common Questions
description: FAQ for Kestra Cloud and Enterprise. Find answers to common questions about licensing, configuration, session management, and enterprise features.
sidebarTitle: Cloud & Enterprise Edition FAQ
icon: /src/contents/docs/icons/faq.svg
editions: ["EE", "Cloud"]
---

Frequently asked questions about the Cloud and Enterprise Edition of Kestra.

## Kestra Cloud & Enterprise FAQ – common questions

## My session expires too quickly. Is there a way to change the session expiration time?

Yes, there is! Add the following Micronaut setting to your [Kestra configuration](../../configuration/index.md) to change the session expiration time to 10 hours:

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

In Cloud, you might need to ask our support team to change this setting for you.

## How do I configure Kestra with my license details?

To use Kestra Enterprise Edition, you will need a valid license configured under the `kestra.ee.license` configuration. The license is unique to your organization. If you need a license, please reach out to our Sales team at [sales@kestra.io](mailto:sales@kestra.io).

The license is set up using three configuration properties: `id`, `fingerprint`, and `key`.

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

When you launch Kestra Enterprise Edition, it will check the license and display the validation step in the log.

## When should I use Secrets vs Credentials?

Use [Secrets](../../06.concepts/04.secret/index.md) when you need to store and reference sensitive values such as API keys, passwords, webhook URLs, or tokens in your flows and configuration. Secrets are the right choice when you want to inject a protected value with the `secret()` function or manage sensitive data centrally.

Use [Credentials](../03.auth/credentials/index.md) when a supported integration or plugin expects a reusable authentication object managed through the UI. Credentials are better suited to connection-level authentication that you want to define once and reuse across multiple flows.

In short: use **Secrets** for protected values, and use **Credentials** for managed authentication objects supported by Kestra integrations.
