---
title: License Configuration
icon: /docs/icons/admin.svg
---

Configure the Kestra Enterprise Edition license.

To use Kestra Enterprise Edition, you will need a valid license. Our sales team should have provided this license to you; if it's not the case, please reach out to them at [sales@kestra.io](mailto:sales@kstra.io).

The license is set up using two configuration properties: the `id` and the `key`.

- `kestra.ee.license.id`: should hold the license identifier.
- `kestra.ee.license.key`: should hold the license key.

When you launch Kestra Enterprise Edition, it will check the license and display the validation step in the log.