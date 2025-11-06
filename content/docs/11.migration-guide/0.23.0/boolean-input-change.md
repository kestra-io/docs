---
title: The BOOLEAN-type input is deprecated in favor of BOOL
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS", "EE"]
---

## Overview

The Java-style `BOOLEAN` input, which used three options (true, false, or not defined) caused too much confusion and bugs, so it's now deprecated in favor of the `BOOL` input which is a toggle (can only be true or false). Read more in the GitHub issue: [#8225](https://github.com/kestra-io/kestra/issues/8225).

The following example inputs demonstrate the difference:

```yaml
inputs:
  - id: boolean
    type: BOOLEAN # Deprecated as of version 0.23.0
    defaults: true
    displayName: "A boolean input"

  - id: bool
    type: BOOL # Included in version 0.23.0 and later
    defaults: true
    displayName: "A boolean input displayed as a toggle."
```

