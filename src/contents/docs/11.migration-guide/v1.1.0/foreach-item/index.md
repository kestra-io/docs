---
title: ForEachItem now starts iteration at 0 instead of 1
icon: /src/contents/docs/icons/migration-guide.svg
release: 1.1.0
editions: ["OSS", "EE"]
description: Notice regarding ForEachItem iteration starting at 0 instead of 1 for consistency.
---


## ForEachItem now starts iteration at 0 instead of 1

`ForEachItem` now starts iteration at 0 instead of 1 to align with the iteration starting value of `ForEach`.
If you use {{taskrun.iteration}} in your flow with a `ForEachItem` the starting value is now 0 instead of 1.
