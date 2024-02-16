---
title: URL Configuration
icon: /docs/icons/admin.svg
---

This page describes how you can configure the URL of your Kestra webserver.

Some notification services require a URL configuration defined in order to add links from the alert message. Use a full URI here with a trailing `/` (without ui or api).

```yaml
kestra:
  url: https://www.my-host.com/kestra/
```