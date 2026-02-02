---
title: Retrieving non-existing secrets
description: Secret function update in Kestra 0.21.0 (OSS). Fetching missing secrets now throws an exception instead of returning null, matching Enterprise behavior.
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.21.0
editions: ["OSS"]
---


## Retrieving non-existing secrets

Changed handling of non-existing secrets.

Fetching a non-existing secret using the `secret()` function now throws an exception instead of returning `null` in the open-source version, aligning the open-source behavior with the behavior in the Enterprise Edition.
