---
title: Python script tasks now use official python:3-13-slim image
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS", "EE"]
---

## Overview

To make it easier to get started, we used a custom `ghcr.io/kestra-io/kestrapy:latest` image to contain `kestra` and `amazon-ion` pip packages. The tasks now use the official `python:3-13-slim` image by default. 

If you want to maintain the previous behavior, simply add those packages using the new `dependencies` property and they will be installed at runtime (and cached):

```yaml
id: python_demo
namespace: company.team

tasks:
  - id: python
    type: io.kestra.plugin.scripts.python.Script
    dependencies:
      - kestra
      - amazon-ion
      - requests
    script: |
      from kestra import Kestra
      import requests

      response = requests.get('https://kestra.io')
      print(response.status_code)

      Kestra.outputs({'status': response.status_code, 'text': response.text})
```
