---
title: Elasticsearch indexer
icon: /docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---

Migration guide for the Elasticsearch indexer

## Overview

Starting with 0.20, if you are using the Kafka backend, there is no need to start an external indexer, even for the Kafka backend, as the webserver will start an embedded indexer automatically.

However, if you still want to start one, it is still possible to do so, and you can disable the webserver-embedded indexer by starting it with `--no-indexer`.

Starting an extra indexer should only be needed for very high throughput when you want the UI to be updated with very low latency about execution information. Most of the time, the webserver embedded indexer should be enough.
