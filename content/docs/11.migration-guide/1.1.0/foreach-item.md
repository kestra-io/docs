---
title: ForEachItem now starts iteration at 0 instead of 1
icon: /docs/icons/migration-guide.svg
release: 1.1.0
editions: ["OSS", "EE"]
---

## Breaking change

`ForEachItem` now starts iteration at 0 instead of 1 to align with the iteration starting value of `ForEach`.
If you use {{taskrun.iteration}} in your flow with a `ForEachItem` the starting value is now 0 instead of 1.
