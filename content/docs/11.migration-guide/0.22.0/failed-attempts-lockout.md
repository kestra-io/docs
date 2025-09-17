---
title: Failed Attempts Lockout
icon: /docs/icons/migration-guide.svg
release: 0.22.0
editions: ["EE"]
---

Too many failed login attempts now lock user's account

## Overview

To improve the security of your Enterprise Edition instance, we now automatically lock user accounts after a `threshold` number of failed login attempts made within `monitoring-window`. The number of failed attempts, the monitoring window to track the failed attempts and the duration of how long the user remains locked are configurable.

```yaml
kestra:
  security:
    login:
      failed-attempts:
        threshold: 10           # the number of failed attempts before lockout
        monitoring-window: PT5M # period to count failed attempts
        lock-duration: PT30M    # period the account remains locked
```

:::alert{type="info"}
Note that this change is only relevant for users who leverage LDAP or basic authentication (not relevant for SSO-users).
:::

Super Admin can unlock the user manually by resetting their password from the user's detail page. The user can also unlock their account by resetting their password using the "Forgot password" link on the login page and following the instructions in the email.
