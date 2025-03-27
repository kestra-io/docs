---
title: Failed Attempts Lockout
icon: /docs/icons/migration-guide.svg
release: 0.22.0
editions: ["EE"]
---

Too many failed login attempts now lock user's account

## Overview

To improve the security of your Enterprise Edition instance, we now automatically lock user accounts after a `threshold` number of failed login attempts made within `monitoring-window`. Both, the number of failed attempts, the monitoring window to track consecutive number of failed attempts and (soon) the duration of how long the user remains locked are configurable.

```yaml
security:
  login:
    failed-attempts:
      threshold: 10
      monitoring-window: PT15M    # period to count failed attempts
      # lockout-duration: PT24H      # period the account remains locked — will be added in the next release
```

Note that this change is only relevant for users who leverage LDAP or basic authentication (not relevant for SSO-users). Superadmin can unlock the user manually by resetting their password from the user's detail page.
