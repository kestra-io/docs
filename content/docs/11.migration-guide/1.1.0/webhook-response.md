---
title: Webhook Execution API Return Type Changed
icon: /docs/icons/migration-guide.svg
release: 1.1.0
editions: ["OSS", "EE"]
---

## Overview

The return type of the Webhook Execution API endpoint has been updated from a **typed response** to a **generic response** to support broader use cases and improve extensibility.

**What changed:** The API method previously returned a strongly typed `WebhookResponse` object. It now returns a generic HTTP response body (`HttpResponse<?>`).

**Impact:** Any custom integrations, SDK consumers, or extensions that previously relied on the `WebhookResponse` type in the response body will need to adjust their handling logic:
* Direct access to `WebhookResponse` methods or fields will no longer compile.
* You must handle the response body dynamically and verify its type at runtime if necessary.

**Migration:**
* Treat the HTTP response body as a generic object.
* Add runtime type checks before casting if your code depends on specific response fields.
* Update any logic that assumes a fixed `WebhookResponse` structure.

This change ensures greater flexibility in future webhook response handling but requires updates to any consuming code that previously depended on a fixed response type.
