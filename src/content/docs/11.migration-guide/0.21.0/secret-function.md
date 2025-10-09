---
title: Retrieving non-existing secrets
icon: /docs/icons/migration-guide.svg
release: 0.21.0
editions: ["OSS"]
---

Changed handling of non-existing secrets.

## Overview

Fetching a non-existing secret using the `secret()` function now throws an exception instead of returning `null` in the open-source version, aligning the open-source behavior with the behavior in the Enterprise Edition.
