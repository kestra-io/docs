---
title: Plugins Configuration
icon: /docs/icons/admin.svg
---

This page describes how you can configure plugins in Kestra.

Configuration of Maven repositories used by the command `kestra plugins install`.

Maven Central is mandatory for Kestra and its plugins. However, you can add your own (Maven) repository in order to download your own plugins using the following configuration:

```yaml
kestra:
  plugins:
    repositories:
      central:
        url: https://repo.maven.apache.org/maven2/
      jcenter:
        url: https://jcenter.bintray.com/
      kestra:
        url: https://dl.bintray.com/kestra/maven
```