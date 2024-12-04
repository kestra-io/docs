---
title: Email server configuration
icon: /docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---

Email server configuration has moved to a different location

## Overview

In Kestra < 0.20.0, email server configuration lived under `kestra.mail-service`. Given that it's used only within the Enterprise Edition (for resetting passwords and sending invites), we moved it to `kestra.ee.mail-service`.
