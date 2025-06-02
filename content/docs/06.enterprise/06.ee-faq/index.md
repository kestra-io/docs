---
title: Cloud & Enterprise Edition FAQ
icon: /docs/icons/faq.svg
editions: ["EE", "Cloud"]
---

Frequently asked questions about the Cloud and Enterprise Edition of Kestra.

## My session expires too quickly. Is there a way to change the session expiration time?

Yes, there is! Add the following Micronaut setting to your Kestra configuration to change the session expiration time to 10 hours:

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

## How to I configure Kestra with my license details?

To use Kestra Enterprise Edition, you will need a valid license configured under the `kestra.ee.license` configuration. The license is unique to your organization. If you need a license, please reach out to our Sales team at [sales@kestra.io](mailto:sales@kstra.io).

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
